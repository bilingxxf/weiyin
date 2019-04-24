<template>
	<div id="kpi" class="main-body">
		<div class="main-wrapper">
			<div class="flex-total">
				<div class="item">
					<h2 class="number">{{serverNumber || '-'}}</h2>
					<p>客服总数</p>
				</div>
				<div class="item">
					<h2 class="number">{{serverOnline || '-'}}</h2>
					<p>在线客服</p>
				</div>
				<div class="item">
					<h2 class="number">{{serverOffline || '-'}}</h2>
					<p>离线客服数</p>
				</div>
			</div>
			<div class="rightTable">
				<div class="page-title">
					<span>客服列表</span>
				</div>
				<div class="search">
					<div class="search-content">
						<!-- <div class="right">
								<el-button type="primary" @click="$router.push('/mr_addService')">添加客服</el-button>
						</div> -->
						<el-input class="ele-input" placeholder="请输入客服名称" suffix-icon="el-icon-search" @change="searchAccount" v-model="searchContent"></el-input>
						<el-button type="primary" class="ele-btn" @click="$router.push('/mr_addService')">添加客服</el-button>
					</div>
				</div>
				<div class="table">
					<div class="edit-group">
						<em>批量操作：</em>
						<span class="edit-btn" @click="showModel('deletegroup')">删除</span>
					</div>
					<el-table :data="tableData"
							  :header-cell-style="getHeaderStyle"
							  @selection-change="handleSelectionChange"
							  v-loading="loading" class="ele-table-init">
						<el-table-column width="30"></el-table-column>
						<el-table-column type="selection">
						</el-table-column>
						<el-table-column prop="waiter_name" label="客服名称" width="200" align="left">
							<template slot-scope="scope">
                              <el-tooltip :open-delay="350" content={scope.row.waiter_name} placement="bottom-end" :offset="80" effect="light">
                                  <span slot="content">{{scope.row.waiter_name}}</span>
                                  <p class="writeWrapper">{{scope.row.waiter_name}}</p>
                            </el-tooltip>
                        </template>
						</el-table-column>
						<el-table-column prop="nick_name" class="members" class-name="members" label="会员分配" align="left">
							<template slot-scope="scope">
                              <el-tooltip :open-delay="350" content={scope.row.nick_name} placement="bottom-end" :offset="80" effect="light">
                                  <span slot="content">{{scope.row.nick_name}}</span>
                                  <p class="writeWrapper">{{scope.row.nick_name}}</p>
                            </el-tooltip>
                        </template>
						</el-table-column>
						<el-table-column label="操作" align="right" width="200">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="editorServer(scope.row)">编辑</el-button>
								<el-button type="text" style="color:red;" size="mini" @click="showModel('delete',scope.row)">删除</el-button>
							</template>
						</el-table-column>
						<el-table-column width="30"></el-table-column>
					</el-table>
				</div>
				<div class="pagination" v-if="tableData.length!=0">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="total">
					</el-pagination>
				</div>
			</div>

		</div>

		<!-- 添加客服 -->
			<!-- <el-dialog
			title="提示"
			:visible.sync="centerDialogVisible"
			width="600px"
			top="15%"
			custom-class="addWaiter"
			center>
			<span>确认删除此客服?删除后不可复原</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSureDelete">确 定</el-button>
			</span>
			</el-dialog> -->
			 <div class="dialogBox" v-if="centerDialogVisible">
          		<div class="header">
					<h5 class="fontSize">删除分组</h5>
					<span class="closeBtn" @click="centerDialogVisible=false,mask=false"></span>
				</div>
				<div class="dialogBody">
					<div class="content">
						<p style="color:#666;">确认删除此客服?删除后不可复原</p> 
					</div>
				</div>
				<div class="dialogFooter">
					<el-button type="primary" class="ele-btn" @click="handleSureDelete">确定</el-button>
					<el-button type="primary" class="ele-default" @click="centerDialogVisible = false,mask=false">取消</el-button>
				</div>
        	</div>
			<!-- 蒙层 -->
			<div class="mask" v-show="mask"></div>
			<Dialog v-if="flag=='delete'" @callback="handleSureDelete">
				<div class="dialog-content" slot="content">
					<p style="color:#666;">确定要删除吗？</p>
				</div>
			</Dialog>
			<Dialog v-if="flag=='deletegroup'" @callback="batchDelete">
				<div class="dialog-content" slot="content">
					<p style="color:#666;">确定要删除吗？</p>
				</div>
			</Dialog>
		</div>
</template>

<script>
	import Dialog from "../../components/dialog.vue";
	export default {
		components:{
			Dialog
		},
		data() {
			return {
				serverNumber: 0,
				serverOnline: 0,
				serverOffline:0,
				searchContent: "",
				childrenKey: [],
				currentPage1: 1, //分页
				copychildrenKey: [],
				popupname: "",
				popup: false,
				popupcontent: "",
				name: "",
				tableData: [],
				addServer: false,
				addserver: {
					account: "",
					role: 0,
					pass: ""
				},
				roleTostring: ["客服"],
				statusTostring: ["", "上班", "暂停", "下班"],
				roles: [{
					label: "客服",
					value: 0
				}],
				mask: false,
				user_id: "",
				waiterId: "",

				defaultProps: {
					children: "children",
					label: "nickname"
				},
				accountData: [],
				hoveronce: false,
				total:0,
				checkInfo:[],
				centerDialogVisible: false,
				loading:true,
				mask:false,
				flag:''
			};
		},

		methods: {
			showModel(type,row){
				let tit='';
				switch(type){
					case 'delete':
						tit="删除客服";
						this.waiterId = row.waiter_id;
						break;
					case 'deletegroup':
						tit="删除客服";
						if(this.checkInfo.length==0){
							this.$message.error("请选择要删除的客服");
							return;
						}
						break;	
				}
				this.flag=type;
				this.$store.dispatch("showDialog",{
					title:tit,
					showCancel:true
				})
			},
			hideModel(){
				this.$store.dispatch("hideDialog");
			},
			//确定删除
			handleSureDelete(){
				this.deleteInfo(this.waiterId);
			},
			editorServer(row){
				this.$router.push({path:'/mr_addService',query:{waiter_id:row.waiter_id,waiter_name:row.waiter_name,wx_username:row.wx_username,wx_user_id:row.wx_user_id,editor:true}})
			},
			searchAccount(){
				this.getServer();
			},
			//批量删除
			batchDelete(){
				this.waiterId = this.checkInfo;
				this.deleteInfo(this.checkInfo);
			},
			//选中的微信号
			handleSelectionChange(val){
				var checkId = [];
				val.forEach((item,index)=>{
					checkId.push(item.waiter_id)
				})
				this.checkInfo= checkId.join(',');

			},
			deleteInfo(deleteId){
				this.$http("waiter/"+deleteId,"DELETE")
				.then(
				res=>{
					if(res.data.error_code==0){
						this.$message({
				          message: '删除成功',
				          type: 'success'
				        });
						this.getServer();
					}
					else{
						this.$message({
				          message: '删除成功',
				          type: 'error'
				        });
					}
				}
				).catch(
				err=>{
					this.$message({
			          message: '删除成功',
			          type: 'error'
			        });
				})
				this.hideModel();
			},
			//删除
			deleteSingal(scope){
				this.mask = true;
				this.centerDialogVisible=true;
				this.waiterId = scope.row.waiter_id;
			},
			//表格头部样式
			getHeaderStyle({row, rowIndex}){
				if(rowIndex == 0){
					return 'background:#ecf5ff;color:#57aaff;font-size:14px;height:50px;';
				}else{
					return ''
				}
			},
			getServer(){
				this.$http("waiter/list","POST",{
					page:this.currentPage1,
					limit:10,
					waiter_name:this.searchContent
				})
				.then(
				res=>{
					if(res.data.error_code==0){
						this.loading = false;
						let data = res.data;
						this.tableData = data.result;
						if(this.tableData.length==0&&this.currentPage1>=2){
							this.currentPage1=this.currentPage1-1;
							this.getServer();
						}
						this.serverNumber = data.count;
						// this.serverOnline = res.data.online_count;
						// this.serverOffline = res.data.offline_count;
						this.total = data.count;
					}
					else{
						this.$message({
				          message: '获取失败',
				          type: 'error'
				        });
					}
				}
				).catch(
				err=>{
					this.loading = true;
					this.$message({
			          message: '获取失败',
			          type: 'error'
			        });
				})
			},
			//分页
			handleCurrentChange(val) {
				this.currentPage1 = val;
				this.loading = true;
				this.getServer();
			}
		},
		mounted() {
			this.getServer();
			this.$store.dispatch("showDialog",{
				title:"删除"
			})
		},
		created() {}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import '../../style/css/base.scss';
	#kpi {
		.kpiStatistical {
			width: 180px;
			overflow: hidden;
			float: left;
			margin-left: 40px;
			padding: 55px 0 50px;
			box-sizing: border-box;
			.item {
				height: 180px;
				width: 180px;
				color:#707070;
				text-align: center;
				h2{
					margin-bottom: 25px;
					color: #409eff;
					font-size: 50px;
				}
			}
		}
		.search {
			.search-header {
				color: #333;
				font-size: 18px;
			}
			.search-content {
				overflow: hidden;
				margin-bottom: $margin;
				display: flex;
				align-items:center;
				justify-content:space-between;
				.el-input{
					width: 200px !important;
					height: 30px !important;

				}
				.left {
					float: left;
					width: 233px;
					height: 30px;
				}
				.right {
					float: right;
					.el-button{
						width: 90px;
						height: 30px;
						padding: 0;
						line-height: 0;
					}
				}
			}
		}
		.table {
			border-bottom: 0;
			.operation{
				color: #409eff;
				margin-bottom: 20px;
				position: relative;
				.right .el-button{
					width: 90px;
					height: 30px;
					line-height: 0;
					position: absolute;
					right: 0;
					top: 0;
					padding: 0;
				}
			}
			.el-table{
				font-size: 12px;
				color: #989898;
				.cell{
					height: 23px;
					overflow: hidden;
				}
			}

		}
		.page {
			padding: 15px 0 50px;
			text-align: center;
		}
		.addServer {
			position: absolute;
			left: 30%;
			top: 30%;
			width: 500px;
			border-radius: 6px;
			background-color: #fff;
			z-index: 11;
			box-sizing: border-box;
			.header {
				padding: 10px 15px;
				overflow: hidden;
				font-size: 14px;
				background-color: #e1ebf4;
				border-radius: 6px 6px 0 0;
				h5 {
					text-align: center;
					float: left;
					width: 95%;
					line-height: 20px;
				}
				span {
					float: right;
					color: #73879c;
					cursor: pointer;
					line-height: 20px;
				}
			}
			.content {
				padding: 15px;
				.contentItem {
					padding: 5px 0;
					overflow: hidden;
					span {
						float: left;
						line-height: 40px;
					}
					.el-input {
						float: left;
						width: 80%;
						margin-left: 20px;
					}
					.el-select {
						float: left;
						width: 80%;
						margin-left: 20px;
					}
				}
			}
			.footer {
				padding: 15px;
				border-top: 1px solid #e5e5e5;
				text-align: center;
			}
		}
		.block {
			padding: 15px 0 50px;
			text-align: center;
			.el-pagination {
				display: inline-block;

			}
		}
	}
</style>
