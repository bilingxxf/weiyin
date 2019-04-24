<template>
  <!-- <div id="fanTaskList" class="main-body"> -->
  <div id="fansAgree" class="main-body">
    <div class="main_wrapper main-wrapper">
      <div class="page-title">
        <span>被动加粉列表</span>
      </div>
      <div class="search-area">
        <ul>
          <li>
            <span>申请时间:</span>
            <el-date-picker class="ele-date-editor" v-model="selectDate" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" @change="searchInit" value-format="yyyy-MM-dd">
            </el-date-picker>
          </li>
          <li>
            <span>对方微信号:</span>
            <el-input class="ele-input" @change="searchInit" placeholder="请输入全部字段信息" suffix-icon="el-icon-search"
              v-model="fromUsername"></el-input>
          </li>
          <li>
            <span>被添加微信号:</span>
            <el-input class="ele-input" @change="searchInit" placeholder="请输入全部字段信息" suffix-icon="el-icon-search"
              v-model="toUsername"></el-input>
          </li>
          <li>
            <span>性别:</span>
            <el-select size="small" class="ele-select" v-model="sex" placeholder="性别" clearable @change="searchInit">
              <el-option v-for="(item,index) in sexGroup" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </li>
          <li>
            <span>状态:</span>
            <el-select size="small" class="ele-select" v-model="state" placeholder="状态" clearable @change="currentPage=1,searchInit()">
              <el-option v-for="(item,index) in stateGroup" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </li>
          <li  v-if="accountType">
             <span>账号:</span>
            <el-select
              size="small"
              class="ele-select"
              v-model="selectChildAccountId"
              placeholder="所属账号"
              clearable
              @change="page=1,getData()"
              v-if="accountType"
              >
              <el-option label="所属账号" value=""></el-option>
              <el-option :label=username :value=userId></el-option>
              <el-option
                v-for="(item,index) in bindChildAccountList"
                :key="index"
                :label="item.user_name"
                :value="item.user_id"
              ></el-option>
              </el-select>
          </li>
        </ul>
      </div>
      <div class="edit-group">
        <em>批量操作：</em>
        <span class="edit-btn" @click="showModel('agreeGroup')">同意</span>
        <span class="edit-btn" @click="showModel('ignoreGroup')">忽略</span>
      </div>
      <div class="info_wrapper">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="selectionChange" class="ele-table-init" v-loading="loading">
          <el-table-column type="selection" align="left" fixed="left"></el-table-column>
          <el-table-column width="50" label="序号" align="left">
            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * limit + 1}} </span></template>
          </el-table-column>
          <el-table-column width="80" label="所属账号" align="left" v-if="accountType">
            <template slot-scope="scope">
              <el-tooltip
                :open-delay="350"
                content="{scope.row.userName}"
                placement="bottom"
                effect="light"
                :offset="80"
              >
                <span slot="content">{{scope.row.userName}}</span>
                <p class="writeWrapper">{{scope.row.userName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="120" label="对方微信号" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.nickname}" placement="bottom" effect="light" :offset="80">
                <span slot="content">{{scope.row.fromUserName}}</span>
                <p class="writeWrapper">{{scope.row.fromUserName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="120" label="对方微信昵称" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.nickname}" placement="bottom" effect="light" :offset="80">
                <span slot="content">{{scope.row.fromNickName}}</span>
                <p class="writeWrapper">{{scope.row.fromNickName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="110" label="对方招呼申请" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.nickname}" placement="bottom" effect="light" :offset="80">
                <span slot="content">{{scope.row.verifyContent}}</span>
                <p class="writeWrapper">{{scope.row.verifyContent}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="105" label="对方所在国家" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.nickname|formatConuntry}" placement="bottom" effect="light" :offset="80">
                <span slot="content">{{scope.row.country|formatConuntry}}</span>
                <p class="writeWrapper">{{scope.row.country|formatConuntry}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="105" label="对方所在省份" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.nickname|formatPro}" placement="bottom" effect="light" :offset="80">
                <span slot="content">{{scope.row.province|formatPro}}</span>
                <p class="writeWrapper">{{scope.row.province|formatPro}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="planId" width="80" label="对方性别" align="left">
            <template slot-scope="scope">{{scope.row.sex | detectionSex}}</template>
          </el-table-column>
          <el-table-column width="115" label="被添加微信号" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.wxUsername}" placement="bottom" effect="light" :offset="80">
                <span slot="content">{{scope.row.wxUsername}}</span>
                <p class="writeWrapper">{{scope.row.wxUsername}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="130" label="被添加微信昵称" align="left">
            <template slot-scope="scope">
              <el-tooltip :open-delay="350" content="{scope.row.nickName}" placement="bottom" effect="light" :offset="80">
                <span slot="content">{{scope.row.nickName}}</span>
                <p class="writeWrapper">{{scope.row.nickName}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="insertTime" width="140" label="申请时间" align="left"></el-table-column>
          <el-table-column prop="dealTime" width="140" label="处理时间" align="left"></el-table-column>
          <el-table-column width="90" label="当前状态" align="left">
            <template slot-scope="scope">
              <span class="edit-btn">{{scope.row.verifyResult|formatState}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <span class="edit-btn" :class="[scope.row.verifyResult!=0?'disabled':'']" @click="showModel('agree',scope.row)">同意</span>
              <span class="edit-btn red" :class="[scope.row.verifyResult!=0?'disabled':'red']" @click="showModel('ignore',scope.row)">忽略</span>
            </template>
          </el-table-column>
          <el-table-column width="30">
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData.length!=0">
          <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="limit" layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加好友 -->
    <Dialog v-if="dialogFlag=='addFriends'" @callback="handleAgree" @cancelCallback="cancelCallback">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">确定同意添加好友吗？</p>
      </div>
    </Dialog>
    <!-- 忽略好友 -->
    <Dialog v-if="dialogFlag=='ignoreFriends'" @callback="handleIgnore" @cancelCallback="cancelCallback">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">确定忽略添加好友吗？</p>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import Dialog from "../../components/dialog.vue";
  import City from "../../../static/city";
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
        loading:true,
        tableData: [],
        currentPage: 1,
        total: 0,
        limit: 10,
        selectDate: null,
        fromUsername: "",
        toUsername: "",
        sex: "",
        sexGroup: [
          {
            label: "全部",
            value: -1
          },
          {
            label: "男",
            value: 1
          },
          {
            label: "女",
            value: 2
          }
        ],
        state: "",
        stateGroup: [
          {
            label: "全部",
            value: -1
          },
          {
            label: "待处理",
            value: 0
          },
          {
            label: "已自动通过",
            value: 1
          },
          {
            label: "已同意",
            value: 2
          },
          {
            label: "已忽略",
            value: 3
          },
          {
            label: "已失效",
            value: 4
          }
        ],
        checkIds:[],
        checkItem:[],
        flag: "",
        page:1,
        task_Id:"",
        accountType:false,
        selectChildAccountId:"",
        bindChildAccountList:[],
        username:"",
        userId:""
      };
    },
    computed: {
      ...mapState([
        'dialogFlag'
      ])
    },
    mounted() {
      this.username =  sessionStorage.getItem("username");
			this.userId =  sessionStorage.getItem("user_id");
      this.getData();
      this.getTemplateId();
      if(sessionStorage.getItem('indentity')==='ROLE_USER'){
        this.accountType=true;
      }
      this.getChildAccountList();
    },
    methods: {
      //获取子账号列表
			getChildAccountList(){
				this.$http("child_user/list","POST",{
          length:9999,
          pageNo:1,
          parentUserId:sessionStorage.getItem('user_id')
        }).then((res)=>{
          if(res.data.error_code==0){
          this.bindChildAccountList = res.data.data.result;
          }else{
          this.$message.error(res.data.error_message);
          }
        }).catch((err)=>{
          console.log(err);
        })
			},
      formatNum(num){
        return num*1>=10?num:'0'+num;
      },
      getTemplateId(){
        this.$http('task_template',"GET",{
          page:1,
          per_page:9999
        }).then(res=>{
          let data = res.data.data;
          data.result.map((item, index)=>{
            if(item.task_template_name == '被动加粉') {
              this.task_Id = item.task_template_id
            }
          })
        }).catch(err=>{
        })
      },
      createPlan(){
        let item=this.checkItem;
        let sortJson={};
        item.map((v,k)=>{
          if(v.verifyResult==0){
            if(!sortJson[v.wxUserId]){
              sortJson[v.wxUserId]=[];
            }
            sortJson[v.wxUserId].push(v)
          }
        });
        for(let key in sortJson){
          let v1=[];
          let v2=[];
          let sence=[];
          sortJson[key].map((v,k)=>{
            v1.push(v.encryptUserName);
            v2.push(v.ticket);
            sence.push(v.scene);
          });
          let parmas = {
            v1:v1,
            v2:v2,
            sence:sence
          };
          let data={
            taskTemplateName:"被动加粉",
            wxIds:key,
            planParams:JSON.stringify(parmas)
          }
          let str={
            param:JSON.stringify(data)
          };
          this.$http("plan/start_plan","POST",str).then(res=>{
            if(res.data.error_code == 0) {
              this.$message.success("添加好友成功");
              this.$store.dispatch("hideDialog");
              this.getData();
            }else{
              this.$message.error(res.data.error_message);
            }
          }).catch(err=>{
            this.$message.error("被动加粉计划创建失败");
          });
        };
      },
      //同意
      handleAgree() {
        let _this=this;
        _this.$http("wx_friend/update_friend_request_info","POST",{
          ids:_this.checkIds,
          verifyResult:2
        }).then(res=>{
          if(res.data.code==0){
            _this.createPlan();
          }else{
            this.$message.error(res.data.message);
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      //忽略
      handleIgnore() {
        let _this=this;
        _this.$http("wx_friend/update_friend_request_info","POST",{
          ids:_this.checkIds,
          verifyResult:3
        }).then(res=>{
          if(res.data.code==0){
            this.$store.dispatch("hideDialog");
            this.$message.success("好友申请已忽略");
            this.getData();
          }else{
            this.$message.error(res.data.message);
          }
        }).catch(err=>{
          this.$message.error("忽略请求失败");
        })
      },
      //取消
      cancelCallback() {
        this.checkItem=[];
        this.checkIds=[];
        this.$store.dispatch('hideDialog');
        this.$refs.multipleTable.clearSelection();
      },
      handleCurrentChange(page) {
        this.page = page;
        this.getData();
      },
      searchInit(val) {
        this.page = 1;
        this.getData();
      },
      filterSex(sex){
        switch (sex) {
          case 1:
            return "男";
            break;
          case 2:
            return "女";
            break;
          default:
            return "未知";
            break;
        }
      },
      getData() {
        let _this = this;
        let parmas = {
          pageNo: _this.page,
          length:_this.limit,
          userId:sessionStorage.getItem("user_id")
        };
        this.loading = true;
        if (_this.selectDate != null) {
          parmas.startTime = _this.selectDate[0];
          parmas.endTime = _this.selectDate[1];
        }
        if (_this.fromUsername != "") {
          parmas.fromUserName = _this.fromUsername;
        }
        if (_this.toUsername != "") {
          parmas.wxUserName = _this.toUsername;
        }
        if (_this.sex != ""&&_this.sex!=-1) {
          parmas.sex =_this.sex;
        }
        if(_this.selectChildAccountId !=""){
          parmas.childUserId = this.selectChildAccountId;
        }
        if (typeof (_this.state)=="number"&&_this.state!=-1) {
          parmas.verifyResult = _this.state;
        }
        this.$http("wx_friend/friend_request_info_list","POST",parmas).then(res=>{
          if(res.data.error_code==0){
            this.loading = false;
            let list = res.data.data.result;
            this.tableData=list;
            this.total=res.data.data.totalCount;
          }
          else{
            this.$message.error("获取列表失败");
          }
        }).catch(err=>{
          this.$message.error("获取列表失败");
        })
      },
      showModel(state,row) {
        let _this=this;
        switch (state) {
          case "agree":
            this.checkItem=[row];
            this.checkIds=[row.id];
            if(row.verifyResult==0){
              this.$store.dispatch("showDialog", {
                title: "添加好友",
                showCancel: true,
                flag: "addFriends"
              });
            }
            break;
          case "ignore":
            this.checkItem=[row];
            this.checkIds=[row.id];
            if(row.verifyResult==0){
              this.$store.dispatch("showDialog", {
                title: "忽略",
                showCancel: true,
                flag: "ignoreFriends"
              });
            }
            break;
          case "agreeGroup":
            if (this.checkItem.length == 0) {
              this.$message.error("请选择要操作的账号");
              return;
            };
            var item=_this.checkItem;
            var checkIds=[];
            item.map((v,k)=>{
              if(v.verifyResult==0){
                checkIds.push(v.id)
              }
            });
            if(checkIds.length!=0){
              this.checkIds=checkIds;
              this.$store.dispatch("showDialog", {
                title: "添加好友",
                showCancel: true,
                flag: "addFriends"
              });
            }else{
              this.$message.error("没有可操作数据");
            }
            break;
          case "ignoreGroup":
            if (this.checkItem.length == 0) {
              this.$message.error("请选择要操作的账号");
              return;
            };
            var item=_this.checkItem;
            var checkIds=[];
            item.map((v,k)=>{
              if(v.verifyResult==0){
                checkIds.push(v.id)
              }
            });
            if(checkIds.length!=0){
              this.checkIds=checkIds;
              this.$store.dispatch("showDialog", {
                title: "忽略",
                showCancel: true,
                flag: "ignoreFriends"
              });
            }else{
              this.$message.error("没有可操作数据");
            }
            break;
        }
      },
      selectionChange(val) {
        let checkItem = [];
        let checkIds=[];
        val.forEach(item => {
          checkIds.push(item.id)
        });
        this.checkItem = val;
        this.checkIds=checkIds;
      },
    },
    //过滤器
    filters: {
      formatPro(p){
        let props=City.citys();
        let pro="";
        for(let key in props){
          if(props[key].value==p){
            pro=props[key].label;
          }
        }
        return pro;
      },
      formatConuntry(c){
        switch (c) {
          case 'CN':
            return "中国";
        }
      },
      //过滤状态显示
      formatState(state) {
        switch (state) {
          case 0:
            return "待处理";
            break;
          case 1:
            return "已自动通过";
            break;
          case 2:
            return "已同意";
            break;
          case 3:
            return "已忽略";
            break;
          case 4:
            return "已失效";
            break;
          default:
            return "待处理";
            break;
        }
      },
      //过滤性别显示
      detectionSex(sex) {
        switch (sex*1) {
          case 1:
            return "男";
            break;
          case 2:
            return "女";
            break;
          default:
            return "未知";
            break;
        }
      }
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../style/css/base.scss';

  #fansAgree {
    background: #e8eff6;

    .main_wrapper {
      background: #fff;

      .search-area {
        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            margin: 1px 10px 1px 0;
          }

          span {
            font-size: 14px;
            color: #666;
          }
        }
      }

      .edit-group {
        margin-top: $margin;
      }
    }
  }

</style>
