<template>
  <div id="friend">
    <div class="title">
      <h3>群发列表</h3>
      <div class="inp-btn">
        <div class="inp">
          
           <el-input
					    placeholder="请输入模板名称"
					    v-model="templateName"
					    @keyup.enter.native="getTemplateName">
					    <el-button slot="append" icon="el-icon-search" @click="getTemplateName"></el-button>
					</el-input>

        </div>
        <div class="btn">
          <el-button type="primary" @click="addPlan">
            <i class="el-icon-plus el-icon--left"></i>新建群发</el-button>
        </div>
        <div class="tablefn">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="getHeaderClass">
            <el-table-column prop="userName" label="模板名称" align="center">
            </el-table-column>
            <el-table-column prop="" label="群发对象" align="center">
            	<template slot-scope="scope">
            		<span v-if="scope.row.group_all.length>0">组成员</span>
            	</template>
            </el-table-column>
            <el-table-column prop="content" label="群发内容" align="center">
            	<template slot-scope="scope">
            		<span v-if="scope.row.content">{{scope.row.content}}</span>
            		<img v-else :src="scope.row.image" alt="" />
            	</template>
            </el-table-column>
            <el-table-column prop="state" label="群发状态" align="center">
            	<template slot-scope="scope">
            		{{scope.row.status | testStatus}}
            	</template>
            </el-table-column>
            <el-table-column prop="sentDate" label="群发时间" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="immediatelySend(scope.row,scope.$index)">立即发送</el-button>
                <el-button type="text" @click="examine(scope.row,scope.$index)">编辑</el-button>
                <el-button type="text" @click="deletePoint(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>

  </div>

</template>
<script>
import axios from "axios";
import {config} from "../../api/http.js";
export default {
  data() {
    return {
      templateName:'',
      tableData:[],
			group_all:[],
			publicUrl: config.resourceUrl
    };
  },
  methods: {
    //模板名称搜索
    getTemplateName(){

    },
  	//获取当前时间
  	timetrans(date){
				    var date = new Date(date);
				    var Y = date.getFullYear() + '-';
				    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())+' ';
				    var H = date.getHours() + ':';
					var F = date.getMinutes() + ':';
					var S = date.getSeconds();
				    return Y+M+D+H+F+S;
			},
  	//立即发送
  	immediatelySend(row,index){
  		this.group_all = row.group_all;
			let newInfo = this.tableData.splice(index,1)
			var date = new Date();
			let nowStamp = date.getTime();
			newInfo[0].sentDate=this.timetrans(nowStamp);
			this.tableData.unshift(newInfo[0])
			axios.post(
						this.publicUrl+'api/v1/text?type=jy_GroupsentMessage&key=' + sessionStorage.getItem('user_id'),
						this.tableData, {
							headers: {
								"Content-Type": "application/x-www-form-urlencoded"
							}
						}
					)
					.then(res => {
						if(res.data.code == 0) {
							this.$message({
								message: "发送成功",
								type: "success"
							});
							this.createTask();

						} else {
							this.$message({
								message: "发送失败",
								type: "error"
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "发送失败",
							type: "error"
						});
					});
  	},
  	//创建群发任务
  	createTask(){
			this.$http("task/create_task", "POST", {
		        task_template_name: "群发消息",
		        task_template_id: 15,
		        enum_wxaccount_source: 2,
		        account_list:this.group_all,
		        expect_count:this.group_all.length
		   }).then(res => {
		            if (res.data.error_code == 0) {
		                this.$message({
		                    message: "执行成功",
		                    type: "success"
		                });
		            } else {
		                this.$message({
		                    message: "执行失败" + res.data.error_message,
		                    type: "error"
		                });
		            }
		        })
		        .catch(err => {
		            this.$message({
		                message: "执行失败" + err,
		                type: "error"
		            });
		        }); 
			},
  	
    getGroupSentInfo() {
			 axios.get(this.publicUrl+"api/v1/usekey?type=jy_GroupsentMessage&key=" +
                    sessionStorage.getItem("user_id"),
                    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
           ).then(res => {
                if (res.data.code == 0&&res.data.data!="") {
                    this.tableData =JSON.parse(res.data.data);
                } else {
                }
            }).catch(err => {
            	this.$message({
		                message: "获取信息失败",
		                type: "error"
		            });
            });
    },
    
    
    /*获取详情*/
    findDetails(item) {
      axios
        .get(
          this.publicUrl+"api/v1/usekey?type=tjy_friendMass&key=" + item,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.code == 0) {
            let data = JSON.parse(res.data.data);
            data.key = item;
            this.tableData.push(data);
          } else {
            this.$message({
              message: "查询失败",
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
	
    /*删除数据*/
    deletePoint(index) {
    	this.tableData.splice(index,1)
			axios.post(this.publicUrl+"api/v1/text?type=jy_GroupsentMessage&key=" + sessionStorage.getItem('user_id'),
						this.tableData, {
							headers: {
								"Content-Type": "application/x-www-form-urlencoded"
							}
						}
					)
					.then(res => {
						if(res.data.code == 0) {
							this.$message({
								message: "删除成功",
								type: "success"
							});
							this.getGroupSentInfo();
						} else {
							this.$message({
								message: "删除失败",
								type: "error"
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "删除失败",
							type: "error"
						});
					});
    },

    /*添加分组*/
    addPlan() {
      this.$router.push("mr_functionNewmass");
      sessionStorage.removeItem("friendData");
    },
    /*初始化列表*/
    init() {
      this.getGroupSentInfo();
    },
    /*编辑*/
    examine(row,index) {
    	sessionStorage.setItem('resource',JSON.stringify(row))
    	sessionStorage.setItem('resourceIndex',index)
      this.$router.push("mr_functionNewmass");
    },
    // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
        } else {
          return "";
        }
      }
  },
  mounted() {
    this.init();
  },
  filters:{
  	testStatus:function(val){
  		if(val==1){
  			return '已发送'
  		}else{
  			return '未发送'
  		}
  	}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#friend {
  margin: 22px 88px;
  height: 100%;
  background: #e8eff6;
  box-sizing: border-box;
  .title {
    padding: 30px;
    background: #fff;
    h3 {
      font-size: 19px;
      margin-bottom: 30px;
    }
    .inp-btn {
      overflow: hidden;
      line-height: 40px;
      .inp {
        float: left;
      }
      .btn {
        float: right;
      }
    }
    .tablefn {
      padding: 80px 120px;
    }
  }
  .el-table .cell img{
  	width: 45px;
  	height: 45px;
  }
}
</style>

