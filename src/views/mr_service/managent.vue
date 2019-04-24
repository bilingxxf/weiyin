<template>
  <div id="managent">
    <div>
      <h3 class="management">
        <a href="javascript:;">快捷语回复</a>
      </h3>
      <hr>
    </div>
    <div class="managebox">
      <el-input class="inpone" placeholder="请输入快捷语名称" suffix-icon="el-icon-search" v-model="inputmanage">
      </el-input>
      <el-button class="inptwo" type="primary" @click="$router.push('/mr_fastreply')">
        <i class="el-icon-plus el-icon--left"></i>添加快捷语</el-button>
    </div>

    <!-- table -->

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="" width="20px">
      </el-table-column>
      <el-table-column prop="serial" label="序号">
      </el-table-column>
      <el-table-column prop="entry" label="快捷语词条">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="bottom-end" :offset="80">
            <p>{{ scope.row.entry }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.entry }}</el-tag>
            </div>

          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
      </el-table-column>
      <el-table-column prop="content" label="内容">
      </el-table-column>
      <el-table-column label="　 操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="$router.push('/mr_shortcuts')">
            编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row); centerDialogVisible = true ">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog class="dialog-el" title="删除快捷语" :visible.sync="centerDialogVisible" width="20%" center>
      <span>确定要删除该快捷语吗？ </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

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
      inputmanage: "",
      currentPage1: 5, //分页

      //table

      tableData: [
        {
          serial: "1",
          entry: "王小虎",
          state: "完成",
          content: "1条"
        },
        {
          serial: "2",
          entry: "王小虎",
          state: "完成",
          content: "1条"
        },
        {
          serial: "3",
          entry: "王小虎",
          state: "完成",
          content: "1条"
        },
        {
          serial: "4",
          entry: "王小虎",
          state: "完成",
          content: "1条"
        },
        {
          serial: "5",
          entry: "王小虎",
          state: "完成",
          content: "1条"
        }
      ],
      centerDialogVisible: false //删除弹框
    };
  },

  methods: {
    //table
    handleDelete(index, row) {
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
#managent {
  position: relative;
  background: #ffffff;
  color: #73879c;
  font-size: 14px;
  padding: 0 15px 50px 15px;
  height: 100%;
  box-sizing: border-box;
  .management {
    padding: 16px 20px;
    font-size: 18px;
  }
  .managebox {
    overflow: hidden;
    margin: 20px 20px;
    .inpone {
      float: left;
      width: 300px;
    }
    .inptwo {
      float: right;
      margin-right: 125px;
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

