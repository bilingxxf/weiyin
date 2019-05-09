<template>
  <div id="resourcesManage" class="main-body">
    <div class="main_wrapper main-wrapper">
      <div class="page-title">
        <p>号库管理</p>
      </div>
      <div class="info_wrapper">
        <el-date-picker class="ele-date-editor" v-model="selectDate" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" @change="getSelectDate" value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-button type="primary" class="rightButton" @click="newResource">新建号库</el-button>
        <!-- <div class="edit-group">
          <em>批量操作：</em>
          <span @click="showModel('deletegroup','删除')">删除</span>
        </div> -->
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="selectionChange"
          style="width: 100%;" :cell-style="cellStyle" :header-cell-style="getHeaderClass" v-loading="loading">
          <el-table-column width="10"></el-table-column>
          <el-table-column type="selection" align="left">
          </el-table-column>
          <el-table-column prop="id" width="80" label="序号" align="left">
          </el-table-column>
          <el-table-column prop="groupName" width="160" label="号库名称" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content={scope.row.groupName} placement="bottom-end" :offset="80"
                effect="light">
                <span slot="content">{{scope.row.groupName}}</span>
                <p class="writeWrapper">{{scope.row.groupName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" width="160" label="最近添加时间" align="left">
          </el-table-column>
          <el-table-column prop="sumCount" label="号库总数" align="left">
          </el-table-column>
          <el-table-column prop="last_count" label="号库剩余数" align="left">
          </el-table-column>
          <el-table-column prop="startCount" label="发起次数" align="left">
          </el-table-column>
          <el-table-column prop="passCount" label="通过人数" align="left">
          </el-table-column>
          <el-table-column label="当前状态" align="left">
            <template slot-scope="scope">{{ scope.row.last_count | testStatus }}</template>
          </el-table-column>
          <el-table-column label="操作" align="right" width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.sumCount>0" type="text" size="mini" @click="showModel('xls','报表',scope.row)">报表
              </el-button>
              <el-button type="text" size="mini" @click="addNewResources(scope.row)">导入</el-button>
              <!-- <el-button type="text" style="color:red;" size="mini" @click="showModel('delete','删除',scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
          <el-table-column width="20"></el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData.length!=0">
          <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="limit"
            layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 蒙层 -->
    <Dialog @callback="addNewGroup" v-if="dialogFlag=='addNumber'">
      <div class="dialog-content group" slot="content">
        <p><em>号库名称：</em>
          <el-input class="ele-input" v-model="form.groupName" placeholder="请输入号库名称"></el-input>
        </p>
      </div>
    </Dialog>
    <Dialog @callback="deleteSingle" @cancelCallback="cancelDelete" v-if="dialogFlag=='delete'">
      <div class="dialog-content group" slot="content">
        <p>确定要删除吗?</p>
      </div>
    </Dialog>
    <Dialog @callback="batchDelete" @cancelCallback="cancelDelete" v-if="dialogFlag=='deletegroup'">
      <div class="dialog-content group" slot="content">
        <p>确定要删除吗?</p>
      </div>
    </Dialog>
    <Dialog @callback="reportData" v-if="dialogFlag=='xls'">
      <div class="dialog-content group" slot="content">
        <p>确定需要下载报表?</p>
      </div>
    </Dialog>
    <Dialog @callback="confirmResources" v-if="dialogFlag=='import'">
      <div class="dialog-content import" slot="content" style="padding:60px 0 10px;">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="导入文件">
            <el-upload style="display: inline-block;height: 30px;" ref="upload" :headers="headers" :data="uploadData"
              :before-upload="beforeUpload" name="file" :limit="1" :on-success="onsuccess" :on-error="errorFile"
              :auto-upload="false" :action='postpublicUrl' :on-change="handleChange">
              <el-button slot="trigger" type="primary" class="ele-btn">导入加粉账号</el-button>
              <p class="tip">导入仅限txt文件(导入10000条以上可能失败并且时间过长,一行一个,回车换行)
                <br>
                微信号：6—20个字母、数字、下划线和减号，必须以字母开头（不区分大小写），不支持设置中文
                <br>
                QQ号：5-10位数字
                <br>
                手机号：11位数字
              </p>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="libraryLoading" v-if="libraryLoading" v-loading="libraryLoading" element-loading-text="数据解析中"></div>
      </div>
    </Dialog>

    <!-- 账号格式错误 -->
    <el-dialog title="错误格式数据" :visible.sync="centerDialogVisible" width="500px" style="margin-top:15vh;"
      :close-on-click-modal='false' :show-close='false' center>
      <el-scrollbar style="height:100%;">
        <ul class="errorFormat">
          <li v-for="(item,index) in libraryErrorArr" :key="index" style="line-height:18px;color:#333;">
            <span>第{{item.index}}行：</span>
            {{item.value}}
          </li>
        </ul>
      </el-scrollbar>
      <p style="padding-top:10px;color:red;">文件导入包含错误格式内容，点击确定继续</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelErrorData()" class="ele-btn"
          style="background-color:transparent;border-color:#dcdfe6;color:#606266;">取 消</el-button>
        <el-button type="primary" @click="confirmResources()" class="ele-btn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import Dialog from "../../components/dialog.vue";
  import {config} from "../../api/http.js";
  import  util from '../../../static/js/common.js';
  // import XLSX from "xlsx";
  // import { outputXlsxInArray } from "../../../static/js/downloadExcel.js";

  var downloadXLS = util.downloadXLS;
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
        resourcesShow: false,
        limit: 10,
        form: {
          groupName: ''
        },
        resourcesGroupShow: false,
        selectDate: "",
        tableData: [],
        currentPage: 1,
        total: 0,
        uploadData: {
          groupId: null,
          userId: sessionStorage.getItem("user_id")
        },
        headers: {
          'Content-Token': sessionStorage.getItem("token")
        },
        groupId: [],
        startTime: '',
        endTime: '',
        token: '',
        loading: true,
        postpublicUrl: config.linkUrl + 'api/v1/phone/export_phone',
        downPublicUrl: config.linkUrl,
        previousPage: false,
        libraryErrorArr: [],
        libraryLoading: false,
        repeatNum: 0,
        downloadInfo: {},
        centerDialogVisible: false,
        dataFlag: true,
      };
    },
    computed: {
      ...mapState([
        'dialogFlag'
      ])
    },
    mounted() {
      // outputXlsxInArray.bind(XLSX, {
      //   xslx: '我的号库',
      //   SheetNames: ['报表'],
      //   Sheets: [{
      //     headers: ['1', '2', '3'],
      //     data: [['1', '2', '安防监控']],
      //     merger:['注：', '这里的时间是创建时间'],
      //     config: {
      //       B1: {
      //         s: {
      //           font: {
      //             color: {rgb: "FFFF0000"},
      //             sz: 18,
      //             bold: true 
      //           }
      //         }
      //       },
      //       '!merges': [{
      //         s: { c:1, r: 0 },
      //         e: { c:4, r: 0 }
      //       }]
      //     }
      //   }]
      // })()
      this.resourcesInit();
      this.token = sessionStorage.getItem("token");
    },
    methods: {
      cancelErrorData() {
        this.dataFlag = false;
        this.centerDialogVisible = false;
        this.hideModel();
      },
      reportData() {
        let downloadInfo = this.downloadInfo;
        let url = this.downPublicUrl + "api/v1/phone_group/exportSource/" + downloadInfo.id + "?token=" + this.token;
        downloadXLS(url);
        this.hideModel();
      },
      handleChange(file) {
        this.libraryErrorArr = [];
        this.repeatNum = 0;
        if (file) {
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
              var regExp1 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
              var regExp2 = /^[1-9][0-9]{4,9}$/;
              var regExp3 = /^[a-zA-Z_][a-zA-Z0-9_-]{5,19}$/;
              let arr1 = [];
              let len = 0;
              let repeatArr = [];
              repeatArr = Array.from(new Set(arr));
              _this.repeatNum = length - repeatArr.length;

              function ReagexValidation(item, index) {
                if (regExp1.test(item) || regExp2.test(item) || regExp3.test(item)) {
                  ++num;
                } else {
                  ++index;
                  ++num;
                  _this.libraryErrorArr.push({
                    index: index,
                    value: item
                  })
                }
              }
              arr.map((item, index) => {
                !~ function (item, index) {
                  ReagexValidation(item, index);
                }(item, index)
              })
              console.log(_this.dataFlag)
              if (num == length && _this.dataFlag) {
                setTimeout(() => {
                  if (_this.libraryErrorArr.length > 0) {
                    _this.libraryLoading = false;
                    _this.centerDialogVisible = true;
                    _this.dataFlag = false;
                  }
                  _this.libraryLoading = false;
                }, 2500)
              }
            }
            reader.readAsText(file.raw, 'gb2312');
          } else {
            this.$message.error("请上传txt文件");
            this.hideModel();
          }
        }
      },
      showModel(type, title, row) {
        switch (type) {
          case 'delete':
            this.groupId = [row.id];
            break;
          case 'deletegroup':
            if (this.groupId.length == 0) {
              this.$message.error("请选择要删除的号库");
              return;
            };
            break;
          case 'xls':
            let downloadInfo = {
              id: row.id,
              passCount: row.passCount,
              groupName: row.groupName,
              startCount: row.startCount,
              sumCount: row.sumCount
            };
            this.downloadInfo = downloadInfo;
            break;
        }
        this.$store.dispatch("showDialog", {
          title: title,
          flag: type,
          showCancel: true
        })
      },
      cancelDelete() {
        this.groupId = [];
        this.$refs.multipleTable.clearSelection();
        this.hideModel();
      },
      hideModel() {
        this.$store.dispatch("hideDialog");
      },
      errorFile(err) {
        if (err.status == 500) {
          this.$message({
            message: '数据量过大导致上传失败',
            type: "error"
          });
        }
      },
      confirmResources() {
        if (this.repeatNum > 0) {
          this.$message({
            message: '数据重复' + this.repeatNum + '条',
            type: "error"
          });
        }
        this.$refs.upload.submit();
        this.centerDialogVisible = false;
      },
      addNewResources(row) {
        this.dataFlag = true;
        this.libraryLoading = false;
        this.uploadData.groupId = row.id;
        this.$store.dispatch("showDialog", {
          title: "导入号库",
          flag: "import"
        })
      },
      delete(groupId) {
        this.$http('phone_group/' + groupId, 'DELETE').then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: '删除成功',
              type: "success"
            });
            this.resourcesInit();
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
        }).catch(err => {
          this.$message({
            message: '删除失败',
            type: "error"
          });
        })
        this.hideModel();
      },
      //删除单条
      deleteSingle() {
        if (this.tableData.length == 1 && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1;
        }
        this.delete(this.groupId);
      },
      //批量删除
      batchDelete() {
        if (this.groupId.length == 0) {
          this.$message({
            message: '请选择要删除的号库',
            type: "error"
          });
        } else {
          if (this.previousPage) {
            this.currentPage = this.currentPage - 1;
          }
          this.delete(this.groupId);
        }
      },
      resourcesInit() {
        this.$http('phone_group/list', 'POST', {
          pageNo: this.currentPage,
          length: this.limit,
          startTime: this.startTime!=""? (this.startTime):"",
          endTime: this.endTime!=""?  (this.endTime):""
        }).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            let data = res.data.data.result
            this.tableData = []
            data.map((item) => {
              this.tableData.push({
                "sumCount": item.sumCount,
                "passCount": item.passCount,
                "startCount": item.startCount,
                "id": item.id,
                "groupName": item.groupName,
                "updateTime": item.updateTime,
                "last_count": item.sumCount - item.startCount
              })
            })
            this.total = res.data.data.total_count;
          }
        }).catch(err => {
          this.loading = true;
          this.$message({
            message: '获取数据失败',
            type: "error"
          });
        })
      },
      addNewGroup() {
        if (this.form.groupName == "") {
          this.$message({
            message: '请输入号库名称',
            type: "error"
          });
          return
        }
        let regEngAndNumber = new RegExp("^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,12}$");
        if (!regEngAndNumber.test(this.form.groupName)) {
          this.$message({
            message: '请输入正确资源名称',
            type: "error"
          });
          return false;
        } else {
          this.test = true;
        }
        this.$http('phone_group/', 'POST', {
          groupName: this.form.groupName
        }).then(res => {
          if (res.data.error_code == 0) {
            this.resourcesGroupShow = false;
            this.resourcesInit();
            this.form.groupName = '';
            this.$message({
              message: '创建资源组成功',
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
          this.$store.dispatch("hideDialog")
        }).catch(err => {
          this.$message({
            message: '创建资源组失败',
            type: "error"
          });
        })
      },
      onsuccess(response) {
        if (response.error_code == 0) {
          this.resourcesShow = false;
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.$store.dispatch("hideDialog");
          //  this.$refs.upload.clearFiles();
          //上传成功，刷新页面
          setTimeout(() => {
            this.resourcesInit();
          }, 500)

        } else {
          this.$message({
            message: response.error_message,
            type: 'error'
          })
          this.$store.dispatch("hideDialog");
        }
      },
      beforeUpload(file) {
        var $this = this;
        let flag = false;
        var isFILE;
        if (file.type === 'text/plain') {
          flag = true;
          isFILE = file.type === 'text/plain';
        } else if (file.type === 'application/vnd.ms-excel') {
          flag = true;
          isFILE = file.type === 'application/vnd.ms-excel';
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          flag = true;
          isFILE = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
        if (!flag) {
          this.$message.error('只能上传 txt或excel 格式!');
          return false;
        }
        this.fileList = true;
      },
      newResource() {
        this.form.groupName = '';
        this.$store.dispatch("showDialog", {
          title: "新建号库",
          showCancel: true,
          flag: "addNumber"
        })
      },
      selectionChange(val) {
        this.groupId = [];
        if (val.length == this.tableData.length) {
          if (this.currentPage > 1) {
            this.previousPage = true;
          } else {
            this.previousPage = false;
          }
        } else {
          this.previousPage = false;
        }
        val.forEach((item, index) => {
          this.groupId.push(item.id)
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.resourcesInit();
      },
      getSelectDate() {
        if (this.selectDate) {
          this.startTime = this.selectDate[0];
          this.endTime = this.selectDate[1];
        } else {
          this.startTime = '';
          this.endTime = '';
        }
        this.resourcesInit();
      },
      getHeaderClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (rowIndex == 0) {
          return 'background:#ecf5ff;color:#57aaff;font-size:14px;height:50px;';
        } else {
          return ''
        }
      },
      cellStyle() {
        return 'height:40px;padding:0;font-size:12px;color:#888;'
      },
    },
    filters: {
      testStatus: function (value) {
        if (value == '0') {
          return '已用完'
        } else {
          return '未用完'
        }
      }
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #resourcesManage {
    color: #6a6c6d;

    .main_wrapper {
      background: #fff;

      .el-date-editor {
        width: 300px;
        height: 30px !important;
        font-size: 12px;
      }

      .info_wrapper {
        .rightButton {
          float: right;
          height: 30px;
          width: 90px;
          font-size: 12px;
          line-height: 0;
          padding: 0;
        }

        .edit-group {
          margin-top: 20px;
        }
      }

      .title {
        position: relative;

        h2 {
          margin-bottom: 30px;
          font-size: 20px;
          color: #333;
        }

        .el-button {
          position: absolute;
          right: 0;
          top: 0;
          height: 30px;
          font-size: 12px;
          line-height: 0;
        }
      }

      .el-table {
        margin-top: 20px;
      }

      .el-pagination {
        margin-top: 10px;
        text-align: center;
      }

    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }

    .libraryLoading {
      opacity: 0.8;
      background: #fff;
      height: 360px;
      width: 600px;
      line-height: 360px;
      text-align: center;
      left: 0;
      top: 57px;
      z-index: 99;
      position: absolute !important;
    }

    .errorFormat {
      min-height: 200px;
      max-height: 200px;
    }
  }

</style>
