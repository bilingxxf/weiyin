<template>
  <div class="app-container main-body">
    <div class="main_wrapper">
      <el-steps :active="2" finish-status="success" simple style="margin-top: 20px">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <div class="wrap">
        <div class="img-wrap" v-loading="loading">
          <div v-if="showQrcodImg" id="qrcode" ref="qrcode"></div>
        </div>
        <div style="font-size: 14px;color:#666;">{{tip}}</div>
        <div style="color:#666;">该二维码有效期为4分钟，失效后请重新获取</div>
        <div class="btn_wrapper">
          <el-button type="primary" class="ele-btn" @click="returnAdd">上一步</el-button>
          <el-button class="ele-default" :disabled="disabled" @click="refreshCode()">获取二维码</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import QRCode from 'qrcodejs2';
  export default {
    data() {
      return {
        img: "",
        device: "",
        data: "",
        shown: false,
        tip: '请点击获取二维码',
        serialNumber: '201805111030000050',
        groupId: [],
        taskTemplateId: '',
        qrTaskId: '',
        disabled: false,
        loading: false,
        timer: "",
        onOff: true,
        qrCodeOnOff: false,
        showQrcodImg: true
      };
    },
    mounted() {
      this.groupId.push(Number(this.$route.query.groupId));
    },
    methods: {
      qrcode(qrcodeImg) {
        let qrcode = new QRCode('qrcode', {
          width: 200, // 设置宽度，单位像素
          height: 200, // 设置高度，单位像素
          text: qrcodeImg // 设置二维码内容或跳转地址
        })
      },
      //获取二维码状态
      getCodeStatus() {
        this.$http('get_qr_code', 'GET', {
          task_id: this.qrTaskId
        }).then(res => {
          this.timer = setTimeout(() => {
            let data = res.data.error_code;
            if (data == '3') {
              this.loading = false;
              this.tip = '二维码就绪，等待扫描';
              this.disabled = false;
              this.getCodeStatus();
              this.qrCodeOnOff = true;
              let qrcodeImg = res.data.data;
              if (this.onOff) {
                this.onOff = false;
                this.$nextTick(() => {
                  this.qrcode(qrcodeImg)
                })
              }
            } else if (data == '4') {
              this.tip = '二维码扫描完成等待确认';
              this.getCodeStatus();
            } else if (data == '5') {
              this.tip = '登录成功';
              this.$message.success("登录成功");
              clearTimeout(this.timer);
              this.$router.push("mr_success");
            } else if (data == '6') {
              this.tip = '二维码过期';
              this.$message.error("二维码过期");
              clearTimeout(this.timer);
            } else if (data == '400') {
              if (this.qrCodeOnOff) {
                this.showQrcodImg = false;
                this.tip = '二维码已过期,请点击获取二维码';
                return;
              } else {
                this.getCodeStatus();
              }
            }
          }, 1000)
        }).catch(err => {})
      },
      //创建扫码任务
      createTask() {
        let param = {
          taskTemplateName: "扫码登录",
        };
        let str = {
          param: JSON.stringify(param)
        };
        this.$http("task/start_task", "POST", str).then(res => {
          if (res.data.error_code == 0) {
            this.showQrcodImg = true;
            this.onOff = true;
            this.qrCodeOnOff = false;
            this.loading = true;
            this.qrTaskId = JSON.parse(res.data.error_message).taskId;
            this.tip = "正在获取二维码,请等待..."
            this.disabled = true
            this.getCodeStatus();
            this.$message({
              message: "创建成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "创建失败" + res.data.error_message,
              type: "error"
            });
          }
        }).catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
      },
      refreshCode() {
        clearTimeout(this.timer);
        this.showQrcodImg = false;
        this.createTask();
      },
      returnAdd() {
        this.$router.push("mr_add");
      },
    },
    //跳转页面关闭定时器
    beforeDestroy() {
      if (this.timer) {
        clearTimeout(this.timer)
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

      .img-wrap {
        width: 222px;
        height: 222px;
        margin: 60px 0 40px;
        padding: 10px;
        border: 1px solid #e8e8e8;
        display: inline-block;
        position: relative;

        img {
          width: 200px;
          height: 200px;
        }
      }

      >div {
        line-height: 14px !important;
        height: 14px;
        margin-bottom: 20px;
        font-size: 14px;
        color: #73879c;
      }

      .btn_wrapper {
        padding: 20px 0 85px;

        .gray {
          color: #abadb3;
          border-color: #abadb3;

          &:hover {
            background-color: #abadb3;
            color: #fff;
          }
        }
      }
    }
  }

</style>
