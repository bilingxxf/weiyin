<template>
	<el-dialog
    title="按好友标签选择"
    :visible.sync="value"
    :before-close="handleClose"
    class="table-modal"
    width="500px"
    >
   		<el-table 
        ref="multipleTable" 
        :data="selectedTagItem.totalFriend" 
        height="300" 
        tooltip-effect="dark" 
        class="tagFriendBorder"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="好友微信号">
          <template slot-scope="scope"><span class="no-wrap">{{ scope.row.contact_wxuser_name }}</span></template>
        </el-table-column>
        <el-table-column prop="name" label="所属微信号" align="center">
          <template slot-scope="scope"><span  class="no-wrap">{{ scope.row.wx_user_nick_name }}</span></template>
        </el-table-column>
        <el-table-column prop="address" label="通过好友时间" align="right" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.pass_time }}</template>
        </el-table-column>
      </el-table>
       <div slot="footer" class="dialog-footer">
        <el-button class="ele-btn" type="primary" @click="submit">确定</el-button>
      </div>
  </el-dialog>
</template>

<script>
	export default{
    data() {
      return {
        selectors: []
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      selectedTagItem: {
        type: Object
      },
      selectTagList: {
        type: Array
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value: {
		handler(value) {
          this.selectors = this.selectedTagItem.selectFriend
          this.$nextTick(() => {
            this.selectors.map((v) => {
              this.$refs.multipleTable.toggleRowSelection(v);
            })
          })
				},
				deep: true
			}
    },
    methods: {
      handleClose() {
        this.$emit('change', false)
      },
      submit() {
        this.$emit('returnVal', this.selectors, this.selectedTagItem.wxContactLabelId)
        this.handleClose()
      },
      handleSelectionChange(val) {
        this.selectors = val
      }
    }
  }
</script>



