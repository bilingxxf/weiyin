<template>
	<el-dialog title="选择分组" 
		:visible.sync="value" 
		:before-close="handleClose"
		center 
		class="element-modal group-model"
		> 
		<div class="dialog-content">
			<!--<div class="grounp-checkout" v-if="sysGroupList.length>0" v-for="(group,groupIndex) in sysGroupList">
				<el-button 
					:class="group.check?'checked  grounp-title':'grounp-title'" 
					@click="selectAll(group,groupIndex)"  
					v-if="role && role=='ROLE_USER'" >{{group.groupName}}</el-button>
				<div class="grounp-list">
					<div v-for="(item,itemIndex) in group.list"
						 :class="item.check?'checked group-item':'group-item'" 
						 @click="handleCheckGroup(groupIndex,itemIndex)" 
						>{{item.wx_user_group_name}}({{item.wx_sum_count}})
					</div>
				</div>
			</div>-->
			<div class="grounp-checkout">
				<el-tree
				  :min-height="200"
				  :data="treedata"
				  show-checkbox
				  ref="tree"
				  node-key="id"
				  @check="nodeCheck"
				  @check-change="selectNode"
				  highlight-current
				  :check-on-click-node="true"
				  :props="defaultProps">
				</el-tree>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="submitSelectors">确 定</el-button>
		    <el-button @click="handleClose">取 消</el-button>
		  </span>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			limit: 99999,
			page: 1,
			role: sessionStorage.getItem("indentity"),
			username: sessionStorage.getItem("username"),
			groupArr: [],
			arr: [],
			sysGroupList:[],
			selectArr:[],
			treedata: [],
			defaultProps: {
          		children: 'children',
          		label: 'label'
        	},
        	groupLists: []
		}
	},
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
		value: {
	        type: Boolean,
	        default: false
	    }
	},
	watch: { },
	methods: {
		handleCheckGroup(groupIndex, itemIndex){
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
		    this.$set(this.sysGroupList,item,group);
		    this.selectArr = []
			this.sysGroupList.forEach((v,i) => {
				v.list.forEach((item,j) => {
					if(item.check) {
						this.selectArr.push(item)
					}
				})
			})
		},
		selectAll(group, groupIndex) {
			group.check=!group.check;
          	group.list.map((v,k)=>{
            	v.check=group.check;
          	});
          	this.$set(this.sysGroupList,groupIndex,group);
          	this.selectArr = []
			this.sysGroupList.forEach((v,i) => {
				v.list.forEach((item,j) => {
					if(item.check) {
						this.selectArr.push(item)
					}
				})
			})
		},
		getlist() {
			let params = {}
			params['limit'] = this.limit
			params['page'] = this.page;
			params['onlyOnline'] = 1
			params['onlySelf'] = 0
			this.$http("wx_group/group_list", "POST",params)
			.then(res => {
				if (res.data.error_code == 0) {
					this.groupLists = res.data.data.result
					this.$emit('returnGroupList', this.groupLists)
					let respose = res.data.data.result;
					respose = respose.filter((v, i) => {
						return v.wx_sum_count>0 
					})
					var map = {},
					dest = [];
					for(var i = 0; i < respose.length; i++){
					    var ai = respose[i];
					    if(!map[ai.userName]){
					        dest.push({
					        	userName: ai.userName,
					            children: [ai],
					            id: i,
					            label: ai.userName
					        });
					        map[ai.userName] = ai;
					    }else{
					        for(var j = 0; j < dest.length; j++){
					            var dj = dest[j];
					            if(dj.userName== ai.userName){
					                dj.children.push(ai);
					                break;
					            }
					        }
					    }
					}
					this.treedata = dest
					this.treedata.forEach((v, i) => {
						v.children.forEach((item, j) => {
							item.id = item.wx_user_group_id;
							item.label = item.wx_user_group_name +'('+ item.wx_sum_count +')'
						})
					})
					
//					let result=res.data.data.result;
//					let json={};
//					let formatResult=[];
//					result.map((v,k)=>{
//						v.check = false;
//						if(!json[v.userName]){
//							json[v.userName]=1;
//						}else{
//							!json[v.userName]++;
//						}
//					});
//					for(let key in json){
//						let fjson={};
//						let arr=result.filter((v,k)=>{
//							return v.userName==key&&v.wx_sum_count>0;
//						});
//						fjson.groupName=key;
//						if(arr.length>0){
//							formatResult.push(fjson)
//							fjson.list=arr;
//						}
//					};
//					this.sysGroupList = formatResult
				}
			})
		},
		nodeCheck(node,b,c) {
			let data = b.checkedNodes
			this.selectArr = []
			data.forEach((v,i) => {
				if(!v.children) this.selectArr.push(v)
			})
//			console.log(this.selectArr)
		},
		selectNode(val, checked) { },
		handleClose() {
        	this.$emit('change', false)
      	},
		submitSelectors () {
	        this.$emit('returnValue', this.selectArr)
	        this.handleClose()
	 }
	},
	mounted() {
		this.getlist()
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#grounpSend {
	.el-radio-group, .el-form-item__content {
		.el-button {
			padding: 0;
		}
	}
	.grounp-checkout {
		/*display: flex;
		padding: 0 40px;
		flex: 1;*/
		min-height: 100px;
		max-height: 400px;
		.el-tree {
			width: 340px;
			/*padding: 0 100px;*/
		}
		.grounp-title {
			padding: 0;
			margin-right: 16px;
			text-align: center;
			height: 32px;
			width: 90px;
			flex: 0 0 90px;
		}
		.grounp-list {
			.el-checkbox {
				margin: 0 12px 15px 0;
				.el-checkbox__input {
					opacity: 0;
				}
				.el-checkbox__label {
					padding: 0;
				}
			}
		}
		.el-checkbox.is-bordered.el-checkbox--mini {
			height: auto !important;
			height: 30px !important;
		}
	}
	.text {
		text-align: center;
	}
}
.checked{
	color: #409EFF;
	border: 1px solid #409EFF !important;
	cursor: pointer;
}
.grounp-list {
	display: flex;
	flex-wrap: wrap;
}
.group-item {
	width: 90px;
	height: 32px;
	line-height: 32px;
	border:1px solid #DCDFE6;
	margin: 0 16px 16px 0;
	text-align: center;
	border-radius: 4px;
	overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
</style>
