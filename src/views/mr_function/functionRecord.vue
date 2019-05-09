<template>
  <div id="friend" class="main-body">
    <div class="main-wrapper">
      <div class="page-title">
        <span>朋友圈记录</span>
      </div>
      <div class="search-content">
        <div class="left">
          <el-input placeholder="请输入朋友圈内容" class="inputWidth ele-input" suffix-icon="el-input__icon el-icon-search"
            v-model="searchVal" @change="checktake()">
          </el-input>
          <el-date-picker class="dateWidth ele-date-editor" v-model="searchTimer" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" @change="getSelectDate" value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-select size="small" class="ele-select" v-model="selectChildAccountId" placeholder="所属账号" clearable
            @change="page=1,getTabledataList()" v-if="accountType">
            <el-option label="所属账号" value=""></el-option>
            <el-option :label=username :value=userId></el-option>
            <el-option v-for="(item,index) in bindChildAccountList" :key="index" :label="item.user_name"
              :value="item.user_id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="table-cnt">
        <div class="tablefn">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" class="ele-table-init">
            <el-table-column width="30">
            </el-table-column>
            <el-table-column label="序号" width="100" align="left">
              <template slot-scope="scope"><span>{{scope.$index+(pageNo - 1) * length + 1}} </span></template>
            </el-table-column>
            <el-table-column width="200" label="所属账号" align="left" v-if="accountType">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" content="{scope.row.userName}" placement="bottom" effect="light"
                  :offset="80">
                  <span slot="content">{{scope.row.userName}}</span>
                  <p class="writeWrapper">{{scope.row.userName}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="朋友圈内容" align="left">
              <template slot-scope="scope">
                <el-button type="text" @click="checkContent(scope)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="执行时间" align="left">
                <template slot-scope="scope">{{scope.row.startTime }}</template>
              </el-table-column>
            <el-table-column label="所属账号分组" align="left">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" content="{scope.row.groupNames}" placement="bottom-end" effect="light"
                  :offset="80">
                  <span class="tooltipText" slot="content">
                    <span class="tooltipText">{{scope.row.groupNames}}</span>
                  </span>
                  <p class="writeWrapper">{{scope.row.groupNames}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="left">
            </el-table-column>
            <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <el-button type="text" @click="checkDetail(scope)">账号明细</el-button>
                <el-button type="text" style="color:red;" @click="showModel('delete',scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column width="30">
            </el-table-column>
          </el-table>
        </div>
        <div class="page pagination" v-if="tableData.length!=0">
          <el-pagination @current-change="recordCurrentChange" :current-page.sync="pageNo" :page-size="length"
            layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <Dialog v-if="dialogFlag=='detail'">
      <div class="dialog-content better-scrollbar" slot="content" style="padding:30px 0 40px;">
        <el-table :data="tableData3" style="width: 100%;margin-top:0;" height="350" min-height="140"
          class="ele-dialogTable-init">
          <el-scrollbar class="scroll-bar">
            <el-table-column fixed prop="date" label="账号" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.nick_name!==null">{{scope.row.nick_name}}</span>
                <span v-else>{{scope.row.user_name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="start_time" label="发送时间" align="center">
            </el-table-column>
            <el-table-column prop="stat" label="发送状态" align="center">
            </el-table-column>
          </el-scrollbar>
        </el-table>

      </div>
    </Dialog>
    <Dialog v-if="dialogFlag=='delete'" @callback="DelFriendRecord">
      <div class="dialog-content" slot="content">
        <p>确定要删除该记录吗？</p>
      </div>
    </Dialog>
    <!-- 查看内容 -->
    <Dialog v-if="dialogFlag == 'taskDetail'">
      <div class="dialog-content dialogImg" slot="content">
        <span><em>内容：</em>{{friensCricleContent}}</span>
        <div class="imgWrapper">
          <img v-for="(img,index) in imgList" :key="index" :src="img" alt="" v-if="imgList.length==1" class="img1"
            :onerror="defaultImg1" />
          <img v-for="(img,index) in imgList" :key="index" :src="img" alt="" v-if="imgList.length==2||imgList.length==4"
            class="img4" :onerror="defaultImg2" />
          <img v-for="(img,index) in imgList" :key="index" :src="img" alt="" v-if="imgList.length>4||imgList.length==3"
            class="img5" :onerror="defaultImg3" />
        </div>
      </div>
    </Dialog>
  </div>

</template>
<script>
  import axios from "axios";
  import dayjs from 'dayjs';
  import {config} from "../../api/http.js";
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
        publicUrl: config.newResourceUrl,
        total: 0,
        imgList: [],
        starttime: "",
        endtime: "",
        searchTimer: "",
        searchVal: "",
        content: true,
        detail: false,
        add: [],
        tableData: [],
        taskTemplateId: "",
        length: 10,
        pageNo: 1,
        friensCricleContent: "",
        tableData3: [],
        loading: true,
        flag: '',
        deleteId: '',
        defaultImg1: 'this.src="' + require('../../assets/imgFail.svg') + '",style="width:300px;height:300px;"',
        defaultImg2: 'this.src="' + require('../../assets/imgFail.svg') + '",style="width:240px;height:240px;"',
        defaultImg3: 'this.src="' + require('../../assets/imgFail.svg') + '",style="width:156px;height:156px;"',
        accountType: false,
        selectChildAccountId: "",
        bindChildAccountList: []
      };
    },
    components: {
      Dialog
    },
    computed: {
      ...mapState([
        'dialogFlag'
      ])
    },
    mounted() {
      this.getTaskTemplate();
      this.getTabledataList();
      this.getChildAccountList();
      this.username = sessionStorage.getItem("username");
      this.userId = sessionStorage.getItem("user_id");
      if (sessionStorage.getItem('indentity') === 'ROLE_USER') {
        this.accountType = true;
      }
    },
    methods: {
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
      showModel(type, row) {
        let tit = "";
        this.flag = type;
        switch (type) {
          case 'delete':
            tit = "删除";
            this.deleteId = row.planId;
            break;
        }
        this.$store.dispatch("showDialog", {
          title: tit,
          showCancel: true,
          flag: 'delete'
        })
      },
      hideModel() {
        this.$store.dispatch("hideDialog")
      },
      //获取发圈列表
      getTabledataList() {
        let data = {};
        let param = {};
        this.loading = true;
        param['childUserId'] = Number(this.selectChildAccountId);
        if (this.starttime != '') {
          data['startTime'] = this.starttime + " 00:00:01";
        }
        if (this.endtime != '') {
          data['endTime'] = this.endtime + " 23:59:59";
        }
        if (this.selectChildAccountId != "") {
          data['param'] = JSON.stringify(param)
        }
        if (this.searchVal != "") {
          data['snsContent'] = this.searchVal
        }
        data['templateName'] = '计划发圈';
        data['pageNo'] = this.pageNo;
        data['length'] = this.length;
        this.$http('plan/plan_list', 'POST', data).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            let data = res.data.data;
            this.tableData = data.result;
            this.standbyTableData = data.result;
            this.total = data.total_count;
          } else {
            this.$message({
              message: '获取计划发圈记录失败',
              type: 'error'
            });
          }
        }).catch(err => {
          this.loading = true;
          this.$message({
            message: '获取计划发圈记录失败',
            type: 'error'
          });
        })
      },
      //获取计划发圈的模板id
      getTaskTemplate() {
        this.$http("task_template", "GET", {
          page: 1,
          per_page: 9999
        }).then(res => {
          if (res.data.error_code == 0) {
            let data = res.data.data;
            data.result.forEach(item => {
              if (item.task_template_name == "计划发圈") {
                this.taskTemplateId = item.task_template_id;
              }
            })
          } else {
            this.$message({
              message: '获取计划发圈模板id失败',
              type: 'error'
            });
          }
        }).catch(err => {
          this.$message({
            message: '获取计划发圈模板id失败',
            type: 'error'
          });
        })
      },
      //获取发朋友圈记录
      getFriendCircleRecord(planId) {
        this.$http("plan/plan_report", "POST", {
          length: 10,
          pageNo: 1,
          param: JSON.stringify({
            template_name: "计划发圈",
            plan_id: planId
          })
        }).then(res => {
          if (res.data.error_code == 0) {
            let data = res.data.data;
            let arr = [];
            if (data.report) {
              arr = JSON.parse(data.report);
            }
            this.tableData3 = arr;
          } else {
            this.$message({
              message: '获取计划发圈记录失败',
              type: 'error'
            });
          }
          this.flag = "detail";
          this.$store.dispatch("showDialog", {
            title: "账号明细",
            flag: 'detail'
          })
        }).catch(err => {
          this.$message({
            message: '获取计划发圈记录失败',
            type: 'error'
          });
        })
      },
      //查看朋友圈内容
      checkContent(scope) {
        let content = JSON.parse(scope.row.planParams);
        this.friensCricleContent = content.takeText;
        if (content.takeImage.length > 0 && typeof (content.takeImage[0]) === 'string') {
          if (content.takeImage[0].startsWith('http')) {
            let newArr = [];
            content.takeImage.forEach(item => {
              newArr.push(item)
            })
            this.imgList = newArr;
          } else {
            let newArr = [];
            content.takeImage.forEach(item => {
              newArr.push(this.publicUrl + item)
            })
            this.imgList = newArr;
          }
        } else {
          let newArr = [];
          content.takeImage.forEach(item => {
            newArr.push(item[0])
          })
          this.imgList = newArr;
        }
        this.$store.dispatch("showDialog", {
          title: '发送内容',
          flag: 'taskDetail'
        })
      },
      //发送明细
      checkDetail(scope) {
        this.getFriendCircleRecord(scope.row.planId);
      },
      // 删除记录
      DelFriendRecord(scope) {
        this.$http("plan/" + this.deleteId, "DELETE").then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: res.data.error_message,
              type: 'success'
            });
            if (this.tableData.length == 1 && this.pageNo > 1) {
              this.pageNo = this.pageNo - 1;
            }
            this.getTabledataList();
          } else {
            this.$message({
              message: '删除朋友圈记录失败',
              type: 'error'
            });
          }
        }).catch(err => {
          this.$message({
            message: '删除朋友圈记录失败',
            type: 'error'
          });
        })
        this.hideModel();
      },
      // 表格检索
      checktake() {
        if (this.searchVal) {
          let newArr = [];
          this.standbyTableData.forEach(item => {
            if (JSON.parse(item.planParams).takeText.indexOf(this.searchVal) > -1) {
              newArr.push(item);
            }
          })
          this.tableData = newArr;
          this.total = newArr.length;
        } else {
          this.getTabledataList();
        }
      },
      recordCurrentChange(val) {
        this.pageNo = val;
        this.getTabledataList();
      },
      //表格时间检索
      getSelectDate() {
        if (this.searchTimer != null) {
          this.starttime = this.searchTimer[0];
          this.endtime = this.searchTimer[1];
          this.getTabledataList();
        } else {
          this.starttime = "";
          this.endtime = "";
          this.getTabledataList();
        }
      },
    },
    filters:{
    /**
     * @description: 格式化执行时间
     * @param {type}
     * @return:
     */
    formatStartTime(value){

      if(!value){
        return ''
      }
      return JSON.parse(value).startTime

      // return dayjs(value).format('HH:mm:ss')
    },
    }
  };

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #friend {
    .search-content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .el-date-editor {
        margin-left: 17px;
      }
    }

    .dialogImg {
      text-align: left;
      padding: 30px 0 40px 0 !important;

      span {
        padding-bottom: 20px;
        display: block;
      }
    }

    .page {
      text-align: center;

      .el-pagination {
        display: inline-block;
      }
    }

    img {
      object-fit: cover;
    }

    .img1 {
      width: 400px;
      max-height: 420px;
      text-align: center;
      display: block;
      margin: 0 auto;
    }

    .img4 {
      width: 240px;
      height: 240px;
      margin-right: 10px;
      overflow: hidden;
    }

    .img5 {
      width: 156px;
      height: 156px;
      margin-right: 10px;
      overflow: hidden;
    }
  }

</style>
