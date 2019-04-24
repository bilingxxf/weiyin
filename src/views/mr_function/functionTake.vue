<template>
  <div id="friendTake" class="main-body">
    <div class="main-wrapper-type2">
      <div class="page-title">
        <span>发朋友圈</span>
      </div>
      <div class="group flex-center">
        <div class="group-text font-default">选择发布账号</div>
        <div class="group-body" @click="handleFansTask">
          <img src="../../assets/images/add.png">
        </div>
      </div>
      <div class="group" v-if="newFriend.length!=0">
        <div class="group-text">账号</div>
        <div class="group-body account-list">
          <el-scrollbar class="scroll-bar">
            <ul>
              <li v-for="(item,index) in newFriend" :key="index">{{item.name}}</li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div class="group" style="margin-top:30px;">
        <div class="group-text font-default">发布内容</div>
      </div>
      <div class="group">
        <div class="group-text font_color">文字</div>
        <div class="group-body">
          <el-input type="textarea" class="ele-textarea" placeholder="请输入内容" v-model="friendsterData.takeText" resize="none"></el-input>
        </div>
      </div>
      <!--<div class="group" v-if="!isDisabledUpload">-->
      <!--<div class="group-text font_color">本地图片</div>-->
      <!--<div class="group-body" style="width:470px">-->
      <!--<el-upload-->
      <!--:disabled="isDisabledUpload"-->
      <!--:action="uploadUrl"-->
      <!--accept="image/jpeg,image/png"-->
      <!--:on-success="suc"-->
      <!--:auto-upload="true"-->
      <!--ref="uploadFriend"-->
      <!--:on-preview="handlePictureCardPreview"-->
      <!--:on-change="onBeforeUpload"-->
      <!--:before-upload="beforeUploadFriend"-->
      <!--:on-remove="removeUploadImg"-->
      <!--list-type="picture-card"-->
      <!--:limit="maxPiece">-->
      <!--<i class="el-icon-plus"></i>-->
      <!--</el-upload>-->
      <!--<el-dialog :visible.sync="dialogVisible">-->
      <!--<img width="100%" :src="dialogImageUrl" alt="">-->
      <!--</el-dialog>-->
      <!--<p style="color:#666;font-size:12px;margin-top:10px;margin-bottom:10px;">(gif格式无法上传)</p>-->
      <!--</div>-->
      <!--</div>-->
      <div class="group flex-center" v-if="materIstrue">
        <div class="group-text font_color">素材库</div>
        <div class="group-body">
          <img src="../../assets/images/add.png" @click="routeQuery">
        </div>
      </div>
      <div class="group flex-center">
        <div class="group-text font_color">执行时间</div>
        <div class="group-body">
          <el-time-picker
          size="small"
          :editable="false"
          :clearable="false"
            v-model="startTime"
            :picker-options="{
              selectableRange: startTimeOptions.selectableRange
            }"
            placeholder="选择执行时间">
          </el-time-picker>
        </div>
      </div>
      <div class="source-list">
        <ul>
          <li>
            <div class="routerImgBox" v-for="(item, index) in imgUploadArr" :key="index"> <!-- 素材 -->
              <el-checkbox class="routeCheckbox" v-model="item.checked" :checked="item.checked" @change="changeUploadImg(item,index)"></el-checkbox>
              <img  class="routeImg" :src="item.url" alt="" @click="setUploadImg(item,index)">
            </div>
          </li>
          <li>
            <div class="routerImgBox" v-for="(item, index) in shareImg" :key="index"> <!-- 转发 -->
              <el-checkbox class="routeCheckbox" v-model="item.checked" :checked="item.checked" @change="changeUploadImg(item,index)"></el-checkbox>
              <img  class="routeImg" :src="item.url" alt="" @click="setUploadImg(item,index)">
            </div>
          </li>
          <li>
            <div ckass="routerImgBox">
              <div class="routerImgBox" v-for="(item, index) in videoUploadArr" :key="index">
                <el-checkbox class="routeCheckbox" v-model="item.checked" :checked="item.checked" @change="changeUploadImg(item,index)"></el-checkbox>
                <video controls="controls" width="100%" height="100%">
                  <source :src="item.url" type="audio/ogg" />
                  <source :src="item.url" type="video/mp4" />
                  你的浏览器不用支持video
                </video>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="submit">
        <el-button type="primary" class="ele-btn" @click="savePlan" :disabled="sendButton">提交</el-button>
        <!-- <el-button type="primary" class="ele-btn">定时发送</el-button> -->
      </div>
      <!-- <div class="main">
          <ul class="upload">
              <li>
                <span>图片来源(或直接上传)</span>
                <el-button type="primary" @click="routeQuery" :disabled="routeMater">素材管理</el-button>
              </li>
              <li style="width:625px;">
                <div class="routerImgBox" v-for="(item, index) in imgUploadArr" :key="index"> 素材
                  <el-checkbox class="routeCheckbox" v-model="item.checked" :checked="item.checked" @change="changeUploadImg(item.url,item.checked,index,item.type)"></el-checkbox>
                  <img  class="routeImg" :src="item.url" alt="" @click="setUploadImg(item.url,item.checked,index,item.type)">
                </div>
              </li>
              <li style="width:625px;">
                <div class="routerImgBox" v-for="(item, index) in shareImg" :key="index"> 转发
                  <el-checkbox class="routeCheckbox" v-model="item.checked" :checked="item.checked" @change="changeUploadImg(item.url,item.checked,index,item.type)"></el-checkbox>
                  <img  class="routeImg" :src="item.url" alt="" @click="setUploadImg(item.url,item.checked,index,item.type)">
                </div>
              </li>
              <li style="width:625px;">
                <div ckass="routerImgBox">
                   <div class="routerImgBox" v-for="(item, index) in videoUploadArr" :key="index">
                    <el-checkbox class="routeCheckbox" v-model="item.checked" :checked="item.checked" @change="changeUploadImg(item.url,item.checked,index,item.type)"></el-checkbox>
                    <video controls="controls" width="200px" height="200px">
                      <source :src="item.url" type="audio/ogg" />
                      <source :src="item.url" type="video/mp4" />
                      你的浏览器不用支持video
                    </video>
                  </div>
                </div>
              </li>
              <li>
                  <span>图片</span>
              </li>
              <li style="width:470px;">
                  <div class="uploadModel" v-if="isDisabledUpload" @click="tipUploadImg">
                    <i class="el-icon-plus"></i>
                  </div>
                  <el-upload
                      v-if="!isDisabledUpload"
                      :disabled="isDisabledUpload"
                      :action="uploadUrl"
                      accept="image/jpeg,image/gif,image/png"
                      :on-success="suc"
                      :auto-upload='true'
                      ref="uploadFriend"
                      :on-preview="handlePictureCardPreview"
                      :on-change="onBeforeUpload"
                      :before-upload="beforeUploadFriend"
                      :on-remove="removeUploadImg"
                      list-type="picture-card"
                      :limit="maxPiece">
                      <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
              </li>
              <li v-if="false">
                <span>分享链接</span>
              </li>
              <li>
                <p class="shareName" v-if="false">{{shareHref}}</p>
              </li>
              <div class="btnbox">
                  <el-button size="small" plain @click="savePlan">立即发送</el-button>
                  <el-button size="small" plain>定时发送</el-button>
              </div>
          </ul>
      </div> -->
    </div>
    <!-- 弹框 -->
    <!-- <transition-group name="fade">
        <div class="modal" v-show="fansTaskShow" :key="1">
            <div class="camilo">
                <div class="modal-header">
                    <h2>添加账号
                        <span @click="fansTaskShow= false,mask = false">
                          <img src="../../assets/images/whiteClose.png" alt="" style="width:20px;height:20px;position:relative;top:5px;">
                        </span>
                    </h2>
                </div>
                <div class="modal-body">
                    <div class="search"> -->
    <!-- <el-input placeholder="请输入搜索关键字" v-model="input4">
        <template slot="append" @click="searchContent">搜索</template>
    </el-input> -->
    <!-- <el-input @change="getFriendInfo(3)" placeholder="请输入微信昵称" suffix-icon="el-input__icon el-icon-search" v-model="wxorname" style="height:32px;">
      <template slot="append" @click="getFriendInfo(3)">搜索</template>
    </el-input> -->
    <!-- </div> -->
    <!-- <div class="content">
        <div class="left">
            <el-scrollbar class="scroll-bar">
              <el-tree
                :data="tableData"
                show-checkbox
                node-key="id"
                ref="tree"
                @check="nodeClick"
                highlight-current
                :check-on-click-node="true"
                :props="defaultProps">
              </el-tree>
            </el-scrollbar>
        </div>
    </div>
</div>
<div class="modal-footer">
    <el-button class="ele-btn" type="primary" @click="sendAcount">确认</el-button>
</div>
</div>
</div>
</transition-group> -->
    <Dialog @callback="sendAcount" v-if="dialogFlag == 'fanTask'" @cancelCallback="cancelCallback">
      <div class="dialog-content modal-body check-account" slot="content" style="padding:30px 0 40px;">
        <div class="content">
          <div class="left">
            <div class="check-all" v-if="tableData.length!=0">
              <el-checkbox v-model="checkAllAccount" @change="toggleCheck">全选</el-checkbox>
            </div>
            <el-scrollbar class="scroll-bar" style="height:calc(100% - 20px);height:-webkit-calc(100% - 20px);">
              <el-tree
                :data="tableData"
                show-checkbox
                node-key="id"
                ref="tree"
                @check="nodeClick"
                highlight-current
                :check-on-click-node="true"
                :props="defaultProps">
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </Dialog>
    <!-- 蒙板 -->
    <div class="mask" v-show="mask" style="z-index:110"></div>
    <!--选择图片来源-->
    <el-dialog
      title="请选择图片来源"
      :visible.sync="imgUpload"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="imgUpload = false">取 消</el-button>
            <el-button type="primary" @click="imgUpload = false">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from "axios";
  import {config} from "../../api/http.js";
  import Dialog from '../../components/dialog.vue'
  import dayjs from 'dayjs'

  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'


  const cityOptions = [];
  const groupIdOptions = [];

  export default {
    data() {
      return {
        sendButton:false,
        publicUrl: config.resourceUrl,
        wxorname: "",
        pop: "",
        isImage: false,
        newFriend: [],
        newUserid: [],
        nickName: [],
        selectTableData: [],
        tableData: [],
        data: [],
        ableSelect: [],
        friendsterData: {
          takeText: "",
          takeImage: []
        },
        checkbox: [],
        user_id: null,
        tableNew: [],
        mask: false,
        fansTaskShow: false, // 弹框
        fansTaskTime: false,
        valueTime: "",
        input4: "",
        maxPiece: 9, //图片最大张数
        dialogImageUrl: "", //上传
        dialogVisible: false, //上传
        imgUpload: false,
        // startTime:`${new Date(new Date().setMinutes((new Date().getMinutes()+5)))}`,/** 发圈时间 */
        startTime:dayjs().add(5,'minute'),
        startTimeOptions:{
          selectableRange:`${new Date().getHours()}:${new Date().getMinutes() + 5}:00}-23:59:59`
        },
        //复选框
        checkAll: false,
        checkedCities: "",
        cities: cityOptions,
        isIndeterminate: true,
        uploadUrl: "",
        //分组账号
        checkAll_two: false,
        checkedCities_two: ["账号一"],
        groupId: groupIdOptions,
        isIndeterminate_two: true,
        keyUrl: [],
        postTime: 0,
        keyCode: 0,
        userkeyUrl: [],
        files: [],
        task_template_list:[],
        imgUploadArr: [], //路由传过来的图片路径
        videoUploadArr: [], // 路由传过来的 视频路径
        isDisabledUpload: true,
        routeUploadImgArr: [],
        routeUploadVideoArr: [],
        shareHref:'11',
        shareImg: [],
        shareText: '',
        shareImgSelect: [],
        routeMater: false,
        task_Id: '', // 发圈ID
        defaultProps:{
          children: 'children',
          label: 'name'
        },
        nodeChildren: [],
        nodeParent: [],
        nodeKeys: [],
        materIstrue: true,
        checkAllAccount:false,
        selectIds:[],
        selectUser:[],
        showIds:[]
      };
    },
    watch: {
      $route(to,from){
        // console.log(from)
        if(to.name !== 'mr_functionTake') {

        } else {
          // this.getResources();
          this.getFriendInfo();
          // this.getId()
        }
      }
    },
    components:{
      Dialog
    },
    computed:{
      ...mapState([
        'dialogFlag',
        'accountList'
      ])
    },
    methods: {
      getTotal(){
        let tableData=this.tableData;
        let total=0;
        for(let i=0;i<tableData.length;i++){
          for(let k=0;k<tableData[i].children.length;k++){
            for(let j=0;j<tableData[i].children[k].children.length;j++){
              total+=1;
            }
          }
        };
        return total;
      },
      toggleCheck(val){
        let flag=val;
        let tree=this.$refs.tree;
        let idArr=[];
        this.selectUser = [];
        if(flag){
          tree.setCheckedNodes(this.tableData);
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
          });
        });
        this.selectIds=idArr;
      },
      nodeClick(node,b,c){ // 发圈账号选择
        // let nodesParent = this.$refs.tree.getCurrentNode()
        let nodes = this.$refs.tree.getCheckedNodes(true);
        if(nodes.length==this.getTotal()){
          this.checkAllAccount=true;
        }else{
          this.checkAllAccount=false;
        }
        // let idArr=[];
        // this.selectUser = []
        // this.nodeChildren = nodes
        // nodes.map((item,index)=>{
        //   idArr.push(item.id);
        //   this.selectUser.push({
        //     id:item.id,
        //     index:index,
        //     name:item.name
        //   })
        // });
        // this.selectIds=idArr;
        //sessionStorage.setItem('zh',JSON.stringify(this.nodeChildren))
      },
      setUploadImg(item,index){  // 判断是从素材选择的图片还是 转发选择的图片
        if(this.$route.query.id == '1') { // 素材
        // console.log(this.imgUploadArr)
          this.imgUploadArr[index].checked = !item.checked;
          if(!item.checked) {
            this.imgUploadArr[index].checked = false
            // console.log(this.imgUploadArr)
          }
          // this.changeUploadImg(val,checked,index,type)
        } else if(this.$route.query.id == '2') { //转发
          // console.log(this.shareImg)
          this.shareImg[index].checked = !item.checked
          this.changeUploadImg(item,index);
        }
      },
      removeUploadImg(file,fileList){
        this.routeMater = false
      },
      routeQuery(){ // 跳转素材管理
        this.$router.push({
          name: 'mr_functionMaterial',
          query:{
            id: 1,
            isTrue: false,//素材管理按钮是否可用
            takeText: this.friendsterData.takeText, //保存发圈文本,
            checkAllAccount:this.checkAllAccount
          }
        })
        if(this.friendsterData.takeText == '') {

        }else {
          sessionStorage.setItem('wz',JSON.stringify(this.friendsterData.takeText))
        }
      },
      changeUploadImg(item,index){// 选择上传的图片
        // console.log(val,checked,index,type)
        // this.routeUploadImgArr = []
        // if(item.type == 'png' || item.type == 'jpg' || item.type == 'jpeg' || item.type == 'JPG' || item.type == 'PNG' || item.type == 'JPEG') {
        //   if(!item.checked){
        //     this.routeUploadImgArr.push({
        //       url: item.url
        //     })
        //     this.friendsterData.takeImage.push(item.url)
        //   } else {
        //     this.friendsterData.takeImage.splice(index,1);
        //   }
        //   console.log(this.friendsterData.takeImage);
        // } else if(item.type == 'mp4'){
        //   if(checked){
        //     this.routeUploadVideoArr.push({
        //       url: item.url
        //     })
        //   } else {
        //     this.routeUploadVideoArr.splice(index,1)
        //   }
        // } else if(type == 'share') {
        //   if(checked){
        //     this.shareImgSelect.push({
        //       url: itrm.url
        //     })
        //   } else {
        //     this.shareImgSelect.splice(index,1)
        //   }
        // }

      },
      tipUploadImg(){
        if(this.imgUploadArr.length > 0){
          // console.log(1)
          this.$message({
            message: '已经选择素材无法上传图片',
            type: 'warning'
          })
          return false
        }
        if(this.$route.query.info !== {}) {
          this.$message({
            message: '转发无法上传图片',
            type: 'warning'
          })
          return false
        } else {
          this.$message({
            message: '已选择视频',
            type: 'warning'
          })
        }

      },
      onBeforeUpload(file) {
        this.files.push(file)
        // this.friendsterData.wx_username = []
        // const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png" || 'image/PNG' || 'image/jpg';
        // const isLt1M = file.size / 1024 / 1024 < 1;

        // if (!isIMAGE) {
        //   this.$message.error("上传文件只能是图片格式!");
        // }
        // if (!isLt1M) {
        //   this.$message.error("上传文件大小不能超过 1MB!");
        // }
        // return isIMAGE && isLt1M;
      },
      // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
        } else {
          return "";
        }
      },
      /*朋友圈记录*/
      toFriendRecord() {
        this.$router.push("mr_functionRecord");
        sessionStorage.removeItem('zh')
      },
      toFriendManage(){
        this.$router.push("mr_functionContent");
        sessionStorage.removeItem('zh')
      },
      //上传
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      /*立即发送*/

      /*获取当前年月日*/
      gainDate() {
        let y =(new Date().getFullYear())<10? '0'+(new Date().getFullYear()):(new Date().getFullYear())
        let m =((new Date().getMonth() + 1))<10? '0' + ((new Date().getMonth() + 1)): ((new Date().getMonth() + 1))
        let d =(new Date().getDate())<10? '0' + (new Date().getDate()):(new Date().getDate())
        let h =(new Date().getHours())<10? '0' + (new Date().getHours()):(new Date().getHours())
        let f =(new Date().getMinutes())<10? '0'+(new Date().getMinutes()):(new Date().getMinutes())
        let s =(new Date().getSeconds())<10? '0'+(new Date().getSeconds()):(new Date().getSeconds())
        return (this.friendsterData.time =
            y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        );

      },
      //发朋友圈
      beforeUploadFriend(file) {
        const isJPG = file.type === 'image/jpeg' || "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        switch(file.type) {
          case 'image/gif':
            return false
            break
          case 'application/x-msdownload':
            return false
            break
          case  'application/x-zip-compressed':
            return false
            break
          case 'application/msword':
            return false
            break
          case 'text/plain':
            return false
            break
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return false
            break
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return false
            break
          case 'application/vnd.ms-excel':
            return false
            break
          default:
            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 或 PNG格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
      },
      //确认
      sendAcount() {
        let _self = this;
        _self.fansTaskShow = false;
        _self.mask = false;
        let nodesParent = this.$refs.tree.getCurrentNode()
        let nodes = this.$refs.tree.getCheckedNodes(true);
        let idArr=[];
        this.nodeKeys = []
        this.nickName = []
        this.newFriend = []
        this.selectUser = []
        this.nodeChildren = nodes
        nodes.map((item,index)=>{
          idArr.push(item.id);
          this.newFriend.push({
            id:item.id,
            index:index,
            name:item.name
          })
        });
        this.showIds=idArr;
        sessionStorage.setItem('zh',JSON.stringify(nodes))
        this.$store.dispatch("hideDialog")
      },
      //搜索
      searchContent() {
        let _self = this;
        let arr = [];
        _self.cities.map(item => {
          if (item.indexOf(_self.input4) !== -1) {
            arr.push(item);
          }
        });
      },
      savePlan() { // 立即发送
        if (this.newFriend.length == 0) {
          this.$message({
            message: "请选择账号",
            type: "warning"
          });
          this.sendButton = false;
          return false;
        } else {
          this.sendButton = true;
          this.takemore()
          sessionStorage.removeItem('zh')
          sessionStorage.removeItem('wz')
        }
      },
      getTemplateId(){ // 获取任务ID
        this.$http('task_template',"GET",{
          page:1,
          per_page:9999
        }).then(res=>{
          let data = res.data.data;
          this.templateId = data.result;
          data.result.map((item, index)=>{
            if(item.task_template_name == '计划发圈') {
              this.task_Id = item.task_template_id
            }
          })
        }).catch(err=>{
          console.log(err)
        })
      },
      /*保存计划   */
      takemore() { // 发圈
        // this.gainDate();
        if(this.$route.query.id == '1') { // 发圈素材
          // console.log('转发图片',this.friendsterData.takeImage)
          this.friendsterData.takeImage = []
          for(let i = 0; i< this.imgUploadArr.length; i++) {
            let arr = [];
            if(this.imgUploadArr[i].checked){
              arr.push(this.imgUploadArr[i].url,
                this.imgUploadArr[i].smallVal,
                this.imgUploadArr[i].width,
                this.imgUploadArr[i].height,
                this.imgUploadArr[i].size*1)
              this.friendsterData.takeImage.push(arr)
            }
          }
        }

        if(new Date(this.startTime).getDay() !== new Date().getDay()){
          this.$message({
            message: "执行时间需为当天",
            type: "warning"
          });
          this.sendButton = false;

          return;
        }

        if(new Date(this.startTime).getTime() <= new Date().getTime()){
          this.$message({
            message: "执行时间不能为过去的时间",
            type: "warning"
          });
          this.sendButton = false;

          return;
        }


        if (this.friendsterData.takeText == "" && this.friendsterData.takeImage.length == 0 ) {
          this.$message({
            message: "请输入内容或上传图片",
            type: "warning"
          });
          this.sendButton = false;
          return;
        }
        if(this.$route.query.id == '2') { // 转发
          this.friendsterData.takeImage = [];
          for(let i = 0; i < this.shareImg.length;i++){
            if(this.shareImg[i].checked){
              this.friendsterData.takeImage.push(this.shareImg[i].url)
            }
          }
        }
        let wxids = []
        for(let t = 0; t < this.newFriend.length; t ++){
          wxids.push(this.newFriend[t].id)
        }
        var timestamp = new Date().getTime();
        this.friendsterData['takeKey'] = timestamp+sessionStorage.getItem('user_id');
        let plan_params = JSON.stringify(this.friendsterData);
        let data = {
          "fatherPlanId": 0,
          'mode': 0,
          'planParams':plan_params,
          "enumWxaccountSource": 2,
          "planName": '计划发圈',
          "templateId": this.task_Id,
          "remainDays": 1,
          "repeatDays": 1,
          "taskRepeatTimes":1,
          "wxGroupIds":'',
          'startTime': dayjs(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
          "wxids": wxids.toString()
        };
        // console.log(data)
        this.$http('plan/','POST',data).then((res)=>{
          if(res.data.error_code == 0) {
            this.$message({
              message:'提交成功',
              type:'success'
            })
            this.submitTaskShow = false
            this.$router.push("mr_functionRecord");
            this.$store.dispatch("hideDialog");
          }
        }).catch(err=>{
          this.$message({
            message:'提交失败',
            type:'error'
          })
        })
      },
      // takeFriend(item) {
      //   let setTakeFriend = ""
      //   this.task_template_list.forEach(item =>{
      //     if(item.task_template_name==="发送朋友圈多图"){
      //       setTakeFriend=item.task_template_id
      //     }
      //   })
      //   this.$http("task/create_task", "POST", {
      //     task_template_name: "发送朋友圈多图",
      //     task_template_id: setTakeFriend,
      //     enum_wxaccount_source: 2,
      //     account_list: [item]
      //   })
      //     .then(res => {
      //       if (res.data.error_code == 0) {
      //         this.specifyInput = "";
      //         this.$message({
      //           message: "执行成功",
      //           type: "success"
      //         });
      //         this.friendsterData.takeText == "";
      //         this.$router.push("mr_functionRecord");
      //       } else {
      //         this.$message({
      //           message: "执行失败" + res.data.error_message,
      //           type: "error"
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       this.$message({
      //         message: "执行失败" + err,
      //         type: "error"
      //       });
      //     });
      // },
      //获取上传图片
      getResources() {
        axios
          .get(
            this.publicUrl+'api/v1/usekey?type=tyc_sendpost&key=' +
            sessionStorage.getItem("user_id")
          )
          .then(res => {
            if (res.data.code == 0) {
              let data = res.data.data;
              this.tableNew = JSON.parse(data);
            } else {
            }
          })
          .catch(err => {});
      },
      getSelectionChange(val) {
        this.newFriend = [];
        this.newUserid = [];
        this.nickName = [];
        // this.friendsterData.nickName = [];
        this.selectTableData = val;
        val.forEach((item,index) => {
          this.newFriend.push({
            id:item.wx_user_id,
            index:index
          });
          this.newUserid.push(item.wx_username);
          this.nickName.push(item.nickname ? item.nickname : item.wx_username);
          // this.friendsterData.nickName.push(
          //   item.nickname ? item.nickname : item.wx_username
          // );
        });
        this.selectNumber = val.length;
        sessionStorage.setItem('zh',JSON.stringify(this.newFriend))
      },
      //获取发圈账户
      getFriendInfo() {
        let _this=this;
        _this.$http("/group_wxuser_new", "GET").then(res => {
          let list = res.data.data.result;
          _this.tableData=list;
        }).catch(err => {
          console.log(err);
        });
        // this.$http("/group_wxuser", "GET")
        //   .then(res => {
        //     this.tableData = []
        //     let data = res.data.data.result;
        //     for(let i = 0; i< data.length;i++){
        //       if(data[i].children !== undefined&&data[i].children.length!=0) {
        //         this.tableData.push(data[i]);
        //       }
        //
        //     }
        //   })
        //   .catch(err => {});
      },
      suc(item) {
        let tip = Math.round(Math.random() * 101);
        this.materIstrue = false
        this.uploadUrl =
          this.publicUrl+'api/v1/file?type=tyc_sendpostImg&key=' +
          sessionStorage.getItem("user_id") +
          tip;
        this.routeMater = true
        if (this.keyUrl.length > 9) {
          return false;
        } else {
          this.keyUrl.push({
            url: this.uploadUrl,
            keys: sessionStorage.getItem("user_id") + tip
          });
          this.userkeyUrl.push({
            keys: sessionStorage.getItem("user_id") + tip
          });
          this.httpImg(this.keyUrl[this.postTime].keys)
          this.postTime++
        }
      },
      httpImg(keys) { // 上传
        // this.friendsterData.wx_username = []
        axios.get(this.publicUrl+"api/v1/usekey?type=tyc_sendpostImg&key=" +keys)
          .then(res => {
            if (res.data.code == 0) {

              let data = res.data.data;
              if ((this.isImage = true)) {
                clearTimeout(this.pop);
              }
              let data2 = res.data.data;
              let img = data2.substr(data2.length-3, 3);
              if (
                img == "jpg" ||  img == "png" || img == 'peg' || img == 'JPG' || img == 'PEG' || img == 'PNG'
              ) {
              } else {
                this.$message({
                  message: "必须上传图片",
                  type: "error"
                });
                return false;
              }
              this.friendsterData.takeImage.push(data);
              // this.friendsterData.content = this.newFriend;
            } else {

            }
          })
          .catch(err => {});
      },
      getId(){ // ID 不同执行不同
        let id = this.$route.query.id
        if(id == '0') {//朋友圈管理跳转
          this.isDisabledUpload = false
          return false
        }
        if(id == '5') { // 朋友圈记录跳转
          this.isDisabledUpload = false
          return false
        }
        if(id == '1') { // 素材
          let imgArr = this.$route.query.imgUrlArr
          let videoArr = this.$route.query.videoUrlArr
          console.log(imgArr)
          if( imgArr == undefined ) {

          } else {
            let arr = JSON.parse(imgArr)
            console.log(arr)
            arr.map((item,index)=>{
              // console.log(item)
              item['checked'] = true
              this.imgUploadArr.push(item)
              this.friendsterData.takeImage.push(item.url);
              // console.log(this.imgUploadArr)
            })
            console.log('默认去过的图片',this.friendsterData.takeImage)
            this.nodeKeys = []
            this.nickName = []
            this.newFriend = []
            let nickname = sessionStorage.getItem('zh');
            let t = JSON.parse(nickname)
            //this.friendsterData.wx_username.push(item.wx_username)
            //this.friendsterData.nickName.push(item.nickname)
            for(let i = 0; i<t.length;i++){
              this.newFriend.push({
                id:t[i].id
              })
              this.nickName.push({
                name:t[i].name
              })
              this.nodeKeys.push(t[i].id)
              this.$refs.tree.setCheckedKeys(this.nodeKeys)
            }
            // console.log(this.friendsterData.takeImage)
          }
          if(videoArr == undefined) {

          } else {
            this.videoUploadArr = JSON.parse(videoArr)
          }
          if(this.imgUploadArr.length >= 1 || this.videoUploadArr.length  == 1) {
            this.isDisabledUpload = true
          }  else {
            this.isDisabledUpload = false
          }
          let takeText = sessionStorage.getItem('wz');
          if(takeText == null ){

          }else {
            // let str = takeText.replace(/\"/g, "")
            // let str1 = str.replace(/[\r\n]/g,"")
            // console.log(str)
            // console.log(str1)
            this.friendsterData.takeText = this.$route.query.takeText
          }

        } else if(id == '2'){ //转发
          if(this.$route.query.info == undefined) {

          } else {
            let  shareArr = JSON.parse(this.$route.query.info)
            // console.log(shareArr)
            shareArr.originalImgs.map((item,index)=>{
              // console.log(item)
              item['checked'] = true
              this.shareImg.push({
                url:item,
                type: 'share'
              })
            })
            this.friendsterData.takeText = shareArr.text
            this.shareNum = shareArr.wxUserId
            this.routeMater = true
          }
        } else {
          this.isDisabledUpload = false
        }
      },
      handleFansTask(){ // 选择发布账号
        let id = this.$route.query.id;
        let checkAllAccount=this.$route.query.checkAllAccount;
        this.$store.dispatch("showDialog",{
          title:'选择发布账号',
          flag:'fanTask'
        });
        if(id == '1') { // 素材
          // this.nodeKeys = []
          // this.nickName = []
          // this.newFriend = []
          let nickname = sessionStorage.getItem('zh');

          if(nickname){
            let t = JSON.parse(nickname)
            for(let i = 0; i<t.length;i++){
              this.newFriend.push({
                id:t[i].id
              })
              this.nickName.push({
                name:t[i].name
              })
              this.nodeKeys.push(t[i].id)
              this.$nextTick(()=>{
                this.$refs.tree.setCheckedKeys(this.nodeKeys)
              })
            }
            this.checkAllAccount=checkAllAccount;
          }
        }else{
          this.$nextTick(()=>{
            this.$refs.tree.setCheckedKeys(this.showIds);
            if(this.showIds.length==this.getTotal()){
              this.checkAllAccount=true;
            }else{
              this.checkAllAccount=false;
            }
          });
        }
      },
      cancelCallback(){
        this.$store.dispatch("hideDialog")
      }
    },
    mounted() {
      // this.getResources();
      this.getFriendInfo();
      this.getTemplateId(); // 发圈任务ID
      //上传图片地址
      let tip = Math.round(Math.random() * 101);
      this.uploadUrl =
        this.publicUrl+"api/v1/file?type=tyc_sendpostImg&key=" +
        sessionStorage.getItem("user_id") +
        tip;
      this.keyUrl.push({
        url: this.uploadUrl,
        keys: sessionStorage.getItem("user_id") + tip
      });
      //获取任务列表
      // this.$http("task_template", "GET",{
      //   per_page:99999,
      //   page:1

      // })
      //   .then(res => {
      //     if (res.data.error_code == 0) {
      //       this.task_template_list = res.data.data.result;
      //     } else {
      //       this.$message({
      //         message: "获取列表失败:" + res.data.error_message,
      //         type: "error"
      //       });
      //     }
      //   }).catch(err => {});

      // 获取路由中的参数
      let id = this.$route.query.id
      if(id == '0') {//朋友圈管理跳转
        this.isDisabledUpload = false
        return false
      }
      if(id == '5') { // 朋友圈记录跳转
        this.isDisabledUpload = false
        return false
      }
      if(id == '1') { // 素材
        let imgArr = this.$route.query.imgUrlArr
        let videoArr = this.$route.query.videoUrlArr
        if( imgArr == undefined ) {

        } else {
          let arr = JSON.parse(imgArr)
          arr.map((item,index)=>{
            item['checked'] = true
            this.imgUploadArr.push(item)
            //this.friendsterData.takeImage.push(item.url)
          })
          // console.log(this.friendsterData.takeImage)
          this.nodeKeys = []
          this.nickName = []
          this.newFriend = []
          let nickname = sessionStorage.getItem('zh');
          if(nickname){
            let t = JSON.parse(nickname)
            //this.friendsterData.wx_username.push(item.wx_username)
            //this.friendsterData.nickName.push(item.nickname)
            for(let i = 0; i<t.length;i++){
              this.newFriend.push({
                id:t[i].id
              })
              this.nickName.push({
                name:t[i].name
              })
              this.nodeKeys.push(t[i].id)
              // this.$refs.tree.setCheckedKeys(this.nodeKeys)

            }
            this.newFriend=JSON.parse(nickname);
          }
          // console.log(this.friendsterData.takeImage)
        }
        if(videoArr == undefined) {

        } else {
          this.videoUploadArr = JSON.parse(videoArr)
        }
        if(this.imgUploadArr.length >= 1 || this.videoUploadArr.length  == 1) {
          this.isDisabledUpload = true
        }  else {
          this.isDisabledUpload = false
        }
        let takeText = sessionStorage.getItem('wz');
        if(takeText == null ){

        }else {
          this.friendsterData.takeText = this.$route.query.takeText
          //  this.friendsterData.takeText = takeText.replace(/\"/g, "");
        }

      } else if(id == '2'){ //转发
        if(this.$route.query.info == undefined) {

        } else {
          let  shareArr = JSON.parse(this.$route.query.info)
          shareArr.originalImgs.map((item,index)=>{
            this.shareImg.push({
              url:item,
              type: 'share',
              checked: true
            })
            this.friendsterData.takeImage.push(item)
          })
          this.friendsterData.takeText = shareArr.text
          this.shareNum = shareArr.wxUserId
          this.routeMater = true
        }
      } else {
        // console.log('直接进来了')
        this.isDisabledUpload = false
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../style/css/base.scss';
  #friendTake {
    .page-title{
      margin-bottom: 30px;
    }
    .check-account{
      .check-all{
        text-align: left;
        padding:0 24px;
      }
    }
    .group{
      overflow: hidden;
      display: flex;
      margin-bottom: 20px;
      .group-text{
        min-width: 4em;
        margin-right: 10px;
        font-size: 12px;
        color:#888;
      }
      .group-body{
        img{
          cursor: pointer;
        }
      }
      .font-default{
        font-size: 15px;
        color:#666;
      }
      .group-btn{
        display: flex;
        align-items:center;
        span{
          margin-right: 10px;
        }
      }
    }
    .group.flex-center{
      align-items:center;
    }
    .account-list{
      width: 450px;
      height: 150px;
      border:solid 1px #dcdfe6;
      border-radius: 4px;
      overflow-x:hidden;
      box-sizing:border-box;
      padding:5px;
      ul{
        overflow: hidden;
        padding:0 5px;
        li{
          font-size: 14px;
          line-height: 24px;
        }
      }
    }
    .source-list{
      width: 660px;
      overflow: hidden;
      .routerImgBox{
        float:left;
        width: 200px;
        height: 200px;
        margin-right: 20px;
        border:solid 1px $t-color;
        position: relative;
        margin-bottom: 20px;
        .routeCheckbox{
          position: absolute;
          left:5px;
          top:5px;
          z-index: 2
        }
        img{
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .submit{
      padding-top: 20px;
      overflow: hidden;
    }
    //弹框样式
    .modal{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .camilo {
        width: 600px;
        // height: 570px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -260px;
        margin-top: -280px;
        z-index: 150;
        background: #fff;
        box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
        border-radius: 5px;
        .modal-header {
          height: 56px;
          position: relative;
          padding: 10px 15px;
          background: #409eff;
          color: #fff;
          text-align: center;
          border-radius: 6px 6px 0 0;
          border-bottom: 1px solid #e5e5e5;
          h2 {
            font-size: 18px;
            position: relative;
            line-height: 33px;
            span {
              position: absolute;
              right: 0px;
              cursor: pointer;
              padding: 0px 10px;
            }
          }
        }
        .modal-footer {
          padding: 20px;
          line-height: 20px;
          text-align: center;
          color: #73879c;
          .el-button{
            width: 90px;
            height: 30px;
            margin-top: 5px;
            font-size: 12px;
            line-height: 0;
          }
        }
      }
    }
  }
  //已选账号
  .goodsList {
    width: 450px;
    height: 150px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    overflow: auto !important;
    color:#666;
  }
  .avatar-uploader {
    width: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .uploadModel{
    width: 148px;
    height: 148px;
    border: 1px dashed #c0ccda;
    line-height: 148px;
    text-align: center;
    border-radius: 6px;
    background-color: #fbfdff;
    vertical-align: top;
    .el-icon-plus{
      font-size: 28px;
      color: #8c939d;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item-actions{
    display: none !important;
  }
  .font_color{
    color:#666!important;
  }
  .modal-body {
    padding: 40px 40px 0;
    line-height: 20px;
    text-align: center;
    color: #73879c;
    .search{
      width:298px;
      margin: 0 auto;
      .typeBackground{
        background-color: #409EFF !important;
        border-color: #409EFF !important;
        color: #fff;
        border-radius: 0;
      }
    }
    .hosting{
      margin-top: 30px;
      font-size: 16px;
      line-height: 25px;
      padding: 5px 15px;
    }
    .content{
      width: 400px;
      height: 320px;
      margin:0px auto;
      border: 1px solid #e5e5e5;
      h3{
        line-height: 40px;
        border-bottom: 1px solid #e5e5e5;
      }
      .left{
        // width: 50%;
        height: 320px;
        // float: left;
        font-size: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        // border-right: 1px solid #e5e5e5;
        // border-bottom: 1px solid #e5e5e5;
        ul>li{
          padding-left: 20px;
          text-align: left;
          line-height: 40px;
          border-bottom: 1px solid #e5e5e5;
        }
      }
      .right{
        width: 50%;
        height: 320px;
        font-size: 12px;
        overflow: auto;
        float: right;
        border-bottom: 1px solid #e5e5e5;
      }
    }
    .total{
      height:45px;
      line-height:30px;
      color:#58bc9c;
    }
  }
</style>
