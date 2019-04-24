<template>
  <div id="fanTaskList" class="main-body">
    <div class="main_wrapper main-wrapper">
      <div class="flex-total">
        <div class="item">
          <h2 class="number">{{statisTics.execute_count || '0'}}</h2>
          <p>总加粉数</p>
        </div>
        <div class="item">
          <h2 class="number">{{statisTics.success_count || '0'}}</h2>
          <p>总通过数</p>
        </div>
        <div class="item">
          <h2 class="number">{{statisTics.today_execute_count || '0'}}</h2>
          <p>今日加粉数</p>
        </div>
        <div class="item">
          <h2 class="number">{{statisTics.today_success_count || '0'}}</h2>
          <p>今日通过数</p>
        </div>
      </div>
      <div class="page-title">
        <span>任务列表</span>
      </div>
      <div class="info_wrapper">
        <el-date-picker class="ele-date-editor" v-model="selectDate" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" @change="getSelectDate" value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-select size="small" class="ele-select" v-model="selectChildAccountId" placeholder="所属账号" clearable
          @change="page=1,taskInit()" v-if="accountType">
          <el-option label="所属账号" value=""></el-option>
          <el-option :label=username :value=userId></el-option>
          <el-option v-for="(item,index) in bindChildAccountList" :key="index" :label="item.user_name"
            :value="item.user_id"></el-option>
        </el-select>
        <div class="edit-group">
          <em>批量操作：</em>
          <span class="edit-btn" @click="showModel('deletegroup','删除')">删除</span>
        </div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="selectionChange"
          style="width: 100%;" class="ele-table-init" v-loading="loading">
          <el-table-column width="10"></el-table-column>
          <el-table-column type="selection" align="left"></el-table-column>
          <el-table-column prop="planId" width="80" label="任务号" align="left"></el-table-column>
          <el-table-column width="150" label="所属账号" align="left" v-if="accountType">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.userName}" placement="bottom" effect="light"
                :offset="80">
                <span slot="content">{{scope.row.userName}}</span>
                <p class="writeWrapper">{{scope.row.userName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="planName" label="任务名称" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content={scope.row.planName} placement="bottom-end" :offset="80"
                effect="light">
                <span slot="content">{{scope.row.planName}}</span>
                <p class="writeWrapper">{{scope.row.planName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="" label="号库名称" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content={scope.row.groupName} placement="bottom-end" :offset="80"
                effect="light">
                <span slot="content">{{scope.row.groupName}}</span>
                <p class="writeWrapper">{{scope.row.groupName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="left">
          </el-table-column>
          <el-table-column label="执行时间段" align="left">
            <template slot-scope="scope">{{scope.row.startTime}} - {{scope.row.endTime}}</template>
          </el-table-column>
          <el-table-column label="当前状态" align="left">
            <template slot-scope="scope">{{ scope.row.planStatus | detectionStatus}}</template>
          </el-table-column>
          <el-table-column label="操作" align="right" width="300">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showModel('xls','报表',scope.row)">报表</el-button>
              <el-button type="text" size="mini" @click="checkDetail(scope)">查看详情</el-button>
              <el-button type="text" size="mini" @click="taskDetail(scope)">任务详情</el-button>
              <el-button type="text" size="mini" v-if="scope.row.planStatus== 0"
                @click="pauseCountinueTask(scope.row,1)">暂停</el-button>
              <el-button type="text" size="mini" v-if="scope.row.planStatus== 1||scope.row.planStatus==3"
                @click="pauseCountinueTask(scope.row,0)">继续</el-button>
              <el-button type="text" style="color:red;" size="mini" @click="showModel('delete','刪除',scope.row)">刪除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column width="20">
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData.length!=0">
          <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="limit"
            layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <Dialog v-if="dialogFlag=='detail'">
      <div class="dialog-content better-scrollbar dialog-detail" slot="content" style="padding:30px 0;">
        <div class="total-info">
          <ul v-for="(item,index) in remainData" :key="index">
            <li> <span>发起次数:</span> {{item.execute_count}}</li>
            <li> <span>资源剩余:</span> {{item.remain_resources}}</li>
            <li> <span>通过次数:</span> {{item.success_count}}</li>
            <li> <span>利用资源:</span> {{item.used_resources}}</li>
          </ul>
        </div>
        <el-table :data="tableData3" style="width: 100%" height="350" min-height="140" class="ele-table-init"
          :header-cell-style="dialogHeaderClass" :cell-style="cellStyle">
          <el-table-column prop="faqinums" label="发起次数" class-name="font_color" align="center">
          </el-table-column>
          <el-table-column prop="Passing" label="通过人数" class-name="font_color" align="center">
          </el-table-column>
          <el-table-column prop="times" label="发起时间" class-name="font_color" align="center">
          </el-table-column>
        </el-table>
      </div>
    </Dialog>
    <Dialog v-if="dialogFlag=='delete'" @callback="deletePlan">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">确定要删除吗？</p>
      </div>
    </Dialog>
    <Dialog v-if="dialogFlag=='deletegroup'" @callback="batchDelete">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">确定要删除吗？</p>
      </div>
    </Dialog>
    <Dialog v-if="dialogFlag=='xls'" @callback="reportData">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">是否需要下载报表？</p>
      </div>
    </Dialog>

    <!-- 任务详情 -->
    <Dialog v-if="dialogFlag=='taskDetail'">
      <div class="dialog-content task-better-scrollbar dialog-detail" slot="content" style="padding:30px 0;">
        <div style="max-height:350px;overflow-y:auto" class="task-detail">
          <div class="item-list">
            <span>验证申请：</span>
              <p style="margin-left:120px;display:block;"><el-checkbox disabled style="margin-right:5px;" v-model="taskDetailInfo.increaseNickName"></el-checkbox>增加对方昵称</p>
              <p disabled class="checkInfo ele-input" style="margin-left:120px;display:block;" v-for="(item,index) in taskDetailInfo.checkInfo"
                :key="index">{{index+1}} . {{taskDetailInfo.checkInfo[index]}}</p>
          </div>
          <div class="item-list">
            <span>通过后自动打招呼：</span>
            <div>
              <div v-for="(item,index) in taskDetailInfo.callInfo" :key="index" style="margin-bottom:7px;">
                <img v-if="item.type==1" :src="item.info" alt=""
                  style="width:80px;height:80px;border:1px solid #ccc;object-fit:cover;">
                <p v-if="item.type==2" disabled class="checkInfo ele-input">{{item.info}}</p>
                <div v-if="item.type==0" style="width:200px;height:40px;position:relative;overflow:hidden;">
                  <div
                    style="width:200px;height:40px;line-height:40px;padding-left:10px;position:relative;overflow:hidden;background:#f1f3f4;border-radius:40px;">
                    此类音频文件不受支持　　{{ item.time | changeTime}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-list">
            <span>高级设置：</span>
            <div>
              <p>1.任务执行时间{{taskDetailInfo.startTime}}至{{taskDetailInfo.endTime}}</p>
              <p>2.单日提交申请最大限制{{taskDetailInfo.taskRepeatTimes}}次</p>
              <p>3.申请间隔{{taskDetailInfo.minTimeInterval}}~{{taskDetailInfo.maxTimeInterval}}秒内随机提交</p>
              <p v-if="(taskDetailInfo.maxTimes!==''||taskDetailInfo.stopTimes!=='')&&JSON.stringify(taskDetailInfo).indexOf('maxTimes')>-1">4.
                <i   v-if="taskDetailInfo.maxTimes!==''&&JSON.stringify(taskDetailInfo).indexOf('maxTimes')>-1"> 当日加粉频繁次数达到{{taskDetailInfo.maxTimes}}次停止加粉，</i>
                <i v-if="taskDetailInfo.stopTimes!==''&&JSON.stringify(taskDetailInfo).indexOf('stopTimes')>-1">
                  加粉频繁第{{taskDetailInfo.stopTimes}}次后暂停加粉一次
                </i>
                </p>
            </div>
          </div>
          <div class="item-list">
            <span>加粉账号：</span>
            <div>
              <el-button type="text" size="mini" @click="downloadWX()">导出</el-button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import {config} from "../../api/http.js";
  import Dialog from "../../components/dialog.vue";
  import  util from '../../../static/js/common.js';
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
        selectDate: "",
        tableData: [],
        currentPage: 1,
        total: 0,
        limit: 10,
        startTime: '',
        endTime: '',
        taskId: [],
        token: "",
        taskTemplateId: '',
        tableData3: [],
        remainData: [],
        statisTics: {
          execute_count: 0,
          success_count: 0,
          today_execute_count: 0,
          today_success_count: 0
        },
        loading: true,
        downPublicUrl: config.linkUrl,
        flag: "",
        deleteId: "",
        previousPage: false,
        accountType: false,
        selectChildAccountId: "",
        bindChildAccountList: [],
        username: "",
        userId: "",
        editId: 0,
        taskDetailInfo: {
          checkInfo: [],
          minTimeInterval: "",
          maxTimeInterval: "",
          maxTimes: "",
          stopTimes: "",
          taskRepeatTimes: "",
          startTime: "",
          endTime: "",
          callInfo: [],
          increaseNickName:false
        },
        taskPlanId: ""
      };
    },
    computed: {
      ...mapState([
        'dialogFlag'
      ])
    },
    mounted() {
      this.taskInit();
      this.token = sessionStorage.getItem("token");
      this.username = sessionStorage.getItem("username");
      this.userId = sessionStorage.getItem("user_id");
      this.getStatisticsInfor();
      this.getChildAccountList();
      if (sessionStorage.getItem('indentity') === 'ROLE_USER') {
        this.accountType = true;
      }
    },
    methods: {

      downloadWX() {
        this.$confirm('将要导出任务微信号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.open(this.downPublicUrl + "api/v1/wx_friend/addfriend_wxuser?planId=" + this.taskPlanId +
            "&token=" + this.token, "_blank");
          this.hideModel();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          });
        });
      },
      reportData() {
        let url = this.downPublicUrl + "api/v1/plan/export/" + this.editId + "?token=" + this.token;
        downloadXLS(url);
        this.hideModel();
      },
      //获取子账号列表
      getChildAccountList() {
        this.$http("child_user/list", "POST", {
          length: 9999,
          pageNo: 1,
          parentUserId: sessionStorage.getItem('user_id')
        }).then((res) => {
          if (res.data.error_code == 0) {
            this.bindChildAccountList = res.data.data.result;
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      showModel(type, title, row) {
        switch (type) {
          case 'delete':
            this.deleteId = row.planId;
            break;
          case 'deletegroup':
            if (this.taskId.length == 0) {
              this.$message.error("请选择要删除的任务！");
              return;
            }
            break;
          case 'xls':
            this.editId = row.planId;
            break;
        };
        this.$store.dispatch("showDialog", {
          title: title,
          showCancel: true,
          flag: type
        })
      },
      hideModel() {
        this.$store.dispatch("hideDialog")
      },
      //删除计划
      deletePlan(row) {
        this.$http('plan/' + this.deleteId, 'DELETE').then(res => {
          if (res.data.error_code == 0) {

            if (this.tableData.length == 1 && this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }

            this.taskInit();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        })
        this.hideModel()
      },
      //暂停继续任务
      pauseCountinueTask(row, status) {
        this.$http('plan/status?planId=' + row.planId + '&status=' + status, 'POST').then(res => {
          if (res.data.error_code == 0) {
            this.taskInit();
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
      },
      //批量删除
      batchDelete() {
        this.$http('plan/' + this.taskId.join(','), 'DELETE').then(res => {
          if (res.data.error_code == 0) {
            if (this.previousPage) {
              this.currentPage = this.currentPage - 1;
            }
            this.taskInit();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        })
        this.hideModel();
      },
      //初始化数据
      taskInit() {
        this.loading = true;
        let data = {};
        let param = {};
        param['childUserId'] = Number(this.selectChildAccountId);
        if (this.startTime != '') {
          data['startTime'] = this.startTime;
        }
        if (this.endTime != '') {
          data['endTime'] = this.endTime;
        }
        if (this.selectChildAccountId != "") {
          data['param'] = JSON.stringify(param)
        }
        data['templateName'] = '加粉';
        data['pageNo'] = this.currentPage;
        data['length'] = this.limit;
        this.$http('plan/plan_list', 'POST', data).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            let data = res.data.data;
            if (data.result.length > 0) {
              data.result.forEach((item, index) => {
                if (item.expandInfo) {
                  let info = JSON.parse(item.expandInfo);
                  item['groupName'] = info.groupName;
                  item['groupId'] = info.groupId;
                } else {
                  item['groupName'] = "";
                  item['groupId'] = "";
                }
              })
            }
            this.tableData = data.result;
            this.total = data.total_count;
          } else {

            this.$message({
              message: '获取失败',
              type: 'error'
            })
          }
        }).catch(err => {
          this.loading = true;
          this.$message({
            message: '获取失败',
            type: 'error'
          })
        })
      },
      selectionChange(val) {
        this.taskId = [];
        if (val.length == this.tableData.length) {
          if (this.currentPage > 1) {
            this.previousPage = true;
          } else {
            this.previousPage = false;
          }
        } else {
          this.previousPage = false;
        }
        val.forEach(item => {
          this.taskId.push(item.planId)
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.taskInit();
      },
      getSelectDate() {
        if (this.selectDate != null) {
          this.startTime = this.selectDate[0];
          this.endTime = this.selectDate[1];
        } else {
          this.startTime = "";
          this.endTime = "";
        }
        this.taskInit();
      },
      cellStyle() {
        return 'height:40px;padding:0;font-size:14px;color:#888;'
      },
      //表格头部样式
      dialogHeaderClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (rowIndex == 0) {
          return "color:#57aaff;font-size:16px";
        } else {
          return "";
        }
      },
      checkDetail(scope) {
        this.getFriendCircleRecord(scope.row.planId);
      },
      taskDetail(scope) {
        this.taskPlanId = scope.row.planId;
        this.getTaskDetail(scope);
      },
      //任务详情
      getTaskDetail(scope) {
        let data = JSON.parse(scope.row.planParams);
        if (data.checkInfo instanceof Array) {
          this.taskDetailInfo.checkInfo = data.checkInfo;
        } else {
          this.taskDetailInfo.checkInfo = data.checkInfo.split(',')
        }
        this.taskDetailInfo.callInfo = data.Info;
        this.taskDetailInfo.minTimeInterval = data.minTimeInterval;
        this.taskDetailInfo.maxTimeInterval = data.maxTimeInterval;
        this.taskDetailInfo.maxTimes = data.maxTimes;
        this.taskDetailInfo.stopTimes = data.stopTimes;
        this.taskDetailInfo.taskRepeatTimes = scope.row.taskRepeatTimes;
        this.taskDetailInfo.startTime = scope.row.startTime;
        this.taskDetailInfo.endTime = scope.row.endTime;
        this.taskDetailInfo.increaseNickName = data.increaseNickName
        this.$store.dispatch("showDialog", {
          title: "任务详情",
          showCancel: true,
          flag: "taskDetail"
        })
      },
      getSummary(planId) { // 明细信息列表
        this.$http("plan/plan_report", "POST", {
          length: 10,
          pageNo: 1,
          param: JSON.stringify({
            template_name: "加粉",
            plan_id: planId,
            report_type: 'summary'
          })
        }).then(res => {
          if (res.data.error_code == 0) {
            this.remainData = []
            let datas = res.data.data.report
            if (datas !== '{}') {
              let data = JSON.parse(res.data.data.report)
              let s = data.summary
              this.remainData.push(s)
            }
          }
        })
      },
      //获取发朋友圈记录
      getFriendCircleRecord(planId) {
        this.getSummary(planId);
        this.$http("plan/plan_report", "POST", {
          length: 10,
          pageNo: 1,
          param: JSON.stringify({
            template_name: "加粉",
            plan_id: planId,
            report_type: 'detail'
          })
        }).then(res => {
          if (res.data.error_code == 0) {
            this.tableData3 = []
            let datas = res.data.data.report;
            if (datas !== '{}') {
              let data = JSON.parse(res.data.data.report)
              let datas = []
              datas = data.detail
              let t = datas
              t.map((item, index) => {
                this.tableData3.push({
                  faqinums: item.execute_count,
                  Passing: item.success_count,
                  times: item.create_time
                })
              })
            }
            this.flag = "detail";
            this.$store.dispatch("showDialog", {
              title: "查看详情",
              flag: 'detail'
            })
          }
        })
      },
      getStatisticsInfor() { // 查询加粉总通过信息
        this.$http("plan/plan_report", "POST", {
          length: 10,
          pageNo: 1,
          param: JSON.stringify({
            template_name: "加粉",
            report_type: 'summary'
          })
        }).then(res => {
          if (res.data.error_code == 0) {
            let datas = res.data.data.report;
            if (datas !== '{}') {
              let data = JSON.parse(res.data.data.report)
              let s = data.summary
              this.statisTics.execute_count = s.execute_count;
              this.statisTics.success_count = s.success_count;
              this.statisTics.today_execute_count = s.today_execute_count;
              this.statisTics.today_success_count = s.today_success_count;
            }
          }
        })

      }
    },
    //过滤器
    filters: {
      detectionStatus: function (value) {
        switch(value*1){
          case 0:
            return "加粉中";
            break;
          case 1:
            return "暂停";
            break;
          case 2:
            return "删除";
            break;
          case 3:
            return "成功";
            break;
        }
      },
      changeTime: function (value) {
        let minute = Math.floor(value / 1000 % 3600 / 60);
        let second = Math.ceil(value / 1000 % 3600 % 60);
        return (minute >= 10 ? ("" + minute) : ("0" + minute)) + ":" + (second >= 10 ? ("" + second) : ("0" +
        second));
      }
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../style/css/base.scss';

  #fanTaskList {
    background: #e8eff6;

    .dialog-detail {
      ul {
        overflow: hidden;
        margin-bottom: 20px;
        padding: 0 40px;
        font-size: 14px;
        color: #333;
      }

      li {
        float: left;
        width: 50%;
        text-align: left;
        line-height: 30px;

        span {
          display: inline-block;
          padding-left: 50px;
        }
      }
    }

    .main_wrapper {
      background: #fff;

      .rightButton {
        float: right;
        height: 30px;
        width: 90px;
        font-size: 12px;
        line-height: 0;
        padding: 0;
      }

      .title {
        position: relative;
        float: left;

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

      .Statistics {
        float: right;
        width: 75%;

        ul {
          li {
            width: 40%;
            float: left;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            color: rgb(87, 170, 255);
          }
        }
      }

      .edit-group {
        margin-top: $margin;
      }

      .el-pagination {
        margin-top: 10px;
        text-align: center;
      }
    }
  }

  .total-info {
    li {
      color: #666;
    }
  }

  .font_color {
    color: #888;
  }

  .item-list {
    text-align: left;
    position: relative;
    font-size: 12px;
    min-height: 40px;

    span {
      width: 110px;
      display: inline-block;
      position: absolute;
      line-height: 24px;
      text-align: right;
    }

    >div {
      margin-left: 110px;
      display: inline-block;
    }

    .checkInfo {
      line-height: 24px;
      display: block;
      margin-bottom: 5px;
    }
  }

</style>
