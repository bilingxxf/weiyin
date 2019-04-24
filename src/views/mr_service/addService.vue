<template>
	<div id="addService" class="main-body">
		<div class="main_wrapper main-wrapper-type2">
			<div class="page-title">
				<span>添加客服账号</span>
			</div>
			<ul>
				<li>
					<span class="font_color">账号ID：</span>
					<el-input class="ele-input" v-model="accountName" :disabled="editor" placeholder="英文或数字组成，不得修改"></el-input>
				</li>
				<li>
					<span class="font_color">密码：</span>
					<el-input class="ele-input" v-model="accountPsw" placeholder="最少6位"></el-input>
				</li>
				<li>
					<span class="font_color">分配账号：</span>
					<div class="account_wrapper">
						<el-scrollbar class="scroll-bar">
							 <div class="account">
								 <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
								  <el-checkbox-group v-model="checkedAccount" @change="handleCheckedCitiesChange">
								    <el-checkbox v-for="item in accountList" :disabled="item.waiter_username!=''&&item.waiter_username!=accountName" :label="item.wxuser_id" :key="item.wxuser_id">
								    	<strong class="server" v-if="item.wx_nickname!=''">{{item.wx_nickname}}</strong>
								    	<strong class="server" v-else>{{item.wx_username}}</strong>
								    	<em style="margin-left: 10px;" v-if="item.waiter_username!=''">客服：{{item.waiter_username}}</em>
								    </el-checkbox>
								  </el-checkbox-group>	
							 </div> 
						</el-scrollbar>
					</div>
					
				</li>
			</ul>
			<el-button type="primary" class="ele-btn" style="width: 90px;margin:0 0 0 150px;" @click="saveServer">保存</el-button>
			<el-button type="primary" class="ele-default" @click="cancelSave">取消</el-button>
			
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				checkAll:false,
				accountId:'',
				accountName:'',
				accountPsw:'',
				checkAll: false,
		        isIndeterminate: false,
				accountList:[],
				checkedAccount: [],
				originaldUserId:"",
		        test:true,
		        editor:false,
				editorCheck:[],
				cancel_wxIds:[]
			};
		},
		mounted() {
			this.getAccountInfo();
			let editors = this.$route.query.editor;
			if(editors){
				this.accountName = this.$route.query.waiter_name;
				this.accountId = this.$route.query.waiter_id;
				this.editorCheck = this.$route.query.wx_username;
				this.originaldUserId = this.$route.query.wx_user_id.split(',');
				this.editor = true;
			}
		},
		methods: {
			  handleCheckAllChange(val) {
				  let $this = this;
			  	if(val){
			  		this.accountList.forEach((item,index)=>{
			  			if(item.waiter_username==''){
							$this.checkedAccount.push(item.wxuser_id);
			  			}
			  		})
			  	}else{
			  		this.checkedAccount = []
			  	}
		        $this.isIndeterminate = false;
      		},
		      handleCheckedCitiesChange(value) {
		        let checkedCount = value.length;
		        this.checkAll = checkedCount === this.accountList.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.accountList.length;
		      },
			cancelSave(){
				this.accountName='';
				this.accountPsw = '';
				this.checkedAccount = [];
				this.$router.push('/mr_kpi')
			},
			regExp(account,reg,type){
				let regEngAndNumber=new RegExp("^[A-Za-z0-9]+$");
				if (regEngAndNumber.test(account)) {
					if(type==1){
						if(account.length<4||account.length>10){
				        	this.$message({
		                        message: reg,
		                        type: "error"
		                    });
		                    this.test = false;
				       }
					}else{
						if(account.length<6||account.length>10){
				        	this.$message({
		                        message: reg,
		                        type: "error"
		                    });
		                    this.test = false;
				       }
					}
			    } else {
			      	this.$message({
                        message: reg,
                        type: "error"
                    });
                    this.test = false;
			      }
			},
			saveServer(){
				let regId = "客服ID为4~10位数字或字母,";
				let regPwd = "客服密码为6~10位数字或字母";
				if(this.checkedAccount.length==0){
					this.$message({
                        message: "请选择分配账号",
                        type: "error"
                    });
					this.test = false;
				}
				// if(!this.editor){
					this.regExp(this.accountPsw,regPwd,2);
				// }
				this.regExp(this.accountName,regId,1);
				if(this.editor){
					if(this.test){
						this.originaldUserId.forEach(item=>{
						if(this.checkedAccount.indexOf(Number(item))==-1){
							this.cancel_wxIds.push(item)
						}
						
					})
					
					this.$http('waiter/update','POST',{
							waiter_id:this.accountId,
							waiter_name:this.accountName,
							waiter_passwd:this.accountPsw,
							wx_ids:this.checkedAccount,
							cancel_wxIds:this.cancel_wxIds
						}).then(res=>{
							if(res.data.error_code==0){
								 this.$message({
		                            message: "修改客服成功",
		                            type: "success"
		                        });
		                        this.$router.push('/mr_kpi')
							}else{
								 this.$message({
		                            message: "修改客服失败",
		                            type: "error"
		                        });
							}
						}).catch(err=>{
							
						})
					}
				}else{
					if(this.test){
						this.$http('waiter/add','POST',{
							waiter_name:this.accountName,
							waiter_passwd:this.accountPsw,
							wx_ids:this.checkedAccount,
							cancel_wxIds:this.cancel_wxIds
						}).then(res=>{
							if(res.data.error_code==0){
								 this.$message({
		                            message: "添加客服成功",
		                            type: "success"
		                        });
		                        this.$router.push('/mr_kpi')
							}else{
								 this.$message({
		                            message: "添加客服失败",
		                            type: "error"
		                        });
							}
						}).catch(err=>{
							
						})
					}
				}
				
				
				this.test = true;
				
			},
			 getAccountInfo(){
			 	this.$http("wxuser_waiter", "GET")
                .then(res => {
                    if (res.data.error_code == 0) {
                       this.accountList = res.data.data;
                       if(this.editor){
							   this.editorCheck = this.editorCheck.split(',');
	                       	this.accountList.forEach((item)=>{
		                       	this.editorCheck.forEach((childItem)=>{
		                       		if(item.wx_username===childItem){
										this.checkedAccount.push(item.wxuser_id);
		                       		}
								   })
	                       })
                       }
                       
                    } else {
                        this.$message({
                            message: "获取列表失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "获取列表失败:",
                        type: "error"
                    });
                });
			 },
		}
		
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	#addService{
		.main_wrapper{
			.title{
				margin-bottom: 30px;
				color: #333333;
				font-size: 20px;
			}
			.el-input__inner{
				font-size: 12px;
			}
			li{
				margin-bottom: 20px;
				position: relative;
				padding-left: 5em;
				span{
					width: 5em;
					line-height: 30px;
					font-size: 14px;
					color: #7a7a7a;
					position: absolute;
					top: 0;
					left: 0;
					display: inline-block;
				}
			}

			.account_wrapper{
				display: inline-block;
				width: 355px;
				height: 450px;
				// overflow: hidden;
				border: 1px solid #e8e8e8;
				border-radius: 5px;
				padding:10px;
			}
			.account{
				overflow: hidden;
				.server{
					font-weight: normal;
				}
				.el-checkbox{
					margin-left: 0;
					display: block;
				}
			}
			.el-input{
				width: 250px;
			}
			.el-button{
				height: 30px;
				line-height: 0;
			}
		}
		
	}
	.font_color{
		color:#666!important;
	}
</style> 