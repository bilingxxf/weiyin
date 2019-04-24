<template>
  <div class="fansTask">
    <span class="top">1.上传加粉数据单次最多可导入2万条数据。</span>
    <div class="main_wrapper">
      <div class="content">
        <div class="ps">格式：一行一个微信号、以回车隔开，每行字符数不能超过50</div>
        <el-input type="textarea" resize=none :autosize="{ minRows: 7, maxRows: 10}" placeholder="格式1:手机号 
格式2:手机号#验证信息" v-model="textarea3">
        </el-input>
        <div class="total">
          共100条
        </div>
      </div>
      <div class="title">
        设置来源
      </div>
      <div class="selectOrigin">
        <p>
          <el-radio v-model="radio" label="1">通过手机号搜索</el-radio>
        </p>
        <p>
          <el-radio v-model="radio" label="2">通过通讯录添加</el-radio>
        </p>
        <p>
          <el-radio v-model="radio" label="3">通过微信号添加</el-radio>
        </p>
      </div>
      <div class="title">
        验证信息
      </div>
      <div class="validation">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入验证信息（如果加粉数据是格式2，此验证信息无效）"
          v-model="validationInfo">
        </el-input>
        <p>[昵称] [自己昵称]</p>
      </div>
      <el-button plain type="primary">提交托管加粉</el-button>
      <p class="ps">托管加粉说明：提交托管加粉后，系统会每日自动下单加粉，用户只需在订单明细中查看加粉详情。</p>

    </div>
    <!-- 弹框 -->
    <transition-group name="fade">
      <div class="modal" v-show="fansTaskShow" :key="1">
        <div class="mask"></div>
        <div class="camilo">
          <div class="modal-header">
            <h2>添加账户<span @click="fansTaskShow= false">x</span></h2>
          </div>
          <div class="modal-body">
            <div class="search">
              <el-input placeholder="请输入内容" v-model="input4">
                <template slot="append">搜索</template>
              </el-input>
            </div>
            <div class="content">

              <div class="left">
                <h3>全部账户</h3>

              </div>
              <div class="right">
                <h3>已选账户</h3>
              </div>
            </div>
            <div class="total">
              当前已选账号：0个
            </div>
          </div>
          <div class="modal-footer">
            <el-button plain type="primary" @click="fansTaskShow= false">关闭</el-button>
          </div>
        </div>
      </div>
    </transition-group>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        textarea3: '',
        radio: '1',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        input: 15,
        fansTaskShow: true,
        validationInfo: '',
        tableData3: [{
          date: '2016-05-03'
        }, {
          date: '2016-05-02'
        }, {
          date: '2016-05-04'
        }, {
          date: '2016-05-01'
        }, {
          date: '2016-05-08'
        }, {
          date: '2016-05-06'
        }, {
          date: '2016-05-07'
        }]
      };
    },
    mounted() {},
    methods: {}
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fansTask {
    color: #73879c;
    padding: 25px 200px 50px 100px;

    .top {
      font-size: 15px;
    }

    .main_wrapper {
      margin-top: 20px;

      .title {
        padding: 0 20px;
        margin-bottom: 20px;
        height: 45px;
        line-height: 45px;
        font-size: 18px;
        background: #e1ebf4;
        color: #2a3f54;
      }

      .content {
        .ps {
          margin: 10px 0 20px;
          line-height: 20px;
          font-size: 14px;
          color: #58bc9c;
        }

        .total {
          margin-bottom: 50px;
          text-align: center;
          line-height: 35px;
          background: #d6e8f2;
        }
      }

      .selectOrigin {
        margin-bottom: 30px;

        p {
          margin: 10px 0 0 20px;
        }
      }

      .validation {
        margin-bottom: 30px;

        p {
          margin-top: 10px;
          padding-left: 20px;
        }
      }

      .ps {
        margin-top: 20px;
      }
    }

    .modal {
      height: 20px;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .mask {
      background: #000;
      opacity: 0.5;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
    }

    .camilo {
      width: 520px;
      height: 560px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -260px;
      margin-top: -280px;
      z-index: 15;

      background: #fff;
      box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
      border-radius: 5px;

      .modal-header {
        position: relative;
        padding: 10px 15px;
        background: #e1ebf4;
        color: #2a3f54;
        text-align: center;
        border-radius: 6px 6px 0 0;
        border-bottom: 1px solid #e5e5e5;

        h2 {
          font-size: 18px;
          position: relative;
          line-height: 25px;

          span {
            position: absolute;
            right: 0px;
            cursor: pointer;
            padding: 0px 10px;
          }
        }
      }

      .modal-body {
        padding: 15px 20px 0;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #73879c;
        border-bottom: 1px solid #e5e5e5;

        .content {
          height: 320px;
          margin: 15px 0;
          border: 1px solid #e5e5e5;

          h3 {
            line-height: 40px;
            border-bottom: 1px solid #e5e5e5;
          }

          .left {
            width: 50%;
            height: 320px;
            float: left;
            overflow: auto;
            ;
            border-right: 1px solid #e5e5e5;

            ul>li {
              padding-left: 20px;
              text-align: left;
              line-height: 40px;
              border-bottom: 1px solid #e5e5e5;
            }
          }

          .right {
            width: 50%;
            float: right;
            ;
          }
        }

        .total {
          height: 45px;
          line-height: 30px;
          color: #58bc9c;
        }
      }

      .modal-footer {
        padding: 10px 0;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #73879c;
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .2s;
    }
  }

</style>
