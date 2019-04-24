<template>
	<div class="panel p-content material main-body" >
		<div class="material-content main-wrapper" style="background:#fff">
			<div class="page-title">
				<el-tabs v-model="topActiveName" @tab-click="topHandleClick" style="width:100%;">
					<el-tab-pane label="　素材管理　"  style="font-size:14px;;color:#666;" name="selfMaterial">
						<div class="groupSelect">
							<div class="left">
								<span style="font-size:14px;color:#888">选择分组：</span>
								<el-select v-model="groupValue" class="ele-select" placeholder="请选择分组" @change="changeSelectName">
									<el-option
										v-for="item in selectGroup"
										:key="item.groupId"
										:label="item.groupName +'('+item.userName+')'"
										:value="item.groupId">
									</el-option>
								</el-select>	
							</div>
							<div class="right">
								<el-button v-if="isTrue == 'true' || isTrue == true" class="addNewGroup ele-btn" type="primary" @click="addNewGroup">新建分组</el-button>
								<el-button v-if="isTrue == 'true' || isTrue == true" class="delGroupSelecet ele-btn" type="primary" @click="delNewGroup">编辑分组</el-button>
								<el-button v-if="isTrue == 'true' || isTrue == true" class="uploadToUrl ele-btn" type="primary" @click="uploadImgToSystem">导入</el-button>
								<el-button v-else-if="isTrue == 'false' || isTrue == false" :disabled="isDisabled" class="uploadToUrl ele-btn" type="primary" @click="routerQuery">确认</el-button>
							</div>
						</div>
						<div class="main">
							<div class="p-top-nav">
								<el-tabs v-model="activeName" @tab-click="handleClick">
									<!-- <el-tab-pane label="　图片　"  style="font-size:14px;;color:#666;" name="second"> -->
										<!-- 图片 -->
									<p class="is-null" v-if="imgsList.length==0">暂无数据</p>
									<div>
										<el-col class="uoloadImgCard"  :span="8" v-for="(item, index) in imgsList" :key="index" :offset="index > 0 ? 1 : 1">
											<el-checkbox v-if="id == '1'" class="ChoiceImg" :checked="item.checked" v-model="item.checked" @change="changeImg(item.materialPath,item.materialSmallPath,groupUrl,index,item.checked,item.materialType,item.materialWidth,item.materialHeight,item.materialSize)"></el-checkbox>
											<el-card :body-style="{ padding: '0px'}" shadow="never">
												<div style="width:200px;height:200px;overflow:hidden;">
													<img :src="groupUrl+item.materialSmallPath" class="image" @click="cardCheck(item.materialPath,item.materialSmallPath,groupUrl,index,item.checked,item.materialType,item.materialWidth,item.materialHeight,item.materialSize)">
												</div>
												<div style="text-align:center">
													<span class="cardNmae">{{item.materialName}}</span>
													<el-button type="text" @click="showModel('download','下载',item)">下载</el-button>
													<el-button type="text" @click="showModel('delete','删除',item)">删除</el-button>
													<el-button type="text" @click="moveNewGroup(item.materialId)">修改分组</el-button>
												</div>
											</el-card>
										</el-col>
									</div>
									<!-- </el-tab-pane> -->
									<!-- <el-tab-pane label="　视频　" name="first">
										<p class="is-null" v-if="videoList.length==0">暂无数据</p>
										<el-col class="uoloadImgCard" :span="8" v-for="(item, index) in videoList" :key="index" :offset="index > 0 ? 1 : 1">
											<el-checkbox v-if="id == '1'" class="ChoiceImg" v-model="item.checked" :checked="item.checked" @change="changeImg(item.materialPath,item.materialSmallPath,groupUrl,index,item.checked,item.materialType,item.materialSize)"></el-checkbox>
												<el-card  :body-style="{ padding: '0px'}" shadow="never">
														<video controls="controls" width="200px" height="200px">
															<source :src="groupUrl+item.materialPath" type="audio/ogg" />
															<source :src="groupUrl+item.materialPath" type="video/mp4" />
															你的浏览器不用支持video
														</video>
													<div style="text-align:center">
														<span class="cardNmae">{{item.materialName}}</span>
														<el-button type="text" @click="showModel('download','下载',item)">下载</el-button>
														<el-button type="text" @click="showModel('delete','删除',item)">删除</el-button>
													</div>
												</el-card>
											</el-col>
									</el-tab-pane> -->
								</el-tabs>
							</div>
						<!-- 分页  -->
						<div class="pagination" v-if="imgsList.length!=0||videoList.length!=0">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page.sync="page" :page-size="currentPage1"  layout="total, prev, pager, next" :total="total">
							</el-pagination>
						</div>
				<!--上传-->
						<el-dialog
							title="图片上传"
							:visible.sync="dialogVisible"
							@close="close"
							width="30%">
							<div class="ensure" style="position:absolute;top:83px;right:25px;">
								<el-button type="primary" class="ele-btn" @click="submitUpload">确 定</el-button>
							</div>
								<el-upload
									ref="uploadImg"
									class="upload-demo"
									action="111"
									:http-request="httpUpLoadRquest"
									:before-upload="beforeUpLoadImg"
									:on-progress="uploadVideoProcess"
									:on-success="successUpload"
									:on-error="errEve"
									:on-remove="removeUpload"
									multiple
									:limit="999	"
									:auto-upload="false"
									list-type="picture"
									:file-list="fileList">
									<el-button size="small" class="ele-btn" type="primary">点击上传</el-button>
									<el-select v-model="groupUploadValue" class="ele-select" placeholder="请选择">
										<el-option
											v-for="item in uploadGroup"
											:key="item.groupId"
											:label="item.groupName+'('+item.userName+')'"
											:value="item.groupId">
										</el-option>
									</el-select>
									<div slot="tip" class="el-upload__tip upload-tip">只能上传图片格式jpg/png文件<br />图片不能超过2M,请勿修改图片后缀名,否则发送朋友圈可能失败</div>
								</el-upload>
						</el-dialog>
						<!--新建组-->
						<Dialog @callback="confirmHandle" v-if="dialogFlag == 'newAdd'">
							<div class="dialog-content group" slot="content">
							<p><em>分组名称：</em><el-input class="ele-input" v-model="addNewgroupName" placeholder="请输入分组名称"></el-input></p>
							</div>
						</Dialog>
						<!--删除编辑分组-->
						<Dialog @callback="confirmdelModel" @cancelCallback="cancel" v-if="dialogFlag == 'delGroup'">
							<div class="dialog-content group better-scrollbar" slot="content" style="padding:10px 0 40px;">
								<el-table
									:data="delGroup"
									style="width: 100%;margin-top:0;"
									class="ele-dialogTable-init"
									height="350"
									min-height="140">
									<el-scrollbar class="scroll-bar">
										<el-table-column label="分组名" align="center" width="210">
											<template slot-scope="scope">
												<el-tooltip :open-delay="350" effect="light" content="双击编辑" placement="bottom-end" :offset="80">
													<span v-if="!scope.row.showEdit" @dblclick="handelEdit(scope.$index, scope.row, $event)" style="display:block;">{{ scope.row.groupName }}({{scope.row.userName}})</span>
													<el-input v-if="scope.row.showEdit" @change="watchEdit(scope.row)" @blur="blurIsTrue(scope.$index,scope.row)" :autofocus="true" v-model='scope.row.groupName' class="ele-input"></el-input>
												</el-tooltip>
											</template>
										</el-table-column>
										<el-table-column label="操作" align="center">
											<template slot-scope="scope">
												<el-button size="mini" type="text" :disabled="scope.row.groupName == '默认'" @click="mergeGroup(scope.row)">合并分组</el-button>
												<el-button  v-if="scope.row.showBtn"  @click="handelComfirm(scope.$index, scope.row)"  type="text" size="mini">保存修改</el-button>
												<el-button size="mini" type="text" :disabled="scope.row.groupName == '默认'" @click="delGroupSelect(scope.row)">删除分组</el-button>
											</template>
										</el-table-column>
									</el-scrollbar>
								</el-table>
							</div>
						</Dialog>
						<!--合并分组-->
						<Dialog @callback="mergeGroupHandle" @cancelCallback="cancel"  v-if="dialogFlag == 'merge'">
							<div class="dialog-content group" slot="content">
								<p>
									<em>选择分组:</em> 
									<el-select v-model="groupDelValue" class="ele-select" placeholder="请选择">
										<el-option
											v-for="item in delGroup"
											:key="item.groupId"
											:label="item.groupName+'('+item.userName+')'"
											:value="item.groupId">
										</el-option>
									</el-select>
								</p>
							</div>
						</Dialog>
						<!--移动-->
						<Dialog @callback="moveGroupHandle"  v-if="dialogFlag == 'move'">
							<div class="dialog-content group" slot="content">
								<p>
									<em>选择分组:</em> 
									<el-select v-model="groupMoveValue" class="ele-select" placeholder="请选择">
										<el-option
											v-for="item in moveGroup"
											:key="item.groupId"
											:label="item.groupName+'('+item.userName+')'"
											:value="item.groupId">
										</el-option>
									</el-select>		
								</p>
							</div>
						</Dialog>
						<Dialog @callback="downloadImg" v-if="dialogFlag == 'download'">
							<div class="dialog-content group" slot="content">
								<p>确定要下载该素材吗？</p>
							</div>
						</Dialog>
						<Dialog @callback="deleteImgMp4" v-if="dialogFlag == 'delete'">
							<div class="dialog-content group" slot="content">
								<p>确定要删除该素材吗？</p>
							</div>
						</Dialog>
					</div>
				</el-tab-pane>
				<el-tab-pane label="　公共素材　"  style="font-size:14px;;color:#666;" name="publicMaterial">
					<div class="left" style="display:inline-block;">
						<span style="font-size:14px;color:#888">选择分组：</span>
						<el-select v-model="groupPublicValue" class="ele-select" placeholder="请选择分组" @change="changeSelectName">
							<el-option
								v-for="item in selectPublicGroup"
								:key="item.groupId"
								:label="item.groupName"
								:value="item.groupId"
								>
							</el-option>
						</el-select>	
					</div>
					<div class="right" style="display:inline-block;float:right;">
							<el-button v-if="isTrue == 'false' || isTrue == false" :disabled="isDisabled" class="uploadToUrl ele-btn" type="primary" @click="routerQuery">确认</el-button>
					</div>
					<div class="main">
						<div class="p-top-nav">
							<p class="is-null" v-if="imgsList.length==0">暂无数据</p>
							<div style="width:100%;">
								<el-col class="uoloadImgCard"  :span="8" v-for="(item, index) in imgsList" :key="index" :offset="index > 0 ? 1 : 1">
									<el-checkbox v-if="id == '1'" class="ChoiceImg" :checked="item.checked" v-model="item.checked" @change="changeImg(item.materialPath,item.materialSmallPath,groupUrl,index,item.checked,item.materialType,item.materialWidth,item.materialHeight,item.materialSize)"></el-checkbox>
									<el-card :body-style="{ padding: '0px'}" shadow="never">
										<div style="width:200px;height:200px;overflow:hidden;">
											<img :src="groupUrl+item.materialSmallPath" class="image" @click="cardCheck(item.materialPath,item.materialSmallPath,groupUrl,index,item.checked,item.materialType,item.materialWidth,item.materialHeight,item.materialSize)">
										</div>
										<div style="text-align:center">
											<span class="cardNmae">{{item.materialName}}</span>
											<el-button type="text" @click="showModel('download','下载',item)">下载</el-button>
										</div>
									</el-card>
								</el-col>
							</div>
						</div>
					</div>
					<div class="pagination" v-if="imgsList.length!=0||videoList.length!=0">
						<el-pagination @size-change="handleSizeChange" @current-change="handlePublicChange" :current-page.sync="page" :page-size="currentPage1"  layout="total, prev, pager, next" :total="total">
						</el-pagination>
					</div>
					<Dialog @callback="downloadImg" v-if="dialogFlag == 'download'">
						<div class="dialog-content group" slot="content">
							<p>确定要下载该素材吗？</p>
						</div>
					</Dialog>
				</el-tab-pane>
			</el-tabs>
		</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Dialog from "../../components/dialog.vue";
	import {config} from "../../api/http.js";
  	import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
	export default {
		components:{
			Dialog
		},
		data() {
			return {
				showName: 'add',
				contentText: true,
				selectGroup: [],
				editGroup:[],
				delGroup: [],
				uploadGroup: [],
				moveGroup: [],
				groupValue: '',
				groupDelValue: '',
				groupEditValue: '',
				groupUploadValue: '',
				groupMoveValue: '',
				groupMoveid: '',
				currentPage1: 10, //分页
				activeName: "second",
				checkAll: false,
				isIndeterminate: false,
				dialogVisible: false,
				checkedImages: [],
				images: [],
				fileList: [],
				imgsList: [],
				videoList: [],
				addNewgroupName: '',
				userID: '',
				videoFlag: false,
				page: 1 ,
				current: 10,
				type: '0',
				imgUrl: '',
				groupUrl:'',
				imgPostUploadGroupName: '',
				total: 0,
				isTrue: true,
				id: 0,
				tabLable: '图片',
				queryStringArrImg: [],
				queryStringArrVideo: [],
				isDisabled: false,
				selectImg:[],
				takeText: '',
				imgNameInp: '',
				groupId: '',
				nameDisabled: true,
				rowGroup: '',
				materialPath:'',
				materialSmallPath:'',
				checkAllAccount:false,
				pagingSwitch:false,
				childUserId:[],
				childUserList:[],
				downloadPath:"",
				deletePath:"",
				topActiveName:"selfMaterial",
				selectPublicGroup:[],
				groupPublicValue:""
			};
		},
    computed: {
      ...mapState(["dialogFlag"])
    },
		mounted() {
			this.groupUrl =  config.materTestUrl
			this.imgUrl = config.materTestUrl
			if(sessionStorage.getItem('indentity')==='ROLE_USER'){
				this.getChilAccountList();
			}else{
				this.getGroupselectList()
			}
			this.takeText = this.$route.query.takeText
     		this.checkAllAccount = this.$route.query.checkAllAccount
			sessionStorage.removeItem('selectImg');
			this.userID = sessionStorage.getItem('user_id')
			let selfInfo = {};
			selfInfo['userId'] = sessionStorage.getItem('user_id');
			selfInfo['userName'] = sessionStorage.getItem('username');
			this.childUserList.push(selfInfo);
			for (var i = 0; i < this.imgsList.length; i++) {
				this.images.push(this.imgsList[i].labelVal);
			}
			this.total = this.imgsList.length
			let query = this.$route.query.id
			if(query == undefined){
			} else {
				this.queryString()
			}
			this.getPublicMaterial();
		},
		methods: {
			//素材管理，公共素材切换
			topHandleClick(tab,event){
				if(tab.label == '　素材管理　') {
					this.tabLable = tab.label
					this.type = '0'
					this.page = 1
					this.getUserUploadList(this.type,this.groupValue)
				} else if (tab.label == '　公共素材　') {
					this.tabLable = tab.label
					this.type = '0';
					this.page = 1;
					this.getUserUploadList(0,this.groupPublicValue);
				}
			},
			getPublicMaterial(){
				let arr = [];
				arr.push({userId:-1})
				axios.post(this.groupUrl+'get_groups',{
					users:arr
				}).then(res=>{
					if(res.data.length == 0 || res.data == null) {
						this.$message({
							message: '获取分组失败',
							type:'warning'
						})
					} else {
						let datas = res.data;
						this.selectPublicGroup = datas;
						this.groupPublicValue = this.selectPublicGroup[0].groupId;
						// this.getUserUploadList(0,this.groupPublicValue)
						// console.log(this.selectPublicGroup)
					}
				}).catch(err=>{
					this.$message({
						message: '获取分组列表失败',
						type: 'error'
					})
				})
			},
			showModel(type,title,item){
				let _this=this;
				switch(type){
				case "download":
					_this.downloadPath=_this.groupUrl+item.materialPath;
					break;
				case "delete":
					_this.deletePath = _this.groupUrl + 'file/del?materialId='+item.materialId+ '&materialName=' + item.materialSmallPath;
					break;
				}
				_this.$store.dispatch("showDialog",{
				title:title,
				flag:type
				})
			},
			downloadImg(){
				window.open(this.downloadPath,"_self");
				this.$store.dispatch("hideDialog");
			},
			deleteImgMp4(){
				let _this=this;
				axios.get(_this.deletePath).then((res)=>{
				if(res.data == 'success') {
					this.$store.dispatch("hideDialog");
					this.$message.success("删除成功");
					if(this.pagingSwitch){
					this.page=this.page-1;
					}
					this.getUserUploadList(this.type,this.groupValue);
				} else {
					this.$message({
					message: '删除失败',
					type: 'error'
					})
					this.getUserUploadList(this.type,this.groupValue)
				}
				})
			},
			getChilAccountList(){
				this.$http("child_user/list","POST",{
					length: 9999,
					pageNo: 1,
					parentUserId: sessionStorage.getItem('user_id')
				}).then(res => {
					if (res.data.error_code == 0) {
						let data = res.data.data.result;
						data.map((item,index)=>{
							this.childUserId.push(item.user_id);
							this.childUserList[index+1] = {};
							this.childUserList[index+1]['userId']  = item.user_id;
							this.childUserList[index+1]['userName']  = item.user_name;
						})
						this.childUserId.push(Number(sessionStorage.getItem('user_id')));
						this.getGroupselectList()
					} else {
						this.$message.error(res.data.error_message);
					}
				}).catch(err => {
					this.$message.error("获取列表失败");
				});
			},
			dialogHeaderClass({ row, column, rowIndex, columnIndex }) {
				if (rowIndex == 0) {
					return "color:#57aaff;;font-size:16px";
				} else {
					return "";
				}
			},
			blurIsTrue(index,row){
				row.showEdit = false;
				// row.showBtn = false
				this.rowGroup = ''
				this.$set(this.delGroup,index,row)
			},
			cancel(){
				this.$store.dispatch('hideDialog')
				this.getGroupselectList()
			},
			addNewGroup(){ // 新建分组
				this.$store.dispatch("showDialog",{
					title:"新建分组",
					showCancel:true,
            		flag:"newAdd"
				})
			},
			delNewGroup() { // 删除分组
				this.$store.dispatch("showDialog",{
					title:"编辑分组",
					showCancel:true,
            		flag:"delGroup"
				})
			},
			mergeGroup(val){ // 合并分组
				this.groupId = val
				this.$store.dispatch("showDialog",{
					title:"合并分组",
					showCancel:true,
            		flag:"merge"
				})
			},
			watchEdit(row){ // 内容改变如果和之前内容一致则不做修改
				this.nameDisabled = false
			},
			handelEdit(index,row){ // 双击击更改分组名
				if(row.groupName == '默认') {
					this.$message.warning('默认分组无法修改')
					return false
				} else{
					row.showEdit = true;
					row.showBtn = true
					this.rowGroup = row
					this.$set(this.delGroup,index,row)
				}
			},
			handelComfirm(index,row){ // 保存修改
				if(this.nameDisabled){
					row.showEdit = false
					row.showBtn = false
					this.$set(this.delGroup,index,row)
					return false
				} else if(row.groupName == ''){
					this.$message.warning('分组名不能为空')
					return false
				}
				else{
					let data = {
						"groupId": row.groupId,
						"groupName": row.groupName,
						"userId": this.userID
					}
					axios.post(this.groupUrl + 'edit_group',data).then(res=>{
						if(res.data.code == 1) {
							this.$message({
								message: '修改成功',
								type: 'success'
							})
							row.showEdit = false;
							row.showBtn = false;
							this.getGroupselectList()
						} else {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
					}).catch(err=>{
						this.$message({
							message: '修改失败',
							type: 'error'
						})
					})		
				}
				this.nameDisabled = true
			},
			mergeGroupHandle(){ // 执行合并
				let id = this.groupId.groupId
				let name = ''
				this.delGroup.map((item)=>{
					if(item.groupId == this.groupDelValue) {
						name = item.groupName
					}
				})
				if(name == '默认'){
					this.$message({
						message: '默认分组不能合并其它组',
						type: 'warning'
					})
				} else if (this.groupDelValue == id){
					this.$message({
						message: '同一分组不能合并',
						type: 'warning'
					})
				} else {
					axios.get(this.groupUrl + 'merge_group?groupId=' + id + '&currentGroupId=' +  this.groupDelValue ).then(res=>{
						if(res.status == 200) {
							this.$message({
								message:'合并分组成功',
								type: 'success'
							})
							this.$store.dispatch('hideDialog')
							this.getGroupselectList()
							this.showName = 'del'
							this.$store.dispatch('showDialog',{
								title: '编辑分组',
								showCancel: true
							})
						}
					}).catch(err=>{
						this.$message({
							message: '合并失败',
							type: 'error'
						})
					})
				}
			},
			moveNewGroup(id){ // 移动
				this.groupMoveid = id
				this.$store.dispatch("showDialog",{
					title:"修改分组",
					showCancel:true,
            		flag:"move"
				})
			},
			moveGroupHandle(){ // 移动分组
				if(this.groupMoveValue == '') {
					this.$message({
						message: '请选择分组',
						type: 'warning'
					})
				} else {
					axios.get(this.groupUrl + 'file/update_group?materialId='+ this.groupMoveid + '&currentGroupId='+ this.groupMoveValue)
					.then(res=>{
						if(res.status == 200) {
							this.$message({
								message: '移动分组成功',
								type:'success'
							})
							this.$store.dispatch('hideDialog')
							this.groupMoveValue = ''
							this.getUserUploadList(this.type,this.groupValue)
						}
					}).catch(err=>{	
						this.$message({
							message: '移动分组失败',
							type: 'error'
						})
					})
				}
			},
			changeSelectName(val){ //  切换分组获取不同的分组列表
				this.page = 1;
				this.queryStringArrImg = [];
				this.getUserUploadList(this.type,val)
			},
			delGroupSelect(val){ // 删除分组
				if(val.groupName == '默认') {
					this.$message({
						message: '默认分组不能删除',
						type: 'warning'
					})
					return false
				}
				if(this.selectGroup[0].groupName == '默认' && this.selectGroup.length == 1) {
					this.$message({
						message: '默认分组不能删除',
						type: 'warning'
					})
				} else {
					axios.get(this.groupUrl + 'del_group?userId='+ this.userID + '&groupId=' + val.groupId).then(res=>{
						if(res.status == 200) {
							this.$message({
								message: '删除成功',
								type: 'success'
							})
							this.groupDelValue = ''
							this.getGroupselectList()
							// this.$store.dispatch('hideDialog')
						}
					}).catch(err=>{
						this.$message({
							message: '删除失败',
							type: 'error'
						})
					})
				}
			},
			confirmdelModel(){ // 删除确定是取消model
				this.$store.dispatch('hideDialog')
				this.getGroupselectList()
			},
			confirmHandle() {	// 新建分组
				if(this.addNewgroupName == '') {
					this.$message({
						message: '名称不能为空',
						type:'warning'
					})
				}  else {
					let data= {
						"userId":this.userID,
						"groupName":this.addNewgroupName,
						"userName":sessionStorage.getItem('username')
					}
					axios.post(this.groupUrl+'add_group',data).then(res=>{
						if(res.data.code == 0 || res.data.data  == '0') {
							this.$message({
								message:res.data.msg,
								type:'warning'
							})
						} else {
							this.$message({
								message: '创建成功',
								type: 'success'
							})
							this.$store.dispatch('hideDialog')
							this.addNewgroupName = ''
							this.getGroupselectList()
						}
					}).catch(err=>{
						this.$message({
							message: '新增分组失败',
							type:'error'
						})
					})
				}
			},
			getGroupselectList() { // 获取分组
			let childAccountId = this.childUserId;
			axios.post(this.groupUrl+'get_groups',{
				users:this.childUserList
			}).then(res=>{
				if(res.data.length == 0 || res.data == null) {
					this.$message({
						message: '获取分组失败',
						type:'warning'
					})
				} else {
					let datas = res.data
					this.selectGroup = datas
					this.editGroup = datas
					// this.delGroup = datas
					this.uploadGroup = datas
					this.moveGroup = datas
					this.groupValue = datas[0].groupId
					this.groupUploadValue = datas[0].groupId
					// this.groupMoveValue = datas[0].groupId
					this.groupDelValue = ''
					this.delGroup = []
					datas.map((item)=>{
						item['showEdit'] = false
						item['showBtn'] = false
						this.delGroup.push(item)
					})
					this.getUserUploadList(this.type,this.groupValue)
				}
			}).catch(err=>{
				this.$message({
					message: '获取分组列表失败',
					type: 'error'
				})
			})
			},
			getUserUploadList(type,groupId){ // 获取用户的上传列表
				let url = this.groupUrl+'materials';
				let params;
				this.childUserId=[];
				if(sessionStorage.getItem('indentity')=="ROLE_SUBUSER"){
					this.childUserId.push(Number(sessionStorage.getItem('user_id')));
				}else{
					this.selectGroup.map(item=>{
						if(item.groupId==groupId){
							this.childUserId.push(Number(item.userId));
						}
					})
				}
				if(type == undefined) {
					params = {
						length:this.current,
						pageNo:this.page
					}
				} else {
					params ={
						length:this.current,
						pageNo:this.page,
						materialCategory:Number(type),
						groupId:groupId
					}
				}
				axios.post(url,params).then((res)=>{
					if(res.status == 200) {
						let data = res.data.results;
						if(data.length==1&&this.page>1){
							this.pagingSwitch=true;
						}else{
							this.pagingSwitch=false;
						}
						if(data.length == 0 ||data.length == null) {
							this.contentText = true
						} else {
							this.contentText = false
						}
						this.imgsList = []
						this.videoList = []
						data.map((item, index)=>{
							if(
								item.materialType == 'png' || 
								item.materialType == 'jpeg' || 
								item.materialType == 'jpg' || 
								item.materialType == 'JPG'||
								item.materialType == 'JPEG'||
								item.materialType == 'PNG' ) 
							{
								item['checked'] = false
								this.imgsList.push(item);
							} else {
								this.videoList.push(item)
							}
						})
						this.total = res.data.count;
						if(this.selectImg){
							this.queryStringArrImg = this.selectImg;
						}
						//上次选中
						if(this.selectImg){
							this.selectImg.forEach((item,index)=>{
								this.imgsList.forEach((childItem,childIndex)=>{
									if(item.val ==childItem.materialPath){
										childItem.checked=true;
									}
								})
							})
						}
					} else {
						this.$message.error('获取上传列表失败');
					}
				}).catch(err=>{
					this.$message.error('获取上传列表失败');
				})
			},
			errEve(err){
			},
			cardCheck(val,smallVal,http,index,checked,type,width,height,size){ //点击图片选择
				if(this.queryStringArrImg.length>8&&checked==false){
					this.imgsList[index].checked = false
					checked = false;
					this.$message({
						message: '最多选择9张图片',
						type: 'warning'
					})
				}else{
					this.imgsList[index].checked = !checked
					checked = !checked
				}
				this.changeImg(val,smallVal,http,index,checked,type,width,height,size)
			},
			queryString(){
				this.isTrue = this.$route.query.isTrue
				this.id = this.$route.query.id
				if( this.id  == false) {
					this.id = 0
					this.isTrue = true
				}
			},
			routerQuery(){ // 路由跳转判断
				sessionStorage.removeItem('selectImg')
				if(this.type == '0') {
					this.$router.push({
						name: 'mr_functionTake',
						query:{
							id: 1,
							imgUrlArr: JSON.stringify(this.queryStringArrImg),
							takeText: this.takeText,
              				checkAllAccount:this.checkAllAccount
						}
					})
				} else {
					this.$router.push({
						name: 'mr_functionTake',
						query:{
							id: 1,
							videoUrlArr: JSON.stringify(this.queryStringArrVideo)
						}
					})
				}
			},
			changeImg(val,smallVal,http,index,checked,type,width,height,size){ // 选择图片
				if(this.id == '1') {
					if(this.type == '0') {
						if(checked) {
							if(this.queryStringArrImg.length >= 9) {
								this.$message({
									message: '最多选择9张图片',
									type: 'warning'
								})
								this.isDisabled = true
								return false
							} else {
								this.queryStringArrImg.push({
									url: http+val,
									val: val,
									smallVal:http+smallVal,
									type: type,
									width: width,
									height: height,
									size: size
								})
							}
						} else {
							this.isDisabled = false
							for(let i = 0; i< this.queryStringArrImg.length;i++) {
								if(this.queryStringArrImg[i].val == this.imgsList[index].materialPath){
									this.queryStringArrImg.splice(i,1)
								}
							}
						}
					} else {
						if(checked) {
							if(this.queryStringArrVideo.length >= 1){
								this.$message({
									message: '只能选择一个视频',
									type: 'warning'
								})
								this.isDisabled = true
								return false
							} else {
								this.queryStringArrVideo.push({
									url: http+val,
									type: type
								})
							}
						} else {
							this.queryStringArrVideo.splice(index,1)
							this.isDisabled = false
						}
					}
				} else {
					return false
				}
			},
			handleSizeChange(val) {
			},
			handlePublicChange(val){
				sessionStorage.setItem('selectImg',JSON.stringify(this.queryStringArrImg));
				this.page = val;
				this.getUserUploadList(this.type,this.groupPublicValue)
			},
			handleCurrentChange(val) {
				sessionStorage.setItem('selectImg',JSON.stringify(this.queryStringArrImg));
				this.page = val;
				this.getUserUploadList(this.type,this.groupValue)
			},
			handleClick(tab, event) { //tab 切换
				if(tab.label == '　图片　') {
					this.tabLable = tab.label
					this.type = '0'
					this.page = 1
					this.getUserUploadList(this.type,this.groupValue)
				} else if (tab.label == '　视频　') {
					this.tabLable = tab.label
					this.type = '1'
					this.page = 1
					this.getUserUploadList(this.type,this.groupValue)
				}
			},
			handleCheckAllChange(val) {
				this.checkedImages = val ? this.images : [];
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.images.length;
				this.isIndeterminate =
				checkedCount > 0 && checkedCount < this.images.length;
			},
			uploadVideoProcess(event, file, fileList){//
				this.videoFlag = true;
			},
			uploadImgToSystem() { //上传dialog
				this.dialogVisible = true
			},
			beforeUpLoadImg(file) { // 上传之前判断
				if(file.name.length > 50) {
					this.$message({
						message: '文件名非法，请修改文件名后再次上传',
						type: 'warning'
					})
					setTimeout(() => {
						this.$notify({
							title: '上传失败',
							message: file.name,
							type: 'error',
							duration: 2500
						});
					}, 300);
					return false
				}
				if(
					file.type == 'image/jpeg' ||
					file.type == 'image/png' ||
					file.type == 'image/jpg' ||
					file.type == 'image/JPG' ||
					file.type == 'image/JPEG' ||
					file.type == 'image/PNG' ||
					file.type == 'image/gif'
					) {
					const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
					const isLt2M = file.size / 1024 / 1024 < 2;
					if (!isJPG) {
						this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
						setTimeout(() => {
							this.$notify({
								title: '上传失败',
								message: file.name,
								type: 'error',
								duration: 2500
							});
						}, 300);
					}
					if (!isLt2M) {
						this.$message.error('上传图片大小不能超过 2MB!');
					}
					return isJPG && isLt2M;
				} else {
					const isLt10M = file.size / 1024 / 1024  < 16;
					if (['video/mp4', 'audio/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
						this.$message.error('请上传正确的视频格式');
						return false;
					}
					if (!isLt10M) {
						this.$message.error('上传视频大小不能超过16MB!');
						return false;
					}
				}
			},
			removeUpload(file,fileList){ // 删除上传图片回调
				file = {}
				this.$refs.uploadImg.clearFiles()
			},
			successUpload(response, file, fileList){ // 成功
				this.$message({
					message: '上传成功',
					type: 'success'
				})
				this.$refs.uploadImg.clearFiles()
				this.dialogVisible = false
				this.getUserUploadList(this.type,this.groupValue)
			},
			submitUpload(){ // 提交执行手动上传
				this.$refs.uploadImg.submit()
			},
			cancelUpload(){ // 取消
				this.dialogVisible = false
				if(this.dialogVisible) {
						this.httpUpLoadRquest()
				}
			},
			close(){ // 关闭清空上传列表
				this.$refs.uploadImg.clearFiles()
				this.$refs.uploadImg.abort()
			},
			httpUpLoadRquest(params) { // 自定义上传
				if(params.file.name.length > 50) {
					this.$message({
						message: '文件名非法，请修改文件名后再次上传',
						type: 'warning'
					})
					setTimeout(() => {
						this.$notify({
							title: '上传失败',
							message: params.file.name,
							type: 'error',
							duration: 2500
						});
					}, 300);
					this.$refs.uploadImg.abort(params.file)
					return false
				}
				if(this.groupUploadValue == '') {
					this.$message({
						message: '请选择分组',
						type: 'warning'
					})
					return false
				} else {
					let formData = new FormData()
					formData.append('upload_files',params.file)
					let url = this.groupUrl + 'file/uploads?group_id=' + this.groupUploadValue
					axios.post(url,formData).then((res)=>{
						if(res.status == 200) {
							this.$message({
								message: '上传成功',
								type: 'success'
							})
							this.$refs.uploadImg.clearFiles()
							this.dialogVisible = false
							this.getUserUploadList(this.type,this.groupValue)
						} else {
							this.$message({
								message: '上传失败',
								type: 'error'
							})
							this.$refs.uploadImg.clearFiles()
						}
					})
				}
			},
			delLoadImgMP4(fileId,name){ // 删除呀
				let url = this.groupUrl + 'file/del?materialId='+fileId + '&materialName=' + name
				axios.get(url).then((res)=>{
					if(res.data == 'success') {
						this.$message({
							message: '删除成功',
							type: 'success'
						})
						if(this.pagingSwitch){
							this.page=this.page-1;
						}
						this.getUserUploadList(this.type,this.groupValue);
					} else {
						this.$message({
							message: '删除失败',
							type: 'error'
						})
						this.getUserUploadList(this.type,this.groupValue)
					}
				})
			}
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.groupSelect{
		display: flex;
		align-items:center;
		justify-content:space-between;
	}
.p-content {
	// padding:24px 5%;
	.ensure{
		.el-button{
			width: 90px;
			height: 32px;
			line-height: 0px;
		}
	}
	
    .panel-heading {
		// padding: 0 15px 0 35px;
		padding: 50px 0 5px 30px;
        // height: 47px;
        line-height: 47px;
        // height: 48px;
        border-bottom-color: #ccc;
        font-size: 18px;
        background: #fff;
        // border-bottom: 1px solid #dddddd;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        a {
            color: #2a3f54;
        }
    }
    .main {
        overflow: hidden;
        .upload-tip{
        	line-height: 24px;
        }
        .p-top-nav {
					position: relative;
            .navbar-form {
                padding: 0;
                margin: 20px 15px;
                .btn-primary {
                    background: #58bc9c;
                    border-color: #43b792 !important;
                    color: #ffffff !important;
                    margin: 0 10px;
                    cursor: pointer;
                }
                .btn-sm {
                    padding: 5px 10px;
                    font-size: 12px;
                    line-height: 1.5;
                    border-radius: 3px;
                }
                .input-group {
                    display: inline-block;
                    width: 230px;
                    height: 30px;
                    border: 1px solid #ccc;
                    border-radius: 30px;
                    font-size: 14px;
                    padding: 5px 15px;
                    color: #555555;
                    margin: 0 20px;
                    background: url(/static/img/search.e7a0036.png) no-repeat
                        202px center;
                    background-size: 15px 15px;
                    .search-btn {
                        width: 30px;
                        height: 30px;
                        border-right: 1px solid #ccc;
                        float: right;
                        margin: -6px 15px 0 0;
                    }
                }
            }
						.uploadToUrl{
							position:absolute;
							right: 0;
							top: 15px;
						}
						.addNewGroup{
							position:absolute;
							right: 110px;
							top: 15px;
						}
						.delGroupSelecet{
							position:absolute;
							right: 220px;
							top: 15px;
						}
						.editGroupNmae{
							position:absolute;
							right: 330px;
							top: 15px;
						}
						.cardNmae{
							display: inline-block;
							text-align: center;
							width: 100%;
							height: 30px;
							line-height: 30px;
							overflow: hidden;
							text-overflow: ellipsis;
    						white-space: nowarp;
							font-size: 13px;
						}
						.threeCard{
							width: 687px;
							margin: 0 auto;
						}
						.uoloadImgCard{
							position: relative;
							width: 200px;
							margin-top: 15px;
						}
						.ChoiceImg{
							position: absolute;
							top: 0;
							left: 10px;
							top:10px;
						}
						.downloadHref{
							color: #409EFF;
							font-size: 14px;
						}
						.image {
							width: 200px;
							height: 200px;
							object-fit: cover;
							display: block;
							// height: 168px;
						}

						.clearfix:before,
						.clearfix:after {
							display: table;
							content: "";
						}

						.clearfix:after {
							clear: both
						}
            .images-list {
                padding: 25px 40px;
                .list-header {
                    font-size: 14px;
                    overflow: hidden;
                    .header-title {
                        color: #43b792;
                        float: left;
                    }
                    .header-right {
                        float: right;
                        margin-right: 33px;
                        .batch-delete {
                            color: #43b792;
                        }
                    }
                }
                .img-lists {
                    margin: 0 auto;
                    li {
                        float: left;
                        margin: 18px 15px 0 0;
                    }
                    .img {
                        width: 148px;
                        height: 148px;
                        border: solid 1px #73879c;
                        border-radius: 15px;
                        position: relative;
                        background: #e1ebf4;
                        cursor: pointer;
                        img {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 15px;
                        }
                        .tit {
                            position: absolute;
                            left: 0;
                            bottom: -1px;
                            padding: 0 10px;
                            line-height: 30px;
                            text-align: center;
                            background: #73879c;
                            color: #ffffff;
                            width: 100%;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            border-radius: 0 0 15px 15px;
                        }
                    }
                    .nav {
                        padding: 5px 0 0 25px;
                        .el-checkbox-group {
                            display: inline-block;
                        }
                        .icon-style {
                            font-size: 22px !important;
                            cursor: pointer !important;
                        }
                    }
                }
            }
            .text-hint {
                color: #58bc9c !important;
                padding: 20px 30px;
                font-size: 15px;
            }
        }
        .block {
            padding: 15px 0 50px;
            text-align: center;
            .el-pagination {
                display: inline-block;
            }
        }
        .modal {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            .modal-content {
                width: 280px;
                background: #ffffff;
                position: absolute;
                top: 50%;
                left: 50%;
                border-radius: 5px;
                .content-header {
                    line-height: 40px;
                    text-align: center;
                    background: #e1ebf4;
                    color: #2a3f54;
                    .close-btn {
                        float: right;
                        padding: 0 15px 0 0;
                        font-size: 24px;
                        color: #73879c;
                        cursor: pointer;
                    }
                }
                .modal-inp {
                    display: block;
                    width: 90%;
                    padding: 10px;
                    border: 1px solid #cccccc !important;
                    border-radius: 5px;
                    margin: 20px auto;
                }
                .content-btn {
                    width: 100%;
                    text-align: center;
                    margin: 10px 0 0 0;
                    border-top: 1px solid #e5e5e5;
                    .btn {
                        padding: 10px 33px;
                        margin: 15px 8px;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                    }
                    .confirm {
                        color: #ffffff;
                        background: #58bc9c;
                    }
                }
            }
        }
    }
}

.ele-dialogTable-init{
	max-height: 400px;
	overflow-y: auto;
}
.el-message-box .el-button--default {
    margin: 0 15px !important;
}
.table {
    margin: 20px 30px;
    color: #73879c;
    tr {
        td {
            padding: 8px !important;
            line-height: 1.4;
            vertical-align: middle !important;
            width: 17%;
        }
    }
    .link {
        width: 300px;
        padding: 8px;
        font-size: 14px;
        overflow: hidden;
        border: 1px solid #ddd;
        margin: 0 30px !important;
        border-radius: 4px;
        cursor: pointer;
        .link-wrap {
            display: block;
            width: 300px;
            text-align: left;
            .tit {
                margin: 10px 10px -10px 10px;
                max-height: 40px;
                overflow: hidden;
            }
            .img {
                margin: 0 10px 0 0;
                width: 45px;
                height: 45px;
                overflow: hidden;
                float: right;
                background: #e1ebf4;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }
    .date {
        width: 300px;
    }
    .green {
        color: #58bc9c !important;
        font-size: 14px;
        padding: 0 15px;
    }
}
</style>
