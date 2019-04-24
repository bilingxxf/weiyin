<template>
  <div id="readList" class="main-body">
    <div class="main-wrapper">
      <div class="info_wrapper">
        <div class="page-title">
          <span>阅读列表</span>
        </div>
        <div class="search-content" style="margin-bottom:20px;">
          <div class="left">
            <el-date-picker class="ele-date-editor" v-model="searchDate" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="searchList">
            </el-date-picker>
          </div>
        </div>
        <div class="table_wrapper">
          <el-table ref="multipleTable" :data="readData" class="ele-table-init" v-loading="loading">
            <el-table-column width="20" fixed></el-table-column>
            <el-table-column label="序号" align="left" width="50">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="readUrl" label="网址" align="left" width="210">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.readUrl" placement="bottom" effect="light"
                  :offset="80">
                  <span class="writeWrapper">{{scope.row.readUrl}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="任务名称" align="left" width="210">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.planName" placement="bottom" effect="light"
                  :offset="80">
                  <span class="writeWrapper">{{scope.row.planName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="initReadCount" label="初始阅读量" align="left" width="95"></el-table-column>
            <el-table-column prop="targetReadCount" label="计划增加量" align="left" width="95"></el-table-column>
            <el-table-column prop="readType" label="阅读模式" align="left" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.readType|judgeState}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="executeCount" label="完成阅读量" align="left" width="95"></el-table-column>
            <el-table-column prop="createdTime" label="创建时间" align="left" width="145">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.createdTime" placement="bottom" effect="light"
                  :offset="80">
                  <span class="writeWrapper">{{scope.row.createdTime}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="left" width="65">
              <template slot-scope="scope">
                <span>{{scope.row.status|formatState}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updatedTime" label="更新时间" align="left" width="145">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.updatedTime" placement="bottom" effect="light"
                  :offset="80">
                  <span class="writeWrapper"
                    v-if="scope.row.updatedTime!=='1999-01-01 00:00:00'">{{scope.row.updatedTime}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" align="left" width="190">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.note" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.note}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <el-button type="text" size="mini" v-if="scope.row.status==0||scope.row.status==3"
                  @click="showModel('editor','编辑任务',scope.row)">编辑</el-button>
                <el-button type="text" size="mini" v-if="scope.row.status==0||scope.row.status==3"
                  @click="showModel('perform','执行任务',scope.row)">执行</el-button>
                <el-button type="text" size="mini" v-if="scope.row.status==1"
                  @click="showModel('pause','暂停任务',scope.row)">暂停</el-button>
                <el-button type="text" size="mini" v-if="scope.row.status==0||scope.row.status==1||scope.row.status==3"
                  @click="showModel('close','关闭任务',scope.row)">关闭</el-button>
                <el-button type="text" size="mini" @click="showModel('view','查看任务',scope.row)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column width="20"></el-table-column>
          </el-table>
          <div class="pagination" v-if="total!=0">
            <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize"
              layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑 -->
    <Dialog v-if="dialogFlag=='editor'" @callback="handleEditor">
      <div class="dialog-content dialog-detail editor-dialo-detail" slot="content">
        <ul>
          <li><span>计划增加量:</span>
            <p>{{editorValue.planCount}}</p>
          </li>
          <li><span>开始时间:</span>
            <el-date-picker v-model="editorValue.dateValue" type="datetime" placeholder="选择日期时间" class="selectDataTime"
              :default-value="defaultValue">
            </el-date-picker>
          </li>
          <li>
            <span>单次任务执行量:</span>
            <el-input v-model="editorValue.startTaskCount" @keyup.native="number('startTaskCount')" placeholder="请输入数量">
            </el-input> ~ <el-input v-model="editorValue.endTaskCount" @keyup.native="number('endTaskCount')"
              placeholder="请输入数量"></el-input>
          </li>
          <li><span>任务执行时间间隔:</span>
            <el-input v-model="editorValue.startTaskValue" @keyup.native="number('startTaskValue')" placeholder="请输入内容">
            </el-input> ~ <el-input v-model="editorValue.endTaskValue" @keyup.native="number('endTaskValue')"
              placeholder="请输入内容"></el-input> 秒
          </li>
        </ul>
      </div>
    </Dialog>
    <!-- 查看 -->
    <Dialog v-if="dialogFlag=='view'" @callback="handleView">
      <div class="dialog-content dialog-detail editor-dialo-detail" slot="content">
        <ul>
          <li><span>计划增加量:</span>
            <p>{{editorValue.planCount}}</p>
          </li>
          <li><span>开始时间:</span>
            <el-date-picker v-model="editorValue.dateValue" type="datetime" placeholder="选择日期时间" class="selectDataTime"
              :default-value="defaultValue" disabled>
            </el-date-picker>
          </li>
          <li>
            <span>单次任务执行量:</span>
            <el-input v-model="editorValue.startTaskCount" disabled @keyup.native="number('startTaskCount')"
              placeholder="请输入数量"></el-input> ~ <el-input v-model="editorValue.endTaskCount" disabled
              @keyup.native="number('endTaskCount')" placeholder="请输入数量"></el-input>
          </li>
          <li><span>任务执行时间间隔:</span>
            <el-input v-model="editorValue.startTaskValue" disabled @keyup.native="number('startTaskValue')"
              placeholder="请输入内容"></el-input> ~ <el-input v-model="editorValue.endTaskValue" disabled
              @keyup.native="number('endTaskValue')" placeholder="请输入内容"></el-input> 秒
          </li>
        </ul>
      </div>
    </Dialog>
    <!-- 执行 -->
    <Dialog v-if="dialogFlag=='perform'" @callback="handlePerform">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">确定要执行该任务吗？</p>
      </div>
    </Dialog>
    <!-- 暂停 -->
    <Dialog v-if="dialogFlag=='pause'" @callback="handlePause">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">确定要暂停该任务吗？</p>
      </div>
    </Dialog>
    <!-- 关闭 -->
    <Dialog v-if="dialogFlag=='close'" @callback="handleClose">
      <div class="dialog-content dialog-detail" style="padding:40px 0;position:relative;" slot="content">
        <textarea placeholder="请输入内容" v-model="noteValue" @input="noticeChange"></textarea>
        <span class="total">{{noteCount}}/{{noteTotal-noteCount}}</span>
      </div>
    </Dialog>
  </div>
</template>
<script>
  import {config} from "../../api/http.js";
  import Dialog from "../../components/dialog.vue";
  import {
    mapState,
    mapMutations,
    mapGetters,
    mapActions
  } from "vuex";
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        searchDate: "",
        readData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        downPublicUrl: config.linkUrl,
        token: "",
        editorValue: {
          url: "",
          planCount: 0,
          dateValue: "",
          startTaskCount: "",
          endTaskCount: "",
          startTaskValue: "",
          endTaskValue: ""
        },
        defaultValue: "",
        userId: "",
        url: "",
        noteValue: "",
        noteCount: 0,
        noteTotal: 30,
        loading: true
      };
    },
    computed: {
      ...mapState(["dialogFlag"])
    },
    mounted() {
      this.userId = sessionStorage.getItem("user_id");
      this.token = sessionStorage.getItem('token');
      this.getReadData();
    },
    methods: {
      //备注字数限制
      noticeChange(e) {
        this.noteCount = e.target.value.length;
        if (this.noteCount <= this.noteTotal) {
          this.noteCount = this.noteValue.length;
          this.noteValue = e.target.value;
        } else {
          this.noteCount = this.noteTotal;
          this.noteValue = e.target.value.substring(0, this.noteTotal);
        }
      },
      //关闭弹窗，清空数据
      clearData() {
        this.editorValue.planCount = 0;
        this.editorValue.dateValue = "";
        this.editorValue.startTaskCount = "";
        this.editorValue.endTaskCount = "";
        this.editorValue.startTaskValue = "";
        this.editorValue.endTaskValue = "";
        this.noteValue = "";
      },
      //关闭，暂停，执行
      handleStatus(status) {
        let data = {
          id: this.editId,
          status: status
        }
        if (status == 4) {
          data["note"] = this.noteValue;
        }
        this.$http('read/update_read_report', "POST", data).then(res => {
          if (res.data.error_code == 0) {
            this.$message.success(res.data.error_message);
            this.clearData();
            this.hideModel();
            this.getReadData();
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //日期格式转换
      formatDateTime(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
      },
      number(num) {
        switch (num) {
          case 'startTaskCount':
            this.editorValue.startTaskCount = this.editorValue.startTaskCount.replace(/[^\.\d]/g, '');
            this.editorValue.startTaskCount = this.editorValue.startTaskCount.replace('.', '');
            if (this.editorValue.startTaskCount == "0") {
              this.editorValue.startTaskCount = "";
            }
            break;
          case 'endTaskCount':
            this.editorValue.endTaskCount = this.editorValue.endTaskCount.replace(/[^\.\d]/g, '');
            this.editorValue.endTaskCount = this.editorValue.endTaskCount.replace('.', '');
            if (this.editorValue.endTaskCount == "0") {
              this.editorValue.endTaskCount = "";
            }
            break;
          case 'startTaskValue':
            this.editorValue.startTaskValue = this.editorValue.startTaskValue.replace(/[^\.\d]/g, '');
            this.editorValue.startTaskValue = this.editorValue.startTaskValue.replace('.', '');
            if (this.editorValue.startTaskValue == "0") {
              this.editorValue.startTaskValue = "";
            }
            break;
          case 'endTaskValue':
            this.editorValue.endTaskValue = this.editorValue.endTaskValue.replace(/[^\.\d]/g, '');
            this.editorValue.endTaskValue = this.editorValue.endTaskValue.replace('.', '');
            if (this.editorValue.endTaskValue == "0") {
              this.editorValue.endTaskValue = "";
            }
            break;
        }
      },
      //日期搜索
      searchList() {
        this.page = 1;
        if (this.searchDate != null) {
          this.startTime = this.searchDate[0];
          this.endTime = this.searchDate[1];
        }
        this.getReadData();
      },
      hideModel() { // 隐藏
        this.$store.dispatch('hideDialog')
      },
      getReadData() { //  列表
        let params = {
          length: 10,
          pageNo: this.page,
          userId: Number(this.userId)
        };
        this.loading = true;
        if (this.searchDate != null) {
          params['startTime'] = this.startTime;
          params['endTime'] = this.endTime;
        }
        this.$http("read/read_list", "POST", params).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            let data = res.data.data;
            this.total = data.totalCount;
            this.readData = data.result;
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      showModel(type, title, row) {
        if (type == "editor" || type == 'view') {
          this.editId = row.id;
          this.$http('read', 'GET', {
            readReportId: this.editId
          }).then(res => {
            if (res.data.error_code == 0) {
              let data = JSON.parse(res.data.data.planParam);
              this.editorValue = data;
              this.editorValue.url = data.url;
              this.editorValue.planCount = data.planCount;
              this.editorValue.startTaskCount = data.startTaskCount == 0 ? 60 : data.startTaskCount;
              this.editorValue.endTaskCount = data.endTaskCount == 0 ? 60 : data.endTaskCount;
              this.editorValue.startTaskValue = data.startTaskValue == 0 ? 80 : data.startTaskValue;
              this.editorValue.endTaskValue = data.endTaskValue == 0 ? 80 : data.endTaskValue;
              if (type == 'editor') {
                let myDate = new Date();
                this.editorValue.dateValue = myDate;
              }
            } else {
              this.$message.error(res.data.error_message);
            }
          }).catch(err => {
            this.$message.error(err);
          })
          this.$store.dispatch("showDialog", {
            title: title,
            showCancel: true,
            flag: type
          });
        } else {
          this.editId = row.id;
          this.$store.dispatch("showDialog", {
            title: title,
            showCancel: true,
            flag: type
          });
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getReadData();
      },
      //编辑
      handleEditor() {
        if (this.editorValue.dateValue == "") {
          this.$message.error("请选择开始时间");
          return;
        }
        if (this.editorValue.startTaskCount == "" || this.editorValue.startTaskValue == "") {
          this.$message.error("请填写完整的参数");
          return;
        }
        if (this.editorValue.startTaskCount * 1 > this.editorValue.endTaskCount * 1 || this.editorValue.startTaskValue *
          1 > this.editorValue.endTaskValue * 1) {
          this.$message.error("请输入正确格式的参数");
          return;
        }
        this.$confirm('系统在已选择微信号队列中自动过滤以前执行过该网址阅读任务的微信号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            "readReportId": this.editId
          };
          let params = {
            'url': this.editorValue.url,
            'planCount': this.editorValue.planCount,
            'dateValue': this.formatDateTime(this.editorValue.dateValue),
            'startTaskCount': Number(this.editorValue.startTaskCount),
            'endTaskCount': Number(this.editorValue.endTaskCount),
            'startTaskValue': Number(this.editorValue.startTaskValue),
            'endTaskValue': Number(this.editorValue.endTaskValue),
          }
          data['planParam'] = JSON.stringify(params)
          this.$http('read', "PUT", data).then(res => {
            if (res.data.error_code == 0) {
              this.$message.success(res.data.error_message);
              this.clearData();
              this.hideModel();
              this.getReadData();
            } else {
              this.$message.error(res.data.error_message);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消编辑'
          });
        });
      },
      //执行
      handlePerform() {
        this.handleStatus(1)
      },
      //暂停
      handlePause() {
        this.handleStatus(3)
      },
      //关闭
      handleClose() {
        this.handleStatus(4)
      },
      //查看
      handleView() {
        this.clearData();
        this.hideModel();
      }
    },
    filters: {
      formatState(num) {
        switch (num * 1) {
          case 0:
            return "已创建";
            break;
          case 1:
            return "执行中";
            break;
          case 2:
            return "已完成";
            break;
          case 3:
            return "已暂停";
            break;
          case 4:
            return "已关闭";
            break;
          default:
            return "未知";
            break;
        }
      },
      judgeState(num) {
        switch (num * 1) {
          case 1:
            return "标准";
            break;
          case 3:
            return "优先";
            break;
          default:
            return "未知";
            break;
        }
      }
    },
  };

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .editor-dialo-detail {
    padding: 30px 0 36px 0 !important;

    li {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 14px;

      span {
        display: inline-block;
        width: 200px;
        text-align: right;
        margin-right: 10px;
      }

      .el-input {
        width: 100px;
        height: 30px !important;
      }

      p {
        display: inline-block;
        margin-left: 5px;
      }
    }

    .selectDataTime {
      width: 220px !important;
      height: 30px !important;
    }
  }

  textarea {
    display: block;
    width: 100%;
    height: 200px;
    line-height: 20px;
    color: #333;
    border: solid 1px #eee;
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
  }

  .total {
    position: absolute;
    right: 5px;
    bottom: 45px;
    font-size: 14px;
  }

</style>
