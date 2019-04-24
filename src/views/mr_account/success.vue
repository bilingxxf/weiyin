<template>
  <div class="app-container main-body">
    <div class="main_wrapper">
      <el-steps :active="3" finish-status="success" simple style="margin-top: 20px">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <div class="wrap">
        <!-- <ul>
          <li v-for="(item, index) in List" class="info" :key="index">
            <h3>分组名:<span>{{item.groupName}}</span></h3>
            <div style="margin-top: 15px;" class="message">
              <div v-for="(item, index) in item.info" class="mess" :key="index">
                <div class="imgWrapper" :id=item.wx_user_id ref="qrcode"></div>
                <b v-if="item.wx_user_group!=''">{{item.wx_user_group}}</b>
                <b v-else>{{item.wx_user_name}}</b>
              </div>
            </div>
          </li>
        </ul> -->
        <img src="../../assets/images/success.png" alt="">
        <div class="btn-wrap">
          <el-button type="primary" class="btn" @click="returnAdd">继续添加</el-button>
          <el-button class="btn border" @click="returnManage">完成</el-button>
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
        data: "",
        List: [],
        groupId: [],
        codeId: '',
        qrcodeImg: [],
        qrCodeArr: [],
        index: ''
      }
    },
    mounted() {
      // setTimeout(() => {
      //   this.getGroup();
      // }, 200)
    },
    computed: {

    },
    methods: {
      qrcode(qrcodeImg) {
        let newArr = [];
        for (let k = 0; k < qrcodeImg.length; k++) {
          if (newArr.indexOf(qrcodeImg[k]) == -1) {
            newArr.push(qrcodeImg[k]);
          }
        }
        for (let j = 0; j < this.qrCodeArr.length; j++) {
          let qrcode = new QRCode('' + this.qrCodeArr[j].wx_user_id + '', {
            width: 52, // 设置宽度，单位像素
            height: 52, // 设置高度，单位像素
            text: newArr[j] // 设置二维码内容或跳转地址
          })
        }
      },
      //获取分组
      getGroup() {
        this.$http('wx_group/group_list', 'POST', {
          limit: 99999,
          page: 1,
          group_name: ''
        }).then((res) => {
          if (res.data.error_code === 0) {
            res.data.data.result.forEach((item, index) => {
              this.$set(this.List, index, {})
              this.$set(this.List[index], 'groupName', item.wx_user_group_name)
              this.$http('wx_user', 'GET', {
                wx_user_group_id: item.wx_user_group_id,
                page: 1,
                limit: 9999
              }).then(res => {
                this.qrCodeArr = [];
                this.qrcodeImg = [];
                for (let i = 0; i < res.data.data.length; i++) {
                  this.qrCodeArr.push(res.data.data[i])
                  this.qrcodeImg.push(res.data.data[i].wx_qr_code)
                }
                this.$set(this.List[index], 'info', res.data.data)
                this.$nextTick(() => {
                  this.qrcode(this.qrcodeImg)
                })
              })
            })
          } else {

          }
        })
      },
      //继续添加
      returnAdd() {
        this.$router.push('mr_add')
      },
      //返回到账号管理
      returnManage() {
        this.$router.push('mr_accountManage')
      }
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
    padding-top: 20px;

    .main_wrapper {
      background: #fff;
    }

    .wrap {
      padding: 75px 140px;
      text-align: center;
      img{
        width: 120px;
        height: 120px;
      }
      ul {
        border-radius: 5px;

        li {
          width: 100%;
          color: #73879c;
          overflow: hidden;
          font-size: 16px;
          padding: 8px 0 0 20px;
          font-weight: 300;

          h3 {
            font-size: 16px;
            color: #666;

            span {
              margin-left: 10px;
            }
          }

          .mess {
            width: 33.3%;
            float: left;
            padding: 8px 8px 8px 30px;
            font-size: 14px;
            font-weight: 100;

            b {
              font-weight: 100;
            }
          }

          .imgWrapper {
            width: 52px;
            height: 52px;
            display: inline-block;
            vertical-align: middle;
            margin: 0 20px;
            border: 1px solid #ddd;

            img {
              width: 50px;
              height: 50px;
            }
          }
        }
      }

      .btn-wrap {
        text-align: center;
        padding: 60px 0 50px;
        .el-button {
          width: 90px;
          height: 30px;
          padding: 0;
          line-height: 0;
        }
      }
    }
  }

</style>
