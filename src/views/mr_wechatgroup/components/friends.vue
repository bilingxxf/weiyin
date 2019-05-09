<template>
	<div>
		<el-dialog
			title="选择好友"
			:visible.sync="value"
			:before-close="handleClose"
			class="code-modal"
			:max-height="420"
			width="825px">
			<div class="code-transfer mi-height">
				<section class="transfer-left">
					<div>
						<el-select size="small" class="ele-select"
							v-model="table.groupName"
							@change="page=1, init()" placeholder="请选择分组">
							<el-option v-if="groups.length>0" label="全部分组" value="全部分组"></el-option>
							<el-option
								v-for="(item,index) in groups"
								:key="index"
								:label="item.wx_user_group_name != '全部分组'? item.wx_user_group_name+'('+item.userName+')': item.wx_user_group_name"
								:value="item.wx_user_group_name != '全部分组'? item.wx_user_group_name+'('+item.userName+')'+item.wx_user_group_id: item.wx_user_group_name"></el-option>
						</el-select>

						<el-input
							class="ele-input"
							v-model="table.wxUserName"
							@change="page=1, init()"
							placeholder="请输入微信号或昵称查询"
							suffix-icon="el-icon-search" >
						</el-input>
					</div>
					<el-table  ref="singleTable"
						@current-change="handleSelectionChange"
						:data="groupList"
						class="ele-table-init"
						:max-height="420"
						v-loading="loading">
						<el-table-column prop="wx_username" label="微信号" align="left" width="165">
							<template slot-scope="scope">
								<el-popover trigger="hover" placement="top">
						          	<p>{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</p>
						          	<div slot="reference" class="no-wrap no-width">
										<span class="no-wrap">{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</span>
						          	</div>
						        </el-popover>
								<!--<span class="no-wrap">{{scope.row.wx_username}}</span>-->
							</template>
						</el-table-column>
						<el-table-column prop="group_name" label="分组" align="left" width="140"> </el-table-column>
						<el-table-column label="全部好友" align="left" >
							<template slot-scope="scope">
								<span class="getFriend"  @click="getFriends(scope.row)">全部好友</span>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination" v-if="total>10">
						<el-pagination
							@current-change="handleCurrentChange"
							@size-change="handleSizeChange"
							:page-sizes="[10, 20, 50]"
							:current-page="page"
							:page-size="pageSize"
							layout="sizes, total, prev, pager, next"
							:total="total"></el-pagination>
					</div>
				</section>
				<section class="transfer-center">
					<el-button type="primary" size="mini" ></el-button>
				</section>
				<!-- 右边 数据 -->
				<section class="transfer-right">
					<div class="edit-group">
						<span @click="deleteAllSelectors">清空全部</span>
					</div>
					<el-table ref="multipleTable"
						:data="selectorItems"
						class="ele-table-init"
						@selection-change="handleSelectionChange"
						:max-height="400">
						<el-table-column label="序号" width="60" align="left">
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
								<!--<span class="no-wrap">{{scope.row.wx_username}}</span>-->
							</template>
						</el-table-column>
						<el-table-column label="好友" align="left" width="80">
							<template slot-scope="scope">
								<span class="getFriend"  @click="getFriends(scope.row)">{{ scope.row.length }}个好友</span>
							</template>
						</el-table-column>
					</el-table>
					<div class="total-line" v-if="selectorItems.length">共 <span class="blue">{{ selectorItems.length}}</span> 条记录</div>
				</section>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button class="ele-btn" type="primary" @click="submitSelectors">确定</el-button>
				<el-button class="ele-default" @click="handleClose">取消</el-button>
			</div>
		</el-dialog>
		<!-- 筛选好友  -->
		<el-dialog title="筛选好友" :visible.sync="screenFriendShow" center class="screen-modal">
			<div class="modal">
				<el-table
					:select-on-indeterminate="true"
					ref="friendModal"
					:data="friendsIds"
					tooltip-effect="dark"
					style="width: 100%"
					:max-height="400"
					v-loading="friendsLoading"
					@selection-change="screenFriendHandle"
					>
					<el-table-column type="selection" width="55" align="left"> </el-table-column>
					<el-table-column label="微信号" width="230" align="left">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
					          	<p>{{ friendsList[scope.$index].contact_wxuser_name }}</p>
					          	<div slot="reference" class="no-wrap no-width">
					          		{{ friendsList[scope.$index].contact_wxuser_name }}
									<!--<span class="no-wrap">{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</span>-->
					          	</div>
					        </el-popover>
							<!--<span>{{ friendsList[scope.$index].contact_wxuser_name }}</span>-->
						</template>
					</el-table-column>
					<el-table-column prop="pass_time" label="添加时间" show-overflow-tooltip align="left">
						<template slot-scope="scope">
							<span>{{ friendsList[scope.$index].pass_time }}</span>
						</template>
					</el-table-column>
				</el-table>
				<!--<div class="pagination" v-if="ftotal!=0">
					<el-pagination
						@current-change="handleFCurrChange"
						@size-change="handleFSizeChange"
						:page-sizes="[10, 20, 50]"
						:current-page="fpage"
						:page-size="pageSize"
						layout="sizes, total, pager"
						:total="ftotal"></el-pagination>
				</div>-->
			</div>
			<span slot="footer" class="dialog-footer shai-firends">
		    	<el-button type="primary" @click="submitFriends">确 定</el-button>
		    	<el-button @click="calcelHandle">取 消</el-button>
		  </span>
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
	import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
	export default {
		data() {
			return {
				clearShow: false, // 是否清空好友
				friendsIds: [],
				selectorItemsIds: [],
				table: { groupName: '', wxUserName: '' },
				selectorItemsCenter: [],
				selectorItems: [],
				selectorIds: [],
				page: 1,
				pageSize: 10,
				total: 0,
				groups: [],
				loading: false,
				cacheGroupList: [],
				groupList:  [],  // 选择好友列表
				screenFriendShow: false,
				friendsList: [],  // 全部好友列表,
				friendsLoading: false,
				fpage: 1,
				ftotal: 0,
				c_item: [],
				itemWebName: null, // 点击每个微信的微信名称
			}
		},
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			selectors: {
				type: Array,
				default: () => []
			},
			value: {
				type: Boolean,
				default: false
			},
			webStyle: {
				type: String,
				default: null
			},
			totalGroup: {  // 按分组选择的分组列表
				type: Array,
				default: []
			}
		},
		mounted() {
			this.init()
			this.getGroupList()
		},
		watch: {
			selectors: {
				handler(newValue, oldValue) {
					this.selectors = newValue
					this.selectorItems = []  // 清空右边
					this.selectorItemsIds = []
					this.groupList = newValue
					this.total = this.groupList.length
					this.getGroupList()
					this.table =  { groupName: '', wxUserName: '' }
				},
				deep: true
			},
			totalGroup: {
				handler(newValue, oldValue) {
					this.totalGroup = newValue
					this.selectorItems = []
					this.selectorItemsIds = []
					if(this.totalGroup.length>0) {
						this.getGroupList()
					}
					this.table =  { groupName: '', wxUserName: '' }
				},
				deep: true
			},
			webStyle: {
				handler(newValue, oldValue) {
					if (newValue == '3') {
						this.groupList = this.selectors
						this.getGroupList()
						this.table =  { groupName: '', wxUserName: '' }
					} else if(newValue == '2') {
						this.table =  { groupName: '', wxUserName: '' }
						this.groups = this.totalGroup
						if(this.totalGroup.length>0) {
							this.getWebList()
						}else {
							this.groupList = []
							this.total = 0
						}
					} else {
						this.getGroupList()
						this.selectorItemsIds = []
						this.table =  { groupName: '', wxUserName: '' }
					}
				},
				deep: true
			},
		},
		methods: {
			handleClose() {
				this.$emit('change', false)
			},
			handleSelectionChange(items) {
				this.selectorItemsCenter = items
			},
			deleteSelectors(i) {
				this.selectorItems.splice(i, true)
				this.selectorIds.splice(i, true)
			},
			deleteAllSelectors() {
				if(this.selectorItems.length>0) {
					this.clearShow = true
				}else {
					this.$message.error('还没有选择微信号~~')
				}

//				this.selectorItems = []
//				this.selectorIds = []
//				this.friendsList.forEach((v,i) => {
//					this.$refs.friendModal.toggleRowSelection(this.$refs.friendModal.data[i],true);
//				})
			},
			submitSelectors() {
				this.$emit('returnValue', this.selectorItems)
				this.handleClose()
			},
			handleSizeChange(i) {
				this.page = 1
				this.pageSize = i
				this.init()
			},
			handleCurrentChange(i) {
				this.page = i
				this.init()
			},
			error(msg) {
				this.$message.error(msg || '获取列表失败')
			},
			getFriends(val) { // 获取微信下的所有好友
//				console.log(val)
				this.itemWebName = val
				this.screenFriendShow = true
				this.friendsLoading = true
				let params = {
					limit: 10000,
					page: this.fpage,
					wx_user_name: val.wx_username
				}

				this.$http('friends_list', 'POST', params).then(res => {
					if(res.data.error_code == 0) {
						this.friendsLoading = false
						this.friendsList = res.data.data.result
						this.friendsIds = this.friendsList.map((v, i) =>{
							return v.contact_wxuser_name
						})
						this.$nextTick(() => {
							const { wx_user_id } = val
							const { length } = this.selectorItems

							if (this.selectorItemsIds.includes(wx_user_id)) {

								for (let i = 0; i < length; i++) {
									if (this.selectorItems[i].wx_user_id == wx_user_id) {
										 this.selectorItems[i].contact_wxuser_arr.forEach(row => {
								            this.$refs.friendModal.toggleRowSelection(row);
								          });
										break
									}
								}
							} else {
								this.friendsList.forEach((v,i) => {
									this.$refs.friendModal.toggleRowSelection(this.$refs.friendModal.data[i],true);
								})
							}
						})
						this.ftotal = res.data.data.total_count
					}

				})
			},
			handleFSizeChange(i) {
				this.pageSize= i
				this.getFriends()
			},
			handleFCurrChange(i) {
				this.fpage = i
				this.getFriends()
			},
			submitFriends() { // 确定选取微信下的好友
				if (!this.c_item.length) return this.screenFriendShow = false
				if (this.selectorItemsIds.length) {
					const index = this.selectorItemsIds.indexOf(this.itemWebName.wx_user_id)
					if (index < 0) {
						this.selectorItemsIds.push(this.itemWebName.wx_user_id)
						this.selectorItems.push({
							wx_username: this.itemWebName.wx_username,
							wx_user_id: this.itemWebName.wx_user_id,
							contact_wxuser_arr: this.c_item,
							length: this.c_item.length
						})
					} else {
						this.selectorItems.splice(index, 1, {
							wx_username: this.itemWebName.wx_username,
							wx_user_id: this.itemWebName.wx_user_id,
							contact_wxuser_arr: this.c_item,
							length: this.c_item.length
						})
					}
				} else {
					this.selectorItemsIds.push(this.itemWebName.wx_user_id)
					this.selectorItems.push({
					wx_username: this.itemWebName.wx_username,
					wx_user_id: this.itemWebName.wx_user_id,
					contact_wxuser_arr: this.c_item,
					length: this.c_item.length
					})
				}
				this.screenFriendShow = false
//				this.$emit('returnValue',this.friendsList)

			},
			calcelHandle() {
				this.screenFriendShow = false
			},
			init() {  // 获取微信列表
				if(this.webStyle ==1) {
					this.loading = true
					let params = {
						pageNo: this.page,
						length: this.pageSize
					};
					if(this.table.groupName ==''  &&  this.table.wxUserName == '') {
						params['searchSign'] = 0;
						params['groupName'] = ''
					}else {
						params['searchSign'] = 1;
					}
					if( this.table.groupName=='全部分组' && this.table.wxUserName == ''){
						params['searchSign'] = 0;
					}
					if(this.table.groupName !='' && this.table.groupName!='全部分组'){
						params['groupName'] = this.table.groupName.split('(')[0]
					}
					if(this.table.wxUserName != '') {
						params['wxUserName'] = this.table.wxUserName;
					}

					this.$http("wx_user_list_search_key", "POST", params)
						.then(res => {
							if(res.data.error_code == 0) {
								this.loading = false
								this.total = res.data.data.total_count;
								this.groupList = res.data.data.result
							}else {
					            this.loading = true;
					            this.$message({
					              message: "获取列表失败:" + res.data.error_message,
					              type: "error"
					            });
					        }
					})
				}else if (this.webStyle == 2){
					if(this.table.groupName != '全部分组'){
						let ids = []
						this.groups.forEach((v,i) => { ids.push(v.wx_user_group_id) })
						let groupid = (this.table.groupName).split(')')[1]
						let params = {
							groupIds: groupid?groupid: ids.join(','),
							length: this.pageSize,
	  						pageNo: this.page,
							wxUsername: this.table.wxUserName  // 微信号搜索条件
						}
						this.$http('wx_wxuser/wxuser_by_groupids', 'POST', params)
						.then(res => {
							if(res.data.error_code == 0) {
								this.groupList = res.data.data.result
								this.total = res.data.data.total_count
//								console.log(res.data.data.total_count)
							}
						})
					}else {
						this.getWebList()
					}
				}else {
					let search = this.table.groupName.split('(')[0]
					let searchName = this.table.wxUserName
					let arrList = []
					let arrListName = []
					if (search || searchName) {
							this.groupList = this.selectors
							this.groupList.forEach((v,i) => {
								if(v.wx_user_group_name.indexOf(search)>=0 && v.wx_username.indexOf(searchName)>=0){
								   arrList.push(v)
								}
							})
							this.groupList = arrList
			        }
					if(search == "全部分组" && searchName=="") {
						this.groupList = this.selectors
					}else if(search == "全部分组" && searchName!=""){
						this.groupList = this.selectors
						this.groupList.forEach((v,i) => {
							if(v.wx_username.indexOf(searchName)>=0){
							   arrListName.push(v)
							}
							this.groupList = arrListName
						})
					}
				}
			},
			getGroupList() {  // 获取分组列表
				this.groups = []
				if(this.webStyle == 1) {
					let params = {
						page: this.page,
						limit: 99999
					}
					this.$http('wx_group/list', 'GET', params)
						.then(res=> {
							if (res.data.error_code === 0) {
				            	this.groups = [...res.data.data.result, ...this.groups]
				            	this.init()
				            } else {
				            	this.error(res.data.error_message)
				            }
						})

				}else if(this.webStyle == 2) {
					this.getWebList()
				}else {
					this.groupList = this.selectors  // 把选取的微信号放在表格中
					this.groups = this.selectors

					let groupsArr = []
					let obj = {}
					this.groups.forEach((v,i) => {
						v.wx_user_group_name = v.group_name
						if(!obj[v.wx_user_group_name]){
							groupsArr.push(v)
							obj[v.wx_user_group_name] = true;
						}
					})

					this.groups = groupsArr
					this.total = 0
				}
			},
			// 多分组获取微信列表
			getWebList() {
				//  获取微信列表
				this.groups = this.totalGroup
				let ids = []
				this.groups.forEach((v,i) => { ids.push(v.wx_user_group_id) })
				if(ids.length>0) {
					let params = {
						groupIds: ids.join(','),
						length: this.pageSize,
  						pageNo: this.page,
  						wxUsername: this.table.wxUserName
					}
					this.$http('wx_wxuser/wxuser_by_groupids', 'POST', params)
					.then(res => {
						if(res.data.error_code == 0) {
							this.groupList = res.data.data.result
							this.total = res.data.data.total_count
						}
					})
				}
			},
			submitClearHandle() {  // 清空弹框的确定按钮
				this.clearShow = false
				this.selectorItems = []
				this.selectorIds = []
				this.selectorItemsIds = []
				this.friendsList.forEach((v,i) => {
					this.$refs.friendModal.toggleRowSelection(this.$refs.friendModal.data[i],true);
				})
				this.$emit('returnValue', this.selectorItems)
			},
			closeClearHandle() {
				this.clearShow = false
			},
			screenFriendHandle(val) { // 筛选好友
				this.c_item = val
//				console.log(val)
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
	}
	.no-wrap{
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
			width: 20px;
			text-align: center;
			align-self: center;
			opacity: 0;
		}
		.transfer-right {
			width: 324px;
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
		.getFriend {
			color: #409eef;
			cursor: pointer;
			font-weight: 700;
			border: none;
			background: none;
			text-align: left;
		}
	}
	.screen-modal {
		.modal {
			max-height: 400px;
			overflow: auto;
		}
	}
	.blue {
		color: #409EEF;
		font-weight: 700;
	}
</style>
