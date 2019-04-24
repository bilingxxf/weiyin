<template>
    <div id="account" class="main-body">
        <div class="account-main main-wrapper">
          <div class="addAccount">
              <div class="page-title">
                <span>分组管理</span>
              </div>
              <div class="add">
                  <div class="left">
                      <el-input
                          placeholder="请输入分组名称"
                          v-model="accountGroup"
                          suffix-icon="el-icon-search"
                          @change="searchAccountGroup" class="ele-input">
                          <!-- <el-button slot="append" icon="el-icon-search" @click="searchAccountGroup"></el-button> -->
                      </el-input>
                      <el-select
                        size="small"
                        class="ele-select"
                        v-model="selectChildAccountId"
                        placeholder="所属账号"
                        clearable
                        @change="page=1,init()"
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
                  </div>
                  <div class="right">
                      <el-button class="ele-btn" type="primary" @click="addShowModel">添加分组</el-button>
                  </div>
              </div>
          </div>
          <div class="accountTable">
              <div class="table">
                  <div class="tableContent">
                      <!--<el-checkbox class="checkedAll" v-model="checkedAll" @change="checkedall">全选</el-checkbox>-->
                      <el-table
                                :data="tableData"
                                style="width: 100%"
                                :cell-style="cellStyle"
                                :header-cell-style="getHeaderClass"
                                v-loading="loading" class="ele-table-init">
                        <!-- <el-table-column type="expand">
                              <template slot-scope="props" style="width: 100%;">
                                  <el-table :data="props.row.children" style="width: 100%">
                                      <el-table-column width="30px">
                                          <template slot-scope="scope">
                                              <el-checkbox v-model="scope.row.checked" @change="cellclicks(scope.row)"></el-checkbox>
                                          </template>
                                      </el-table-column>
                                      <el-table-column prop="wx_user_group" label="账号名称" align="center">
                                      </el-table-column>
                                      <el-table-column prop="wx_user_name" label="微信号" align="center">
                                      </el-table-column>
                                      <el-table-column prop="sex" label="性别" align="center">
                                      </el-table-column>
                                      <el-table-column label="二维码" align="center">
                                          <template slot-scope="scope">
                                              <img :src="'data:image/png;base64,'+scope.row.wx_qr_code" alt="" />
                                          </template>
                                      </el-table-column>
                                      <el-table-column prop="ping-city" label="所属地区" align="center">
                                      </el-table-column>
                                      <el-table-column prop="signature" label="个性签名" align="center">
                                      </el-table-column>
                                      <el-table-column prop="online_time" label="登录时间" align="center">
                                      </el-table-column>
                                      <el-table-column prop="offline_time" label="下线时间" align="center">
                                      </el-table-column>
                                      <el-table-column prop="wx_status" label="状态" align="center">
                                      </el-table-column>
                                      <el-table-column label="操作" align="center">
                                          <template slot-scope="scope">
                                              <el-button type="text" v-if='scope.row.wx_status=="禁用"' @click="changeStatus(scope.row,scope.$index)">启用</el-button>
                                              <el-button type="text" v-if='scope.row.wx_status=="启用"' @click="changeStatus(scope.row,scope.$index)">禁用</el-button>
                                          </template>
                                      </el-table-column>

                                  </el-table>
                                  <div class="paganation">
                                      <el-button @click="pageDown">加载更多</el-button>
                                  </div>
                              </template>
                          </el-table-column>-->
                          <!--<el-table-column width="30px">
                              <template slot-scope="scope">
                                  <el-checkbox v-model="scope.row.checked" @change="cellclick(scope.row)"></el-checkbox>
                              </template>
                          </el-table-column>-->

                          <!-- <el-table-column label="已选择/总数" align="center">
                              <template slot-scope="scope">
                                  {{scope.row.selectNumber}}/{{scope.row.wx_sum_count}}
                              </template>
                          </el-table-column> -->
                           <el-table-column width="30">
                          </el-table-column>
                          <el-table-column prop="wx_user_group_name" width="100" label="分组名称" align="left" >
                             <template slot-scope="scope">
                                    <el-tooltip :open-delay="350" content={scope.row.wx_user_group_name} placement="bottom-end" :offset="80" effect="light">
                                        <span slot="content" class="tooltip" >{{scope.row.wx_user_group_name}}</span>
                                        <p class="writeWrapper">{{scope.row.wx_user_group_name}}</p>
				                          </el-tooltip>
                              </template>
                          </el-table-column>
                           <el-table-column width="185" label="所属账号" align="left" v-if="accountType">
                              <template slot-scope="scope">
                                <el-tooltip
                                  :open-delay="350"
                                  content="{scope.row.userName}"
                                  placement="bottom"
                                  effect="light"
                                  :offset="80"
                                >
                                  <span slot="content">{{scope.row.userName}}</span>
                                  <p class="writeWrapper">{{scope.row.userName}}</p>
                                </el-tooltip>
                              </template>
                            </el-table-column>
                          <el-table-column prop="create_time" width="340" label="添加分组时间" align="left">
                          </el-table-column>
                          <el-table-column prop="wx_sum_count" width="240" label="已绑定账号" align="left">
                          </el-table-column>
                          <el-table-column label="操作" align="right">
                              <template slot-scope="scope">
                                  <!-- <el-button :disabled="scope.row.wx_user_group_name=='默认'||scope.row.userName!=username" type="text" @click="enditorGroup(scope.$index)">修改</el-button>
                                  <el-button v-if="scope.row.wx_user_group_name=='默认'" :disabled="true" type="text" @click="enditorGroup(scope.$index)">删除</el-button>
                                  <el-button v-if="scope.row.wx_user_group_name!=='默认'" :disabled="scope.row.userName!=username" type="text" style="color:red;" @click="confirmDelete(scope.$index)">删除</el-button> -->
                                 <el-button :disabled="scope.row.wx_user_group_name=='默认'||scope.row.userName!=username" type="text" @click="enditorGroup(scope.$index)">修改</el-button>
                                  <el-button v-if="scope.row.wx_user_group_name=='默认'|| scope.row.userName!=username" :disabled="true" type="text" @click="enditorGroup(scope.$index)">删除</el-button>
                                  <el-button v-else  type="text" style="color:red;" @click="confirmDelete(scope.$index)">删除</el-button>
                              </template>
                          </el-table-column>
                          <el-table-column width="30">
                          </el-table-column>
                      </el-table>
                      <div class="paganation" v-if="tableData.length!=0">
                        <el-pagination
                          @current-change="handleCurrentChange"
                            :page-size="limit"
                            layout="total, prev, pager, next"
                            :total="total">
                          </el-pagination>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        <!-- 删除 -->
        <!-- <div class="dialogBox" v-if="deletePop">
          <div class="header">
                        <h5 class="fontSize">删除分组</h5>
                        <span class="closeBtn" @click="editorInput='',deletePop=false,mask=false"></span>
                    </div>
                    <div class="dialogBody">
                        <div class="content">
                            <p>若删除该分组，该组下的账号重新进入到默认分组下</p> 
                        </div>
                    </div>
                    <div class="dialogFooter">
                        <el-button type="primary" class="ele-btn" @click="deleteConfirmEditor">确定</el-button>
                        <el-button type="primary" class="ele-default" @click="deletePop=false,mask=false">取消</el-button>
            </div>
        </div> -->
        <!-- 编辑弹窗 -->
        <!-- <div class="dialogBox" v-if="editorPop">
          <div class="header">
                        <h5 class="fontSize">编辑分组名称</h5>
                        <span class="closeBtn" @click="editorInput='',editorPop=false,mask=false"></span>
                    </div>
                    <div class="dialogBody">
                        <div class="content">
                             <p><em>分组名称:</em> <el-input class="ele-input" v-model="editorInput"  placeholder="请输入分组昵称"></el-input></p>
                        </div>
                    </div>
                    <div class="dialogFooter">
                        <el-button type="primary" class="ele-btn" @click="confirmEditor">确定</el-button>
                        <el-button type="primary" class="ele-default" @click="editorInput='',editorPop=false,mask=false">取消</el-button>
            </div>
        </div> -->
        <!-- 添加弹窗 -->
        <!-- <div class="dialogBox" v-if="addGropuList.addGroupShow">
          <div class="header">
                        <h5 class="fontSize">添加分组</h5>
                        <span class="closeBtn" @click="addGropuList.addGroupInput='',addGropuList.addGroupShow = false,mask=false"></span>
                    </div>
                    <div class="dialogBody">
                        <div class="content">
                             <p><em>分组名称:</em> <el-input class="ele-input" v-model="addGropuList.addGroupInput"  placeholder="请输入分组昵称"></el-input></p>
                        </div>
                    </div>
                    <div class="dialogFooter">
                        <el-button type="primary" class="ele-btn" @click="addAccountGroup">确定</el-button>
                        <el-button type="primary" class="ele-default" @click="addGropuList.addGroupInput='',addGropuList.addGroupShow = false,mask=false">取消</el-button>
            </div>
        </div> -->
        <!-- <div class="mask" v-show="mask"></div> -->
        <Dialog @callback="addAccountGroup" v-if="flag=='add'">
            <div class="dialog-content group" slot="content">
              <p><em>分组名称：</em> <el-input class="ele-input" v-model="addGropuList.addGroupInput"  placeholder="请输入分组名称"></el-input></p>
            </div>
        </Dialog>
        <Dialog @callback="confirmEditor" v-if="flag=='edit'">
            <div class="dialog-content group" slot="content">
              <p><em>分组名称：</em> <el-input class="ele-input" v-model="editorInput"  placeholder="请输入分组名称"></el-input></p>
            </div>
        </Dialog>
        <Dialog @callback="deleteConfirmEditor" v-if="flag=='delete'"></Dialog>
    </div>
</template>
<script>
  import City from "../../../static/city";
  import fanTaskListVue from '../mr_addfans/fanTaskList.vue';
  import Dialog from "../../components/dialog.vue";
  export default {
    components:{
      Dialog
    },
    data() {
      return {
        limit:10,
        page:1,
        total:0,
        params: "",
        editorPop: false,
        editorInput: "",
        tableData: [],
        accountGroup: "",
        groupId: null,
        groupchildrenId: [],
        index: 0,
        sexTostring: ["未知", "男", "女"],
        statusTostring: ["禁用", "启用"],
        username: "",
        arr: [],
        checkedAll: false,
        groupIndex: null,
        checkedTrue: false,
        addGropuList: {
          addGroupShow: false,
          addGroupInput: ''
        },
        pageCurrent: 1,
        pageRow: '',
        pageStop: 1,
        cityOptions: '',
        childrenItem: '',
        deletePop:false,
        loading:true,
        mask:false,
        flag:"",
        accountType:false,
        bindChildAccountList:[],
        selectChildAccountId:"",
        userId:""
      };
    },
    created(){
      this.cityOptions = City.citys();
       if(sessionStorage.getItem('indentity')==='ROLE_USER'){
          this.accountType=true;
        }
    },
    methods: {
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
      //分页
  		handleCurrentChange(val){
        this.page=val;
        this.loading = true;
  			this.init();
  		},
    	// 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return "background:#ecf5ff;font-size:14px;color:#409eff;height:50px";
          } else {
            return "";
          }
        },
        //搜索分组
    	searchAccountGroup(){
        this.init();
    	},
      //请求微信组成员
      askWx(groupId, userid, row, page) {
        this.$http("wx_user", "GET", {
          wx_user_group_id: groupId,
          limit:10,
          page:page
        })
          .then(res => {
            if(res.data.data.length == 0) {
              this.pageStop = 0
              return false;
            } else {
            this.pageStop = 1
            let that = this;
            let data = ''
            if (res.data.error_code == 0) {
                data = res.data.data.map(function(item, index) {
                item["index"] = row.index;
                item.wx_status = that.statusTostring[item.wx_status];
                // item.sex = that.sexTostring[item.sex];
                if (item.sex == '1') {
                  item.sex = '男'
                } else if(item.sex == '2') {
                  item.sex = '女'
                } else {
                  item.sex = '未知'
                }
                item["itemIndex"] = index;
                item["checked"] = false;
                if (row.checked == true) {
                  item.checked = true;
                } else {
                  item.checked = false;
                }
                return item;
              });

              for(let i = 0; i < data.length; i++) {
                row.children.push(data[i])
              }
              this.childrenItem = row.children
              this.citysFor(this.childrenItem)
            } else {
              this.$message({
                message: "请求微信号失败:" + res.data.error_message,
                type: "error"
              });
            }
           }
          })
          .catch(err => {
            this.$message({
              message: "请求微信号失败:" + err,
              type: "error"
            });
          });
      },
      //外层table行展开后请求数据
      expandChange(row) {
        if (row.children.length <= 0) {
          this.pageRow = row
          this.askWx(row.wx_user_group_id, row.user_id, row, 1);
        }
      },
      //外部表格的全选按钮
      checkedall() {
        if (this.checkedAll == true) {
          let that = this;
          this.tableData.map(function(item) {
            item.checked = true;
            item.selectNumber = item.wx_sum_count;
            if (that.checkedTrue == false) {
              that.askWx(item.wx_user_group_id, item.user_id, item, 1);
            }
            setTimeout(function() {
              if (item.children.length > 0) {
                item.children.map(function(items) {
                  items.checked = true;
                  item.selectArr.push(items.wx_user_id);
                });
              }
            }, 100);
          });
          this.checkedTrue = true;
        } else {
          this.tableData.map(function(item) {
            item.checked = false;
            item.selectNumber = 0;
            item.selectArr = [];
            if (item.children.length > 0) {
              item.children.map(function(items) {
                items.checked = false;
              });
            }
          });
        }
      },
      //内部表格每行的选择框
      cellclicks(row) {
        this.index = row.index;
        let arr = 0;
        for (let i = 0; i < this.tableData[this.index].children.length; i++) {
          if (this.tableData[this.index].children[i].checked == true) {
            arr++;
          }
        }
        if (arr == 0) {
          this.tableData[this.index].checked = false;
        } else {
          this.tableData[this.index].checked = true;
        }
        let check = true;
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < this.tableData[i].children.length; j++) {
            if (this.tableData[i].children[j].checked == false) {
              check = false;
            }
          }
          if (this.tableData[i].checked == false) {
            check = false;
          }
        }
        if (check == true) {
          this.checkedAll = true;
        }
        if (row.checked == true) {
          this.tableData[this.index].selectArr.push(row.wx_user_id);
          this.tableData[this.index].selectNumber = this.tableData[
            this.index
          ].selectArr.length;
        } else {
          this.checkedAll = false;
          let that = this;
          this.tableData[this.index].selectArr.map(function(item, index) {
            if (row.wx_user_id == item) {
              that.tableData[that.index].selectArr.splice(index, 1);
            }
          });
          this.tableData[this.index].selectNumber = this.tableData[
            this.index
          ].selectArr.length;
        }
      },
      //外部表格每行的选择框
      cellclick(row) {
        if (row.children.length <= 0) {
          this.askWx(row.wx_user_group_id, row.user_id, row, 1);
        }
        let that = this;
        setTimeout(function() {
          that.index = row.index;
          if (row.checked == true) {
            let arr = [];
            row.children.map(function(item) {
              item.checked = true;
              arr.push(item.wx_user_id);
            });
            that.tableData[that.index].selectArr = arr;
            that.tableData[that.index].selectNumber =
              that.tableData[that.index].wx_sum_count;
            let check = true;
            for (let i = 0; i < that.tableData.length; i++) {
              for (let j = 0; j < that.tableData[i].children.length; j++) {
                if (that.tableData[i].children[j].checked == false) {
                  check = false;
                }
              }
              if (that.tableData[i].checked == false) {
                check = false;
              }
            }
            if (check == true) {
              that.checkedAll = true;
            }
          } else {
            that.checkedAll = false;
            row.children.map(function(item) {
              item.checked = false;
            });
            that.tableData[that.index].selectArr = [];
            that.tableData[that.index].selectNumber = 0;
          }
        }, 100);
      },
      //禁用启用
      changeStatus(data, index) {
        let params = {};
        if (this.tableData[data.index].children[index].wx_status == "启用") {
          params = {
            wxuserId: this.tableData[data.index].children[index].wx_user_id,
            enabled: 0
          };
        } else {
          params = {
            wxuserId: this.tableData[data.index].children[index].wx_user_id,
            enabled: 1
          };
        }
        // this.$http("wx_user_group/enable_status", "POST", params)
        this.$http("wx_user_group/enable_status", "POST", params)
          .then(res => {
            if (res.data.error_code == 0) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              if (
                this.tableData[data.index].children[index].wx_status == "启用"
              ) {
                this.tableData[data.index].children[index].wx_status = "禁用";
              } else {
                this.tableData[data.index].children[index].wx_status = "启用";
              }
            } else {
              this.$message({
                message: "操作失败:" + res.data.error_message,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "操作失败:" + res.data.error_message,
              type: "error"
            });
          });
      },
      deleteConfirmEditor(){
        this.mask = false;
         this.$http("wx_user_group/delete", "DELETE", {
          wx_user_group_id: this.groupId
        })
          .then(res => {
            if (res.data.error_code == 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.deletePop=false;
              if(this.tableData.length==1&&this.page>1){
                this.page = this.page-1;
              }
              this.init();
              this.deletegroup = "";
              this.checkedAll = false;
              this.groupId = "";
            } else {
              this.$message({
                message: "删除失败:" + res.data.error_message,
                type: "error"
              });
            }
            this.$store.dispatch("hideDialog");
          })
          .catch(err => {
            this.$message({
              message: "删除失败:" + res.data.error_message,
              type: "error"
            });
          });
      },
      //确认删除
      confirmDelete(index) {
        this.flag="delete";
        this.$store.dispatch("showDialog",{
          title:"删除分组",
          showCancel:true,
          content:"若删除该分组，该组下的账号重新进入到默认分组下"
        })
        // this.deletePop=true;
        // this.mask = true;
        this.groupId = this.tableData[index].wx_user_group_id;
      },
      //确认编辑
      confirmEditor() {
        this.mask=false;
        if (this.editorInput == "") {
          this.$message({
            message: "分组名称不能为空！",
            type: "warning"
          });
        } else {
          this.$http("wx_user_group/update", "POST", {
            wx_user_group_name: this.editorInput,
            wx_user_group_id: this.groupId
          })
            .then(res => {
              if (res.data.error_code == 0) {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.tableData[
                  this.groupIndex
                ].wx_user_group_name = this.editorInput;
                this.editorPop = false;
                this.groupId = "";
              } else {
                this.$message({
                  message: "编辑失败",
                  type: "error"
                });
              }
              this.$store.dispatch("hideDialog")
            })
            .catch(err => {
              this.$message({
                message: "编辑失败",
                type: "error"
              });
            });
        }
      },
      //添加账号
      addGroup() {},
      //编辑
      enditorGroup(index) {
        this.flag="edit";
        // this.mask = true;
        this.$store.dispatch("showDialog",{
          title:"编辑分组名称",
          showCancel:true
        })
        this.editorInput = this.tableData[index].wx_user_group_name;
        this.groupId = this.tableData[index].wx_user_group_id;
        this.groupIndex = index;
      },
      //添加分组
      addAccountGroup() {
        if(this.addGropuList.addGroupInput==""){
          this.$message({
            message: "请输入分组名称",
            type: "error"
          });
          return;
        }
        if (this.$regExp(this.addGropuList.addGroupInput, 64)) {
          return;
        } else {
          this.$http("wx_user_group/add?wx_user_group_name="+this.addGropuList.addGroupInput, "POST")
            .then(res => {
              if (res.data.error_code == 0) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.init();
                this.checkedAll = false;
                this.accountGroup = "";
                this.addGropuList.addGroupShow=false;
                this.addGropuList.addGroupInput = '';
              } else {
                this.$message({
                  message: "添加失败:" + res.data.error_message,
                  type: "error"
                });
              }
              this.$store.dispatch("hideDialog")
            })
            .catch(err => {
              this.$message({
                message: "添加失败:" + res.data.error_message,
                type: "error"
              });
            });
        }
      },
      //显示添加分组弹框
      addShowModel() {
        // this.mask = true;
        this.flag="add";
        this.addGropuList.addGroupInput="";
        this.$store.dispatch("showDialog",{
          title:"添加分组",
          showCancel:true
        })
      },
      pageDown() {
        if(this.pageStop == 1) {
          this.pageCurrent++
          this.askWx(this.pageRow.wx_user_group_id, this.pageRow.user_id, this.pageRow, this.pageCurrent)
        } else {
          this.pageCurrent--
          return false
        }
      },
      //初始化列表
      init() {
        let params = {};
        if(this.accountGroup!= ''){
          params['group_name']=this.accountGroup;
        }
       if(this.selectChildAccountId!=""){
          params['childUserId']=this.selectChildAccountId;
        }
        params['limit'] = this.limit;
        params['page'] = this.page;
      
        this.$http("wx_group/list", "GET",params)
          .then(res => {
            if (res.data.error_code == 0) {
              this.loading = false;
              let that = this;
              this.tableData = res.data.data.result.map(function(item, index) {
                item["index"] = index;
                item["selectArr"] = [];
                item["selectNumber"] = 0;
                item["checked"] = false;
                item["children"] = [];
                return item;
              });
              this.total = res.data.data.total_count;
            } else {
              this.$message({
                message: "获取列表失败:" + res.data.data.result.error_message,
                type: "error"
              });
            }
        }).catch(err => {
          this.loading = false;
          this.$message.error("获取列表失败");
        });
      },
       citysFor(row) {
          let citysArray = []
          let shen = []
          let shi = []
          for(let j in row){
            citysArray.push({
              province:row[j].province,
              city:row[j].city
            })
          }
          this.cityOptions.map((item,index)=>{
            for(let k = 0; k < citysArray.length; k++) {
              if(item.value == citysArray[k].province){
                shen.push({
                  value: item.value,
                  label: item.label
                })
                item.children.map((item, index)=>{
                  if(item.value == citysArray[k].city){
                    shi.push({
                      value: item.value,
                      label: item.label
                    })
                  }
                })
              }
            }
          })
          for(let c = 0; c < this.tableData.length ; c ++){
          this.tableData[c].children.map((item, index)=>{
            for(let k = 0; k < shen.length; k++) {
              if(item.province == shen[k].value){
                item['ping-city'] = shen[k].label;
                  for(let t = 0 ; t < shi.length; t++) {
                    if(item.city == shi[t].value) {
                      item['ping-city']  += '/'+ shi[k].label;
                      break
                    }
                  }
                }
              }
            })
          }
        },
        cellStyle(){
          return 'height:40px;padding:0;font-size:12px;color:#888;'
        }
    },
    mounted() {
      this.init();
      this.getChildAccountList();
      this.username = sessionStorage.getItem("username"); 
      this.userId = sessionStorage.getItem("user_id"); 
    }
  };
</script>
<style scoped lang="scss">
  #account {
    .childSelect {
      display: none;
    }
    .addAccount {
      h3 {
        font-size: 20px;
        color:#333;
        margin-bottom: 15px;
        line-height: 1;
      }
      .add {
        box-sizing: border-box;
        background-color: #fff;
        overflow: hidden;
        .left {
          float: left;
          margin-right: 22px;
          span {
            line-height: 24px;
            font-size: 14px;
            color: #707070;
            margin-right: 22px;
          }
          .el-input__inner {
            height: 32px !important;
          }
          .el-input {
            width: 200px !important;
            height:30px !important;
          }
        }
        .right {
          float: right;
          .el-button {
            width: 100px;
            height: 32px;
            line-height: 6px;
            font-size: 12px;
          }
        }
      }
    }
    .accountTable {
      background: #fff;
      .table {
        background-color: #fff;
        .el-button{
          font-size: 12px;
        }
        .tableContent {
          position: relative;
          .el-table .cell img{
          	width: 45px;
          	height: 45px;
          }
          .paganation {
            text-align: center;
            margin-top: 5px;
          }
        }
        .checkedAll {
          position: absolute;
          top: 15px;
          left: 58px;
        }
        .tableBottom {
          text-align: center;
          padding: 35px 0;
          .el-pagination {
            display: inline-block;
          }
          span {
            color: #303133;
            font-size: 14px;
          }
        }
      }
    }
    .editorPop {
      position: absolute;
      z-index: 900;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      .content {
        width: 600px;
        // height: 200px;
        background-color: #fff;
        border-radius: 8px;
        position: absolute;
        top: 30%;
        left: 50%;
        margin-left: -275px;
        .header {
          font-size: 20px;
          line-height: 56px;
          text-align: center;
          background-color: #409EFF;
          color: #fff;
          border-radius: 8px 8px 0px 0px;
        }
        .text {
          // padding: 10px 50px 50px;
          height: 200px;
          text-align: center;
          overflow: hidden;
        }
        .item {
          width: 100%;
          margin: 0 auto;
          text-align: center;
          .item-content{
            overflow: hidden;
            margin-top:50px;
            text-align: center;
          }
          .item-button_content{
            overflow: hidden;
            margin-top: 40px;
          }
          span {
            display: inline-block;
            font-size: 16px;
            color: #333;
            width: 80px;
          }
          .ele-default{
            margin-left: 20px;
          }
          .el-select {
            width: 300px;
            float: left;
            margin-bottom: 20px;
          }
        }
      }
    }
    .promps {
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      top: 0;
      left: 0;
      z-index: 1000;
    }
  }
</style>
