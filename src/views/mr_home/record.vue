<template>
	<div class="record">
		<div class="title">
			<span class="type">类型</span>
			<el-select v-model="expendType" placeholder="请选择" @change="getType">
				<el-option v-for="item in expendOptions" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="main">
			<div v-for="(item, index) in list" :key="index" class="info-wrapper">
				<span></span>
				<div class="info-date">
					<el-col :span="24">
						<div class="grid-content">{{item.name}}</div>
					</el-col>
				</div>
				<div v-for="(info, index) in item.foods" :key="index" class="info-message">
					<el-row :gutter="20">
						<el-col :span="6">
							<div>{{info.name}}</div>
						</el-col>
						<el-col :span="8" align="center">
							<div><i v-if="!info.nickname">{{info.user_name}}</i><i v-if="info.nickname">{{info.nickname}}</i>({{info.day}}天)</div>
						</el-col>
						<el-col :span="10" align="center">
							<div>
								<el-col :span="10">
									<div class="reduce"><i v-if="info.status==='2'">+</i><i v-if="info.status==='1'">-</i>{{info.port}}云点</div>
								</el-col>
								<el-col :span="14">
									<div class="port">剩余: {{info.balance}} 云点</div>
								</el-col>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="p-pagination">
			<el-pagination  @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="5" layout="total, prev, pager, next" :total='dataLength' align="center">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				expendOptions: [{
					value: '0',
					label: '全部'
				}, {
					value: '2',
					label: '充值'
				}, {
					value: '1',
					label: '消耗'
				}],
				expendType: '0',
				currentPage: 1,
				dataLength: 0,
				page: 1,
				limit: 5,
				list: [],
			}
		},
		mounted() {
			this.getInit()
		},
		methods: {
			//云点消耗类型
			getType() {
				this.getInit();
			},
			//分页
			getInit() {
				
			},
			//跳转的页数
			handleCurrentChange(val) {
				this.page = val;
//				this.getInit()
			},
		}
	};
</script>

<style lang="scss" scoped>
	.record {
		padding: 0 15px;
		font-size: 14px;
		color: #73879c;
		background-color: #fff;
		.title {
			padding: 30px 15px;
			.type {
				padding-right: 20px;
			}
		}
		.main {
			padding: 0 20px;
			.info-wrapper {
				span {
					display: inline-block;
					width: 5px;
					height: 5px;
					background: #58bc9c;
					vertical-align: middle;
					border-radius: 50%;
					position: relative;
					left: -2.5px;
				}
				.info-date {
					display: inline-block;
					vertical-align: middle;
					padding-left: 15px;
					line-height: 30px;
					.grid-content {
						color: #58bc9c;
					}
				}
				.info-message {
					line-height: 40px;
					border-left: 1px solid #58bc9c;
					padding-left: 50px;
					color: #2a3f54;
					.reduce {
						color: #c30d23
					}
				}
			}
		}
		.p-pagination {
			padding: 35px 0 50px;
		}
	}
</style>