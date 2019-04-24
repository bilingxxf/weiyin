<template>
  <div class="app-container main-body">
    <div class="main_wrapper">
      <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <div class="wrap">
        <div>请选择账号所属分组:
          <el-select v-model="groupValue" disabled placeholder="请选择" class="ele-select" style="margin-left:10px;">
            <el-option v-for="item in groupOptions" :key="item.wx_user_group_id" :label="item.wx_user_group_name"
              :value="item.wx_user_group_id">
            </el-option>
          </el-select>
        </div>
        <div>
        </div>
        <div class="loginMode">
          请确定账号登陆方式:　
          <el-radio-group v-model="autoWidth">
            <el-radio :label="1">二维码</el-radio>
            <el-radio :label="3">批量登录</el-radio>
          </el-radio-group>
        </div>
        <p class="btn_wrapper">
          <el-button type="primary" class="ele-btn" @click="toBind">下一步</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        groupValue: "",
        groupOptions: null,
        autoWidth: 1,
        cloud: 0,
      };
    },
    mounted() {
      this.getGroup();
    },
    methods: {
      //下一步
      toBind() {
        if (this.autoWidth == 1) {
          this.$router.push({
            path: 'mr_bind',
            query: {
              groupId: this.groupValue
            }
          })
        } else if (this.autoWidth == 2) {
          this.$router.push('mr_accountBind')
        } else {
          this.$router.push('mr_batchBind')
        }
      },
      //获取分组
      getGroup() {
        let data = {
          limit: 10,
          page: 1,
        }
        this.$http('wx_group/list', 'GET', data).then((res) => {
          if (res.data.error_code === 0) {
            this.groupOptions = res.data.data.result;
            this.groupValue = res.data.data.result[0].wx_user_group_id;
          } else {}
        })
      },
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
    text-align: center;
    color: #73879c;
    font-size: 14px;
    padding-top: 20px;

    .el-steps--simple {
      padding: 15px 8%;
    }

    .main_wrapper {
      background: #fff;
    }

    .wrap {
      font-size: 14px;
      color: #666;
      margin: 60px 0;
      display: inline-block;
      text-align: left;

      .loginMode {
        margin: 25px 0 40px;
      }

      .btn {
        height: 30px;
        line-height: 0;
      }

      .el-radio-group {
        .el-radio {
          margin-right: 10px;
        }
      }

      .btn_wrapper {
        text-align: center;
        margin-bottom: 30px;
      }
    }
  }

</style>
