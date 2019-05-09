<template>
	<div id="grounpSend" class="main-body">
		<div class="main-wrapper">
			<div class="page-title">
				<span>新建群发</span>
			</div>
			<div class="send-content">
				<el-form :model="webchatRule" :rules="webchatRules" ref="webchatRule" label-width="100px" class="demo-ruleForm">
					<el-form-item label="任务名称" :class="!tasknameShow?'input-name border-right':'input-name border-error'">
						<el-input v-model="taskName" @blur="taskBlurHandle" placeholder="请输入任务名称" maxLength="20"></el-input>
						<p class="red" v-if="tasknameShow">请输入任务名称</p>
					</el-form-item>
					<el-form-item label="好友" class="friend-star">
						<div class="select-style">
							<ul>
								<li @click="toggleTab(index)" :class="[{'selected':tabIndex==index}]" v-for="(item, index) in tabList">{{item}}</li>
							</ul>
						</div>
					</el-form-item>
					<div class="select-wrap" v-if="tabIndex == 0">
						<el-form-item class="webchat-select" prop="webchatSelect">
							<span class="left-title">微信号</span>
							<el-radio-group v-model="webchatRule.webchatSelect" @change="webStyleHandle">
								<el-radio label="全部微信号">全部微信号</el-radio>
								<el-radio label="按分组选择">按分组选择
									<el-button @click="groupSelShow = true" :disabled="webchatRule.webchatSelect!='按分组选择' ||  webChatSelectors.length>0" :class="webchatRule.webchatSelect=='按分组选择'? 'add-style blue-style': 'add-style gray-style' ">+</el-button>
									<p class="totalNum" v-if="selectors.length>0">共<span class="blue"> {{ selectors.length }}</span>个分组</p>
								</el-radio>
								<el-radio label="自定义选择">自定义选择
									<el-button @click="webChatShow = true" :disabled="webchatRule.webchatSelect!='自定义选择' || selectors.length>0" :class="webchatRule.webchatSelect=='自定义选择'? 'add-style blue-style': 'add-style gray-style' ">+</el-button>
									<p class="totalNum" v-if="webChatSelectors.length>0"> 共 <span class="blue">{{webChatSelectors.length}}</span>个微信号</p>
								</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item class="friends-select" prop="friendSelect">
							<span class="left-title">好友</span>
							<el-radio-group v-model="webchatRule.friendSelect">
								<el-radio label="0" :disabled="webchatRule.webchatSelect=='全部微信号'?false:disabledFri">全部好友</el-radio>
								<el-radio label="1" :disabled="timeDisabled">按好友通过时间筛选
									<el-date-picker class="data-picker"
										v-model="selFriendTime"
										:clearable="false"
										@change="dateChange"
										type="datetimerange"
										range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
										:disabled="(webchatRule.friendSelect=='1'&& !timeDisabled)?false:true">
									</el-date-picker>
								</el-radio>
								<el-radio label="2" :disabled="timeDisabled">自定义好友
									<el-button
										:disabled="(webchatRule.friendSelect=='2'&& !timeDisabled)?false:true"
										:class="(webchatRule.friendSelect=='2'&& !timeDisabled)? 'add-style blue-style': 'add-style gray-style' "
										@click="friendsShow = true">+</el-button>
										<p class="totalNum" v-if="friendListlength>0"> 共 <span class="blue">{{friendListlength}}</span>个好友</p>
										<span class="notice-text" v-else>提示：未选择好友默认全部好友</span>
								</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="消息" prop="message" class="textarea-margin">
							<el-input type="textarea" @input.native="webKeydownHandle" class="message-textarea" v-model="webchatRule.message" placeholder="请输入发送消息内容" maxlength="700"></el-input>
						</el-form-item>
						<el-form-item label="时间" prop="webNowTime" class="web-time">
							<el-date-picker
								popper-class="modal-picker"
								type="datetime"
								v-model="webchatRule.webNowTime"
								:clearable="false"
								:editable = "false"
								> </el-date-picker>
						</el-form-item>

						<el-form-item class="webchat-btn">
							<el-button type="primary" @click="webSubmitForm('webchatRule')">提交</el-button>
						</el-form-item>
					</div>
				</el-form>

				<div class="select-wrap" v-if="tabIndex == 1">
					<el-form :model="friendTagRule" :rules="friendTagRules" ref="friendTagRule" label-width="100px" class="demo-ruleForm">
						<el-form-item class="webchat-select" prop="webchatSelect">
							<span class="left-title larg-width">好友标签</span>
							<el-select v-model="friendTagRule.tags" :loading="tagLoading" class="select-tag" placeholder="请选择好友标签">
								<el-option v-for="tag of friendTagRule.list" :key="tag.wxContactLabelId" :label="tag.labelName" :value="tag.wxContactLabelId"></el-option>
							</el-select>
							<el-button @click="addFriendFromTag" :disabled="friendSelectedTags.length==2" :class="friendSelectedTags.length<2?'blue-style add-style ':'add-style gray-style'">+</el-button>
						</el-form-item>
						<div class="tags-list" v-if="friendSelectedTags.length">
							<div class="model-tag" v-for="(tagItem,index) in friendSelectedTags" :key="tagItem.wxContactLabelId">
								<p>标签{{index=='0'?'一':'二'}}：{{tagItem.labelName}} <img class="del" src="../../assets/images/deleteTest.png" alt="" @click="handleDeleteSelectTag(tagItem)" /></p>
								<el-radio-group class="tag-group" :class="tagItem.showPanel?'tag-group--height':''"
									v-model="tagItem.friendTagOne"
									@change="handleSelectedTagRadioChange(tagItem)">
									<el-radio label="0">标签内全选   {{tagItem.selectFriend.length ? `(${tagItem.selectFriend.length})` : ''}}</el-radio>
									<el-radio label="1">按好友通过时间筛选
										<el-date-picker
											v-model="tagItem.selFriendTime"
											type="datetimerange"
											class="data-picker"
											:clearable="false"
											 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
											 :disabled="tagItem.friendTagOne!='1'"
											 @change="handleSelectedTagTimeChange(tagItem,index)">
										</el-date-picker>
									</el-radio>
									<el-radio label="2">自定义好友
										<el-button :disabled="tagItem.friendTagOne!='2'" :class="tagItem.friendTagOne=='2'? 'add-style blue-style': 'add-style gray-style' " @click="handleTagFriendsShow(tagItem)">+</el-button>
										<p v-if="tagItem.friendTagOne == 2 && tagItem.selectFriend" class="totalNum"> 共 <span class="blue">{{tagItem.selectFriend.length}}</span>个好友</p>
									</el-radio>
								</el-radio-group>
							</div>
						</div>
						<el-form-item label="消息" prop="message" class="textarea-margin">
							<el-input type="textarea" v-model="friendTagRule.message" placeholder="请输入发送消息内容" maxlength="700"></el-input>
						</el-form-item>
						<el-form-item label="时间" prop="friNowTime" class="web-time">
							<el-date-picker
								popper-class="modal-picker"
								class="web-time"
								v-model="friendTagRule.friNowTime"
								:clearable="false"
								:editable = "false"
								type="datetime"> </el-date-picker>
						</el-form-item>
						<el-form-item class="webchat-btn">
							<el-button type="primary" @click="friSubmitForm('friendTagRule')" :loading='loadingSecond'>提交</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="warm-tips">温馨提示：如所选微信号包括使用扫码登录方式，执行群发任务时系统自动过滤</div>
			</div>
			
		</div>

		<!-- 提交建群任务 -->
		<el-dialog title="提交建群任务" :visible.sync="submitGroupShow"  center  class="group-sel-modal group-submit-modal" >
			<div class="dialog-tip">
				系统限制单个微信号最多发送<span class="red">200</span>个好友
				<p>单个微信号超过200好友时自动过滤(按照好友添加时间排序，保留最新好友)</p>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button type="primary"  @click="closeTagDialog">确 定</el-button>
			    <el-button @click="submitGroupShow = false">取 消</el-button>
		  	</span>
		</el-dialog>

		<!-- 选择分组   -->
		<SelectGroup
			v-model="groupSelShow"
			@returnValue='returnGroupCount'
			@returnGroupList="returnGroupList"
			@returnIds='returnIds'
			:selectors='selectors' />
		<!-- 选择微信 -->
		<Webchat
			v-model="webChatShow"
			@returnValue='returnValue'
			@returnIds='returnIds'
			:webStyles='webchatRule.webchatSelect'
			:selectors='webChatSelectors' />
		<!-- 通过微信选择好友 -->
		<Friends
			v-model="friendsShow"
			@returnValue='returnFriendValue'
			@returnIds='returnIds'
			:selectors='friSelectors'
			:webStyle='webchatRule.webchatSelect'
			:totalGroup="selectors" />
		<!-- 通过好友标签选择好友 -->
		<TagFriends 
			v-model="showTagFriends" 
			:selectedTagItem="selectedTagItem" 
			@returnVal = "returnTagFriend" />
	</div>
</template>

<script>
	let now = new Date();
	import SelectGroup from '@/components/groupsend/selectGroup'
	import Webchat from '@/components/groupsend/webChat'
	import Friends from '@/components/groupsend/friends'
	import TagFriends from '@/components/groupsend/tagSelect'
	const Dialog = () =>
	import('@/components/dialog')
	import dayjs from 'dayjs'
	import API from '@/api/apis'

	import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
	export default {
		data() {
			const validateWebNowTime = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请选择发布时间'));
				} else if(new Date(value).getTime() < new Date().getTime()) {
					callback(new Error('请重新选择发布时间'));
				} else {
					callback();
				}
			};
			const validaMessage = (rule, value, callback) => {
				if(value.replace(/\s*/g,"")==='') {
					callback(new Error('请输入发送消息内容'));
				} else {
					callback();
				}
			};
			return {
				taskName: '', // 任务名称
				loadingFirst: false,
				loadingSecond: false, 
				tagLoading: false, // 好友标签列表
				tasknameShow: false,
				disabledFri: true, // 好友disabled
				timeDisabled: false, // 好友通过时间筛选后面的时间选择器
				// flag: '',
				showTagFriends: false,
				userId: '',
				table: {
					wxUserName: '',
					groupName: ''
				},
				tabList: ['按微信号选择', '按好友标签选择'],
				tabIndex: 0,
				webchatRule: {
					name: '',
					webchatSelect: '全部微信号',
					friendSelect: '0',
					message: '',
					webNowTime: ''
				},
				selFriendTime: [now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + (now.getDate()) + "  " + '00:00:00', now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "  " + '23:59:59'],
				selFriendTagTime: [now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + (now.getDate()) + "  " + '00:00:00', now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "  " + '23:59:59'],
				webchatRules: {
					name: [ { required: true, message: '请输入任务名称', trigger: 'blur' }, { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' } ],
					webchatSelect: [{ required: true, message: '全部微信号', trigger: 'change' }],
					friendSelect: [{ required: true, message: '全部微信号', trigger: 'change' }],
					message: [
						{ required: true, message: '请输入发送消息内容', trigger: 'blur',validator: validaMessage },
						{ min: 1, max: 700, message: '系统最多允许输入700字', trigger: 'change', },
						{ pattern: /^[A-Za-z0-9,.()！。，、？?“”（）；：;:!  \u4e00-\u9fa5]+$/, message: '目前只支持字母数字汉字' } ],
					webNowTime: [{ required: true, validator: validateWebNowTime, trigger: 'change'}]
				},
				groupSelShow: false, // 选择分组弹框
				submitGroupShow: false, // 提交建群任务弹框
				screenFriendShow: false, // 筛选好友
				tagList: { // 按好友选择的标签列表
					friendTagOne: '全部好友',
					friendTagTwo: '全部好友',
				},
				// 自定义选择 微信
				webChatShow: false,
				webChatSelectors: [],
				selectorIds: [],
				webStyle: '', // 微信号选择类型
				//自定义选择  好友
				friendsShow: false,
				friSelectors: [],
				friendsList: [], // 自定义好友列表

				templateId: '', // 任务id
				wxGroupIds: [], // 分组ids
				wxIds: [], // 微信自定义选择ids
				friendTagRule: { /** 按好友标签选择 */
					list: [],
					tags: '',
					selectList: [],
					message: '',
					friNowTime: ''
				},
				friendTagRules: { /** 按好友标签选择的验证规则 */
					tags: [{ required: true, message: '请选择好友标签', trigger: 'change' }],
					message: [
						{ required: true, message: '请输入发送消息内容',validator: validaMessage, trigger: 'blur' },
						{ min: 1, max: 700, message: '系统最多允许输入700字', trigger: 'change' },
						// { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '目前只支持字母数字汉字' } 
						{ pattern: /^[A-Za-z0-9,.()！。，、（）？?“”；：;:!  \u4e00-\u9fa5]+$/, message: '目前只支持字母数字汉字' } ],
					friNowTime: [{ required: true, validator: validateWebNowTime, trigger: 'change', }]
				},
				friendSelectedTags: [],
				// 按分组选择
				selectors: [],
				selectedTagFriendList: [],
				selectedTagItem: {},
				textCount: 0,
				friendListlength: 0,
				webChatData: {},
				friendData: {},
				groupIds: [],
				tagIds: [],
				allTagsIds: []
			}
		},
		model: {
			prop: 'value',
			event: 'change'
		},
		components: {
			SelectGroup,
			Webchat,
			Friends,
			TagFriends,
			Dialog
		},
		created() {
			this.userId = sessionStorage.getItem("user_id");
			this.webchatRule.webNowTime = this.timeFormat(new Date().getTime() + 600000)
			this.friendTagRule.friNowTime = this.timeFormat(new Date().getTime() + 600000)
		},
		methods: {
			taskBlurHandle() {
				if(this.taskName.replace(/\s*/g,"") == '') {
					this.tasknameShow = true
				} else {
					this.tasknameShow = false
				}
			},
			webStyleHandle(val) {
				this.friendsList = []
				this.friendListlength = []
				this.webchatRule.webchatSelect = val
				if(val == '全部微信号') {
					this.webChatSelectors = []
					this.selectors = []
					this.wxIds = ''
					this.timeDisabled = false
				} else if(val == "按分组选择") {
					this.webChatSelectors = []
					this.wxIds = ''
					this.disabledFri = true
					this.timeDisabled = true
				} else {
					this.selectors = []
					this.disabledFri = true
					this.timeDisabled = true
				}
			},
			toggleTab(index) {
				let _this = this;
				_this.tabIndex = index
				parseInt(index) === 1 && this.handleFetchTags()
			},
			getTagFriendParamsForSubmit() { /*获取按好友标签的参数 */
				const info = {
					contactLabelId: 0,
					contactInfos: [],
					contactStartTime: "",
					contactEndTime: ""
				}
				const contactLabelInfos = []
				this.friendSelectedTags.forEach(v => {
					const newInfo = JSON.parse(JSON.stringify(info))

					newInfo.contactLabelId = v.wxContactLabelId

					switch(parseInt(v.friendTagOne)) {
						case 0:
							break;
						case 1:
							newInfo.contactStartTime = dayjs(new Date(v.selFriendTime[0])).format('YYYY-MM-DD HH:mm:ss')
							newInfo.contactEndTime = dayjs(new Date(v.selFriendTime[1])).format('YYYY-MM-DD HH:mm:ss')
							break;
						case 2:
							const reducer = function(accumulator, currentValue, currentIndex, array) {
								const tmp = accumulator.filter((ele) => {
									return ele.wxId === currentValue.wxUserId
								})
								if(tmp.length > 0) {
									tmp[0].contactIds.push(currentValue.contact_wxuser_name)
								} else {
									accumulator.push({
										wxId: currentValue.wxUserId,
										contactIds: [currentValue.contact_wxuser_name]
									})
								}
								return accumulator

							}
							const caleList = v.selectFriend.reduce(reducer, [])
							newInfo.contactInfos = caleList
							break;
						default:
					}

					contactLabelInfos.push(newInfo)
				})
				return contactLabelInfos
			},
			/*删除已选择的标签 */
			handleDeleteSelectTag(tagItem) {
				this.friendSelectedTags = this.friendSelectedTags.filter(v => {
					return v.wxContactLabelId != tagItem.wxContactLabelId
				})
			},
			/*自定义好友变更*/
			returnTagFriend(list, id) {
				this.friendSelectedTags = this.friendSelectedTags.map(v => {
					if(id === v.wxContactLabelId) {
						v.selectFriend = list
					}
					return v
				})
				this.removeTag()
			},
			/* 显示按好友标签选择 */
			handleTagFriendsShow(data) {
//				console.log(data.selectFriend)
				this.selectedTagItem = data
				this.selectedTagFriendList = data.selectFriend
				this.showTagFriends = true
			},
			removeTag() {
				const index = this.friendSelectedTags.indexOf(this.selectedTagItem)
				if (!this.friendSelectedTags[index].selectFriend.length) this.friendSelectedTags.splice(index, 1)
			},
			/* 添加标签已选择列表 */
			addFriendFromTag() {
				if(this.friendSelectedTags.length === 2) {
					return
				}
				/** 为空或者已存在 */
				if(!this.friendTagRule.tags || this.friendSelectedTags.find((v) => {
						return v.wxContactLabelId == this.friendTagRule.tags
					})) {
					return
				}

				const res = this.friendTagRule.list.filter(v => {
					return v.wxContactLabelId === this.friendTagRule.tags
				})

				this.friendSelectedTags.push({ ...res[0],
					friendTagOne: '0',
					selFriendTime: this.selFriendTagTime,
					totalFriend: [],
					selectFriend: [],
					showPanel: false
				})
				this.handleFetchFriends({
					page: 1,
					limit: res[0].labelNumber,
					labelId: res[0].wxContactLabelId
				})
//				console.log(this.friendSelectedTags)
			},
			async handleFetchTags() { /* 获取标签 */
				this.tagLoading = true
				const res = await this.$http(`/wx_contact_label/label_number_info`, 'GET', {
					userId: this.userId
				})
				if(res && res.data && res.data.error_code == 0) {
					this.tagLoading = false
					const list = res.data.data
					this.friendTagRule.list = list.filter(v => {
						return v.labelNumber > 0
					})
				}
			},
			handleSelectedTagTimeChange(tagItem, index) {  /* 按好友标签选择-第Index个标签时间选择变化*/
//				console.log(tagItem.selFriendTime)
				let starttime = (new Date(tagItem.selFriendTime[0])).getTime()
				let endtime = (new Date(tagItem.selFriendTime[1])).getTime()
				if(starttime == endtime || starttime>endtime) {
					this.$message.error('请重新选择好友通过时间！')
				}
				this.handleFetchFriends({page:1,limit:tagItem.labelNumber,labelId:tagItem.wxContactLabelId})
			},
			handleSelectedTagRadioChange(tagItem) { /*按好友标签选择-已选择标签的单选框变化*/
				switch(parseInt(tagItem.friendTagOne)) {
					case 0:
						this.handleFetchFriends({
							page: 1,
							limit: tagItem.labelNumber,
							labelId: tagItem.wxContactLabelId
						})
						break;
					case 1:
						break;
					case 2:
						tagItem.selectFriend = tagItem.totalFriend
						break;
					default:
						console.log(value)
				}
			},
			/* 获取好友列表*/
			async handleFetchFriends(params) {
				const res = await this.$http(`/friends_list`, 'POST', {
					labelId: params.labelId,
					page: 1,
					limit: Number(params.limit) || 100
				})
				if(res && res.data && res.data.error_code == 0) {
					const list = res.data.data.result.filter(v => {
						return v.online == 1
					})
					const filterList = this.friendSelectedTags.filter(v => { /** 在已选择的标签里找到当前请求数据的标签 */
						return v.wxContactLabelId === params.labelId
					})
					filterList[0].selectFriend = list
					filterList[0].totalFriend = list
				}
			},
			webSubmitForm(formName) {
				this.groupIds = []
				this.selectors.forEach((v,i) => {
					this.groupIds.push(v.wx_user_group_id)
				})
				this.webChatData = {}
				this.webChatData = {
					enumWxaccountSource: 1,
					fatherPlanId: 0,
					mode: 0,
					remainDays: 1,
					repeatDays: 1,
					taskRepeatTimes: 1,
					templateId: this.templateId, // 通过任务查询id
					wxGroupIds:  this.selectors.length>0 ? this.groupIds.join(','): '',
					wxids: this.wxIds.length>0 ? this.wxIds.join(',') : "",
					planName: this.taskName.replace(/\s*/g,""), // 任务名称
					startTime: dayjs(this.webchatRule.webNowTime).format('YYYY-MM-DD HH:mm:ss'),
					endTime: dayjs(this.webchatRule.webNowTime).format('YYYY-MM-DD HH:mm:ss')
				}
				let planParams = {
					selectType: 1,
					contactStartTime: this.webchatRule.friendSelect=='1'?  dayjs(this.selFriendTime[0]).format('YYYY-MM-DD HH:mm:ss') :'', //好友通过时间
					contactEndTime: this.webchatRule.friendSelect=='1'? dayjs(this.selFriendTime[1]).format('YYYY-MM-DD HH:mm:ss') :'', //好友通过时间
					sendMsg: this.webchatRule.message.trim(), //消息
					contactInfos: this.friendsList,
					webtime: dayjs(this.webchatRule.webNowTime).format('YYYY-MM-DD HH:mm:ss'),
					webchatStyle: this.webchatRule.webchatSelect ==='全部微信号'?'0':(this.webchatRule.webchatSelect ==='按分组选择'?'1': '2'),
					friendsStyle: this.webchatRule.friendSelect === '0'?'0': (this.webchatRule.friendSelect ==='1'?'1': '2'),
					isSinglePlan: 1
				}
				this.webChatData['planParams'] = JSON.stringify(planParams)
				this.$refs[formName].validate((valid) => {
					if(this.taskName.replace(/\s*/g,"") == '') {
						this.tasknameShow = true
						return false;
					}
					if(this.webchatRule.webchatSelect=='按分组选择'&&!this.selectors.length) {
						if(!this.groupLists.length) {
							this.$message.error('当前无可选分组！')
							return false
						}else {
							this.$message.error('请选择分组！')
							return false
						}
					}
					if(this.webchatRule.webchatSelect =='自定义选择'&&!this.webChatSelectors.length) {
						this.$message.error('请选择微信好友！')
						return false
					}
			
					if(valid) {
						//  筛选没有选择微信号
						this.callback = () => {this.submitGroupShow = true}
						if(this.webchatRule.webchatSelect == '全部微信号') {
							if(this.webchatRule.friendSelect == '0' || this.webchatRule.friendSelect == '1') {
								this.webWxids(0, this.groupIds, this.webChatData)
							}else if(this.webchatRule.friendSelect == '2' && !this.friendsList.length) {
								this.webWxids(0, this.groupIds, this.webChatData)
							}else {
								this.submitGroupShow = true
							}
						}else if(this.webchatRule.webchatSelect == '按分组选择') {
							if(this.webchatRule.friendSelect == '0' || !this.friendsList.length || this.webchatRule.friendSelect == 1) {
								this.webWxids(0, this.groupIds, this.webChatData)
							}else {
								this.submitGroupShow = true
							}
						} else {
							this.callback = null
							this.submitGroupShow = true
						}
					} else {
						return false;
					}
				})
			},
			friSubmitForm(formName) {
//				console.log(this.friendSelectedTags)
				this.allTagsIds = []
				let styleArr = []
				let arrTagOne = []
				this.friendSelectedTags.forEach((v, i) => {
					styleArr.push(v.friendTagOne)
					if(v.friendTagOne === '0' || v.friendTagOne === '1'){ 
						this.allTagsIds.push(v.wxContactLabelId) 
						arrTagOne.push(v.friendTagOne)
					}
				})
				let allFriends = this.getTagFriendParamsForSubmit()
				this.tagIds = []
				allFriends.forEach((v, i) => {
					v.contactInfos.forEach((item, j) => {
						this.tagIds.push(item.wxId)
					})
				})
				this.friendData = {}
				this.friendData = {
					enumWxaccountSource: 1,
					fatherPlanId: 0,
					mode: 0,
					remainDays: 1,
					repeatDays: 1,
					taskRepeatTimes: 1,
					wxids: this.tagIds.length?this.tagIds.join(','): '',
					templateId: this.templateId, // 通过任务查询id
					planName: this.taskName.replace(/\s*/g,""), // 任务名称
					startTime: dayjs(this.friendTagRule.friNowTime).format('YYYY-MM-DD HH:mm:ss'),
					endTime: dayjs(this.friendTagRule.friNowTime).format('YYYY-MM-DD HH:mm:ss'),
					
				}
				let planParams = {
					selectType: 2,
					contactLabelInfos: this.getTagFriendParamsForSubmit(),
					sendMsg: this.friendTagRule.message.trim(),
					friendtime: dayjs(this.friendTagRule.friNowTime).format('YYYY-MM-DD HH:mm:ss'), 
					friendsStyle: styleArr,
					isSinglePlan: 1
				}
				this.friendData['planParams'] = JSON.stringify(planParams)
				this.$refs[formName].validate((valid) => {
					if(this.taskName.replace(/\s*/g,"") == '') {
						this.tasknameShow = true
						return false;
					}
					
					if(!this.friendTagRule.list.length) {
						this.$message.error('当前没有好友标签，无法选择！')
						return false
					}
					if(!this.friendSelectedTags.length) {
						this.$message.error('请至少选择一个好友标签！')
						return false
					}
					
					if(valid) {
						this.callback = () => {this.submitGroupShow = true}
						if(arrTagOne.length) {
							this.webWxids(1, this.allTagsIds, this.friendData)
						}else {
							this.callback = null
							if(this.tagIds.length) {
								this.submitGroupShow = true
							}else {
								this.$message.error('暂无在线微信，无法群发')
							}
						}
					} else {
						return false;
					}
				})
			},
			closeTagDialog(info, ruleStyle) {
				if(this.tabIndex == 0) {
					info = this.webChatData
					ruleStyle = 'webchatRule'
					this.webchatRule.webNowTime = this.timeFormat(new Date().getTime() + 600000)
				}else {
					info = this.friendData
					ruleStyle = 'friendTagRule'
					this.friendTagRule.friNowTime = this.timeFormat(new Date().getTime() + 600000)
				}
				this.$http('plan/', 'POST', info)
				.then((res) => {
					if(res.data.error_message === '提交成功' ) {
						this.$message.success('提交成功')
						this.submitGroupShow = false
						this.$refs[ruleStyle].resetFields();
						info = {}
						this.taskName = ''
						if(ruleStyle == 'webchatRule') {
							this.selectors = []
							this.webChatSelectors = []
							this.wxIds = []
							this.friendsList = []
							this.friendListlength = []
						}else {
							this.friendSelectedTags = []
							this.friendTagRule.tags = ''
							this.getTagFriendParamsForSubmit()
						}
					}else {
						this.submitGroupShow = false
						this.$message.error('提交失败')
					}
				})
			},
			webWxids(queryType, ids, allData) {
				let params = {
					"isOnline": 1,
					"queryType": queryType,
					"ids": ids.length? ids.join(','): ''
				}
				this.$http('wxuserids', 'POST', params)
				.then((res) => {
					if(res.status === 200) {
						if(res.data.data.length>0) {
							let arrWxid = []
							res.data.data.forEach((v, i) => {
								arrWxid.push(v.wxUserId)
							})
							allData.wxids = arrWxid.join(',')
							if (allData.wxids)
								this.callback()
							else
								this.$message.error('暂无在线微信');
						}else {
							this.$message.error('暂无在线微信，无法群发');
							return false
						}
						
					}else {
						this.$message.error('接口失败');
					}
				})
			},
			returnIds(ids) {
				this.selectorIds = ids
			},
			returnGroupCount(items) { //
				this.selectors = items
				if(this.selectors.length > 0) {
					this.disabledFri = false
					this.timeDisabled = false
				}else {
					this.disabledFri = true
					this.timeDisabled = true
				}

			},
			returnValue(items) {
				this.friSelectors = items
				this.webChatSelectors = items
				this.wxIds = []
				items.forEach((v, i) => {
					this.wxIds.push(v.wx_user_id)
				})
				if(this.webChatSelectors.length > 0) {
					this.disabledFri = false
					this.timeDisabled = false
				}else {
					this.disabledFri = true
					this.timeDisabled = true
				}
			},
			returnGroupList(items) { // 获取按分组选择里面的所有的分组
				this.groupLists = items
			},
			returnFriendValue(items) {
				this.friendsList = items
				this.friendListlength = 0
				this.wxIds = []
				this.friendsList = this.friendsList.map((v, i) =>{
					const newFriends = {}
					this.wxIds.push(v.wx_user_id)
					newFriends.wxId = v.wx_user_id
				 	newFriends.contactIds = v.contact_wxuser_arr
				 	this.friendListlength += v.length
				 	return newFriends
				})
			},
			handleClose() {
				this.$emit('change', false)
			},
			getTemplateId() { // 获取
				this.$http('task_template', 'GET', {
						per_page: 99999,
						page: 1
					})
					.then((res) => {
						if(res.data.error_code == 0) {
							res.data.data.result.forEach((v, i) => {
								if(v.task_template_name === '批量群发消息') this.templateId = v.task_template_id
							})
						}
					})
			},
			webKeydownHandle() {
				this.textCount = this.webchatRule.message.length
			},
			calcelHandle() {
				this.submitGroupShow = false
				this.screenFriendShow = false
			},
			dateChange(val) {
				let starttime = (new Date(val[0])).getTime()
				let endtime = (new Date(val[1])).getTime()
				if(starttime>endtime ||starttime==endtime) {
					this.$message.error('请重新选择好友通过时间！')
				}
			},
			timeFormat(time) {
				const isTen = num => num < 10 ? `0${num}` : num
				const data = new Date(time)
				const [year, month, date, hour, minute, second] = [
					data.getFullYear(),
					isTen(data.getMonth() + 1),
					isTen(data.getDate()),
					isTen(data.getHours()),
					isTen(data.getMinutes()),
					isTen(data.getSeconds())
				]
				return `${year}-${month}-${date} ${hour}:${minute}:${second}`
			}
		},
		mounted() {
			this.getTemplateId()
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#grounpSend {
	.el-radio {
		margin-bottom: 15px;
		.totalNum {
			display: inline-block;
			padding-left: 10px;
			color: #000;
			.blue {
				color: #409EFF;
				padding: 0 5px;
				font-weight: bold;
			}
		}
	}
	.red {
		color: #F56C6C;
		font-size: 12px;
		padding-top: 4px;
	}
	.select-style {
		ul {
			height: 40px;
			width: 42%;
			border-bottom: 2px solid #e5e8f1;
		}
		ul li {
			float: left;
			line-height: 38px;
			width: 100px;
			text-align: center;
			margin: 0 10px 0 0;
			z-index: 1000;
			cursor: pointer;
			color: #6d7077;
		}
		ul .selected {
			border-bottom: 2px solid #409EFF;
			color: #409EFF;
		}
	}
	.select-wrap {
		.webchat-select,
		.friends-select {
			margin-bottom: 0px;
			.left-title {
				float: left;
				color: #666;
				text-align: right;
				width: 42px;
				margin-right: 25px;
			}
			.larg-width {
				width: 60px;
			}
			.el-radio-group {
				float: left;
				display: flex;
				flex-direction: column;
				margin-top: 14px;
			}
			.no-tag {
				font-size: 12px;
				color: #F56C6C;
				padding-top: 1px;
			}
		}
		.friends-select {
			.el-radio-group {
				.el-radio {
					margin-bottom: 10px !important;
					width: 100px;
				}
			}
		}
	}
	.add-style {
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 3px;
		text-align: center;
		margin: 0 0 0 6px;
	}
	.gray-style {
		color: #9da8bb;
		background: #f1f5fd;
	}
	.blue-style {
		color: #FFFFFF;
		background: #409EFF;
	}
	.el-radio-group,
	.el-form-item__content {
		.el-button {
			padding: 0;
		}
	}
	.webchat-btn .el-button {
		width: 100px;
		height: 30px;
		padding: 0;
	}
	.tags-list {
		display: flex;
		flex-direction: column;
		padding: 0 170px;
		font-size: 14px;
		.tag-group {
			margin: 15px 0 0px 42px;
			display: flex;
			flex-direction: column;
			transition: height 0.5s ease;
			// height: 0px !important;
			// visibility: hidden;
			// &--height{
			//   height: 80px !important;
			//   visibility: visible;
			// }
		}
		.model-tag {
			border-bottom: 1px solid #D9D9D9;
			margin: 10px 0 0 0;
			padding: 0 0 2px 0;
			.del {
				vertical-align: middle;
				margin-left: 5px;
				cursor: pointer;
			}
			.el-radio {
				margin-bottom: 10px;
				width: 90px;
			}
		}
		.model-tag:last-child {
			border: none;
		}
	}
	.dialog-tip {
		font-size: 14px;
		text-align: center;
		line-height: 35px;
		color: #000;
		.red {
			font-size: 18px;
			color: red;
			padding: 0 5px;
		}
	}
	.el-picker-panel__footer span {
		opacity: 0;
	}
	.textarea-margin {
		margin-top: 15px;
	}
	.notice-text {
		padding-left: 8px;
		font-size: 12px;
		color: #928e8e !important;
	}
	.warm-tips {
		font-size: 14px;
		color: #6d7077;
		border-top: 1px solid #e5e8f1;
		padding: 12px 0 0 0;
		width: 710px;
		margin: 26px 0 0 24px;
	}
}
</style>
