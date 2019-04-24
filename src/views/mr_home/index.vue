<template>
	<div class="home">
		<h3 class="top-tips"><i></i>请注意本页面账号到期的时间并及时调整，以免影响您的业务。</h3>
		<section class="port">
			<div class="residue col">
				<p>可用端口</p>
				<span>{{cloud}}</span>
			</div>
			<div class="used col">
				<p>剩余端口</p>
				<span>{{under}}</span>
			</div>
			<!--<router-link to="record">查看上号记录</router-link>-->
			<a  @click="toRecord()">查看上号记录</a>
		</section>
		<h4>新增端口</h4>
		<div class="siberian">
			<el-input style="width: 600px;" v-model="camilo" placeholder="请在此输入卡密"></el-input>
			<template>
				<el-button type="primary" class="filter-item" @click="modalShow">立即兑换</el-button>
			</template>
		</div>
		<h4>端口统计</h4>
		<div class="search">
			<div class="input">
				<el-input style="width: 350px;" placeholder="请输入账号名称/微信号" v-model="search">
				</el-input>
				<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
			</div>
			<!-- <div class="fr">
				<el-button class="filter-item" type="primary" @click='renewal'>批量续费</el-button>
			</div> -->
		</div>
		<div class="info">
			<el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="80">
				</el-table-column>
				<el-table-column align="center" label='序号' width="100">
					<template slot-scope="scope">
						{{scope.row.serial_number}}
					</template>
				</el-table-column>
				<el-table-column label="到期时间" align="center">
					<template slot-scope="scope">
						<i class="el-icon-time"></i> {{scope.row.due_time}}
					</template>
				</el-table-column>
				<el-table-column label="上号数" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.shareIcon" alt="">{{scope.row.count}}
					</template>
				</el-table-column>
				<el-table-column label="帐号详情" width="" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size='mini' plain @click="handleDetail(scope.row)">查看</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="created_at" label="操作">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" plain @click="remindShow=!remindShow">续费</el-button>
						<el-button size="mini" type="success" @click="dueShow=!dueShow" plain>到期提醒</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="p-pagination">
				<el-pagination  @current-change="handleCurrentChange" :current-page="currentPage1" :page-size="5" layout="total, prev, pager, next" :total='dataLength' align="center">
				</el-pagination>
			</div>
		</div>
		<!-- 弹框 -->
		 <transition-group name="fade">
			<div class="modal" v-show="camiloShow" :key="1">
				<div class="mask"></div>
				<div class="camilo">
					<div class="modal-header">
						<h2>提示<span @click="camiloShow= false">x</span></h2>
					</div>
					<div class="modal-body">
						{{this.modaltxt}}
					</div>
					<div class="modal-footer">
						<el-button plain type="primary" @click="camiloShow= false">关闭</el-button>
					</div>
				</div>
			</div>
			<!-- <div class="modal" v-show="renewalShow" :key="2">
				<div class="mask"></div>
				<div class="camilo">
					<div class="modal-header">
						<h2>提示<span @click="renewalShow= false">x</span></h2>
					</div>
					<div class="modal-body">
						{{this.renewaltxt}}
					</div>
					<div class="modal-footer" v-show="hasSelect">
						<el-button plain type="success" @click="renewalShow= false">确认</el-button>
						<el-button plain type="primary" @click="renewalShow= false">关闭</el-button>
					</div>
					<div class="modal-footer" v-show="!hasSelect">
						<el-button plain type="primary" @click="renewalShow= false">关闭</el-button>
					</div>

				</div>
			</div> -->
			<div class="modal" v-show="detailShow" :key="3">
				<div class="mask"></div>
				<div class="detail">
					<div class="modal-header">
						<h2>账号详情<span @click="detailShow= false">x</span></h2>
					</div>

					<div class="input">
						<el-input style="width: 350px;" v-model="detailIpt" placeholder="请输入账号名称/微信号"></el-input>
						<el-button class="filter-item" type="primary" icon="el-icon-search" @click="detailSearch">搜索</el-button>
					</div>
					<div class="modal-body">
						<el-table :data="detailData" height="300">
							<el-table-column prop="id" label="序号">
							</el-table-column>
							<el-table-column prop="wx_nickname" label="帐户名">
							</el-table-column>
							<el-table-column prop="wx_username" label="微信名">
							</el-table-column>
							<el-table-column prop="status" label="状态">
								<template slot-scope="scope">
									<el-button type="text" v-if="scope.row.type==1">登陆</el-button>
				        			<el-button type="text" v-if="scope.row.type==2">下线</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="modal-footer" v-show="!hasSelect">
						<el-button plain type="primary" @click="detailShow= false">关闭</el-button>
					</div>

				</div>
			</div>
			
			
			<div class="modal" v-show="remindShow" :key="4">
				<div class="mask"></div>
				<div class="balance">
					<div class="modal-header">
						<h2>余额<span @click="remindShow= false">x</span></h2>
					</div>
					<div class="remainingPort">
						剩余上号额度：{{port}}个
					</div>
					<div class="input">
						<el-input style="width: 350px;" placeholder="请输入账号名称/微信号"></el-input>
						<el-button class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
					</div>
					<div class="modal-body">
						<el-table ref="multipleTable" :data="tableData" height="250" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
							>
							<el-table-column type="selection">
							</el-table-column>
							<el-table-column prop="date" label="帐户名">
							</el-table-column>
							<el-table-column prop="name" label="状态">
							</el-table-column>
							<el-table-column prop="address" label="到期提醒">
							</el-table-column>
						</el-table>
					</div>
					<div class="modal-footer" v-show="!hasSelect">
						<el-button plain type="success" @click="remindShow= false">确认续费</el-button>
						<el-button plain type="primary" @click="remindShow= false"> 关闭 </el-button>
					</div>

				</div>
			</div>
			
			
			<div class="modal" v-show="dueShow" :key="5">
				<div class="mask"></div>
				<div class="balance">
					<div class="modal-header">
						<h2>到期提醒<span @click="dueShow= false">x</span></h2>
					</div>
					<div class="remainingPort">
						剩余上号额度：{{port}}个
					</div>
					<div class="input">
						<el-input style="width: 350px;" placeholder="请输入账号名称/微信号"></el-input>
						<el-button class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
					</div>
					<div class="modal-body">
						<el-table ref="multipleTable" :data="tableData" height="250" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
							>
							<el-table-column type="selection">
							</el-table-column>
							<el-table-column prop="date" label="帐户名">
							</el-table-column>
							<el-table-column prop="address" label="状态">
							</el-table-column>
							<el-table-column prop="address" label="到期提醒">
							</el-table-column>
						</el-table>
					</div>
					<div class="modal-footer" v-show="!hasSelect">
						<el-button plain type="success" @click="dueShow= false">开启到期提醒</el-button>
						<el-button plain type="primary" @click="dueShow= false">关闭到期提醒</el-button>
					</div>

				</div>
			</div>
		 </transition-group>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				total: 100,
				camiloShow: false,
				renewalShow: false,
				detailShow: false,
				remindShow: false,
				dueShow: false,
				camilo: '',
				modaltxt: '',
				renewaltxt: '',
				hasSelect: false,
				hasDialog: false,
				port: 0,
				currentPage1: 1,
				dataLength: 0,
				page: 1,
				per_page: 5,
				detailData: [],
				detailIpt:'',
				missionId:'',
				search: '',
				cloud: '',
				under: '',
				tableData: [{
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市'
				  }, {
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市'
				  }, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市'
				  }, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市'
				  }, {
					date: '2016-05-08',
					name: '王小虎',
					address: '上海市'
				  }, {
					date: '2016-05-06',
					name: '王小虎',
					address: '上海市'
				  }, {
					date: '2016-05-07',
					name: '王小虎',
					address: '上海市'
				}]
			};
		},
		mounted() {
			this.getInit();
			this.cloudPoint();
			this.usePoint();
		},
		created() {
			this.listLoading = false
		},
		methods: {
			//剩余云点
			cloudPoint(){
				
			},
			//使用云点
			usePoint(){
				
			},
			//首页搜索
			handleSearch(){
				
			},
			//查看
			handleDetail(info){
				
			},
			detailSearch(){
			},
			//分页
			getInit() {
			},
			handleCurrentChange(val) {
				this.page = val;
			},
			//卡密
			modalShow() {
				if(this.camilo == '') {
					this.modaltxt = '请输入卡密'
					this.camiloOpen()
				} else {
					this.$totalHttp.post('/index/voucher/recharge',{
						voucher_code:this.camilo,
						user_id:localStorage.getItem('user_id')
					}).then((res) => {
							this.modaltxt = res.data.error_message;
							this.camiloOpen()
					}).catch(err => {
						this.modaltxt = res.data.error_message;
						this.camiloOpen()
					})
				}
			},
			camiloOpen() {
				this.camiloShow = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// renewal() {
			// 	this.renewalShow = true
			// 	if(this.multipleSelection) {
			// 		this.hasSelect = true;
			// 		let count = 0;
			// 		for(let i = 0; i < this.multipleSelection.length; i++) {
			// 			count += this.multipleSelection[i].count;
			// 		}
			// 		this.renewaltxt = '已选账号：' + count + '个，请确认是否批量续费30天？'
			// 	} else {
			// 		this.renewaltxt = '没有选择的续费记录！'
			// 	}

			// },
			duesShow() {
				this.dueShow = true;
				this.hasDialog = true;
			},
			toRecord(){
				this.$router.push('/mr_record')
			}

		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.home {
		padding:15px;
		color: #73879c;
		background-color: #fff;
		.top-tips {
			font-size: 15px;
			color: #73879c;
			i {
				display: inline-block;
				width: 26px;
				height: 26px;
				vertical-align: middle;
				margin-right: 5px;
				transform: translateY(-2px);
			}
		}
		.port {
			margin-top: 30px;
			display: flex;
			justify-content: space-around;
			padding: 10px 0 10px;
			.col {
				width: 230px;
				text-align: center;
			}
			span {
				display: block;
				height: 70px;
				line-height: 70px;
				margin-top: 10px;
				font-size: 40px;
				text-align: center;
				color: #73879c;
			}
			>a {
				cursor: pointer;
				height: 30px;
				background: #409EFF;
				color: #fff;
				padding: 0 10px;
				font-size: 12px;
				line-height: 30px;
				border-radius: 3px;
				margin-top: 35px;
			}
		}
		h4 {
			font-size: 20px;
			line-height: 45px;
			border-radius: 5px;
			background-color: #e1ebf4;
			padding-left: 20px;
			margin: 20px 0;
		}
		.siberian {
			padding: 0 50px;
			.filter-item{
				margin-left: 5px;
			}
		}
		.search {
			margin-bottom: 20px;
			padding: 0 50px;
			.input {
				border-radius: 10px;
				display: inline-block;
				position: relative;
				i {
					position: absolute;
					height: 100%;
					width: 30px;
					right: 0;
					top: 0;
				}
			}
			.filter-item{
				margin-left: 5px;
			}
		}
		.info {
			margin: 0 50px;
			border:1px solid #eee;
			border-radius: 4px;
		}
		.pagination-container {
			padding: 35px 0 50px;
		}
		.modal{
			// background: red;
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
		.mask {
			/*width: 100%;*/
			/*min-height: 100%;*/
			background: #000;
			opacity: 0.5;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 10;
		}
		.camilo {
			position: absolute;
			top: 45%;
			left: 45%;
			z-index: 15;
			width: 300px;
			background: #fff;
			box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
			border-radius: 5px;
			.modal-header {
				position: relative;
				padding: 10px 15px;
				background: #e1ebf4;
				color: #2a3f54;
				text-align: center;
				border-radius: 6px 6px 0 0;
				border-bottom: 1px solid #e5e5e5;
				h2 {
					font-size: 18px;
					position: relative;
					line-height: 25px;
					span {
						position: absolute;
						right: 0px;
						cursor: pointer;
						padding: 0px 10px;
					}
				}
			}
			.modal-body {
				padding: 15px 0;
				line-height: 20px;
				text-align: center;
				font-size: 14px;
				color: #73879c;
				border-bottom: 1px solid #e5e5e5;
			}
			.modal-footer {
				padding: 15px 0;
				line-height: 20px;
				text-align: center;
				font-size: 14px;
				color: #73879c;
				border-bottom: 1px solid #e5e5e5;
			}
		}
		.detail {
			position: absolute;
			top: 25%;
			left: 40%;
			z-index: 15;
			width: 500px;
			background: #fff;
			box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
			border-radius: 5px;
			.modal-header {
				position: relative;
				padding: 10px 15px;
				background: #e1ebf4;
				color: #2a3f54;
				text-align: center;
				border-radius: 6px 6px 0 0;
				border-bottom: 1px solid #e5e5e5;
				h2 {
					font-size: 18px;
					position: relative;
					line-height: 25px;
					span {
						position: absolute;
						right: 10px;
						cursor: pointer;
						padding: 0px 10px;
					}
				}
			}
			.input {
				padding: 15px 15px 0;
				position: relative;
				.filter-item {
					position: absolute;
					right: 15px;
				}
			}
			.modal-body {
				padding: 15px 15px;
				line-height: 20px;
				text-align: center;
				font-size: 14px;
				color: #73879c;
				border-bottom: 1px solid #e5e5e5;
			}
			.modal-footer {
				padding: 15px 0;
				line-height: 20px;
				text-align: center;
				font-size: 14px;
				color: #73879c;
				border-bottom: 1px solid #e5e5e5;
			}
		}
		.balance {
			position: absolute;
			top: 25%;
			left: 40%;
			z-index: 15;
			width: 500px;
			background: #fff;
			box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
			border-radius: 5px;
			.modal-header {
				position: relative;
				padding: 10px 15px;
				background: #e1ebf4;
				color: #2a3f54;
				text-align: center;
				border-radius: 6px 6px 0 0;
				border-bottom: 1px solid #e5e5e5;
				h2 {
					font-size: 18px;
					position: relative;
					line-height: 25px;
					span {
						position: absolute;
						right: 10px;
						cursor: pointer;
						padding: 0px 10px;
					}
				}
			}
			.remainingPort {
				padding: 15px;
			}
			.input {
				padding: 15px 15px 0;
				position: relative;
				.filter-item {
					position: absolute;
					right: 15px;
				}
			}
			.modal-body {
				padding: 15px 15px;
				line-height: 20px;
				text-align: center;
				font-size: 14px;
				color: #73879c;
				border-bottom: 1px solid #e5e5e5;
			}
			.modal-footer {
				padding: 15px 0;
				line-height: 20px;
				text-align: center;
				font-size: 14px;
				color: #73879c;
				border-bottom: 1px solid #e5e5e5;
			}
		}
		.fade-enter-active,
		.fade-leave-active {
			transition: opacity .2s;
		}
		.p-pagination{
			padding: 15px 0;
		}
		.fade-enter-active, .fade-leave-active {
		  transition: opacity .5s;
		}
	}
</style>