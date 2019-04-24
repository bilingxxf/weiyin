<template>
  <div id="group" class="main-body">
    <div class="main-wrapper">
      <!--<div class="flex-total">-->
        <!--<div class="item">-->
          <!--<div class="number">{{groupTotal}}</div>-->
          <!--<p>群数量</p>-->
        <!--</div>-->
        <!--<div class="item">-->
          <!--<div class="number">{{groupPersonTotal}}</div>-->
          <!--<p>群内成员数量</p>-->
        <!--</div>-->
      <!--</div>-->
      <div class="info_wrapper">
        <div class="page-title">
          <span>群管理</span>
        </div>
        <div class="search-content" style="margin-bottom:20px;">
          <div class="left">
            <el-select
                size="small"
                class="ele-select"
                v-model="searchForm.selectChildAccountId"
                placeholder="所属账号"
                clearable
                @change="initList"
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
            <el-select
              size="small"
              class="ele-select"
              v-model="searchForm.groupName"
              placeholder="请选择分组"
              clearable
              @change="initList"
            >
              <el-option label="所属分组" value=""></el-option>
              <el-option
                v-for="item in accountGroups"
                :key="item.value"
                :label="item.wx_user_group_name"
                :value="item.wx_user_group_name"
              ></el-option>
            </el-select>
            <el-input
              class="ele-input"
              @change="initList"
              placeholder="请输入微信昵称"
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
        <div class="edit-group">
          <span>批量操作：</span>
          <span class="edit-btn" @click="groupEdit('upload','扫码进群')">扫码进群</span>
          <span class="edit-btn" @click="getGroupList">刷新列表</span>
          <!--<span class="edit-btn" @click="groupEdit('exit','removeGroup')">退出群聊</span>-->
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
            <!--<el-table-column width="30" fixed></el-table-column>-->
            <!-- <el-table-column type="selection" fixed></el-table-column> -->
            <el-table-column type="selection" fixed  :selectable='checkboxInit'>
            </el-table-column>

            <el-table-column label="序号" align="left" width="60">
              <!-- <template slot-scope="scope">{{scope.$index+1}}</template> -->
              <template slot-scope="scope">
                <span>{{scope.$index+(page - 1) * pageSize + 1}} </span>
              </template>
            </el-table-column>
             <el-table-column prop="userName" label="所属账号" align="left" width="100"  v-if="accountType">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.userName" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.userName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="wxUsername" label="微信号" align="left" width="120">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.wxUsername" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.wxUsername}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="nickName" label="微信昵称" align="left" width="120">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.nickName" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.nickName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="群二维码" align="center" width="100">
              <template slot-scope="scope">
                 <img v-if="scope.row.roomQrcode!=''" src="../../assets/erweima.png" height="25" @click="showModel('qrcode','群二维码',scope.row)">
              </template>
            </el-table-column>
            <el-table-column prop="roomName" label="群名称" align="left" width="120">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.roomName" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.roomName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="群主" align="left" width="60">
              <template slot-scope="scope">
                <span>{{scope.row.groupOwner|formatFlag}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="memberCount" label="群内人数" align="left" width="90"></el-table-column>
            <el-table-column prop="currenContactCount" label="今日新增未入群" align="left" width="120"></el-table-column>
            <el-table-column label="状态" align="left" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.status|formatState}}</span>
              </template>
            </el-table-column>
            <el-table-column label="入群时间" align="left" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.enterTime=='1999-01-01 00:00:00'?'':scope.row.enterTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.status==0||scope.row.status==1" class="edit-btn" @click="showModel('upload','扫码进群',scope.row)">扫码进群</el-button>
                <el-button type="text" v-if="scope.row.status==0||scope.row.status==1" class="edit-btn" @click="showModel('create','发起群聊',scope.row)">发起群聊</el-button>
                <el-button type="text" v-if="scope.row.status==3&&scope.row.groupOwner==1" class="edit-btn" @click="showModel('launch','转让群主',scope.row)">转让群主</el-button>
                <el-button type="text" v-if="scope.row.status==3" class="edit-btn" @click="showModel('notice','群公告',scope.row)">群公告</el-button>
                <el-button type="text" v-if="scope.row.status==3" class="edit-btn" @click="showModel('invite','邀请入群',scope.row)">邀请入群</el-button>
                <el-button type="text" v-if="scope.row.status==3" class="edit-btn" @click="showModel('exit','退出群聊',scope.row)">退出群聊</el-button>
                <el-button type="text" v-if="scope.row.status==3" class="edit-btn" @click="showModel('detail','详情',scope.row)">详情</el-button>
                <el-button type="text" v-if="scope.row.status==3" class="edit-btn" @click="showModel('refresh','刷新',scope.row)">刷新</el-button>
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
    <!--建群-->
    <Dialog @callback="createGroup" v-if="dialogFlag == 'create'" @cancelCallback="cancelCreateGroup">
      <div slot="content" class="dialog-content" style="padding:10px 0 40px 0">
          <div class="create">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" v-if="friendsList.length!=0" @change="handleCheckAllChange">全部选择</el-checkbox>
            <div class="user-list">
              <el-scrollbar class="scroll-bar" v-if="friendsList.length!=0">
                <el-checkbox-group :min="0" :max="40" v-model="checkedFriends" @change="handleCheckedCitiesChange">
                  <div class="friend-item" v-for="(friend,index) in friendsList" :key="index"><el-checkbox :label="friend.contact_wxuser_name" :key="friend.contact_wxuser_name">{{friend.contact_wxuser_name+'（'+friend.nick_name+'）'}}</el-checkbox></div>
                </el-checkbox-group>
              </el-scrollbar>
              <p class="null" v-else>无好友数据</p>
            </div>
            <p class="np" :class="[{'show-note':checkAll&&checkedFriends.length>=createMax}]">系统发起群聊人数不能超过{{createMax}}人,默认选择前{{createMax}}个好友</p>
          </div>
      </div>
    </Dialog>
    <!--邀请入群-->
    <Dialog @callback="manualGroup" v-if="dialogFlag == 'invite'" @cancelCallback="cancelManualGroup">
      <div slot="content" class="dialog-content" style="padding:10px 0 40px 0">
        <div class="create">
          <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" style="line-height:20px;" v-if="friendsList1.length!=0" @change="handleCheckAllChange1">全部选择</el-checkbox>
          <div class="user-list">
            <el-scrollbar class="scroll-bar" v-if="friendsList1.length!=0">
              <el-checkbox-group :min="0" :max="500" v-model="checkedFriends1" @change="handleCheckedCitiesChange1">
                <div class="friend-item" v-for="(friend,index) in friendsList1" :key="index"><el-checkbox :label="friend.contact_wxuser_name" :key="friend.contact_wxuser_name">{{friend.contact_wxuser_name+'（'+friend.nick_name+'）'}}<span class="add-new" v-if="friend.isToday==1">今日新增</span></el-checkbox></div>
              </el-checkbox-group>
            </el-scrollbar>
            <p class="null" v-else>无好友数据</p>
          </div>
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
              <!--<div class="item" :class="[{'active':index==checkIndex}]" v-for="(item,index) in chatList" :key="index" @click="checkLaunch(item,index)">{{item.wxUsername+'（'+item.nickName+'）'}}</div>-->
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
          <textarea placeholder="请输入群公告" :class="[{'disabled':!editNotice}]"  v-show="anouncement!=''||editNotice" v-model="anouncement" @input="noticeChange" :disabled="!editNotice"></textarea>
          <span v-show="editNotice" class="total">{{anouncementTotal}}/{{anouncementMax-anouncementTotal}}</span>
        </div>
      </div>
    </Dialog>
    <Dialog v-if="dialogFlag=='detail'">
      <div slot="content" class="dialog-content" style="padding:0 0 40px 0">
        <div class="detail">
          <div class="group-owner">群主：{{ownerResult.ownerWxusername+'（'+ownerResult.ownerNickName+'）'}}</div>
            <!--<div class="tab-list">-->
              <!--<span :class="[{'active':tabIndex==index}]" v-for="(tab,index) in tabList" @click="toggleTab(index)">{{tab}}</span>-->
            <!--</div>-->
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
                <el-table-column label="头像" width="60">
                  <template slot-scope="scope">
                    <img :src="scope.row.smallHead" class="header-img">
                  </template>
                </el-table-column>
                <el-table-column
                  prop="wxUsername"
                  label="微信号">
                   <template slot-scope="scope">
                    <el-tooltip
                      :open-delay="350"
                      :content="scope.row.wxUsername"
                      placement="bottom-end"
                      effect="light"
                      :offset="80"
                    >
                      <p class="writeWrapper">{{scope.row.wxUsername}}</p>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nickName"
                  label="微信昵称">
                   <template slot-scope="scope">
                    <el-tooltip
                      :open-delay="350"
                      :content="scope.row.nickName"
                      placement="bottom-end"
                      effect="light"
                      :offset="80"
                    >
                      <p class="writeWrapper">{{scope.row.nickName}}</p>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <!--<el-table-column-->
                  <!--prop="address"-->
                  <!--label="邀请人微信号">-->
                   <!--<template slot-scope="scope">-->
                    <!--<el-tooltip-->
                      <!--:open-delay="350"-->
                      <!--content="{scope.row.address}"-->
                      <!--placement="bottom-end"-->
                      <!--effect="light"-->
                      <!--:offset="80"-->
                    <!--&gt;-->
                      <!--<span slot="content">{{scope.row.address}}</span>-->
                      <!--<p class="writeWrapper">{{scope.row.address}}</p>-->
                    <!--</el-tooltip>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="address"-->
                  <!--label="邀请人昵称">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-tooltip-->
                      <!--:open-delay="350"-->
                      <!--content="{scope.row.address}"-->
                      <!--placement="bottom-end"-->
                      <!--effect="light"-->
                      <!--:offset="80"-->
                    <!--&gt;-->
                      <!--<span slot="content">{{scope.row.address}}</span>-->
                      <!--<p class="writeWrapper">{{scope.row.address}}</p>-->
                    <!--</el-tooltip>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="address"-->
                  <!--width="80"-->
                  <!--label="入群时间">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-tooltip-->
                      <!--:open-delay="350"-->
                      <!--content="{scope.row.address}"-->
                      <!--placement="bottom-end"-->
                      <!--effect="light"-->
                      <!--:offset="80"-->
                    <!--&gt;-->
                      <!--<span slot="content">{{scope.row.address}}</span>-->
                      <!--<p class="writeWrapper">{{scope.row.address}}</p>-->
                    <!--</el-tooltip>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              </el-table>
              <!--<div class="pagination" v-if="detailTotal!=0">-->
                <!--<el-pagination-->
                  <!--@current-change="handleCurrentChange"-->
                  <!--:current-page="detailTotalPage"-->
                  <!--:page-size="detailTotalPageSize"-->
                  <!--layout="total, prev, pager, next"-->
                  <!--:total="detailTotal"-->
                <!--&gt;</el-pagination>-->
              <!--</div>-->
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
          wxUserName:""
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
        expireDays:0
      };
    },
    computed: {
      ...mapState(["dialogFlag"])
    },
    mounted() {
      this.getGroupList();
      this.getAccoutGroup();
      this.username = sessionStorage.getItem("username")
      this.userId = sessionStorage.getItem("user_id");
      if(sessionStorage.getItem('indentity')==='ROLE_USER'){
        this.accountType=true;
        this.getChildAccountList();
      };
    },
    filters:{
      formatState(num){
        switch (num*1) {
          case 0:
            return "初始化";
            break;
          case 1:
            return "未加入";
            break;
          case 2:
            return "待加入";
            break;
          case 3:
            return "已加入";
            break;
          case 4:
            return "待退出";
            break;
          default:
            return "未加入";
            break;
        }
      },
      formatFlag(num){
        switch (num*1) {
          case 0:
            return " ";
            break;
          case 1:
            return "是";
            break;
          case 2:
            return "否";
            break;
        }
      }
    },
    methods: {
      checkboxInit(row,index){
      if (row.status==1||row.status==0) {//你需要判断的条件
        return 1;//可勾选
      }else{
        return 0;//不可勾选
      }
    },

      //刷新群信息
      refreshGroupInfo(){
        let _this=this;
        let parmas={
          chatroomId:_this.roomUserName
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
            _this.$message.warning(res.data.error_message)
          }
        })
      },
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
      //详情切换选项卡
      toggleTab(index){
        this.tabIndex=index;
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
      //获取分组列表
      getAccoutGroup(){
        this.$http("wx_group/group_list","POST",{
          limit: 99999,
          page: 1
        }).then((res)=>{
          if(res.data.error_code==0){
            this.accountGroups=res.data.data.result;
          }
        })
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
          chatroomId:_this.roomUserName
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
      handleCheckAllChange(val) {
        let ids=[];
        for(let i=0;i<this.createMax;i++){
          if(this.friendsList[i]){
            ids.push(this.friendsList[i].contact_wxuser_name)
          }else{
            break;
          }
        };
        this.checkedFriends = val ? ids : [];
        this.isIndeterminate = false;
      },
      handleCheckAllChange1(val) {
        let ids=[];
        for(let i=0;i<this.friendsList1.length;i++){
          ids.push(this.friendsList1[i].contact_wxuser_name)
        };
        this.checkedFriends1 = val ? ids : [];
        this.isIndeterminate1 = false;
      },
      handleCheckedCitiesChange(value) {
        if(value.length>=this.createMax){
          let friends=[];
          for(let i=0;i<this.createMax;i++){
            friends.push(value[i])
          };
          this.checkedFriends = friends;
          let checkedCount=this.checkedFriends.length;
          this.checkAll = checkedCount === this.createMax;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.createMax;
        }else{
          let checkedCount=value.length;
          this.checkAll = checkedCount === this.friendsList.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.friendsList.length;
        }
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
              chatroomId:_this.roomUserName
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
            this.editNotice=true;
            this.sureText="保 存";
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
      selectFriend(val){ // 好友选择
        this.friendNumber = []
        val.map((item)=>{
          this.friendNumber.push(item.wx_user_name)
        })
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
      groupEdit(type,title){
        let _this=this;
        if(this.wxUserId==""){
          this.$message.warning("请选择要操作的数据");
          return;
        };
        _this.showDialog(type,title);
      },
      showModel(type, title,item) { // 显示弹框
        let _this=this;
        switch (type) {
          case "create":
            this.$http('/contact_info','GET',{
              wxUserId:item.wxUserId,
              chatRoomId:item.chatroomId
            }).then(res=>{
              if(res.data.error_code == 0) {
                _this.friendsList = res.data.data;
                _this.showDialog(type,title)
              }else{
                _this.$message.error(res.data.error_message);
              }
            });
            break;
          case "invite":
            this.$http('/contact_info','GET',{
              wxUserId:item.wxUserId,
              chatRoomId:item.chatroomId
            }).then(res=>{
              if(res.data.error_code == 0) {
                let list=res.data.data;
                let aDate=new Date();
                let year=aDate.getFullYear();
                let month=aDate.getMonth()+1;
                let date=aDate.getDate();
                let today=year+"-"+month+"-"+date;
                let bDateTime=new Date(today).getTime();
                let ids=[];
                list.map((v,k)=>{
                  let time=new Date(v.pass_time).getTime();
                  if((time-bDateTime)>=0){
                    v.isToday=1;
                    ids.push(v.contact_wxuser_name);
                  }else{
                    v.isToday=0;
                  }
                });
                list.sort((a,b)=>{
                  return a.isToday>b.isToday?-1:1;
                });
                let checkedCount=ids.length;
                _this.checkedFriends1=ids;
                _this.checkAll1 = checkedCount === list.length;
                _this.isIndeterminate1 = checkedCount > 0 && checkedCount < list.length;
                _this.friendsList1 = list;
                _this.showDialog(type,title);
              }else{
                _this.$message.error(res.data.error_message);
              }
            });
            break;
          case "launch":
            _this.$http('chatroom/contact_list','POST',{
              wxChatroomId:item.chatroomId
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
            _this.$http('chatroom/contact_list','POST',{
              wxChatroomId:item.chatroomId
            }).then(res=>{
              if(res.data.error_code == 0) {
                this.detailTableData = res.data.data.result;
                this.ownerResult=res.data.data.ownerResult;
                _this.showDialog(type,title,false)
              } else {
                _this.$message.error(res.data.error_message);
              }
            });
            break;
          case 'notice':
            let noticeFlag=item.groupOwner*1;
            if(noticeFlag==1){
              _this.anouncementTotal = item.anouncement.length;
              _this.sureText="编 辑";
            }else{
              _this.sureText="确 定";
            }
            _this.showDialog(type,title,false);
            break;
          case 'qrcode':
            let qrcodeImg = item.roomQrcode;
            let qrcodeRefreshTime=item.qrcodeRefreshTime;
            let time=new Date().getTime()-new Date(item.qrcodeRefreshTime).getTime();
            let days=Math.floor(time/1000/24/60/60);
            let expireFlag=(7-days)>0?false:true;
            _this.expire=expireFlag;
            _this.showDialog(type,title);
            if(!expireFlag){
              _this.$nextTick(() => {
                _this.getCode(qrcodeImg);
              });
              _this.expireDays=7-days;
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
        _this.isGroupOwner=item.groupOwner==1?true:false;
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
              mainPage:imgMsg
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
        let userId=sessionStorage.getItem('user_id');
        let parmas={
          length: 10,
          pageNo: this.page,
          userId:userId
        };
        if(searchForm.groupName){
          parmas.groupName=searchForm.groupName;
        };
        if(searchForm.roomName){
          parmas.roomName=searchForm.roomName;
        };
        if(searchForm.wxUserName){
          parmas.wxUserName=searchForm.wxUserName;
        };
        if(searchForm.selectChildAccountId){
          parmas.childUserId = searchForm.selectChildAccountId;
        };
        this.$http("chatroom_wxuser", "POST", parmas).then(res => {
          if (res.data.error_code == 0) {
            this.loading = false;
            this.total = res.data.data.total_count;
            this.groupList = res.data.data.result;
          }else{
            this.$message.error(res.data.error_message);
          }
        }).catch((err)=>{
          this.$message.error("获取列表失败");
        });
      },
      //取消建群
      cancelCreateGroup(){
        this.checkedFriends=[];
        this.checkAll=false;
        this.isIndeterminate=false;
        this.hideDialog();
      },
      createGroup () { // 建群
        if(this.checkedFriends.length<2){
          this.$message.error("最少选择2位好友");
          return false;
        }
        let param = {
          friends:this.checkedFriends
        };
        let data = {
          taskTemplateName: "拉人建群",
          planParams: JSON.stringify(param),
          wxIds: this.wxUserId
        };
        let str = {
          param: JSON.stringify(data)
        };
        this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 0) {
            this.$message.success('群聊发起成功');
            this.checkedFriends=[];
            this.checkAll=false;
            this.isIndeterminate=false;
            this.hideDialog();
            this.getGroupList();
          } else {
            this.$message.warning(res.data.error_message)
          }
        })
      },
      getFriendList(parmas,callback){ // 点击建群获取好友列表
        let _this=this;
        this.$http('/contact_info','GET',parmas).then(res=>{
          if(res.data.error_code == 0) {
            this.friendsList = res.data.data;
            _this.callback&&_this.callback();
          }else{
            _this.$message.error(res.data.error_message);
          }
        }).catch((err)=>{
          console.log(err);
        })
      },
      dismissGroup() { // 解散群
        let param = {};
        // param.chatRoomId = 0
        param.textMessage = this.dismissMessage;
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
                chatroomId:this.roomUserName
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
          }).catch(() => {

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
          chatroomId:this.roomUserName
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
        this.hideDialog();
      },
      manualGroup(){ // 邀请入群
        if(this.checkedFriends1.length==0){
          this.$message.warning("至少选择1个好友");
          return;
        };
        if(this.checkedFriends1.length+this.memberCount>500){
          this.$message.warning("群人数不能超过500");
          return;
        };
        let param = {
          roomId:this.roomUserName,
          wxids:this.checkedFriends1
        };
        let data = {
          taskTemplateName: "添加群成员",
          planParams: JSON.stringify(param),
          wxIds: this.wxUserId
        };
        let str = {
          param: JSON.stringify(data)
        };
        this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 0) {
            this.$message.success('邀请成功');
            this.checkedFriends1=[];
            this.checkAll1=false;
            this.isIndeterminate1=false;
            this.hideDialog();
            this.getGroupList();
          } else {
            this.$message.warning(res.data.error_message)
          }
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #group {
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
      .detail{
        text-align: left;
        .group-owner{
          line-height: 40px;
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
  }
</style>
