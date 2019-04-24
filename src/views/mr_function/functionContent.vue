<template>
    <div id="friendContent" class="main-body"  ref="friendContent">
        <div class="content"  v-loading="loading" style="background:#fff;">
            <div class="page-title" style="padding:50px 110px 0px;background:#fff;">
                <span>朋友圈内容</span>
            </div>
            <div class="content">
              <div class="searchHead" style="margin:0px 110px 0px;">
                <el-select class="ele-select" v-model="accountValue" placeholder="微信号" @change="getFreindList">
                  <el-option
                    v-for="(item,index) in AccountList"
                    :key="index"
                    :label="item.nickname"
                    :value="item.wx_user_id">
                  </el-option>
                </el-select>
                <el-select class="ele-select" v-model="friendValue" placeholder="好友昵称" @change="getFriendCircle">
                  <el-option
                    v-for="(item,index) in FriendsList"
                    :key="index"
                    :label="item.nick_name"
                    :value="item.wx_contact_id">
                  </el-option>
                </el-select>
              </div>
              <ul class="friendSelect">
                <li v-for="(item,index) in tableData" :key="item.index" class="friendInfo">
                  <div class="titleImage"><img :src="item.smallHead"><span>{{item.nickName}}</span></div>
                  <p v-if="item.text!=''" style="color:#888;font-size:16px;" class="descriptionText"><span v-html="item.text"></span></p>
                  <video v-if="item.type==15" :src="item.video[0]" controls="controls"></video>
                  <div class="imgWrapper">
                    <div class="imgBox1" v-if="item.originalImgs.length==1" v-for="(img,index) in item.originalImgs" :key="index"><img  :onerror="defaultImg"  @click="handleImgShow(item,index)"  :src="img" alt=""  class="img1"/></div>
                    <div class="imgBox2" v-for="(img,index) in item.originalImgs" v-if="item.originalImgs.length==2||item.originalImgs.length==4" :key="index"><img  :onerror="defaultImg4" @click="handleImgShow(item,index)"  :src="img" alt=""  class="img4"/></div>
                    <div class="imgBox3" v-for="(img,index) in item.originalImgs" v-if="item.originalImgs.length>4||item.originalImgs.length==3" :key="index"><img  :onerror="defaultImg" @click="handleImgShow(item,index)"  :src="img" alt=""  class="img5"/></div>
                  </div>
                  <p v-if="item.type==3" style="background:rgba(234, 234, 234, 1.43);padding:5px;">
                    <img :src="item.linkHead" class="linkHead">
                    <a :href="item.url[0]" style="color: dodgerblue;" target="_blank">{{item.linktitle}}</a></p>
                  <p v-if="item.type==5" style="background:rgba(234, 234, 234, 1.43);padding:5px;">
                    <img :src="item.linkHead" class="linkHead">
                    <a :href="item.url[0]" style="color: dodgerblue;" target="_blank">{{item.linktitle}}</a></p>
                  <p v-if="item.type==4">
                    <img :src="item.musicImg" class="linkHead">
                    <a :href="item.music[0]" style="color: dodgerblue;" target="_blank">{{item.musicName}}</a>　　　　{{item.singer}}————{{item.appName[0]}}</p>
                  <p class="friendCircleDate"><span>{{item.date}}</span></p>
                  <p class="takeGood">
                    <i style="margin-right:15px;cursor:pointer" @click="handleLikeTask(item,index)">
                      <img v-if="!item.likeIndex" src="../../assets/images/zan.png" style="margin-right:5px;">
                      <img v-if="item.likeIndex" src="../../assets/images/like.png" style="margin-right:5px;">
                      赞
                    </i>
                    <i style="cursor:pointer;" @click="handleForward(item)"><img src="../../assets/images/forward.png" style="margin-right:5px;">转发</i>
                  </p>
                  <div class="likeComment" v-if="item.likeList.length>0">
                    <img  style="margin-right:5px;" src="../../assets/images/like.png" alt=""> <span v-for="(likeItem,likeIndex) in item.likeList" :key="likeIndex"> <em v-if="likeItem.itype==1">{{likeItem.nick_name}},</em></span>
                  </div>
                  <ul class="comments">
                    <li v-for="(commentsItem,commentsIndex) in item.comment" v-if="commentsItem.itype==2" :key="commentsIndex"><em><i>{{commentsItem.nick_name}}:</i><span v-html="commentsItem.content"></span></em></li>
                  </ul>
                  <div  class="chat_editor" style="border:1px solid #ccc;position:relative;margin-bottom:20px;">
                    <div  :id='"editorTitle"+ item.index'  class="toolbar" style="background:#ddd;height:36px;"></div>
                    <div  :id='"editorContent"+item.index' class="text" style="height: 80px;overflow-y:auto;"></div>
                    <el-button type="primary" style="position:absolute;right:5px;bottom:5px;font-size:12px;padding:5px 10px;z-index:9" @click="handleComments(item,index)">发送</el-button>
                  </div>
                </li>
              </ul>
              <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="total">
                </el-pagination>
              </div>
            </div>
            <!-- 放大图片 -->
            <transition-group name="fade">
              <div class="bounced" v-show="centerDialogVisible" :key="1">
                <div class="mask" ></div>
                <div class="big-pic" @click="closeSrcImg" >
                    <img :src="imgSrc" @error="loadErr" alt="" class="imgSrcWrapper">
                </div>
              </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import wangEditor from "wangEditor"
import face from "../../assets/face.json"
import errImg from "../../assets/imgFail.svg"
export default {
    data() {
        return {
            friendUserId:'',
            centerDialogVisible:false,
            imgSrc:"",
            editor:[],
            editor0:null,
            editor1:null,
            editor2:{},
            editor3:{},
            editor4:{},
            editor5:{},
            editor6:{},
            editor7:{},
            editor8:{},
            editor9:{},
            face:face,
            AccountList:[],
            FriendsList:[],
            friendValue:'',
            accountValue:'',
            value: '',
            tableData:[],
            likeTemplateId:'',
            commentsTemplateId:'',
            account_list:[],//执行任务账号
            snsList:[],
            editorArr:[],
            snsText:"",
            currentPage1:1,
            total:0,
            random:'',
            popupStandbyImg:"",
            defaultImg: 'this.src="' + require('../../assets/imgFail.svg') + '",style="width:200px;height:200px;"',
            defaultImg4: 'this.src="' + require('../../assets/imgFail.svg') + '",style="width:200px;height:200px;margin-top:40px;"',
            loading:true,
            defaultStandbyImg:'this.src="' + require('../../assets/imgFail.svg') + '"',
            userId:""
        };
    },
    mounted(){
        this.getAccountList()
        this.getTaskTemplate();
    },
    methods: {
        loadErr(){
          this.imgSrc=errImg;
        },
        scrollTop(){
          this.$nextTick(()=>{
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(document.body.scrollTop){
                document.body.scrollTop=0;
              }else if(document.documentElement.scrollTop){
                document.documentElement.scrollTop=0;
              }
          })
        },      
        //弹窗图片404时，使用小图
        getPopupStandbyImg(){
        this.defaultImg= 'this.src="' + require('../../assets/imgFail.svg') + '"';
        },
        //当原图为404时，使用小图
        standbyImg(item,index){
            return 'this.src="'+item.imgs[index]+'"';
        },
        //关闭朋友圈图片
        closeSrcImg(){
             this.centerDialogVisible = false;   
        },
        //点击显示朋友圈图片
        handleImgShow(item,index){
            let _this=this;
            let imgSrc=item.originalImgs[index];
            let img=new Image();
            img.src=imgSrc;
            img.onload=function(){
              _this.imgSrc = imgSrc;
              _this.centerDialogVisible = true;
            }
        },
        //分页
         handleCurrentChange(val) {
            this.currentPage1 = val;
            this.loading = true;
            this.getCircleFriendsInfo(this.accountValue);
        },
        getFriendCircle(){
            this.loading = true;
            this.currentPage1=1;
            var csStandbyNickname=this.accountValue;
            if(!this.friendValue){
               csStandbyNickname=this.accountValue;
            }
            this.getCircleFriendsInfo(csStandbyNickname);
        },
        //点赞
        handleLikeTask(item,index){
            this.account_list.push(item.wxUserId);
            this.snsList.push(item.id)

            this.$http("task/create_task", "POST", {
                    task_template_name: "朋友圈点赞",
                    account_list: this.account_list,
                    task_template_id: this.likeTemplateId,
                    enum_wxaccount_source: 2,
                    param:JSON.stringify({"snsList":this.snsList}),
                    userId:this.userId
                }).then(res => {
                this.account_list=[];
                this.snsList = [];
                if (res.data.error_code == 0) {
                    item.likeIndex=true;
                    this.$message({
                        message: "点赞成功",
                        type: "success"
                    });
                } else {
                    this.$message({
                    message: "执行失败:" + res.data.error_message,
                    type: "error"
                    });
                }
                }).catch(err => {
                this.$message({
                    message: "执行失败:" + res.data.error_message,
                    type: "error"
                });
            });
        },
        //评论
        handleComments(item,index){
            var text = this.editor[index].txt.getJSON();
            this.snsText="";
            text.map((mItem,mIndex)=>{
                text[mIndex].children.forEach(item=>{
                    if(typeof(item)=="object"){
                        if(item.tag=="img"){
                            item.attrs.forEach(childItem=>{
                                if(childItem.name == "alt"){
                                    this.snsText+=childItem.value
                                }
                            })
                        }else if(item.tag =="span"){
                            this.snsText+=item.children[0]
                        }
                    }else{
                        this.snsText+=item
                    }
                })
            })
            if(this.snsText=="" || this.snsText.trim().length==0){
                 this.$message({
                    message: "请输入合法内容",
                    type: "error"
                });
                return false;
            }
            this.snsList=[];
            this.account_list=[];
            this.account_list.push(item.wxUserId);
            this.snsList.push(item.id);

          
             this.$http("task/create_task", "POST",
               {
                task_template_name: "朋友圈评论",
                account_list: this.account_list,
                task_template_id: this.commentsTemplateId,
                enum_wxaccount_source: 2,
                param:JSON.stringify({"snsId":this.snsList,"snsText":this.snsText}),
                userId:this.userId
            })
                .then(res => {
                if (res.data.error_code == 0) {
                     this.snsList=[];
                     this.account_list=[];
                    this.$message({
                        message: "评论成功",
                        type: "success"
                    });

                    this.editor[index].txt.html('<p><br></p>');
                    this.AccountList.forEach(childItem=>{
                        if(childItem.wx_user_id==this.accountValue){
                            let newComment = {};
                            newComment.itype = 2;
                            newComment.content = this.snsText;
                            newComment.nick_name = childItem.nickname;
                            //评论转为表情
                             var imgLength = newComment.content.split('[').length-1;
                            for(var i =0;i<imgLength;i++){
                                    face.forEach((imgItem,index)=>{
                                    if(newComment.content.indexOf(imgItem.value)!=-1){
                                        newComment.content = newComment.content.replace(imgItem.value,"<img src='"+imgItem.src+"'/>");
                                    }
                                })
                            }
                            item.comment.push(newComment)
                        }
                    })
                } else {
                    this.$message({
                    message: "评论失败:" + res.data.error_message,
                    type: "error"
                    });
                }
                })
                .catch(err => {
                this.$message({
                    message: "评论失败:",
                    type: "error"
                });
                })
        },
        //转发
        handleForward(item){
            let t = JSON.stringify(item)
            if(item.type==3||item.type==4||item.type==5||item.type==15){
                this.$message({
                    message: "抱歉！视频/音乐/链接暂不支持转发",
                    type: "error"
                });
            }else{
                this.$router.push({path:'mr_functionTake', query:{id:2,info:JSON.stringify(item)}})
            }
        },
        //获取好友列表
        getFreindList(){
             this.AccountList.map(item=>{
                 if(item.wx_user_id==this.accountValue){
                     this.userId = item.userId;
                 }
             })
             this.loading = true;
             this.$http("get_friends","POST",{
                  pageNo: 1,
                  length: 9990,
                  wxUserName: "",
                  contactWxUserName: "",
                  wx_user_id:this.accountValue,
        }).then(res=>{
                    this.loading = false;
                    let data  = res.data.data;
                    let firstInfo={};
                    firstInfo.nick_name="朋友圈展示";
                    firstInfo.wx_contact_id = "";
                    firstInfo.contact_wxuser_name=this.accountValue;
                    this.FriendsList=data.result;
                    this.FriendsList.unshift(firstInfo);
                    this.friendValue="";
                    let standbyNickname=this.accountValue;
                    if(this.friendValue!=""){
                        standbyNickname=""
                    }
                    this.getCircleFriendsInfo(standbyNickname);
                }).catch(err=>{

                })
        },
        getTaskTemplate(){
             this.$http("task_template?page=1&per_page=100000", "GET")
            .then(res => {
            if (res.data.error_code == 0) {
               let data = res.data.data;
               data.result.forEach(item=>{
                   if(item.task_template_name=="朋友圈点赞"){
                       this.likeTemplateId = item.task_template_id;
                   }
                   if(item.task_template_name=="朋友圈评论"){
                       this.commentsTemplateId = item.task_template_id;
                   }
               })
            } else {
                this.$message({
                message: "获取任务模板失败:" + res.data.error_message,
                type: "error"
                });
            }
            })
            .catch(err => {
                this.$message({
                    message: "获取任务模板失败:" + res.data.error_message,
                    type: "error"
                });
            });
        },

        //账号
        getAccountList(){
            this.$http("wx_wxuser_list","POST",{
                    loginTime: "", 
                    group_name: "",
                    is_online: 1, 
                    user_name: "",
                    page: 1,
                    limit: 99999,
                    wx_user_id: ""
        }).then(res=>{
                    let data  = res.data.data;
                    this.loading = false;
                    this.AccountList = data.result;
                    this.userId = this.AccountList[0].userId;
                    if(this.$route.query.id=='4'){
                        let Info = JSON.parse(this.$route.query.info);
                       this.accountValue= Info.wx_user_id;
                    }else{
                        if(this.AccountList.length>0){
                            this.accountValue = this.AccountList[0].wx_user_id;
                        }
                    }
                    if(this.AccountList.length>0){
                        this.getFreindList();
                    }
                     
                }).catch(err=>{

                })
        },
        //富文本编辑器
        getWangeditor(index){
            let id = this.currentPage1*this.random+index;
             this.editor[index]={};
              this.editor[index] = new wangEditor('#editorTitle'+id,'#editorContent'+id);
                this.editor[index].customConfig.zIndex = 1;
                this.editor[index].customConfig.menus = [
                    'emoticon'
                ];
                this.editor[index].customConfig.showLinkImg = false;
                this.editor[index].customConfig.uploadImgShowBase64 = true;
                this.editor[index].customConfig.emotions = [
                    {
                        title: '默认表情',
                        type: 'image',
                        content:face,
                        size:'6'
                    }
                ]
                this.editor[index].create();
        },
        getCircleFriendsInfo(wxUserId) {
            this.editor = [];
              this.$http("wx_sns_message/","GET",{
          pageNo:this.currentPage1,
                    length:10,
                    nickName:"",
                    userId:this.userId,
                    wxContactId:this.friendValue,
                    wxUserId:wxUserId
        })
        .then(
        res=>{
          if(res.data.error_code==0){
                        this.loading = false;
                        this.random=parseInt(Math.random()*100000000);
                        let data = res.data.data;
                        this.tableData=[];
                        this.total= data.total_count;
                        if(data.result.length>0){
                            if(this.friendValue!=""){
                                this.friendUserId = this.friendValue;
                            }else{
                                this.friendUserId = this.accountValue;
                            }
                            data.result.forEach((item,index) => {
                                
              let a = item.description;
              let b=a.replace('<>','')
                            let c=b.replace('</>','');
              var jsonObj = this.$x2js.xml2js(c);
               if(jsonObj==null){
                   return false;
               }
                            let d = {};
              var friendsInfo=d;
              friendsInfo.tabids = 'tabereditor' + index
              friendsInfo.contentids = 'content' +index
              friendsInfo.userName = item.userName;
                            friendsInfo.nickName = item.nickName;
                            friendsInfo.index = this.currentPage1*this.random+index;
              friendsInfo.text="";
                            friendsInfo.imgs=[];
                            friendsInfo.originalImgs=[];
              friendsInfo.video=[];
              friendsInfo.url=[];
              friendsInfo.music=[];
              friendsInfo.appName=[];
                            friendsInfo.type="";
                            friendsInfo.wxUserId=item.wxUserId;
                            friendsInfo.smallHead=item.smallHead;
                            friendsInfo.id=jsonObj.TimelineObject.id;
                            friendsInfo.comment = [];
                            friendsInfo.likeList = [];
                            friendsInfo.likeIndex = false;
                            let contentDesc = jsonObj.TimelineObject.contentDesc;
                            //朋有圈内容转为表情
                            if(contentDesc.length>0){
                                var imgLength = contentDesc.split('[').length-1;
                                if(imgLength>0){
                                     for(var i =0;i<imgLength;i++){
                                            face.forEach((imgItem,index)=>{
                                            if(contentDesc.indexOf(imgItem.value)!=-1){
                                                contentDesc = contentDesc.replace(imgItem.value,"<img src='"+imgItem.src+"'/>");
                                            }
                                        })
                                    }
                                }
                            }
                            
                            friendsInfo.text = contentDesc;
                                let reg=new RegExp(/[\x0A\s]/,"g")
                                item.comment = item.comment.replace(reg," ");
                                if(Array.isArray(JSON.parse(item.comment))){
                                    JSON.parse(item.comment).forEach(item=>{
                                        if(item.itype=='1'){//赞
                                            friendsInfo.likeList.push(item)
                                        }else if(item.itype=='2'){//评论
                                        var imgLength = item.content.split('[').length-1;
                                        for(var i =0;i<imgLength;i++){
                                                face.forEach((imgItem,index)=>{
                                                if(item.content.indexOf(imgItem.value)!=-1){
                                                    item.content = item.content.replace(imgItem.value,"<img src='"+imgItem.src+"'/>");
                                                }
                                            })
                                        }
                                        friendsInfo.comment.push(item)
                                        }
                                    })
                                }
              function getLocalTime(nS) {     
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
              }
              friendsInfo.date = getLocalTime(jsonObj.TimelineObject.createTime)
              if(jsonObj.TimelineObject.ContentObject.contentStyle==1){
                friendsInfo.type=1;
                if(Array.isArray(jsonObj.TimelineObject.ContentObject.mediaList.media)){
                  jsonObj.TimelineObject.ContentObject.mediaList.media.forEach(item=>{
                        friendsInfo.imgs.push(item.thumb.__text);
                        friendsInfo.originalImgs.push(item.url.__text);
                  })
                }else{
                        friendsInfo.imgs.push(jsonObj.TimelineObject.ContentObject.mediaList.media.thumb.__text)
                            friendsInfo.originalImgs.push(jsonObj.TimelineObject.ContentObject.mediaList.media.url.__text);
                }
                            }
                            
                            else if(jsonObj.TimelineObject.ContentObject.contentStyle==15){
                  friendsInfo.type=15;
                  friendsInfo.video.push(jsonObj.TimelineObject.ContentObject.mediaList.media.url.__text);
              }else if(jsonObj.TimelineObject.ContentObject.contentStyle==3){
                  friendsInfo.type=3;
                  friendsInfo.url.push(jsonObj.TimelineObject.ContentObject.contentUrl)
                  friendsInfo.linktitle=jsonObj.TimelineObject.ContentObject.title;
                                    if(jsonObj.TimelineObject.ContentObject.mediaList){
                                        friendsInfo.linkHead = jsonObj.TimelineObject.ContentObject.mediaList.media.thumb.__text;
                                    }
              }else if(jsonObj.TimelineObject.ContentObject.contentStyle==4){
                                    friendsInfo.type=4;
                                    if(jsonObj.TimelineObject.ContentObject.title!=""){
                                        friendsInfo.musicName = jsonObj.TimelineObject.ContentObject.title;//qq音乐、网易云
                                    }else{
                                        friendsInfo.musicName = jsonObj.TimelineObject.ContentObject.mediaList.media.title;//酷狗
                                    }
                  friendsInfo.singer = jsonObj.TimelineObject.ContentObject.description;
                  friendsInfo.music.push(jsonObj.TimelineObject.ContentObject.contentUrl);
                  friendsInfo.appName.push(jsonObj.TimelineObject.appInfo.appName);
                                    friendsInfo.musicImg=jsonObj.TimelineObject.ContentObject.mediaList.media.thumb.__text;
              }else if(jsonObj.TimelineObject.ContentObject.contentStyle==2){
                  friendsInfo.type=2;
                            }else if(jsonObj.TimelineObject.ContentObject.contentStyle==5){
                                    friendsInfo.type=5;
                                    //链接复制
                                    friendsInfo.url.push(jsonObj.TimelineObject.ContentObject.contentUrl)
                                    friendsInfo.linktitle=jsonObj.TimelineObject.ContentObject.title;
                                    friendsInfo.text = jsonObj.TimelineObject.contentDesc;
                                    if(jsonObj.TimelineObject.ContentObject.mediaList){
                                        friendsInfo.linkHead = jsonObj.TimelineObject.ContentObject.mediaList.media.thumb.__text;
                                    }
                            }else if(jsonObj.TimelineObject.ContentObject.contentStyle==7){
                                    friendsInfo.type=7;
                                    friendsInfo.text="设置朋友圈封面";
                                    friendsInfo.originalImgs.push(jsonObj.TimelineObject.ContentObject.mediaList.media.url.__text);
                            }
                            this.tableData.push(d);
                            setTimeout(()=>{
                                this.getWangeditor(index) 
                            },200)
                       });
                            this.scrollTop();
                        }else{
                            this.tableData = data.result;
                            this.total = data.total_count;
                        }              
          }
          else{
            this.$message({
                  message: '获取朋友圈失败',
                  type: 'error'
                });
          }
        }
        ).catch(
        err=>{
          this.$message({
                message: '获取朋友圈失败',
                type: 'error'
              });
        })
        }
    },
    
    watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": function(newValue,oldValue){
            if(oldValue.name=="mr_accountManage"){
                let Info = JSON.parse(this.$route.query.info)
                this.accountValue= Info.wx_user_id;
                this.getFreindList();
            }
        }
    }
};
  
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    #friendContent {
        .bounced{
            position: fixed;
            width: 100%;
            height: 100%;
            left:0;
            top:0;
            z-index: 1998;
            overflow: hidden;
            .big-pic{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0px);
                z-index: 100;


                background: white;
                img{

                    min-height: 400px;
                    max-height: 600px;
                    max-width: 1200px;
                    min-width: 400px;
                }
                .close-btn{
                    position: absolute;
                    right: 10px;
                    top:10px;
                    z-index: 10;
                    color:#fff;
                    cursor: pointer;
                    font-size: 20px;
                }
            }
        }
        .content {
            margin: 0 auto;
            .searchHead{
                overflow: hidden;
                padding-bottom: 20px;
                border-bottom: 1px solid #e8eff6;
                .el-button{
                    width: 90px;
                     height: 30px;
                    line-height: 0;
                    padding: 0;
                }

            }
            .title {
                margin-top: 30px;
                li {
                    float: left;
                    margin-left: 15px;
                }
            }
            .friendSelect {
                clear: both;
                margin: 0px auto 0px;
                .friendInfo{
                    margin-top: 20px;
                    padding:0px 110px 0px;
                    border-bottom:20px solid #e8eff6;
                }
                .friendInfo:last-of-type{
                     border-bottom:none;
                }
                .item-group{
                    margin-bottom: 20px;
                }
                .comments{
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                p{
                    margin:10px 0;
                    line-height: 24px;
                }
                video{
                    width: 500px;
                    height: 300px;
                }
                img{
                    margin-right: 20px;
                }
                .linkHead{
                    width: 30px;
                    height: 30px;
                    vertical-align: middle;
                    margin-right: 5px;
                }
                .likeComment{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 12px;
                   color: #409eff;
                   img,span{
                    vertical-align: middle;
                   }
                }
                p:nth-child(1){
                    line-height: 20px;
                   font-size:20px;
                   color:#333;
                }
                .titleImage {
                    position: relative;
                    img {
                        width: 40px;
                        height: 40px;
                        margin-right: 10px;
                    }
                    span {

                        position: relative;
                        top:-20px;
                        left:5px;
                        color: #409EFF;
                    }
                }
                .imgWrapper{
                    width: 600px;
                    display: flex;
                    flex-wrap: wrap;
                }
                .imgBox1{
                    min-width:200px;
                    min-height:200px;
                    overflow: hidden;
                }
                .imgBox{
                    height: 190px;
                    overflow: hidden;
                    img{
                        width: 190px;
                        position: relative;
                        top: -20%;
                        margin-right: 10px;
                        overflow: hidden;
                    }
                }
                .imgBox{
                    width:50%;
                    height:300px;
                    overflow: hidden;
                }
                .imgBox3{
                    height: 190px;
                    overflow: hidden;
                    width: 190px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                }
                .imgBox2{
                    width: 290px;
                    height: 290px;
                    overflow: hidden;
                    margin-right: 10px;
                    margin-bottom: 10px;
                }
                .img1{
                    width:1;
                    max-height: 420px;
                    max-width: 100%;
                }
                .img4{
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                }
                .img5{
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                }
                .friendCircleDate{
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #888;
                }
                .comments{
                    font-size: 12px;
                    color: #888;
                    background-color: #E8EFF6;  
                 li{
                    line-height: 25px;
                     padding-left: 8px;
                 }
                 i{
                    margin-right: 5px;
                     color: #409EFF;
                 }
                }
            }
            .contentImage {
                li {
                    float: left;
                    img {
                        width: 100px;
                        height: 100px;
                    }
                }
            }
            .takeTime {
                clear: both;
            }
            .takeGood {
                font-size: 12px;
                color:#888;
                clear: both;
            }
        }
        .el-pagination {
            display: inline-block;
            margin-bottom: 35px;
        }
        .pagination{
            margin-top: 60px;
            height: 80px;
        }
        .fade-enter-active{
            transition: opacity .5s;
        }
        .fade-leave-active {
            transition: opacity .1s;
        }
    		.fade-enter,
    		.fade-leave-to {
    			opacity: 0;
    		}
    }
</style>

