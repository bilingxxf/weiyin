<template>
	<el-dialog
    title="任务详情"
    :visible.sync="value"
    :before-close="handleClose"
    class="table-modal"
    width="580px">
    <el-table
        ref="multipleTable"
        :data="groupList"
        class="ele-table-init"
        :max-height = "400"
        :loading = "loading"
        >
        <el-table-column label="微信号" align="center" width="200">
          <template slot-scope="scope">
          <span>{{scope.row.value.wx_username + (scope.row.value.nickname ? `(${scope.row.value.nickname})` : '')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="好友" align="center" width="200">
          <template slot-scope="scope">
          <span>{{(scope.row.value.friendUsername || '')  + (scope.row.value.friendNickName ? `(${scope.row.value.friendNickName})` : '')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
        <template slot-scope="scope">
            <span class="edit-btn no-margin" @click="deleteCode(scope.row.score, scope.$index)" v-if="toggleId === scope.$index">切换</span>
        </template>
        </el-table-column>
        <el-table-column width="20"></el-table-column>
      </el-table>
       <div class="total-line">{{ groupList.length ? `共 ${groupList.length} 条记录` : '' }}</div>
       <div slot="footer" class="dialog-footer">
        <el-button class="ele-btn" type="primary" @click="handleClose">确定</el-button>
      </div>
  </el-dialog>
</template>

<script>
  import API from '@/api/apis'
	export default{
    data() {
      return {
        groupList: [],
        loading: false,
        toggleId: null
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      taskKey: {
        type: String,
        default: ''
      },
      planId: {
        type: Number
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(newVal) {
        if (newVal) {
          this.loading = true
          this.getList()
        }
      },
      // taskKey() {
      //   this.loading = true
      //   this.getList()
      // }
    },
    methods: {
      handleClose() {
        this.$emit('change', false)
      },
      deleteCode(score, index) {
        this.$redis.zset.score_rem({
          key: `QA_wxids_${this.taskKey}`,
          score
        }).then(res => {
          if (res.data.error_code === 0) {
            this.groupList[index].value.status = 1
            if (index === (this.groupList.length - 1)) {
              this.$redis.string.set({
                key: `QA_status_${this.taskKey}`,
                value: '3'
              })

              API.task_status({
                planId: this.planId,
                status: 3
              })
            }
            this.toggleId += 1

            this.$redis.zset.del(`QA_added_${this.taskKey}`).then(res => {
               this.$redis.zset.add({
                key: `QA_added_${this.taskKey}`,
                value: this.groupList
              }, 'json')
            })
            this.$message.success('切换成功')
          } else {
            this.$message.error('切换失败')
          }
        })
      },
      getToggleId() {
        const { length } = this.groupList
        for (let i = 0; i < length; i++) {
          if (this.groupList[i].value.status !== 1) {
            this.toggleId = i
            break
          } else {
            this.toggleId = -1
          }
        }
      },
      getFriend() {
        this.$redis.zset.get({
          key: `QA_friend_${this.taskKey}`,
          start: 0,
          stop: -1
        }, 'json').then(res => {
           if (res.data.error_code === 0) {
             res.data.data.members.map((v, i) => {
               const { score, value } = v
               this.groupList[score - 1].value = {...this.groupList[score - 1].value, ...value}
             })
             this.getToggleId()
           }
        })
      },
      getList() {
        this.loading = false

        this.$redis.zset.get({
          key: `QA_added_${this.taskKey}`,
          start: 0,
          stop: -1
        }, 'json').then(res => {
          if (res.data.error_code === 0) {
            this.groupList = res.data.data.members
            this.getFriend()
          } else {
            this.$message.error('获取列表失败')
          }
        }).catch(() => {
          this.$message.error('获取列表失败')
        })
      }
    }
  }
</script>



