<template>
  <div id="newGroupList" class="main-body">
    <div class="main-wrapper">
      <div class="info_wrapper">
        <div class="page-title">
          <span>群聊列表</span>
        </div>
        <div class="search-content" style="margin-bottom:20px;">
          <div class="left">
            <el-date-picker
              class="ele-date-editor"
              v-model="searchForm.searchDate"
              type="daterange" range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
               @change="searchList">
          </el-date-picker>
            <el-input
              class="ele-input"
              @change="initList"
              placeholder="请输入微信号或微信昵称"
              suffix-icon="el-icon-search"
              v-model="searchForm.wxUserName"
            ></el-input>
            <el-input
              class="ele-input"
              @change="initList"
              placeholder="请输入群聊名称"
              suffix-icon="el-icon-search"
              v-model="searchForm.roomName"
            ></el-input>
          </div>
        </div>
        <div class="table_wrapper">
          <el-table
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            :data="groupList"
            @select="selectEve"
            @select-all="selectEve"
            class="ele-table-init"
            v-loading="loading">
            <el-table-column width="20" fixed></el-table-column>
            <el-table-column label="序号" align="left" width="60">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column label="任务名称" align="left" width="200">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.planName" placement="bottom" effect="light" :offset="80">
                  <p class="writeWrapper">
                    <span >{{scope.row.planName}}</span>
                  </p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="roomName" label="群聊名称" align="left" width="200">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.roomName?scope.row.roomName:'未设置('+scope.row.roomUserName+')'" placement="bottom" effect="light" :offset="80">
                  <p class="writeWrapper">
                    <span >{{scope.row.roomName?scope.row.roomName:'未设置('+scope.row.roomUserName+')'}}</span>
                  </p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.type|formatState}}</span>
              </template>
            </el-table-column>
            <el-table-column label="群二维码" align="center">
              <template slot-scope="scope">
                 <img  src="../../assets/erweima.png" height="25" style="margin-top:5px;" @click="showModel('qrcode','群二维码',scope.row)">
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.deleted|formatFlag}}</span>
              </template>
            </el-table-column>
            <el-table-column label="人数" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.memberCount}}</span>
              </template>
            </el-table-column>
            <el-table-column label="群主" align="left" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.roomOwnerNickName}}({{scope.row.roomOwner}})</span>
              </template>
            </el-table-column>
            <el-table-column prop="currenContactCount" label="创建者" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.nickName}}({{scope.row.wxUsername}})</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="right" width="400">
              <template slot-scope="scope">
                <el-button type="text"  class="edit-btn" v-if="scope.row.creatorWxId==scope.row.roomOwner" @click="showModel('launch','转让群主',scope.row)">转让群主</el-button>
                <el-button type="text" class="edit-btn" @click="showModel('notice','群公告',scope.row)">群公告</el-button>
                <el-button type="text"  class="edit-btn" @click="showModel('invite','邀请入群',scope.row)">邀请入群</el-button>
                <el-button type="text" class="edit-btn" style="margin-right:0;" @click="showModel('detail','详情',scope.row)">查看</el-button>
                 <el-button type="text" class="edit-btn" @click="showModel('refresh','刷新',scope.row)">刷新</el-button>
              </template>
            </el-table-column>
            <el-table-column width="20"></el-table-column>
          </el-table>
          <div class="pagination" v-if="total!=0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--邀请入群-->
    <Dialog @callback="manualGroup" v-if="dialogFlag == 'invite'" @cancelCallback="cancelManualGroup">
      <div slot="content" class="dialog-content" style="padding:10px 0 40px 0">
        <el-radio-group  v-if="!steps" v-model="selectManualGroup" class="selectManualGroup">
          <el-radio label="platform">邀请平台微信号</el-radio>
          <el-radio label="wxfriends">邀请微信好友</el-radio>
        </el-radio-group>
        <!-- 平台用户 -->
        <div class="create" style="height:260px;" v-if="steps=='firstStep'&&selectManualGroup=='platform'">
          <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" v-if="friendsList1.length!=0" @change="handleCheckAllChange1">全部选择</el-checkbox>
          <div class="user-list">
            <el-scrollbar class="scroll-bar" v-if="friendsList1.length!=0">
              <el-checkbox-group :min="0" :max="500" v-model="checkedFriends1" @change="handleCheckedCitiesChange1">
                <div class="friend-item" v-for="(friend,index) in friendsList1" :key="index"><el-checkbox :label="friend.wxUserId" :key="friend.wxUserId">{{friend.wxUsername+'（'+friend.nickName+'）'}}<span class="add-new" v-if="friend.isToday==1">今日新增</span></el-checkbox></div>
              </el-checkbox-group>
            </el-scrollbar>
            <p class="null" v-else>无好友数据</p>
          </div>
        </div>
        <!-- 微信好友 -->
        <div class="groupCreate" v-if="steps=='firstStep'&&selectManualGroup=='wxfriends'">
          <el-table
            :data="leftTableData"
            style="width: 120;border:1px solid #ebeef5;"
            border
            max-height="300">
            <el-table-column
              prop="name"
              label="微信号"
              width="122">
                <template slot-scope="scope">
                  <el-button type="text"  class="edit-btn"   @click="getHandleWxFriends(scope.row,scope.$Index)" :class="scope.row.wxUserId==rigthUserId?handleHighlight:''">{{scope.row.wxUsername}}</el-button>
                  <!-- <el-button type="text"  class="edit-btn" @click="getHandleWxFriends(scope.row,scope.$Index)" row-class-name="highlight">{{scope.row.wxUsername}}</el-button> -->
                </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="rightTableData"
            style="width: 100;border:1px solid #ebeef5;"
            @select-all="selectionChange"
            @select="selectionChange"
            border
            max-height="330"
            class="rightTable"
            :min="0" :max="manualFriendsMax"
            ref="rightTable">
            <el-table-column type="selection" width="40" align="left" ></el-table-column>
            <el-table-column
              prop="contactWxUserName"
              label="好友微信号"
              width="175">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.contactWxUserName" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.contactWxUserName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="nickName"
              label="好友昵称"
              width="143">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.nickName" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.nickName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </Dialog>
    <!--上传二维码-->
    <Dialog @callback="imageCover" v-if="dialogFlag=='upload'" @cancelCallback="hideModel">
      <div class="dialog-content head qrCodeimg" slot="content">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          ref="avatarUpload"
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="changeUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </Dialog>
     <!-- 查看二维码-->
    <Dialog v-if="dialogFlag=='qrcode'" :showBtn="false">
        <div class="dialog-content qrcode" slot="content" style="padding:0">
          <div class="qrcode-info">
            <div class="box" v-if="!expire">
              <div class="qrcode-box" id="qrcode" ref="qrcode"></div>
              <p>该二维码将于{{expireDays}}天后失效</p>
            </div>
            <div class="box" v-else>
              <div class="note">二维码已过期</div>
              <el-button class="ele-btn" @click="resaveCode">重新获取</el-button>
            </div>
          </div>
        </div>
    </Dialog>
    <!--退群-->
    <Dialog v-if="dialogFlag=='exit'" @callback="retreatGroup"></Dialog>
    <Dialog v-if="dialogFlag=='refresh'" @callback="refreshGroupInfo">
      <div class="dialog-content refresh" slot="content">
        <p>刷新群信息</p>
      </div>
    </Dialog>
    <!--解散群-->
    <!--<Dialog v-if="dialogFlag=='解散'" @callback="dismissGroup">-->
        <!--<div class="dialog-content qrcode" slot="content" style="padding:30px 0 40px 0">-->
          <!--<p style="text-align:left;margin-bottom:5px;">解散留言:</p>-->
          <!--<div>-->
            <!--<el-input type="textarea" :rows="4" resize="none"  class="ele-input dismissWidth" placeholder="请输入" v-model="dismissMessage"></el-input>-->
          <!--</div>-->
        <!--</div>-->
    <!--</Dialog>-->
    <!--转让群-->
    <Dialog @callback="transferGroup" v-if="dialogFlag == 'launch'" @cancelCallback="launchCancel">
      <div slot="content" class="dialog-content" style="padding:10px 0 40px 0">
        <div class="create">
          <div class="launch-list">
            <el-scrollbar class="scroll-bar">
              <el-radio-group v-model="checkUserName">
                <div class="item" v-for="(item,index) in chatList" :key="index">
                  <el-radio :label="item.wxUsername">{{item.wxUsername+'（'+item.nickName+'）'}}</el-radio>
                </div>
              </el-radio-group>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </Dialog>
    <!-- 群公告 -->
    <Dialog v-if="dialogFlag=='notice'" @callback="noticeCallback" @cancelCallback="noticeCancelCallback" :sureText="sureText">
      <div slot="content" class="dialog-content" style="padding:0">
        <div class="notice">
          <p v-show="anouncement==''&&editNotice==false">暂无群公告</p>
          <textarea placeholder="请输入群公告"  :class="[{'disabled':!editNotice}]"  v-show="anouncement!=''||editNotice" v-model="anouncement" @input="noticeChange" :disabled="!editNotice"></textarea>
          <span v-show="editNotice" class="total">{{anouncementTotal}}/{{anouncementMax-anouncementTotal}}</span>
        </div>
      </div>
    </Dialog>
    <Dialog v-if="dialogFlag=='detail'">
      <div slot="content" class="dialog-content" style="padding:0 0 40px 0">
        <div class="detail">
          <div class="group-owner">
            群主:{{ownerResult.ownerNickName+'（'+ownerResult.ownerWxusername+'）'}}
            <span>在群人数：{{ownerResult.chatroomMermberCount}}</span>
            <span>已退群人数：{{ownerResult.outChatroomMermberCount}}</span>
          </div>
            <template>
              <el-table
                :data="detailTableData"
                class="ele-table-init"
                style="width: 100%"
                max-height="250">
                <el-table-column label="序号" width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="wxUsername"
                  label="微信号"
                  width="210">
                  <template slot-scope="scope">
                    <el-tooltip
                      :open-delay="350"
                      :content="scope.row.wxUsername"
                      placement="bottom-end"
                      effect="light"
                      :offset="80">
                      <p class="writeWrapper">{{scope.row.wxUsername}}({{scope.row.nickName}})</p>
                    </el-tooltip>
                  </template>
                </el-table-column>
                 <el-table-column
                  prop="createTime"
                  label="加入时间"
                  align="center"
                  width="150">
                   <template slot-scope="scope">
                    <el-tooltip
                      :open-delay="350"
                      :content="scope.row.createTime"
                      placement="bottom-end"
                      effect="light"
                      :offset="80">
                      <p class="writeWrapper">{{scope.row.createTime}}</p>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="wxUsername" label="类型" align="center" width="90">
              <template slot-scope="scope">
                <span>{{scope.row.deleted|groupFriendState}}</span>
              </template>
            </el-table-column>
              </el-table>
            </template>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script>
  import Dialog from "../../components/dialog.vue";
  import QRCode from "qrcodejs2";
  import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        loading: true,
        uploadUrl: "",
        imgaa: "",
        imageUrl: "",
        imgfile: "",
        page: 1,
        pageSize: 10,
        total: 0,
        groupTotal: 10,
        groupPersonTotal: 400,
        groupList: [],
        accountGroups:[],
        popFlag: false,
        popType: 1,
        popTitle: "群成员",
        qrCode: "",
        msgInfo: "",
        selectedList: [],
        wxorname: "",
        statusGroup: "",// 群进度下拉
        selectGroup: "",// 群分组
        status: [], // 群进度下拉
        groups: [], // 群分组
        friendsList: [], // 群好友
        friendsList1: [], // 群好友
        friendNumber: [], // 建群选择好友
        groupMembers: [], // 群内人数
        postCodeUrl: '', // 存放二维码解析之后地址
        tranforWxuserName: '', // 转让人ID
        dismissMessage: '', // 解散发言
        retreatWxid: '', // 退群微信ID
        createWxid: '', // 建群人ID,
        searchForm:{
          selectChildAccountId:"",
          groupName:"",
          roomName:"",
          wxUserName:"",
          searchDate:[]
        },
        editNotice:false,
        anouncement:"",
        anouncementTotal:0,
        anouncementMax:200,
        chatroomId:"",
        roomUserName:"",
        wxUserId:"",
        sureText:"编 辑",
        checkedFriends:[],
        checkedFriends1:[],
        checkedFriends2:[],
        checkAll: false,
        checkAll1: false,
        isIndeterminate: false,
        isIndeterminate1: false,
        chatList:[],
        groupAccountTotal:0,
        checkItem:{},
        checkIndex:-1,
        checkUserName:"",
        tabList:["群成员","退群记录","失败记录"],
        tabIndex:0,
        detailTableData:[],
        accountType:false,
        bindChildAccountList:[],
        userId:"",
        username:"",
        expire:false,
        detailTotal:0,
        detailTotalPage:1,
        detailTotalPageSize:10,
        isGroupOwner:false,
        createMax:40,
        ownerResult:{},
        expireDays:0,
        startTime:"",
        endTime:"",
        selectManualGroup:'platform',
        steps:"",
        leftTableData:[],
        rightTableData:[],
        leftTableFirst:"",
        manualFriendsMax:40,
        checkValue:"",
        qrcodeImgUrl:"",
        rigthUserId:"",
        expireFlag:"",
        temporaryDays:"",
        // manualFriendsMax:40,
      };
    },
    computed: {
      ...mapState(["dialogFlag"]),
          handleHighlight(){
        return 'highlight'
      }
    },
    mounted() {
      this.getGroupList();
      this.username = sessionStorage.getItem("username")
      this.userId = sessionStorage.getItem("user_id");
      if(sessionStorage.getItem('indentity')==='ROLE_USER'){
        this.accountType=true;
      };
    },
    filters:{
      formatState(num){
        switch (num*1) {
          case 0:
            return "系统创建";
            break;
          case 2:
            return "用户创建";
            break;
          default:
            return "未知";
            break;
        }
      },
      formatFlag(num){
        switch (num*1) {
          case 0:
            return "未解散";
            break;
          case 1:
            return "已解散";
            break;
          default:
            return "未知";
            break;
        }
      },
      groupFriendState(num){
        switch (num*1) {
          case 0:
            return "已入群";
            break;
          case 1:
            return "已退群";
            break;
          default:
            return "未知";
            break;
        }
      }
    },
    methods: {

      //获取微信好友
      getHandleWxFriends(row){
        this.rigthUserId = row.wxUserId;
        this.handlewxFriends(row.wxUserId);
      },
      //表格多选
      selectionChange(val){
         let ids=[];
         let _this = this;
        //  if(val.length!=0){
            // this.checkValue = val;
        //  }
          // if(this.manualFriendsMax>this.checkValue.length){
            // for(let i=0;i<this.checkValue.length;i++){
            //   ids.push(this.checkValue[i].contactWxUserName)
            // };
          // }else{
          //   this.$refs.rightTable.clearSelection();
          //   for(let i=0;i<this.manualFriendsMax;i++){
          //     ids.push(val[i].contactWxUserName);
          //     _this.$refs.rightTable.toggleRowSelection(this.checkValue[0],true);
          //   };
          // }
           for(let i=0;i<val.length;i++){
              ids.push(val[i].contactWxUserName)
            };
        this.checkedFriends2 = val ? ids : [];
        this.isIndeterminate1 = false;
      },
      searchList(){
        this.page = 1;
        if(this.searchForm.searchDate!=null){
          this.startTime = this.searchForm.searchDate[0];
          this.endTime = this.searchForm.searchDate[1];
        }else{
          this.startTime = "";
          this.endTime = "";
        }
        this.getGroupList();
      },
      //刷新群信息
      refreshGroupInfo(){
        let _this=this;
        let parmas={
          chatroomId:_this.roomUserName,
          type:1
        };
        let data = {
          taskTemplateName: "更新群信息",
          planParams:JSON.stringify(parmas),
          wxIds:_this.wxUserId
        };
        let str = {
          param: JSON.stringify(data)
        };
        _this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 0) {
            _this.$message.success('发起刷新任务');
            _this.hideDialog();
            _this.getGroupList();
          } else {
            _this.$message.warning(res.data.error_message);
          }
        })
      },
      //转让群主取消回调
      launchCancel(){
        this.checkItem={};
        this.checkIndex=-1;
        this.checkUserName="";
        this.hideDialog();
      },
      //选择转让给谁
      checkLaunch(item,index){
         this.checkItem=item;
         this.checkIndex=index;
      },
      //编辑群公告字数限制
      noticeChange(e){
        this.anouncementTotal=e.target.value.length;
        if(this.anouncementTotal<=this.anouncementMax){
          this.anouncementTotal=this.anouncement.length;
          this.anouncement=e.target.value;
        }else{
          this.anouncementTotal=this.anouncementMax;
          this.anouncement=e.target.value.substring(0,this.anouncementMax);
        }
      },
      //获取二维码
      getCode(qrcodeImg) {
        let qrcode = new QRCode("qrcode", {
          width: 200, // 设置宽度，单位像素
          height: 200, // 设置高度，单位像素
          text: qrcodeImg // 设置二维码内容或跳转地址
        });
      },
      //重新获取二维码
      resaveCode(){
        let _this=this;
        let parmas={
          chatroomId:_this.roomUserName,
          type:1
        };
        let data = {
          taskTemplateName: "更新群信息",
          planParams:JSON.stringify(parmas),
          wxIds:_this.wxUserId
        };
        let str = {
          param: JSON.stringify(data)
        };
        _this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 0) {
            //let link=res.data.data.roomQrcode;
            _this.$message.success('正在获取二维码,请稍后再试...');
            _this.hideDialog();
            _this.getGroupList();
            //_this.getCode(link);
          } else {
            _this.$message.warning(res.data.error_message)
          }
        })
      },
      handleCheckAllChange1(val) {
        let ids=[];
            // if(this.manualFriendsMax>this.friendsList1.length){
            //   for(let i=0;i<this.friendsList1.length;i++){
            //     ids.push(this.friendsList1[i].wxUserId)
            //   };
            // }else{
            //   for(let i=0;i<this.manualFriendsMax;i++){
            //     ids.push(this.friendsList1[i].wxUserId)
            //   };
            // }
        for(let i=0;i<this.friendsList1.length;i++){
                ids.push(this.friendsList1[i].wxUserId)
              };
        this.checkedFriends1 = val ? ids : [];
        this.isIndeterminate1 = false;
      },
      handleCheckedCitiesChange1(value) {
        let checkedCount = value.length;
        this.checkAll1 = checkedCount === this.friendsList1.length;
        this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.friendsList1.length;
      },
      noticeCallback(){
        let _this=this;
        if(_this.isGroupOwner){
          if(_this.editNotice){
            if(_this.anouncement==""){
              _this.$message.warning("群公告不能为空!");
              return;
            };
            if(_this.anouncement.length>200){
              _this.$message.warning("群公告字数不能超过200!");
              return;
            };
            let parmas={
              announcement:_this.anouncement,
              chatroomId:_this.roomUserName,
              type:1
            };
            let data = {
              taskTemplateName: "设置群公告",
              planParams:JSON.stringify(parmas),
              wxIds:_this.wxUserId
            };
            let str = {
              param: JSON.stringify(data)
            };
            this.$http('plan/start_plan','POST',str).then(res=>{
              if(res.data.error_code == 0) {
                _this.$message.success('公告编辑成功');
                _this.hideDialog();
                _this.getGroupList();
                _this.editNotice=false;
                _this.anouncement="";
              } else {
                _this.$message.warning(res.data.error_message)
              }
            })
          }else{
            _this.editNotice=true;
            _this.sureText="保 存";
          }
        }else{
          _this.hideDialog();
        }
      },
      noticeCancelCallback(){
        this.hideDialog();
        this.editNotice=false;
      },
      initList(){
        this.page=1;
        this.getGroupList();
      },
      transfer(val){ // 转让选择群内人员
        this.groupMembers.map((item)=>{
          if(item.wxContactId == val.wxContactId){
            this.tranforWxuserName = val.wxContactId
          } else {
            item.checked = false
          }
        })
      },
      changeUpload(file) { // 上传选择事件
        let _this=this;
        _this.imgfile = file;
        // _this.imageUrl = URL.createObjectURL(file.raw);
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload=function(){
          _this.imageUrl = reader.result
        };
      },
      handleAvatarSuccess(res, file) { // 上传成功回调
        // this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) { // 上传之前判断
      },
      getObjectURL(file) { // 转换file为url
        var url = null;
        if (window.createObjectURL != undefined) {
          // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
          // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      judgeExpired(item){ //判断二维码是否过期
          let qrcodeRefreshTime=item.qrcodeRefreshTime;
          let time=new Date().getTime()-new Date(item.qrcodeRefreshTime).getTime();
          this.temporaryDays=Math.floor(time/1000/24/60/60);
          this.expireFlag=(7-this.temporaryDays)>0?false:true;
          this.expire=this.expireFlag;
      },

      showModel(type, title,item) { // 显示弹框
        let _this=this;
        switch (type) {
          case "invite":
            _this.showDialog(type,title);
            _this.qrcodeImgUrl = item.roomQrcode;
            let obj={};
            obj.wxUsername = item.roomOwner;
            _this.leftTableFirst=obj;
            _this.manualFriendsMax =40;
            if(item.memberCount>=40){
              this.manualFriendsMax = 0;
            }else{
              this.manualFriendsMax = this.manualFriendsMax-item.memberCount;
              if(this.manualFriendsMax<0){
                this.manualFriendsMax=0;
              }
            }
            this.judgeExpired(item);
            this.leftTableData=[];
            this.rightTableData=[];
            break;
          case "launch":
            _this.$http('task_chatroom/chatroom_member','GET',{
              roomUserName:item.roomUserName,
              type:0
            }).then(res=>{
              if(res.data.error_code == 0) {
                this.chatList = res.data.data.result;
                _this.showDialog(type,title)
              } else {
                _this.$message.error(res.data.error_message);
              }
            });
            break;
          case "detail":
            _this.$http('task_chatroom/chatroom_member','GET',{
              roomUserName:item.roomUserName
            }).then(res=>{
              if(res.data.error_code == 0) {
                this.detailTableData = res.data.data.result;
                this.ownerResult['chatroomMermberCount']=res.data.data.chatroomMermberCount;
                this.ownerResult['outChatroomMermberCount']=res.data.data.outChatroomMermberCount;
                this.ownerResult['ownerNickName']=res.data.data.ownerNickName;
                this.ownerResult['ownerWxusername']=res.data.data.ownerWxusername;
                _this.showDialog(type,title,false)
              } else {
                _this.$message.error(res.data.error_message);
              }
            });
            break;
          case 'notice':
            let noticeFlag=item.groupOwner*1;
            if(item.creatorWxId==item.roomOwner){
              _this.anouncementTotal = item.anouncement.length;
              _this.sureText="编 辑";
            }else{
              _this.sureText="确 定";
            }
            _this.showDialog(type,title,false);
            break;
          case 'qrcode':
            let qrcodeImg = item.roomQrcode;
            _this.judgeExpired(item);
            _this.showDialog(type,title);
            if(!this.expireFlag){
              _this.$nextTick(() => {
                _this.getCode(qrcodeImg);
              });
              _this.expireDays=7-this.temporaryDays;
            };
            break;
          case 'exit':
            let flag=item.groupOwner*1;
            if(flag==1){
              _this.$store.dispatch("showDialog",{
                title: "退出群聊",
                content:"你当前是群主,是否强制退出并解散群聊？",
                showCancel:true,
                flag: "exit"
              });
            }else{
              _this.$store.dispatch("showDialog",{
                title: "退出群聊",
                content:"是否退出群聊？",
                showCancel:true,
                flag: "exit"
              });
            }
            break;
          default:
            _this.showDialog(type,title);
            break;
        }
        _this.chatroomId=item.chatroomId;
        _this.wxUserId=item.wxUserId;
        _this.anouncement=item.anouncement;
        _this.roomUserName=item.roomUserName;
        _this.memberCount=item.memberCount;
        _this.isGroupOwner=item.roomOwner==item.creatorWxId?true:false;
      },
      imageCover() { // 转换二维码
        let  _this = this;
        if(_this.imgfile==""){
          _this.$message.warning("请上传二维码!");
          return;
        };
        qrcode.decode(_this.getObjectURL(_this.imgfile.raw));
        qrcode.callback = function(imgMsg) {
          if(imgMsg.indexOf("https://weixin.qq.com/g")!=-1){
            let param = {
              mainPage:imgMsg,
              type:1
            };
            let data = {
              taskTemplateName: "扫码进群",
              planParams: JSON.stringify(param),
              wxIds: _this.wxUserId
            };
            let str = {
              param: JSON.stringify(data)
            };
            _this.$http('plan/start_plan','POST',str).then(res=>{
              if(res.data.error_code == 0) {
                _this.$message.success('群二维码上传成功');
                _this.imgfile="";
                _this.imageUrl="";
                _this.hideDialog();
                _this.getGroupList();
              } else {
                _this.$message.warning(res.data.error_message)
              }
            })
          }else{
            _this.$message({
              message:'请上传有效的群二维码',
              type: 'error'
            })
          }
        };
      },
      hideModel() { // 隐藏
        this.$store.dispatch('hideDialog')
        this.imageUrl = ''
        this.dismissMessage = ''
      },
      createCallback() { // 建群Dialog 确认按钮
        this.$store.dispatch('hideDialog')
      },
      handleCurrentChange(val) {//分页
        this.page = val;
        this.getGroupList();
      },
      handleSelectionChange(val) { // 表格全选
        let ids=[];
        val.map((v,k)=>{
          ids.push(v.wxUserId);
        });
        this.wxUserId=ids.join();
      },
      showDialog(type,title,flag) {// 显示事件
        this.$store.dispatch("showDialog", {
          title: title,
          showCancel: !isNaN(flag)?flag:true,
          flag: type
        });
      },
      hideDialog(){
        this.$store.dispatch('hideDialog');
      },
      selectEve(selection, row) { // 全选
        let _this = this;
        _this.selectedList = selection;
      },
      getGroupList(type) {//  列表
        this.loading = true;
        let searchForm=this.searchForm;
        let userId=sessionStorage.getItem('user_id')*1;
        let parmas={
          length: 10,
          pageNo: this.page,
          userId:userId
        };
        if(searchForm.roomName){
          parmas.roomName=searchForm.roomName;
        };
        if(searchForm.wxUserName){
          parmas.wxUserName=searchForm.wxUserName;
        };
        if(this.startTime){
          parmas.startTime = this.startTime;
          parmas.endTime = this.endTime;
        }
        // let arr=["CREATE_ROOM_FOR_USER_"   +  userId];
        // this.$redis.string.get(arr).then((res)=>{
        //   if (res.data.error_code == 0) {
        //     let result=res.data.data.list[0].value||[];
        //     this.loading = false;
        //     //this.total = res.data.data.totalCount;
        //     this.groupList = result;
        //   }else{
        //     this.$message.error(res.data.error_message);
        //   }
        // });
        this.$http("task_chatroom/chatroom_task_list", "POST", parmas).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            this.total = res.data.data.totalCount;
            this.groupList = res.data.data.result;
          }else{
            this.$message.error(res.data.error_message);
          }
        }).catch((err)=>{
          this.$message.error("获取列表失败");
        });
      },
      dismissGroup() { // 解散群
        let param = {};
        // param.chatRoomId = 0
        param.textMessage = this.dismissMessage;
        param.type = 1;
        let paramInfo = JSON.stringify(param);
        let data = {
          taskTemplateName: "解散群",
          planParams: paramInfo
        };
        let str = {
          param: JSON.stringify(data)
        };
        this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 400) {
            this.$message.warning(res.data.error_message)
          } else {
            this.$message.success('解散成功')
          }
        })
      },
      retreatGroup() { // 退群
        this.$confirm('您确认要退出此群吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
              let param = {
                chatroomId:this.roomUserName,
                type:1
              };
              let data = {
                taskTemplateName: "退群",
                planParams: JSON.stringify(param),
                wxIds: this.wxUserId
              };
              let str = {
                param: JSON.stringify(data)
              };
              this.$http('plan/start_plan','POST',str).then(res=>{
                if(res.data.error_code == 0) {
                  this.$message.success('退群成功');
                  this.hideDialog();
                  this.getGroupList();
                } else {
                  this.$message.warning(res.data.error_message)
                }
              })
          }).catch((err) => {
             this.$message.warning(err)
        });
      },
      transferGroup() { // 转让群
        if(this.chatList.length<2){
          this.$message.warning("群成员少于3人不能转让");
          return;
        };
        if(this.checkUserName==''){
          this.$message.warning("请选择需要转让的群成员")
          return;
        };
        let param = {
          wxid:this.checkUserName,
          chatroomId:this.roomUserName,
          type:1
        };
        let data = {
          taskTemplateName: "设置群主",
          planParams: JSON.stringify(param),
          wxIds: this.wxUserId
        };
        let str = {
          param: JSON.stringify(data)
        };
        this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 0) {
            this.$message.success('转让成功');
            this.hideDialog();
            this.getGroupList();
          } else {
            this.$message.warning(res.data.error_message)
          }
        })
      },
      //邀请入群取消回调
      cancelManualGroup(){
        this.checkedFriends1=[];
        this.checkAll1=false;
        this.isIndeterminate1=false;
        this.steps="";
        this.selectManualGroup="platform";
        this.hideDialog();
      },
      handlewxFriends(xuserId){
        this.$http('task_chatroom/notexist_chatroom_contacts','POST',{
              roomUserName:this.roomUserName,
              userId:Number(this.userId),
              wxUserId:xuserId
            }).then(res=>{
              if(res.data.error_code==0){
                  this.rightTableData=res.data.data;
              }else{
                this.$message.error(res.data.error_message)
              }
            }).catch(err=>{
              this.$message.error(err)
            })
      },
      manualGroup(){ // 邀请入群
        if(!this.steps){
          this.steps="firstStep";
          //邀请入群（平台微信号）
          if(this.selectManualGroup=='platform'){
            this.$http('task_chatroom/notexist_chatroom_wxusers','GET',{
              roomUserName:this.roomUserName,
              userId:Number(this.userId),
              wxUserType:0
            }).then(res=>{
              if(res.data.error_code==0){
                  this.friendsList1=res.data.data;
              }else{
                this.$message.error(res.data.error_message)
              }
            }).catch(err=>{
              this.$message.error(err)
            })
          }else if(this.selectManualGroup=="wxfriends"){  //邀请入群（微信好友）
             this.$http('task_chatroom/notexist_chatroom_wxusers','GET',{
              roomUserName:this.roomUserName,
              userId:Number(this.userId),
              wxUserType:1
            }).then(res=>{
              if(res.data.error_code==0){
                  this.leftTableData=res.data.data;
                  if(this.leftTableData.length>0){
                    this.rigthUserId = res.data.data[0].wxUserId;
                    this.handlewxFriends(res.data.data[0].wxUserId)
                  }
              }else{
                this.$message.error(res.data.error_message)
              }
            }).catch(err=>{
              this.$message.error(err)
            })
          }
        }else if(this.steps=='firstStep'&&this.selectManualGroup=='platform'){
          if(this.checkedFriends1.length==0){
              this.$message.warning("至少选择1个好友");
              return;
          };
          if(this.checkedFriends1.length+this.memberCount>500){
            this.$message.warning("群人数不能超过500");
            return;
          };
          let param = {
            mainPage:this.qrcodeImgUrl,
            type:1
          };
          let data = {
            taskTemplateName: "扫码进群",
            planParams: JSON.stringify(param),
            wxIds: this.checkedFriends1.join(',')
          };
          let str = {
            param: JSON.stringify(data)
          };
          if(this.expire){
            this.$message.warning("群二维码已过期，请重新获取");
          }else{
            this.$http('plan/start_plan','POST',str).then(res=>{
              if(res.data.error_code == 0) {
                this.$message.success('邀请成功');
                this.checkedFriends1=[];
                this.checkAll1=false;
                this.isIndeterminate1=false;
                this.steps="";
                this.selectManualGroup="platform";
                this.hideDialog();
                this.getGroupList();
              } else {
                this.$message.warning(res.data.error_message)
              }
            })
          }


        } else if(this.steps=='firstStep'&&this.selectManualGroup=='wxfriends'){
          if(this.checkedFriends2.length==0){
              this.$message.warning("至少选择1个好友");
              return;
          };
          if(this.checkedFriends2.length+this.memberCount>500){
            this.$message.warning("群人数不能超过500");
            return;
          };
          let param = {
            roomId:this.roomUserName,
            wxids:this.checkedFriends2,
            type:1
          };
          let data = {
            taskTemplateName: "添加群成员",
            planParams: JSON.stringify(param),
            // wxIds: this.wxUserId
            wxIds: this.rigthUserId
          };
          let str = {
            param: JSON.stringify(data)
          };
          this.$http('plan/start_plan','POST',str).then(res=>{
            if(res.data.error_code == 0) {
              this.$message.success('邀请成功');
              this.checkedFriends2=[];
              this.checkAll1=false;
              this.isIndeterminate1=false;
              this.steps="";
              this.selectManualGroup="platform";
              this.hideDialog();
              this.getGroupList();
            } else {
              this.$message.warning(res.data.error_message)
            }
          })
        }
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #newGroupList {
    position: relative;
    .init-dialog {
      .type-1 {
        padding: 30px 0;
        .qrcode {
          width: 200px;
          height: 200px;
          display: block;
          margin: 0 auto;
        }
      }
      .type-2 {
        padding: 30px 0 50px;
        .table-list {
          width: 400px;
          border: solid 1px #eee;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          .row {
            display: flex;
            text-align: center;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            align-items: center;
          }
          .t-head {
            border-bottom: solid 1px #eee;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
          }
          .name,
          .phone {
            flex: 1;
            color: #666;
          }
          .line {
            position: absolute;
            width: 1px;
            background-color: #eee;
            height: 100%;
            left: 50%;
            top: 0;
            transform: tranlate3d(-50%, 0, 0);
            z-index: 99999;
          }
          .t-body {
            height: 300px;
            overflow-y: auto;
            ul {
              padding: 5px 0;
            }
          }
        }
      }
      .type-3 {
        .tip {
          font-size: 14px;
          color: #666;
          line-height: 1em;
          margin: 40px 0 30px;
          text-align: center;
        }
        .text-box {
          padding: 0 120px;
          overflow: hidden;
          margin-bottom: 40px;
        }
      }
    }
    .qrCodeimg img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .tableContent{
      // width:175px;
      height: 300px;
      overflow: hidden;
      margin: 0 auto;
    }
    .dismissWidth{
      width:500px;
    }
    #qrcode{
      display: inline-block;
      text-align: center !important;
    }
    .dialog-content{
      .selectManualGroup{
        height: 210px;
        line-height: 240px;
      }
      .notice{
        text-align: left;
        min-height: 280px;
        padding: 20px 0;
        position: relative;
        p{
          font-size: 14px;
          line-height: 20px;
        }
        textarea{
          display: block;
          width: 100%;
          height: 220px;
          line-height: 20px;
          color:#333;
          border:solid 1px #eee;
          padding:10px;
          box-sizing: border-box;
          font-size: 14px;
        }
        textarea::placeholder{
          font-size: 14px;
        }
        textarea.disabled{
          background-color:rgb(249, 247, 247);
        }
        .total{
          position: absolute;
          right: 5px;
          bottom: 45px;
          font-size: 14px;
        }
      }
      .create{
        text-align: left;
        .user-list{
          height: 240px;
          overflow: hidden;
          .add-new{
            color:#409eff;
            margin-left: 5px;
          }
        }
        p.null{
          font-size: 14px;
          text-align: center;
          line-height: 100px;
        }
        p.np{
          font-size: 14px;
          margin-top: 5px;
          line-height: 20px;
          color:#f00;
          visibility: hidden;
        }
        p.show-note{
          visibility: visible;
        }
        .launch-list{
          height: 240px;
          overflow: hidden;
          border:solid 1px #eee;
          padding:10px;
          box-sizing: border-box;
          user-select: none;
          .item{
            font-size: 14px;
            margin:8px 0;
            cursor: pointer;
            padding:0 5px;
          }
          .item.active{
            color:#57aaff;
          }
        }
      }

      .groupCreate{
        height: 330px;
        text-align: left;
         .el-table--border{
             width: 360px;
          display: inline-block;
          vertical-align: top;
        }
        .el-table--border:first-child{
          width: 124px;
          display: inline-block;
          vertical-align: top;
        }
        .edit-btn{
          padding: 0;
        }
      }
      .detail{
        text-align: left;
        .group-owner{
          line-height: 40px;
          font-size: 12px;
          margin: 10px 0;
          span{
            width: 24%;
            display: inline-block;
            text-align: right;
          }
        }
        .tab-list{
          display: flex;
          span{
            flex:1;
            text-align: center;
            font-size: 14px;
            border:solid 1px #eee;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            margin-left: -1px;
            cursor: pointer;
            user-select: none;
          }
          span.active{
            background-color: #57aaff;
            color:#fff;
          }
        }
        .header-img{
          display: block;
          width: 40px;
          height: 40px;
          object-fit: cover;
          margin:5px 0;
        }
        .ele-table-init{
          margin-top: 0;
        }
      }
      .qrcode-info{
        padding:30px 0 60px 0;
        p{
          font-size: 14px;
          line-height: 30px;
        }
        .note{
          line-height: 200px;
        }
      }
    }
    .rightTable{
      .el-table td, .el-table th.is-leaf:last-child{
        border-bottom: none;
      }
    }
  }
</style>
