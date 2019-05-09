<template>
  <div id="account" class="main-body">
    <div class="account-main main-wrapper">
      <div class="addAccount">
        <div class="page-title">
          <span>子账号管理</span>
        </div>
        <div class="add">
          <div class="left">
            <el-input placeholder="请输子账号名称" v-model="search.userName" suffix-icon="el-icon-search" @change="searchList"
              class="ele-input">
            </el-input>
          </div>
          <div class="right">
            <el-button class="ele-btn" type="primary" @click="handleAddChildAccount">添加账号</el-button>
          </div>
        </div>
      </div>
      <div class="accountTable">
        <div class="table">
          <div class="tableContent">
            <el-table :data="tableData" style="width: 100%" :cell-style="cellStyle"
              @selection-change="handleSelectionChange" :header-cell-style="getHeaderClass" v-loading="loading"
              class="ele-table-init">
              <el-table-column type="selection" align="left" fixed="left"></el-table-column>
              <el-table-column label="序号" width="80" align="left">
                <template slot-scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
              </el-table-column>
              <el-table-column prop="user_name" label="账号" align="left">
                <template slot-scope="scope">
                  <el-tooltip :open-delay="350" content={scope.row.user_name} placement="bottom-end" :offset="80"
                    effect="light">
                    <span slot="content" class="tooltip">{{scope.row.user_name}}</span>
                    <p class="writeWrapper">{{scope.row.user_name}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="ban_state" label="状态" align="left">
                <template slot-scope="scope">{{scope.row.ban_state|formatState}}</template>
              </el-table-column>
              <el-table-column prop="created_time" label="添加时间" align="left">
              </el-table-column>
              <el-table-column prop="updatedTime" label="修改时间" align="left">
              </el-table-column>
              <el-table-column label="操作" align="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleResetChildAccount(scope.row,scope.$index)">重置密码</el-button>
                  <el-button type="text" v-if="scope.row.ban_state==1"
                    @click="handleToggleOpen(scope.row,scope.$index)">启用</el-button>
                  <el-button type="text" v-else @click="handleToggleClose(scope.row,scope.$index)">禁用</el-button>
                  <el-button type="text"  @click="delAccount(scope.$index,scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column width="30">
              </el-table-column>
            </el-table>
            <div class="paganation" v-if="tableData.length!=0">
              <el-pagination :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="limit" layout="total, prev, pager, next"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog @callback="addChildAccount" class="dialog-accounts" v-if="dialogFlag == 'addChildAccount'">
      <div class="dialog-content group add-accounts" slot="content" style="padding: 30px 0 9px 0;">
        <el-form ref="form" :model="addForm" label-width="125px" style="padding:0 0px;">
          <el-form-item label="账号: ">
            <el-input v-model="addForm.userName" class="ele-input" placeholder="请输入账号"></el-input>
            <span>+</span>
            <el-input v-model="addForm.startingValue" maxlength="6" class="ele-input start-value" @keyup.native="number('startingValue')"
              placeholder="请输入账号起始值"></el-input>
          </el-form-item>

          <el-form-item  class="input-width" label="数量: ">
            <el-input v-model="addForm.count" class="ele-input" @keyup.native="number('count')" placeholder="请输入账号数量">
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="序号长度: ">
            <el-input v-model="addForm.numberLength" class="ele-input" @keyup.native="number('numberLength')"
              placeholder="请输入序号长度"></el-input>
          </el-form-item>
          <el-form-item label="序号起始值: ">
            <el-input v-model="addForm.startingValue" class="ele-input" @keyup.native="number('startingValue')"
              placeholder="请输入账号起始值"></el-input>
          </el-form-item> -->

          <el-form-item  class="input-width" label="新密码: ">
            <el-input auto-complete="new-password" v-model="addForm.password" type="password" class="ele-input" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item  class="input-width" label="确认密码: " style="margin-bottom:0!important">
            <el-input  v-model="addForm.rptpassword" type="password" class="ele-input" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
          <el-button type="text" style="margin-right:60px;font-size:15px;">
          </el-button>
        </el-form>
      </div>
    </Dialog>
    <Dialog @callback="resetChildAccount" v-if="dialogFlag=='resetChildAccount'"></Dialog>
    <Dialog @callback="setState('0')" v-if="dialogFlag=='open'"></Dialog>
    <Dialog @callback="setState('1')" v-if="dialogFlag=='close'"></Dialog>
    <Dialog @callback="deleteChildAccount" v-if="dialogFlag=='deleteChildAccount'"></Dialog>
  </div>
</template>
<script>
  import Dialog from "../../components/dialog.vue";
  import {
    mapState,
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        currentPage: 1,
        resetUser: "",
        search: {
          userName: "",
          startTime: "",
          endTime: ""
        },
        addForm: {
          userName: "",
          password: "",
          rptpassword: "",
          count: "",
          numberLength: "",
          startingValue: ""
        },
        resetForm: {
          password: "",
          newPassword: "",
          sureNewPassword: ""
        },
        limit: 10,
        page: 1,
        total: 0,
        tableData: [],
        username: "",
        loading: true,
        flag: "",
        userId: 0,
        childAccountId:"",
        childIndex:""
      };
    },
    computed: {
      ...mapState([
        'dialogFlag'
      ])
    },
    mounted() {
      this.init();
      this.username = sessionStorage.getItem("username");
    },
    methods: {
      deleteChildAccount(){
        this.$http(`/child_user`,'DELETE', {
            user_id: this.childAccountId
          }).then(res => {
              if (res.data.error_code == 0) {
                  this.tableData.splice(this.childIndex, 1);
                  this.$message.success('删除成功');
                  this.$store.dispatch("hideDialog");
                  console.log(this.total)
                  if(this.tableData==0&&this.total!=1){
                     --this.page;
                  }
                  this.init();
              } else {
                this.$message.warning(res.data.error_message);
              }
          }).catch(err => {
            console.log(err);
          })
      },
      delAccount(index, item) {
        if (item.role === 'ROLE_USER') {
          this.$message.warning("只能删除子账号");
          return;
        } else {
          // 进行判断1： 是否解绑微信号
          this.$http(`/wx_wxuser/${item.user_id}`, 'GET').then(res => {
              if (res.data.error_code === 0) {
                if (Number(res.data.data.length) > 0) { // 表示绑定微信账号
                    this.$message.warning('该账号绑定了微信账号,不能删除');
                } else { // 未绑定微信账号
                  this.childAccountId = item.user_id;
                  this.childIndex = index;
                   this.$store.dispatch("showDialog", {
                    title: '删除子账号',
                    content: "此操作将永久删除该账号, 是否继续?",
                    showCancel: true,
                    flag: 'deleteChildAccount'
                  })
                }
              } else {
                this.$message.warning(res.data.error_message);
              }
          }).catch(err => {
            console.log(err);
          });
        }
      },
      //添加账号限制
      number(num) {
        switch (num) {
          case 'count':
            this.addForm.count = this.addForm.count.replace(/[^\.\d]/g, '');
            this.addForm.count = this.addForm.count.replace('.', '');
            break;
          case 'numberLength':
            this.addForm.numberLength = this.addForm.numberLength.replace(/[^\.\d]/g, '');
            this.addForm.numberLength = this.addForm.numberLength.replace('.', '');
            if (this.addForm.numberLength < 1 || this.addForm.numberLength > 6) {
              this.addForm.numberLength = "";
            }
            break;
          case 'startingValue':
            this.addForm.startingValue = this.addForm.startingValue.replace(/[^\.\d]/g, '');
            this.addForm.startingValue = this.addForm.startingValue.replace('.', '');
            break;
        }
      },
      //搜索
      searchList() {
        this.page = 1;
        this.currentPage = 1;
        this.init();
      },
      //表格勾选
      handleSelectionChange(selection) {
        if (selection.length == this.tableData.length) {
          if (this.page > 1) {
            this.previousPage = true;
          } else {
            this.previousPage = false;
          }
        } else {
          this.previousPage = false;
        }
      },
      //分页
      handleCurrentChange(val) {
        this.page = val;
        this.loading = true;
        this.init();
      },
      // 表格头部背景颜色
      getHeaderClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:14px;color:#409eff;height:50px";
        } else {
          return "";
        }
      },
      setState(num) {
        this.$http("user/update_user_data", "POST", {
            state: num * 1,
            userId: this.userId
          }).then(res => {
            if (res.data.error_code == 0) {
              this.$message.success("操作成功!");
              this.$store.dispatch("hideDialog");
              this.init();
            } else {
              this.$message({
                message: res.data.error_message,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message.success("操作失败!");
          });
      },
      //开启、关闭账号
      handleToggleOpen(item, index) {
        this.userId = item.user_id;
        this.$store.dispatch("showDialog", {
          title: "启用账号",
          showCancel: true,
          content: "确定启用该账号？",
          flag: 'open'
        })
      },
      handleToggleClose(item, index) {
        this.userId = item.user_id;
        this.$store.dispatch("showDialog", {
          title: "禁用账号",
          showCancel: true,
          content: "确定禁用该账号？禁用后不能登录本平台",
          flag: 'close'
        })
      },
      //重置密码
      resetChildAccount() {
        this.$http("user/reset_user", "POST", {
          userName: this.resetUser
        }).then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "重置密码成功(123456)",
              type: "success"
            });
            this.$store.dispatch("hideDialog");
          } else {
            this.$message({
              message: "重置密码失败:" + res.data.error_message,
              type: "error"
            });
          }
        }).catch(err => {
          this.$message.error("重置密码失败");
        });
      },
      //编辑
      handleResetChildAccount(item, index) {
        this.resetUser = item.user_name;
        this.$store.dispatch("showDialog", {
          title: '密码重置',
          content: "确定需要重置密码？",
          showCancel: true,
          flag: 'resetChildAccount'
        })
      },
      handlerclose() {
        this.addForm.userName = '';
        this.addForm.password = '';
        this.addForm.rptpassword = '';
        this.addForm.count = '';
        this.addForm.numberLength = '';
        this.addForm.startingValue = '';
      },
      //添加子账号
      addChildAccount() {
        let form = this.addForm;
        let userReg = /^(?=.*[a-zA-Z])([\w-]@?\.?){3,12}$/;
        let passReg = /^[a-zA-Z0-9]{6,16}$/;
        if (form.userName == "") {
          this.$message.warning("请填写账号！");
          return;
        };
        if (!userReg.test(form.userName)) {
          this.$message.warning("账号由3-12位英文或英文和数字组合而成！");
          return;
        }
        if (form.count != 1 && form.startingValue == "") {
          this.$message.warning("请填写序号起始值！");
          return;
        }
        if (form.count == "") {
          this.$message.warning("请填写账号数量！");
          return;
        };
        if (form.password == "") {
          this.$message.warning("请填写密码！");
          return;
        };
        if (!passReg.test(form.password)) {
          this.$message.warning("密码由6-16位英文或数字组成！");
          return;
        };
        if (form.rptpassword != form.password) {
          this.$message.warning("两次密码输入不一致！");
          return;
        };
        form.numberLength = Number(form.count);
        if (Number(form.numberLength) > 50) {
          this.$message.warning("子账号最多建50个！");
          return;
        }
        if(isNaN(Number(form.startingValue))){
          this.$message.warning("请输入正确的起始值");
          return;
        }
        if(isNaN(Number(form.count))){
          this.$message.warning("请输入正确的数量");
          return;
        }

        if (form.startingValue == '') {
          var parmas = {
            "childUserName": form.userName,
            "number": Number(form.count),
            "parentUserId": Number(sessionStorage.getItem('user_id')),
            "password": form.password
          }
        } else {
          var parmas = {
            "childUserName": form.userName,
            "number": Number(form.count),
            "parentUserId": Number(sessionStorage.getItem('user_id')),
            "password": form.password,
            "value": form.startingValue
          }
        }
        this.$http("user/batch_add_user", "POST", parmas).then(res => {
          if (res.data.error_code == 0) {
            this.$message.success("添加成功");
            this.page = 1;
            this.currentPage = 1;
            this.searchList();
            this.$store.dispatch("hideDialog");
            form.userName = "";
            form.password = "";
            form.rptpassword = "";
            form.count = "";
            form.startingValue = "";
            form.numberLength = "";
          } else {
            if (res.data.error_message == "fail") {
              console.log(form.count)
              if (form.count == res.data.data.length) {
                
                this.$message.error(res.data.data.join(',') + '重复添加失败');
              } else {
                this.$message.error(res.data.data.join(',') + '重复添加失败,其余添加成功');
              }
            } else {
              this.$message.error(res.data.error_message);
            }
          }
        }).catch(err => {
          this.$message.error(err);
        });

      },
      //显示添加子账号弹框
      handleAddChildAccount() {
        this.handlerclose();
        this.$store.dispatch("showDialog", {
          title: '添加账号',
          showCancel: true,
          flag: 'addChildAccount'
        })
      },
      //初始化列表
      init() {
        let _this = this;
        let userId = sessionStorage.getItem("user_id");
        let search = _this.search;
        let parmas = {
          length: this.limit,
          pageNo: this.page,
          parentUserId: userId
        };
        if (search.userName != "") {
          parmas.userName = search.userName;
        };
        if (search.startTime != "") {
          parmas.startTime = search.startTime + " 00:00:01";
        };
        if (search.endTime != "") {
          parmas.endTime = search.endTime + " 23.59:59";
        };
        this.$http("child_user/list", "POST", parmas).then(res => {
          if (res.data.error_code == 0) {
            this.tableData = res.data.data.result;
            this.total = res.data.data.totalCount;
          } else {
            this.$message.error(res.data.error_message);
          }
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$message.error("获取列表失败");
        });
      },
      cellStyle() {
        return 'height:40px;padding:0;font-size:12px;color:#888;'
      }
    },
    filters: {
      formatState(state) {
        let str = state + '';
        switch (str) {
          case '0':
            return "启用";
            break;
          case '1':
            return "禁用";
            break;
          default:
            return "启用";
            break;
        }
      }
    }
  };
</script>
<style scoped lang="scss">
  #account {
    .addAccount {
      h3 {
        font-size: 20px;
        color: #333;
        margin-bottom: 15px;
        line-height: 1;
      }

      .add {
        box-sizing: border-box;
        background-color: #fff;
        overflow: hidden;

        .left {
          float: left;
          margin-right: 22px;

          span {
            line-height: 24px;
            font-size: 14px;
            color: #707070;
            margin-right: 22px;
          }

          .el-input__inner {
            height: 32px !important;
          }

          .el-input {
            width: 200px !important;
            height: 30px !important;
          }
        }

        .right {
          float: right;

          .el-button {
            width: 100px;
            height: 32px;
            line-height: 6px;
            font-size: 12px;
          }
        }
      }
    }

    .accountTable {
      background: #fff;

      .table {
        background-color: #fff;

        .el-button {
          font-size: 12px;
        }

        .tableContent {
          position: relative;

          .el-table .cell img {
            width: 45px;
            height: 45px;
          }

          .paganation {
            text-align: center;
            margin-top: 5px;
          }
        }

        .checkedAll {
          position: absolute;
          top: 15px;
          left: 58px;
        }

        .tableBottom {
          text-align: center;
          padding: 35px 0;

          .el-pagination {
            display: inline-block;
          }

          span {
            color: #303133;
            font-size: 14px;
          }
        }
      }
    }

    .el-form-item {
      margin-bottom: 12px;
    }
  }
</style>
