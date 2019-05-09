
<template>
	<div class="fansTask main-body">
		<div class="main-wrapper-type2">
			<!-- <el-button style="float:right;" type="text" @click="$router.push('/mr_addFan')">返回上一级</el-button> -->
			<div class="page-title">
				<span>加粉任务</span>
			</div>
			<div class="step" style="padding-top:20px;">
				<div class="step-text">第一步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>任务名称<i class="required">*</i></span>
						<el-input class="ele-input" v-model="taskName" placeholder="请输入任务名称"></el-input>
					</div>
				</div>
			</div>
			<div class="step">
				<div class="step-text">第二步：</div>
				<div class="step-info">
					<div class="step-top" @click="addFansAccount" style="display:inline-block;">
						<span>添加加粉账号<i class="required">*</i></span>
						<img src="../../assets/images/add.png" class="ml btn">
					</div>
					<div class="account-list">
						<el-scrollbar class="scroll-bar">
							<ul>
								<li v-for="item in showTableData" :key="item.index" class="nameShowCon">{{item.name || item.id}}</li>
							</ul>
						</el-scrollbar>
					</div>
				</div>
			</div>
			<div class="step">
				<div class="step-text">第三步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>选择号库<i class="required">*</i></span>
						<el-select class="ele-select" v-model="resourcesValue" clearable :disabled="disabled" @change="changeSelect"  @clear="clear" placeholder="请选择号库">
							<el-option
								v-for="item in resourcesOptions"
								:key="item.id"
								:label="item.groupName"
								:value="item.id">
							</el-option>
						</el-select>
					</div>
				</div>
			</div>
			<div class="step">
				<div class="step-text">第四步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>设置验证申请</span><span style="margin-left:14px;color:#409EFF;cursor: pointer;margin-right:20px;" @click="settingVerification">设置</span>
						<el-checkbox class="check" style="color:#888;" v-model="increaseNickName">增加对方昵称</el-checkbox>
					</div>

					<ul class="input-list">
						<li v-for="(item,index) in testInfo" :key="index">
							<!-- <el-checkbox class="check" style="color:#888;" v-model="item.addName">增加对方昵称</el-checkbox>+ -->
							<el-checkbox class="check" v-model="item.checked" @change="getChecked"></el-checkbox>
							<el-input style="margin-left: 0" class="ele-input" v-model="item.mation" :disabled="!item.checked" placeholder="请输入内容"></el-input>
							<img class="ml btn" v-if="testInfo.length>=2" @click="deleteItem(index)" src="../../assets/images/deleteTest.png" alt="" />
						</li>
					</ul>
					<div class="add-list" @click="add" style="display: inline-block">
						<img src="../../assets/images/addTest.png" alt="" class="mr btn"/>添加验证申请
					</div>
				</div>
			</div>
			<div class="step">
				<div class="step-text">第五步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>通过后自动打招呼</span>
					</div>
          <div class="add-type-list" style="margin-top: 10px;">
            <el-button :type="helloBtn.btnType" size="small" v-for="(helloBtn,index) in helloTab" :key="index" @click="createList(index)">+{{helloBtn.name}}</el-button>
          </div>
					<ul class="input-list">
						<li v-for="(item,index) in helloList" class="hello-li" :key="index">
							<el-input v-if="item.type==2" class="ele-input" style="margin-left:0" v-model="item.helloText" placeholder="请输入打招呼文字"></el-input>
              <el-upload :ref="'upload'+index" v-if="item.type!=2" :show-file-list="false" action="" :limit="1" :before-upload="checkUpLoadFile" :http-request="uploadHelloFile" :accept="item.type==1?'image/jpg,image/jpeg,image/png':'audio/amr'">
                <el-button :type="item.btnType" size="small" style="margin-left: 0" @click="fileBtnClick(index)" v-if="item.isUpload">{{item.type==0?"语音":"图片"}}已上传</el-button>
                <el-button :type="item.btnType" size="small" style="margin-left: 0" @click="fileBtnClick(index)" v-else>上传{{item.type==0?"语音":"图片"}}</el-button>
              </el-upload>
              <el-input v-if="item.type==0" class="ele-input time-input-num" v-model="item.time" placeholder="时长(单位:秒)" maxlength="3" @keyup.native="inputAudioTime($event,index)"></el-input>
              <img class="ml btn" @click="removeHelloItem(index)" src="../../assets/images/deleteTest.png"/>
						</li>
					</ul>
				</div>
			</div>
			<div class="step">
				<div class="step-text">第六步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>通过后自动打标签</span>
					</div>
				<el-select v-model="selectLabelValue" class="ele-input" style="margin-left:0" placeholder="请选择">
					<el-option label="不打标签" value=""></el-option>
					<el-option
						v-for="item in labelListData"
						:key="item.wxContactLabelId"
						:label="item.labelName"
						:value="item.wxContactLabelId">
					</el-option>
				</el-select>
				</div>
			</div>
			<!-- <div class="step" >
				<div class="step-text">第六步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>来源<i class="required">*</i></span>
					</div>
					<ul class="input-list">
						<li style="margin-bottom:0">
							<el-radio-group v-model="accountSource">
								<el-radio label="search">搜索</el-radio>
								<el-radio label="groupChat">群聊</el-radio>
								<el-radio label="addressList">通讯录</el-radio>
							</el-radio-group>
						</li>
					</ul>
				</div>
			</div> -->
			<!-- 新号-老号 -->
			<!-- <div class="step" >
				<div class="step-text">第六步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>账号类型选择</span>
					</div>
					<ul class="input-list">
						<li>
							<el-radio-group v-model="radioAccount" @change="seleceRadioHandler">
								<el-radio label="newAccount">新号</el-radio>
								<el-radio label="oldAccount">老号</el-radio>
							</el-radio-group>
						</li>
					</ul>
				</div>
			</div> -->
			<div class="step">
				<div class="step-text">第七步：</div>
				<div class="step-info">
					<div class="step-top">
						<span>高级参数设置<i class="required">*</i></span>
					</div>
					<ul class="parameter setParameter">
						<li>
							<div class="item">
								<span>1.任务执行时间</span>
								<el-time-picker
								    is-range
									:editable=false
								    v-model="timeValue"
								    range-separator="至"
									@change="timeChange"
								    start-placeholder="开始时间"
								    end-placeholder="结束时间"
								    placeholder="选择时间范围"
									class="picker-left ele-date-editor"
									>
								  </el-time-picker>
							</div>
							<!-- <p class="el-top">(每日加粉任务在指定时间内执行)</p> -->
						</li>
						<li >
							<div class="item">
								<span>2.单日提交申请最大限制</span>
								<el-input class="input_length" v-model="limitNum"  @blur="getLimit(1,$event)" placeholder="次数"></el-input>
								<!-- <el-input class="input_length" v-model="limitNum"  @input="getLimit" placeholder="次数"></el-input> -->
								<span>次<span style="font-size:12px;color:#888;vertical-align: middle;">(为了防止封号,新号建议申请次数3次,老号建议申请次数18次)</span></span>
							</div>
						</li>
						<li>
							<span>3.申请间隔</span>
							<el-input class="input_length" v-model="minTimeNumber" @blur="getMinTimeNumber($event)"></el-input> <i>~</i> <el-input class="input_length" @keyup.native="getMaxTimeNumber($event)" v-model="maxTimeNumber"></el-input>
							<span>秒内随机提交</span>
						</li>
						<li >
							<div class="item">
								<span>4.当日加粉频繁次数达到</span>
								<el-input class="input_length" v-model="limitNum1" @keyup.native="getLimit(2,$event)"  placeholder="次数"></el-input>
								<span>次停止加粉</span>
								<span>，加粉频繁第</span>
								<el-input class="input_length" v-model="limitNum2" @keyup.native="getLimit(3,$event)"  placeholder="次数"></el-input>
								<span>次后暂停加粉一次</span>
							</div>
						</li>
						<!-- <li style="margin-bottom:0">
							<div class="item">
								<span>5.加粉频繁第</span>
								<el-input class="input_length" v-model="limitNum"  placeholder="限制次数"></el-input>
								<span>次</span>
								<span style="font-size:12px;color:#888;">后暂停加粉</span>
							</div>
						</li> -->
					</ul>
				</div>
			</div>
			<div class="submit">
				<!-- <el-button type="primary" plain  @click="submitAddFans(1)">　提交加粉　</el-button> -->
				<el-button type="primary" class="ele-btn" @click="hostingClearFans">提交托管加粉</el-button>
				<el-button class="ele-default" @click="cancelAddFans">取消</el-button>
				<!--<div class="tip">提交托管加粉后，系统会每天自动下单加粉，用户只需在订单明细中查看加粉详情。</div>-->
			</div>
		</div>

		  <!-- 设置验证-->
			<Dialog @callback="submitVerification" v-if="dialogFlag == 'setting'">
				<div class="dialog-content setting-dialog" slot="content">
					<el-scrollbar class="scroll-bar">
						<ul class="input-list" style="text-align:left">
						<li v-for="(item,index) in testList" :key="index" style="margin-bottom:20px;">
							<el-checkbox class="check"  v-model="item.checked" @change="getDialogChecked(item,index)"></el-checkbox>
							<el-input class="ele-input" v-model="item.content"  placeholder="请输入内容"></el-input>
						</li>
					</ul>
					<div class="add-list" @click="dialogAdd" style="text-align:left;position:relative">
						<img src="../../assets/images/addTest.png" alt="" class="mr btn" style="margin-right:10px;display: inline-block; vertical-align: middle;"/>添加验证申请
					</div>
					</el-scrollbar>
				</div>
			</Dialog>
		<Dialog @callback="checkUser" v-if="dialogFlag=='user'">
			<div class="dialog-content dia-tree" slot="content" style="padding:30px 0 0;">
				<div class="tree">
          <div class="check-all" v-if="tableData.length!=0">
            <el-checkbox v-model="checkAllAccount" @change="toggleCheck">全选</el-checkbox>
          </div>
					<el-scrollbar class="scroll-bar" style="height:calc(100% - 20px);height:-webkit-calc(100% - 20px)">
						<el-tree
						:data="tableData"
						show-checkbox
						node-key="id"
						ref="diatree"
						@check="nodeClick"
						highlight-current
						:check-on-click-node="true"
						:props="defaultProps">
						</el-tree>
					</el-scrollbar>
				</div>
				<div class="total">当前已选账号{{selectNumber}}个</div>
			</div>
		</Dialog>
		<Dialog @callback="Trusteeship" v-if="dialogFlag=='submit'">
			<div class="dialog-content" slot="content">
				<p style="color:#f34f4f;text-align: left;">提交托管加粉时会剔除今日加粉操作频繁次数超过（包含）当日规定加粉频繁次数限制的用户</p>
				<p>提交后，系统会每天自动下单加粉，用户可下载任务报表查看加粉详情</p>
			</div>
		</Dialog>

	</div>
</template>

<script>
  import axios from 'axios'
	import Dialog from '../../components/dialog.vue'
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
  import base64 from "@/utils/base64.js"
  import {config} from "../../api/http.js";
	let startTime = new Date().getFullYear() + '-'+(new Date().getMonth() + 1)+''+ '-'+(new Date().getDate())+'' + '  '+('09:00:00')+''
	let endTime = new Date().getFullYear() + '-'+(new Date().getMonth() + 1)+''+ '-'+(new Date().getDate())+'' + '  '+('22:00:00')+''
	export default {
		components:{
			Dialog
		},
		data() {
			return {
				starTimeStamp:"",
				endTimeStamp:"",
				radioAccount:"newAccount",
				minTimeNumber: 3000,
				maxTimeNumber: 3600,
				appendValue:'',
				groupName:'',
				resourcesValue:'',
				resourcesRadio:'1',
				resourcesOptions:[],
				testInfo:[{
					addName:false,
					mation:''
				}],
				labelValue:'',
				labelOptions:[],
				timeValue:[startTime,endTime],
				fileList:false,
				taskName:'',
				userName:'',
				selectNumber:0,
				tableData:[],
				selectTableData:[],
				checkAll:false,
				isIndeterminate: false,
				phponeData:null,
				radio:1,
				input:15,
				fansTaskShow:false,
				checkedValidation:[],
				submitTaskShow:false,
				headers:{
		          'Content-Token':sessionStorage.getItem("token")
		       },
				uploadData:{
				groupId:''
				},
				test:false,
				disabled: false,
				disabledOne: false,
				postJson: false,
				limitNum: 3,
        limitNum1:"",
        limitNum2:"",
				transPost: false,
				templateId:[],
				task_Id: 0,
				nameShow:[],
				defaultProps:{
        	 	children: 'children',
					label: 'name'
				},
				nodeChildren: [],
				nodeParent: [],
				changeInputDis: [],
				testList:[],
				userId:'',
				testId:'',
				clickFlag:false,
				selectId:[],
				showIds:[],
				showTableData:[],
				showNumber:0,
				flag:"",
				adoptGreet: '',
				checkAllAccount:false,
				accountSource:"search",
				increaseNickName:true,
				labelListData:[],
				selectLabelValue:"",
        helloTab:[
          {name:"语音",btnType:"success"},
          {name:"图片",btnType:"warning"},
          {name:"文字",btnType:"danger"}
        ],
        btnTypeArr:["success","warning","danger"],
        helloList:[],
        editFileIndex:0
		};
		},
    computed:{
      ...mapState([
        'dialogFlag'
	  ]),
    },
		mounted() {
//			this.phponeData={token:sessionStorage.getItem('token')}
			this.getFriendInfo();
			this.getResourcesInfo();
			this.getTemplateId();
			this.getLabelList();
			// this.timeValue[0] = startTime
			// this.timeValue[1] = endTime
			this.starTimeStamp = new Date(this.times(startTime)).getTime();
			this.endTimeStamp = new Date(this.times(endTime)).getTime();
			this.limitNum1=this.limitNum;
      this.limitNum2=this.limitNum1-2;
		},
		methods: {
      inputAudioTime(val,index){
        let reg=/\D/g;
        let item=this.helloList[index];
        if(reg.test(val)){
					item.time=item.time.replace(reg,'');
					this.$set(this.helloList,index,item);
        }
      },
      fileBtnClick(index){
        this.editFileIndex=index;
      },
      uploadHelloFile(file){
        let size=file.file.size/1024;
        let name=file.file.name.split(".");
        let fileType=name[name.length-1];
        let imgArr=['jpg','jpeg','png'];
        let fileArr=["amr"];
        let index=this.editFileIndex;
        let cstr='upload'+index;
        let type=this.helloList[index].type;
        this.$refs[cstr][0].clearFiles();
        if(type==0){
          if(fileArr.indexOf(fileType)!=-1){
            if(size>2000){
              this.$message.warning("上传语音不能超过2M");
              return;
            };
          }else{
            this.$message.warning("上传文件格式不正确");
            return;
          };
        }else if(type==1){
          if(imgArr.indexOf(fileType)!=-1){
            if(size>500){
              this.$message.warning("上传图片超过500k");
              return;
            };
          }else{
            this.$message.warning("上传文件格式不正确");
            return;
          };
        };
        let formData = new FormData();
        formData.append('upload_files',file.file);
        let url=config.materTestUrl;
        axios.post(url+'file/uploads?group_id=0',formData).then((res)=>{
          if(res.status == 200) {
            let result=res.data[0].data.materialPath;
            let name=result.split("/")[1]+"/"+result.split("/")[2];
            let b = new base64();
            let str = url+result.split("/")[0]+"/"+b.encode(name);
            let item=this.helloList[index];
            item.file=str;
            item.isUpload=true;
            this.$set(this.helloList,index,item);
            this.$message.success("上传成功");

          }else {
            this.$message.error("上传失败");
          }
        });
      },
      checkUpLoadFile(file){

      },
      createList(index){
        let item={};
        let t1=0;
        let t2=0;
        let t3=0;
        this.helloList.map((v,k)=>{
          if(v.type==0){
            t1++;
          };
          if(v.type==1){
            t2++;
          };
          if(v.type==2){
            t3++;
          };
        });
        switch (index) {
          case 0:
            item={
              type:0,
              file:"",
              time:"",
              btnType:this.btnTypeArr[index]
            };
            if(t1<3){
              this.helloList.push(item);
            }else{
              this.$message.warning("最多只能上传3个语音");
            };
            break;
          case 1:
            item={
              type:1,
              file:"",
              btnType:this.btnTypeArr[index]
            };
            if(t2<3){
              this.helloList.push(item);
            }else{
              this.$message.warning("最多只能上传3张图片");
            };
            break;
          case 2:
            item={
              type:2,
              helloText:"",
              btnType:this.btnTypeArr[index]
            };
            if(t3<3){
              this.helloList.push(item);
            }else{
              this.$message.warning("最多发送3条文字消息");
            };
            break;
        };
      },
      removeHelloItem(index){
        this.helloList.splice(index,1);
      },
			getLabelList(){
				  this.$http('wx_contact_label/'+this.userId,"GET",{
    			}).then(res=>{
						if(res.data.error_code==0){
							this.labelListData = res.data.data;
						}else{
							this.$message.error(res.data.error_message);
						}
					}).catch(err=>{
						this.$message.error(err);
					})
			},
      getMinTimeNumber(e){
        let val=e.target.value*1;
        if(val<600){
          this.minTimeNumber=600;
        }
			},
			getMaxTimeNumber(e){
				let val = e.target.value*1;
				if(val>7200){
					this.maxTimeNumber = 7200;
				}
			},

			//  getLimit(val){
			// 	let reg=/\D/g;
			// 	let _this = this;
			// 	let value=val*1
			// 	if(reg.test(value)){
			// 		_this.limitNum=3;
			// 	}else if(value==0||value==""){
			// 		_this.limitNum=1;
			// 	};
			// 	_this.limitNum1=_this.limitNum;
			// 	if(_this.limitNum1-2<=0){
			// 		_this.limitNum2=""
			// 	}else{
			// 		_this.limitNum2=_this.limitNum1-2;
			// 	}
      // },
      getLimit(index,e){
        let _this=this;
        let val=e.target.value*1;
        let reg=/\D/g;
        switch (index) {
          case 1:
            if(reg.test(val)){
              _this.limitNum=3;
						};
						// console.log(val[0])
						if(val==0){
							_this.limitNum=1;
						}
						_this.limitNum=Number(_this.limitNum)
            // _this.limitNum1=_this.limitNum;
            // if(_this.limitNum1-2<=0){
            //   _this.limitNum2=""
            // }else{
            //   _this.limitNum2=_this.limitNum1-2;
            // }
            break;
          case 2:
            if(reg.test(val)||val==0){
              _this.limitNum1="";
            };
            if(val>_this.limitNum){
              _this.limitNum1=_this.limitNum;
						}
						// else{
							// console.log(_this.limitNum1)
              // if(_this.limitNum1-2<=0){
							// 	console.log('--')
              //   _this.limitNum2=""
              // }else{
              //   _this.limitNum2=_this.limitNum1-2;
              // }
            // }
            break;
          case 3:
            if(reg.test(val)||val==0){
              _this.limitNum2="";
						};
						if(_this.limitNum1>0){
							if(_this.limitNum1==1){
								_this.limitNum2='';
							}
							if(Number(_this.limitNum2)>=Number(_this.limitNum1)){
								_this.limitNum2=_this.limitNum1-1;
							}
						}else{
							if(Number(_this.limitNum2)>=Number(_this.limitNum)){
								_this.limitNum2=_this.limitNum-1;
							}
						}
						// if(_this.limitNum1>0&&val>_this.limitNum1){
						// 	console.log(1)
						// 	_this.limitNum2=_this.limitNum1;
						// }else{
						// 	console.log(2)
						// }
            // if(val>_this.limitNum1-2){
            //   if(_this.limitNum1-2<=0){
            //     _this.limitNum2=""
            //   }else{
            //     _this.limitNum2=_this.limitNum1-2;
            //   }
            // }
            break;
        }
      },
      getTotal(){
        let tableData=this.tableData;
        let total=0;
        for(let i=0;i<tableData.length;i++){
          for(let k=0;k<tableData[i].children.length;k++){
            for(let j=0;j<tableData[i].children[k].children.length;j++){
              total+=1;
            }
          }
        };
        return total;
      },
      toggleCheck(val){
        let flag=val;
        let tree=this.$refs.diatree;
        let idArr=[];
        this.selectTableData = []
        if(flag){
          tree.setCheckedNodes(this.tableData);
        }else{
          tree.setCheckedNodes([]);
        }
        let nodes = tree.getCheckedNodes(true);
        nodes.map((item,index)=>{
          idArr.push(item.id);
          this.selectTableData.push({
            id:item.id,
            index:index,
            name:item.name
          })
        });
        this.selectIds=idArr;
        this.selectNumber = this.selectTableData.length;
      },
			//新号，老号切换
			seleceRadioHandler(){
				if(this.radioAccount=='oldAccount'){
					this.limitNum = 18;
					this.minTimeNumber = 600;
					this.maxTimeNumber = 3600;
				}else{
					this.limitNum = 3;
					this.minTimeNumber = 3600;
					this.maxTimeNumber = 7200;
				}
			},
			checkUser(){
				this.showIds=this.selectIds;
				this.showTableData=this.selectTableData;
				this.showNumber=this.selectNumber;
				this.$store.dispatch("hideDialog");
			},
			nodeClick(node,b,c){ // 账号节点选择
				this.newFriend = []
				let nodesParent = this.$refs.diatree.getCurrentNode()
				let nodes = this.$refs.diatree.getCheckedNodes(true)
				let t = nodesParent;
				let idArr=[];
				this.selectTableData = []
				this.nodeChildren = nodes
				this.nickName = nodes
				nodes.map((item,index)=>{
					idArr.push(item.id);
					this.selectTableData.push({
						id:item.id,
						index:index,
						name:item.name
					})
				})
				this.selectIds=idArr;
				if(nodes.length==this.getTotal()){
					this.checkAllAccount=true;
				}else{
					this.checkAllAccount=false;
				}
        		this.selectNumber = this.selectTableData.length;
			},
			getTemplateId(){
				this.$http('task_template',"GET",{
					page:1,
					per_page:9999
				}).then(res=>{
					let data = res.data.data;
					this.templateId = data.result;
					data.result.map((item, index)=>{
						if(item.task_template_name == '批量加粉') {
							this.task_Id = item.task_template_id
						}
					})
				}).catch(err=>{
				})
			},
			appendResource(){
			},
			getResourcesInfo(){
				let data = {
					 pageNo:1,
					 length: 9999,
				}
				this.$http('phone_group/list','POST', data)
					.then(res=>{
			  			if(res.data.error_code==0){
			  				this.resourcesOptions = res.data.data.result;
			  			}else{
			  				this.$message({
					            message:'获取号库失败',
					            type:'error'
					        })
			  			}
			  		}).catch(err=>{
			  			this.$message({
				            message:'获取号库失败',
				            type:'error'
				        })
			  		})
			},
			getChecked(val){
			},
			add(){
				this.testInfo.push({

				})
			},
			//取消加粉
			cancelAddFans(){
				this.taskName='';
				// this.$router.push('/mr_fanTaskList');
				this.$router.push({path:'/mr_fanTaskList'});
			},
			//正则判断
			regExp(account){
				let regEngAndNumber=new RegExp("^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,12}$");
				if (!regEngAndNumber.test(account)) {
			    	this.$message({
							message: '请输入正确任务名称',
							type: "error"
						});
				}else{
					this.test=true;
				}
			},
			submitAddFans(tmp){
				this.regExp(this.taskName);
				if(this.test){
					if(this.selectTableData.length>0){
						if(this.fileList){
							this.test=false;
							this.uploadData.groupId = this.appendValue;
							this.$refs.upload.submit();
						}else if(this.postJson){
							this.postAddIng(tmp)
							this.transPost = false
						} else {
								this.$message({
								message: '请上传微信号',
								type: "error"
							});
								// this.uploadData.groupId = this.appendValue;
								// this.$refs.upload.submit();
						}
					}else{
						this.$message({
								message: '请选择加粉账号',
								type: "error"
						});
					}

				}
			},
			deleteItem(index) {
				this.testInfo.splice(index, 1)
			},
			//搜索
			searchAccount(){
				if(this.userName==''){
					this.$message({
			            message:'请输入用户名',
			            type:'error'
			          })
				}else{
					this.getFriendInfo();
				}

			},
			getSelectionChange(val){
				this.selectTableData = val;
				this.selectNumber = val.length;
			},
			selectionChange(){

			},
			//加粉账户
			getFriendInfo(){
          let _this=this;
          _this.$http("/group_wxuser_new", "GET",{
            addFrequently:1
          }).then(res => {
            let list = res.data.data.result;
            _this.tableData=list;
          }).catch(err => {
            console.log(err);
          });
		  		// this.$http('/group_wxuser','GET',).then(res=>{
		  		// 	this.friendNumber = res.data.data.accounts;
		  		//   	this.tableData = []
					// let data = res.data.data.result;
					// for(let i = 0; i< data.length;i++){
					// 	if(data[i].children !== undefined) {
					// 		if(data[i].children.length == 0) {
					// 	} else {
					// 		this.tableData.push(data[i])
					// 		// let node = this.$refs.tree.getHalfCheckedNodes();
					// 		// let keys = [];
					// 		// keys.push(data[i].id);
					// 		// this.$refs.tree.setCheckedKeys(keys)
					// 		}
					// 	}
					// }
		  		// }).catch(err=>{
          //
		  		// })
		  	},

			//上传成功
			onsuccess(response){
		      if(response.error_code == 0){
						this.disabled = true
						this.fileList = true
		        this.$message({
							message:'上传成功',
							type:'success'
						})
						// if(this.transPost) {
						// 	this.postAddIng(2)
						// } else {
						// 	this.postAddIng(1)
						// }
						this.postAddIng(this.task_Id);
		      }else{
		        this.$message({
							message:'上传失败',
							type:'error'
						})
		      }
				},
				removeFile() {
					this.disabled = false
					this.radio = 1
				},
			//上传之前
			beforeUpload(file){
				var $this = this;
				let flag = false;
				var isFILE;
				 if(file.type === 'text/plain'){
				 	flag = true;
				 	isFILE = file.type === 'text/plain';
				 }else if(file.type === 'application/vnd.ms-excel'){
				 	flag = true;
				 	isFILE = file.type === 'application/vnd.ms-excel';
				 }else if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
				 	flag = true;
				 	isFILE = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
				 }
				if (!flag) {
					this.$message.error('只能上传 txt或excel 格式!');
					return false;
				}
					this.fileList = true;
					this.disabled = true;

			},
			hostingClearFans(){
				//this.submitTaskShow =true;
        let reg=/\D+/g;
        let helloList=this.helloList;
        let aTotal=0,bTotal=0,cTotal=0,dTotal=0;
				this.maxTimeNumber = Number(this.maxTimeNumber);
				this.minTimeNumber = Number(this.minTimeNumber);
				if(this.taskName==""){
					this.$message.error("请填写任务名称！")
					return;
				}
				if(this.showTableData.length==0){
					this.$message.error("请添加加粉账号！")
					return;
				}
				if(this.resourcesValue==""){
					this.$message.error("请选择号库！")
					return;
				}
        if(this.timeValue==null){
          this.$message.error("请选择任务执行时间！")
          return;
        }
        if(this.limitNum==""){
          this.$message.error("请填写单日提交最大限制次数！")
          return;
        }
        if(this.limitNum==""){
          this.$message.error("请填写单日提交最大限制次数！")
          return;
        }
        if(reg.test(this.limitNum)){
          this.$message.error("单日提交最大限制次数只能是数字");
          return;
        }
        if(this.minTimeNumber==""){
          this.$message.error("请填写申请间隔开始区间！")
          return;
        }
        if(reg.test(this.minTimeNumber)){
          this.$message.error("申请间隔开始区间只能是数字");
          return;
        }
        if(this.maxTimeNumber==""){
          this.$message.error("请填写申请间隔结束区间！")
          return;
        }
        if(reg.test(this.maxTimeNumber)) {
          this.$message.error("申请间隔结束区间只能是数字");
          return;
        };
        if(this.maxTimeNumber<this.minTimeNumber) {
          this.$message.error("申请间隔结束区间不能小于开始区间");
          return;
				};
				if(Number(this.limitNum1)>Number(this.limitNum)||(Number(this.limitNum1)>0&&Number(this.limitNum1)==Number(this.limitNum2))||Number(this.limitNum2)>=Number(this.limitNum)||(Number(this.limitNum1)>0&&Number(this.limitNum2)>Number(this.limitNum1))||this.limitNum1===0||this.limitNum2===0){
					this.$message.error("请填写正确的暂停，停止加粉次数");
          return;
				}
        helloList.map((v,k)=>{
          if(v.type==0&&v.file==""){
            aTotal++;
          }
          if(v.type==1&&v.file==""){
            bTotal++;
          }
          if(v.helloText==""){
            cTotal++;
          }
          if(v.time==""){
            dTotal++;
          }
        });
        if(aTotal>0){
          this.$message.error("请上传打招呼语音");
          return;
        };
        if(bTotal>0){
          this.$message.error("请上传打招图片");
          return;
        };
        if(cTotal>0){
          this.$message.error("请输入打招呼文字");
          return;
        };
        if(dTotal>0){
          this.$message.error("请填写语音时长");
          return;
        };
				this.$store.dispatch("showDialog",{
					title:"托管加粉",
					showCancel:true,
          flag:"submit"
				})
			},
			addFansAccount(){
				//this.fansTaskShow=true;
				let _this=this;
				_this.selectNumber=_this.showNumber;
				_this.$store.dispatch("showDialog",{
					title:"添加账号",
					showCancel:true,
          flag:"user"
				})
				_this.$nextTick(()=>{
					_this.$refs.diatree.setCheckedKeys(_this.showIds);
          if(_this.showIds.length==this.getTotal()){
            this.checkAllAccount=true;
          }else{
            this.checkAllAccount=false;
          }
				})
			},
			clear() {
				this.disabledOne = false
			},
			changeSelect(val) {
				this.disabledOne= true
				this.postJson = true
				this.radio = 1
				this.appendValue = ''
			},
			postAddIng(tmp) { // 发起加粉任务
				let dataString = []
				let wxUserid = []
				let groupId = ''
				for(let i = 0; i< this.testInfo.length;i++) {
          if(this.testInfo[i].checked&&this.testInfo[i].mation){
            dataString.push(this.testInfo[i].mation)
          }
				};
				//验证分割
				// let standyDataString = dataString.join('|');
				// let standyDataString = JSON.stringify(dataString);


				for(let j = 0; j< this.selectTableData.length; j++) {
					wxUserid.push(this.selectTableData[j].id)

				}
				if(this.radio == 1) {
					groupId = this.resourcesValue
				} else {
					groupId = this.appendValue
				}
				//高级参数判断
				// if(this.radioAccount=='oldAccount'){
				// 	//判断单日提交数量
				// 	if(this.limitNum>18||this.limitNum<=0){
				// 		this.$message({
				//             message:'根据加粉规则你的设定无效请参考默认值',
				//             type:'warning'
				// 		})
				// 		this.limitNum = 18;
				// 	}
				// 	判断申请时间间隔
				// 	if(this.minTimeNumber<600 || this.maxTimeNumber>7200 || this.minTimeNumber>this.maxTimeNumber){
				// 		this.$message({
				//             message:'根据加粉规则你的设定无效请参考默认值',
				//             type:'warning'
				// 		})
				// 		this.minTimeNumber = 600;
				// 		this.maxTimeNumber = 7200;
				// 		return;
				// 	}
				// }else{
				// 	//判断单日提交数量
				// 	if(this.limitNum>3||this.limitNum<=0){
				// 		this.$message({
				//             message:'根据加粉规则你的设定无效请参考默认值',
				//             type:'warning'
				// 		})
				// 		this.limitNum = 3;
				// 	}
				// 	判断申请时间间隔
				// 	if(this.minTimeNumber<600 || this.maxTimeNumber>7200 || this.minTimeNumber>this.maxTimeNumber){
				// 		this.$message({
				//             message:'根据加粉规则你的设定无效请参考默认值',
				//             type:'warning'
				// 		})
				// 		this.minTimeNumber = 600;
				// 		this.maxTimeNumber = 7200;
				// 	}
				// }
        if(this.minTimeNumber<600 || this.maxTimeNumber>7200 || this.minTimeNumber>this.maxTimeNumber){
          this.$message({
            message:'根据加粉规则你的设定无效请参考默认值',
            type:'warning'
          })
          this.minTimeNumber = 600;
          this.maxTimeNumber = 7200;
          return;
        }
				//执行任务时间
				let selectStartTimeStamp = new Date(this.timeValue[0]).getTime();
				let selectEndTimeStamp = new Date(this.timeValue[1]).getTime();
        let helloList=this.helloList;
        let helloInit=[];
        helloList.map((v,k)=>{
          let json={
            type:v.type,
            info:v.file||v.helloText
          };
          if(v.time){
            json.time=v.time*1000;
          };
          helloInit.push(json);
        });
				//加粉规则无效，按默认规则
					// if(selectStartTimeStamp<this.starTimeStamp || selectEndTimeStamp>this.endTimeStamp){
					// 	this.$message({
					// 		message:'根据加粉规则你的设定无效请参考默认值',
					// 		type:'warning'
					// 	})
					// 	this.timeValue = [];
					// 	this.timeValue[0] = new Date().getFullYear() + '-'+(new Date().getMonth() + 1)+''+ '-'+(new Date().getDate())+'' + '  '+('09:00:00')+'';
					// 	this.timeValue[1] = new Date().getFullYear() + '-'+(new Date().getMonth() + 1)+''+ '-'+(new Date().getDate())+'' + '  '+('22:00:00')+'';
					// }
				if(selectStartTimeStamp<this.starTimeStamp || selectEndTimeStamp>this.endTimeStamp){
					this.$confirm('任务执行时间不在默认时间内，是否继续？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
             let tableData=this.tableData;
					let that=this;
          tableData.map((i)=>{
            i.children.map((j)=>{
              j.children.map((j)=>{
                if(wxUserid.indexOf(j.id)>-1){
                  if(j.oftenCount>=that.limitNum1&&that.limitNum1!=''){

                    wxUserid.splice(wxUserid.indexOf(j.id),1);
                  }
                }
              })
            })
					});
            if(wxUserid.length==0){
              that.$message.warning("频繁数据剔除后账号数量必须大于1,请重新选择加粉账号");
              return;
						};
						let data = {
						"endTime": this.times(this.timeValue[1]),
						"fatherPlanId": 0,
						'mode': 1,
						"enumWxaccountSource": 1,
						"planName": this.taskName,
						"startTime": this.times(this.timeValue[0]),
						"templateId": tmp,
						"remainDays": -1,
						"repeatDays": -1,
						"taskRepeatTimes":Number(this.limitNum),
						"wxGroupIds":'',
						"wxids": wxUserid.toString()
					}
					let planParams = { // 加粉高级参数
						"checkInfo": dataString,
						"minTimeInterval": this.minTimeNumber,
						"groupId": groupId,
						"maxTimeInterval": this.maxTimeNumber,
            			"maxTimes":this.limitNum1,
						"stopTimes":this.limitNum2,
						"increaseNickName":this.increaseNickName
					}

					if(this.selectLabelValue!=""){
						planParams['labelValue'] = this.selectLabelValue;
					}
          planParams["Info"] = helloInit;
					let params = JSON.stringify(planParams) // 新增的参数
					data["planParams"] = params;

					this.$http('plan/','POST',data).then((res)=>{
						if(res.data.error_code == 0) {
							this.$message({
								message:'提交成功',
								type:'success'
							})
							this.submitTaskShow = false
							this.$router.push({
								name:'mr_fanTaskList'
							})
							this.$store.dispatch("hideDialog");
						}else{
							this.submitTaskShow = false;
							this.$message({
								message:res.data.error_message,
								type:'error'
							})
						}
					}).catch(err=>{
							this.$message({
								message:'提交失败',
								type:'error'
							})
					})

					}).catch(() => {

					  });
				}else{
				  let tableData=this.tableData;
          let that=this;
          tableData.map((i)=>{
            i.children.map((j)=>{
              j.children.map((j)=>{
                if(wxUserid.indexOf(j.id)>-1){
                  if(j.oftenCount>=that.limitNum1&&that.limitNum1!=''){
                    wxUserid.splice(wxUserid.indexOf(j.id),1);
                  }
                }
              })
            })
          });
          if(wxUserid.length==0){
            that.$message.warning("频繁数据剔除后账号数量必须大于1,请重新选择加粉账号");
            return;
          };
					let data = {
						"endTime": this.times(this.timeValue[1]),
						"fatherPlanId": 0,
						'mode': 1,
						"enumWxaccountSource": 1,
						"planName": this.taskName,
						"startTime": this.times(this.timeValue[0]),
						"templateId": tmp,
						"remainDays": -1,
						"repeatDays": -1,
						"taskRepeatTimes":Number(this.limitNum),
						"wxGroupIds":'',
						"wxids": wxUserid.toString()
					};
					let planParams = { // 加粉高级参数
						"checkInfo": dataString,
						"minTimeInterval": this.minTimeNumber,
						"groupId": groupId,
						"maxTimeInterval": this.maxTimeNumber,
            "maxTimes":this.limitNum1,
						"stopTimes":this.limitNum2,
						"increaseNickName":this.increaseNickName
					}
					if(this.selectLabelValue!=""){
						planParams['labelValue'] = this.selectLabelValue;
					}
					planParams["Info"] = helloInit;
					let params = JSON.stringify(planParams) // 新增的参数
					data["planParams"] = params;

					this.$http('plan/','POST',data).then((res)=>{
						if(res.data.error_code == 0) {
							this.$message({
								message:'提交成功',
								type:'success'
							})
							this.submitTaskShow = false
							this.$router.push({
								name:'mr_fanTaskList'
							})
							this.$store.dispatch("hideDialog");
						}else{
							this.submitTaskShow = false;
							this.$message({
								message:res.data.error_message,
								type:'error'
							})
						}
					}).catch(err=>{
							this.$message({
								message:'提交失败',
								type:'error'
							})
					})
				}
			},
			radios() {
				this.radio = 2
				this.fileList = true
			},
			times (str) {
				let rexp ='[^0-9]'
				let date = new Date(str);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				let D = date.getDate() + ' ';
				let h = date.getHours() + ':';
				let m = date.getMinutes() + ':';
				let s = date.getSeconds();
				let hours = h.replace(/[^0-9]/ig, "")
				let minutes = m.replace(/[^0-9]/ig, "")
				if(hours < 10) {
					h = '0' + h
				}
				if(minutes < 10) {
					m = '0' + m
				}
				if(s < 10) {
					s = '0' + s
				}
				if(M < 10) {
					M = '0' + M
				}
				if(D <10) {
					D = '0' + D
				}
				return Y+M+D+h+m+s
			},
			selectList(){

			},
			timeChange(val){
				this.timeValue = val;
			},
			Trusteeship () {
				this.transPost = true;
				let taskId;
				this.templateId.forEach(item=>{
					if(item.task_template_name=="批量加粉"){
						taskId = item.task_template_id;
					}
				})
				this.submitAddFans(taskId)
			},
			//设置验证
			settingVerification(){
				this.testList = [];
				this.$http('user_setting','GET',{
					length:9999,
					pageNo:1,
					userId:sessionStorage.getItem('user_id')
				}).then(res=>{
			  			if(res.data.error_code==0){
							  if(res.data.data.result.length == 0){
								  this.testId = 0
							  }else{
								  this.testId = res.data.data.result[0].id
								  let list = res.data.data.result;
								let arr = list[0].content.split('^')
								for(let i=0;i<arr.length;i++){
									this.testList.push({
										content:arr[i]
									})
								}
							  }
						  }

			  		}).catch(err=>{
			  			this.$message({
				            message:'获取验证列表失败',
				            type:'error'
						})
					  })
            this.$store.dispatch("showDialog",{
              title:'设置验证',
              showCancel:true,
              flag:"setting"
            })
			},
			submitVerification(){
				let content = [];
				this.testList.map(item =>{
					content.push(item.content)
				})
				this.$http('addUserSetting','POST',{
					content:content.join('^'),
					settingType:'设置验证申请',
					userId:this.userId,
					id:this.testId
				}).then(res=>{
			  			if(res.data.error_code==0){
			  				this.$message({
					            message:'验证列表添加成功',
					            type:'success'
							})
							this.$store.dispatch('hideDialog')
			  			}
			  		}).catch(err=>{
			  			this.$message({
				            message:'验证列表添加失败',
				            type:'error'
						})
					  })
			},
			getDialogChecked(val,item,index){
				if(val.checked){
					if(this.testInfo[0].mation == ''){
						this.testInfo.splice(0,1)
					}
					this.testInfo.push({
						checked:val.checked,
						mation:val.content
					})
				}else{
					this.testInfo.splice(item+1,1)
				}
			},
			dialogAdd(){
				if(!this.clickFlag){
					this.testList.push({
						content:'',
						id:'',
						settingType:''
					})
					this.clickFlag=true;
				}else{
					let length = this.testList.length
					if(this.testList[length -1].content == ''){
						this.$message.error("请填写验证申请");
					}else{
						this.clickFlag=false;
						this.testList.push({
							content:'',
							id:'',
							settingType:''
						})
					}
				}
			},

		},
		created(){
			this.userId=sessionStorage.getItem("user_id");
		},
		components:{
    		Dialog
  		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "../../style/css/base.scss";
	.fansTask{
		.init-dialog{
			.dia-tree{
				padding-top: 30px;
				padding-bottom: 0;
        .check-all{
          text-align: left;
          padding:0 24px;
        }
				.tree{
					width: 400px;
					border: 1px solid #e5e5e5;
					height: 320px;
					margin:0 auto;
					font-size: 12px;
					overflow: hidden;
          display: flex;
          flex-direction: column;
				}
				.total{
					color:$t-color;
					margin-top: 20px;
					margin-bottom: 20px;
					font-size: 16px;
				}
			}
		}
		.step{
			overflow: hidden;
			margin-bottom: 30px;
			font-size: 14px;
			color:#888;
			.ml{
				margin-left: 10px;
			}
			.mr{
				margin-right: 10px;
			}
			.step-text{
				float:left;
				width: 70px;
				font-size: 14px;
				color:#666;
				line-height: 30px;
			}
			.step-info{
				padding-left: 70px;
				.btn{
					cursor: pointer;
				}
				.step-top{
					line-height: 30px;
				}
				span,img{
					display: inline-block;
					vertical-align: middle;
				}
				.ele-input,.ele-select,.ele-date-editor{
					margin-left: 20px;
				}
				.account-list{
					width: 450px;
					height: 150px;
					border:solid 1px #dcdfe6;
					padding:5px;
					box-sizing:border-box;
					border-radius: 4px;
					overflow-x:hidden;
					margin-top: 20px;
					ul{
						overflow: hidden;
						padding:0 5px;
					}
					li{
						font-size: 14px;
						line-height: 24px;
					}
				}
				.input-list{
					margin-top:20px;
					li{
						margin-bottom: 20px;
					}
          .hello-li{
            display: flex;
            align-items: center;
          }
				}
				.parameter{
					li{
						margin-bottom: 20px;
						.item{
							span{
								line-height: 30px;
							}
						}
					}
					p{
						font-size: 12px;
						color:#888;
						margin-top: 10px;
					}
				}
			}
		}
		.submit{
			padding-left: 70px;
		}
		.leftHead{
			width: 70px;
			display: inline-block;
			margin-right: 20px;;
		}
		.orderNumb{
			margin: 5px 0 20px;
			.el-input{
				width: 200px;
				 font-size: 12px;
			}
		}
		.top{
			position: relative;
			height:200px;
			em{
				display: inline-block;
				width: 120px;
				cursor: pointer;
				vertical-align: middle;
			}

			img{
				display: inline-block;
				vertical-align: middle;
				margin-left: 10px;
			}
		}
		.nameShowBox{
				width:450px;
				height:150px;
				border:1px solid #dcdfe6;
				border-radius: 4px;
				overflow: auto;
				margin: 20px 0 0 90px;
				.nameShowCon{
					display: inline-block;
					width:100%;
					height:20px;
					padding-left: 12px;

				}
			}
		.main_wrapper{
			margin-top: 10px;
				.el-radio{
					.el-select{
						width: 100px;
						margin-left: 10px;
					}
				}
				.el-radio:nth-of-type(2){
					margin-top: 15px;
					// margin-left: 95px;
				}
				.ps{
					font-size: 12px;
					color: #888;
					margin: 20px 0 8px 95px;
					line-height: 20px;
					.el-add-left{
						margin-left: 20px;
					}
					.el-select{
						width: 100px;
					}
					.el-input{
						width: 200px;
					}
					.margin10{
						margin: 0 20px;
					}
				}
				.el-textarea{
					width: 660px;
					margin-left: 90px;
				}
			.submit{
				margin-top: 40px;
				margin-left: 90px;
				.el-button{
					height: 30px;
					width: 90px;
					font-size: 12px;
					line-height: 0;
					padding: 0;
				}
			}
			.title{
				margin-top: 30px;
			}
			.setParameter{
				margin-left: 90px;
				.picker-left{
					margin-left: 20px;
				}
				li{
					margin-top: 20px;
				}
				.el-top{
					font-size: 12px;
					color:#888;
					margin-left: 10px;
					margin-top: 10px;
				}
			}
		}
		.modal{
			height: 20px;
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			overflow: hidden;
		}
		.camilo {
			width: 600px;
			// height: 570px;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -260px;
			margin-top: -280px;
			z-index: 15;
			background: #fff;
			box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
			border-radius: 5px;
			.modal-header {
				height: 56px;
				position: relative;
				padding: 10px 15px;
				background: #409eff;
				color: #fff;
				text-align: center;
				border-radius: 6px 6px 0 0;
				border-bottom: 1px solid #e5e5e5;
				h2 {
					font-size: 18px;
					position: relative;
					line-height: 33px;
					span {
						position: absolute;
						right: 0px;
						cursor: pointer;
						padding: 0px 10px;
						img{
							width: 25px;
							height: 25px;
							margin-top: 8px;
						}
					}
				}
			}
			.modal-body {
				padding: 40px 99px 0;
				line-height: 20px;
				text-align: center;
				color: #73879c;
				border-bottom: 1px solid #e5e5e5;
				.search{
					width:298px;
					margin: 0 auto;
					.typeBackground{
						background-color: #409EFF !important;
						border-color: #409EFF !important;
						color: #fff;
						border-radius: 0;
							float: right;
							height: 30px;
							width: 60px;
							font-size: 12px;
							line-height: 0;
							padding: 0;
					}
					.el-input{
						width: 298px;
						height: 30px;
						.el-input__inner{
							height: 30px !important;
						}
					}

				}
				.hosting{
					margin-top: 30px;
					font-size: 16px;
					line-height: 25px;
					padding: 5px 15px;
				}
				.content{
          width: 400px;
					height: 320px;
					margin:15px auto;
					border: 1px solid #e5e5e5;
					h3{
						line-height: 40px;
						border-bottom: 1px solid #e5e5e5;
					}
					.left{
						// width: 50%;
						height: 320px;
            // float: left;
            font-size: 12px;
						overflow: auto;
						// border-right: 1px solid #e5e5e5;
						// border-bottom: 1px solid #e5e5e5;
						ul>li{
							padding-left: 20px;
							text-align: left;
							line-height: 40px;
							border-bottom: 1px solid #e5e5e5;
						}
					}
					.right{
						width: 50%;
						height: 320px;
						overflow: auto;
						float: right;
					}
					::-webkit-scrollbar {
						width: 10px;
					}
					/* 滚动槽 */
					::-webkit-scrollbar-track {
						-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
						border-radius: 10px;
					}
					/* 滚动条滑块 */
					::-webkit-scrollbar-thumb {
						border-radius: 10px;
						background: #bbb;
						-webkit-box-shadow: inset 0 0 6px rgba(	220,220,220,0.5);
					}
				}
				.total{
					height:45px;
					line-height:30px;
					color:#409eff;
				}
			}
			.modal-footer {
				padding: 20px;
				line-height: 20px;
				text-align: center;
				color: #73879c;
				.el-button{
					width: 90px;
					height: 30px;
					margin-top: 5px;
					font-size: 12px;
					line-height: 0;
				}
			}
		}
		.fade-enter-active,.fade-leave-active {
			transition: opacity .2s;
		}
		.limitNum{
			display: inline-block;
			width:200px;
		}
		.closeBtn{
			position: absolute;
			top: 8px;
			right: 18px;
			width: 20px;
			cursor: pointer;
		}
	}
	.setting-dialog{
		height:280px;
		overflow-y: auto;
	}
	.required{
		line-height: 30px;
		color: red;
		display: inline-block;
	}
</style>
