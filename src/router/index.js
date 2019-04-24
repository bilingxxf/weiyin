import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//总后台
const login = r => require.ensure([], () => r(require('@/views/login/index')), 'login')
const home = r => require.ensure([], () => r(require('@/views/index')), 'home')

//微营销
//首页
const mr_home = r => require.ensure([], () => r(require('@/views/mr_home/index')), 'mr_home')
const mr_homeIndex = r => require.ensure([], () => r(require('@/views/mr_home/homeIndex')), 'mr_homeIndex')
const mr_record = r => require.ensure([], () => r(require('@/views/mr_home/record')), 'mr_record')
//账号
const mr_accountIndex = r => require.ensure([], () => r(require('@/views/mr_account/accountIndex')), 'mr_accountIndex')
const mr_grouping = r => require.ensure([], () => r(require('@/views/mr_account/grouping')), 'mr_grouping')
const mr_add = r => require.ensure([], () => r(require('@/views/mr_account/add')), 'mr_add')
const mr_batchBind = r => require.ensure([], () => r(require('@/views/mr_account/batchBind')), 'mr_batchBind')
const mr_bind = r => require.ensure([], () => r(require('@/views/mr_account/bind')), 'mr_bind')
const mr_accountManage = r => require.ensure([], () => r(require('@/views/mr_account/manage')), 'mr_manage')
const mr_success = r => require.ensure([], () => r(require('@/views/mr_account/success')), 'mr_success')
//好友
const mr_friendsIndex = r => require.ensure([], () => r(require('@/views/mr_friends/friendsIndex')), 'mr_friendsIndex')
const mr_addFan = r => require.ensure([], () => r(require('@/views/mr_addfans/addFan')), 'mr_addFan')
const mr_createAddFans = r => require.ensure([], () => r(require('@/views/mr_friends/createAddFans')), 'mr_createAddFans')
const mr_fansTask = r => require.ensure([], () => r(require('@/views/mr_addfans/fansTask')), 'mr_fansTask')
const mr_friendGroup = r => require.ensure([], () => r(require('@/views/mr_friends/friendGroup')), 'mr_friendGroup')
const mr_friendsManage = r => require.ensure([], () => r(require('@/views/mr_friends/manage')), 'mr_friendsManage')
const mr_fanTaskList = r => require.ensure([], () => r(require('@/views/mr_addfans/fanTaskList')), 'mr_fanTaskList')
const mr_resourcesManage = r => require.ensure([], () => r(require('@/views/mr_addfans/resourcesManage')), 'mr_resourcesManage')
//朋友圈
const mr_functionIndex = r => require.ensure([], () => r(require('@/views/mr_function/functionIndex')), 'mr_functionIndex')
const mr_functionMass = r => require.ensure([], () => r(require('@/views/mr_function/functionMass')), 'mr_functionMass')
const mr_functionMaterial = r => require.ensure([], () => r(require('@/views/mr_function/functionMaterial')), 'mr_functionMaterial')
const mr_functionSend = r => require.ensure([], () => r(require('@/views/mr_function/functionSend')), 'mr_functionSend')
const mr_functionSnsComment = r => require.ensure([], () => r(require('@/views/mr_function/functionSnsComment')), 'mr_functionSnsComment')
const mr_functionSnsTDetail = r => require.ensure([], () => r(require('@/views/mr_function/functionSnsTDetail')), 'mr_functionSnsTDetail')
const mr_functionSnsTimeLine = r => require.ensure([], () => r(require('@/views/mr_function/functionSnsTimeLine')), 'mr_functionSnsTimeLine')
const mr_functionTake = r => require.ensure([], () => r(require('@/views/mr_function/functionTake')), 'mr_functionTake')
const mr_functionTaskDate = r => require.ensure([], () => r(require('@/views/mr_function/functionTaskDate')), 'mr_functionTaskDate')
const mr_videoComponent = r => require.ensure([], () => r(require('@/views/mr_function/videoComponent')), 'mr_videoComponent')
const mr_functionNewmass = r => require.ensure([], () => r(require('@/views/mr_function/functionNewmass')), 'mr_functionNewmass')
const mr_functionRecord = r => require.ensure([], () => r(require('@/views/mr_function/functionRecord')), 'mr_functionRecord')
const mr_functionContent = r => require.ensure([],()=> r(require('@/views/mr_function/functionContent')),'mr_functionContent')
//客服系统
const mr_serviceIndex = r => require.ensure([], () => r(require('@/views/mr_service/serviceIndex')), 'mr_serviceIndex')
const mr_detail = r => require.ensure([], () => r(require('@/views/mr_service/detail')), 'mr_detail')
const mr_fastreply = r => require.ensure([], () => r(require('@/views/mr_service/fastreply')), 'mr_fastreply')
const mr_kpi = r => require.ensure([], () => r(require('@/views/mr_service/kpi')), 'mr_kpi')
const mr_managent = r => require.ensure([], () => r(require('@/views/mr_service/managent')), 'mr_managent')
const mr_settings = r => require.ensure([], () => r(require('@/views/mr_service/settings')), 'mr_settings')
const mr_shortcuts = r => require.ensure([], () => r(require('@/views/mr_service/shortcuts')), 'mr_shortcuts')
const mr_addService = r => require.ensure([], () => r(require('@/views/mr_service/addService')), 'mr_addService')

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: home,
      children: [
        //微营销
        {
				  path: '/mr_homeIndex',
				  name: 'mr_homeIndex',
				  component: mr_homeIndex,
				  meta: { title: '微-首页', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],icon:""},
				  children:[
						{
						  path: '/mr_home',
						  name: 'mr_home',
						  component: mr_home,
						  meta: { title: '端口统计', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],index:"6_1" }
						},
						{
						  path: '/mr_record',
						  name: 'mr_record',
						  component: mr_record,
						  meta: { title: '上号记录', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],hidden:true,index:"6_2" }
						}
					]
				},
				{
				  path: '/mr_accountIndex',
				  name: 'mr_accountIndex',
				  component: mr_accountIndex,
				  meta: { title: '微-账号', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],icon:""},
				  children:[
						{
						  path: '/mr_grouping',
						  name: 'mr_grouping',
						  component: mr_grouping,
						  meta: { title: '分组管理', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],index:"7_1" }
						},
						{
						  path: '/mr_accountManage',
						  name: 'mr_accountManage',
						  component: mr_accountManage,
						  meta: { title: '账号管理', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],index:"7_2" }
						},
						{
						  path: '/mr_add',
						  name: 'mr_add',
						  component: mr_add,
						  meta: { title: '账号添加', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],index:"7_4" }
						},
						{
						  path: '/mr_bind',
						  name: 'mr_bind',
						  component: mr_bind,
						  meta: { title: '绑定账号', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],hidden:true,index:"7_9" }
						},
						{
						  path: '/mr_batchBind',
						  name: 'mr_batchBind',
						  component: mr_batchBind,
						  meta: { title: '绑定账号', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],hidden:true,index:"7_11" }
						},
						{
						  path: '/mr_success',
						  name: 'mr_success',
						  component: mr_success,
						  meta: { title: '绑定成功', requiresAuth: true,indentity:["ROLE_DAEMON","ROLE_USER","ROLE_ADMIN"],hidden:true,index:"7_12" }
						}
					]
				},
				{
				  path: '/mr_friendsIndex',
				  name: 'mr_friendsIndex',
				  component: mr_friendsIndex,
				  meta: { title: '微-好友', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],icon:""},
				  children:[
						{
						  path: '/mr_friendsManage',
						  name: 'mr_friendsManage',
						  component: mr_friendsManage,
						  meta: { title: '好友管理', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],index:"8_1" }
						},
						{
						  path: '/mr_addFan',
						  name: 'mr_addFan',
						  component: mr_addFan,
						  meta: { title: '加粉', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],index:"8_2" }
						},
						{
						  path: '/mr_fansTask',
						  name: 'mr_fansTask',
						  component: mr_fansTask,
						  meta: { title: '加粉任务', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"8_3" }
						},
						{
						  path: '/mr_fanTaskList',
						  name: 'mr_fanTaskList',
						  component: mr_fanTaskList,
						  meta: { title: '任务列表', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"8_8" }
						},
						{
						  path: '/mr_resourcesManage',
						  name: 'mr_resourcesManage',
						  component: mr_resourcesManage,
						  meta: { title: '号库管理', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"8_9" }
						},
						{
						  path: '/mr_createAddFans',
						  name: 'mr_createAddFans',
						  component: mr_createAddFans,
						  meta: { title: '', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"8_4" }
						},
						{
						  path: '/mr_friendGroup',
						  name: 'mr_friendGroup',
						  component: mr_friendGroup,
						  meta: { title: '', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"8_5" }
						}
					]
				},
				{
				  path: '/mr_functionIndex',
				  name: 'mr_functionIndex',
				  component: mr_functionIndex,
				  meta: { title: '微-朋友圈', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],icon:""},
				  children:[
						{
						  path: '/mr_functionMass',
						  name: 'mr_functionMass',
						  component: mr_functionMass,
						  meta: { title: '群发消息', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],index:"10_1" }
						},
						{
							path: '/mr_functionRecord',
							name: 'mr_functionRecord',
							component: mr_functionRecord,
							meta: {title:'发朋友圈',requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],index:"10_2"}
						},
						{
						  path: '/mr_functionSend',
						  name: 'mr_functionSend',
						  component: mr_functionSend,
						  meta: { title: '朋友圈记录', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"10_10" }
						},
						{
						  path: '/mr_functionMaterial',
						  name: 'mr_functionMaterial',
						  component: mr_functionMaterial,
						  meta: { title: '素材管理', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],index:"10_3" }
						},
						{
						  path: '/mr_functionSnsTDetail',
						  name: 'mr_functionSnsTDetail',
						  component: mr_functionSnsTDetail,
						  meta: { title: '查看朋友圈', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"10_9" }
						},
						{
						  path: '/mr_functionTaskDate',
						  name: 'mr_functionTaskDate',
						  component: mr_functionTaskDate,
						  meta: { title: '养号任务列表', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"10_6" }
						},
						{
						  path: '/mr_functionNewmass',
						  name: 'mr_functionNewmass',
						  component: mr_functionNewmass,
						  meta: { title: '新建群发', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"10_8" }
						},
						{
						  path: '/mr_functionTake',
						  name: 'mr_functionTake',
						  component: mr_functionTake,
						  meta: { title: '发朋友圈', requiresAuth: true,hidden:true,indentity:["ROLE_USER","ROLE_ADMIN"],index:"10_7" }
						},
					
					]
				},
				{
				  path: '/mr_serviceIndex',
				  name: 'mr_serviceIndex',
				  component: mr_serviceIndex,
				  meta: { title: '微-客服系统', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],icon:""},
				  children:[
						{
						  path: '/mr_kpi',
						  name: 'mr_kpi',
						  component: mr_kpi,
						  meta: { title: '客服管理', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],index:"11_1" }
						},{
						  path: '/mr_addService',
						  name: 'mr_addService',
						  component: mr_addService,
						  meta: { title: '添加客服', requiresAuth: true,indentity:["ROLE_USER","ROLE_ADMIN"],hidden:true,index:"11_7" }
						},
						{
						  path: '/mr_settings',
						  name: 'mr_settings',
						  component: mr_settings,
						  meta: { title: '聊天设置', requiresAuth: true,indentity:["ROLE_USER"],index:"11_2" }
						},
						{
						  path: '/mr_detail',
						  name: 'mr_detail',
						  component: mr_detail,
						  meta: { title: '问题明细', requiresAuth: true,indentity:["ROLE_USER"],index:"11_3" }
						},
						{
						  path: '/mr_managent',
						  name: 'mr_managent',
						  component: mr_managent,
						  meta: { title: '快捷语管理', requiresAuth: true,indentity:["ROLE_USER"],index:"11_4"}
						},
						{
						  path: '/mr_fastreply',
						  name: 'mr_fastreply',
						  component: mr_fastreply,
						  meta: { title: '添加快捷语', requiresAuth: true,indentity:["ROLE_USER"],hidden:true,index:"11_5" }
						},
						{
						  path: '/mr_shortcuts',
						  name: 'mr_shortcuts',
						  component: mr_shortcuts,
						  meta: { title: '编辑快捷语', requiresAuth: true,indentity:["ROLE_USER"],hidden:true,index:"11_6" }
						}
					]
				},   
      ]
    }
  ]
})
