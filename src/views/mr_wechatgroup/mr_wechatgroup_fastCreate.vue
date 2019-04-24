<template>
  <div id="group" class="main-body">
    <div class="main-wrapper">
      <div class="info_wrapper">
        <div class="page-title">
          <span>快速建群</span>
        </div>
        <div class="form-info">
          <ul>
            <li class="margin-t0">
              <div class="label">建群任务名称</div>
              <div class="info">
                <el-input class="ele-input" v-model="formInfo.taskName" ref="planName" @change="inputName($event)" placeholder="请输入任务名称" maxlength="30"></el-input>
              </div>
            </li>
            <li>
              <div class="label">群聊限制人数</div>
              <div class="info">
                <el-input class="ele-input" v-model="formInfo.defaultPserson" @change="inputPerson" placeholder="请输入群聊限制人数" maxlength="2"></el-input>
              </div>
            </li>
            <!-- <li>
              <span>建群限制次数</span><el-input class="ele-input" v-model="formInfo.maxTimes" @change="inputTimes" placeholder="请输入建群限制次数" maxlength="3"></el-input><span style="margin-left: 10px">单个微信号当日申请最大限制次数</span>
            </li> -->
            <li>
              <div class="label">群聊名称</div>
              <div class="info">
                <el-checkbox v-model="useChatName" style="margin-right: 0"></el-checkbox>
                <el-input class="ele-input" v-model="formInfo.chatgroupName" @change="inputChatGroupName" placeholder="群聊名称" maxlength="16" :disabled="!useChatName"></el-input>
                <span>+</span>
                <el-input class="ele-input group-input-num" v-model="formInfo.defaultNumber" @change="inputDefaultNum" placeholder="序号" maxlength="1" :disabled="!useChatName"></el-input>
                <el-checkbox v-model="useCodeChatName" style="margin-right: 0;margin-left:10px" :disabled="!useChatName"></el-checkbox>
                <span>同步修改上传群二维码</span>
              </div>
            </li>
            <li>
              <div class="tab-group">
                <div class="tab-item" :class="[{'active':tabIndex==index}]" @click="toggleTab(index)" v-for="(tab,index) in tabList">{{tab}}</div>
              </div>
            </li>
            <li class="margin-t0" v-if="tabIndex==0">
              <div class="tab-cnt-group">
                <div class="group">
                  <div class="label">微信号筛选</div>
                  <div class="info">
                    <div class="radio-item">
                      <el-radio v-model="formInfo.chatRadio" label="1">默认全部微信</el-radio>
                    </div>
                    <div class="radio-item">
                      <el-radio v-model="formInfo.chatRadio" label="2">按组选择</el-radio>
                      <div class="radio-group" style="width: 100%;">
                        <div class="group-list" v-if="sysGroupList.length!=0">
                          <div class="box" v-for="(group,groupIndex) in sysGroupList" v-if="group.list.length!=0">
                            <div class="group-name" :class="[{'active':group.check},{'disabled':formInfo.chatRadio==1}]" @click="toggleAllGroupCheck(group,groupIndex)">{{group.groupName}}</div>
                            <div class="group-item">
                              <span v-for="(item,itemIndex) in group.list" :class="[{'active':item.check},{'disabled':formInfo.chatRadio==1}]" @click="toggleGroupCheck(groupIndex,itemIndex)">{{item.wx_user_group_name}}</span>
                            </div>
                          </div>
                        </div>
                        <span v-else class="null-group">暂无分组</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="group">
                  <div class="label">好友筛选</div>
                  <div class="info">
                    <div class="radio-item">
                      <el-radio v-model="formInfo.friendRadio" label="1">全部好友</el-radio>
                    </div>
                    <div class="radio-item">
                      <el-radio v-model="formInfo.friendRadio" label="2">按好友通过时间</el-radio>
                      <div class="select-group">
                        <el-date-picker
                          size="small"
                          v-model="formInfo.dateTime"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :default-time="['00:00:00', '23:59:59']"
                          :disabled="formInfo.friendRadio==1"
                          :editable="false"
                          :clearable="false">
                        </el-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="group">
                  <div class="label">好友标签</div>
                  <div class="info">
                    <p><img src="../../assets/images/add.png" class="add-btn" @click="showModel('label','选择标签')"></p>
                    <dl v-if="sysCheckLabelList.length!=0">
                      <dd v-for="(label,index) in sysCheckLabelList">
                        <em>{{label.labelName}}</em><img class="remove-btn" @click="removeLabel(label,index)" src="../../assets/images/deleteTest.png"/>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </li>
            <li v-if="tabIndex==1">
              <div class="label">选择微信号</div>
              <div class="info">
                <img src="../../assets/images/add.png" class="add-btn" @click="showModel('user','选择微信号')">
              </div>
            </li>
          </ul>
        </div>
        <div class="edit-group" v-if="tabIndex==1">
          <span>批量操作：</span>
          <span class="edit-btn" @click="showModel('todayAdd','今日新增')">今日新增</span>
          <span class="edit-btn" @click="showModel('all','全部好友')">全部好友</span>
          <span class="edit-btn" @click="showModel('deleteGroup','删除')">删除</span>
        </div>
        <div class="table_wrapper" v-if="tabIndex==1">
          <el-table
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            :data="tableList"
            max-height="450"
            class="ele-table-init">
            <!--<el-table-column width="30" fixed></el-table-column>-->
            <el-table-column type="selection" fixed></el-table-column>
            <el-table-column label="序号" align="center" width="60">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column label="微信号" align="center">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.wxUsername+'('+scope.row.nickName+')'" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.wxUsername+'('+scope.row.nickName+')'}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="终端" align="center">
              <template slot-scope="scope">
                <el-tooltip :open-delay="350" :content="scope.row.terminalId" placement="bottom" effect="light" :offset="80">
                  <span class="writeWrapper">{{scope.row.terminalId}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="roomName" label="群聊名称" align="center" width="260">
              <template slot-scope="scope">
                  <span>{{scope.row.roomName?scope.row.roomName:(scope.row.roomUserName?'未设置('+scope.row.roomUserName+')':'')}}<i v-if="scope.row.roomName||scope.row.roomUserName" class="el-icon-plus el-icon-close reset-item" @click="resetItem(scope.row)"></i></span>
              </template>
            </el-table-column>
            <el-table-column prop="memberCount" label="群聊人数" align="center"></el-table-column>
            <el-table-column prop="contactCount" label="好友数量" align="center"></el-table-column>
            <el-table-column label="邀请好友" align="center">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="showModel('friend','好友列表',scope.row,scope.$index)" style="text-decoration: underline">{{scope.row.all?(scope.row.status==3?"未入群全部好友":"全部好友"):(scope.row.startTime&&scope.row.checkFriends.length==0?"今日新增未入群":scope.row.checkFriends.length+"个好友")}}</el-button> -->
                <el-button type="text" @click="showModel('friend','好友列表',scope.row,scope.$index)" style="text-decoration: underline">{{scope.row.all?(scope.row.status==3?"未入群全部"+scope.row.notchatroomContactCount+"个好友":"全部"+scope.row.notchatroomContactCount+"个好友"):(scope.row.startTime&&scope.row.checkFriends.length==0?"今日新增未入群"+scope.row.notchatroomContactCount+"个好友":scope.row.checkFriends.length+"个好友")}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" class="red" @click="showModel('delete','删除',scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="group-total" v-if="tableList.length!=0&&tabIndex==1">共<span>{{tableList.length}}</span>个微信号，<span>{{subNumber}}</span>个好友</div>
        <div class="qrcode-group">
          <ul>
            <li v-for="(code,index) in showCodeList">
              <div class="code-pic" :class="[(code.checkStatus==1||code.isGroup)?'border-normal':'border-red']">
                <img :src="code.imgLink">
              </div>
              <div class="btn-group">
                <span v-if="code.codeTextStatus==1&&code.isQrcode" class="red">检测中</span>
                <span class="red" v-if="code.codeTextStatus==0||code.codeTextStatus==2||code.isGroup" @click="removeCodeItem(code,index)">删除</span>
                <span v-if="code.checkStatus==3" @click="checkCodeAgain(code)">重新检查</span>
                <span v-if="code.checkStatus==2" @click="refreshCode(code)">更新</span>
              </div>
              <p class="info" v-if="code.checkStatus==1||code.isGroup">{{code.roomName}}</p>
              <p class="info" :class="[{'red':!code.isQrcode&&!code.isGroup}]" v-if="!code.isQrcode&&!code.isGroup">无效二维码</p>
              <!--<p class="info" v-if="code.checkStatus==1||code.isGroup">共{{code.checkStatus==1?(code.memberCount-1):code.memberCount}}个群成员</p>-->
              <p class="info" :class="[{'red':code.checkStatus==3}]" v-if="(code.checkStatus!=1&&!code.isGroup)">{{code.checkStatus|formatStatus}}</p>
            </li>
          </ul>
          <div class="code-type">
            <span @click="showUpload">手动上传</span>或<span @click="showGroupList">选择系统二维码</span>
            <!-- <el-button class="ele-btn check-code" :class="[{'ele-disabled':codeTextStatus==1}]" @click="checkCode">{{codeTextStatus | filterCheckText}}</el-button> -->
            <el-button class="ele-btn check-code" :class="[codeTextStatus==1?'ele-disabled':'']" @click="checkCode">{{codeTextStatus | filterCheckText}}</el-button>
          </div>
        </div>
        <div class="group-total" v-if="showCodeList.length!=0">已上传<span>{{showCodeList.length}}</span>张二维码 <!--<span>{{showCodeLen}}</span>个微信号--></div>
        <div class="submit">
          <el-button class="ele-btn" @click="submit">提交</el-button>
        </div>
        <div class="warning-info">
          <p>温馨提示：</p>
          <p>1、系统自动将已在群聊内的好友自动过滤</p>
          <p>2、二维码不足时自动创建群聊</p>
        </div>
      </div>
    </div>
    <!--<div class="hidden-group" style="width: 0;height: 0;overflow: hidden">-->
      <!--<img :id="'qrcode'+index" :src="qrcode.imgLink" :ref="'qrcode'+index" v-for="(qrcode,index) in showLi"></img>-->
    <!--</div>-->
    <el-dialog title="群聊列表" :visible.sync="showGroupFlag" width="900px">
      <div class="search" style="margin-bottom: 20px">
        <el-input class="ele-input" v-model="searchForm.roomName" @change="initChatList" placeholder="请输入群聊名称" maxlength="16"></el-input>
        <el-date-picker
          class="ele-date-editor"
          v-model="searchForm.searchDate"
          type="daterange" range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchChat">
        </el-date-picker>
      </div>
      <el-table :data="codeGroupList" max-height="288" ref="groupList" @selection-change="handleItemGroupChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="群聊名称" width="280">
          <template slot-scope="scope">
            <el-tooltip :open-delay="350" :content="scope.row.roomName?scope.row.roomName:(scope.row.roomUserName?'未设置('+scope.row.roomUserName+')':'')" placement="bottom" effect="light" :offset="80">
              <span class="writeWrapper">{{scope.row.roomName?scope.row.roomName:(scope.row.roomUserName?'未设置('+scope.row.roomUserName+')':'')}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column property="roomOwnerNickName" label="群主">
          <template slot-scope="scope">
            <el-tooltip :open-delay="350" :content="scope.row.roomOwnerNickName" placement="bottom" effect="light" :offset="80">
              <span class="writeWrapper">{{scope.row.roomOwnerNickName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column property="roomUserName" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.deleted|formatFlag}}</span>
          </template>
        </el-table-column>

        <el-table-column property="memberCount" label="人数"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="groupSizeChange"
          @current-change="groupPageChange"
          :current-page="groupPage"
          :page-sizes="groupPageSizes"
          :page-size="groupPageSize"
          layout="prev,pager,next,total,sizes"
          :total="groupPageTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" class="ele-btn" @click="submitGroupCheck">确 定</el-button>
        <el-button class="ele-default" @click="showGroupFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="好友列表" :visible.sync="showFriendList" width="900px">
      <el-table :data="friendsList" max-height="288" ref="friendList" @selection-change="handleItemFriendsChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="好友微信号" width="200">
          <template slot-scope="scope">
            <el-tooltip :open-delay="350" :content="scope.row.contactWxUserName+'('+scope.row.nickName+')'" placement="bottom" effect="light" :offset="80">
              <span class="writeWrapper">{{scope.row.contactWxUserName+'('+scope.row.nickName+')'}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column property="createdTime" label="通过时间" width="200"></el-table-column>
        <el-table-column property="roomUserName" label="所在最新群聊" width="200">
          <template slot-scope="scope">
            <el-tooltip :open-delay="350" :content="scope.row.roomUserName" placement="bottom" effect="light" :offset="80">
              <span class="writeWrapper">{{scope.row.roomUserName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column property="enterTime" label="入群时间"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" class="ele-btn" @click="submitFriends">确 定</el-button>
        <el-button class="ele-default" @click="showFriendList = false">取 消</el-button>
      </div>
    </el-dialog>
    <Dialog @callback="checkUser" v-if="dialogFlag=='user'">
      <div class="dialog-content dia-tree" slot="content" style="padding:30px 0 0;">
        <div class="tree">
          <div class="check-all" v-if="userList.length!=0">
            <el-checkbox v-model="checkAll" @change="userToggleCheck">全选</el-checkbox>
          </div>
          <el-scrollbar class="scroll-bar" style="height:calc(100% - 20px);height:-webkit-calc(100% - 20px)">
            <el-tree
              :data="userList"
              show-checkbox
              node-key="id"
              ref="diatree"
              @check="nodeClick"
              highlight-current
              :check-on-click-node="true"
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="total">当前已选微信号{{selectTotal}}个 <span class="red" v-if="userTotal>createMax">微信号选择最大限制为{{createMax}}个</span></div>
      </div>
    </Dialog>
    <Dialog @callback="uploadCode" @cancelCallback="clearCodeList" v-if="dialogFlag=='upload'">
      <div class="dialog-content upload-code" slot="content" v-loading="!checkCodeFlag" element-loading-text="正在解析二维码,请稍后">
        <el-upload
          class="upload-demo"
          :limit="maxUpload"
          multiple
          :on-exceed="handleExceed"
          :auto-upload="true"
          :show-file-list="false"
          :on-change="codeListChange"
          :http-request="httpUpLoadRquest"
          :before-upload="beforeUpLoadImg"
          :file-list="fileList"
          action="http://172.16.0.31:8888/api/v1/file/upload"
          accept="image/jpg,image/jpeg,image/png">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip" style="line-height: 18px;margin-top: 8px">只能上传jpg/png文件，且单张不超过{{imgSize}}kb <br><span class="red">最多只允许上传{{maxUpload}}张图片<br>注：上传过程中浏览器客户端进行解析，最大耗时需数分钟左右，<br>请勿进行其他操作，避免浏览器崩溃</span></div>
        </el-upload>
        <div class="file-list" v-if="fileList.length!=0">
          <el-scrollbar class="scroll-bar">
            <ul>
              <li v-for="(file,index) in fileList">
                <i class="el-icon-document"></i>
                <span>{{file.name}}</span>
                <i class="el-icon-plus el-icon-close" @click="removeCode(file)"></i>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </Dialog>
    <Dialog @callback="checkCodeUser" @cancelCallback="checkCodeCancel" v-if="dialogFlag=='codeUser'">
      <div class="dialog-content dia-tree" slot="content" style="padding:30px 0 0;">
        <div class="tree">
          <div class="check-all" v-if="codeUserList.length!=0">
            <el-checkbox v-model="codeCheckAll" @change="codeUserToggleCheck">全选</el-checkbox>
          </div>
          <el-scrollbar class="scroll-bar" style="height:calc(100% - 20px);height:-webkit-calc(100% - 20px)">
            <el-tree
              :data="codeUserList"
              show-checkbox
              node-key="id"
              ref="codediatree"
              @check="codeNodeClick"
              highlight-current
              :check-on-click-node="true"
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="total">当前已选微信号{{codeSelectTotal}}个 <span class="red" v-if="codeUserTotal>codeUserMax">微信号选择最大限制为{{codeUserMax}}个</span><br><span class="red notice">如检查失败请尝试更换微信号</span></div>
      </div>
    </Dialog>
    <Dialog @callback="checkAllFriend" v-if="dialogFlag=='all'">
      <div class="dialog-content" slot="content">
        <p>选择全部好友?</p>
      </div>
    </Dialog>
    <Dialog @callback="confirmRemoveCode" v-if="dialogFlag=='confirm'">
      <div class="dialog-content" slot="content">
        <p>有效二维码，是否删除?</p>
      </div>
    </Dialog>
    <Dialog @callback="deleteItem" v-if="dialogFlag=='delete'">
      <div class="dialog-content" slot="content">
        <p>确定要删除吗?</p>
      </div>
    </Dialog>
    <Dialog @callback="deleteGroup" v-if="dialogFlag=='deleteGroup'">
      <div class="dialog-content" slot="content">
        <p>确定要删除吗?</p>
      </div>
    </Dialog>
    <!--选择标签-->
    <Dialog @callback="submitLabelCheck" v-if="dialogFlag=='label'">
      <div class="dialog-content label-dialog" slot="content">
        <div class="label-box" v-if="sysLabelList.length!=0">
          <span v-for="(label,index) in sysLabelList" :class="[{'active':label.check}]" @click="toggleCheckLabel(label,index)">{{label.labelName}}</span>
        </div>
        <div class="is-null" v-else>暂无标签</div>
      </div>
    </Dialog>
    <Dialog @callback="submitTime" v-if="dialogFlag=='todayAdd'">
      <div class="dialog-content" slot="content">
        <el-time-select
          placeholder="起始时间"
          v-model="startTime"
          :clearable="false"
          :editable="false"
          :picker-options="{start: '00:00',step: '00:60',end: '24:00'}">
        </el-time-select>
        <span> ~ </span>
        <el-time-select
          placeholder="结束时间"
          v-model="endTime"
          :clearable="false"
          :editable="false"
          :picker-options="{start: '00:00',step: '00:60',end: '24:00',minTime: startTime}">
        </el-time-select>
      </div>
    </Dialog>
    <Dialog @callback="submitData" v-if="dialogFlag=='submitData'"></Dialog>
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
        sizeMaxNum:0,
        startTime:"00:00",
        endTime:"24:00",
        userList:[],
        tableList:[],
        page:1,
        total:0,
        formInfo:{
          taskName:"",
          defaultPserson:40,
          maxTimes:"",
          defaultNumber:"",
          chatgroupName:"",
          chatRadio:"1",
          friendRadio:"1",
          dateTime:""
        },
        startDate:"",
        endDate:"",
        initMinPerson:3,
        initMaxPerson:40,
        initMaxTimes:10,
        checkFriendsAll:true,
        checkedFriends:[],
        isIndeterminate:true,
        checkFriendsInfo:{
          checkFriendsAll:true,
          idx:0,
          isIndeterminate:true,
          checkedFriends:[]
        },
        friendsList: [], // 群好友
        selectUser:[],
        selectIds:[],
        selectTotal:0,
        checkAll: false,
        defaultProps:{
          children: 'children',
          label: 'name'
        },
        createMax:200,
        editIds:[],
        deleteIndex:0,
        subNumber:0,
        userTotal:0,
        selectFlag:false,
        getInfoFlag:true,
        showFriendList:false,
        tableCheckFriends:[],
        qrcodeList:[],
        maxUpload:998,
        fileList:[],
        showCodeList:[],
        //二维码选择微信号部分
        codeSelectIds:[],
        codeSelectTotal:0,
        codeSelectUser:[],
        codeUserList:[],
        codeUserTotal:0,
        codeCheckAll:false,
        showCodeLen:0,
        showGroupFlag:false,
        codeGroupList:[],
        checkCodeList:[],
        uploadCodeList:[],
        checkGroupIds:[],
        codeTextStatus:0,
        submitReplace:['data:image/jpg;base64,','data:image/png;base64,','data:image/jpeg;base64,','data:image/gif;base64,'],
        qrCodeGroup:[],
        expireTimes:30000,
        singleExpireTimes:30000,
        codeUserMax:0,
        checkAgainCodeArr:[],
        submitCheckCodeList:[],
        submitCheckFlag:true,
        imgSize:500,
        checkUpload:true,
        checkCodeFlag:true,
        tabIndex:0,
        tabList:["系统推荐选择","自定义选择"],
        sysLabelList:[],
        sysCheckLabelList:[],
        sysGroupList:[],
        removeCodeItemInfo:{},
        removeCodeIndex:0,
        labelClassList:['default','info','success','danger','warning'],
        checkEndNum:0,
        singleCheckEndNum:0,
        useChatName:false,
        useCodeChatName:false,
        groupPageSizes:[10,20,50,100],
        groupPageSize:10,
        groupPageTotal:0,
        groupPage:1,
        searchForm:{
          roomName:"",
          searchDate:""
        },
        chatStartTime:"",
        chatEndTime:""
      };
    },
    computed: {
      ...mapState(["dialogFlag"])
    },
    mounted() {
      this.getLabelList();
      this.getGroupList();
      this.formInfo.dateTime=this.getDefaultTime();
    },
    filters:{
      formatFlag(num) {
        switch (num * 1) {
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
      filterCheckText(status){
        switch (status*1) {
          case 0:
            return "检查上传二维码";
            break;
          case 1:
            return "检测中，请稍后";
            break;
          case 2:
            return "检查上传二维码";
            break;
        }
      },
      formatStatus(status){
        switch (status*1) {
          case 1:
            return "检查成功";
            break;
          case 2:
            return "检查进行中";
            break;
          case 3:
            return "检查失败";
            break;
        }
      }
    },
    methods: {
      getDefaultTime(){
        let aDate=new Date();
        let year=aDate.getFullYear();
        let month=aDate.getMonth()+1;
        let day=aDate.getDate();
        let startDate=year+"-"+this.filterNum(month)+"-"+this.filterNum(day)+" 00:00:00";
        let endDate=year+"-"+this.filterNum(month)+"-"+this.filterNum(day)+" 23:59:59";
        return [startDate,endDate]
      },
      filterNum(n){
        return n<10?'0'+n:n+'';
      },
      filterDateTime(date){
        let aDate=new Date(date);
        let year=aDate.getFullYear();
        let month=aDate.getMonth()+1;
        let day=aDate.getDate();
        let hour=aDate.getHours();
        let minute=aDate.getMinutes();
        let second=aDate.getSeconds();
        return year+"-"+this.filterNum(month)+"-"+this.filterNum(day)+" "+this.filterNum(hour)+":"+this.filterNum(minute)+":"+this.filterNum(second);
      },
      //群搜索
      initChatList(){
        let _this=this;
        _this.groupPage=1;
        _this.showGroupList();
      },
      searchChat(){
        let _this=this;
        _this.groupPage=1;
        if(this.searchForm.searchDate!=null){
          this.chatStartTime = this.searchForm.searchDate[0];
          this.chatEndTime = this.searchForm.searchDate[1];
        }else{
          this.chatStartTime = "";
          this.chatEndTime = "";
        }
        _this.showGroupList();
      },
      //系统群分页
      groupSizeChange(num){
        let _this=this;
        _this.groupPageSize=num;
        _this.showGroupList();
      },
      groupPageChange(page){
        let _this=this;
        _this.groupPage=page;
        _this.showGroupList();
      },
      //获取分组列表
      getGroupList(){
        let _this=this;
        let userId=sessionStorage.getItem("user_id");
        _this.$http("wx_group/list","GET",{
          limit:99999,
          page:1
        }).then((res)=>{
          if(res.data.error_code==0){
            let result=res.data.data.result;
            let json={};
            let formatResult=[];
            result.map((v,k)=>{
              if(!json[v.userName]){
                json[v.userName]=1;
              }else{
                !json[v.userName]++;
              }
            });
            for(let key in json){
              let fjson={};
              let arr=result.filter((v,k)=>{
                return v.userName==key&&v.wx_sum_count>0;
              });
              fjson.groupName=key;
              if(arr.length>0){
                formatResult.push(fjson)
                fjson.list=arr;
              }
            };
            _this.sysGroupList=formatResult;
          }
        }).catch((err)=>{
          console.log(err)
        })
        // _this.$http("wx_group/group_list","POST",{
        //   limit:99999,
        //   page:1
        // }).then((res)=>{
        //   if(res.data.error_code==0){
        //     let result=res.data.data.result;
        //     result.map((v,k)=>{
        //       v.check=true;
        //     });
        //     _this.sysGroupList=result;
        //   }
        // }).catch((err)=>{
        //   console.log(err)
        // })
      },
      //获取标签列表
      getLabelList(){
        let _this=this;
        let userId=sessionStorage.getItem("user_id");
        _this.$http("wx_contact_label/"+userId,"GET").then((res)=>{
          if(res.data.error_code==0){
            let result=res.data.data;
            _this.sysLabelList=result;
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      //选择标签
      submitLabelCheck(){
        let sysLabelList=this.sysLabelList;
        let sysCheckLabelList=[];
        sysLabelList.map((v,k)=>{
          if(v.check){
            sysCheckLabelList.push(v);
          }
        });
        if(sysCheckLabelList.length==0){
          this.$message.warning("请至少选择一个标签");
          return;
        };
        this.sysCheckLabelList=sysCheckLabelList;
        this.hideModel();
      },
      //切换标签选择
      toggleCheckLabel(label,index){
        label.check=!label.check;
        this.$set(this.sysLabelList,index,label);
      },
      toggleAllGroupCheck(group,groupIndex){
        if(this.formInfo.chatRadio==2){
          group.check=!group.check;
          group.list.map((v,k)=>{
            v.check=group.check;
          });
          this.$set(this.sysGroupList,groupIndex,group);
        }
      },
      //切换分组是否选择
      toggleGroupCheck(groupIndex,itemIndex){
        if(this.formInfo.chatRadio==2){
          let group=this.sysGroupList[groupIndex];
          let total=0;
          let item=group.list[itemIndex];
          item.check=!item.check;
          group.list.map((v,k)=>{
            if(v.check){
              total++;
            };
          });
          if(total==group.list.length){
            group.check=true;
          }else{
            group.check=false;
          };
          this.$set(this.sysGroupList,groupIndex,group);
        }
      },
      //删除所选标签
      removeLabel(label,index){
        let _this=this;
        _this.sysCheckLabelList.splice(index,1);
      },
      //点击切换选择方式
      toggleTab(index){
        let _this=this;
        _this.tabIndex=index;
      },
      //单个更新
      refreshCode(code){
        let _this=this;
        let userId=sessionStorage.getItem("user_id")*1;
        let showCodeList=_this.showCodeList;
        let qrCodes=[code.sQrcode];
        let sourceList=[];
        qrCodes.map((v,k)=>{
          sourceList.push(`QRCODE_ROOMID_${v}`);
        });
        _this.$redis.string.get(sourceList).then((res)=>{
          if(res.data.error_code==0){
            let result=res.data.data.list;
            _this.codeTextStatus=2;
            submitCheckCodeList.map((v,k)=>{
              if(v.sQrcode==qrCodes[0]){
                let item=v;
                item.roomUserName=result[0].value;
                item.codeTextStatus=2;
                item.check=true;
                if(result[0].value!=""){
                  item.checkStatus=1;
                }else{
                  item.checkStatus=3;
                }
                _this.$set(_this.showCodeList,k,item);
              };
            });
            _this.showCodeList.sort(_this.checkSort);
            _this.$message.success("群二维码检查完成");
          }else{
            _this.$message.error("群二维码信息更新失败");
          }
          _this.submitCheckFlag=true;
        });
        // _this.$http("task_chatroom/qrcode_info_list","POST",{
        //   qrCodes:qrCodes,
        //   userId:userId
        // }).then((res)=>{
        //   if(res.data.error_code==0){
        //     let result=res.data.data;
        //     _this.codeTextStatus=2;
        //     showCodeList.map((v,k)=>{
        //       if(v.sQrcode==qrCodes[0]){
        //         let item=v;
        //         item.memberCount=result[0].memberCount;
        //         item.roomUserName=result[0].roomUserName;
        //         item.codeTextStatus=2;
        //         item.check=true;
        //         item.status=result[0].status;
        //         _this.$set(_this.showCodeList,k,item);
        //       }
        //     });
        //     _this.$message.success("发起群二维码更新");
        //   }else{
        //     _this.$message.error("群二维码信息更新失败");
        //   }
        //   _this.submitCheckFlag=true;
        // }).catch((err)=>{
        //   console.log(err)
        // });
      },
      //单个重新获取检查结果
      checkCodeInfoAgain(){
        let _this=this;
        let userId=sessionStorage.getItem("user_id")*1;
        let showCodeList=_this.showCodeList;
        let checkAgainCodeArr=_this.checkAgainCodeArr;
        let sourceList=[];
        checkAgainCodeArr.map((v,k)=>{
          sourceList.push(`QRCODE_ROOMID_${v}`);
        });
        _this.$redis.string.get(sourceList).then((res)=>{
          if(res.data.error_code==0){
            let result=res.data.data.list;
            _this.codeTextStatus=2;
            showCodeList.map((v,k)=>{
              if(v.sQrcode==checkAgainCodeArr[0]){
                let item=v;
                item.roomUserName=result[0].value;
                item.codeTextStatus=2;
                item.check=true;
                if(result[0].value!=""){
                  item.checkStatus=1;
                }else{
                  item.checkStatus=3;
                }
                _this.$set(_this.showCodeList,k,item);
              };
            });
            _this.showCodeList.sort(_this.checkSort);
            _this.$message.success("群二维码检查完成");
          }else{
            _this.$message.error("群二维码信息更新失败");
          }
          _this.submitCheckFlag=true;
        });
        // _this.$http("task_chatroom/qrcode_info_list","POST",{
        //   qrCodes:checkAgainCodeArr,
        //   userId:userId
        // }).then((res)=>{
        //   if(res.data.error_code==0){
        //     let result=res.data.data;
        //     // if(result[0].status==2&&_this.singleCheckEndNum==0){
        //     //   _this.singleCheckEndNum++;
        //     //   setTimeout(function(){
        //     //     _this.checkCodeInfoAgain();
        //     //   },_this.singleExpireTimes)
        //     // }else{
        //     //   _this.codeTextStatus=2;
        //     //   showCodeList.map((v,k)=>{
        //     //     if(v.sQrcode==checkAgainCodeArr[0]){
        //     //       let item=v;
        //     //       item.memberCount=result[0].memberCount;
        //     //       item.roomUserName=result[0].roomUserName;
        //     //       item.codeTextStatus=2;
        //     //       item.check=true;
        //     //       item.status=result[0].status;
        //     //       _this.$set(_this.showCodeList,k,item);
        //     //     }
        //     //   });
        //     //   _this.showCodeList.sort(_this.checkSort);
        //     //   _this.$message.success("发起群二维码检查成功");
        //     // }
        //     _this.codeTextStatus=2;
        //     showCodeList.map((v,k)=>{
        //       if(v.sQrcode==checkAgainCodeArr[0]){
        //         let item=v;
        //         item.memberCount=result[0].memberCount;
        //         item.roomUserName=result[0].roomUserName;
        //         item.codeTextStatus=2;
        //         item.check=true;
        //         item.status=result[0].status;
        //         _this.$set(_this.showCodeList,k,item);
        //       }
        //     });
        //     _this.showCodeList.sort(_this.checkSort);
        //     _this.$message.success("发起群二维码检查成功");
        //   }else{
        //     _this.$message.error("群二维码信息更新失败");
        //   }
        //   _this.submitCheckFlag=true;
        // }).catch((err)=>{
        //   console.log(err)
        // });
      },
      //单个重新检查二维码
      checkCodeAgain(code){
        let _this=this;
        let ids=[code.wxUserId];
        let qrCodeArr=[code.sQrcode];
        let showCodeList=_this.showCodeList;
        let param = {
          wxUserId:ids,
          qrCode:qrCodeArr
        };
        let data = {
          taskTemplateName: "批量检查群二维码",
          //  taskTemplateName: "szcTest",
          planParams: JSON.stringify(param),
          wxIds: ids.join()
        };
        let str = {
          param: JSON.stringify(data)
        };
        if(_this.submitCheckFlag){
          _this.submitCheckFlag=false;
          _this.$http('plan/start_plan','POST',str).then(res=>{
            if(res.data.error_code == 0) {
              _this.$message.success('发起二维码检查，请稍后');
              _this.checkAgainCodeArr=[code.sQrcode];
              _this.codeTextStatus=1;
              showCodeList.map((v,k)=>{
                if(v.wxUserId==code.wxUserId){
                  let item=v;
                  item.codeTextStatus=1;
                  item.check=false;
                  _this.$set(_this.showCodeList,k,item);
                }
              });
              setTimeout(function(){
                _this.checkCodeInfoAgain();
              },_this.singleExpireTimes)
            } else {
              _this.$message.warning(res.data.error_message)
            }
          })
        }
      },
      //移除选择二维码
      removeCodeItem(item,index){
        let _this=this;
        if(!_this.submitCheckFlag){
          _this.$message.warning("正在检查群二维码，无法操作列表");
          return;
        };
        if(item.checkStatus==1){
          _this.$store.dispatch("showDialog",{
            title:"删除",
            flag:"confirm",
            showCancel:false
          });
          _this.removeCodeItemInfo=item;
          _this.removeCodeIndex=index;
          return;
        }else{
          _this.delCodeItem(item,index);
        }
      },
      confirmRemoveCode(){
        let _this=this;
        let item=_this.removeCodeItemInfo;
        let index=_this.removeCodeIndex;
        _this.delCodeItem(item,index);
        _this.hideModel();
      },
      delCodeItem(item,index){
        let len=0;
        let _this=this;
        this.showCodeList.splice(index,1);
        if(this.uploadCodeList.indexOf(item)!=-1){
          this.uploadCodeList.splice(this.uploadCodeList.indexOf(item),1)
        };
        if(this.checkCodeList.indexOf(item)!=-1){
          let idx=this.checkCodeList.indexOf(item);
          this.checkGroupIds.splice(idx,1);
          this.checkCodeList.splice(idx,1);
        };
        this.showCodeList.map((v,k)=>{
          if(v.isQrcode){
            len++;
          };
        });
        _this.codeUserMax=len;
      },
      //选择群聊
      handleItemGroupChange(selection){
        let _this=this;
        let list=selection;
        let arr=[];
        list.map((v,k)=>{
          v.isGroup=true;
          arr.push(v.roomUserName);
        });
        _this.checkGroupIds=arr;
        _this.checkCodeList=list;
      },
      //提交选择的群聊
      submitGroupCheck(){
        let _this=this;
        let arr=[];
        _this.checkCodeList.map((v,k)=>{
          arr.push(v.roomUserName);
        });
        _this.checkGroupIds=arr;
        _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
        _this.showGroupFlag=false;
      },
      //显示群聊列表
      showGroupList(){
        let _this=this;
        let searchForm=_this.searchForm;
        let userId=sessionStorage.getItem("user_id")*1;
        let parmas={
          length: _this.groupPageSize,
          pageNo: _this.groupPage,
          userId:userId
        };
        if(searchForm.roomName){
          parmas.roomName=searchForm.roomName;
        };
        if(this.chatStartTime){
          parmas.startTime = this.chatStartTime;
          parmas.endTime = this.chatEndTime;
        }
        if(!_this.submitCheckFlag){
          _this.$message.warning("正在检查群二维码，无法操作列表");
          return;
        };
        _this.$http("task_chatroom/chatroom_task_list", "POST", parmas).then(res => {
          if (res.data.error_code == 0) {
            let total=res.data.data.totalCount;
            let list=res.data.data.result;
            let ids=_this.checkGroupIds;
            _this.codeGroupList =list.filter((v,k)=>{
              let aTime=new Date(v.qrcodeRefreshTime).getTime();
              let nTime=new Date().getTime();
              let baseTime=7*24*60*60*1000;
              let expireFlag=(aTime+baseTime-nTime)>=0?true:false;
              v.imgLink="data:image/jpg;base64,"+v.qrcodeBase64;
              v.sQrcode=v.roomQrcode;
              v.codeTextStatus=0;
              return v.deleted==0&&v.memberCount<40&&expireFlag;
            }) ;
            _this.showGroupFlag=true;
            _this.$nextTick(()=>{
              _this.codeGroupList.map((v,k)=>{
                if(ids.indexOf(v.roomUserName)!=-1){
                  _this.$refs.groupList.toggleRowSelection(v,true);
                }
              });
              _this.groupPageTotal=total;
            });
          }else{
            _this.$message.error(res.data.error_message);
          }
        }).catch((err)=>{
          _this.$message.error("获取群聊列表失败");
        });
      },
      //二维码微信号统计
      codeGetTotal(){
        let userList=this.codeUserList;
        let total=0;
        for(let i=0;i<userList.length;i++){
          for(let k=0;k<userList[i].children.length;k++){
            for(let j=0;j<userList[i].children[k].children.length;j++){
              total+=1;
            }
          }
        };
        if(total>this.codeUserMax){
          total=this.codeUserMax;
        };
        return total;
      },
      //二维码微信号选择事件
      codeNodeClick(){
        let nodes = this.$refs.codediatree.getCheckedNodes(true);
        let idArr=[];
        if(nodes.length>=this.codeUserMax){
          nodes=nodes.filter((v,k)=>{
            return k<this.codeUserMax;
          });
        }
        this.codeSelectUser = [];
        nodes.map((item,index)=>{
          idArr.push(item.id);
          this.codeSelectUser.push({
            id:item.id,
            index:index,
            name:item.name
          })
        });
        this.codeSelectIds=idArr;
        if(nodes.length==this.codeGetTotal()){
          this.codeCheckAll=true;
        }else{
          this.codeCheckAll=false;
        }
        this.$refs.codediatree.setCheckedNodes(nodes);
        this.codeSelectTotal = this.codeSelectUser.length;
      },
      //二维码微信号全选
      codeUserToggleCheck(val){
        let flag=val;
        let tree=this.$refs.codediatree;
        let idArr=[];
        let userList=this.codeUserList;
        this.codeSelectUser = [];
        if(flag){
          let user=[];
          userList.map((i)=>{
            i.children.map((j)=>{
              j.children.map((k)=>{
                user.push({
                  id:k.id,
                  name:k.name
                });
              })
            })
          });
          if(user.length>this.codeUserMax){
            user=user.filter((v,k)=>{
              return k<this.codeUserMax;
            });
            tree.setCheckedNodes(user);
          }else{
            tree.setCheckedNodes(userList);
          }
        }else{
          tree.setCheckedNodes([]);
        }
        let nodes = tree.getCheckedNodes(true);
        nodes.map((item,index)=>{
          idArr.push(item.id);
          this.codeSelectUser.push({
            id:item.id,
            index:index,
            name:item.name
          })
        });
        this.codeSelectIds=idArr;
        this.codeSelectTotal = this.codeSelectUser.length;
      },
      //选择微信号发起二维码检查
      checkCodeUser(){
        let _this=this;
        let ids=_this.codeSelectIds;
        let showCodeList=_this.showCodeList;
        let qrCodeArr=[];
        let submitCheckCodeList=[];
        let newArr=[];
        showCodeList.map((v,k)=>{
          if(v.isQrcode&&v.checkStatus!=1){
            newArr.push(v);
          }
        });
        ids.map((v,k)=>{
          qrCodeArr.push(newArr[k].sQrcode);
          submitCheckCodeList.push(newArr[k]);
        });
        _this.qrCodeGroup=qrCodeArr;
        if(_this.codeSelectUser.length==0){
          _this.$message.warning("请选择微信号");
          return;
        };
        let param = {
          wxUserId:ids,
          qrCode:qrCodeArr
        };
        let data = {
          taskTemplateName: "批量检查群二维码",
          // taskTemplateName: "szcTest",
          planParams: JSON.stringify(param),
          wxIds: ids.join()
        };
        let str = {
          param: JSON.stringify(data)
        };
        _this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 0) {
            _this.$message.success('发起二维码检查，请稍后');
            _this.codeTextStatus=1;
            submitCheckCodeList.map((v,k)=>{
              if(showCodeList.indexOf(v)!=-1){
                let idx=showCodeList.indexOf(v);
                let item=showCodeList[idx];
                item.codeTextStatus=1;
                item.wxUserId=ids[k];
                _this.$set(_this.showCodeList,idx,item);
              };
            });
            _this.showCodeLen=ids.length;
            _this.hideModel();
            _this.submitCheckCodeList=submitCheckCodeList;
            setTimeout(function(){
              _this.checkCodeInfo();
            },_this.expireTimes)
          } else {
            _this.$message.warning(res.data.error_message)
          }
        })
      },
      checkSort(a,b){
        //if((a.isQrcode&&a.codeTextStatus==2)&&(b.isQrcode&&b.codeTextStatus==2)){
        if(a.isQrcode&&b.isQrcode){
          if(a.checkStatus>b.checkStatus){
            return -1;
          }else{
            return 1;
          }
        }else{
          return "";
        }
      },
      //间隔15秒后检查群二维码状态
      checkCodeInfo(){
        let _this=this;
        let userId=sessionStorage.getItem("user_id")*1;
        let showCodeList=_this.showCodeList;
        let submitCheckCodeList=_this.submitCheckCodeList;
        let len=0;
        let qrCodeGroup=_this.qrCodeGroup;
        let sourceList=[];
        qrCodeGroup.map((v,k)=>{
          sourceList.push(`QRCODE_ROOMID_${v}`);
        });
        _this.$redis.string.get(sourceList).then((res)=>{
          if(res.data.error_code==0){
            let result=res.data.data.list;
            _this.codeTextStatus=2;
            submitCheckCodeList.map((v,k)=>{
              if(showCodeList.indexOf(v)!=-1){

                let idx=showCodeList.indexOf(v);
                let item=showCodeList[idx];
                item.roomUserName=result[k].value;
                item.codeTextStatus=2;
                item.check=true;
                if(result[k].value!=""){
                  item.checkStatus=1;
                }else{
                  item.checkStatus=3;
                }
                _this.$set(_this.showCodeList,idx,item);
              };
            });
            _this.showCodeList.sort(_this.checkSort);
            _this.$message.success("群二维码检查完成");
          }else{
            _this.$message.error("群二维码信息更新失败");
          }
          _this.submitCheckFlag=true;
        });
        // _this.$http("task_chatroom/qrcode_info_list","POST",{
        //   qrCodes:_this.qrCodeGroup,
        //   userId:userId
        // }).then((res)=>{
        //   if(res.data.error_code==0){
        //     let result=res.data.data;
        //     _this.codeTextStatus=2;
        //     submitCheckCodeList.map((v,k)=>{
        //       if(showCodeList.indexOf(v)!=-1){
        //         let idx=showCodeList.indexOf(v);
        //         let item=showCodeList[idx];
        //         item.roomUserName=result[k].roomUserName;
        //         item.memberCount=result[k].memberCount;
        //         item.codeTextStatus=2;
        //         item.check=true;
        //         item.checkStatus=result[k].status;
        //         _this.$set(_this.showCodeList,idx,item);
        //       };
        //     });
        //     _this.showCodeList.sort(_this.checkSort);
        //     _this.$message.success("群二维码检查完成");
        //   }else{
        //     _this.$message.error("群二维码信息更新失败");
        //   }
        //   _this.submitCheckFlag=true;
        // }).catch((err)=>{
        //   console.log(err)
        // });
      },
      checkCodeCancel(){
        let _this=this;
        _this.submitCheckFlag=true;
        _this.resetCheckCode();
        _this.hideModel();
      },
      resetCheckCode(){
        let _this=this;
        _this.codeSelectIds=[];
        _this.codeSelectTotal=0;
        _this.codeSelectUser=[];
        _this.codeCheckAll=false;
      },
      //显示选择微信号
      showCodeUserList(){
        let _this=this;
        _this.$http("/group_wxuser_new", "GET").then(res => {
          if(res.data.error_code==0){
            let list = res.data.data.result;
            let total=0;
            for(let i=0;i<list.length;i++){
              for(let k=0;k<list[i].children.length;k++){
                for(let j=0;j<list[i].children[k].children.length;j++){
                  total+=1;
                }
              }
            };
            _this.codeUserList=list;
            _this.codeUserTotal=total;
            _this.resetCheckCode();
            _this.$store.dispatch("showDialog",{
              title:"选择微信号",
              flag:"codeUser",
              showCancel:true
            })
          }
        }).catch(err => {
          console.log(err);
        });
      },
      //批量检查二维码
      checkCode(){
        let _this=this;
        let showCodeList=_this.showCodeList;
        let codeUserMax=0;
        if(_this.showCodeList.length==0){
          _this.$message.warning("请上传群二维码");
          return;
        };
        showCodeList.map((v,k)=>{
          if(v.isQrcode&&v.checkStatus!=1){
            codeUserMax++;
          }
        });
        _this.codeUserMax=codeUserMax;
        if(codeUserMax>0){
          if(_this.submitCheckFlag){
            _this.submitCheckFlag=false;
            _this.showCodeUserList();
          }
        }else{
          _this.$message.warning("无有效手动上传的二维码需要检测");
        }
      },
      httpUpLoadRquest(file){
        // let _this=this;
        // let formData=new FormData();
        // formData.append('file',file.file);
        // _this.$http("file/upload","POST",formData).then((res)=>{
        // });
      },
      beforeUpLoadImg(file){
        let _this=this;
        let fileReader = new FileReader();
        let fileList=_this.fileList;
        let nameArr=[];
        let size=Math.ceil(file.size/1024);
        //file.checkStatus=-1;
        file.checkStatus=1.5;
        fileList.map((v,k)=>{
          nameArr.push(v.name);
        });
        if(nameArr.indexOf(file.name)==-1){
          _this.fileList.push(file);
        };
        // if(nameArr.indexOf(file.name)==-1&&size<=_this.imgSize){
        //   _this.fileList.push(file);
        // }
      },
      resetItem(row,index){
        let item=row;
        item.roomName="";
        item.roomUserName="";
        item.memberCount="";
        this.$set(this.tableList,index,item)
      },
      clearCodeList(){
        //this.fileList=[];
        this.hideModel();
      },
      removeCode(file){
        this.fileList.splice(this.fileList.indexOf(file),1);
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
      codeListChange(file, fileList){

      },
      //显示上传图片
      showUpload(){
        let _this=this;
        _this.sizeMaxNum=0;
        if(!_this.submitCheckFlag){
          _this.$message.warning("正在检查群二维码，无法操作列表");
          return;
        }
        this.$store.dispatch("showDialog",{
          title:"手动上传二维码",
          flag:"upload",
          showCancel:true
        });
      },
      uploadCheckAgain(fileList,initFileList,lastArray){
        let _this=this;
        let handleLen=0;
        let newArr=[];
        let json={};
        let urlArr=[];
        initFileList.map((i,j)=>{
          if(i.isQrcode){
            if(!json[i.sQrcode]){
              json[i.sQrcode]=1;
              newArr.push(i);
              urlArr.push(i.sQrcode);
            }else{
              json[i.sQrcode]++;
            }
          };
        });
        initFileList.map((v,k)=>{
          let url=_this.getObjectURL(v);
          const codeReader = new ZXing.BrowserQRCodeReader();
          codeReader.decodeFromImage(undefined,url).then(result =>{
            handleLen++;
            v.checkFlag=true;
            if(result.text&&result.text.indexOf("https://weixin.qq.com/g")!=-1){
              v.isQrcode=true;
              v.sQrcode=result.text;
            }else{
              v.isQrcode=false;
            };
            fileList[v.idx]=v;
            if(handleLen==initFileList.length){
              let newArr3=[];
              let json3={};
              fileList.map((i,j)=>{
                if(i.isQrcode){
                  if(!json3[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
                    json3[i.sQrcode]=1;
                    newArr3.push(i);
                  }else{
                    json3[i.sQrcode]++;
                  }
                };
              });
              for(let key in json3){
                if(json3[key]>1){
                  this.$message.warning("存在相同二维码，系统直接过滤");
                }
              }
              let forMatArr=[...lastArray,...newArr3];
              if(forMatArr.length==0){
                _this.$message.warning("无有效群二维码");
              };
              _this.uploadCodeList=[...lastArray,...newArr3];
              _this.uploadCodeList.sort(_this.checkSort);
              _this.fileList=_this.uploadCodeList;
              _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
              _this.hideModel();
              _this.checkCodeFlag=true;
            };
          }).catch(err =>{
            v.checkFlag=true;
            v.isQrcode=false;
            handleLen++;
            if(handleLen==initFileList.length){
              let newArr4=[];
              let json4={};
              fileList.map((i,j)=>{
                if(i.isQrcode){
                  if(!json4[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
                    json4[i.sQrcode]=1;
                    newArr4.push(i);
                  }else{
                    json4[i.sQrcode]++;
                  }
                };
              });
              for(let key in json4){
                if(json4[key]>1){
                  this.$message.warning("存在相同二维码，系统直接过滤");
                }
              }
              let forMatArr=[...lastArray,...newArr4];
              if(forMatArr.length==0){
                _this.$message.warning("无有效群二维码");
              };
              _this.uploadCodeList=[...lastArray,...newArr4];
              _this.uploadCodeList.sort(_this.checkSort);
              _this.fileList=_this.uploadCodeList;
              _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
              _this.hideModel();
              _this.checkCodeFlag=true;
            };
          });
          v.imgLink=url;
          v.codeTextStatus=0;
        });
      },
      //上传二维码图片11
      uploadCode(){
        let _this=this;
        let fileList=_this.fileList;
        let arr=[];
        let len=0;
        let qrCodeArr=[];
        let handleLen=0;
        if(fileList.length==0){
          _this.$message.warning("请至少上传1张二维码!");
          return;
        };
        if(_this.sizeMaxNum>0){
          _this.$message.warning(""+_this.sizeMaxNum+"张二维码超过"+_this.imgSize+"kb，将自动过滤!");
        };
        let aDate=new Date().getTime();
        let newArr=[];
        let json={};
        let urlArr=[];

        fileList.map((i,j)=>{
          if(i.isQrcode){
            if(!json[i.sQrcode]){
              json[i.sQrcode]=1;
              newArr.push(i);
              urlArr.push(i.sQrcode);
            }else{
              json[i.sQrcode]++;
            }
          };
        });
        fileList=fileList.filter((v,k)=>{
          return !v.checkFlag;
        });
        if(_this.checkCodeFlag){
          if(fileList.length!=0){
            _this.checkCodeFlag=false;
            let checkQrcodeTotal=0;
            fileList.map((i,j)=>{
              let url=_this.getObjectURL(i);
              i.imgLink=url;
              i.codeTextStatus=0;
              qrcode.decode(url,i,j);
              qrcode.callback = function(imgMsg,item,index){
                item.checkFlag=true;
                item.idx=index;
                if(imgMsg&&imgMsg.indexOf("https://weixin.qq.com/g")!=-1){
                  item.isQrcode=true;
                  item.sQrcode=imgMsg;
                }else{
                  item.isQrcode=false;
                  item.sQrcode="";
                };
                checkQrcodeTotal++;
                if(checkQrcodeTotal==fileList.length){
                    let json3={};
                    let newArr3=[];
                    let initFileList=fileList.filter((f,l)=>{
                      return !f.isQrcode;
                    });
                    if(initFileList.length>0){
                      _this.uploadCheckAgain(fileList,initFileList,newArr);
                    }else{
                      fileList.map((i,j)=>{
                        if(i.isQrcode){
                          if(!json3[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
                            json3[i.sQrcode]=1;
                            newArr3.push(i);
                          }else{
                            json3[i.sQrcode]++;
                          }
                        };
                      });
                      for(let key in json3){
                        if(json3[key]>1){
                          this.$message.warning("存在相同二维码，系统直接过滤");
                        }
                      }
                      let forMatArr=[...newArr,...newArr3];
                      if(forMatArr.length==0){
                        _this.$message.warning("无有效群二维码");
                      };
                      _this.uploadCodeList=[...newArr,...newArr3];
                      _this.uploadCodeList.sort(_this.checkSort);
                      _this.fileList=_this.uploadCodeList;
                      _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
                      _this.hideModel();
                      _this.checkCodeFlag=true;
                    }
                };
              };
            });
            // fileList.map((v,k)=>{
            //   let url=_this.getObjectURL(v);
            //   const codeReader = new ZXing.BrowserQRCodeReader();
            //   codeReader.decodeFromImage(undefined,url).then(result =>{
            //     v.checkFlag=true;
            //     if(result.text&&result.text.indexOf("https://weixin.qq.com/g")!=-1){
            //       v.isQrcode=true;
            //       v.sQrcode=result.text;
            //     }else{
            //       v.isQrcode=false;
            //     };
            //     handleLen++;
            //     if(handleLen==fileList.length){
            //       let newArr3=[];
            //       let json3={};
            //       fileList.map((i,j)=>{
            //         if(i.isQrcode){
            //           if(!json3[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
            //             json3[i.sQrcode]=1;
            //             newArr3.push(i);
            //           }else{
            //             json3[i.sQrcode]++;
            //           }
            //         };
            //       });
            //       for(let key in json3){
            //         if(json3[key]>1){
            //           this.$message.warning("存在相同二维码，系统直接过滤");
            //         }
            //       }
            //       let forMatArr=[...newArr,...newArr3];
            //       if(forMatArr.length==0){
            //         _this.$message.warning("无有效群二维码");
            //       };
            //       _this.uploadCodeList=[...newArr,...newArr3];
            //       _this.uploadCodeList.sort(_this.checkSort);
            //       _this.fileList=_this.uploadCodeList;
            //       _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
            //       _this.hideModel();
            //       _this.checkCodeFlag=true;
            //       console.log("数组长度"+fileList.length);
            //       console.log("数组长度"+_this.showCodeList.length);
            //     };
            //   }).catch(err =>{
            //     v.checkFlag=true;
            //     v.isQrcode=false;
            //     handleLen++;
            //     if(handleLen==fileList.length){
            //       let newArr4=[];
            //       let json4={};
            //       fileList.map((i,j)=>{
            //         if(i.isQrcode){
            //           if(!json4[i.sQrcode]&&urlArr.indexOf(i.sQrcode)==-1){
            //             json4[i.sQrcode]=1;
            //             newArr4.push(i);
            //           }else{
            //             json4[i.sQrcode]++;
            //           }
            //         };
            //       });
            //       for(let key in json4){
            //         if(json4[key]>1){
            //           this.$message.warning("存在相同二维码，系统直接过滤");
            //         }
            //       }
            //       let forMatArr=[...newArr,...newArr4];
            //       if(forMatArr.length==0){
            //         _this.$message.warning("无有效群二维码");
            //       };
            //       _this.uploadCodeList=[...newArr,...newArr4];
            //       _this.uploadCodeList.sort(_this.checkSort);
            //       _this.fileList=_this.uploadCodeList;
            //       _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
            //       _this.hideModel();
            //       _this.checkCodeFlag=true;
            //       console.log("数组长度"+fileList.length);
            //       console.log("数组长度"+_this.showCodeList.length);
            //     };
            //   });
            //   v.imgLink=url;
            //   v.codeTextStatus=0;
            // });
          }else{
            _this.uploadCodeList=newArr;
            _this.uploadCodeList.sort(_this.checkSort);
            _this.fileList=_this.uploadCodeList;
            _this.showCodeList=[..._this.uploadCodeList,..._this.checkCodeList];
            _this.hideModel();
          };
        };
      },
      handleExceed(){
        this.$message.warning("最多只允许上传"+this.maxUpload+"张二维码")
      },
      //检查表单输入值
      inputName(val){
        let value=val.trim();
        this.$set(this.formInfo,"taskName",value);
      },
      //检查表单输入值
      inputPerson(val){
        let _this=this;
        let reg=/\D/g;
        if(reg.test(val)||val>_this.initMaxPerson){
          _this.$set(_this.formInfo,"defaultPserson",_this.initMaxPerson);
        }else if(val==""||val<_this.initMinPerson){
          _this.$set(_this.formInfo,"defaultPserson",_this.initMinPerson);
        };
      },
      //检查表单输入值
      inputTimes(val){
        let _this=this;
        let reg=/\D/g;
        if(reg.test(val)||val==0){
          _this.$set(_this.formInfo,"maxTimes","");
        }else if(val>_this.initMaxTimes){
          _this.$set(_this.formInfo,"maxTimes",_this.initMaxTimes);
        }
      },
      inputDefaultNum(val){
        let initVal=val;
        let _this=this;
        if(initVal<1||initVal>6){
          if(initVal<1){
            initVal=1;
          }
          if(initVal>6){
            initVal=6;
          };
          _this.$set(_this.formInfo,"defaultNumber",initVal);
        };
      },
      inputChatGroupName(val){
        let reg=/[^\u4e00-\u9fa5\w]/g;
        let _this=this;
        if(reg.test(val)){
          val=val.replace(reg,"");
          _this.$set(_this.formInfo,"chatgroupName",val);
        }
      },
      //单行选择好友
      handleItemFriendsChange(value){
        let _this=this;
        let ids=[];
        let list=value;
        list.map((v,k)=>{
          ids.push(v.contactWxUserName);
        });
        _this.tableCheckFriends=ids;
      },

       // 批量删除
      deleteGroup(){
        let _this=this;
        let ids=_this.editIds;
        let tableList=_this.tableList;
        _this.tableList=tableList.filter((v,k)=>{
          return ids.indexOf(v.wxUserId)==-1;
        });
        _this.$message.success("删除成功");
        _this.subTotalFriends();
        _this.hideModel();
      },
      //统计所有好友数量
      subTotalFriends(){
        let _this=this;
        let total=0;
        let tableList=_this.tableList;
        tableList.map((v,k)=>{
          if(v.all){
            total+=v.notchatroomContactCount;
          }else{
            if(v.startTime){
              if(v.checkFriends.length==0){
                total+=v.notchatroomContactCount;
              }else{
                total+=v.checkFriends.length;
              }
            }else{
              total+=v.checkFriends.length;
            }
          }
        });
        this.subNumber=total;
      },
      //提交计划后清空数据;
      clearInfo(){
        let _this=this;
        _this.formInfo={
          taskName:"",
          defaultPserson:40,
          maxTimes:"",
          defaultNumber:"",
          chatgroupName:"",
          chatRadio:"1",
          friendRadio:"1",
          dateTime:_this.getDefaultTime()
        };
        _this.tableList=[];
        _this.editIds=[];

        _this.showCodeList=[];
        _this.uploadCodeList=[];
        _this.checkCodeList=[];
        _this.codeSelectIds=[];
        _this.codeTextStatus=0;

        _this.sysCheckLabelList=[];


        _this.searchForm={
          roomName:"",
          searchDate:""
        };
        _this.chatStartTime="";
        _this.chatEndTime="";
        _this.sizeMaxNum=0;
        _this.hideModel();
      },
      //提交快速创建群聊计划
      submitData(){
        let _this=this;
        let formInfo=_this.formInfo;
        let planTable=[];
        let wxids=[];
        let codeList=_this.showCodeList;
        let submitCodeList=[];
        let contactLabelId=[];
        let sysCheckLabelList=_this.sysCheckLabelList;
        let tabIndex=_this.tabIndex;
        let data={};
        let checkList=_this.checkCodeList;
        let sourceList=[];
        checkList.map((v,k)=>{
          let info={};
          info.key=`QRCODE_ROOMID_${v.sQrcode}`;
          info.value=v.roomUserName;
          sourceList.push(info);
        });
        sysCheckLabelList.map((v,k)=>{
          if(v.check){
            contactLabelId.push(v.wxContactLabelId);
          }
        });

        codeList.map((v,k)=>{
          if(v.isQrcode||v.isGroup){
            let info={};
            info.qrCode=v.sQrcode;
            info.roomUserName=v.roomUserName;
            submitCodeList.push(info);
          }
        });
        //批量拉人入群
        let parmas={
          maxMember:formInfo.defaultPserson*1,//群聊限制人数
          planName: formInfo.taskName,//任务名称
          //maxTimes:formInfo.maxTimes,
          qrCodeInfo:submitCodeList,//二维码,
          useChatName:_this.useChatName,
          useCodeChatName:_this.useCodeChatName,
          planKey:formInfo.chatgroupName+new Date().getTime()
        };
        if(_this.useChatName){
          parmas.roomname=formInfo.chatgroupName;//群名称
          parmas.roomnameFigure=formInfo.defaultNumber;//群序号
        };
        if(tabIndex==0){
          let groupId=[];
          let sysGroupList=_this.sysGroupList;
          sysGroupList.map((v,k)=>{
            v.list.map((i,j)=>{
              if(i.check){
                groupId.push(i.wx_user_group_id);
              };
            })
          });
          parmas.selectType=1;//选择类型
          parmas.contactLabelId=contactLabelId;//标签
          if(formInfo.chatRadio==1){
            parmas.isAllWxUser=1;
          }else{
            parmas.isAllWxUser=2;
            parmas.groupId=groupId;
          };
          if(formInfo.friendRadio==1){
            parmas.isAllContact=1;
          }else{
            parmas.isAllContact=2;
            parmas.startDate=_this.filterDateTime(formInfo.dateTime[0]);
            parmas.endDate=_this.filterDateTime(formInfo.dateTime[1]);
          };
          data = {
            taskTemplateName: "批量拉人入群",
            // taskTemplateName: "扫码szc",
            planParams:JSON.stringify(parmas),
            wxIds:"-1"
          };
        }else if(tabIndex==1){
          let tableList=_this.tableList;
          let newTable=[];
          tableList.map((v,k)=>{
            newTable.push({
              wxid:v.wxUserId,
              chatroomname:v.roomUserName,
              contacts:v.checkFriends,
              startHour:v.startHour?v.startHour*1:"",
              endHour:v.endHour?v.endHour*1:""
            });
            wxids.push(v.wxUserId);
          });
          parmas.wxCount=tableList.length;
          parmas.contactCount=_this.subNumber*1;
          parmas.wxUserInfos=newTable;
          parmas.selectType=2;//选择类型
          data = {
            taskTemplateName: "批量拉人入群",
            // taskTemplateName: "扫码szc",
            planParams:JSON.stringify(parmas),
            wxIds:wxids.toString()
          };
        };
        let str = {
          param: JSON.stringify(data)
        };
        // if(sourceList.length!=0){
        //   _this.$redis.string.set(checkList);
        // };
        _this.$http('plan/start_plan','POST',str).then(res=>{
          if(res.data.error_code == 0) {

            _this.$message.success('快速建群计划提交成功');
            _this.clearInfo();
          } else {
            _this.$message.warning(res.data.error_message)
          }
        })
      },
      //提交校验
      submit(){
        let _this=this;
        let formInfo=_this.formInfo;
        let terminalIdJson={};
        let terminalIds=[];
        let tableList=_this.tableList;
        let showCodeList=_this.showCodeList;
        let newList=[];
        let ids=_this.codeSelectIds;
        let checkLen=0;
        let unCheckLen=0;
        let sysGroupList=_this.sysGroupList;
        showCodeList.map((v,k)=>{
          if(v.isQrcode){
            newList.push(v);
            if(v.checkStatus==1){
              checkLen++;
            }else{
              unCheckLen++;
            }
          }
        });
        if(formInfo.taskName==""){
          _this.$message.warning("请填写任务名称");
          return;
        };
        if(formInfo.defaultPserson==""){
          _this.$message.warning("请填写群聊限制人数");
          return;
        };
        // if(formInfo.maxTimes==""){
        //   _this.$message.warning("请填写建群限制次数");
        //   return;
        // };
        if(_this.useChatName){
          if(formInfo.chatgroupName==""){
            _this.$message.warning("请填写群聊名称");
            return;
          };
          if(formInfo.defaultNumber==""){
            _this.$message.warning("请填写群聊序号");
            return;
          };
        };
        if(_this.tabIndex==0){
          if(_this.formInfo.chatRadio==2){
            if(sysGroupList.length==0){
              _this.$message.warning("暂无分组可选，请选择默认全部微信");
              return;
            }else{
              let len=0;
              sysGroupList.map((v,k)=>{
                v.list.map((i,j)=>{
                  if(i.check){
                    len++;
                  }
                });
              });
              if(len==0){
                _this.$message.warning("请选择分组");
                return;
              };
            }
          };
          if(_this.formInfo.friendRadio==2){
              if(!Array.isArray(_this.formInfo.dateTime)){
                _this.$message.warning("请选择好友通过时间");
                return;
              }
          };
        };
        if(_this.tabIndex==1){
          if(_this.selectUser.length==0){
            _this.$message.warning("请添加微信号");
            return;
          };
          if(_this.subNumber<3){
            _this.$message.warning("至少得有3个好友才能建群");
            return;
          };
        }
        if(_this.showCodeList.length!=0){
          if(!_this.submitCheckFlag){
            _this.$message.warning("正在检查群二维码无法提交，请稍后");
            return;
          };
          if(_this.codeTextStatus!=2&&newList.length!=0){
            _this.$message.warning("请先检查群二维码");
            return;
          };
          if(unCheckLen>0){
            _this.$message.warning("请删除手动上传未检查或检查失败的二维码");
            return;
          }
          if(checkLen!=newList.length){
            _this.$message.warning("请删除未检查成功的二维码");
            return;
          }
        };
        tableList.map((v,k)=>{
          if(!terminalIdJson[v.terminalId]){
            terminalIdJson[v.terminalId]=1;
            terminalIds.push(v.terminalId);
          }else{
            terminalIdJson[v.terminalId]++;
          }
        });
        // if(terminalIds.length>1){
        //   _this.$message.warning("不同终端的微信号无法提交建群任务");
        //   return;
        // };
        _this.$store.dispatch("showDialog",{
          flag:"submitData",
          title:"提交",
          content:"确定要提交快速建群任务吗？",
          showCancel:true
        });
      },
      handleCheckFriendsAllChange(val){
        let checkFriendsInfo=this.checkFriendsInfo;
        let ids=[];
        for(let i=0;i<this.friendsList.length;i++){
          ids.push(this.friendsList[i].contact_wxuser_name)
        };
        checkFriendsInfo.checkedFriends = val ? ids : [];
        checkFriendsInfo.isIndeterminate = false;
        this.checkFriendsInfo=checkFriendsInfo;
      },
      handleCheckedFriendsChange(value){
        let checkFriendsInfo=this.checkFriendsInfo;
        let checkedCount = value.length;
        checkFriendsInfo.checkFriendsAll = checkedCount === this.friendsList.length;
        checkFriendsInfo.isIndeterminate = checkedCount > 0 && checkedCount < this.friendsList.length;
        this.checkFriendsInfo=checkFriendsInfo;
      },
      //提交单行朋友选择数据
      submitFriends(){
        let _this=this;
        let checkFriendsInfo=_this.checkFriendsInfo;
        let item=_this.tableList[checkFriendsInfo.idx];
        let ids=_this.tableCheckFriends;
        if(_this.friendsList.length!=0){
          if(ids.length==0){
            _this.$message.warning("请至少选择1个好友");
            return;
          };
          if(ids.length!=_this.friendsList.length){
            item.all=false;
            item.checkFriends=ids;
          }else{
            if(item.startTime){
              item.all=false;
            }else{
              item.all=true;
            };
            item.checkFriends=[];
          };
          _this.$set(_this.tableList,checkFriendsInfo.idx,item);
          _this.subTotalFriends();
          _this.showFriendList=false;
          _this.tableCheckFriends=[];
        }else{
          _this.showFriendList=false;
        }
      },
      //删除单行数据
      deleteItem(){
        let _this=this;
        _this.tableList.splice(_this.deleteIndex,1);
        _this.$message.success("删除成功");
        _this.subTotalFriends();
        _this.hideModel();
      },
      //批量操作，今日新增
      submitTime(){
        let _this=this;
        let tableList=_this.tableList;
        if(_this.startTime==""||_this.startTime==null){
          _this.$message.warning("请选择开始时间");
          return;
        }
        if(_this.endTime==""||_this.endTime==null){
          _this.$message.warning("请选择结束时间");
          return;
        };
        _this.getTableList('filterTimes');
      },
      //批量操作，选择全部好友
      checkAllFriend(){
        let _this=this;
        _this.getTableList('all');
      },
      //微信账号是否全选
      userToggleCheck(val){
        // let flag=val;
        // let tree=this.$refs.diatree;
        // let idArr=[];
        // this.selectUser = [];
        // if(flag){
        //   tree.setCheckedNodes(this.userList);
        // }else{
        //   tree.setCheckedNodes([]);
        // }
        // let nodes = tree.getCheckedNodes(true);
        // nodes.map((item,index)=>{
        //   idArr.push(item.id);
        //   this.selectUser.push({
        //     id:item.id,
        //     index:index,
        //     name:item.name
        //   })
        // });
        // this.selectIds=idArr;
        // this.selectTotal = this.selectUser.length;
        let flag=val;
        let tree=this.$refs.diatree;
        let idArr=[];
        let userList=this.userList;
        this.selectUser = [];
        if(flag){
          let user=[];
          userList.map((i)=>{
            i.children.map((j)=>{
              j.children.map((k)=>{
                user.push({
                  id:k.id,
                  name:k.name
                });
              })
            })
          });
          if(user.length>this.createMax){
            user=user.filter((v,k)=>{
              return k<this.createMax
            });
            tree.setCheckedNodes(user);
          }else{
            tree.setCheckedNodes(userList);
          }
        }else{
          tree.setCheckedNodes([]);
        }
        let nodes = tree.getCheckedNodes(true);
        nodes.map((item,index)=>{
          idArr.push(item.id);
          this.selectUser.push({
            id:item.id,
            index:index,
            name:item.name
          })
        });
        this.selectIds=idArr;
        this.selectTotal = this.selectUser.length;
      },
      //获取微信账号
      getUserInfo(callback){
        let _this=this;
        let userTotal=0;
        if(_this.getInfoFlag){
          _this.getInfoFlag=false;
          _this.$http("/group_wxuser_new", "GET").then(res => {
            if(res.data.error_code==0){
              let list = res.data.data.result;
              let total=0;
              for(let i=0;i<list.length;i++){
                for(let k=0;k<list[i].children.length;k++){
                  for(let j=0;j<list[i].children[k].children.length;j++){
                    total+=1;
                  }
                }
              };
              _this.userList=list;
              _this.userTotal=total;
              callback&&callback();
            }
            _this.getInfoFlag=true;
          }).catch(err => {
            console.log(err);
            _this.getInfoFlag=true;
          });
        }

      },
      //统计微信账号是否全选
      getTotal(){
        let userList=this.userList;
        let total=0;
        for(let i=0;i<userList.length;i++){
          for(let k=0;k<userList[i].children.length;k++){
            for(let j=0;j<userList[i].children[k].children.length;j++){
              total+=1;
            }
          }
        };
        if(total>this.createMax){
          total=this.createMax;
        };
        return total;
      },
      nodeClick(node,b,c){ // 微信账号节点选择
        let nodes = this.$refs.diatree.getCheckedNodes(true);
        let idArr=[];
        if(nodes.length>=this.createMax){
          nodes=nodes.filter((v,k)=>{
            return k<this.createMax;
          });
        }
        this.selectUser = [];
        nodes.map((item,index)=>{
          idArr.push(item.id);
          this.selectUser.push({
            id:item.id,
            index:index,
            name:item.name
          })
        });
        this.selectIds=idArr;
        if(nodes.length==this.getTotal()){
          this.checkAll=true;
        }else{
          this.checkAll=false;
        }
        this.$refs.diatree.setCheckedNodes(nodes);
        this.selectTotal = this.selectUser.length;
      },
      //提交微信账号选择
      checkUser(){
        let _this=this;
        if(_this.selectUser.length==0){
          _this.$message.warning("请选择微信号");
          return;
        };
        _this.getTableList();
      },
      forMatNumber(num){
        return num<10?"0"+num:num;
      },
      //获取表格列表数据
      getTableList(type){
        let _this=this;
        let parmas={};
        let startTime="",endTime="";
        if(type){
          if(type=="filterTimes"){
            let aDate=new Date();
            let year=aDate.getFullYear();
            let month=aDate.getMonth()+1;
            let date=aDate.getDate();
            startTime=year+"-"+_this.forMatNumber(month)+"-"+_this.forMatNumber(date)+" "+_this.startTime+":"+"00";
            endTime=year+"-"+_this.forMatNumber(month)+"-"+_this.forMatNumber(date)+" "+_this.endTime+":"+"00";
            parmas={
              ids:_this.editIds,
              startTime:startTime,
              endTime:endTime
            };
          }else if(type="all"){
            parmas={
              ids:_this.editIds
            };
          }
        } else{
          parmas={
            ids:_this.selectIds
          };
        };
        _this.$http("task_chatroom/task_chatroom_wxuser", "POST", parmas).then(res => {
          if (res.data.error_code == 0) {
            let list=res.data.data;
            if(type){
              if(type=="filterTimes"){
                let ids=_this.editIds;
                let tableList=_this.tableList;
                list.map((v,k)=>{
                  v.all=false;
                  v.checkFriends=[];
                  v.startTime=startTime;
                  v.endTime=endTime;
                  v.startHour=_this.startTime.split(":")[0];
                  v.endHour=_this.endTime.split(":")[0];
                });
                tableList.map((v,k)=>{
                  if(ids.indexOf(v.wxUserId)>-1){
                    let item=list[ids.indexOf(v.wxUserId)];
                    _this.$set(_this.tableList,k,item);
                  };
                });
                _this.startTime="00:00";
                _this.endTime="24:00";
              }else if(type=="all"){
                let ids=_this.editIds;
                let tableList=_this.tableList;
                list.map((v,k)=>{
                  v.all=true;
                  v.checkFriends=[];
                });
                tableList.map((v,k)=>{
                  if(ids.indexOf(v.wxUserId)>-1){
                    let item=list[ids.indexOf(v.wxUserId)];
                    _this.$set(_this.tableList,k,item);
                  };
                });
              }
            }else{
              list.map((v,k)=>{
                v.all=true;
                v.checkFriends=[];
              });
              _this.tableList =list;
            };
            _this.subTotalFriends();
            _this.hideModel();
          }else{
            this.$message.error(res.data.error_message);
          }
        }).catch((err)=>{
          this.$message.error("获取列表失败");
        });
      },
      //表格多选框选择
      handleSelectionChange(selection){
        let ids=[];
        let list=selection;
        list.map((v,k)=>{
          ids.push(v.wxUserId);
        });
        this.editIds=ids;
      },
      //显示弹窗
      showModel(type,title,row,index){
        let _this=this;
        let arr=["todayAdd","deleteGroup","all","friend","user"];
        if(arr.indexOf(type)==-1){
          _this.$store.dispatch("showDialog",{
            title:title,
            flag:type,
            showCancel:true
          });
        };
        switch(type){
          case "todayAdd":
          case "all":
          case "deleteGroup":
            if(_this.editIds.length==0){
              _this.$message.warning("请选择要操作的数据");
              return;
            };
            _this.$store.dispatch("showDialog",{
              title:title,
              flag:type,
              showCancel:true
            });
            break;
          case "friend":
            let parmas={
              roomUserName:row.roomUserName,
              userId:row.userId,
              wxUserId:row.wxUserId
            };
            if(!row.all){
              parmas.startTime=row.startTime;
              parmas.endTime=row.endTime;
            };
            _this.$http('/task_chatroom/notexist_chatroom_contacts','POST',parmas).then(res=>{
              if(res.data.error_code == 0) {
                let list=res.data.data;
                let ids=[];
                list.map((v,k)=>{
                  ids.push(v.wxUserId);
                });
                _this.friendsList =list;
                _this.checkFriendsInfo={
                  checkedFriends:ids,
                  checkFriendsAll:true,
                  idx:index
                };
                _this.showFriendList=true;
                _this.$nextTick(()=>{
                  if(row.all){
                    _this.$refs.friendList.toggleAllSelection();
                  }else{
                    let checkFriends=row.checkFriends;
                    if(row.startTime&&checkFriends.length==0){
                      _this.$refs.friendList.toggleAllSelection();
                    }else{
                      list.map((v,k)=>{
                        if(checkFriends.indexOf(v.contactWxUserName)>-1){
                          _this.$refs.friendList.toggleRowSelection(v,true);
                        };
                      })
                    }
                  }
                });
              }else{
                _this.$message.error(res.data.error_message);
              }
            });
            break;
          case "user":
            _this.getUserInfo(()=>{
              _this.$store.dispatch("showDialog",{
                title:title,
                flag:type,
                showCancel:true
              });
              _this.$nextTick(()=>{
                _this.$refs.diatree.setCheckedKeys(_this.selectIds);
                if(_this.selectIds.length==_this.getTotal()){
                  _this.checkAll=true;
                }else{
                  _this.checkAll=false;
                }
              });
            });
            break;
          case "delete":
            _this.deleteIndex=index;
            break;
          case "label":
            let sysCheckLabelList=this.sysCheckLabelList;
            this.sysLabelList.map((v,k)=>{
              if(sysCheckLabelList.indexOf(v)==-1){
                v.check=false;
              }
            });
            break;
        }
      },
      hideModel(){
        this.$store.dispatch("hideDialog");
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../style/css/base.scss";
  #group {
    .form-info{
      overflow: hidden;
      margin-bottom: 20px;
      ul{
        overflow: hidden;
      }
      li{
        margin-top:20px;
        display: flex;
        .label{
          width: 100px;
          font-size: 14px;
          color:#666;
          text-align: right;
          margin-right: 10px;
          line-height: 30px;
        }
        .info{
          flex:1;
          span{
            font-size: 14px;
            color:#666;
          }
          .add-btn{
            margin-top: 5px;
            cursor: pointer;
          }
          dl{
            max-height: 250px;
            overflow: hidden;
            overflow-y: auto;
            display: inline-block;
            padding-right: 30px;
            dd{
              font-size: 14px;
              color:#666;
              display: flex;
              align-items: center;
              margin-top: 5px;
              em{
                display: block;
                width: 120px;
                background-color: #eee;
                height: 30px;
                line-height: 30px;
                padding:0 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .remove-btn{
                margin-left: 10px;
                width: 20px;
                cursor: pointer;
              }
            }
          }
        }
        .tab-group{
          display: flex;
          .tab-item{
            width: 200px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            color:#666;
            cursor: pointer;
            border:solid 1px #eee;
          }
          .active{
            color:$t-color;
            border:solid 1px $t-color;
          }
        }
        .tab-cnt-group{
          overflow: hidden;
          padding:5px 0;
          width: 100%;
          .group{
            display: flex;
            .radio-item{
              display: flex;
              overflow: hidden;
              margin-bottom: 5px;
              line-height: 30px;
              padding-left: 5px;
            }
            label{
              line-height: 30px;
              margin-right: 0;
              padding-right: 30px;
            }
            .null-group{
              font-size: 13px;
              color:#989696;
              display:block;
              line-height: 30px;
            }
          }
          .group-list{
            max-height: 160px;
            overflow: hidden;
            overflow-y: auto;
            .box{
              display: flex;
              .group-name{
                width: 120px;
                height: 30px;
                line-height: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border:solid 1px #c1c0c0;
                text-align: center;
                color:#666;
                cursor: pointer;
                user-select: none;
                border-radius: 5px;
              }
              .group-name.active{
                color:$t-color;
                border:solid 1px $t-color;
              }
              .group-name.disabled{
                cursor: not-allowed;
              }
              .group-item{
                flex:1;
                margin-left: 10px;
                span{
                  display: inline-block;
                  vertical-align: middle;
                  padding:0 15px;
                  height: 30px;
                  line-height: 30px;
                  text-align: center;
                  border:solid 1px #c1c0c0;
                  box-sizing: border-box;
                  margin-right: 10px;
                  cursor: pointer;
                  user-select: none;
                  margin-bottom: 5px;
                  border-radius: 5px;
                }
                span.active{
                  color:$t-color;
                  border:solid 1px $t-color;
                }
                span.disabled{
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      }
      li.margin-t0{
        margin-top: 0;
      }
    }
    .red{
      color:#f00;
    }
    .reset-item{
      font-size: 20px;
      color:#f00;
      vertical-align: middle;
      margin-left: 5px;
      cursor: pointer;
    }
    .group-total{
      font-size: 14px;
      color:#666;
      margin:20px 0;
      span{
        color:$t-color;
      }
    }
    .qrcode-group{
      border:solid 1px #eee;
      padding:10px;
      overflow: hidden;
      ul{
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        max-height: 310px;
        overflow-y: auto;
        li{
          margin-right:10px;
          margin-bottom: 10px;
          overflow: hidden;
          .code-pic{
            width: 100px;
            height: 100px;
            overflow: hidden;
            img{
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .code-pic.border-red{
            border:solid 1px #f00;
          }
          .code-pic.border-normal{
            border:solid 1px $t-color;
          }
          .btn-group{
            font-size: 13px;
            text-align: center;
            margin-top: 10px;
            span{
              margin:0 2px;
              color:#1585f9;
              cursor: pointer;
            }
          }
          .info{
            font-size: 12px;
            color:#409eff;
            text-align: center;
            margin-top: 10px;
          }
          .info.red{
            color:#f00;
          }
        }
      }
      .code-type{
        font-size: 14px;
        color:#333;
        line-height: 24px;
        span{
          color:#409eff;
          cursor: pointer;
          text-decoration: underline;
        }
        .check-code{
          margin-left: 20px;
        }
      }
    }
    .submit{
      margin-top: 10px;
    }
    .warning-info{
      margin-top: 20px;
      overflow: hidden;
      p{
        line-height: 24px;
        font-size: 13px;
        color:#666;
      }
    }
    .init-dialog{
      .dia-tree{
        padding-top: 30px;
        padding-bottom: 0;
        .check-all{
          text-align: left;
          padding:0 24px;
        }
        .tree{
          width: 400px;
          border: 1px solid #e5e5e5;
          height: 320px;
          margin:0 auto;
          font-size: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .total{
          color:$t-color;
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: 16px;
          .notice{
            font-size: 14px;
            margin-top: 10px;
            display: block;
          }
        }
      }
    }
    .upload-code{
      .file-list{
        width: 400px;
        height: 140px;
        margin:20px auto 0;
        overflow: hidden;
        border:solid 1px #eee;
        ul{
          padding:0 20px;
          overflow: hidden;
        }
        li{
          display: flex;
          margin:10px auto;
          span{
            flex:1;
            text-align: left;
            padding-left: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
          }
          .el-icon-close{
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover{
              color:$t-color;
            }
          }
        }
      }
    }
    .dialog-content {
      .create {
        text-align: left;
        .user-list {
          height: 240px;
          overflow: hidden;
          .add-new {
            color: #409eff;
            margin-left: 5px;
          }
        }
        p.null {
          font-size: 14px;
          text-align: center;
          line-height: 100px;
        }
        p.np {
          font-size: 14px;
          margin-top: 5px;
          line-height: 20px;
          color: #f00;
          visibility: hidden;
        }
        p.show-note {
          visibility: visible;
        }
        .launch-list {
          height: 240px;
          overflow: hidden;
          border: solid 1px #eee;
          padding: 10px;
          box-sizing: border-box;
          user-select: none;
          .item {
            font-size: 14px;
            margin: 8px 0;
            cursor: pointer;
            padding: 0 5px;
          }
          .item.active {
            color: #57aaff;
          }
        }
      }
    }
    .label-dialog{
      .label-box{
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        span{
          padding:0 15px;
          height: 30px;
          line-height: 30px;
          border:solid 1px #eee;
          margin:0 10px;
          font-size: 14px;
          margin-bottom: 10px;
          border: 1px solid transparent;
          cursor: pointer;
          background-color: rgba(144,147,153,.1);
          border-color: rgba(144,147,153,.2);
          border-radius: 5px;
          user-select: none;
        }
        .active{
          border-color:rgba(64,158,255,.2);
          color: #fff;
          background-color: rgba(64,158,255,1);
        }
      }
    }
  }
</style>
