<template>
	<div id="newmass">
		<div class="title">
			<h3>群发消息 <el-button style="float:right;" @click="goFunctionMass" type="text">群发列表</el-button></h3>
			<ul>
				<li>
					<span>模板名称</span>
				</li>
				<li>
					<el-input size="small" placeholder="请输入分组名称" v-model="pointData.userName"></el-input>
				</li>
			</ul>
			<ul>
				<li>
					<span>群发对象</span>
				</li>
				<li class="checkbox_li">
					<template>
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部分组</el-checkbox>
						<div style="margin: 15px 0;"></div>
						<el-checkbox-group v-model="selectGroups" @change="handleCheckedCitiesChange">
							<el-checkbox v-for="item in groups" :label="item.wx_user_group_id" :key="item.wx_user_group_id">{{item.wx_user_group_name}}</el-checkbox>
						</el-checkbox-group>
					</template>
				</li>
			</ul>
			<div class="main">
				<template>
					<!-- `checked` 为 true 或 false -->
					<el-checkbox v-model="checked1" :disabled="!checked1" @change="selectContent">文字</el-checkbox>
					<div class="textbox">
						<el-input type="textarea" :disabled="!checked1" :rows="8" placeholder="请输入内容" v-model="pointData.content"></el-input>
					</div>
				</template>
				<el-checkbox v-model="checked2" :disabled="!checked2"  @change="selectImg">图片或视频</el-checkbox>
				<div class="upload">
					<el-upload :on-success="getSendImg" :action="uploadUrl" :on-change="uploadChange" :disabled="!checked2" list-type="picture-card" :auto-upload=false ref="uploadFriend" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit='1'>
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-upload>
						
					<div class="btnbox">
						<el-button size="small" plain @click="savePlan">保存并立即发送</el-button>
						<el-button size="small" plain  @click="onlySave">仅保存</el-button>
						<el-button size="small" plain disabled>定时发送</el-button>
						
					</div>
				</div>
				
				<!--<div class="upload">
					<el-upload :on-success="getSendImg" :action="uploadUrl" :disabled="!checked2" list-type="picture-card" :auto-upload=false ref="uploadFriend" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="maxPiece">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
					<div class="btnbox">
						<el-button size="small" plain @click="savePlan">保存并立即发送</el-button>
						<el-button size="small" plain disabled>仅保存</el-button>
						<el-button size="small" plain disabled>定时发送</el-button>
						
					</div>
				</div>-->
			</div>

		</div>

	</div>
</template>
<script>
	import axios from "axios";
	import {config} from "../../api/http.js";
	export default {
		data() {
			return {
				publicUrl:config,
				disabled:true,
				pointData: {
					key: "",
					userName: "",
					content: "",
					group_all: [],
					flock_all: [],
					groupId:[],
					image:'',
					status:'',
					sentDate:''
				},
				token: "",
				tableNew: [],
				textCheckbox: false,
				imageCheckbox: false,
				//全部分组
				checkAll: false,
				groups: [],
				selectGroups:[],
				isIndeterminate: false,
				//分组账号
				checkAll_two: false,

				checked1: true, //文字选框
				checked2: false, //文字选框
				dialogImageUrl: "", //上传
				dialogVisible: false, //上传
				maxPiece: 1, //图片最大张数
				uploadUrl: "",
				temporary:[],
				groupSentInfo:[],
				groupSentImgInfo:[],
			};
		},
		mounted() {
			this.getGroupSentInfo();
			//上传图片地址
			this.getGroupList();
			
			//编辑否
			if(JSON.parse(sessionStorage.getItem('resource'))){
				this.pointData = JSON.parse(sessionStorage.getItem('resource'))
				this.selectGroups = this.pointData.groupId;
				if(this.pointData.content==''){
					this.checked1=false;
					this.checked2=true;
					this.dialogImageUrl = this.pointData.image;
				}
			}
		},
		beforeDestroy(){
			sessionStorage.removeItem('resource')
			sessionStorage.removeItem('resourceIndex')
		},
		methods: {
			goFunctionMass(){
				this.$router.push("mr_functionMass");
			},
			//选中图片
			uploadChange(){
				this.dialogImageUrl = "";
			},
			getSendImg(){
				let length = this.groupSentInfo.length-1;
				  axios.get(
				          this.publicUrl.resourceUrl+"api/v1/usekey?type=jy_GroupsentMessageImg"+length+"&key=" +
				            sessionStorage.getItem("user_id")
				       ).then(res => {
				          if (res.data.code == 0) {
								let img = this.publicUrl.newResourceUrl+res.data.data;
								this.groupSentInfo[0].image=img;
							axios.post(
									this.publicUrl.resourceUrl+"api/v1/text?type=jy_GroupsentMessage&key=" + sessionStorage.getItem('user_id'),
									this.groupSentInfo, {
										headers: {
											"Content-Type": "application/x-www-form-urlencoded"
										}
									}
								)
								.then(res => {
									if(res.data.code == 0) {
										this.$message({
											message: "修改成功",
											type: "success"
										});
										this.createTask();
									} else {
										this.$message({
											message: "修改失败",
											type: "error"
										});
									}
								})
								.catch(err => {
									this.$message({
										message: "修改失败",
										type: "error"
									});
								});
				          }
				        }).catch(err=>{
				        	
				        })
			},
			createTask(){
				this.$http("task/create_task", "POST", {
	                task_template_name: "群发消息",
	                task_template_id: 15,
	                enum_wxaccount_source: 2,
	                account_list:[1513],
	                expect_count:this.pointData.group_all.length
	           }).then(res => {
	                    if (res.data.error_code == 0) {
	                        this.$message({
	                            message: "执行成功",
	                            type: "success"
	                        });
	                        // this.$router.push("mr_functionMass");
	                    } else {
	                        this.$message({
	                            message: "执行失败" + res.data.error_message,
	                            type: "error"
	                        });
	                    }
	                })
	                .catch(err => {
	                    this.$message({
	                        message: "执行失败" + err,
	                        type: "error"
	                    });
	                });   
	                
//				this.$http("task/create_task", "POST", {
//	                task_template_name: "群发消息",
//	                task_template_id: 15,
//	                enum_wxaccount_source: 2,
//	                account_list:this.pointData.group_all,
//	                expect_count:this.pointData.group_all.length
//	           }).then(res => {
//	                    if (res.data.error_code == 0) {
//	                        this.$message({
//	                            message: "执行成功",
//	                            type: "success"
//	                        });
//	                        this.$router.push("mr_functionMass");
//	                    } else {
//	                        this.$message({
//	                            message: "执行失败" + res.data.error_message,
//	                            type: "error"
//	                        });
//	                    }
//	                })
//	                .catch(err => {
//	                    this.$message({
//	                        message: "执行失败" + err,
//	                        type: "error"
//	                    });
//	                });      
			},
			//获取群发消息
			getGroupSentInfo(){
				 axios.get(
                    this.publicUrl.resourceUrl+"api/v1/usekey?type=jy_GroupsentMessage&key=" +
                        sessionStorage.getItem("user_id")
               ).then(res => {
                    if (res.data.code == 0) {
                    	let data = JSON.parse(res.data.data);
                    	if(sessionStorage.getItem('resourceIndex')){
                    		data.splice(sessionStorage.getItem('resourceIndex'),1);
                    	}
                    	
                        this.groupSentInfo =data;
                        this.uploadUrl =this.publicUrl.resourceUrl+"api/v1/file?type=jy_GroupsentMessageImg"+this.groupSentInfo.length+"&key=" +sessionStorage.getItem("user_id");
                    } else {
                    }
                })
                .catch(err => {});
			},
			selectContent(){
				if(this.checked1==false){
					this.checked2=true;
				}
				
			},
			selectImg(){
				if(this.checked2==false){
					this.checked1=true;
				}
			},
			//获取分组列表
			getGroupList() {
				this.$http('wx_group/list', 'GET',{
					limit:9999,
					page:1,
					group_name:''
				})
					.then(res => {
						if(res.data.error_code == 0) {
							this.groups = res.data.data.result;
							if(this.pointData.groupId.length==this.groups.length){
								this.checkAll=true;
							}
						}

					}).catch(err => {

					})
			},
			/*获取当前年月日*/
			gainDate() {
				return(
					new Date().getFullYear() +
					"/" +
					(new Date().getMonth() + 1) +
					"/" +
					new Date().getDate() +
					" "
				);
			},
			//上传
			handleRemove(file, fileList) {
			},
			//上传
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//全部分组
			handleCheckAllChange(val) {
				if(val){
					this.groups.forEach(item=>{
						this.selectGroups.push(item.wx_contact_group_id)
					})
					this.pointData.groupId = this.selectGroups;
					this.selectGroups.forEach(item=>{
						this.getGroupMembers(item)
					})
				}else{
					this.pointData.groupId = [];
					this.pointData.group_all = [];
					this.selectGroups = [];
				}
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				this.pointData.group_all = [];
				this.temporary=[];
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.groups.length;
				this.isIndeterminate =
					checkedCount > 0 && checkedCount < this.groups.length;
				this.selectGroups = value;
				this.pointData.groupId=value;
				this.selectGroups.forEach(item=>{
					this.getGroupMembers(item)
				})
			},
			getGroupMembers(groupId) {
				this.$http('wx_user','GET',{
					limit:99999,
					page:1,
					wx_user_group_id:groupId
				}).then(res=>{
					if(res.data.error_code==0){
						let data = res.data.data;
						data.forEach(item=>{
							this.temporary.push(item.wx_user_id)
						})
						var newSet = new Set(this.temporary);
						this.pointData.group_all=Array.from(newSet);
					}
				}).catch(err=>{
					
				})
			},
			timetrans(date){
				    var date = new Date(date);
				    var Y = date.getFullYear() + '-';
				    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())+' ';
				    var H = date.getHours() + ':';
					var F = date.getMinutes() + ':';
					var S = date.getSeconds();
				    return Y+M+D+H+F+S;
			},
			
			
			
			prepare(type){
				
				if(this.pointData.userName==''){
					this.$message({
						message: "请输入模板名称",
						type: "warning"
					});
					return false;
				}else{
					if(this.pointData.group_all.length==0){
						this.$message({
							message: "请选择群发对象",
							type: "warning"
						});
						return false;
					}
				}
				if(type=="sent"){
					this.pointData.status=1;
					var date = new Date();
					let nowStamp = date.getTime();
					this.pointData.sentDate=this.timetrans(nowStamp);
				}else{
					this.pointData.status=2;
				}
				// this.pointData.group_all=['wxid_9ae0aj2hre5j22']
				this.groupSentInfo.unshift(this.pointData);
				
				if(this.checked1){
					if(this.pointData.content==''){
						this.$message({
							message: "请输入文字",
							type: "warning"
						});
						return false;
					}
					axios.post(
						this.publicUrl.resourceUrl+"api/v1/text?type=jy_GroupsentMessage&key=" + sessionStorage.getItem('user_id'),
						this.groupSentInfo, {
							headers: {
								"Content-Type": "application/x-www-form-urlencoded"
							}
						}
					)
					.then(res => {
						if(res.data.code == 0) {
							this.$message({
								message: "修改成功",
								type: "success"
							});
							if(type=='sent'){
								this.createTask();
							}else{
								// this.$router.push("mr_functionMass");
							}
						} else {
							this.$message({
								message: "修改失败",
								type: "error"
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "修改失败",
							type: "error"
						});
					});
				}else{
					this.pointData.content='';
					this.$refs.uploadFriend.submit();
				}
			},
			//仅保存
			onlySave(){
				this.prepare('save')
			},
			//立即发送
			savePlan() {
				this.prepare('sent')
			},
			
		},

	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	#newmass {
		margin: 22px 88px;
		height: 100%;
		background: #e8eff6;
		box-sizing: border-box;
		.title {
			padding: 30px;
			padding-left: 90px;
			background: #fff;
			h3 {
				font-size: 19px;
				margin-bottom: 25px;
			}
			ul {
				overflow: hidden;
				li {
					float: left;
					padding-bottom: 50px;
					span {
						font-size: 14px;
						color: #858585;
						padding-right: 20px;
					}
				}
				.li3 {
					padding-right: 30px;
				}
				.checkbox_li {
					margin-right: 70px;
				}
			}
			.main {
				.textbox {
					padding: 15px 450px 15px 25px;
				}
				.upload {
					padding: 20px 0 20px 25px;
					.btnbox {
						margin-top: 25px;
						.el-button {
							border: 1px solid #409eff;
							color: #409eff;
						}
						.el-button:focus,
						.el-button:hover {
							border-color: #409eff;
							background-color: #e6f2ff;
						}
					}
				}
			}
		}
	}
</style>