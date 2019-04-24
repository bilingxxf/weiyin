<template>
  <div id="group">
    <div class="group-statistical">
      <div class="item">
        <p>加粉次数</p>
        <h1>{{totalNumber}}</h1>
      </div>
      <div class="item">
        <p>加粉人数</p>
        <h1>{{newNumber}}</h1>
      </div>
    </div>
    <div class="search">
      <div class="search-header">
        任务明细
      </div>
      <div class="task_list">
        <el-button plain style="float:left;">删除</el-button>
        <el-button plain style="float:right;" @click="$router.push('/friends/fansTask')">新建任务</el-button>
      </div>
      <el-table ref="multipleTable" border :data="tableData3" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="发起时间">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="加粉账号(个)">
        </el-table-column>
        <el-table-column prop="name" label="目标加粉(个)">
        </el-table-column>
        <el-table-column prop="name" label="成功加粉">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text">正在进行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next" :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        totalNumber: 100,
        newNumber: 101,
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: [],
        currentPage4: 4
      };
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {},
    },
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #group {
    position: relative;
    color: #73879c;
    font-size: 14px;
    padding: 0 15px 50px;
    height: 100%;
    box-sizing: border-box;

    .group-statistical {
      width: 100%;
      overflow: hidden;
      padding: 50px 0;
      box-sizing: border-box;

      .item {
        float: left;
        width: 50%;
        text-align: center;
      }
    }

    .search {
      .search-header {
        padding: 0 20px;
        height: 45px;
        line-height: 45px;
        font-size: 18px;
        background: #e1ebf4;
        color: #2a3f54;
      }

      .task_list {
        height: 70px;
        padding: 0 20px;

        .el-button {
          margin-top: 15px;
        }
      }

    }

    .footer {
      text-align: center;
      margin-top: 20px;
    }
  }

</style>
