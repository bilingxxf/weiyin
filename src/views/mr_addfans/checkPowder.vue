<template>
		<div class="main-body">
			<div class="main_wrapper">
				<div class="header_title">
					<p class="page-title">加粉详情</p>
					<el-button type="text" size="mini" @click="goAddFan">返回上一级</el-button>	
				</div>
				<div class="table_wrapper">
					<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"  class="ele-table-init" style="width: 100%;" :header-cell-style="getHeaderClass">
						<el-table-column width="30">
						</el-table-column>
						<el-table-column label="发起账号" align="left">
							<template slot-scope="scope">
								<span v-if="scope.row.nickName!=''">{{scope.row.nickName}}</span>
								<span v-else>{{scope.row.wxUserName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="phone" label="加粉账号" align="left">
						</el-table-column>
						<el-table-column  label="加粉状态" align="right">
							<template slot-scope="scope">
								{{scope.row.status | testStatus }}
							</template>
						</el-table-column>
						<el-table-column width="30">
						</el-table-column>
					</el-table>
					<div class="footer">
						<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="limit" layout="total, prev, pager, next" :total="total">
						</el-pagination>
					</div>
				</div>
			</div>
			
		</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				radio: '1',
				currentPage: 1,
				total: 0,
				page:1,
				limit:15,
				planId:0
			};
		},
		mounted(){
			this.planId = this.$route.query.planId;
			this.getAccountInfo();
		},
		methods: {
			goAddFan(){
				this.$router.push("mr_addFan")
			},
			//订单数据
			getAccountInfo(){
				this.$http('plan/'+this.planId+'/'+this.page+'/'+this.limit,'GET').then(res=>{
		  			if(res.data.error_code==0){
						  let data = res.data.data;
						  this.tableData = data.result;
						  this.total = data.total_count;
		  			}else{
		  				this.$message({
				            message:'获取失败',
				            type:'error'
				        })
		  			}
		  		}).catch(err=>{
		  			this.$message({
			            message:'获取失败',
			            type:'error'
			        })
		  		})
			},
			// 表格头部背景颜色
			getHeaderClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if(rowIndex == 0) {
					return 'background:#ecf5ff;color:#57aaff;font-size:14px';
				} else {
					return ''
				}
			},
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.getAccountInfo();
			},
		},
		filters:{
			testStatus:function(value){
				if(value=='2'){
					return '未通过'
				}else if(value=='3'){
					return '已通过'
				}else{
					return '未添加'
				}
			}
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
		.main_wrapper{
			background: #fff;
			padding: 50px 30px 50px;
		}
		.ele-table-init{
			margin-top: 0;
		}
		.header_title{
			overflow: hidden;
			p{
				float: left;
			}
			.el-button{
				float: right;
			}
		}
		.table_wrapper {
			margin: 0 auto;
			.el-table {
				font-size: 12px;
			}
			.title {
				height: 60px;
				line-height: 60px;
				padding: 0 15px;
				.left {
					float: left;
				}
			}
			.el-table__header-wrapper {
				background: red;
			}
		}
		.footer {
			text-align: center;
			margin-top: 10px;
		}
</style>