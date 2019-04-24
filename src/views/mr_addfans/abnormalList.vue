<template>
  <div id="abnormalList" class="main-body">
    <div class="main_wrapper main-wrapper">
      <div class="page-title">
        <span>加粉频繁明细</span>
      </div>
      <div class="search-area">
        <el-input class="ele-input" placeholder="请输入微信号或微信昵称" suffix-icon="el-icon-search" v-model="searchForm.keywords"
          @change="searchList"></el-input>
        <el-select size="small" class="ele-select" v-model="searchForm.groupId" placeholder="所属分组" clearable
          @change="searchList">
          <el-option label="所属分组" value=""></el-option>
          <el-option v-for="item in groupList" :key="item.value" :label="item.wx_user_group_name"
            :value="item.wx_user_group_id"></el-option>
        </el-select>
        <el-select size="small" class="ele-select" v-model="searchForm.accountId" placeholder="所属账号" clearable
          @change="searchList" v-if="accountType">
          <el-option label="所属账号" value=""></el-option>
          <el-option :label="username" :value="userId"></el-option>
          <el-option v-for="(item,index) in bindChildAccountList" :key="index" :label="item.user_name"
            :value="item.user_id"></el-option>
        </el-select>
        <el-date-picker class="ele-date-editor" v-model="searchForm.searchDate" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=false
          @change="searchList">
        </el-date-picker>
      </div>
      <div class="info_wrapper">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;"
          class="ele-table-init" v-loading="loading">
          <el-table-column label="微信号" align="center">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" :content="scope.row.wxUserName" placement="bottom" effect="light"
                :offset="80">
                <p class="writeWrapper">{{scope.row.wxUserName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="昵称" align="center">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" :content="scope.row.nickName" placement="bottom-end" :offset="80"
                effect="light">
                <p class="writeWrapper">{{scope.row.nickName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="planName" label="任务名称" align="center"></el-table-column>
          <el-table-column prop="phone" label="资源名称" align="center"></el-table-column>
          <el-table-column prop="createdTime" label="执行时间" align="center"></el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData.length!=0">
          <el-pagination @current-change="changePage" :current-page="page" :page-size="pageLen"
            layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Dialog from "../../components/dialog.vue";
  import {
    mapState,
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex';
  import util from '../../../static/js/common.js';
  var defaultDate = util.defaultDate;
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        loading: true,
        page: 1,
        pageLen: 10,
        total: 0,
        tableData: [],
        searchForm: {
          keywords: "",
          groupId: "",
          accountId: "",
          searchDate: []
        },
        bindChildAccountList: [],
        groupList: [],
        username: "",
        userId: "",
        accountType: false,
        defaultValue: "['2018-1-1','2019-2-3']"
      };
    },
    computed: {
      ...mapState([
        'dialogFlag'
      ])
    },
    mounted() {
      this.token = sessionStorage.getItem("token");
      this.username = sessionStorage.getItem("username");
      this.userId = sessionStorage.getItem("user_id");
      this.searchForm.searchDate = defaultDate(-7)
      this.getGroupList();
      this.getTableList();
      if (sessionStorage.getItem('indentity') === 'ROLE_USER') {
        this.getAccountList();
        this.accountType = true;
      };
    },
    methods: {
      searchList() {
        this.page = 1;
        this.getTableList();
      },
      changePage(page) {
        this.page = page;
        this.getTableList();
      },
      getTableList() {
        this.loading = true;
        let searchForm = this.searchForm;
        let params = {
          pageNo: this.page,
          length: 10
        };
        if (searchForm.keywords != "") {
          params.wxUserName = searchForm.keywords;
        }
        if (searchForm.groupId != "") {
          params.groupId = searchForm.groupId;
        }
        if (searchForm.accountId != "") {
          params.childUserId = Number(searchForm.accountId);
        }
        if (Array.isArray(searchForm.searchDate)) {
          if (searchForm.searchDate.length !== 0) {
            params.startTime = searchForm.searchDate[0];
            params.endTime = searchForm.searchDate[1];
          };
        };
        this.$http('wx_user_error/detail_info_list', "POST", params).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            this.tableData = res.data.data.result;
            this.total = res.data.data.totalCount;
          } else {
            this.$message.error(res.data.error_messag);
          }
        }).catch(err => {

        })
      },
      getGroupList() {
        this.$http("wx_group/group_list", "POST", {
          limit: 99999,
          page: 1
        }).then(res => {
          if (res.data.error_code == 0) {
            this.groupList = res.data.data.result;
          } else {
            this.$message.error(res.data.error_messag);
          }
        }).catch(err => {});
      },
      getAccountList() {
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
      }
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../style/css/base.scss';
</style>
