<template>
  <div class="app-container main-body">
    <div class="main_wrapper">
      <el-steps :active="2" finish-status="success" simple style="margin-top: 20px">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <div class="wrap">
        <div class="wrap-account">
          <div class="uploadFriends">
            <el-upload ref="uploadFile" class="upload-demo" :headers="headers" :action="uploadTxt"
            :on-remove="onRemoveFile"
              :on-success="onsuccess" :on-error="error" :auto-upload="false" :limit="1" :on-change="handleChange">
              <img src="../../assets/images/add.png" alt="">
              <el-button size="small" type="text">上传文件</el-button>
            </el-upload>
            <div class="textModel">
              <el-button @click="downloads" type="text">查看文档模板</el-button>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传txt文件</div>
          </div>
          <div class="btn_wrapper">
            <el-button type="primary" class="ele-btn" @click="returnAdd">上一步</el-button>
            <el-button class="ele-default" :disabled="isUploadData" style="margin-left:20px" @click="accountLogin">下一步</el-button>
          </div>
        </div>
      </div>
    </div>
    <Dialog v-if="flag=='showErrorData'" @callback="closeDialog" @cancelCallback="cancelUploadData">
    <div class="dialog-content" slot="content" style="padding:30px 0;" >
     <el-scrollbar class="" style="height:100%">
        <ul class="errorFormat" >
          <li v-for="(item,index) in libraryErrorArr" :key="index" class="errorFormatItem">
            <span>第{{item.index}}行：</span>
            <p>{{item.value}}</p>
          </li>
        </ul>
      </el-scrollbar>
      <p style="padding-top:20px;color:red;font-size:14px;">文件导入包含错误格式内容，点击确定继续上传正确数据</p>
      </div>

    </Dialog>

    <Dialog v-if="flag=='dialogVisible'">
      <div class="dialog-content downline" slot="content" style="padding-bottom:10px;">
        <img width="600px" src="../../assets/z001.png" alt="" @click="cancel">
      </div>
    </Dialog>

  </div>
</template>
<script>
  import {config} from "../../api/http.js";
  import Dialog from "../../components/dialog.vue";
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        total: 0,
        successNumber: 0,
        errNumber: 0,
        headers: {
          "Content-Token": sessionStorage.getItem("token")
        },
        dialogVisible: false,
        uploadTxt: "",
        publicUrl: config,
        flag: '',
        dataFlag:false,
        libraryErrorArr:[],
        libraryUsableArr:[],
        isUploadData:false
      };
    },
    mounted() {
      this.uploadTxt = this.publicUrl.linkUrl + 'api/v1/wxdat/login';
    },
    methods: {
      // 检测62数据
      handleChange(file) {
        this.libraryErrorArr = [];
        this.repeatNum = 0;
        if (file) {
          this.dataFlag = true
          var reader = new FileReader();
          if (/text+/.test(file.raw.type)) {
            let _this = this;
            _this.libraryLoading = true;
            let arr = []

            reader.onload = function () {
              let libraryArr = this.result.split('\n');
              let a = libraryArr[0].trim();
              libraryArr.map(item => {
                arr.push(item.trim())
              })


              let length = arr.length;
              let num = 0;
              var regExp1 =/^(\w+(-{4})){2}(62[^\u4e00-\u9fa5]+)$/;
              // var regExp1 =/^(\w+(-{4})){2}(62[^\u4e00-\u9fa5]+)$/;
              // var regExp1 =  /^[^\u4e00-\u9fa5]+$/;
              let arr1 = [];
              let len = 0;
              let repeatArr = [];
              repeatArr = Array.from(new Set(arr));
              _this.repeatNum = length - repeatArr.length;

              function ReagexValidation(item, index) {
                //  if (regExp1.test(item)) {
                 if (item.indexOf('----62')>-1) {
                   _this.libraryUsableArr.push(item)
                  ++num;
                } else {
                  ++index;
                  ++num;
                  if(item.length>0){
                     _this.libraryErrorArr.push({
                      index: index,
                      value: item
                    })
                  }
                }
              }

              arr.map((item, index) => {
                !~ function (item, index) {
                  ReagexValidation(item, index);
                }(item, index)
              })

              if (num == length && _this.dataFlag) {

                  if (_this.libraryErrorArr.length > 0) {
                    _this.showErrorData()
                    _this.libraryLoading = false;
                    _this.centerDialogVisible = true;
                    _this.dataFlag = false;
                  }
                  _this.libraryLoading = false;
              }
            }
            reader.readAsText(file.raw, 'gb2312');
          } else {
            this.$message.error("请上传txt文件");
            this.hideModel();
          }
        }
      },

      showErrorData() {
        this.flag = "showErrorData";
        this.$store.dispatch("showDialog", {
          title: "错误数据内容",
          showCancel:true
        });
      },
      /*上传成功*/
      onsuccess(response) {
        if (response.error_message) {
          this.$message({
            message: "上传成功",
            type: "success"
          });
          this.$router.push("mr_success");
        } else {
          this.$message({
            message: "上传失败",
            type: "error"
          });
        }
      },
      error() {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
      },
      //上一步
      returnAdd() {
        this.$router.push("mr_add");
      },
      //下一步
      accountLogin() {
        if(this.isUploadData){
          return this.$message.warning('当前正在导入,请稍后重试')
        }

        this.isUploadData = true

        if(this.libraryUsableArr.length==0){
          this.$message.warning('没有可用的数据')
          this.isUploadData = false
          return
        }

        this.uploadData()
      },
      onRemoveFile(){
          this.libraryUsableArr = []
          this.libraryErrorArr = []
          // this.isUploadData = false
      },
      async uploadData(e){
        const array = new Set(this.libraryUsableArr)

        const res = await this.$http('wxdat/login','POST',[...array]).catch(err=>{
          this.error(res)
          this.isUploadData = false
        })
        if(res&&res.data&&res.data.error_code == '0' ){
          this.$message.success('批量导入成功')
          this.onsuccess(res.data)
        } else {
          this.error(res)
        }
          this.isUploadData = false
      },
      cancelUploadData(){
        this.libraryUsableArr = [];
        this.libraryErrorArr = [];
        this.$refs.uploadFile.clearFiles()
        this.closeDialog()
      },
      downloads() {
        this.flag = "dialogVisible";
        this.$store.dispatch("showDialog", {
          title: "上传文件模板",
        });
      },
      closeDialog() {
        this.$store.dispatch("hideDialog");
      },
      cancel() {
        this.dialogVisible = false
      }
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
    padding-top: 20px;

    .el-steps--simple {
      padding: 15px 8%;
    }

    .main_wrapper {
      background: #fff;
    }

    .wrap {
      text-align: center;

      .uploadFriends {
        text-align: center;
      }

      >div {
        margin-bottom: 10px;
        font-size: 14px;
        color: #73879c;
      }

      .wrap-account {
        width: 400px;
        margin: 60px auto;

        >div {
          font-size: 14px;
          color: #73879c;
          overflow: hidden;
        }

        img {
          width: 18px;
          vertical-align: middle;
        }

        .textModel {
          .el-button {
            font-size: 12px;
          }
        }
      }

      .btn_wrapper {
        padding: 20px 0 50px;
      }

      .el-upload__tip {
        margin: 0 0 10px;
        color: #666;
      }
    }
  }
  .errorFormat{
    // display: flex;
    max-height: 300px;
    flex-direction: column;
    align-items: flex-start;
    &Item{
      display: flex;
      width:100%;
      padding-bottom: 6px;
      line-height: 18px;
      color: rgb(51, 51, 51);
      font-size: 14px;
      span{
          flex: 70px 0 0;
          line-height:24px;
      }
     p{
        // flex: 1;
        // white-space: pre-wrap;
        // word-break: break-all;
        white-space: nowrap;
        text-align: left;
      }
    }
  }

</style>
