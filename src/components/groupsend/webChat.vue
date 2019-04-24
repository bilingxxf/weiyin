<template>
	<div>
		<el-dialog 
			title="选择微信号" 
			:visible.sync="value" 
			:before-close="handleClose" 
			class="code-modal "
			min-height="200px"
			width="860px">
			<div class="code-transfer mi-height">
				<section class="transfer-left">
					<div>
						<el-select 
							size="small" 
							class="ele-select" 
							v-model="table.groupName"
							@change="page=1, getList()" 
							placeholder="全部分组" clearable>
							<el-option 
								v-for="item in groups" 
								:key="item.wx_user_group_name" 
								:label="item.wx_user_group_name" 
								:value="item.wx_user_group_name">
							</el-option>
						</el-select>
	
						<el-input 
							@change="page=1, getList()" 
							class="ele-input" 
							placeholder="请输入微信号或昵称查询" 
							suffix-icon="el-icon-search" 
							v-model="table.wxUserName">
						</el-input>
					</div>
					<el-table 
						ref="multipleTable" 
						@selection-change="handleSelectionChange" 
						:data="groupList" 
						class="ele-table-init" 
						:max-height="420" 
						v-loading="loading">
						<el-table-column type="selection" fixed></el-table-column>
						<el-table-column label="微信号" align="left">
							<template slot-scope="scope">
								<el-popover trigger="hover" placement="top">
						          	<p>{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</p>
						          	<div slot="reference" class="no-wrap no-width">
										<span class="no-wrap">{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</span>
						          	</div>
						        </el-popover>
							</template>
						</el-table-column>
						<el-table-column prop="group_name" label="分组" align="left" width="120">
						</el-table-column>
						<el-table-column prop="phone" label="手机号" align="right"></el-table-column>
					</el-table>
					<div class="pagination" v-if="total!=0">
						<el-pagination 
							@current-change="handleCurrentChange"
							@size-change="handleSizeChange" 
							:page-sizes="[10, 20, 50]" 
							:current-page="page" 
							:page-size="pageSize" 
							layout="sizes, total,prev,pager, next" 
							:total="total">
						</el-pagination>
					</div>
				</section>
				<section class="transfer-center">
					<el-button type="primary" icon="el-icon-d-arrow-right" size="mini" @click="transferRight"></el-button>
				</section>
				<section class="transfer-right">
					<div class="edit-group">
						<span @click="deleteAllSelectors">清空全部</span>
					</div>
					<el-table 
						ref="multipleTable" 
						:data="selectorItems" 
						class="ele-table-init"
						:min-height="200"
						:max-height="420">
						<el-table-column label="序号" width="70">
							<template slot-scope="scope">
								<span>{{scope.$index+1}}</span>
							</template>
						</el-table-column>
						<el-table-column label="微信号" align="left">
							<template slot-scope="scope">
								<el-popover trigger="hover" placement="top">
						          	<p>{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</p>
						          	<div slot="reference" class="no-wrap no-width">
										<span class="no-wrap">{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</span>
						          	</div>
						        </el-popover>
								<!--<span>{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</span>-->
							</template>
						</el-table-column>
						<el-table-column label="操作" align="right" width="100">
							<template slot-scope="scope">
								<a @click="deleteSelectors(scope.$index)">删除</a>
							</template>
						</el-table-column>
					</el-table>
					<div class="total-line" v-if="selectorItems.length">共 <span class="blue">{{ selectorItems.length }}</span> 条记录</div>
				</section>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button class="ele-btn" type="primary" @click="submitSelectors">确定</el-button>
				<el-button class="ele-default" @click="handleClose">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog 
			title="是否清空？" 
			:visible.sync="clearShow" 
			class="clear-dialog"
			>
			<div class="code-transfer">
				<p>是否清空所选数据？</p>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button class="ele-btn" type="primary" @click="submitClearHandle">确定</el-button>
				<el-button class="ele-default" @click="closeClearHandle">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import API from '@/api/apis'
	export default {
		data() {
			return {
				clearShow: false,
				table: {
					wxUserName: '',
					groupName: ''
				},
				selectorItemsCenter: [],
				selectorItems: [],
				selectorIds: [],
				page: 1,
				pageSize: 10,
				total: 0,
				groups: [{
					wx_user_group_name: '全部分组',
					wx_user_group_id: null
				}],
				loading: false,
				cacheGroupList: [],
				groupList: []
			}
		},
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			selectors: {
				type: Array,
				default: []
			},
			value: {
				type: Boolean,
				default: false
			}
		},
		created() {
			this.getGroupList()
			this.getList()
		},
		watch: {
			selectors: {
				handler(newValue, oldValue) {
					this.selectorItems = newValue
					this.selectorItemsCenter = []
					this.selectorIds = []
					this.transferRight()
					this.$emit('returnIds', this.selectorIds)
					// this.filterLeftData()
				},
				deep: true
			}
		},
		methods: {
			handleClose() {
				this.$emit('change', false)
			},
			handleSelectionChange(items) {
				this.selectorItemsCenter = items
			},
			transferRight() {
				this.selectorItems = [...this.selectorItems, ...this.selectorItemsCenter]
				this.selectorItems.map((v) => {
					if(!this.selectorIds.includes(v.wx_user_id)) this.selectorIds.push(v.wx_user_id)
				})
				this.filterLeftData()
			},
			deleteSelectors(i) {
				this.selectorItems.splice(i, true)
				this.selectorIds.splice(i, true)
				this.filterLeftData()
			},
			deleteAllSelectors() {
				if(this.selectorItems.length) {
					this.clearShow = true
				}else {
					this.$message.error('还没有选择微信号~~')
				}
				
//				this.selectorItems = []
//				this.selectorIds = []
//				this.groupList = [...this.cacheGroupList]
			},
			submitSelectors() {
				this.$emit('returnValue', this.selectorItems)
				this.handleClose()
			},
			submitClearHandle() {  // 关掉清空弹框
				this.selectorItems = []
				this.selectorIds = []
				this.groupList = [...this.cacheGroupList]
				this.clearShow = false
				this.$emit('returnValue', this.selectorItems)
//				this.handleClose()
			},
			closeClearHandle() {
				this.clearShow = false
			},
			filterLeftData() {
				if(!this.selectorIds.length) {
					this.groupList = [...this.cacheGroupList]
				} else {
					this.groupList = this.cacheGroupList.filter((item) => {
						return !this.selectorIds.includes(item.wx_user_id)
					})
				}
			},
			handleSizeChange(i) {
				this.pageSize = i
				this.page = 1
				this.getList()
			},
			handleCurrentChange(i) {
				this.page = i
				this.getList()
			},
			error(msg) {
				this.$message.error(msg || '获取列表失败')
			},
			getGroupList() {
				API.group_list({
						limit: 99999,
						page: 1
					}).then(res => {
						if(res.data.error_code === 0) {
							this.groups = [...res.data.data.result, ...this.groups]
						} else {
							this.error(res.data.error_message)
						}
					})
					.catch(err => {});
			},
			getList() {
				this.loading = true
				const parmas = {
					...{
						pageNo: this.page,
						length: this.pageSize,
						searchSign: 0,
						isOnline: 1
					},
					...this.table
				}
				if(this.table.groupName === '全部分组') {
					parmas.groupName = null
					parmas.searchSign = 0
				} else if(this.table.groupName != '') {
					parmas.searchSign = 1
				}
				if(this.table.wxUserName != '') {
					parmas.searchSign = 1
				}
				API.wx_list(parmas).then(res => {
					if(res.data.error_code == 0) {
						this.loading = false;
						this.total = res.data.data.total_count
						this.groupList = res.data.data.result
						this.cacheGroupList = res.data.data.result
						this.filterLeftData()
					} else {
						this.error(res.data.error_message);
					}
				}).catch((err) => {
					this.error()
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.dialog-footer {
		text-align: center;
		margin-top: 15px;
	}
	
	.code-modal {
		.el-dialog {
			width: 1000px;
		}
		input::-webkit-input-placeholder {
			color: #000000;
		}
		input:-moz-input-placeholder {
			color: #000000;
		}
		input::-moz-input-placeholder {
			color: #000000;
		}
		input::-ms-input-placeholder {
			color: #000000;
		}
	}
	
	.code-transfer {
		display: flex;
		overflow: hidden;
		>section {
			float: left;
		}
		.transfer-left,
		.transfer-right {
			width: 442px;
			background: #fff;
			padding: 20px;
			border-radius: 4px;
		}
		.transfer-center {
			width: 67px;
			text-align: center;
			align-self: center
		}
		.transfer-right {
			width: 312px;
			.edit-group {
				padding: 0 1px;
				margin-top: 17px;
				display: block;
				text-align: right;
			}
			a {
				cursor: pointer;
				color: #409eff
			}
		}
		.el-table {
			border: 1px solid #E5E8F1;
		}
	}
	.blue {
		color: #409EEF;
		font-weight: 700;
	}
	.no-width {
		width: auto !important; 
	}
</style>