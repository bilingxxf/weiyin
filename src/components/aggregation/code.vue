<template>
	<el-dialog
    title="查看详情"
    :visible.sync="value"
    :before-close="handleClose"
    class="element-modal"
    width="540px">
    <div class="qrcode-box">
      <div id="qrcode" ref="qrcode"></div>
      <div>
        <span>{{ link }}</span>
        <span class="edit-btn copy-btn" @click='copy' :data-clipboard-text="link">复制链接</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import Clipboard from "clipboard"
  import QRCode from 'qrcodejs2'
	export default{
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      link: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      link(newVal) {
        if (!this.qr) {
          this.$nextTick(() => {
            this.qr = new QRCode('qrcode', {
              width: 160, 
              height: 160, 
              text: newVal
            })
          })
        } else {
          this.qr.makeCode(newVal )
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('change', false)
      },
      copy(val) {
        let clipboard = new Clipboard(".copy-btn");
        clipboard.on("success", e => {
          this.$message.success('复制成功')
          clipboard.destroy();
        });
        clipboard.on("error", e => {
          this.$message.success('复制失败')
          clipboard.destroy();
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .qrcode-box {
    margin: 30px 0;
    text-align: center;
    span {
      font-size: 12px;
    }
    #qrcode {
      width: 160px;
      height: 160px;
      display: block;
      margin: 40px auto;
    }
  }
</style>
>

