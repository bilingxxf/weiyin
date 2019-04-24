<template>
  <div id="shortcuts">
    <div>
      <h3 class="reply">
        <a href="javascript:;">编辑快捷语</a>
      </h3>
      <hr>
    </div>
    <div class="inputreply">
      <table>
        <tr class="tabletr">快捷语名称
          <td>
            <el-input class="inp" placeholder="请输入快捷语名称" v-model="inputfast"></el-input>
          </td>
          <i>快捷语名称最多20字</i>
        </tr>
        <tr>状&nbsp; &nbsp;&nbsp;&nbsp;态
          <td>
            <el-radio v-model="radio" label="1">开启</el-radio>
            <el-radio v-model="radio" label="2">关闭</el-radio>
          </td>
        </tr>
        <tr>内&nbsp; &nbsp;&nbsp;&nbsp;容</tr>
      </table>
      <div class="msg">
        <p class="msg_head">
          <span>群发内容</span>
        </p>
        <div class="msg_foot">
          <span @click="mask=true,textComment=true">
            <i class="el-icon-edit"></i>
            <a href="javascript:;">文字</a>
          </span>&nbsp;&nbsp;&nbsp;&nbsp;

          <span @click="mask=true,imageComment=true">
            <i class="el-icon-picture"></i>
            <a href="javascript:;">图片</a>
          </span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span @click="mask=true,mComment=true">
            <i class="el-icon-service"></i>
            <a href="javascript:;">语音</a>
          </span>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <el-button class="inpthree" type="primary">确认</el-button>
      <!-- 文字弹出层 -->
      <div class="text" v-show="textComment">
        <div class="header">
          <h5>添加文字</h5>
          <span @click="mask=false,textComment=false">×</span>
        </div>
        <div class="content">
          <div class="contentItem">
            <div id="text_e"></div>
          </div>
        </div>
        <div class="footer">
          <el-button>确定</el-button>
          <el-button @click="mask=false,textComment=false">取消</el-button>
        </div>
      </div>
      <!-- 图片弹出层 -->
      <div class="text image" v-show="imageComment">
        <div class="header">
          <h5>添加图片</h5>
          <span @click="mask=false,imageComment=false">×</span>
        </div>
        <div class="content">
          <div class="contentItem">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </div>
        <div class="footer">
          <el-button>确定</el-button>
          <el-button @click="mask=false,imageComment=false">取消</el-button>
        </div>
      </div>
      <!-- 语音弹出层 -->
      <div class="text music" v-show="mComment">
        <div class="header">
          <h5>添加语音</h5>
          <span @click="mask=false,mComment=false">×</span>
        </div>
        <div class="content">
          <div class="contentItem">
            <p>上传格式支持amr、mp3、wav,文件大小不超过1M，语音时长不超过60秒，为了更好的体验效果，建议上传amr格式的语音文件。</p>
            <input id="fileSelect" name="fileSelect" ref="inputer" type="file" />
          </div>
        </div>
        <div class="footer">
          <el-button>确定</el-button>
          <el-button @click="mask=false,mComment=false">取消</el-button>
        </div>
      </div>
      <!-- 蒙层 -->
      <div class="mask" v-if="mask"></div>
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
      inputfast: "",
      radio: "1",
      fileList: [], //上传
      mask: false, //蒙层
      textComment: false, //文字弹窗
      imageComment: false, //图片弹窗
      mComment: false, //语音弹窗
      currentPage1: 5 //分页
    };
  },
  methods: {
    handlePreview(file) {
      //添加上传模块
    },
    handleRemove(file, fileList) {
      //添加上传模块
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
#shortcuts {
  position: relative;
  background: #ffffff;
  color: #73879c;
  font-size: 14px;
  padding: 0 15px 50px 15px;
  height: 100%;
  box-sizing: border-box;
  .reply {
    padding: 16px 20px;
    font-size: 18px;
  }
  .inputreply {
    padding: 16px 20px;
    font-size: 16px;
    table {
      width: 70%;
      tr {
        height: 70px;
        text-align: center;
        vertical-align: 20px;
        i {
          font-size: 14px;
        }
      }
    }
    .msg {
      margin: 20px auto 0;
      border: 1px solid#e1ebf4;
      width: 95%;
      height: 80px;
      .msg_head {
        height: 40px;
        width: 100%;
        background-color: #e1ebf4;
        color: #2a3f54;
        span {
          margin-left: 20px;
          line-height: 40px;
        }
      }
      .msg_foot {
        margin: 10px 0 0 20px;
        color: #73879c;
      }
    }
    .inpthree {
      width: 15%;
      margin: 4% 40%;
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
.text {
  position: absolute;
  left: 30%;
  top: 30%;
  width: 500px;
  border-radius: 6px;
  background-color: #fff;
  z-index: 11;
  box-sizing: border-box;
  .header {
    padding: 10px 15px;
    overflow: hidden;
    font-size: 14px;
    background-color: #e1ebf4;
    border-radius: 6px 6px 0 0;
    h5 {
      text-align: center;
      float: left;
      width: 95%;
      line-height: 20px;
    }
    span {
      cursor: pointer;
    }
  }
  .content {
    padding: 15px;
    .contentItem {
      padding: 5px 0;
      #text_e {
        width: 100%;
        height: 100px;
      }
    }
  }
  .footer {
    padding: 15px;
    border-top: 1px solid #e5e5e5;
    text-align: center;
  }
}
</style>
