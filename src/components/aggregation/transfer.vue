<template>
	<el-dialog
    title="选择微信号"
    :visible.sync="value"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="code-modal table-modal grey"
    width="860px">
    <div class="code-transfer">
      <section class="transfer-left">
        <div class="vertical-line">
        <el-select
				size="small"
				class="ele-select"
				v-model="table.groupName"
        @change = "page=1, getList()"
				placeholder="全部分组"
				clearable
				>
        <el-option
					v-for="item in groups"
					:key="item.wx_user_group_name"
					:label="item.wx_user_group_name"
					:value="item.wx_user_group_name"
				></el-option>
			</el-select>
    
        <el-input
        @change = "page=1, getList()"
				class="ele-input"
				placeholder="请输入微信号或昵称查询"
				suffix-icon="el-icon-search"
				v-model="table.wxUserName"
				></el-input>
      </div>
        <el-table
					ref="multipleTable"
					@selection-change="handleSelectionChange"
					:data="groupList"
					class="ele-table-init"
          :height = "292"
					v-loading="loading">
					<el-table-column type="selection" fixed></el-table-column>
					<el-table-column label="微信号"  width="140">
            <template slot-scope="scope">
              <span>{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</span>
            </template>
					</el-table-column>
					<el-table-column prop="group_name" label="分组">
					</el-table-column>
					<el-table-column prop="phone" label="手机号" width="110"></el-table-column>
				</el-table>
				<div class="pagination" v-if="total!=0">
					<el-pagination
          v-if = "total > pageSize"
					@current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 50]"
					:current-page="page"
					:page-size="pageSize"
					layout="sizes, total, pager"
					:total="total"
					></el-pagination>
				</div>
      </section>
      <section class="transfer-center">
        <i class="el-icon-d-arrow-right" @click="transferRight"></i>
      </section>
      <section class="transfer-right">
        <div class="edit-group">
          <span @click="deleteAllSelectors">清空全部</span>
        </div>
        <el-table
					ref="multipleTable"
					:data="selectorItems"
					class="ele-table-init"
          :max-height = "292">
					<el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
					<el-table-column label="微信号" width="140">
            <template slot-scope="scope">
              <span>{{scope.row.wx_username + (scope.row.nickname ? `(${scope.row.nickname})` : '')}}</span>
            </template>
					</el-table-column>
					<el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <a @click="deleteSelectors(scope.$index)">删除</a>
            </template>
          </el-table-column>
				</el-table>
        <div class="total-line">{{ selectorItems.length ? `共 ${selectorItems.length} 条记录` : '' }}</div>
      </section>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="ele-btn" type="primary" @click="submitSelectors">确定</el-button>
        <el-button class="ele-default" @click="handleClose">取消</el-button>
      </div>
  </el-dialog>
</template>

<script>
  import API from '@/api/apis'
	export default{
    data() {
      return {
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
      selectors:{
        handler(newValue,oldValue){
          this.selectorItems = newValue
          this.selectorItemsCenter = []
          this.selectorIds = []
          this.transferRight()
          this.$emit('returnIds', this.selectorIds)
          // this.filterLeftData()
        },
        deep:true
      }
    },
    methods: {
      handleClose() {
        this.$emit('change', false)
      },
      handleSelectionChange(items) {
        this.selectorItemsCenter = items
      },
      transferRight () {
        this.selectorItems = [...this.selectorItems, ...this.selectorItemsCenter]
        this.selectorItems.map((v) => {
          if (!this.selectorIds.includes(v.wx_user_id)) this.selectorIds.push(v.wx_user_id)
        })
        this.filterLeftData()
      },
      deleteSelectors (i) {
        this.selectorItems.splice(i, true)
        this.selectorIds.splice(i, true)
        this.filterLeftData()
      },
      deleteAllSelectors () {
        this.selectorItems = []
        this.selectorIds = []
        this.groupList = [...this.cacheGroupList]
      },
      submitSelectors () {
        this.$emit('returnValue', this.selectorItems)
        this.handleClose()
      },
      filterLeftData() {
        if (!this.selectorIds.length) {
          this.groupList = [...this.cacheGroupList]
        } else {
          this.groupList = this.cacheGroupList.filter((item) => {
            return !this.selectorIds.includes(item.wx_user_id)
          })
        }
      },
      handleSizeChange(i) {
        this.page = 1
        this.pageSize = i
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
            if (res.data.error_code === 0) {
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
          isOnline: 1,
          searchSign: 1
          }, ...this.table
        }
        if (this.table.groupName === '全部分组' || !this.table.groupName)  delete parmas.groupName
        if (!this.table.wxUserName) delete parmas.wxUserName
         API.wx_list(parmas).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            this.total = res.data.data.total_count
            this.groupList = res.data.data.result
            this.cacheGroupList = res.data.data.result
            this.filterLeftData()
          }else{
            this.error(res.data.error_message);
          }
        }).catch((err)=>{
          this.error()
        });
      }
    }
  }
</script>

<style scoped lang="scss">
.code-modal {
  .el-table {
    margin-top: 12px;
  }
}
.code-transfer {
  display: flex;
  overflow: hidden;
  > section {
    float: left;
  }
  .transfer-left, 
  .transfer-right {
    width: 442px;
    background: #fff;
    padding: 20px;
  }

  .transfer-center {
    width: 100px;
    text-align: center;
    align-self: center;
    .el-icon-d-arrow-right {
      font-size: 28px;
      color: #409eff;
      cursor: pointer;
    }
  }

  .transfer-right {
    width: 312px;
    .edit-group {
      padding: 0 20px;
      line-height: 30px;
      display: block;
      text-align: right;
    }
    a {
      cursor: pointer;
      color: #409eff
    }
  }
}
</style>


