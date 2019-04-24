<template>
  <div class="header">
    <div class="head_title">
      <div class="slogn">
        <img src="../../assets/images/logo1.png" alt="" class="logo" />
        <span class="logoTitle">微营销系统</span>
      </div>
      <div class="group">
        <div class="user-id">{{userId}}</div>
        <div class="log" @click="showLog">任务日志</div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">{{username}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <div @click="changePassword" class="loginOut">
              <el-dropdown-item class="clearfix">
                修改密码
              </el-dropdown-item>
            </div>
            <div @click="loginOut" class="loginOut">
              <el-dropdown-item class="clearfix">
                　登出　
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <Dialog @callback="handleEnSure" v-if="dialogFlag == 'passWord'">
      <div class="dialog-content group" slot="content" style="padding: 30px 0 9px 0;">
        <el-form ref="form" :model="passForm" label-width="85px" style="padding:0 100px;" v-if="!forgetPass">
          <el-form-item label="原密码:　">
            <el-input v-model="passForm.originPassword" type="password" class="ele-input" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码:　">
            <el-input v-model="passForm.newPassword" type="password"  class="ele-input" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" style="margin-bottom:0!important">
            <el-input v-model="passForm.sureNewPassword" type="password" class="ele-input" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
          <el-button type="text" style="margin-right:60px;font-size:15px;" >
            <!-- <span @click="handleForgetPass">忘记密码</span> -->
          </el-button>
        </el-form>
        <div class="forgetPass" v-if="forgetPass">
          请管理员重置密码！联系方式：<em>0571-88888</em>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog.vue';
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
  export default {
    created() {
      this.$store.commit("indentity");
    },
    data() {
      return {
        passForm: {
          originPassword:"",
          newPassword:"",
          sureNewPassword:""
        },
        userId:'',
        username:"",
        regExp:true
      };
    },
    components:{
      Dialog
    },
    computed:{
      ...mapState([
        'dialogFlag',
        'addRouters'
      ]),
      getKey() {
        return this.$route.fullPath
      }
    },
    mounted() {
      this.userId = sessionStorage.getItem("user_id");
      this.username = sessionStorage.getItem("username");
    },
    beforeDestroy() {
      clearTimeout(this.timer);
      clearTimeout(this.listTimer);
    },
    methods: {
      //登出
      loginOut() {
          this.$router.replace("/");
          sessionStorage.removeItem("indentity");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("username");
          sessionStorage.removeItem("user_id");
          sessionStorage.removeItem("wz");
          sessionStorage.removeItem("zh");
          this.$store.dispatch("clearRouters");
      },
      //修改密码弹窗
      changePassword(){
        this.forgetPass=false;
        this.$store.dispatch("showDialog",{
          title:'修改密码',
          showCancel:true,
          flag:'passWord'
        })
      },
      //确定修改密码
      handleEnSure(){
        if(this.passForm.newPassword==""||this.passForm.originPassword==""||this.passForm.sureNewPassword==""){
          this.$message.error("请填写完整信息");
        }else{
          if(this.passForm.newPassword!=this.passForm.sureNewPassword){
            this.$message.error("请保证新密码一致");
          }else{
            this.regExpPass(this.passForm.newPassword);
            this.regExpPass(this.passForm.originPassword);
            this.regExpPass(this.passForm.sureNewPassword);
            if(this.regExp){
              this.$http("modify_pwd", "PUT",{
                username:sessionStorage.getItem("username"),
                old_password:this.passForm.originPassword,
                new_password:this.passForm.newPassword
              })
                .then(res => {
                  if(res.data.error_code == 0) {
                    this.$store.dispatch("hideDialog");
                    this.$message.success("修改密码成功");
                    this.$router.push("/");
                    sessionStorage.removeItem("indentity");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("username");
                    sessionStorage.removeItem("user_id");
                    this.flag = 'pass';
                  } else {
                    this.$message.error(res.data.error_message);
                  }
                })
                .catch(err => {
                  this.$message.error("修改密码失败");
                });
            }else{
              this.$message.error("密码由6-16位英文或数字组成");
              this.regExp=true;
            }
          }
        }
      },
      //修改密码正则验证
      regExpPass(pass){
        let reg = /^[a-zA-Z0-9]{6,16}$/;
        if(!reg.test(pass)){
          this.regExp=false;
        }
      },
      //取消密码
      cancelPassword(){
        this.passForm.newPassword="";
        this.passForm.originPassword="";
        this.passForm.sureNewPassword="";
        this.centerDialogVisible=false;
      },
      //忘记密码
      handleForgetPass(){
        this.forgetPass=true;
      },
      getQueryInfor(){ //  轮询导入结果信息
        this.$http('notification/'+this.userId,'GET').then(res=>{
          if(res.data.error_code == 0) {
            let datas = res.data.data
            if(datas.length == 0 || datas == null) {
              return false
            } else {
              for(let i = 0; i < datas.length; i++) {
                this.$notify({
                  title: datas[i].module,
                  message: datas[i].notification,
                  type: datas[i].type,
                  offset: i*100
                });
              }
            }
          } else {
            return false
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      showLog(){

        this.$router.push({
          path:"mr_log"
        })
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../../assets/icon/iconfont.css';
  .header{
    width: 100%;
    height: 80px;
    position: fixed;
    background-color: rgb(76, 174, 218);
    text-align:left;
    left:0;
    top:0;
    z-index: 1997;
    clear: both;
    .head_title{
      display: flex;
      align-items:center;
      justify-content:space-between;
      .group{
        display: flex;
        align-items:center;
        color:#fff;
        margin-right: 20px;
        .user-id{
          margin-right:20px;
          font-size:20px;
        }
        .log{
          margin-right: 20px;
          cursor: pointer;
          font-size: 14px;
        }
      }
    }
    .slogn{
      overflow: hidden;
    }
    .logo {
      margin: 0 17px 0 43px;
      float: left;
    }
    .logoTitle {
      // display: inline-block;
      float: left;
      line-height: 80px;
      color: #fff;
      font-size: 18px;
    }
    .el-dropdown-link {
      color: #fff;
    }
    .head_title {
      height: 80px;
      line-height: 60px;
    }
  }
</style>
