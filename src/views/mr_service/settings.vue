<template>
  <div id="detail">
    <div class="kf-detail">
      <h3 class="problems">
        <a href="javascript:;">聊天设置</a>
      </h3>
      <hr>
      <h3 class="problems-two">
        <a href="javascript:;">消息接入设置</a>
      </h3>
    </div>
    <table>
      <tr>
        <td>
          <el-radio v-model="radio" label="1" class="radio" @change="send">好友聊天消息全部接入客服系统</el-radio>
          <el-button type="text" @click="dialogVisible = true"></el-button>

          <el-dialog title="消息接入方式更改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>确认将消息接入方式更改为“所有消息接入”?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
        </td>
      </tr>
      <tr>
        <td>
          <el-radio v-model="radio" label="2" class="radio" @change="send">启用关键词匹配，当消息触发了相应的关键词后，该好友的消息生成问题接入客服系统中。</el-radio>
          <el-button type="text" @click="dialogVisible = true"></el-button>
          <el-dialog title="消息接入方式更改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>确认将消息接入方式更改为“所有消息接入”?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
        </td>
      </tr>
    </table>

    <div class="chatshow">
      <ul>
        <li> A、被动触发类关键词（好友→账号）：</li>
        <li>当好友给账号发送的消息匹配了被动触发关键词时，该好友的聊天信息接入客服系统。</li>
        <li>B、主动触发类关键词（账号→好友）：</li>
        <li>当账号主动给好友发送开启的关键词后，该好友的消息接入客服系统；账号主动发送关闭的关键词后，生成的问题将自动结束，该好友消息不再接入客服系统，下次需要接入仍需触发关键词。</li>
      </ul>
      <div class="passive">
        <div>被动触发类关键词(开启会话)</div>
        <el-button class="input3" type="primary text" @click="centerDialogVisible = true">
          <i class="el-icon-plus el-icon--left"></i>添加关键词</el-button>

      </div>
      <div class="driving">
        <div>主动触发类关键词</div>
        <el-button class="input4" type="primary text" @click="centerDialogVisible = true">
          <i class="el-icon-plus el-icon--left"></i>添加关键词</el-button>
      </div>
      <!-- 弹框 -->
      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
        <span>正在开发中。。。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
      radio: "",
      dialogVisible: false,
      centerDialogVisible: false, //弹框
      currentPage1: 5 //分页
    };
  },
  mounted() {},
  methods: {
    //弹框
    send(val) {
      if (val == 1 || val == 2) {
        this.dialogVisible = true;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
  .kf-detail:after {
    clear: both;
    content: "";
    display: block;
    width: 0;
    height: 0;
    visibility: hidden;
  }
  .problems {
    padding: 16px 20px;

    font-size: 18px;
  }
  .problems-two {
    padding: 13px 20px;
    background: #e1ebf4;
    margin-top: 20px;
  }
  .radio {
    color: #7a7887;
    margin-top: 20px;
    padding: 0px 20px;
  }
  .chatshow {
    ul {
      background: #e1ebf4;
      line-height: 22px;
      padding: 25px 22px;
    }
    .passive {
      overflow: hidden;
      padding: 25px 22px 20px 22px;
      div {
        float: left;
        font-size: 16px;
      }
      .input3 {
        float: right;
      }
    }
    .driving {
      overflow: hidden;
      padding: 20px 22px;
      border-top: 1px #7a7887 dashed;
      div {
        float: left;
        font-size: 16px;
      }
      .input4 {
        float: right;
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

