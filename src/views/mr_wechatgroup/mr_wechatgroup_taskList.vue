<template>
  <div id="group" class="main-body">
    <div class="main-wrapper">
      <div class="info_wrapper">
        <div class="page-title">
          <span>群任务列表</span>
        </div>
        <div class="search-content" style="margin-bottom:20px;">
          <div class="left">
            <el-date-picker
              class="ele-date-editor"
              v-model="searchDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="searchList"
              >
            </el-date-picker>
            <!--<el-select size="small" class="ele-select" v-model="selectStutus" @change="page = 1,init()">-->
              <!--<el-option-->
                <!--v-for="item in selectStutusList"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value"-->
              <!--&gt;</el-option>-->
            <!--</el-select>-->
          </div>
        </div>
        <div class="table_wrapper">
          <el-table
            ref="multipleTable"
            :data="groupList"
            class="ele-table-init"
            v-loading="loading">
            <el-table-column width="20" fixed></el-table-column>
            <!-- <el-table-column type="selection" fixed></el-table-column> -->
            <el-table-column label="序号" align="left" width="60">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="userName" label="所属账号" align="left" width="150" v-if="accountType">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.userName" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.userName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="planName" label="任务名称" align="left">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.planName" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.planName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="left"></el-table-column>
            <el-table-column prop="chatroomMaxMemberCount" label="群聊限制人数" align="center"></el-table-column>
            <!-- <el-table-column prop="wxCount" label="微信号总数量" align="center"></el-table-column>
            <el-table-column prop="contactCount" label="好友总数" align="center"></el-table-column> -->
            <el-table-column label="状态" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.planStatusByTask|formatState}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="mini" @click="showModel('del','删除',scope.row)">删除</el-button> -->
                <el-button type="text" size="mini" @click="showModel('xls','报表',scope.row)">报表</el-button>
              </template>
            </el-table-column>
            <el-table-column width="30"></el-table-column>
          </el-table>
          <div class="pagination" v-if="total!=0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <Dialog v-if="dialogFlag=='xls'" @callback="reportData">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">是否需要下载报表？</p>
      </div>
    </Dialog>
    <Dialog v-if="dialogFlag=='del'" @callback="delItem">
      <div class="dialog-content dialog-detail" slot="content">
        <p style="color:#666;">是否删除该任务？</p>
      </div>
    </Dialog>
  </div>
</template>
<script>
  import {config} from "../../api/http.js";
  import Dialog from "../../components/dialog.vue";
  import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
  import  util from '../../../static/js/common.js';
  var downloadXLS = util.downloadXLS;
  import XLSX from "xlsx";

  import downloadFile from "../../../static/js/downloadExcel.js";
  var outputXlsxFile = downloadFile.outputXlsxFile;
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        loading:true,
        searchDate:"",
        groupList:[],
        accountType:false,
        total:0,
        page:1,
        pageSize:10,
        downPublicUrl:config.linkUrl,
        token:"",
        selectStutusList:[
          {
            label:"未删除",
            value:0
          },
          {
            label:"已删除",
            value:1
          }
        ],
        selectStutus:0,
        detailArr:[],
        InfoArr:[],
        XlSData:{}
      };
    },
    computed: {
      ...mapState(["dialogFlag"])
    },
    mounted() {
      this.getGroupList();
      this.username = sessionStorage.getItem("username")
      this.userId = sessionStorage.getItem("user_id");
      this.token = sessionStorage.getItem('token');
      if(sessionStorage.getItem('indentity')==='ROLE_USER'){
        this.accountType=true;
      };
    },
    methods: {
      //删除任务
      delItem(){
        //this.getGroupList();
        // console.log(this.editId);
      },
       searchList(){
         this.page = 1;
         if(this.searchDate!=null){
            this.startTime = this.searchDate[0];
            this.endTime = this.searchDate[1];
         }
         this.getGroupList();
       },
      hideModel() { // 隐藏
        this.$store.dispatch('hideDialog')
      },
      getGroupList() {//  列表
        this.loading = true;
        // let searchForm=this.searchForm;
        // let userId=sessionStorage.getItem('user_id');
        // let params={
        //   length: 10,
        //   pageNo: this.page,
        //   userId:Number(userId)
        // };
        // if(this.searchDate!=null){
        //     params['startTime'] = this.startTime;
        //     params['endTime'] = this.endTime;
        // }
        // this.$http("task_chatroom/chatroom_plan_list", "POST", params).then(res => {
        //   if (res.data.error_code == 0) {
        //     this.loading = false;
        //     let data = res.data.data;
        //     this.total = data.totalCount;
        //     // this.groupList = data.result;
        //   }else{
        //     this.$message.error(res.data.error_message);
        //   }
        // }).catch((err)=>{
        //   this.$message.error(err);
        // });
        let data = {};
        if(this.searchDate!=null&&this.searchDate!=""){
            data['startTime'] = this.startTime + " 00:00:01";
            data['endTime'] = this.endTime + " 23:59:59";
        }
        data['templateName'] = '批量拉人入群';
        data['pageNo'] = this.page;
        data['length'] =10;
        this.$http('plan/plan_list', 'POST', data).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            let data = res.data.data;
            this.total = data.total_count;
            let arr = [];
            data.result.map(item=>{
                let nowDate = new Date().valueOf();
                let createDate = new Date(item.createTime).valueOf();
                if(nowDate-createDate>1800000){
                  item['planStatusByTask'] = 1;
                }else{
                  item['planStatusByTask'] = 0;
                }

              item['chatroomMaxMemberCount'] = JSON.parse(item.planParams).maxMember;
              item['wxCount'] = item.wxids.split(',').length;
            })
            this.groupList = data.result;
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
      showModel(type,title,row){
        this.editId = JSON.parse(row.planParams).planKey;
        // this.editId=row.planId;
        this.$store.dispatch("showDialog",{
          title:title,
          showCancel:true,
          flag:type
        })
      },
      handleCurrentChange(val){
        this.page = val;
        this.getGroupList();
      },
      //下载报表
       reportData(){
          // let url = this.downPublicUrl+"api/v1/task_chatroom/task_chatroom_report?planId="+this.editId+"&token=" + this.token;
          // downloadXLS(url)
          this.detailArr = [];
          this.InfoArr = [];
          let i = 0;
          this.$redis.list.get({
						key: `ADD_MEMBER_INTO_CHATROOM_PLAN_${this.editId}`,
            start: 0,
            stop:-1
					},'json').then(res=>{
            if(res.data.error_code==0){
              i++;
              let data = res.data.data.members;
              data.map(item=>{
                if(item.contactNickName.indexOf('0x27')>-1){
                  item.contactNickName=item.contactNickName.replace("0x27", "'");
                }
                if(item.status=='1'){
                 item['status'] = "邀请失败";
                }else{
                  item['status'] = "邀请成功";
                }
                this.detailArr.push(item)
              })
              if(i==2){
                this.downloadExcel();
              }
            }
          })
          this.$redis.list.get({
						key: `CREATE_ROOM_${this.editId}`,
            start: 0,
            stop:-1
					}).then(res=>{
            if(res.data.error_code==0){
              i++;
              let data = res.data.data.members;
              data.map(item=>{
                this.InfoArr.push(JSON.parse(item))
              })
              if(i==2){
                this.downloadExcel();
              }
            }
          })
      },
      downloadExcel(){
        let InfoHeader = ['群聊名称','群id','类型','本次加入人数','群聊总人数','群主','创建者','创建时间'];
        let InfoAttribute = ["roomName","roomId","value","value","value","value","invitorNickName","createTime"]
        this.XlSData['群聊信息'] = {data:this.InfoArr,xlsxHeader:InfoHeader,xlsxAttribute:InfoAttribute}
        let detailHeader = ['微信昵称','微信号','邀请者','群聊','加入时间','备注'];
        let detailAttribute = ["contactNickName","contactId","invitorNickName","roomName","inviteTime","msg"]
        this.XlSData['群聊明细'] = {data:this.detailArr,xlsxHeader:detailHeader,xlsxAttribute:detailAttribute}
         this.hideModel();
         outputXlsxFile(XLSX,this.XlSData,[{wch: 20}, {wch: 25},{wch: 20},{wch: 20},{wch: 20},{wch: 20},{wch: 20},{wch: 20}],"群任务报表")
        this.$message.success("正在生成Excel");
     },
      // 下载模板
      outputXlsxFile (data, wscols, xlsxName) {
          var sheetNames = [];
          var sheetsList= {}; 　
          for(var key in data){ 　　　　
          　　sheetNames.push(key);
              if(key=="群聊信息"){
                var temp = detailDataExcel(data[key]);
              }else{
                var temp = infoDataExcel(data[key]);
              }　　　　
          　　sheetsList[key] = XLSX.utils.aoa_to_sheet(temp); 　　　　
          　　sheetsList[key]['!cols'] = wscols; 　　
          }
          const wb = XLSX.utils.book_new();
          wb['SheetNames']= sheetNames;
          wb['Sheets']= sheetsList;
          this.$message.success("正在生成Excel");　
          XLSX.writeFile(wb, xlsxName + ".xlsx");
        　　//处理数据的函数
      　　function detailDataExcel(data){
      　　　　var total = [];
      　　　　var temp = ['群聊名称','群id','类型','本次加入人数','群聊总人数','群主','创建者','创建时间'];
      　　　　total.push(temp);
      　　　　data.forEach(function(item,index){
          　　　　　　var arr = [];
          　　　　　　arr.push(item.function_name)
          　　　　　　arr.push(item.roomId)
          　　　　　　arr.push(item.value)
          　　　　　　arr.push(item.value)
          　　　　　　arr.push(item.value)
          　　　　　　arr.push(item.value)
          　　　　　　arr.push(item.value)
          　　　　　　arr.push(item.createTime)
          　　　　　　total.push(arr);
      　　　　})
      　　　　return total;
          　}
            function infoDataExcel(data){
      　　　　var total = [];
      　　　　var temp = ['微信号','邀请者','群聊','群聊类型','加入时间'];
      　　　　total.push(temp);
      　　　　data.forEach(function(item,index){
          　　　　　　var arr = [];
          　　　　　　arr.push(item.contactId)
          　　　　　　arr.push(item.invitor)
          　　　　　　arr.push(item.roomId)
          　　　　　　arr.push(item.value)
          　　　　　　arr.push(item.inviteTime)
          　　　　　　total.push(arr);
      　　　　})
      　　　　return total;
          　}
        },
    //   outputXlsxFile (data, wscols, xlsxName) {
    //       var sheetNames = [];
    //       var sheetsList= {}; 　
    //       for(var key in data){ 　　　　
    //       　　sheetNames.push(key);
    //           if(key=="群聊信息"){
    //             var temp = detailDataExcel(data[key]);
    //           }else{
    //             var temp = infoDataExcel(data[key]);
    //           }　　　　
    //       　　sheetsList[key] = XLSX.utils.aoa_to_sheet(temp); 　　　　
    //       　　sheetsList[key]['!cols'] = wscols; 　　
    //       }
    //       const wb = XLSX.utils.book_new();
    //       wb['SheetNames']= sheetNames;
    //       wb['Sheets']= sheetsList;
    //       this.$message.success("正在生成Excel");　
    //       XLSX.writeFile(wb, xlsxName + ".xlsx");
    //     　　//处理数据的函数
    //   　　function detailDataExcel(data){
    //   　　　　var total = [];
    //   　　　　var temp = ['群聊名称','群id','类型','本次加入人数','群聊总人数','群主','创建者','创建时间'];
    //   　　　　total.push(temp);
    //   　　　　data.forEach(function(item,index){
    //       　　　　　　var arr = [];
    //       　　　　　　arr.push(item.roomName)
    //       　　　　　　arr.push(item.roomId)
    //       　　　　　　arr.push(item.value)
    //       　　　　　　arr.push(item.value)
    //       　　　　　　arr.push(item.value)
    //       　　　　　　arr.push(item.value)
    //       　　　　　　arr.push(item.invitorNickName)
    //       　　　　　　arr.push(item.createTime)
    //       　　　　　　total.push(arr);
    //   　　　　})
    //   　　　　return total;
    //       　}
    //         function infoDataExcel(data){
    //   　　　　var total = [];
    //   　　　　var temp = ['微信昵称','微信号','邀请者','群聊','加入时间','备注'];
    //   　　　　total.push(temp);
    //   　　　　data.forEach(function(item,index){
    //       　　　　　　var arr = [];
    //       　　　　　　arr.push(item.contactNickName)
    //       　　　　　　arr.push(item.contactId)
    //       　　　　　　arr.push(item.invitorNickName)
    //       　　　　　　arr.push(item.roomName)
    //       　　　　　　arr.push(item.inviteTime)
    //       　　　　　　arr.push(item.msg)
    //       　　　　　　total.push(arr);
    //   　　　　})
    //   　　　　return total;
    //       　}
    //     },
    },
    filters:{
      formatState(num){
        switch (num*1) {
          case 0:
            return "进行中";
            break;
          default:
            return "已结束";
            break;
        }
      }
    },
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
