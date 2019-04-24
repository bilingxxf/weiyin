<template>
  <div id="abnormalCount" class="main-body">
    <div class="main_wrapper main-wrapper">
      <div class="page-title">
        <span>加粉频繁汇总</span>
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
          <el-table-column prop="planName" label="连续频繁" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isOften | capitalize}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="总频繁次数" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData.length!=0">
          <el-pagination @current-change="changePage" :current-page="page" :page-size="pageLen"
            layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
      <el-dialog title="详情" :visible.sync="detailFlag" width="800px">
        <div class="detail-table">
          <el-table :data="gridData" class="ele-table-init" max-height="400">
            <el-table-column property="date" label="日期" align="center"></el-table-column>
            <el-table-column property="count" label="频繁次数" align="center"></el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleClose" class="ele-btn">确 定</el-button>
        </div>
      </el-dialog>
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
        detailFlag: false,
        gridData: [],
        accountType: false,
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
      showDetail(row) {
        let _this = this;
        let searchForm = _this.searchForm;
        let params = {
          length: 99999,
          pageNo: 1,
          wxUserId: row.wxUserId,
          startTime: searchForm.searchDate[0],
          endTime: searchForm.searchDate[1]
        };
        _this.$http('wx_user_error/info_list_by_wxid', "POST", params).then(res => {
          if (res.data.error_code == 0) {
            _this.detailFlag = true;
            _this.gridData = res.data.data.result;
          } else {
            _this.$message.error(res.data.error_messag);
          }
        }).catch(err => {

        })
      },
      showModel(type, title, row) {

      },
      getTableList() {
        this.loading = true;
        let searchForm = this.searchForm;
        let params = {
          page: this.page,
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
        };
        if (Array.isArray(searchForm.searchDate)) {
          if (searchForm.searchDate.length !== 0) {
            params.startTime = searchForm.searchDate[0];
            params.endTime = searchForm.searchDate[1];
          };
        };
        this.$http('wx_user_error/summary_info_list', "POST", params).then(res => {
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
      },
      handleClose() {
        this.detailFlag = false;
      }
    },
    //过滤器
    filters: {
      capitalize: function (value) {
        if (value === 1) {
          return "是";
        } else if (value === 2) {
          return "否";
        } else {
          return "未知";
        }
      },
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../style/css/base.scss';

</style>
