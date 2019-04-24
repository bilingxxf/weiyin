<template>
  <div id="manage" class="main-body">
    <div class="main_wrapper main-wrapper">
      <div class="flex-total">
        <div class="item">
          <h2 class="number">{{friendNumber || '0'}}</h2>
          <p>好友总数</p>
        </div>
        <div class="item">
          <h2 class="number">{{accountNumber || '0'}}</h2>
          <p>账号数</p>
        </div>
      </div>
      <div>
        <div class="search">
          <div class="page-title">
            <div>
              好友管理
            </div>
          </div>
          <!-- 账号详情 -->
          <div>
            <div class="search-content" id="search-content">
              <div class="left">
                <div class="group">
                  <span>管理账号：</span>
                  <el-input class="ele-input" v-model="BelongsWxname" suffix-icon="el-icon-search"
                    placeholder="请输入微信号/昵称" @change="accountNumberMt"></el-input>
                </div>
                <div class="group">
                  <span>好友：</span>
                  <el-input class="ele-input" v-model="wxname" suffix-icon="el-icon-search" placeholder="请输入好友微信号/昵称"
                    @change="getSelectInfo"></el-input>
                </div>
                <el-select size="small" class="ele-select" v-model="selectChildAccountId" placeholder="所属账号" clearable
                  @change="currentPage=1,selectInit()" v-if="accountType">
                  <el-option label="所属账号" value=""></el-option>
                  <el-option :label=itemName :value=userId></el-option>
                  <el-option v-for="(item,index) in bindChildAccountList" :key="index" :label="item.user_name"
                    :value="item.user_id"></el-option>
                </el-select>
                <el-select v-model="selectLabelValue" @change="currentPage=1,selectInit()" class="ele-select"
                  style="margin-left:20px" placeholder="请选择标签">
                  <el-option label="全部标签" value=""></el-option>
                  <el-option label="无标签" value="0"></el-option>
                  <el-option v-for="item in labelListData" :key="item.wxContactLabelId" :label="item.labelName"
                    :value="item.wxContactLabelId">
                  </el-option>
                </el-select>
              </div>
              <div class="right">
                <el-button type="primary" @click="handleTagManage"
                  style="width: 90px;height: 30px;font-size: 12px;line-height: 0px;cur">标签管理</el-button>
              </div>
            </div>
            <div class="edit-group">
              <em>批量操作：</em>
              <span style="padding:0;font-size:12px;cursor:pointer;color:#409eff;" @click="addTag">添加标签</span>
            </div>
            <div class="table">
              <div class="left">
                <div class="table_wrapper">
                  <el-table v-loading="loading" empty-text="暂无数据" :data="tableData" @selection-change="selectionChange"
                    style="width: 100%" class="ele-table-init">
                    <el-table-column type="selection" width="55" align="left">
                    </el-table-column>
                    <el-table-column label="序号" width="50" align="left">
                      <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}}
                        </span></template>
                    </el-table-column>
                    <el-table-column width="140" label="所属账号" align="left" v-if="accountType">
                      <template slot-scope="scope">
                        <el-tooltip :open-delay="350" content="{scope.row.userName}" placement="bottom" effect="light"
                          :offset="80">
                          <span slot="content">{{scope.row.userName}}</span>
                          <p class="writeWrapper">{{scope.row.userName}}</p>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column label="微信昵称" align="left" width="140">
                      <template slot-scope="scope">
                        <em>
                          <el-tooltip :open-delay="350" content={scope.row.wx_user_nick_name} placement="bottom-end"
                            :offset="80" effect="light">
                            <span slot="content">{{scope.row.wx_user_nick_name}}</span>
                            <p class="writeWrapper">{{scope.row.wx_user_nick_name}}</p>
                          </el-tooltip>
                        </em>
                      </template>
                    </el-table-column>
                    <el-table-column prop="wx_user_name" label="微信ID" align="left" width="150">
                      <template slot-scope="scope">
                        <em>
                          <el-tooltip :open-delay="350" content={scope.row.wx_user_name} placement="bottom-end"
                            :offset="80" effect="light">
                            <span slot="content">{{scope.row.wx_user_name}}</span>
                            <p class="writeWrapper">{{scope.row.wx_user_name}}</p>
                          </el-tooltip>
                        </em>
                      </template>
                    </el-table-column>

                    <el-table-column prop="contact_wxuser_name" label="好友微信ID" align="left" width="200">
                      <template slot-scope="scope">
                        <el-tooltip :open-delay="350" content={scope.row.contact_wxuser_name} placement="bottom-end"
                          :offset="80" effect="light">
                          <span slot="content">{{scope.row.contact_wxuser_name}}</span>
                          <p class="writeWrapper">{{scope.row.contact_wxuser_name}}</p>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="nick_name" label="好友昵称" align="left" width="160">
                      <template slot-scope="scope">
                        <el-tooltip :open-delay="350" content={scope.row.nick_name} placement="bottom-end" :offset="80"
                          effect="light">
                          <span slot="content">{{scope.row.nick_name}}</span>
                          <p class="writeWrapper">{{scope.row.nick_name}}</p>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" align="left" width="120">
                      <template slot-scope="scope">
                        {{scope.row.sex | validationSex}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="pass_time" label="通过时间" align="left" width="180">
                    </el-table-column>
                    <el-table-column label="标签" align="left">
                      <template slot-scope="scope">
                        <el-tooltip :open-delay="350" content={scope.row.labelName} placement="bottom-end" :offset="80"
                          effect="light">
                          <span slot="content">{{scope.row.labelName}}</span>
                          <p class="writeWrapper">{{scope.row.labelName}}</p>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="right" width="80">
                      <template slot-scope="scope">
                        <el-button type="text" size="small"
                          @click="handleTagSetting(scope.row.wxContactGroupMapId,scope.row.wxUserId,scope.row.wx_contact_id)">
                          设置</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column width="30">
                    </el-table-column>
                  </el-table>
                  <div class="page pagination" id="pagination" v-if="tableData.length!=0">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                      layout="total,sizes, prev, pager, next" :total="totals">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 标签管理-->
      <Dialog @callback="submitAddTag" v-if="dialogFlag == 'manage'" @cancelCallback="cancelCallback">
        <div class="dialog-content tag-box" slot="content">
          <el-tag :key="index" v-for="(item,index) in tagList" closable :disable-transitions="true" :type="item.type"
            @close="handleClose(item)">
            {{item.content}}
          </el-tag>
          <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新建标签</el-button>
        </div>
      </Dialog>
      <!-- 标签设置 -->
      <Dialog @callback="handleMarking" v-if="dialogFlag == 'setting'">
        <div class="dialog-content tag-group" slot="content">
          <div class="have-box">
            <p class="have-box-title">已有标签:</p>
            <div class="have-tag-box">
              <el-scrollbar class="scroll-bar">
                <el-tag :key="index" v-for="(item,index) in settingTagList" closable :type="item.type"
                  :disable-transitions="true" @close="handleSettingClose(item)">
                  {{item.content}}
                </el-tag>
                <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
              </el-scrollbar>
            </div>
          </div>
          <div class="have-box">
            <p class="have-box-title">添加标签:</p>
            <div class="have-tag-box">
              <el-scrollbar class="scroll-bar">
                <el-tag :key="index" v-for="(item,index) in tagList" :type="item.type"
                  @click.native="chioceAddTag(item)" :disable-transitions="true">
                  {{item.content}}
                </el-tag>
                <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput"
                  :maxlength="4" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </Dialog>
      <!-- 添加标签 -->
      <Dialog @callback="handleAddTag" v-if="dialogFlag == 'add'">
        <div class="dialog-content" slot="content">
          <div class="have-box">
            <p class="have-box-title">已选标签</p>
            <div class="have-tag-box">
              <el-scrollbar class="scroll-bar">
                <el-tag :key="index" v-for="(item,index) in friendsTagList" :type="item.type"
                  :disable-transitions="true">
                  {{item.content}}
                </el-tag>
                <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
              </el-scrollbar>
            </div>
          </div>
          <div class="have-box">
            <p class="have-box-title">添加标签:</p>
            <div class="have-tag-box">
              <el-scrollbar class="scroll-bar">
                <el-tag :key="index" v-for="(item,index) in tagList" :type="item.type"
                  @click.native="friendsAddTag(item)" :disable-transitions="true">
                  {{item.content}}
                </el-tag>
                <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput"
                  :maxlength="4" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
  import Dialog from '../../components/dialog.vue'
  import {
    mapState,
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        BelongsWxname: "",
        id: null,
        tagNames: [],
        tags: [],
        checkedtags: [],
        tagInput: "",
        tagManage: false, //标签管理
        friendNumber: 0,
        accountNumber: 0,
        labelNumber: 0,
        wxname: "",
        currentPage: 1,
        pageSize: 10,
        totals: 0,
        value: "",
        tableData: [],
        account: "",
        accounts: [],
        groupOption: '微信号',
        userId: null,
        userName: null,
        selectionTr: [],
        loading: true,
        tagList: [],
        tagInputVisible: false,
        tagValue: '',
        tagSetting: false,
        deleteTagList: [],
        flag: 'lalala',
        settingTagList: [{
          content: '',
          id: ''
        }],
        friendsTagList: [{
          content: '',
          id: ''
        }],
        deleteTagList: [{
          content: '',
          id: ''
        }],
        request: 0,
        wxUserId: '',
        deleteIdList: [],
        deleteSum: 0,
        selectIdList: [],
        selectContactId: [],
        compareList: [],
        textFlag: false,
        accountType: false,
        selectChildAccountId: "",
        bindChildAccountList: [],
        itemName: "",
        selectLabelValue: "",
        labelListData: []
      };
    },
    computed: {
      ...mapState([
        'dialogFlag'
      ])
    },
    methods: {
      getLabelList() {
        this.$http('wx_contact_label/' + this.userId, "GET", {}).then(res => {
          if (res.data.error_code == 0) {
            this.labelListData = res.data.data;
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      selectInit() {
        this.getFriendSearch(this.BelongsWxname, this.wxname, this.selectChildAccountId)
      },
      //获取子账号列表
      getChildAccountList() {
        this.$http("child_user/list", "POST", {
          length: 9999,
          pageNo: 1,
          parentUserId: sessionStorage.getItem('user_id')
        }).then((res) => {
          if (res.data.error_code == 0) {
            this.bindChildAccountList = res.data.data.result;
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      handleTagManage() {
        this.request = 0;
        this.getTagList();
        this.flag = 'manage';
        this.$store.dispatch("showDialog", {
          title: '标签管理',
          showCancel: true,
          flag: 'manage'
        })
      },
      getSelectInfo() {
        this.currentPage = 1;
        this.getFriendSearch(this.BelongsWxname, this.wxname, this.selectChildAccountId);
      },
      getFriendInfo(wxAccount, wxUserName) {
        this.$http('friends_list', 'POST', {
          page: this.currentPage,
          limit: this.pageSize,
          wx_user_name: wxAccount,
          contact_wxuser_name: wxUserName,
        }).then(res => {
          this.loading = false;
          if (res.data.data.result.length !== 0) {
            this.accounts = []
            this.friendNumber = res.data.data.total_count;
            this.accountNumber = res.data.data.accounts;
            this.tableData = res.data.data.result;
            this.totals = res.data.data.total_count
            this.labelNumber = res.data.data.tags
            let AccountNumber = res.data.data.result
            AccountNumber.map((item, index) => {
              this.accounts.push({
                label: item.wx_user_name,
                value: index,
                id: item.wxUserId
              })
            })
          }
        }).catch(err => {

        })
      },
      getFriendSearch(wxAccount, wxUserName, wxSelectId) {
        let params = {};
        if (wxAccount != '') {
          params['wx_user_name'] = wxAccount;
        }
        if (wxUserName != '') {
          params['contact_wxuser_name'] = wxUserName;
        }
        if (wxSelectId != "") {
          params['childUserId'] = wxSelectId;
        }
        params['limit'] = this.pageSize;
        params['page'] = this.currentPage;


        if (this.selectLabelValue != "") {
          params['labelId'] = Number(this.selectLabelValue);
        }
        this.loading = true;
        this.$http('friends_list', 'POST', params).then(res => {
          this.loading = false;
          this.friendNumber = res.data.data.total_count;
          this.tableData = res.data.data.result;
          this.totals = res.data.data.total_count
          this.labelNumber = res.data.data.tags;
          this.friendNumber = res.data.data.total_count;
          this.accountNumber = res.data.data.accounts;
        }).catch(err => {
          this.loading = true;
        })
      },
      //表格多选
      selectionChange(val) {
        val.map(item => {
          this.tagList.push(item.wxUserId)
        })
        this.selectContactId = val.map(item => {
          return item.wxContactGroupMapId
        })
        this.selectIdList = val.map(item => {
          return item.wxUserId
        })
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loading = true;
        if (this.BelongsWxname !== '') {
          this.getFriendSearch(this.BelongsWxname, this.wxname, this.selectChildAccountId)
        } else {
          this.getFriendSearch(this.BelongsWxname, this.wxname, this.selectChildAccountId);
        }
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.handleCurrentChange(1);
      },
      accountNumberMt(val) {
        let account = this.BelongsWxname;
        this.groupOption = '';
        this.currentPage = 1;
        this.getFriendSearch(account, this.wxname, this.selectChildAccountId)
      },
      //标签管理
      handleClose(tag) {
        this.deleteIdList.push(tag.id)
        this.$confirm('标签中的联系人不会被删除,是否删除标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tagList.splice(this.tagList.indexOf(tag), 1);
          this.$http('wx_contact_label/' + tag.id, 'DELETE').then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          }).catch(err => {})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      showInput() {
        this.tagInputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let a = this.tagValue.trim();
        if (a.length > 0) {
          let sum = 0;
          for (let i = 0; i < this.tagValue.length; i++) {
            if ((this.tagValue.charCodeAt(i) >= 0) && (this.tagValue.charCodeAt(i) <= 255)) {
              sum += 1
            } else {
              sum += 2
            }
          }
          if (sum > 20) {
            this.$message({
              message: '标签名称不能多于20个字节',
              type: 'warning'
            });
            this.textFlag = true;
            return false
          } else {
            let flag = false;
            this.tagList.forEach((item, index) => {
              if (item.content == a) {

                this.$message({
                  message: '标签不能重复',
                  type: 'warning'
                });
                flag = true;
              }
            })
            if (flag) {
              this.tagValue = "";
              return false;
            } else {
              let tagValue = this.tagValue;
              if (tagValue) {
                this.tagList.push({
                  content: tagValue,
                  id: ''
                });
                this.deleteSum = 0;
                this.textFlag = false;
                this.tagInputVisible = false;
                this.tagValue = '';
              }
              this.deleteSum += 1;
            }
          }
        } else {
          this.tagInputVisible = false;
          this.tagValue = '';
        }
      },
      //获取标签
      getTagList() {
        this.tagList = [];
        this.compareList = [];
        this.$http('wx_contact_label/' + this.userId, "GET", {}).then(res => {
          let tagsList = res.data.data;
          tagsList.map((item, index) => {
            this.compareList.push({
              content: item.labelName,
              id: item.wxContactLabelId,
            })
            if (parseInt(item.wxContactLabelId % 5) == 1) {
              this.tagList.push({
                content: item.labelName,
                id: item.wxContactLabelId,
                type: ''
              })
            } else if (parseInt(item.wxContactLabelId % 5) == 2) {
              this.tagList.push({
                content: item.labelName,
                id: item.wxContactLabelId,
                type: 'success'
              })
            } else if (parseInt(item.wxContactLabelId % 5) == 3) {
              this.tagList.push({
                content: item.labelName,
                id: item.wxContactLabelId,
                type: 'info'
              })
            } else if (parseInt(item.wxContactLabelId % 5) == 4) {
              this.tagList.push({
                content: item.labelName,
                id: item.wxContactLabelId,
                type: 'warning'
              })
            } else {
              this.tagList.push({
                content: item.labelName,
                id: item.wxContactLabelId,
                type: 'danger'
              })
            }
          })
          this.format();
        }).catch(err => {})
      },
      submitAddTag() {
        let params = [];
        this.tagList.map(item => {
          params.push(item.content)
        })
        if (!this.textFlag) {
          if (this.deleteSum == 0) {
            this.$store.dispatch('hideDialog')
          } else {
            this.$http('wx_contact_label/', "POST", params).then(res => {
              if (res.data.error_code == 0) {
                this.$message({
                  message: '添加标签成功',
                  type: 'success'
                });
                this.tagValue = '';
                this.$store.dispatch('hideDialog')
              } else {
                this.$message.error('添加失败');
              }
            }).catch(err => {})
          }
        }
      },
      //打标签
      handleMarking() {
        let name = [];
        let id = []
        this.settingTagList.map(item => {
          name.push(item.content)
          id.push(item.id)
        })
        if (id.length > 0) {
          this.$http('wx_contact_label/labeling', "POST", {
            "wxContactGroupMapIds": this.wxContentId.toString(),
            "wxContactLabelIds": id.join(',')
          }).then(res => {
            if (res.data.error_code == 0) {
              this.$message({
                message: '添加标签成功',
                type: 'success'
              });
              this.selectInit();
            } else {
              this.$message.error(res.data.error_message)
            }
            this.flag = 'lalala';
            this.$store.dispatch('hideDialog')
          }).catch(err => {})
        } else {
          this.$store.dispatch('hideDialog');
          this.selectInit();
        }
      },
      //设置标签
      handleTagSetting(id, userId, wx_contact_id) {
        this.settingTagList = [];
        let list = [];
        this.request = 0;
        this.wxContentId = id;
        this.wxUserId = userId;
        this.getTagList();
        this.$http('wx_contact_label/contact_label/' + wx_contact_id + '/' + userId, 'GET').then(res => {
          let data = res.data.data;
          if (res.data.error_code == 0) {
            data.map(item => {
              if (parseInt(item.wxContactLabelId % 5) == 1) {
                this.settingTagList.push({
                  content: item.labelName,
                  id: item.wxContactLabelId,
                  mapId: item.mapId,
                  type: ''
                })
              } else if (parseInt(item.wxContactLabelId % 5) == 2) {
                this.settingTagList.push({
                  content: item.labelName,
                  id: item.wxContactLabelId,
                  mapId: item.mapId,
                  type: 'success'
                })
              } else if (parseInt(item.wxContactLabelId % 5) == 3) {
                this.settingTagList.push({
                  content: item.labelName,
                  id: item.wxContactLabelId,
                  mapId: item.mapId,
                  type: 'info'
                })
              } else if (parseInt(item.wxContactLabelId % 5) == 4) {
                this.settingTagList.push({
                  content: item.labelName,
                  id: item.wxContactLabelId,
                  mapId: item.mapId,
                  type: 'warning'
                })
              } else {
                this.settingTagList.push({
                  content: item.labelName,
                  id: item.wxContactLabelId,
                  mapId: item.mapId,
                  type: 'danger'
                })
              }
              this.deleteTagList.push({
                content: item.labelName,
                id: item.wxContactLabelId,
                mapId: item.mapId
              })
            })
            this.format();
          }
        }).catch(err => {})
      },
      format() {
        this.request += 1;
        if (this.request == 2) {
          this.flag = 'setting';
          this.$store.dispatch("showDialog", {
            title: '标签设置',
            showCancel: true,
            flag: 'setting'
          })
          let arr = [];
          this.tagList.map((v, k) => {
            arr.push(v.id);
          })
          this.settingTagList.map((v, k) => {
            if (arr.indexOf(v.id * 1) != -1) {
              this.tagList.map((val, key) => {
                if (val.id == v.id * 1) {
                  this.tagList.splice(key, 1)
                }
              })
            }
          })
        }
      },
      handleSettingClose(tag) {
        if (tag.mapId != undefined) {
          this.$http('wx_contact_label/contact_label/label_cancel/' + tag.mapId, "PUT", ).then(res => {
            this.settingTagList.splice(this.settingTagList.indexOf(tag), 1);
            this.tagList.push(tag)
          }).catch(err => {})
        } else {
          this.settingTagList.splice(this.settingTagList.indexOf(tag), 1);
          this.tagList.push(tag)
        }
      },
      //新增标签
      addTag() {
        this.request = 0;
        if (this.selectIdList.length != 0) {
          this.friendsTagList = [];
          this.flag = 'add';
          this.getTagList();
          this.$store.dispatch("showDialog", {
            title: '添加标签',
            showCancel: true,
            flag: 'add'
          })
        } else {
          this.$message.error('请选择好友');
        }

      },
      friendsAddTag(item) {
        this.friendsTagList.push({
          type: item.type,
          content: item.content,
          id: item.id
        })
        this.tagList.splice(this.tagList.indexOf(item), 1);
      },
      handleAddTag() {
        let id = []
        this.friendsTagList.map(item => {
          id.push(item.id)
        })
        this.$http('wx_contact_label/labeling', "POST", {
          "wxContactGroupMapIds": this.selectContactId.join(','),
          "wxContactLabelIds": id.join(',')
        }).then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: '添加标签成功',
              type: 'success'
            });
            this.flag = 'lalala';
            this.$store.dispatch('hideDialog');
            this.selectInit();
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch(err => {})
      },
      chioceAddTag(item) {
        this.settingTagList.push({
          type: item.type,
          content: item.content,
          id: item.id
        })
        this.tagList.splice(this.tagList.indexOf(item), 1);
      },
      cancelCallback() {
        this.tagInputVisible = false;
        this.tagValue = '';
        this.$store.dispatch('hideDialog')
      }
    },
    mounted() {
      this.getFriendInfo();
      this.getLabelList();
      if (sessionStorage.getItem('indentity') === 'ROLE_USER') {
        this.accountType = true;
        this.getChildAccountList();
      }
    },
    created() {
      this.userId = sessionStorage.getItem("user_id");
      this.userName = localStorage.getItem("user_name");
      this.itemName = sessionStorage.getItem('username')
    },
    filters: {
      validationSex: function (val) {
        if (val == 1) {
          return '男'
        } else if (val == 2) {
          return '女'
        } else {
          return '未知'
        }
      }
    },
    components: {
      Dialog
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #manage {
    background-color: #e8eff6;

    .main_wrapper {
      background: #fff;
      overflow: hidden;

      .tag-group {
        text-align: left;
        padding: 30px 0 !important;
        overflow: hidden;
      }

      .have-box {
        text-align: left;
        overflow: hidden;
        margin-bottom: 20px;
      }

      .have-box-title {
        width: 100%;
        line-height: 40px;
        height: 40px;
        font-size: 16px;
        text-align: center;
        color: #409eff;
        background-color: #ebf4ff;
        margin-bottom: 20px;
      }

      .have-tag-box {
        text-align: left;
        overflow: hidden;
        height: 80px;
      }
    }

    .search {
      .search-content {
        overflow: hidden;
        color: #666;

        .el-select {
          width: 160px;
        }

        .left {
          float: left;
          display: flex;

          .group {
            margin-right: 20px;
            float: left;
          }

          span {
            font-size: 14px;
          }
        }

        .right {
          a {
            margin-right: 10px;
          }

          float:right;
        }
      }
    }

    .el-table {
      overflow: hidden;

      .el-button--small {
        padding: 0;
      }

      .el-input__inner {
        border: none !important;
      }

      .left {
        float: left;
        width: 100%;

      }

      .right {
        float: right;
        width: 15%;

        .top {
          background: #eff5f9;
          line-height: 14px;
          font-size: 14px;
          padding: 6px 15px;
          text-align: center;
        }

        ul {
          border: 1px solid #ebeef5;
        }

        li {
          height: 40px;
          line-height: 40px;
          padding-left: 10px;
        }
      }
    }

    .page {
      text-align: center;

      .el-pagination {
        display: inline-block;
      }
    }
  }

  .el-tag {
    margin-right: 10px;
  }

  .el-tag {
    cursor: pointer;
    margin-bottom: 8px;

  }

  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
  }

  .edit-group {
    margin-top: 20px;
  }

  .tag-box {
    line-height: 40px;
    text-align: left;
  }

  .button-new-tag::before {
    margin: 0
  }

  .v-modal {
    z-index: 0;
  }

</style>
