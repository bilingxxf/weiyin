<template>
  <div id="newGroupList" class="main-body">
    <div class="main-wrapper">
      <div class="info_wrapper">
        <div class="page-title">
          <span>群发列表</span>
        </div>
        <div class="search-content" style="margin-bottom:20px;">
          <div class="left">
            <el-date-picker class="ele-date-editor" style="vertical-align: middle;" v-model="searchDate" :clearable="false" type="daterange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  @change="searchList" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </div>
        <div class="edit-group">
          <em>批量操作：</em>
          <span class="edit-btn" @click="showModel('refresh','刷新')">刷新</span>
        </div>
        <div class="table_wrapper">
          <el-table ref="multipleTable" :data="tableData" class="ele-table-init"
            @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column width="20" fixed></el-table-column>
            <!-- <el-table-column type="selection" align="left" fixed="left" width="50"></el-table-column> -->
            <el-table-column label="序号" align="left" width="80">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column label="任务名称" align="left">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.planName" placement="bottom" effect="light"
                  :offset="80">
                  <span class="writeWrapper">{{scope.row.planName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="执行时间" align="left">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.webtime" placement="bottom" effect="light"
                  :offset="80">
                  <span class="writeWrapper">{{scope.row.webtime}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="创建人" align="left"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="left">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.createTime" placement="bottom" effect="light"
                  :offset="80">
                  <span class="writeWrapper"
                    v-if="scope.row.createTime!=='1999-01-01 00:00:00'">{{scope.row.createTime}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="showModel('close','删除任务',scope.row)">删除</el-button>
                <el-button type="text" size="mini" @click="showModel('taskDetail','任务详情',scope.row)">任务详情</el-button>
                <el-button v-if="scope.row.planStatus!=-1" type="text" size="mini" @click="showModel('reportData','报表',scope.row)">报表</el-button>
              </template>
            </el-table-column>
            <el-table-column width="20"></el-table-column>
          </el-table>
          <div class="pagination" v-if="total!=0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
              :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 下载报表 -->
    <Dialog v-if="dialogFlag=='reportData'" @callback="reportData">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">是否确认下载报表？</p>
      </div>
    </Dialog>
    <!-- 查看 -->
    <Dialog v-if="dialogFlag=='taskDetail'" @callback="handleView">
      <div class="dialog-content dialog-detail editor-dialo-detail" slot="content">
        <el-tabs v-model="activeName">
          <el-tab-pane label="按微信号选择" name="first" :disabled="activeName!='first'">
            <div class="taskDetail">
              <div>
                <span class="tip">微信号</span>
                <div class="inline">
                  <el-radio v-model="wxRadio" label="0" :disabled="wxRadio!=0">全部微信号</el-radio>
                  <el-radio v-model="wxRadio" label="1" :disabled="wxRadio!=1" style="display:inline;">按分组选择</el-radio>
                  <p v-if="wxSelect.wxGroupIds>0" style="font-size:12px;display:inline;margin-left:-15px;">共<span style="color:#409EFF;margin:0 4px;">{{wxSelect.wxGroupLen}}</span>个分组</p>
                  <!-- <div class="box" style="overflow-x:hidden;" :class="sysGroupList.length>1?'height110':'height74'"
                    v-if="radio==2">
                    <el-scrollbar style="height:100%;">
                      <div class="grounp-checkout" v-for="(item, index) in sysGroupList" :key="index">
                        <p><span class="selectBtn">{{item.groupName}}</span></p>
                        <div>
                          <span class="selectBtn" v-for="(groupItem,groupIndex) in item.list"
                            :key="groupIndex">{{groupItem.wx_user_group_name}}</span>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div> -->
                  <el-radio v-model="wxRadio" :disabled="wxRadio!=2" label="2">自定义选择</el-radio>
                </div>
              </div>
              <div>
                <span class="tip">好友</span>
                <div class="inline">
                  <el-radio v-model="friendRadio" label="0" :disabled="friendRadio!=0">全部好友</el-radio>
                  <el-radio v-model="friendRadio" label="1" :disabled="friendRadio!=1">通过时间筛选<el-date-picker v-model="filtrateTime" style="margin-left:10px;" type="datetimerange" range-separator="至"
                      start-placeholder="开始日期" end-placeholder="结束日期" disabled class="ele-date-editor">
                    </el-date-picker>
                  </el-radio>
                  <el-radio v-model="friendRadio" label="2" :disabled="friendRadio!='2'">自定义好友</el-radio>
                </div>
              </div>
              <div style="margin-bottom:20px;">
                <span class="tip">消息</span>
                <div class="inline">
                  <el-input type="textarea" readonly resize="none" :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容" v-model="sendMsg">
                  </el-input>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="按好友标签选择" name="second" :disabled="activeName=='first'">
            <div class="taskDetail">
              <div v-for="(item,index) in labelSelect" :key="index" class="height95">
                <!-- :class="labelSelect.length>1?'height95':'height95'"> -->
                <span class="tip" v-if="index=='0'">标签一:</span><span class="tagName" v-if="index=='0'">{{item.contactLabelName}}</span>
                <span class="tip" v-if="index=='1'">标签二:</span><span class="tagName" v-if="index=='1'">{{item.contactLabelName}}</span>
                <div class="tagInline">
                  <el-radio v-model="item.radio" label="0" :disabled="item.radio!=0">全部好友</el-radio>
                  <el-radio v-model="item.radio" label="1" :disabled="item.radio!=1">通过时间筛选<el-date-picker v-model="item.filtrateTime" style="margin-left:10px;" disabled type="datetimerange" range-separator="至"
                      start-placeholder="开始日期" end-placeholder="结束日期" class="ele-date-editor">
                    </el-date-picker>
                  </el-radio>
                  <el-radio v-model="item.radio" label="2" :disabled="item.radio!=2">自定义好友</el-radio>
                </div>
              </div>
              <div style="margin-bottom:20px;">
                <span class="tip">消息</span>
                <div class="inline"> 
                    <el-input type="textarea"  readonly resize="none"
                      :autosize="{ minRows: 4, maxRows:6}" placeholder="请输入内容" v-model="sendMsg">
                    </el-input>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </Dialog>
    <!-- 删除 -->
    <Dialog v-if="dialogFlag=='close'" @callback="handleClose">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">是否确认删除该任务？</p>
      </div>
    </Dialog>
    <!-- 刷新 -->
    <Dialog v-if="dialogFlag=='refresh'" @callback="handleRefresh">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">是否确认刷新该列表？</p>
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
  import util from '../../../static/js/common.js';
  var downloadXLS = util.downloadXLS;
  var defaultDate = util.defaultDate;

  import XLSX from "xlsx";
  import downloadFile from "../../../static/js/downloadExcel.js";
  var outputXlsxFile = downloadFile.outputXlsxFile;
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        searchDate: [],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        downPublicUrl: config.linkUrl,
        token: "",
        userId: "",
        loading: false,
        activeName: "first",
        radio: "2",
        textarea: "",
        dateTime: "",
        filtrateTime: "",
        groupSendId: [],
        startTime: "",
        endTime: "",
        sysGroupList: [],
        input: "",
        wxRadio: "",
        labelOneRadio: "",
        labelTwoRadio: "",
        friendRadio: "",
        planId:"",
        wxSelect: {},
        labelSelect: [],
        sendMsg: "",
        filtrateTime: [],
        groupSendReport:[],
        XlSData:{},
        labelArr:[]
      };
    },
    computed: {
      ...mapState(["dialogFlag"])
    },
    mounted() {
      this.userId = sessionStorage.getItem("user_id");
      this.token = sessionStorage.getItem('token');
      this.searchDate = defaultDate(-7)
        this.searchList();
        this.getLabelName();
    },
    methods: {
      // 获取标签信息
      getLabelName(){
        this.$http('wx_contact_label/'+this.userId, 'GET').then(res=>{
          if(res.data.error_code==0){
            let data = res.data.data;
            this.labelArr = data;
          }
        })
      },
      getGroupList(groupIds) {
        this.$http("/wx_group/list", "GET", {
          page: 1,
          limit: 9999
        }).then(res => {
          let result = res.data.data.result;
          let selectArr = [];
          let groupId = groupIds;
          result.map(item => {
            groupIds.map(groupItem => {
              if (item.wx_user_group_id == groupItem) {
                selectArr.push(item)
              }
            })
          })
          let json = {};
          let formatResult = [];
          selectArr.map((v, k) => {
            if (!json[v.userName]) {
              json[v.userName] = 1;
            } else {
              !json[v.userName]++;
            }
          });
          for (let key in json) {
            let fjson = {};
            let arr = selectArr.filter((v, k) => {
              return v.userName == key && v.wx_sum_count > 0;
            });
            fjson.groupName = key;
            if (arr.length > 0) {
              formatResult.push(fjson)
              fjson.list = arr;
            }
          };
          this.sysGroupList = formatResult;
        }).catch(err => {

        })
      },
      handleSizeChange(val) {
        this.page = 1;
        this.pageSize = val;
        this.getSendData();
      },
      handleSelectionChange(val) {
        val.map(item => {
          this.groupSendId.push(item.planId);
        });
      },
      //刷新列表
      handleRefresh() {
        this.getSendData();
        this.hideModel();
      },
      //删除
      handleStatus(status) {
        let data = {
          id: this.editId,
          status: status
        }
        this.$http('plan/status?planId='+this.planId+'&status='+status, "POST").then(res => {
          if (res.data.error_code == 0) {
            this.$message.success(res.data.error_message);
            this.hideModel();
              if(this.page>1&&this.tableData.length==1){
                this.page = this.page-1;
              }
            this.getSendData();
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //日期搜索
      searchList() {
        this.page = 1;
        if (this.searchDate != null) {
          this.startTime = this.searchDate[0];
          this.endTime = this.searchDate[1];
        }
        this.getSendData();
      },
      hideModel() { // 隐藏
        this.$store.dispatch('hideDialog')
      },
      getSendData() { //  列表
        let params = {
          length: this.pageSize,
          pageNo: this.page,
          templateName: "批量群发消息"
        };
        this.loading = true;
        if (this.searchDate != null) {
          params['startTime'] = this.startTime + ' 00:00:01';
          params['endTime'] = this.endTime  + ' 23:59:59';
        }
        this.$http("plan/plan_list", "POST", params).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            let data = res.data.data;
            this.total = data.total_count;
            data.result.map((item,index)=>{
              if(item.planParams.indexOf('friendtime')>-1){
                item.webtime = JSON.parse(item.planParams).friendtime;
              }else{
                item.webtime = JSON.parse(item.planParams).webtime;
              }
            })
            this.tableData = data.result;
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      showModel(type, title, row) {
        if(type!="taskDetail"){
          this.$store.dispatch("showDialog", {
            title: title,
            showCancel: true,
            flag: type
          });
        }else{
          this.wxSelect = row;
          if ( JSON.parse(this.wxSelect.planParams).selectType == 1) {
            this.activeName = "first";
            let arr = this.wxSelect.wxGroupIds.split(",")
            // this.getGroupList(arr);  //任务详情 遍历格式化分组数据
            this.wxSelect['wxGroupLen'] = arr.length;
            let selectInfo = JSON.parse(this.wxSelect.planParams); 
              this.wxRadio = selectInfo.webchatStyle;
              this.friendRadio = selectInfo.friendsStyle;
              if(this.friendRadio==1){
                let arr = [];
                arr.push(selectInfo.contactStartTime)
                arr.push(selectInfo.contactEndTime)
                this.filtrateTime = arr;
              }
            this.sendMsg = selectInfo.sendMsg;
          } else {
            this.labelSelect = [];
            this.activeName = "second";
            let labelInfo = JSON.parse(row.planParams);
            labelInfo.contactLabelInfos.map((item,index) => {
              this.labelArr.map(labelItem=>{
                if(labelItem.wxContactLabelId ==item.contactLabelId){
                  item['contactLabelName']=labelItem.labelName;
                }
              })
                item['radio'] = labelInfo.friendsStyle[index];
                if(item['radio']==1){
                  let arr = [];
                  arr.push(item.contactStartTime, item.contactEndTime)
                  item['filtrateTime'] = arr;
                } 
              this.labelSelect.push(item)
            })
            this.sendMsg = labelInfo.sendMsg;
        }
          this.$store.dispatch("showDialog", {
            title: title,
            flag: type
          });
        } 
        if (row != undefined) {
          this.editId = row.id;
          this.planId = row.planId;
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getSendData();
      },
      //下载报表
      reportData() {
        // let url = this.downPublicUrl + "api/v1/task_chatroom/task_chatroom_report?planId=" + this.editId + "&token=" +
        //   this.token;
        // downloadXLS(url);
        // this.hideModel();
         this.$redis.list.get({
						key: `SEND_MESSAGE_BY_GROUP_PLAN=${this.planId}`,
            start: 0,
            stop:-1
					},'json').then(res=>{
            if(res.data.error_code==0){
              let data = res.data.data.members;
              this.groupSendReport = data;  
              this.downloadExcel();
            }
          })
      },
      downloadExcel(){
        let InfoHeader = ['微信号','微信昵称','好友微信号','状态'];
        let InfoAttribute = ["wxId","nickName","targetId","reportType"]
        this.XlSData['群发报表'] = {data:this.groupSendReport,xlsxHeader:InfoHeader,xlsxAttribute:InfoAttribute}
        this.$message.success("正在生成Excel报表")
        this.hideModel();
        outputXlsxFile(XLSX,this.XlSData,[{wch: 20}, {wch: 15},{wch: 20},{wch: 20}],"群发报表")
      },
      //关闭
      handleClose() {
        this.handleStatus(2)
      },
      //查看
      handleView() {
        this.hideModel();
      }
    }
  };

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .editor-dialo-detail {
    padding: 10px 0 4px 0 !important;
    text-align: left;

    .el-tabs__nav-scroll {
      width: 350px;
    }

    .tip {
      display: inline-block;
      text-align: left;
      width: 40px;
      font-size: 12px;
    }

    .inline {
      padding-left: 50px;
      margin-top: -20px;
      margin-bottom: 10px;
    }

    .el-radio {
      display: block;
      margin-left: 0;
      line-height: 24px;
    }

    .tagInline {
      padding-left: 50px;
      margin-bottom: 10px;
    }

    .tagName {
      font-size: 12px;
      margin-left: 10px;
    }
  }

  .total {
    position: absolute;
    right: 5px;
    bottom: 45px;
    font-size: 14px;
  }

  .grounp-checkout {
    min-height: 30px;
    margin-top: 10px;

    p {
      width: 100px;
      text-align: left;
      margin-left: 10px;
      display: inline-block;
      vertical-align: top;

      span {
        height: 27px;
        line-height: 15px;
      }
    }

    div {
      display: inline-block;
      width: 320px;
    }
  }

  .selectBtn {
    padding: 4px 10px 5px;
    background: #b2d4f9;
    color: #fff;
    border-radius: 5px;
    margin: 5px 0 0 5px;
    font-size: 12px;
    display: inline-block;
    border: 1px solid #5ba5f3;
  }

  textarea {
    min-height: 55px;
  }

  .height110 {
    height: 110px;
  }

  .height74 {
    height: 74px;
  }

  .height95 {
    height: 95px;
    margin-bottom: 10px;
  }

</style>
