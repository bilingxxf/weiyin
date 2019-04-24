<template>
	<el-container id="login">
		<div class="container" v-loading="loading">
			<div class="login-main">
				<img class="company-logo" src="../../assets/images/logo.png" />
				<p class="login-title">微营销登录</p>
				<el-row style="margin: 10px 0 0 0;">
	  					<el-col :span="24">
		  					<el-form  :rules="loginRules" :model="loginForm" ref="loginForm">
		  						<el-form-item prop="username">
							    	<el-input class="inp-btn userName" v-model="loginForm.username" type="input" placeholder="用户名"></el-input>
								</el-form-item>
								<el-form-item prop="password">
								   <el-input class="inp-btn psw" v-model="loginForm.password" :type="seen ? 'password': 'text' " placeholder="密码" @keyup.enter.native="loginHandle('loginForm')"></el-input>
									<img class="no-display" :src="[seen ? require('../../assets/images/icon_2.png') : require('../../assets/images/icon_1.png')]" @click="seenHandle" />
								</el-form-item>
		  					</el-form>
	  					</el-col>
	  				</el-row>
				<el-row>
					<button class="login-btn" @click="loginHandle('loginForm')">登录</button>
					<p style="text-align:center;user-select: none; ">
						<a :href="downLoadUrl" class="chat-client" download="聊天客户端">聊天客户端下载</a>
					</p>
				</el-row>
			</div>
		</div>
	</el-container>
</template>
<script>
 import {config} from "../../api/http.js";
 let routerList=[
	 {
		 value:"账号管理",
		 router:"/mr_accountManage"
	 },
	 {
		 value:"账号添加",
		 router:"/mr_add"
	 },
	 {
		 value:"分组管理",
		 router:"/mr_grouping"
	 },
	 {
		 value:"子账号管理",
		 router:"/mr_childAccount"
	 },
	 {
		 value:"好友管理",
		 router:"/mr_friendsManage"
	 },
	 {
		 value:"群管理",
		 router:"/mr_wechatgroup_list"
	 },
	 {
		 value:"快速建群",
		 router:"/mr_wechatgroup_fastCreate"
	 },
	 {
		 value:"群聊列表",
		 router:"/mr_wechatgroup_newList"
	 },
	 {
		 value:"群任务列表",
		 router:"/mr_wechatgroup_taskList"
	 },
	 {
		 value:"任务列表",
		 router:"/mr_fanTaskList"
	 },
	 {
		 value:"加粉频繁明细",
		 router:"/mr_abnormalList"
	 },
	 {
		 value:"加粉频繁汇总",
		 router:"/mr_abnormalCount"
	 },
	 {
		 value:"新建任务",
		 router:"/mr_fansTask"
	 },
	 {
		 value:"号库管理",
		 router:"/mr_resourcesManage"
	 },
	 {
		 value:"被动加粉",
		 router:"/mr_fansAgree"
	 },
	 {
		 value:"查看朋友圈",
		 router:"/mr_functionContent"
	 },
	 {
		 value:"发朋友圈",
		 router:"/mr_functionTake"
	 },
	 {
		 value:"发圈记录",
		 router:"/mr_functionRecord"
	 },
	  {
		 value:"素材管理",
		 router:"/mr_functionMaterial"
	 },
	 {
		 value:"阅读",
		 router:"/mr_readList"
	 }
 ];
export default {
	name: 'login',
	data() {
		let validateUsername = (rule, value, callback) => {
			if(!value) {
				callback(new Error('用户名不能为空'));
			} else {
				callback();
			}
		}
		let validatePass = (rule, value, callback) => {
			if(!value) {
				callback(new Error('密码不能为空'))
			}else {
				callback();
			}
		}
		return {
			loading:false,
			seen: true,
			loginForm: {
				username: '',
				password: '',
			},
			loginRules: {
				username: [{required: true, trigger: 'blur',validator: validateUsername}],
				password: [{required: true, trigger: 'blur', validator: validatePass}]
			},
			production:config.production,
			downLoadUrl:config.chatClientUrl,
			userName:""
		}
	},
	created(){
		if(window.location.href.indexOf('&')>-1){
			let data = window.location.href.split('?')[1].split('&');
			this.userName = data[0];
			sessionStorage.setItem('username',data[0])
			sessionStorage.setItem('token',decodeURIComponent(data[1]))
			this.getToken(data[0]);
		}
	},
	methods: {
		seenHandle() {
			this.seen = !this.seen
		},
    getModel(callback){
		  let _this=this;
		  _this.$http("/module","GET",{
			    searchSign: 0,
				userId:sessionStorage.getItem('user_id')
			}).then(res=>{
				if(res.data.error_code==0){
				let menuList=res.data.data;
				sessionStorage.setItem("menuList",JSON.stringify(menuList));
				_this.$message.success('登录成功');
				if(menuList.length!=0){
					let firstMenu = menuList[0].children[0].moduleName;
					routerList.forEach(item=>{
					if(item.value==firstMenu){
						_this.$router.replace(item.router);
					}
					})
				}else{
					_this.$message.error("暂无展示模块");
				}	
				
        }else{
          _this.$message.error("获取菜单列表失败");
        }
      })
    },
		loginHandle(formName) {
			let $this = this;
		 let userReg=/^(?=.*[a-zA-Z])([\w-]@?\.?){3,18}$/;
		 let passReg =  /^[a-zA-Z0-9]{6,16}$/;
			$this.$refs[formName].validate((valid) => {
        if (valid&&userReg.test($this.loginForm.username)&&passReg.test($this.loginForm.password)) {
					$this.loading= true;
					$this.$http('user/login', 'POST', {
						'password': $this.loginForm.password,
						'username': $this.loginForm.username
					}).then((res) => {
						this.loading= false;
						if(res.data.error_code == 0) {
							let indentity=res.data.error_message.split(",");
							sessionStorage.setItem('token',res.data.error_token);
							sessionStorage.setItem('username',$this.loginForm.username);
							sessionStorage.setItem('user_id',res.data.user_id);
							if(indentity.indexOf("ROLE_SUBUSER")>=0){
								sessionStorage.setItem("indentity","ROLE_SUBUSER");
							}else if(indentity.indexOf("ROLE_USER")>=0){
								sessionStorage.setItem("indentity","ROLE_USER");
							}
              $this.getModel();
						} else{
							this.$message.error('登录失败:'+res.data.error_message);
						} 
					})
				} else {
						this.$message.error('请填写正确的账号密码');
						return false;
				}
		    });
		},
		getToken(name) {
			this.$http('/user/token?username='+name, 'POST', {
				
			}).then(res => {
				if(res.data.error_code == 0) {
					let indentity=res.data.error_message.split(",");
					sessionStorage.setItem('token',res.data.data);
					sessionStorage.setItem('username',this.userName);
					sessionStorage.setItem('user_id',res.data.user_id);
					if(indentity.indexOf("ROLE_SUBUSER")>=0){
						sessionStorage.setItem("indentity","ROLE_SUBUSER");
					}else if(indentity.indexOf("ROLE_USER")>=0){
						sessionStorage.setItem("indentity","ROLE_USER");
					}
					this.getModel();
				} else{
					this.$message.error('登录失败:'+res.data.error_message);
				} 
			}).catch(err => {
				console.log(err);
			})
		}
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: url(../../assets/images/bg.jpg) no-repeat;
	background-size: 100% 100%;
}
.login-main {
	position: absolute;
	width: 400px;
	height: 520px;
	background: #FFFFFF;
	top: 50%;
	left: 50%;
	margin-top: -270px;
	margin-left: -200px;
	border-radius: 6px;
}
.company-logo {
	display: block;
	width: 80px;
	height: 80px;
	margin: 40px auto 26px;
}
.login-title {
	text-align: center;
	font-size: 24px;
	color: rgba(0, 0, 0, .8);
	padding-bottom: 20px;
}
.inp-btn {
	display: block;
	width: 338px;
	border-bottom: 2px solid #E0E0E0;
	font-size: 18px;
	color: rgba(0, 0, 0, .5);
	padding-bottom: 8px;
	margin: 7px auto 0;
}
.login-btn {
	display: block;
	border: 0;
	padding: 13px 150px;
	border-radius: 12px;
	margin: 30px auto 30px;
	background: -webkit-linear-gradient(right, #4fb0db, #80cef2);
	background: -moz-linear-gradient(right, #4fb0db, #80cef2);
	background: -o-linear-gradient(right, #4fb0db, #80cef2);
	background: -ms-linear-gradient(right, #4fb0db, #80cef2);
	background: linear-gradient(to left, #4fb0db, #80cef2);
	box-shadow: #68c0e8 5px 9px 24px -3px;
	font-size: 20px;
	color: #FFFFFF;
	cursor: pointer;
}
.chat-client{
	display: inline-block;
	margin: 0 32px;
	line-height: 26px;
	text-align: center;
	text-decoration: underline;
	font-size: 16px;
	color: #4fb0db;
	cursor: pointer;
}
.psw-wrap {
	position: relative;
}
.no-display {
	display: inline-block;
	width: 20px;
	height: 20px;
	position: absolute;
	right: 44px;
	top: 22px;
	cursor: pointer;
}
.hint {
	font-size: 22px;
	color: #999999;
}
.go-back {
	float: right;
	width: 90px;
	height: 46px;
	color: #FFFFFF;
	font-size: 22px;
	background-image: -webkit-linear-gradient(right, #4fb0db, #80cef2);
	background-image: -moz-linear-gradient(right, #4fb0db, #80cef2);
	background-image: -o-linear-gradient(right, #4fb0db, #80cef2);
	background-image: -ms-linear-gradient(right, #4fb0db, #80cef2);
	background-image: linear-gradient(right, #4fb0db, #80cef2);
	box-shadow: #68c0e8 3px 5px 22px -3px;
	border-radius: 6px;
	margin: 0 32px 0 0;
	cursor: pointer;
}
</style>
