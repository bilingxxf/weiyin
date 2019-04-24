<template>
  <div id="detail">
    <div>
      <h3 class="settings">
        <a href="javascript:;">问题明细</a>
      </h3>
      <hr>
    </div>
    <div class="detailbox">
      <div class="title">问题详情</div>
      <!-- 日历 -->
      <div class="block" tag="input">
        <el-date-picker v-model="value6" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <div class="sel-inp">
      <div class="sel">
        <el-select v-model="value" placeholder="问题大类">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="inp">
        <el-input class="inp" placeholder="搜索用户名称、所属账号、处理客服" suffix-icon="el-icon-search" v-model="inputdetail">
        </el-input>
      </div>
    </div>
    <div class="table_wrapper">
      <div class="title">批量操作(已选
        <span>0</span>)
        <el-button type="text" plain>删除</el-button>
      </div>

      <!-- 蒙层 -->
      <div class="mask" v-show="mask"></div>

      <!-- table表单 -->
      <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%;" :header-cell-style="getHeaderClass" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column prop="name" label="用户名称">
        </el-table-column>
        <el-table-column prop="id" label="所属账号">
        </el-table-column>
        <el-table-column prop="service" label="处理客服">
        </el-table-column>
        <el-table-column prop="date" label="建立时间">
        </el-table-column>
        <el-table-column prop="date" label="完结时间">
        </el-table-column>
        <el-table-column prop="problem" label="问题类型">
        </el-table-column>
        <el-table-column label="聊天详情">
          <template slot-scope="scope">
            <el-button size="mini" type="info" plain @click="details=true,mask=true">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="　备注　">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom-end" :offset="80">
              <p>{{ scope.row.notes }}</p>
              <hr>
              <i>后台批量完成</i>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.notes }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="　操作　">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 详情弹窗 -->
    <div class="popup" v-show="details">
      <span class="close" @click="mask=false,details=false">×</span>
      <div class="header">
        聊天详情
      </div>
      <div class="content">
        <div class="list">
          <el-table :data="detailsTableData" style="width: 100%">
            <el-table-column prop="name" label="微信号">
            </el-table-column>
            <el-table-column prop="name" label="微信昵称">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="button">
        <el-button size="small" @click="mask=false,details=false">关闭</el-button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="100" layout="total, prev, pager, next" :total="500">
      </el-pagination>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      // 日历
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value6: "",

      detailsTableData: [], //tableData

      currentPage1: 5, //分页

      //select
      options: [
        {
          value: "选项1",
          label: "处理中"
        },
        {
          value: "选项2",
          label: "已完成"
        }
      ],
      value: "",
      inputdetail: "",

      // table表单
      tableData3: [
        {
          name: "王小虎",
          id: "12345",
          service: "小镇姑娘",
          date: "2016-05-04",
          problem: "已完成",
          notes: "备注详情",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          id: "12345",
          service: "小镇姑娘",
          date: "2016-05-05",
          problem: "已完成",
          notes: "备注详情",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          id: "12345",
          service: "小镇姑娘",
          date: "2016-05-04",
          problem: "已完成",
          notes: "备注详情",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          id: "12345",
          service: "小镇姑娘",
          date: "2016-05-01",
          problem: "已完成",
          notes: "备注详情",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          id: "12345",
          service: "小镇姑娘",
          date: "2016-05-08",
          problem: "已完成",
          notes: "备注详情",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          id: "12345",
          service: "小镇姑娘",
          date: "2016-05-06",
          problem: "已完成",
          notes: "备注详情",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          id: "12345",
          service: "小镇姑娘",
          date: "2016-05-07",
          problem: "已完成",
          notes: "备注详情",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],

      details: false, //详情弹窗

      mask: false, //开关

      // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#e1ebf4";
        } else {
          return "";
        }
      },

      multipleSelection: []
    };
  },
  methods: {
    // table表单
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //分页
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#detail {
  position: relative;
  background: #ffffff;

  color: #73879c;

  font-size: 14px;

  padding: 0 15px 50px;

  height: 100%;

  box-sizing: border-box;
  .settings {
    padding: 16px 20px;

    font-size: 18px;
  }
  .detailbox {
    overflow: hidden;
    margin-top: 20px;
    background: #e1ebf4;
    .title {
      float: left;
      font-size: 18px;
      padding: 10px 0 10px 20px;
    }
    .block {
      float: right;
      border: 2px solid #e1ebf4;
      margin: 3px 80px 3px 0;
    }
  }
  .sel-inp {
    overflow: hidden;
    margin: 30px 0;
    .sel {
      float: left;
    }
    .inp {
      float: right;
      width: 350px;
      margin-right: 42px;
    }
  }
  .table_wrapper {
    border: 1px solid #e5e5e5;
    .title {
      height: 60px;
      line-height: 60px;
      padding: 0 15px;
    }
    .el-table__header-wrapper {
      background: red;
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
  }
  .block {
    padding: 15px 0 50px;
    text-align: center;
    .el-pagination {
      display: inline-block;
    }
  }
}
</style>

