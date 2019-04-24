<template>
	<div class="panel p-content material main-body" >
		<div class="material-content main-wrapper" style="background:#fff">
			<div class="page-title">
				<span>任务信息</span>
			</div>
			<div style="margin-bottom:20px;" class="vertical-line">
				<el-input
				@change="page=1, getGroupList()"
				class="ele-input"
				placeholder="请输入任务名称模糊查询"
				suffix-icon="el-icon-search"
				v-model="table.planName"
				></el-input>

				<el-select
				size="small"
				class="ele-select"
				@change="page=1, getGroupList()"
				v-model="table.planStatus"
				placeholder="请选择任务状态"
				clearable
				>
				<el-option
					v-for="item in statusList"
					:key="item.name"
					:label="item.name"
					:value="item.status"
				></el-option>
				</el-select>

				<el-button style="float: right" type="primary" size="mini" @click="showCreateTask = true">创建任务</el-button>
			</div>
			<div class="edit-group">
				<span>批量操作：</span>
				<span class="edit-btn" @click="getGroupList">刷新</span>
			</div>

			<div class="table_wrapper">
				<el-table
					ref="multipleTable"
					@selection-change="handleSelectionChange"
					:data="groupList"
					class="ele-table-init"
					v-loading="loading">
					<el-table-column type="selection" fixed>
					</el-table-column>

					<el-table-column label="序号" align="left" width="60">
						<template slot-scope="scope">
							<span>{{scope.$index+(page - 1) * pageSize + 1}} </span>
						</template>
					</el-table-column>
					<el-table-column label="任务名称" align="left" width="200">
						<template slot-scope="scope">
							<span>{{ scope.row.planParams['planName'] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" align="left" width="200">
						<template slot-scope="scope">
							<span>{{ scope.row.planParams['create_time'] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="执行时间" align="left" width="200">
						<template slot-scope="scope">
							<span>{{ scope.row.planParams['execute_time'] }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="wx_count" label="微信号数量" align="center" width="200">
						<template slot-scope="scope">
							<span>{{ scope.row.planParams['wxUserId'].length }}</span>
						</template>
					</el-table-column>
					<el-table-column label="url" align="left" width="240">
					<template slot-scope="scope">
						<span class="edit-btn" @click="showCode(scope.row.planParams['key'])">查看详情</span>
					</template>
					</el-table-column>
					<el-table-column label="状态" align="left" width="60">
						<template slot-scope="scope">
							<span>{{ status[scope.row.planStatus] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="right">
					<template slot-scope="scope">
						<span class="edit-btn" @click="showTaskContent = true, planId=scope.row.planId, currentTaskKey = scope.row.planParams['key']">任务详情</span>
						<span class="edit-btn" v-if= "scope.row.planStatus === 1" @click="showModel(scope.row, scope.$index, 2)">继续</span>
						<span class="edit-btn" v-if= "scope.row.planStatus === 0" @click="showModel(scope.row, scope.$index, 2)">暂停</span>
						<span class="edit-btn no-margin" style="color: red" @click="showModel(scope.row, scope.$index, 1)">删除</span>
					</template>
					</el-table-column>
					<el-table-column width="20"></el-table-column>
				</el-table>
				<div class="pagination" v-if="total!=0">
					<el-pagination
					@current-change="handleCurrentChange"
					:current-page="page"
					:page-size="pageSize"
					layout="total, prev, pager, next"
					:total="total"
					></el-pagination>
				</div>
			</div>
		</div>

		<Task v-model="showTaskContent" :taskKey = 'currentTaskKey' :planId = "planId" />
		<CreateTask v-model="showCreateTask" @refresh="getGroupList" :success="showCode" />
		<Code v-model="showCodeModal" :link="codeLink" />
	</div>
</template>

<script>
import Task from "@/components/aggregation/task"
import CreateTask from "@/components/aggregation/create"
import Code from "@/components/aggregation/code"
import API from '@/api/apis'
export default {
	data() {
		return {
			table: {
				planName: '',
				planStatus: ''
			},
			planId: null,
			page: 1,
			pageSize: 10,
			status:[
				'进行中',
				'暂停',
				'',
				'已完成'
			],
			statusList: [{
				name: '所有',
				status: ''
			},{
				name: '进行中',
				status: 0
			},{
				name: '暂停',
				status: 1
			},{
				name: '已完成',
				status: 3
			}],
			codeLink: '',
			loading: false,
			groupList: [],
			page: 1,
			pageSize: 10,
			total: 0,
			showTaskContent: false,
			showCreateTask: false,
			showCodeModal: false,
			currentTaskKey: ''
		}
	},
	components: {
		Task,
		CreateTask,
		Code
	},
	methods: {
		handleSelectionChange() {},
		handleCurrentChange(i) {
			this.page = i
			this.getGroupList()
		},
		toggleTask (item, index) {
			const status = item.planStatus === 0 ? 1: 0
			API.task_status({
				planId: item.planId,
				status
			}).then(res => {
				if (res.data.error_code === 0) {
					this.$redis.string.set({
						key: `QA_status_${item.planParams.key}`,
						value: status.toString()
					})
					this.groupList[index].planStatus = status
					this.$message.success('操作成功')
				}
			})
		},
		showModel (item, index, status) {
			let text
			let callback
			if (status === 1) {
				text = '删除'
				callback = this.deleteTask
			} else {
				text = item.planStatus ? '继续': '暂停'
				callback = this.toggleTask
			}
			this.$alert(`确认${text}吗？`, text, {
				customClass: 'element-modal',
				confirmButtonText: '确定',
				showCancelButton: true,
				callback: action => {
					if (action === 'confirm') callback(item, index)
				}
			});
		},
		deleteTask (item, index) {
			API.task_delete({
				planId: item.planId
			}).then(res => {
				if (res.data.error_code === 0) {
					const { key } = item.planParams
					this.$redis.string.del(`QA_status_${key}`)
					this.$redis.string.del(`QA_start_${key}`)
					this.$redis.zset.del(`QA_wxids_${key}`)
					this.$redis.zset.del(`QA_added_${key}`)
					this.$message.success('删除成功')
				}
				if (this.groupList.length === 1) {
					this.page = this.page > 1 ? (this.page - 1) : 1
				}
				this.getGroupList()
			})
			
		},
		getGroupList () {
			this.loading = true
			API.plan_list({
				length: this.pageSize,
				pageNo: this.page,
				templateName: "二维码聚合",
				...this.table
			}).then((res) => {
				this.loading = false
				if(res.data.error_code === 0) {
					const { result, total_count } = res.data.data
					this.groupList = result.map((v, i) => {
						v.planParams = JSON.parse(v.planParams)
						return v
					})
					this.total = total_count
				}
			}).catch(() => {
				this.loading = false
				this.$message.error('获取列表失败')
			})
		},
		showCode (key) {
			this.codeLink = `${location.origin}/static/html/index.html?timestr=${key}`
			this.showCodeModal = true
		}
	},
	created() {
		this.getGroupList()
	},
	mounted() {}
}
</script>
