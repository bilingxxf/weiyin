import Layout from "@/views/layout/layout";
const routerMap= [
    {
      path: '/mr_accountIndex',
      name: 'mr_accountIndex',
      component: () => import('@/views/mr_account/accountIndex'),
      redirect:"/mr_accountManage",
      meta: { title:'账号',icon:"el-icon-ump-geren",index:"account"},
      children:[
        {
          path: '/mr_accountManage',
          name: 'mr_accountManage',
          component: () => import('@/views/mr_account/manage'),
          meta: { title:'账号管理',index:"mr_accountManage" }
        },
        {
          path: '/mr_add',
          name: 'mr_add',
          component:() => import('@/views/mr_account/add'),
          meta: { title:'账号添加',index:"mr_add" }
        },
        {
          path: '/mr_grouping',
          name: 'mr_grouping',
          component: () => import('@/views/mr_account/grouping'),
          meta: { title:'分组管理',index:"mr_grouping"}
        },
        {
          path: '/mr_childAccount',
          name: 'mr_childAccount',
          component: () => import('@/views/mr_account/childAccount'),
          meta: { title: '子账号管理',index:"mr_childAccount"}
        }
      ]
    },
    {
      path: '/mr_friendsIndex',
      name: 'mr_friendsIndex',
      component: () => import('@/views/mr_friends/friendsIndex'),
      meta: { title: '好友',icon:"el-icon-ump-haoyou",index:"friend"},
      children:[
        {
          path: '/mr_friendsManage',
          name: 'mr_friendsManage',
          component: () => import('@/views/mr_friends/manage'),
          meta: { title: '好友管理',index:"mr_friendsManage"}
        }
      ]
    },
    {
      path: '/mr_wechatgroup',
      name: 'mr_wechatgroup',
      component: () => import('@/views/mr_wechatgroup/mr_wechatgroup'),
      meta: { title: '群',icon:"el-icon-ump-duorenhuiyi",index:"group"},
      children:[
        {
          path: '/mr_wechatgroup_list',
          name: 'mr_wechatgroup_list',
          component: () => import('@/views/mr_wechatgroup/mr_wechatgroup_list'),
          meta: { title: '群管理',index:"mr_wechatgroup_list"},
        },
        {
          path: '/mr_wechatgroup_fastCreate',
          name: 'mr_wechatgroup_fastCreate',
          component: () => import('@/views/mr_wechatgroup/mr_wechatgroup_fastCreate'),
          meta: { title: '快速建群',index:"mr_wechatgroup_fastCreate"},
        },
        {
          path: '/mr_wechatgroup_newList',
          name: 'mr_wechatgroup_newList',
          component: () => import('@/views/mr_wechatgroup/mr_wechatgroup_newList'),
          meta: { title: '群聊列表',index:"mr_wechatgroup_newList"},
        },
        {
          path: '/mr_wechatgroup_taskList',
          name: 'mr_wechatgroup_taskList',
          component: () => import('@/views/mr_wechatgroup/mr_wechatgroup_taskList'),
          meta: { title: '群任务列表',index:"mr_wechatgroup_taskList" },
        }
      ]
    },
    {
      path: '/mr_fansIndex',
      name: 'mr_fansIndex',
      component: () => import('@/views/mr_addfans/fansIndex'),
      meta: { title: '加粉管理',icon:"el-icon-ump-tianjiahaoyou1",index:"fans"},
      children:[
        {
          path: '/mr_fanTaskList',
          name: 'mr_fanTaskList',
          component: () => import('@/views/mr_addfans/fanTaskList'),
          meta: { title:'任务列表',index:"mr_fanTaskList"}
        },
        {
          path: '/mr_abnormalList',
          name: 'mr_abnormalList',
          component: () => import('@/views/mr_addfans/abnormalList'),
          meta: { title: '加粉频繁明细',index:"mr_abnormalList" }
        },
        {
          path: '/mr_abnormalCount',
          name: 'mr_abnormalCount',
          component: () => import('@/views/mr_addfans/abnormalCount'),
          meta: { title: '加粉频繁汇总',index:"mr_abnormalCount"}
        },
        {
          path: '/mr_fansTask',
          name: 'mr_fansTask',
          component: () => import('@/views/mr_addfans/fansTask'),
          meta: { title: '新建任务',index:"mr_fansTask"}
        },
        {
          path: '/mr_resourcesManage',
          name: 'mr_resourcesManage',
          component: () => import('@/views/mr_addfans/resourcesManage'),
          meta: { title: '号库管理',index:"mr_resourcesManage"}
        },
        {
          path: '/mr_addFan',
          name: 'mr_addFan',
          component: () => import('@/views/mr_addfans/addFan'),
          meta: { title: '加粉报表',index:"mr_addFan"},
        },
        {
          path: '/mr_checkPowder',
          name: 'mr_checkPowder',
          component: () => import('@/views/mr_addfans/checkPowder'),
          meta: { title: '加粉信息',index:"mr_checkPowder" }
        },
        {
          path: '/mr_fansAgree',
          name: 'mr_fansAgree',
          component: () => import('@/views/mr_addfans/fansAgree'),
          meta: { title: '被动加粉',index:"mr_fansAgree"}
        },
      ]
    },
    {
      path: '/mr_functionIndex',
      name: 'mr_functionIndex',
      component: () => import('@/views/mr_function/functionIndex'),
      meta: { title: '朋友圈',icon:"el-icon-ump-gongneng",index:"friednContent"},
      children:[
        {
          path: '/mr_functionContent',
          name: 'mr_functionContent',
          component: () => import('@/views/mr_function/functionContent'),
          meta: { title: '查看朋友圈',index:"mr_functionContent"}
        },
        {
          path: '/mr_functionTake',
          name: 'mr_functionTake',
          component: () => import('@/views/mr_function/functionTake'),
          meta: { title: '发朋友圈',index:"mr_functionTake"}
        },
        {
          path: '/mr_functionRecord',
          name: 'mr_functionRecord',
          component: () => import('@/views/mr_function/functionRecord'),
          meta: {title:'发圈记录',index:"mr_functionRecord"}
        },
        {
          path: '/mr_functionMass',
          name: 'mr_functionMass',
          component: () => import('@/views/mr_function/functionMass'),
          meta: { title: '群发消息',index:"mr_functionMass"}
        },
        {
          path: '/mr_functionSend',
          name: 'mr_functionSend',
          component: () => import('@/views/mr_function/functionSend'),
          meta: { title: '朋友圈记录',index:"mr_functionSend" }
        },
        {
          path: '/mr_functionMaterial',
          name: 'mr_functionMaterial',
          component: () => import('@/views/mr_function/functionMaterial'),
          meta: { title: '素材管理',index:"mr_functionMaterial"}
        },
        {
          path: '/mr_functionSnsTDetail',
          name: 'mr_functionSnsTDetail',
          component: () => import('@/views/mr_function/functionSnsTDetail'),
          meta: { title: '查看朋友圈',index:"mr_functionSnsTDetail",showRouter:false}
        },
        {
          path: '/mr_functionNewmass',
          name: 'mr_functionNewmass',
          component: () => import('@/views/mr_function/functionNewmass'),
          meta: { title: '新建群发',index:"mr_functionNewmass" }
        },

      ]
    },
    {
      path: '/mr_readIndex',
      name: 'mr_readIndex',
      component: () => import('@/views/mr_read/readIndex'),
      meta: { title: '任务',icon:"el-icon-ump-kefu",index:"read"},
      children:[
        {
          path: '/mr_readList',
          name: 'mr_readList',
          component: () => import('@/views/mr_read/readList'),
          meta: { title: '阅读',index:"mr_readList"}
        }
      ]
    },
    {
      path: '/mr_newGroupIndex',
      name: 'mr_newGroupIndex',
      component: () => import('@/views/mr_inteService/newGroupIndex'),
      meta: { title: '综合服务',icon:"el-icon-document",index:"newGroupIndex"},
      children:[
        {
          path: '/mr_newGroupSend',
          name: 'mr_newGroupSend',
          component: () => import('@/views/mr_inteService/newGroupSend'),
          meta: { title: '新建群发',index:"newGroupSend"}
        },
        {
          path: '/mr_codeAggregation',
          name: 'mr_codeAggregation',
          component: () => import('@/views/mr_inteService/codeAggregation'),
          meta: { title: '二维码聚合',index:"mr_codeAggregation"}
        },
        {
          path: '/mr_newGroupList',
          name: 'mr_newGroupList',
          component: () => import('@/views/mr_inteService/newGroupList'),
          meta: { title: '群发列表',index:"newGroupList"}
        }
      ]
    },
    //养号配置平台
    {
      path: '/mr_serviceIndex',
      name: 'mr_serviceIndex',
      component: () => import('@/views/mr_service/serviceIndex'),
      meta: { title: '客服系统',icon:"el-icon-ump-kefu",index:"contact"},
      children:[
        {
          path: '/mr_kpi',
          name: 'mr_kpi',
          component: () => import('@/views/mr_service/kpi'),
          meta: { title: '客服管理',index:"mr_kpi" }
        },{
          path: '/mr_addService',
          name: 'mr_addService',
          component: () => import('@/views/mr_service/addService'),
          meta: { title: '添加客服',index:"mr_addService" }
        },
        {
          path: '/mr_settings',
          name: 'mr_settings',
          component: () => import('@/views/mr_service/settings'),
          meta: { title: '聊天设置',index:"mr_settings" }
        },
        {
          path: '/mr_detail',
          name: 'mr_detail',
          component: () => import('@/views/mr_service/detail'),
          meta: { title: '问题明细',index:"mr_detail" }
        },
        {
          path: '/mr_managent',
          name: 'mr_managent',
          component: () => import('@/views/mr_service/managent'),
          meta: { title: '快捷语管理',index:"mr_managent"}
        },
        {
          path: '/mr_fastreply',
          name: 'mr_fastreply',
          component: () => import('@/views/mr_service/fastreply'),
          meta: { title: '添加快捷语',index:"mr_fastreply" }
        },
        {
          path: '/mr_shortcuts',
          name: 'mr_shortcuts',
          component: () => import('@/views/mr_service/shortcuts'),
          meta: { title: '编辑快捷语',index:"mr_shortcuts" }
        }
      ]
    }
];
const accoutChildren=[
  {
    path: '/mr_bind',
    name: 'mr_bind',
    component: () => import('@/views/mr_account/bind'),
    meta: { title: '绑定账号',index:"mr_bind",showRouter:false}
  },
  {
    path: '/mr_batchBind',
    name: 'mr_batchBind',
    component: () => import('@/views/mr_account/batchBind'),
    meta: { title: '绑定账号',index:"mr_batchBind",showRouter:false}
  },
  {
    path: '/mr_success',
    name: 'mr_success',
    component: () => import('@/views/mr_account/success'),
    meta: { title: '绑定成功',index:"mr_success",showRouter:false}
  }
];


const allMaps=[
  // {
  //   path: '*',
  //   name: 'mr_404',
  //   component: () => import('@/views/errorPage/404.vue'),
  //   meta: {
  //     title:'404',
  //     icon:"el-icon-ump-tianjiahaoyou1",
  //     showRouter:false
  //   }
  // }
];
const log=[
  {
    path: '/mr_log',
    component: () => import('@/views/mr_log/index'),
    meta: {
      title:'任务',
      index:"mr_log",
      showRouter:false
    }
  }
]
export {
  allMaps,
  accoutChildren,
  routerMap,
  log
}
