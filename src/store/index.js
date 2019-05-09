import Vue from 'vue'
import Vuex from 'vuex'
import {allMaps,accoutChildren,routerMap,log} from "@/router/addMaps"
import { http } from '@/api/http'
Vue.use(Vuex)

function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}


const state = {
  logined: false,
  indentity:null,
  visible:false,
  dialogData:{
    title:"",
    showCancel:false,
    content:""
  },
  dialogFlag:"",
  accountList:[],
  addRouters:[],
  sideBarMenu:[],
  webSelectData: [],
  groupData: null
}
const mutations={
	indentity(state){
		state.indentity=sessionStorage.getItem("indentity");
	},
	setDialogData(state,data){
		state.dialogData.title=data.title||"";
		state.dialogData.showCancel=data.showCancel||false;
		state.dialogData.content=data.content||"";
		state.dialogFlag=data.flag;
	},
	setWebSelData(state, data) {
		state.webSelectData = data
	},
	setgroupData(state, data) {
		state.groupData = data
	}
}
const actions={
	showDialog({state,commit},data){
		commit("setDialogData",data);
		state.visible=true;
	},
	getWebSelData({state,commit},data) {
		commit('setWebSelData',data)
	},
	hideDialog({state,commit},val){
		state.visible=false;
		state.dialogFlag="";
	},
	clearFlag({state,commit},val){
		state.dialogFlag="";
	},
  getAaccountList({state,commit},val){
    state.accountList=val;
  },
  getRouters({state,commit}){
	  let menuList=sessionStorage.getItem("menuList")?JSON.parse(sessionStorage.getItem("menuList")):[];
	  let sideBarMenu=[];
	  let routerMapList=deepCopy(routerMap);
	  let newArr=[];
    menuList.map((m,k)=>{
      routerMapList.map((v,j)=>{
        if(m.moduleGroupName==v.meta.title){
          let arr=[];
          m.children&&m.children.map((c,l)=>{
            v.children&&v.children.map((n,m)=>{
              if(c.moduleName==n.meta.title){
                arr.push(n)
              }
            })
          });
          v.children=arr;
          sideBarMenu.push(v);
        };
      });
    });
    sideBarMenu.map((v,k)=>{
      if(v.meta.title=="账号"){
        v.children=[...v.children,...accoutChildren]
      }
    });
    sideBarMenu=[...sideBarMenu,...log];
    let addRouters=[{
      path:'/home',
      name:'home',
      component:() => import('@/views/index'),
      children:sideBarMenu
    }];
    state.sideBarMenu=sideBarMenu;
    state.addRouters=[...addRouters,...allMaps];
  },
  clearRouters({state,commit}){
    state.addRouters=[];
    state.sideBarMenu=[];
    sessionStorage.clear();
    //sessionStorage.removeItem("menuList");
  },
  getGroupData({ state, commit }, opt) {
  	return new Promise((resolve,reject) => {
  		!!state.groupData ? resolve(state.groupData) :
  		http('wx_group/group_list', 'POST', opt)
	  	.then(res => {
	  		if (res.data.error_code === 0) {
		  		const { result } = res.data.data
		  		commit('setgroupData', result)
		  		resolve(result)
		  	} else {
		  		reject(res)
		  	}
	  	}).catch((e) => {
	  		reject(e)
	  	})
  	})
  }
}

const getters={
  addRouters:state=>state.addRouters,
  groupData(state) {
  	return state.groupData
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
export default store
