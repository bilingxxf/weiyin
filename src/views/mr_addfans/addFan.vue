<template>
	<div id="group" class="main-body">
		<div class="main_wrapper main-wrapper">
			<div class="flex-total">
				<div class="item">
					<h2 class="number">{{startNumber || '-'}}</h2>
					<p v-if="dataValue == 1">昨日加粉次数</p>
					<p v-if="dataValue == 3">近3天加粉次数</p>
					<p v-if="dataValue == 7">近7天加粉次数</p>
					<p v-if="dataValue == 30">近30天加粉次数</p>
				</div>
				<div class="item">
					<h2 class="number">{{passNumber || '-'}}</h2>
					<p v-if="dataValue == 1">昨日通过数</p>
					<p v-if="dataValue == 3">近3天通过数</p>
					<p v-if="dataValue == 7">近7天通过数</p>
					<p v-if="dataValue == 30">近30天通过数</p>
				</div>
				<div class="item">
					<h2 class="number">{{surplusNumber || '-'}}</h2>
					<p>资源剩余量</p>
				</div>
			</div>
			<div class="info_wrapper" id="addFan_info_wrapper">
				<div class="search">
					<div class="page-title">加粉报表</div>
					<div class="data_wrapper">
						<el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getSelectDate" value-format="yyyy-MM-dd">
						</el-date-picker>
						 <el-select class="ele-select" v-model="dataValue" placeholder="选择日期" @change="selectDateChange">
						    <el-option
						      v-for="item in dataOptions"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
						<!-- <el-button type="primary" @click="$router.push('/mr_fansTask')">发起加粉任务</el-button>
						<el-button type="primary" class="el-button-right" @click="$router.push('/mr_fanTaskList')">任务列表</el-button>
						<el-button type="primary" @click="$router.push('/mr_resourcesManage')">号库管理</el-button> -->
					</div>
				</div>
				<div class="table_wrapper">
					<el-table ref="multipleTable"
					:data="tableData"
					tooltip-effect="dark"
					style="width: 100%;"
					v-loading="loading"
					class="ele-table-init">
		  				<el-table-column width="30"></el-table-column>
						<el-table-column prop="planName" label="任务名称" align="left">
							<template slot-scope="scope">
                              <el-tooltip :open-delay="350" content={scope.row.planName} placement="bottom-end" :offset="80" effect="light">
                                  <span slot="content">{{scope.row.planName}}</span>
                                  <p class="writeWrapper">{{scope.row.planName}}</p>
                            </el-tooltip>
                        </template>
						</el-table-column>
						<el-table-column prop="createTime" label="报表生成时间" align="left">
						</el-table-column>
						<el-table-column prop="execCount" label="发送次数" align="left">
						</el-table-column>
						<el-table-column prop="successCount" label="通过人数" align="left">
						</el-table-column>
						<el-table-column label="加粉账号" align="right" width="200">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="checkDetail(scope.row)">查看</el-button>
							</template>
						</el-table-column>
						<el-table-column width="30"></el-table-column>
					</el-table>
					<div class="pagination" v-if="tableData.length!=0">
						<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="limit" layout="total, prev, pager, next" :total="total">
						</el-pagination>
					</div>
				</div>
			</div>
			<!-- 蒙层 -->
			<div class="mask" v-show="mask"></div>
			<!-- 删除弹窗 -->
			<!--  <div class="addServer" v-show="deletePopup">
					<div class="header">
					<h5>{{deleteGroupName}}分组</h5>
					<span @click="mask=false,deletePopup=false">×</span>
					</div>
					<div class="content">
					<el-radio v-model="radio" disabled label="1">注销分组（该分组下所有的账号将会被同步注销）</el-radio>
					<el-radio v-model="radio" label="2">删除分组，将该分组下所有的账号转移分组到</el-radio>
					<el-select v-model="groupItem" placeholder="请选择" v-if="radio==2" class="specialSelect">
						<el-option
						v-for="item in groupItems"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
					</div>
					<div class="footer">
					<el-button type="success" @click="deletegroup">确定</el-button>
					<el-button @click="mask=false,deletePopup=false">取消</el-button>
					</div>
				</div> -->
			<!-- 详情弹窗 -->
			<div class="popup" v-show="details">
				<span class="close" @click="mask=false,details=false">
					<img src="../../assets/images/whiteClose.png" alt="" />
				</span>
				<div class="header">详情</div>
				<div class="content">
					<div class="list">
						<el-table :data="detailsTableData" style="width: 100%">
							<el-table-column prop="name" label="微信号">
							</el-table-column>
							<el-table-column prop="name" label="微信昵称">
							</el-table-column>
							<el-table-column prop="name" label="状态">
							</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="button">
					<el-button size="small" @click="mask=false,details=false">关闭</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				detailsTableData: [],
				details: false,
				startNumber: 0,
				surplusNumber: 0,
				passNumber:0,
				tableData: [],
				radio: '1',
				currentPage: 1,
				total: 0,
				selectDate: "",
				deletePopup: false,
				deleteGroupName: '',
				mask: false,
				page:1,
				limit:10,
				startTime:'',
				endTime:'',
				taskTemplateId:"",
				dataOptions:[{
					value:1,
					label:'昨天'
				},{
					value:3,
					label:'近3天'
				},{
					value:7,
					label:'近7天'
				},{
					value:30,
					label:'近30天'
				}],
				dataValue: 1,
				loading:true
			};
		},
		mounted(){
			this.getAccountInfo();
			this.getTaskTemplate();
			this.getTabledataList();
		},
		methods: {
			 //获取加粉列表
        getTabledataList(){
            this.$http('plan/plan_list','POST',{
                endTime:this.endTime + " 23:59:59",
                startTime:this.startTime + " 00:00:01",
                length:this.limit,
                pageNo:this.page,
                templateName:"加粉"
            }).then(res=>{
                if(res.data.error_code==0){
					this.loading = false;
                    let data = res.data.data;
                    this.tableData = data.result;
                    this.total= data.total_count;
                }else{
                    this.$message({
                        message: '获取加粉记录失败',
                        type: 'error'
                    });
                }
            }).catch(err=>{
				 this.loading = true;
                 this.$message({
                    message: '获取加粉记录失败',
                    type: 'error'
                });
            })
        },
			//获取加粉模板id
			getTaskTemplate(){
				this.$http("task_template","GET",{
					page:1,
					per_page:9999
				}).then(res=>{
						if(res.data.error_code==0){
							let data = res.data.data;
							data.result.forEach(item=>{
								if(item.task_template_name=="加粉"){
									this.taskTemplateId=item.task_template_id;
								}
							})
						}
						else{
							this.$message({
							message: '获取计划发圈模板id失败',
							type: 'error'
							});
						}
				}).catch(err=>{
					this.$message({
			          message: '获取计划发圈模板id失败',
			          type: 'error'
			        });
				})
        },
			checkDetail(row){
				this.$router.push({path:'mr_checkPowder', query:{planId:row.planId}})
			},
			selectDateChange(val){
				this.dataValue == val
				this.selectDate="";
				var date = new Date();
				let nowStamp;
				if(this.dataValue==1){
					nowStamp = date.getTime();
				}else{
					nowStamp = date.getTime()+86400000;
				}
				let day  = 86400000;
				let dateStamp = this.dataValue*day;
				let resultDay = nowStamp-dateStamp;
				this.startTime = this.timetrans(resultDay);
				this.endTime = this.timetrans(nowStamp);
				this.page=1;
				this.currentPage=1;
				this.getAccountInfo();
			},
			timetrans(date){
				var date = new Date(date);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				return Y+M+D;
			},
			//订单数据
			getAccountInfo(){
				// this.$http('plan/plan_statistics','POST',{
		  		// 	pageNo:this.page,
		  		// 	length:this.limit,
		  		// 	startTime:this.startTime,
		  		// 	endTime:this.endTime
		  		// }).then(res=>{
		  		// 	if(res.data.error_code==0){
				// 		  let data = res.data.data;
				// 		  data.result.forEach(item=>{
				// 			  var nowTime = item.createTime;
				// 			  var thisTime = nowTime;
				// 			  thisTime = thisTime.replace(/-/g, '/');
				// 			  var time = new Date(thisTime);
				// 			  time = time.getTime();
				// 			//   let day  = 86400000;
				// 			//   let endTime = time - day;
				// 			  var date = new Date(time);
				// 			  var Y = date.getFullYear() + '-';
				// 			  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				// 			  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				// 			  item['startTime'] = Y+M+D+" 00:00:00"
				// 			  item['endTime'] = Y+M+D+" 23:59:59";
				// 		  })
		  		// 		this.tableData = data.result;
				// 		this.total = data.totalCount;
				// 		this.startNumber = data.sumStartCount;
				// 		this.passNumber = data.sumPassCount;
				// 		this.surplusNumber = data.sumSurplusCount;
		  		// 	}else{
		  		// 		this.$message({
				//             message:'获取失败',
				//             type:'error'
				//         })
		  		// 	}
		  		// }).catch(err=>{
		  		// 	this.$message({
			    //         message:'获取失败',
			    //         type:'error'
			    //     })
		  		// })
			},
			//选中的日期
			getSelectDate() {
				this.dataValue = "";
				if(this.selectDate!=null){
					this.startTime = this.selectDate[0];
					this.endTime = this.selectDate[1];
				}else{
					this.startTime = "";
					this.endTime = "";
				}
				this.getAccountInfo();
			},
			//删除
			deletegroup() {

			},
			// 表格头部背景颜色
			getHeaderClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if(rowIndex == 0) {
					return 'background:#ecf5ff;color:#57aaff;font-size:14px;height:50px;';
				} else {
					return ''
				}
			},
			cellStyle(){
				return 'height:40px;padding:0;font-size:12px;color:#888;'
			},
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.loading = true;
				this.getTabledataList();
			},
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	#group {
		background-color: #e8eff6;
		.main_wrapper {
			background: #fff;
		}
		.group-statistical {
			width: 290px;
			float: left;
			.item {
				width: 100%;
				height: 180px;
				padding-top: 60px;
				text-align: center;
				line-height: 45px;
				h2 {
					color: #409eff;
					font-size: 50px;
				}
				p{
					font-size: 14px;
					color: #666;
				}
			}
		}
		.close {
			position: absolute;
			right: 5px;
			top: 5px;
			font-size: 24px;
			cursor: pointer;
		}
		.header {
			line-height: 48px;
			font-size: 14px;
			background-color: #e1ebf4;
			border-radius: 4px;
			padding: 0 10px;
			text-align: center;
		}
		.content {
			line-height: 48px;
			font-size: 12px;
			padding: 10px;
			.list {
				max-height: 300px;
				overflow-y: auto;
				border: 1px solid #eee;
			}
		}
		.button {
			padding: 0 10px;
			text-align: center;
			border-top: 1px #ccc solid;
			.el-button {
				margin-top: 12px;
			}
		}
		.popup {
			z-index: 101;
			position: fixed;
			top: 30%;
			left: 40%;
			width: 400px;
			background-color: #fff;
			padding-bottom: 10px;
			border-radius: 4px;
		}
		.search {
			.title {
				padding: 40px 0px 30px;
				height: 45px;
				line-height: 45px;
				font-size: 18px;
				color: #333;
			}
			.data_wrapper {
				overflow: hidden;
				.el-date-editor {
					width: 300px;
					// height: 40px;
					height: 30px !important;
					font-size: 12px;
					float: left;
				}
				.el-button-right{
					margin-right: 20px;
					margin-left: 20px;
				}
				.el-button {
					float: right;
					// margin-top: 5px;
					// margin-right: 10px;
					height: 30px;
					width: 90px;
					font-size: 12px;
					line-height: 0;
					padding: 0;
				}
				.ele-select{
					margin-left: 20px;
				}
			}
		}
		.table_wrapper {
			.el-table {
				font-size: 12px;
				margin-top: 20px;
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
			margin-top: 20px;
			.el-pagination {
				padding-bottom: 240px;
			}
		}
	}
</style>
