<template>
    <div id="qrcode">
      <div class="qrcode-group">
        <ul>
          <li v-for="(code,index) in showCodeList">
            <div class="code-pic" :class="[(code.checkStatus==1||code.isGroup)?'border-normal':'border-red']">
              <img :src="code.imgLink">
            </div>
            <div class="btn-group">
              <span v-if="code.codeTextStatus==1&&code.isQrcode" class="red">检测中</span>
              <span class="red" v-if="code.codeTextStatus==0||code.codeTextStatus==2||code.isGroup" @click="removeCodeItem(code,index)">删除</span>
              <span v-if="code.checkStatus==3" @click="checkCodeAgain(code)">重新检查</span>
              <span v-if="code.checkStatus==2" @click="refreshCode(code)">更新</span>
            </div>
            <p class="info" v-if="code.checkStatus==1||code.isGroup">{{code.roomName}}</p>
            <p class="info" :class="[{'red':!code.isQrcode&&!code.isGroup}]" v-if="!code.isQrcode&&!code.isGroup">无效二维码</p>
            <p class="info" :class="[{'red':code.checkStatus==3}]" v-if="(code.checkStatus!=1&&!code.isGroup)">{{code.checkStatus|formatStatus}}</p>
          </li>
        </ul>
        <div class="code-type">
          <span @click="showUpload">手动上传</span>或<span @click="showGroupList">选择系统二维码</span>
          <!--<el-button class="ele-btn check-code" :class="[codeTextStatus==1?'ele-disabled':'']" @click="checkCode">{{codeTextStatus | filterCheckText}}</el-button>-->
        </div>
      </div>
      <div class="group-total" v-if="showCodeList.length!=0">已上传<span>{{showCodeList.length}}</span>张二维码</div>

      <Dialog @callback="uploadCode" @cancelCallback="clearCodeList" v-if="dialogFlag=='upload'">
        <div class="dialog-content upload-code" slot="content" v-loading="!checkCodeFlag" element-loading-text="正在解析二维码,请稍后">
          <el-upload
            class="upload-demo"
            :limit="maxUpload"
            multiple
            :on-exceed="handleExceed"
            :auto-upload="true"
            :show-file-list="false"
            :on-change="codeListChange"
            :http-request="httpUpLoadRquest"
            :before-upload="beforeUpLoadImg"
            :file-list="fileList"
            action="http://172.16.0.31:8888/api/v1/file/upload"
            accept="image/jpg,image/jpeg,image/png">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip" style="line-height: 18px;margin-top: 8px">只能上传jpg/png文件，且单张不超过{{imgSize}}kb <br><span class="red">最多只允许上传{{maxUpload}}张图片<br>注：上传过程中浏览器客户端进行解析，最大耗时需数分钟左右，<br>请勿进行其他操作，避免浏览器崩溃</span></div>
          </el-upload>
          <div class="file-list" v-if="fileList.length!=0">
            <el-scrollbar class="scroll-bar">
              <ul>
                <li v-for="(file,index) in fileList">
                  <i class="el-icon-document"></i>
                  <span>{{file.name}}</span>
                  <i class="el-icon-plus el-icon-close" @click="removeCode(file)"></i>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </Dialog>

      <el-dialog title="群聊列表" :visible.sync="showGroupFlag" width="900px">
        <div class="search" style="margin-bottom: 20px">
          <el-input class="ele-input" v-model="searchForm.roomName" @change="initChatList" placeholder="请输入群聊名称" maxlength="16"></el-input>
          <el-date-picker
            class="ele-date-editor"
            v-model="searchForm.searchDate"
            type="daterange" range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="searchChat">
          </el-date-picker>
        </div>
        <el-table :data="codeGroupList" max-height="288" ref="groupList" @selection-change="handleItemGroupChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="群聊名称" width="280">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" :content="scope.row.roomName?scope.row.roomName:(scope.row.roomUserName?'未设置('+scope.row.roomUserName+')':'')" placement="bottom" effect="light" :offset="80">
                <span class="writeWrapper">{{scope.row.roomName?scope.row.roomName:(scope.row.roomUserName?'未设置('+scope.row.roomUserName+')':'')}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column property="roomOwnerNickName" label="群主">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" :content="scope.row.roomOwnerNickName" placement="bottom" effect="light" :offset="80">
                <span class="writeWrapper">{{scope.row.roomOwnerNickName}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column property="roomUserName" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.deleted|formatFlag}}</span>
            </template>
          </el-table-column>

          <el-table-column property="memberCount" label="人数"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="groupSizeChange"
            @current-change="groupPageChange"
            :current-page="groupPage"
            :page-sizes="groupPageSizes"
            :page-size="groupPageSize"
            layout="prev,pager,next,total,sizes"
            :total="groupPageTotal">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" class="ele-btn" @click="submitGroupCheck">确 定</el-button>
          <el-button class="ele-default" @click="showGroupFlag = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import Dialog from "@/components/dialog.vue";
    import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
    export default {
        name: "qrcode",
        components:{
          Dialog
        },
        data(){
          return{
            qrcodeList:[],
            maxUpload:998,
            fileList:[],
            showCodeList:[],
            uploadCodeList:[],
            checkCodeList:[],
            codeGroupList:[],
            submitCheckFlag:true,
            imgSize:500,
            checkUpload:true,
            checkCodeFlag:true,
            friendsList:[],
            showGroupFlag:false,
            searchForm:{
              roomName:"",
              searchDate:""
            },
            groupPageSizes:[10,20,50,100],
            groupPageSize:10,
            groupPageTotal:0,
            groupPage:1,
            checkCodeFlag:true,
            submitReplace:['data:image/jpg;base64,','data:image/png;base64,','data:image/jpeg;base64,','data:image/gif;base64,'],
            checkGroupIds:[]
          }
        },
        filters:{
          formatFlag(num) {
            switch (num * 1) {
              case 0:
                return "未解散";
                break;
              case 1:
                return "已解散";
                break;
              default:
                return "未知";
                break;
            }
          },
          formatStatus(status){
            switch (status*1) {
              case 1:
                return "检查成功";
                break;
              case 2:
                return "检查进行中";
                break;
              case 3:
                return "检查失败";
                break;
            }
          }
        },
        watch: {
          showCodeList: {
            handler(newValue, oldValue) {
              this.$emit("getCodeList",this.showCodeList);
            },
            deep: true
          }
        },
        computed:{
          ...mapState(["dialogFlag"]),
        },
        methods:{
          removeCode(file){
            this.fileList.splice(this.fileList.indexOf(file),1);
          },
          getObjectURL(file) { // 转换file为url
            var url = null;
            if (window.createObjectURL != undefined) {
              // basic
              url = window.createObjectURL(file);
            } else if (window.URL != undefined) {
              // mozilla(firefox)
              url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) {
              // webkit or chrome
              url = window.webkitURL.createObjectURL(file);
            }
            return url;
          },
          //群搜索
          initChatList(){
            let _this=this;
            _this.groupPage=1;
            _this.showGroupList();
          },
          searchChat(){
            let _this=this;
            _this.groupPage=1;
            if(this.searchForm.searchDate!=null){
              this.chatStartTime = this.searchForm.searchDate[0];
              this.chatEndTime = this.searchForm.searchDate[1];
            }else{
              this.chatStartTime = "";
              this.chatEndTime = "";
            }
            _this.showGroupList();
          },
          //选择群聊
          handleItemGroupChange(selection){
            let _this=this;
            let list=selection;
            let arr=[];
            list.map((v,k)=>{
              v.isGroup=true;
              arr.push(v.roomUserName);
            });
            _this.checkGroupIds=arr;
            _this.checkCodeList=list;
          },
          //系统群分页
          groupSizeChange(num){
            let _this=this;
            _this.groupPageSize=num;
            _this.showGroupList();
          },
          groupPageChange(page){
            let _this=this;
            _this.groupPage=page;
            _this.showGroupList();
          },
          //显示弹窗
          showModel(type,title,row,index){

          },
          //提交选择的群聊
          submitGroupCheck(){
            let _this=this;
            let arr=[];
            _this.checkCodeList.map((v,k)=>{
              arr.push(v.roomUserName);
            });
            _this.checkGroupIds=arr;
            _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
            _this.showGroupFlag=false;
          },
          codeListChange(file, fileList){

          },
          //批量检查二维码
          checkCode(){
            let _this=this;
            let showCodeList=_this.showCodeList;
            let codeUserMax=0;
            if(_this.showCodeList.length==0){
              _this.$message.warning("请上传群二维码");
              return;
            };
            showCodeList.map((v,k)=>{
              if(v.isQrcode&&v.checkStatus!=1){
                codeUserMax++;
              }
            });
            _this.codeUserMax=codeUserMax;
            if(codeUserMax>0){
              if(_this.submitCheckFlag){
                _this.submitCheckFlag=false;
                _this.showCodeUserList();
              }
            }else{
              _this.$message.warning("无有效手动上传的二维码需要检测");
            }
          },
          httpUpLoadRquest(file){

          },
          beforeUpLoadImg(file){
            let _this=this;
            let fileReader = new FileReader();
            let fileList=_this.fileList;
            let nameArr=[];
            let size=Math.ceil(file.size/1024);
            file.checkStatus=1.5;
            fileList.map((v,k)=>{
              nameArr.push(v.name);
            });
            if(nameArr.indexOf(file.name)==-1){
              _this.fileList.push(file);
            };
            // if(nameArr.indexOf(file.name)==-1&&size<=_this.imgSize){
            //   _this.fileList.push(file);
            // }
          },
          //显示上传图片
          showUpload(){
            let _this=this;
            _this.sizeMaxNum=0;
            if(!_this.submitCheckFlag){
              _this.$message.warning("正在检查群二维码，无法操作列表");
              return;
            }
            this.$store.dispatch("showDialog",{
              title:"手动上传二维码",
              flag:"upload",
              showCancel:true
            });
          },
          clearCodeList(){
            this.hideModel();
          },
          //单行选择好友
          handleItemFriendsChange(value){
            let _this=this;
            let ids=[];
            let list=value;
            list.map((v,k)=>{
              ids.push(v.contactWxUserName);
            });
            _this.tableCheckFriends=ids;
          },
          //显示群聊列表
          showGroupList(){
            let _this=this;
            let searchForm=_this.searchForm;
            let userId=sessionStorage.getItem("user_id")*1;
            let parmas={
              length: _this.groupPageSize,
              pageNo: _this.groupPage,
              userId:userId
            };
            if(searchForm.roomName){
              parmas.roomName=searchForm.roomName;
            };
            if(this.chatStartTime){
              parmas.startTime = this.chatStartTime;
              parmas.endTime = this.chatEndTime;
            }
            if(!_this.submitCheckFlag){
              _this.$message.warning("正在检查群二维码，无法操作列表");
              return;
            };
            _this.$http("task_chatroom/chatroom_task_list", "POST", parmas).then(res => {
              if (res.data.error_code == 0) {
                let total=res.data.data.totalCount;
                let list=res.data.data.result;
                let ids=_this.checkGroupIds;
                _this.codeGroupList =list.filter((v,k)=>{
                  let aTime=new Date(v.qrcodeRefreshTime).getTime();
                  let nTime=new Date().getTime();
                  let baseTime=7*24*60*60*1000;
                  let expireFlag=(aTime+baseTime-nTime)>=0?true:false;
                  v.imgLink="data:image/jpg;base64,"+v.qrcodeBase64;
                  v.sQrcode=v.roomQrcode;
                  v.codeTextStatus=0;
                  return v.deleted==0&&v.memberCount<40&&expireFlag;
                }) ;
                _this.showGroupFlag=true;
                _this.$nextTick(()=>{
                  _this.codeGroupList.map((v,k)=>{
                    if(ids.indexOf(v.roomUserName)!=-1){
                      _this.$refs.groupList.toggleRowSelection(v,true);
                    }
                  });
                  _this.groupPageTotal=total;
                });
              }else{
                _this.$message.error(res.data.error_message);
              }
            }).catch((err)=>{
              _this.$message.error("获取群聊列表失败");
            });
          },
          //移除选择二维码
          removeCodeItem(item,index){
            let _this=this;
            if(!_this.submitCheckFlag){
              _this.$message.warning("正在检查群二维码，无法操作列表");
              return;
            };
            if(item.checkStatus==1){
              _this.$store.dispatch("showDialog",{
                title:"删除",
                flag:"confirm",
                showCancel:false
              });
              _this.removeCodeItemInfo=item;
              _this.removeCodeIndex=index;
              return;
            }else{
              _this.delCodeItem(item,index);
            }
          },
          delCodeItem(item,index){
            let len=0;
            let _this=this;
            this.showCodeList.splice(index,1);
            if(this.uploadCodeList.indexOf(item)!=-1){
              this.uploadCodeList.splice(this.uploadCodeList.indexOf(item),1)
            };
            if(this.checkCodeList.indexOf(item)!=-1){
              let idx=this.checkCodeList.indexOf(item);
              this.checkGroupIds.splice(idx,1);
              this.checkCodeList.splice(idx,1);
            };
            this.showCodeList.map((v,k)=>{
              if(v.isQrcode){
                len++;
              };
            });
            _this.codeUserMax=len;
          },
          uploadCheckAgain(fileList,initFileList,lastArray){
            let _this=this;
            let handleLen=0;
            let newArr=[];
            let json={};
            let urlArr=[];
            initFileList.map((i,j)=>{
              if(i.isQrcode){
                if(!json[i.sQrcode]){
                  json[i.sQrcode]=1;
                  newArr.push(i);
                  urlArr.push(i.sQrcode);
                }else{
                  json[i.sQrcode]++;
                }
              };
            });
            initFileList.map((v,k)=>{
              let url=_this.getObjectURL(v);
              const codeReader = new ZXing.BrowserQRCodeReader();
              codeReader.decodeFromImage(undefined,url).then(result =>{
                handleLen++;
                v.checkFlag=true;
                if(result.text&&result.text.indexOf("https://weixin.qq.com/g")!=-1){
                  v.isQrcode=true;
                  v.sQrcode=result.text;
                }else{
                  v.isQrcode=false;
                };
                fileList[v.idx]=v;
                if(handleLen==initFileList.length){
                  let newArr3=[];
                  let json3={};
                  fileList.map((i,j)=>{
                    if(i.isQrcode){
                      if(!json3[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
                        json3[i.sQrcode]=1;
                        newArr3.push(i);
                      }else{
                        json3[i.sQrcode]++;
                      }
                    };
                  });
                  for(let key in json3){
                    if(json3[key]>1){
                      _this.$message.warning("存在相同二维码，系统直接过滤");
                    }
                  }
                  let forMatArr=[...lastArray,...newArr3];
                  if(forMatArr.length==0){
                    _this.$message.warning("无有效群二维码");
                  };
                  _this.uploadCodeList=[...lastArray,...newArr3];
                  _this.uploadCodeList.sort(_this.checkSort);
                  _this.fileList=_this.uploadCodeList;
                  _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
                  _this.hideModel();
                  _this.checkCodeFlag=true;
                };
              }).catch(err =>{
                v.checkFlag=true;
                v.isQrcode=false;
                handleLen++;
                if(handleLen==initFileList.length){
                  let newArr4=[];
                  let json4={};
                  fileList.map((i,j)=>{
                    if(i.isQrcode){
                      if(!json4[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
                        json4[i.sQrcode]=1;
                        newArr4.push(i);
                      }else{
                        json4[i.sQrcode]++;
                      }
                    };
                  });
                  for(let key in json4){
                    if(json4[key]>1){
                      this.$message.warning("存在相同二维码，系统直接过滤");
                    }
                  }
                  let forMatArr=[...lastArray,...newArr4];
                  if(forMatArr.length==0){
                    _this.$message.warning("无有效群二维码");
                  };
                  _this.uploadCodeList=[...lastArray,...newArr4];
                  _this.uploadCodeList.sort(_this.checkSort);
                  _this.fileList=_this.uploadCodeList;
                  _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
                  _this.hideModel();
                  _this.checkCodeFlag=true;
                };
              });
              v.imgLink=url;
              v.codeTextStatus=0;
            });
          },
          //上传二维码图片11
          uploadCode(){
            let _this=this;
            let fileList=_this.fileList;
            let arr=[];
            let len=0;
            let qrCodeArr=[];
            let handleLen=0;
            if(fileList.length==0){
              _this.$message.warning("请至少上传1张二维码!");
              return;
            };
            if(_this.sizeMaxNum>0){
              _this.$message.warning(""+_this.sizeMaxNum+"张二维码超过"+_this.imgSize+"kb，将自动过滤!");
            };
            let aDate=new Date().getTime();
            let newArr=[];
            let json={};
            let urlArr=[];

            fileList.map((i,j)=>{
              if(i.isQrcode){
                if(!json[i.sQrcode]){
                  json[i.sQrcode]=1;
                  newArr.push(i);
                  urlArr.push(i.sQrcode);
                }else{
                  json[i.sQrcode]++;
                }
              };
            });
            fileList=fileList.filter((v,k)=>{
              return !v.checkFlag;
            });
            if(_this.checkCodeFlag){
              if(fileList.length!=0){
                _this.checkCodeFlag=false;
                let checkQrcodeTotal=0;
                fileList.map((i,j)=>{
                  let url=_this.getObjectURL(i);
                  i.imgLink=url;
                  i.codeTextStatus=0;
                  qrcode.decode(url,i,j);
                  qrcode.callback = function(imgMsg,item,index){
                    item.checkFlag=true;
                    item.idx=index;
                    if(imgMsg&&imgMsg.indexOf("https://weixin.qq.com/g")!=-1){
                      item.isQrcode=true;
                      item.sQrcode=imgMsg;
                    }else{
                      item.isQrcode=false;
                      item.sQrcode="";
                    };
                    checkQrcodeTotal++;
                    if(checkQrcodeTotal==fileList.length){
                      let json3={};
                      let newArr3=[];
                      let initFileList=fileList.filter((f,l)=>{
                        return !f.isQrcode;
                      });
                      if(initFileList.length>0){
                        _this.uploadCheckAgain(fileList,initFileList,newArr);
                      }else{
                        fileList.map((i,j)=>{
                          if(i.isQrcode){
                            if(!json3[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
                              json3[i.sQrcode]=1;
                              newArr3.push(i);
                            }else{
                              json3[i.sQrcode]++;
                            }
                          };
                        });
                        for(let key in json3){
                          if(json3[key]>1){
                            _this.$message.warning("存在相同二维码，系统直接过滤");
                          }
                        }
                        let forMatArr=[...newArr,...newArr3];
                        if(forMatArr.length==0){
                          _this.$message.warning("无有效群二维码");
                        };
                        _this.uploadCodeList=[...newArr,...newArr3];
                        _this.uploadCodeList.sort(_this.checkSort);
                        _this.fileList=_this.uploadCodeList;
                        _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
                        _this.hideModel();
                        _this.checkCodeFlag=true;
                      }
                    };
                  };
                });
              }else{
                _this.uploadCodeList=newArr;
                _this.uploadCodeList.sort(_this.checkSort);
                _this.fileList=_this.uploadCodeList;
                _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
                _this.hideModel();
              };
            };
          },
          checkSort(a,b){
            //if((a.isQrcode&&a.codeTextStatus==2)&&(b.isQrcode&&b.codeTextStatus==2)){
            if(a.isQrcode&&b.isQrcode){
              if(a.checkStatus>b.checkStatus){
                return -1;
              }else{
                return 1;
              }
            }else{
              return "";
            }
          },
          handleExceed(){
            this.$message.warning("最多只允许上传"+this.maxUpload+"张二维码")
          },
          hideModel(){
            this.$store.dispatch("hideDialog");
          }
        }
    }
</script>

<style scoped lang="scss">
  @import "@/style/css/base.scss";
  #qrcode{
    .red{
      color:#f00;
    }
    .qrcode-group{
      border:solid 1px #eee;
      padding:10px;
      overflow: hidden;
      ul{
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        max-height: 310px;
        overflow-y: auto;
        li{
          margin-right:10px;
          margin-bottom: 10px;
          overflow: hidden;
          .code-pic{
            width: 100px;
            height: 100px;
            overflow: hidden;
            img{
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .code-pic.border-red{
            border:solid 1px #f00;
          }
          .code-pic.border-normal{
            border:solid 1px $t-color;
          }
          .btn-group{
            font-size: 13px;
            text-align: center;
            margin-top: 10px;
            span{
              margin:0 2px;
              color:#1585f9;
              cursor: pointer;
            }
          }
          .info{
            font-size: 12px;
            color:#409eff;
            text-align: center;
            margin-top: 10px;
          }
          .info.red{
            color:#f00;
          }
        }
      }
      .code-type{
        font-size: 14px;
        color:#333;
        line-height: 24px;
        span{
          color:#409eff;
          cursor: pointer;
          text-decoration: underline;
        }
        .check-code{
          margin-left: 20px;
        }
      }
    }
    .group-total{
      font-size: 14px;
      color:#666;
      margin:20px 0;
      span{
        color:$t-color;
      }
    }
    .upload-code{
      .file-list{
        width: 400px;
        height: 140px;
        margin:20px auto 0;
        overflow: hidden;
        border:solid 1px #eee;
        ul{
          padding:0 20px;
          overflow: hidden;
        }
        li{
          display: flex;
          margin:10px auto;
          span{
            flex:1;
            text-align: left;
            padding-left: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
          }
          .el-icon-close{
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover{
              color:$t-color;
            }
          }
        }
      }
    }
  }
</style>
