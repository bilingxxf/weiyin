<template>
  <div id="managent" class="main-body">
    <div class="manage main-wrapper">
      <div class="flex-total">
        <div class="item">
          <div class="number">{{accountTotal || '0'}}</div>
          <p>总数</p>
        </div>
        <div class="item">
          <div class="number">{{onlineAccount || '0'}}</div>
          <p>在线数</p>
        </div>
        <div class="item">
          <div class="number">{{unlineAccount || '0'}}</div>
          <p>离线数</p>
        </div>
      </div>
      <div class="headerButton">
        <el-button
          type="primary"
          class="ele-btn"
          @click="showOnLine"
          :disabled="timeOutStopBtn"
        >一键上线</el-button>
        <el-button type="primary" class="ele-btn" @click="showDownLine">一键下线</el-button>
      </div>
      <div class="search">
        <div class="page-title">
          <span>账号管理</span>
        </div>

        <!-- 账号详情 -->
        <div>
          <div class="search-content">
            <div class="left">
              <el-select size="small" class="ele-select" v-model="statu" @change="page = 1,init()">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                size="small"
                class="ele-select"
                v-model="selectGroup"
                placeholder="请选择分组"
                clearable
                @change="page=1,init()">
                  <el-option label="全部分组" value=""></el-option>
                <el-option
                  v-for="item in groups"
                  :key="item.value"
                  :label="item.wx_user_group_name"
                  :value="item.wx_user_group_id"
                ></el-option>
              </el-select>
              <el-select
                size="small"
                class="ele-select"
                v-model="accountStatusInfo"
                placeholder="状态"
                clearable
                @change="page=1,init()"
              >
                <el-option
                  v-for="item in accountStatusGroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                size="small"
                class="ele-select"
                v-model="terminalId"
                placeholder="所有客户终端"
                clearable
                @change="page=1,init()"
              >
                <el-option label="终端" value=""></el-option>
                <el-option label="未绑定" value="0"></el-option>
                <el-option
                  v-for="(item,index) in terminal"
                  :key="index"
                  :label="item.terminal_id==0?'未绑定':item.terminal_id+'('+item.onlineCount+'/'+item.terminalTotalCount+')'"
                  :value="item.terminal_id"
                ></el-option>
              </el-select>

              <el-select
                size="small"
                class="ele-select"
                v-model="selectChildAccountId"
                placeholder="所属账号"
                clearable
                @change="page=1,init()"
                v-if="accountType">
                <el-option label="所属账号" value=""></el-option>
                <el-option :label=username :value=userId></el-option>
                <el-option
                  v-for="(item,index) in bindChildAccountList"
                  :key="index"
                  :label="item.user_name"
                  :value="item.user_id"
                ></el-option>
              </el-select>
              <el-input
                class="ele-input"
                @change="page=1,init()"
                placeholder="请输入微信号或微信昵称"
                suffix-icon="el-icon-search"
                v-model="wxorname"
              ></el-input>
            </div>
            <div class="right">
              <el-button type="primary" class="ele-btn" @click="reportData">导出数据</el-button>
              <el-button type="primary" class="ele-btn" @click="routeAdd">添加账号</el-button>
              <el-button type="primary" class="ele-btn" @click="handleRefresh">刷新</el-button>
            </div>
          </div>
          <div class="table">
            <div class="edit-group">
              <em>批量操作：</em>
              <span class="edit-btn" type="text" size="mini" @click="showModel('name','修改昵称')">修改昵称</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('head','修改头像')">修改头像</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('signature','修改签名')">修改签名</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('area','修改地区')">修改地区</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('sex','修改性别')">修改性别</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('validate','好友验证')">好友验证</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('delete','删除')">删除</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('group','修改分组')">修改分组</span>
              <span class="edit-btn" @click="showModel('cover','设置朋友圈封面')">设置朋友圈封面</span>
              <span class="edit-btn" @click="showModel('power','设置朋友圈权限')">设置朋友圈权限</span>
              <span class="edit-btn" @click="tableOneKeyModel('group','上线')">上线</span>
              <span class="edit-btn" @click="showModel('bindTerminal','绑定客户终端')">绑定客户终端</span>
              <span class="edit-btn" @click="showModel('unbindTerminal','解除客户终端')">解除客户终端</span>
              <span v-if="accountType" class="edit-btn" @click="showModel('bindChildAccount','绑定子账号')">绑定子账号</span>
              <span v-if="accountType"  class="edit-btn" @click="showModel('unbindChildAccount','解绑子账号')">解绑子账号</span>
              <span class="edit-btn" @click="showModel('showFriendCount','显示好友信息')">显示好友信息</span>
              <!-- <span v-if="accountType"  class="edit-btn" @click="showModel('treeChildAccount','绑定子账号')">树状子账号</span> -->
            </div>
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="tableLoading"
              class="ele-table-init"
              @sort-change="addSort"
              :default-sort = "{prop: 'addCount', order: addSortOrder}"
              ref="multipleTable"
            >
             <el-table-column type="selection" align="left" fixed="left" width="40"></el-table-column>
              <el-table-column label="序号" width="48" align="left">
                <template slot-scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
              </el-table-column>
              <el-table-column label="头像" align="left" width="48">
                <template slot-scope="scope">
                  <img v-lazy="scope.row.smallHead" height="100" :key="scope.row.smallHead" @click="getHeadIMg(scope)">
                </template>
              </el-table-column>
              <el-table-column width="76" label="所属账号" align="left" v-if="accountType">
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
              <el-table-column width="76" label="账号昵称" align="left">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.nickname}"
                    placement="bottom"
                    effect="light"
                    :offset="80"
                  >
                    <span slot="content">{{scope.row.nickname}}</span>
                    <p class="writeWrapper">{{scope.row.nickname}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="微信号" width="78" align="left">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.wx_username}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80"
                  >
                    <span class="tooltipText" slot="content">
                      <span class="tooltipText">{{scope.row.wx_username}}</span>
                    </span>
                    <p class="writeWrapper">{{scope.row.wx_username}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="签名" width="85" align="left">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.signature}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80"
                  >
                    <span class="tooltipText" slot="content">
                      <span class="tooltipText">{{scope.row.signature}}</span>
                    </span>
                    <p class="writeWrapper">{{scope.row.signature}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="sex" label="性别" width="48" align="left">
                <template slot-scope="scope">{{scope.row.sex | capitalize}}</template>
              </el-table-column>
              <el-table-column label="二维码" align="left" width="62">
                <template slot-scope="scope">
                  <img src="../../assets/erweima.png" height="100" @click="getCode(scope.$index)">
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机号" align="left" width="110"></el-table-column>
              <el-table-column prop="pingCity" label="地区" align="left" width="98">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.pingCity}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80"
                  >
                    <span slot="content">{{scope.row.pingCity}}</span>
                    <p class="writeWrapper">{{scope.row.pingCity}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="好友数" align="center" width="65">
                <template slot-scope="scope">
                  <span v-show="scope.row.inspect=='0'">-</span>
                  <span v-show="scope.row.inspect=='1'">{{scope.row.contactCount}}</span>  
                </template>
              </el-table-column>
              <el-table-column prop="currenContactCount" label="新增" align="center" width="50">
                <template slot-scope="scope">
                  <span v-show="scope.row.inspect=='0'">-</span>
                  <span v-show="scope.row.inspect=='1'">{{scope.row.currenContactCount}}</span>  
                </template>
              </el-table-column>
              <el-table-column prop="waitContactCount" label="待通过" align="center" width="62">
                <template slot-scope="scope">
                   <span v-show="scope.row.inspect=='0'">-</span>
                  <span v-show="scope.row.inspect=='1'">{{scope.row.waitContactCount}}</span>  
                </template>
              </el-table-column>
              <el-table-column prop="group_name" label="分组" align="center" width="55">
                 <template slot-scope="scope">
                    <el-tooltip
                      :open-delay="350"
                      content="{scope.row.group_name}"
                      placement="bottom-end"
                      effect="light"
                      :offset="80">
                        <span slot="content">{{scope.row.group_name}}</span>
                        <p class="writeWrapper" >{{scope.row.group_name}}</p>
                    </el-tooltip>
                  </template>
              </el-table-column>
              <el-table-column prop="locked" label="状态" align="left" width="56">
                <template slot-scope="scope">
                  <span :class="{online:scope.row.online==1,offline:scope.row.online==0}">{{scope.row.online | statulize}}</span></template>
              </el-table-column>
              <el-table-column prop="status" label="健康状态" align="left" width="76">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.status | accountStatus}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80">
                      <span slot="content">{{scope.row.status | accountStatus}}</span>
                      <p class="writeWrapper" :class="{normal:scope.row.status==0,abnormal:scope.row.status!=0}">{{scope.row.status | accountStatus}}</p>
                  </el-tooltip>
                  </template>
              </el-table-column>
              <el-table-column prop="errorMessage" label="状态描述" align="left" width="76">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                     content="{scope.row.errorMessage ? ((scope.row.errorMessage.indexOf('系统检测到环境存在异常，为了你的帐号安全， 请轻触“确定”进行安全验证。')>-1||scope.row.errorMessage.indexOf('该微信帐号因使用了微信外挂、非官方客户端或模拟器，被限制登录，请尽快卸载对应的非法软件。若后续仍继续使用将永久限制登录。如需继续使用，请轻触“确定”申请解除限制。')>-1)?'当前帐号的使用存在异常，为保护帐号安全，系统将其自动置为保护状态，被限制登录，如需继续使用，请轻触“确定”申请解除限制。':scope.row.errorMessage):'正常'}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80">
                      <span slot="content">{{scope.row.errorMessage ? ((scope.row.errorMessage.indexOf('系统检测到环境存在异常，为了你的帐号安全， 请轻触“确定”进行安全验证。')>-1||scope.row.errorMessage.indexOf('该微信帐号因使用了微信外挂、非官方客户端或模拟器，被限制登录，请尽快卸载对应的非法软件。若后续仍继续使用将永久限制登录。如需继续使用，请轻触“确定”申请解除限制。')>-1)?'当前帐号的使用存在异常，为保护帐号安全，系统将其自动置为保护状态，被限制登录，如需继续使用，请轻触“确定”申请解除限制。':scope.row.errorMessage):'正常'}}</span>
                      <p class="writeWrapper">{{scope.row.errorMessage ? ((scope.row.errorMessage.indexOf('系统检测到环境存在异常，为了你的帐号安全， 请轻触“确定”进行安全验证。')>-1||scope.row.errorMessage.indexOf('该微信帐号因使用了微信外挂、非官方客户端或模拟器，被限制登录，请尽快卸载对应的非法软件。若后续仍继续使用将永久限制登录。如需继续使用，请轻触“确定”申请解除限制。')>-1)?'当前帐号的使用存在异常，为保护帐号安全，系统将其自动置为保护状态，被限制登录，如需继续使用，请轻触“确定”申请解除限制。':scope.row.errorMessage):'正常'}}</p>
                  </el-tooltip>
                  </template>
              </el-table-column>
              <el-table-column prop="locked" label="登录方式" align="left" width="76">
                <template slot-scope="scope">
                  <span>{{scope.row.loginType | loginStatus}}</span></template>
              </el-table-column>
              <el-table-column prop="terminalId" label="所属终端ID" align="left" width="132">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{}"
                    placement="bottom"
                    effect="light"
                    :offset="80"
                  >
                    <span slot="content">{{scope.row.terminalId}}</span>
                    <p class="writeWrapper">{{scope.row.terminalId}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.online===1"
                    @click="takeLogout(scope.$index),batchName='下线'"
                  >下线</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.online===0"
                    @click="takeLogin(scope.$index),batchName='上线'"
                  >上线</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.online===1"
                    @click="takeFriend(scope.row)"
                  >朋友圈</el-button>
                  <el-button
                    type="text"
                    @click="takeUserID(scope.$index)"
                    v-if="scope.row.wx_username.startsWith('wxid')&&scope.row.online===1"
                  >设置微信号</el-button>
                </template>
              </el-table-column>
              <el-table-column width="5"></el-table-column>
            </el-table>
          </div>
          <div class="pagination" v-if="tableData.length!=0">
            <el-input v-model="customCount" class="ele-input130" style="display:inline;top:4px;" @keyup.native="number" @keyup.enter.native="handleCustomCount" placeholder="请输入自定义数量"></el-input>
            <el-pagination
              @size-change="recordSizeChange"
              @current-change="recordCurrentChange"
              :current-page.sync="page"
              :page-sizes="[10, 20, 50, 100,500]"
              :page-size="limit"
              layout="total,sizes, prev, pager, next"
              :total="allAccount"
              style="display:inline-block;"
            ></el-pagination>
          </div>
        </div>
        <!-- 已注销账号 -->
        <div v-if="cancellation" key="cancellation"></div>
      </div>
      <!--表格头部上线-->
      <Dialog @callback="tableOnekeyOnline" v-if="dialogFlag=='tableOneKey'">
        <div class="dialog-content downline" slot="content">
          <p>是否确认上线</p>
          <p>上线后，请勿进行解绑操作！</p>
        </div>
      </Dialog>
      <Dialog @callback="logoutBnt" v-if="dialogFlag=='downline'">
        <div class="dialog-content downline" slot="content">
          <p>确定要下线吗</p>
          <p>如有任务正在运行，请不要轻易下线，否则任务不能正确执行。</p>
        </div>
      </Dialog>
      <Dialog @callback="loginBnt" v-if="dialogFlag=='online'">
        <div class="dialog-content online" slot="content">
          <p>是否确认上线</p>
          <p>上线后，请勿进行解绑操作！</p>
        </div>
      </Dialog>
      <Dialog @callback="downline" v-if="dialogFlag=='batch-downline'">
        <div class="dialog-content online" slot="content">
          <p>确定要批量下线吗？</p>
          <p>如有任务正在运行，请不要轻易下线，否则任务不能正确执行。</p>
        </div>
      </Dialog>
      <Dialog @callback="online" v-if="dialogFlag=='batch-online'">
        <div class="dialog-content batch-online" slot="content">
          <p>是否确认批量上线？</p>
          <p>上线后，请勿进行解绑操作！</p>
        </div>
      </Dialog>
      <!--修改昵称-->
      <Dialog @callback="batchUp" v-if="dialogFlag=='name'" @cancelCallback="resetInitData">
        <div class="dialog-content name" slot="content">
          <span style="color:#666;">昵称：</span>
          <el-input class="ele-input" v-model="batch.nickname" placeholder="请输入昵称"></el-input>
        </div>
      </Dialog>
      <!--修改头像-->
      <Dialog @callback="imagebatchUp" v-if="dialogFlag=='head'" @cancelCallback="cancelImg">
        <div class="dialog-content head" slot="content">
          <el-upload
            class="avatar-uploader"
            ref="uploadFriend"
            :auto-upload="false"
            :action="uploadUrl"
            :show-file-list="false"
             :before-upload="beforeUploadHead"
            :on-change="changeImg"
            :on-success="successHeadimg">
            <img v-if="img" :src="img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </div>
      </Dialog>
      <!--修改地区-->
      <Dialog @callback="citybatchUp" v-if="dialogFlag=='area'" @cancelCallback="resetInitData">
        <div class="dialog-content area" slot="content">
          <el-cascader
            class="ele-select"
            :options="cityOptions"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </div>
      </Dialog>
      <!--修改性别-->
      <Dialog @callback="setsexBatchUp" v-if="dialogFlag=='sex'" @cancelCallback="resetInitData">
        <div class="dialog-content sex" slot="content">
          <el-select class="ele-select" v-model="batch.sex" placeholder="请选择">
            <el-option
              v-for="item in batchSexs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
      <!--修改好友验证-->
      <Dialog @callback="validationbtn" v-if="dialogFlag=='validate'" @cancelCallback="resetInitData">
        <div class="dialog-content validate" slot="content">
          <el-select class="ele-select" v-model="batch.validations" placeholder="请选择">
            <el-option
              v-for="item in batchvalidation"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
      <Dialog @callback="deleteidbatchUp" v-if="dialogFlag=='delete'">
        <div class="dialog-content delete" slot="content">
          <p style="color:#666;">确定要删除吗？</p>
        </div>
      </Dialog>
      <Dialog @callback="setGroupBatchUp" v-if="dialogFlag=='group'" @cancelCallback="resetInitData">
        <div class="dialog-content group" slot="content">
          <el-select class="ele-select" v-model="groupsTwo" placeholder="请选择分组">
            <el-option
              v-for="item in groupsTwos"
              :key="item.wx_user_group_id"
              :label="item.wx_user_group_name"
              :value="item.wx_user_group_id"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
      <Dialog v-if="dialogFlag=='code'">
        <div class="dialog-content qrcode" slot="content">
          <div class="qrcode-box" id="qrcode" ref="qrcode" v-if="getQrCode" v-loading="loading"></div>
          <div class="qrcode-box" v-else>
            <img src="../../assets/no.svg" style="width:100%;height:100%" alt v-if="noHave">
            <img src="../../assets/fail.svg" style="width:100%;height:100%" alt v-if="fail">
          </div>
        </div>
      </Dialog>
      <!-- 设置朋友圈封面 -->
      <Dialog @callback="imageCover" v-if="dialogFlag=='cover'" @cancelCallback="hideModel">
        <div class="dialog-content head" slot="content">
          <el-upload
            class="avatar-uploader"
            ref="friendCover"
            :auto-upload="false"
            :action="uploadUrl"
            :show-file-list="false"
             :before-upload="beforeUploadFriend"
            :on-change="changeImgCover"
            :on-success="successCover">
            <img v-if="img" :src="img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span style="font-size:15px;position:relative;top:20px;">建议：尺寸480*300，小于500KB</span>
        </div>
      </Dialog>

      <!-- 设置朋友圈权限 -->
      <Dialog @callback="powerscallback" v-if="dialogFlag=='power'" @cancelCallback="hideModel">
        <div class="dialog-content sex" slot="content">
          <el-select class="ele-select" v-model="setPowers" placeholder="请选择">
            <el-option
              v-for="item in powers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
        <!-- 设置微信号 -->
      <Dialog @callback="useridbatchUp" v-if="flag=='wxh'" @cancelCallback="hideModel">
        <div class="dialog-content sex" slot="content">
            <span style="color:#666;">微信号：</span>
            <el-input class="ele-input" v-model="batch.userid" placeholder="输入微信号"></el-input>
        </div>
      </Dialog>
      <!-- 查看二维码-->
       <Dialog v-if="dialogFlag=='qrcode'">
        <div class="dialog-content qrcode" slot="content">
          <div class="qrcode-box" id="qrcode" ref="qrcode" v-if="getQrCode" v-loading="loading"></div>
          <div class="qrcode-box" v-else>
            <img src="../../assets/no.svg" style="width:100%;height:100%" alt v-if="noHave">
            <img src="../../assets/fail.svg" style="width:100%;height:100%" alt v-if="fail">
          </div>
        </div>
      </Dialog>

      <Dialog v-if="dialogFlag=='bindTerminal'" @callback="bindTerminalEve" @cancelCallback="bindCancelCallback">
        <div class="dialog-content bind-terminal" slot="content">
          <el-select
            size="small"
            class="ele-select"
            v-model="bindTerminalId"
            placeholder="选择绑定终端"
            clearable
          >
            <el-option
              v-for="(item,index) in terminal"
              v-if="item.terminal_id!=0"
              :key="index"
              :label="item.terminal_id"
              :value="item.terminal_id"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
      <Dialog v-if="dialogFlag=='unbindTerminal'" @callback="unbindTerminalEve">
        <div class="dialog-content unbind-terminal" slot="content" @callback="unbindTerminalEve">
          <p>确定要解除客户终端吗？</p>
        </div>
      </Dialog>
      <Dialog v-if="dialogFlag=='bindChildAccount'" @callback="bindChildAccountEve" @cancelCallback="bindChildAccountCancelCallback">
        <div class="dialog-content sub-account" slot="content">
          <el-select
            size="small"
            class="ele-select"
            v-model="bindChildAccountId"
            placeholder="选择绑定子账号"
            clearable
          >
            <el-option
              v-for="(item,index) in bindChildAccountList"
              v-if="item.terminal_id!=0"
              :key="index"
              :label="item.user_name"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </div>
      </Dialog>

      <Dialog v-if="dialogFlag=='unbindChildAccount'" @callback="unbindChildAccountEve">
        <div class="dialog-content unbind-terminal" slot="content">
          <p>确定要解除子账号吗？</p>
        </div>
      </Dialog>

      <Dialog v-if="dialogFlag=='showFriendCount'" @callback="handleFriendInfo">
        <div class="dialog-content unbind-terminal" slot="content">
          <p>确定要显示好友信息吗？</p>
        </div>
      </Dialog>

      <Dialog v-if="dialogFlag=='headImg'">
        <div class="dialog-content unbind-terminal" slot="content">
          <img :src="bigHead" alt="" style="width:200px;height:200px;object-fit: cover;border:1px solid #ccc;">
        </div>
      </Dialog>

      <!-- 修改签名 -->
       <Dialog v-if="dialogFlag=='signature'" @callback="handleSignature">
        <div class="dialog-content dialog-detail" style="padding:40px 0;position:relative;" slot="content">
          <textarea placeholder="请输入内容"  v-model="noteValue"  @input="noticeChange"></textarea>
          <span class="total">{{noteCount}}/{{noteTotal-noteCount}}</span>
        </div>
      </Dialog>   

      <!-- 树状子账号 -->
      <Dialog @callback="sendAcount" v-if="dialogFlag == 'treeChildAccount'" @cancelCallback="cancelCallback">
        <div class="dialog-content modal-body check-account" slot="content" style="padding:30px 0 40px;">
          <div class="content">
            <div class="left">
              <el-scrollbar class="scroll-bar" style="height:calc(100% - 20px);height:-webkit-calc(100% - 20px);">
                <el-tree
                  :data="treeChildData"
                  show-checkbox
                  node-key="id"
                  highlight-current
                  :props="defaultProps"
                   ref="treeForm" 
                  @check-change="handleClick" >
                </el-tree>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </Dialog>

      <!-- 导出数据 -->
      <Dialog v-if="dialogFlag=='reportXLS'" @callback="handleReportData">
        <div class="dialog-content unbind-terminal" slot="content">
          <p v-if="jsonName.length>0">是否导出已选择数据？</p>
          <p v-else>是否选择导出全部数据？</p>
        </div>
      </Dialog>
      <!-- 蒙层 -->
      <div class="mask" v-show="mask"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import City from "../../../static/city";
import QRCode from "qrcodejs2";
import {config} from "../../api/http.js";
import Dialog from "../../components/dialog.vue";
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';
import  util from '../../../static/js/common.js';
var downloadXLS = util.downloadXLS;

export default {
  components: {
    Dialog
  },
  data(){
    return {
      bindChildAccountList:[],
      bindChildAccountId:"",
      terminal:[],
      terminalId:"",
      bindTerminalId:"",
      text:"",
      powers: [
        {
          value: 1,
          label: "全部"
        },
        {
          value: 2,
          label: "半年"
        },
        {
          value: 3,
          label: "3天"
        }
      ],
      setPowers: "",
      flag: "",
      cityOptions: [],
      citySelect: {
        country: "CN",
        city: null,
        province: null
      },
      UserID: [],
      qr_codeID: [],
      friendID: [],
      multipleSelection: [],
      selectedOptions: [],
      jsonName: [],
      taskGroupName: "",
      selectGroup: "",
      ids: [],
      setgroup: false,
      signature: false,
      deleteid: false,
      setsex: false,
      validation: false,
      permissions: false,
      logout: false,
      login: false,
      Friend: false,
      setUserID: false,
      setcityAccording: false,
      friendImg: "friendImg",
      img: "",
      uploadUrl: "",
      uploadFriend: "",
      batchChanges: false,
      batch: {
        nickname: "",
        sex: 1,
        textarea: "",
        group: null,
        city: [],
        pass: "",
        userid: "",
        validations: true,
        permissions: ""
      },
      batchSexs: [
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        }
      ],
      batchvalidation: [
        {
          label: "需要验证",
          value: true
        },
        {
          label: "不需要验证",
          value: false
        }
      ],
      friendsterData: {
        key: "",
        takeText: "",
        group_all: [],
        flock_all: [],
        content: [],
        nickName: [],
        takeImage: [],
        wx_username: [],
        time: ""
      },
      tableNew: [],
      batchChange: false,
      batchName: "",
      accountTotal: 0,
      newAccount: 0,
      onlineAccount: 0,
      unlineAccount: 0,
      placeholder: "请输入账号",
      wxorname: "",
      pageNo: 1,
      limit: 10,
      page: 1,
      currentPage: 1,
      total: 0,
      allAccount: 0,
      tableData: [],
      mask: false,
      cancellation: false,
      statu: "",
      status: [
        {
          label: "全部账号",
          value: ""
        },
        {
          label: "在线",
          value: 1
        },
        {
          label: "离线",
          value: 2
        }
      ],
      group: "",
      groups: [],
      groupsTwo: "",
      groupsTwos: [],
      sex: "",
      userId: [],
      href: "", //数据导出
      addAccount: "",
      task_template_list: [],
      downloadLength: 0,
      getQrCode: true,
      loading: true,
      showLoading: true,
      tableLoading: true,
      fail: false,
      noHave: false,
      publicUrl: config,
      mainPage: "",
      accountStatusInfo: "", // 健康状态
      accountStatusGroup: [
        {
          value: "",
          label: "健康状态"
        },
        {
          value: -2,
          label: "正常"
        },
        {
          value: 1,
          label: "封号"
        },
        {
          value: 2,
          label: "密码错误"
        },
        {
          value: 3,
          label: "环境异常"
        },
        {
          value: 4,
          label: "Token过期"
        },
        {
          value: 5,
          label: "主机需要授权"
        },
        {
          value: 101,
          label: "其它错误"
        }
      ],
      timeOutStopBtn: false,
      addSortOrder:"descending",
       oldGroupId:[],//微信号以前分组
       previousPage:false,
       accountType:false,
       selectChildAccountId:"",
       username:"",
       childUserId:"",
       bigHead:"",
        noteValue:"",
        noteCount:0,
        noteTotal:30,
        treeChildData:[],
        defaultProps:{
          children: 'children',
          label: 'label'
        },
        i:0,
        treeParentId:"",
        treeTerminalId:"",
        customCount:''
    };
  },
  created() {
    this.cityOptions = City.citys();

    this.username = sessionStorage.getItem("username")
    this.userId = sessionStorage.getItem("user_id");
    this.token = sessionStorage.getItem("token");
    this.href =
      this.publicUrl.linkUrl +
      "api/v1/download_excel?token=" +
      this.token +
      "&limit=99999" +
      "&page=1" +
      "&is_online" +
      this.statu;
    this.addAccount = "";
  },
  computed:{
      ...mapState([
        'dialogFlag'
    ])
  },
  mounted() {
    this.getChildAccountList();
    if(sessionStorage.getItem('indentity')==='ROLE_USER'){
        this.accountType=true;
      }
    this.getResources();
    this.init();
    // 上传头像地址
    this.uploadUrl =
      this.publicUrl.resourceUrl +
      "api/v1/file?type=tyc_userHeaderImage&key=" +
      this.userId;
    //发圈图地址
    this.uploadUrlFriend =
      this.publicUrl.resourceUrl +
      "api/v1/file?type=tyc_sendpostImg&key=" +
      sessionStorage.getItem("user_id");
    // 分组select列表
    this.$http("wx_group/group_list", "POST", {
      limit: 99999,
      page: 1
    }).then(res => {
        if (res.data.error_code == 0) {
          this.groups = res.data.data.result;
        } else {
          this.$message({
            message: "获取列表失败:" + res.data.error_message,
            type: "error"
          });
        }
      })
      .catch(err => {});
    //获取任务列表
    this.$http("task_template", "GET", {
      per_page: 99999,
      page: 1
    })
      .then(res => {
        if (res.data.error_code == 0) {
          this.task_template_list = res.data.data.result;
        } else {
          this.$message({
            message: "获取列表失败:" + res.data.error_message,
            type: "error"
          });
        }
      })
      .catch(err => {});
    this.getTerminal();
  },
  methods: {
    reportData(){
      this.$store.dispatch("showDialog", {
        title: "导出数据",
        showCancel: true,
        flag:"reportXLS"
      });
    },
    handleReportData(){
      if(this.jsonName.length>0){
         let url = this.publicUrl.linkUrl +"api/v1/download_excel?token=" +this.token +"&limit=99999" +"&page=1" +"&is_online=&group_name=&wxids="+this.jsonName.toString();
         downloadXLS(url);
      }else{
        downloadXLS(this.href)
      }
      this.hideModel();
    },
    //自定义数量检测
    number(){
      this.customCount=this.customCount.replace(/[^\.\d]/g,'');
      this.customCount=this.customCount.replace('.','');
      if(this.customCount<1||this.customCount>500){
          this.customCount="";
      }
    },
    //自定义数量
    handleCustomCount(){
      this.page = 1;
      if(this.customCount==''){
        this.limit=10;
      }else{
         this.limit = Number(this.customCount);
      }
      this.init();
    },
    //刷新
    handleRefresh(){
      this.init();
    },
    sendAcount(){
      if(this.$refs.treeForm.getCheckedNodes().length==0){
        this.$message({
              message: "请选择终端！",
              type: "error"
            });
      }else{
         this.$http("terminal/binding_wxuser_terminal","PUT",{
            childUserId:this.treeParentId,
            ids:this.jsonName,
            terminalId:this.treeTerminalId
         }).then((res)=>{
            if(res.data.error_code==0){
              if(res.data.data.code==0){
                this.$message.success(res.data.data.message);
              }else{
                this.$message.error(res.data.data.message);
              }
              
            }else{
              this.$message.error(res.data.error_message);
            }
          }).catch((err)=>{
            this.$message.error(err);
          })
      }
    },
    cancelCallback(){
      this.hideModel();
    }, 
    handleClick(data, checked, node){
      if(checked == true){
          this.$refs.treeForm.setCheckedNodes([data]);
          if(this.$refs.treeForm.getCheckedNodes(false,true).length==2){
            this.treeParentId = this.$refs.treeForm.getCheckedNodes(false,true)[0].id;
            this.treeTerminalId = this.$refs.treeForm.getCheckedNodes(false,true)[1].id;
          }
      }
    },
    //签名字数限制
      noticeChange(e){
        this.noteCount=e.target.value.length;
        if(this.noteCount<=this.noteTotal){
          this.noteCount=this.noteValue.length;
          this.noteValue=e.target.value;
        }else{
          this.noteCount=this.noteTotal;
          this.noteValue=e.target.value.substring(0,this.noteTotal);
        }
      },
    //修改签名
    handleSignature(){
      var result=this.noteValue.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
      if(result.length==0){
         this.$message({
            message: "请输入合法签名",
            type: "error"
          });
        return
      }
      let param = {};
      param.signature = result;
      let data = {
        taskTemplateName:"设置签名",
        planParams:JSON.stringify(param),
        wxIds:this.jsonName.toString()
      }
      let str = {
        param:JSON.stringify(data)
      }
      this.$http('plan/start_plan','POST',str)
        .then(res=>{
          if (res.data.error_code == 0) {
            this.noteValue = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.init();
            this.hideModel();
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
        }).catch(err=>{
          this.$message({
            message: err,
            type: "error"
          });
        })
    },
    //查看头像
    getHeadIMg(scope){
      if(scope.row.bigHead!=""){
        this.bigHead = scope.row.bigHead;
        this.$store.dispatch("showDialog", {
          title: "头像",
          flag:'headImg'
        });
      }else{
        this.$message({
          message: "获取头像失败",
          type: "error"
        });
      }
    },
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
    //设置子账号
    bindChildAccountEve(){
      if(this.bindChildAccountId==""){
          this.$message.error("请选择子账号");
          return false;
      }
      if(this.jsonName.length==0){
        this.$message.error("请选择账号");
         return false;
      }
      this.childAccount(this.jsonName,1,this.bindChildAccountId);
    },
    unbindChildAccountEve(){
      if(this.jsonName.length==0){
        this.$message.error("请选择账号");
         return false;
      }
     this.$http("user/binding_wxuser","PUT",{
         ids:this.jsonName,
         operationType:2
      }).then((res)=>{
        if(res.data.error_code==0){
            this.$message({
              message: res.data.error_message,
              type: "success"
            });
        }else{
          this.$message.error(res.data.error_message);
        }
        this.bindChildAccountId="";
        this.$store.dispatch("hideDialog");
        this.init();

      }).catch((err)=>{
        console.log(err);
      })
    },
    //显示好友信息
    handleFriendInfo(){
        this.loading = true;
        this.$http('wx_wxuser/wx_user_contact_count','POST',{
          wxUserIds:this.jsonName
        }).then(res=>{
          if(res.data.error_code==0){
            this.$store.dispatch("hideDialog");
            let data = res.data.data;
            let obj = {};
            let arr1 = [];
            this.tableData.map((item,index)=>{
              obj[item['wx_user_id']] = index;
            })
            let obj1 = {};
            data.map(item=>{
              obj1[item['wxUserId']]=item;
            })
            for(var item in obj1){
              this.tableData[obj[item]]['contactCount']=obj1[item]['contactCount'];
              this.tableData[obj[item]]['currenContactCount']=obj1[item]['currenContactCount'];
              this.tableData[obj[item]]['waitContactCount']=obj1[item]['waitContactCount'];
              this.tableData[obj[item]]['inspect']=1;
            }
            this.$refs.multipleTable.clearSelection();
            this.loading = false;
          }else{
            this.$message.error(res.data.error_message)
          }
        }).catch(err=>{
          this.$message.error(err)
        })
    },
    //绑定解绑
    childAccount(ids,operationType,userId){
       this.$http("user/binding_wxuser","PUT",{
         ids:ids,
         operationType:operationType,
         userId:userId
      }).then((res)=>{
        if(res.data.error_code==0){
          this.$message({
            message: res.data.error_message,
            type: "success"
          });
        }else{
          this.$message.error(res.data.error_message);
        }
        this.bindChildAccountId="";
        this.$store.dispatch("hideDialog");
        this.init();
      }).catch((err)=>{
        console.log(err);
      })
    },
    //设置子账号取消回调
    bindChildAccountCancelCallback() {
      this.$store.dispatch("hideDialog");
    },
    //头像，朋友圈封面取消
    cancelImg(){
      this.hideModel();
      this.img = "";
    },
    //新增好友排序
    addSort(sortData){
      let sortType=sortData.order;
      this.addSortOrder=sortType;
    },
    //绑定终端取消回调
    bindCancelCallback(){
      this.bindTerminalId="";
      this.$store.dispatch("hideDialog");
    },
    //解绑终端
    unbindTerminalEve(){
      this.$http("terminal/binding","PUT",{
        operationType:2,
        ids:this.jsonName
      }).then((res)=>{
        if(res.status==200){
          let code=res.data.code;
          let msg=res.data.message;
          switch (code) {
            case 0:
              this.$message.success("解绑成功!");
              this.page=1;
              this.init();
              this.getTerminal();
              break;
            default:
              this.$message.error(msg)
              break;
          }
          this.$store.dispatch("hideDialog");
          this.bindTerminalId="";
        }else{
          this.$message.error("解绑失败!");
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    //绑定终端
    bindTerminalEve(){
      let _this=this;
      if(this.bindTerminalId==""){
        this.$message.warning("请选择绑定终端");
        return;
      }
      this.$http("terminal/binding","PUT",{
        operationType:1,
        terminalId:this.bindTerminalId,
        ids:this.jsonName
      }).then((res)=>{
        if(res.status==200){
          let code=res.data.code;
          let msg=res.data.message;
          switch (code) {
            case 0:
              this.$message.success("绑定成功!");
              this.page=1;
              this.init();
              this.getTerminal();
              break;
            default:
              this.$message.error(msg)
              break;
          }
          this.$store.dispatch("hideDialog");
          this.bindTerminalId="";
        }else{
          this.$message.error("绑定失败!");
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    //获取终端列表
    getTerminal() {
      this.$http("terminal/searchkey", "GET", {
        userId: sessionStorage.getItem("user_id")
      }).then((res) => {
        if (res.data.error_code == 0) {
          let list = res.data.data;
          if(list instanceof Array){
            this.terminal = list;
          }
        }else{
           this.$message.error("获取终端列表失败");
        }
      })
    },
    //恢复初始数据
    resetInitData(){
      this.batch.nickname = "";
      this.batch.sex = 1;
      this.batch.textarea = "";
      this.groupsTwo = "";
      this.selectedOptions=[];
      this.batch.pass = "";
      this.batch.userid = "";
      this.batch.validations = true;
      this.batch.permissions = "";
      this.$store.dispatch("hideDialog");
    },
    //朋友圈权限
    setPower(row, title) {
      this.UserID.push(row.wx_user_id);
      this.flag = "power";
      this.$store.dispatch("showDialog", {
        title: title,
        showCancel: true,
        flag:"power"
      });
    },
    powerscallback() {
      let param = {};
      param.permission = this.setPowers;
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置朋友圈权限",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.UserID = [];
            this.setPowers = "";
            this.hideModel();
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
    successCover() {
      axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_userHeaderImage&key=" +
            this.userId,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.mainPage = this.publicUrl.newResourceUrl + res.data.data;
            let param = {};
            param.mainPage = this.mainPage;
            let paramInfo = JSON.stringify(param);
            let data = {
              taskTemplateName: "设置朋友圈封面",
              planParams: paramInfo,
              wxIds: this.UserID.toString() || this.jsonName.toString()
            };
            let str = {
              param: JSON.stringify(data)
            };
            this.$http("plan/start_plan", "POST", str)
              .then(res => {
                if (res.data.error_code == 0) {
                  this.specifyInput = "";
                  this.$message({
                    message: "执行成功",
                    type: "success"
                  });
                  this.UserID = [];
                  this.hideModel();
                  this.img = "";
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
          } else {
            this.$message({
              message: "查询图片失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "查询图片失败",
            type: "error"
          });
        });
    },
    imageCover() {
      let _this = this;
      let img = _this.img;
      if (img == "") {
        this.$message.error("请上传图片");
        return;
      }
      this.setimage('imageCover');
    },
    changeImgCover(file, fileList) {
       this.img = "";
       this.img = URL.createObjectURL(file.raw);
       var $this = this;
      let flag = false;
      var isIMG;
      if (file.raw.type === "image/jpeg") {
        flag = true;
        isIMG = file.raw.type === "image/jpeg";
      } else if (file.raw.type === "image/png") {
        flag = true;
        isIMG = file.raw.type === "image/png";
      }
      const isLt2M = file.size / 1024 < 500;
      if (!flag) {
        this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
        this.img = "";
        return false;
      }
      if (!isLt2M) {
         this.img = "";
        this.$message.error("上传图片大小不能超过 500KB!");
        return false;
      }
    },
    showModel(type, title) {
      let _this = this;
      if (_this.jsonName.length == 0) {
        _this.$message.error("请选择账号！");
        return;
      }
      switch (type) {
        case "group":
          _this.AnGroup();
          break;
        case "treeChildAccount":
             this.$http("child_user/merge_list","POST",{
                length:9999,
                pageNo:1,
                parentUserId:Number(sessionStorage.getItem('user_id'))
              }).then((res)=>{
                if(res.data.error_code==0){
                  let data =[];
                  res.data.data.forEach(item=>{
                    if(item.children.length>0){
                      item['disabled'] = true;
                      data.push(item)
                    }
                  })
                  this.treeChildData = data;
                }else{
                  this.$message.error(res.data.error_message);
                }
              }).catch((err)=>{
                console.log(err);
              })
          break;
        default:
          break;
      }
      _this.flag = type;
      _this.$store.dispatch("showDialog", {
        title: title,
        showCancel: true,
        flag:type
      });
      this.img="";
    },
    hideModel() {
      this.$store.dispatch("hideDialog");
      this.UserID = [];
      this.img = "";
    },
    qrcode(qrcodeImg) {
      let qrcode = new QRCode("qrcode", {
        width: 200, // 设置宽度，单位像素
        height: 200, // 设置高度，单位像素
        text: qrcodeImg // 设置二维码内容或跳转地址
      });
    },
    changeImg(file, fileList) {
      this.img = "";
       this.img = URL.createObjectURL(file.raw);
    },
    routeAdd() {
      this.$router.push("mr_add");
    },
    // 表格头部背景颜色
    getHeaderClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
      } else {
        return "";
      }
    },
    //分页
    recordCurrentChange(val) {
      this.page = val;
      this.tableLoading = true;
      this.init();
    },
    recordSizeChange(val) {
      this.customCount='';
      this.limit = val;
      this.recordCurrentChange(1);
    },
    handleChange(value) {
    },
    //点击获取二维码
    getCode(index) {
      this.flag = "qrcode";
      this.$store.dispatch("showDialog", {
        title: "二维码",
        flag:'code'
      });
      this.qr_codeID = [];
      this.qr_codeID.push(this.tableData[index].wx_user_id);
      this.$http(
        "wx_wxuser/get_qr_code?wx_user_id=" + this.qr_codeID,
        "GET",
        {}
      ).then(res => {
        if (res.data.error_code == 0) {
          let data = res.data;
          if (data.error_message == "") {
            this.getQrCode = false;
            this.noHave = true;
            this.fail = false;
          } else {
            this.loading = false;
            let qrcodeImg = data.error_message;
            this.qr_codeID = [];
            this.getQrCode = true;
            this.$nextTick(() => {
              this.qrcode(qrcodeImg);
            });
            this.noHave = false;
            this.fail = false;
          }
        } else {
          this.$message({
            message: "获取二维码失败",
            type: "warning"
          });
          this.fail = true;
        }
      });
    },
    //修改微信id单个
    takeUserID(index) {
      this.childUserId = "";
      this.UserID.push(this.tableData[index].wx_user_id);
      this.childUserId = this.tableData[index].userId;
      this.flag = 'wxh'
      this.$store.dispatch('showDialog',{
        title:'设置微信号',
        showCancel:true,
        flag: 'wxh'
      })
    },
    cancel() {
      this.setUserID = false;
      this.mask = false;
      this.UserID = [];
    },
    useridbatchUp() {
      this.setUserID = false;
      this.mask = false;
      let reg =/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
      if(!reg.test(this.batch.userid)){
        this.$message.warning('微信号长度6~20位英文或数字，下划线和减号(必须以字母开头)')
      } else if(this.batch.userid.length > 20 || this.batch.userid.length < 6) {
        this.$message.warning('微信号长度6~20位英文或数字')
      } else {
      this.$http(
        this.publicUrl.resourceUrl +
          "api/v1/text?key=" +
          this.UserID +
          "&type=tyc_alias",
        "POST",
        this.batch.userid
      )
        .then(res => {
          if (res.data.code == 0) {
          } else {
          }
        })
        .catch(err => {});
      let setID = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "设置微信号") {
          setID = item.task_template_id;
        }
      });
      this.$http("task/create_task", "POST", {
        task_template_name: "设置微信号",
        task_template_id: setID,
        enum_wxaccount_source: 2,
        account_list: this.UserID,
        userId:this.childUserId
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.UserID = [];
            this.hideModel()
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

      }
    },
		// 修改性别
		setsexBatchUp() {
      this.setsexmethod();
      this.hideModel();
    },
    setsexmethod() {
			let param = {};
      param.permission = this.batch.sex
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置用户性别",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST",str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
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
    // 好友验证
    validationbtn() {
      this.setvalidaion();
      this.hideModel();
    },
    setvalidaion(item) {
			let param = {};
      param.permission = this.batch.validations
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置用户验证",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
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

    //修改分组弹出
    AnGroup() {
      // 分组获取分组列表
      this.$http("wx_group/group_list", "POST", {
        limit: 9999999,
        page: 1
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.groupsTwos = res.data.data.result;
          } else {
            this.$message({
              message: "获取列表失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    //点击确认 修改分组
    setGroupBatchUp() {
      let _this = this;
      let groupsTwo = _this.groupsTwo;
      if (!this.groupsTwo) {
        _this.$message.error("请选择分组");
        return;
      }
      this.mask = false;
      this.setgroup = false;
      this.$http("wx_user_group/wx_user_change_group", "POST", {
        wx_user_group_id: this.oldGroupId, //旧分组id
        //  wx_user_id :   this.multipleSelection,           // 用户id
        wx_user_id: this.jsonName,
        new_wx_user_group_id: this.groupsTwo // 新分组id groupsTwo
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "移动分组成功",
              type: "success"
            });
            this.groupsTwo = "";
            this.init();
          } else {
            this.$message({
              message: "移动分组失败:" + res.data.error_message,
              type: "error"
            });
          }
          this.hideModel();
        })
        .catch(err => {
          this.$message({
            message: "移动分组失败:" + res.data.error_message,
            type: "error"
          });
          this.hideModel();
        });
    },
    //修改昵称
    batchUp() {
      let _this = this;
      let nickname = _this.batch.nickname;
      if (nickname == "") {
        _this.$message.error("请输入昵称");
        return;
			}
			this.setbatch()
      _this.hideModel();
    },
    setbatch() {
			let param = {};
      param.permission = this.batch.nickname
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置用户昵称",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.init();
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
    //头像修改
    imagebatchUp() {
      let _this = this;
      let img = _this.img;
      if (img == "") {
        this.$message.error("请上传图片");
        return;
      }
      // this.jsonName.forEach(item => {
        this.setimage('imagebatchUp');
      // });
        this.hideModel();
    },
    successHeadimg(){
       axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_userHeaderImage&key=" +
            this.userId,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            let mainPage = this.publicUrl.newResourceUrl + res.data.data;
            let param = {};
            param.mainPage = mainPage;
            let paramInfo = JSON.stringify(param);
            let data = {
              taskTemplateName: "设置用户头像",
              planParams: paramInfo,
              wxIds: this.UserID.toString() || this.jsonName.toString()
            };
            let str = {
              param: JSON.stringify(data)
            };
            this.$http("plan/start_plan", "POST", str)
              .then(res => {
                if (res.data.error_code == 0) {
                  this.specifyInput = "";
                  this.$message({
                    message: "执行成功",
                    type: "success"
                  });
                  this.UserID = [];
                  this.hideModel();
                  this.img = "";
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
          } else {
            this.$message({
              message: "查询图片失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "查询图片失败",
            type: "error"
          });
        });
    },
    setimage(type) {
      if(type=="imagebatchUp"){
          let uploadFileArr = [];
          let uploadFileArrlength = this.$refs.uploadFriend.uploadFiles.length;
          if(uploadFileArrlength==1){
            uploadFileArr = this.$refs.uploadFriend.uploadFiles;
          }else{
            uploadFileArr.push(this.$refs.uploadFriend.uploadFiles[uploadFileArrlength-1]);
          }
          this.$refs.uploadFriend.uploadFiles = uploadFileArr;
          this.$refs.uploadFriend.submit();
      }else if(type =="imageCover"){
        let imageFileArr = [];
        let imageFileArrlength = this.$refs.friendCover.uploadFiles.length;
        if(imageFileArrlength==1){
          imageFileArr = this.$refs.friendCover.uploadFiles;
        }else{
          imageFileArr.push(this.$refs.friendCover.uploadFiles[imageFileArrlength-1]);
        }
        this.$refs.friendCover.uploadFiles = imageFileArr;
        this.$refs.friendCover.submit();
        this.hideModel();
      }
    },
    //删除
    deleteidbatchUp() {
      this.deleteid = false;
      this.mask = false;
      this.$http("wx_wxuser_batch", "POST", {
        wx_user_id: this.jsonName,
        type: 2
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.deleteid = false;
            this.mask = false;
            this.batchChange = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            if(this.previousPage){
              this.page=this.page-1;
            }
            this.init(); 
          } else {
            this.$message({
              message:  res.data.error_message,
              type: "error"
            });
          }
          this.hideModel();
        })
        .catch(err => {
          this.hideModel();
        });
    },
    //初始化列表
    init() {
      // 根据分组筛选 将组名提取出来
      this.groups.forEach(item => {
        if (item.wx_user_group_id == this.selectGroup) {
          this.taskGroupName = item.wx_user_group_name;
        }
      });
      //title头部数据
      this.$http("wx_wxuse_status", "GET")
        .then(res => {
          if (res.data.error_code == 0) {
            let data = res.data.data;
            // this.tableLoading = false;
            this.onlineAccount = data.online;
            this.newAccount = data.new_wx_user_amount;
            this.unlineAccount = data.offline;
            this.accountTotal = data.wx_user_sum;
          } else {
            this.$message({
              message: "获取列表失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.tableLoading = true;
        });
      let params = {};
      let data = {};
      let flag = 0;
      let group_name = (this.selectGroup === "" || this.selectGroup==null) ? "" : this.taskGroupName;
      params['pageNo'] = this.page;
      params['length'] = this.limit;
      if(group_name != ''){
          params['groupName']=group_name;
      }
      if(this.statu != ''){
          params['isOnline']=this.statu;
      }
      if(this.wxorname != ''){
          params['wxUserName']=this.wxorname;
      }
      if(this.accountStatusInfo != ''){
          params['status']=this.accountStatusInfo;
      }
      if(this.terminalId!=""){
        if(this.terminalId=='0'){
          params['terminalId']="";
        }else{
          params['terminalId']=this.terminalId;
        }
      }
       if(this.selectChildAccountId!=""){
          params['childUserId']=this.selectChildAccountId;
      }
      if(group_name == ''&&this.statu == ''&&this.wxorname == ''&&this.accountStatusInfo == ''&&this.terminalId==''&&this.selectChildAccountId==""){
        params['searchSign'] = 0;
      }else{
        params['searchSign'] = 1;
      }

      this.$http("wx_user_list_search_key", "POST", params)
        .then(res => {
          if (res.data.error_code == 0) {
            this.showLoading = false;
            this.tableLoading = false;
            this.allAccount = res.data.data.total_count;
            this.href =
              this.publicUrl.linkUrl +
              "api/v1/download_excel?token=" +
              this.token +
              "&limit=99999" +
              "&page=1" +
              "&is_online=" +
              this.statu +
              "&group_name=" +
              group_name;
            this.tableData = res.data.data.result;
            this.citysFor();
          } else {
            this.showLoading = true;
            this.$message({
              message: "获取列表失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    //一键上线
    online() {
      this.OnekeyOnline();
      setInterval(() => {
        this.timeOutStopBtn = false;
      }, 30000);
    },
    tableOneKeyModel() {
      // 表格头部上线按钮点击Model
      if (this.jsonName.length == 0) {
        this.$message.error("请选择账号！");
        return;
      }
      this.flag = "tableOneKey";
      this.$store.dispatch("showDialog", {
        title: "上线",
        showCancel: true,
        flag:'tableOneKey'
      });
    },
    tableOnekeyOnline() {
      // 表格头部操作按钮上线
      let param = {
        taskTemplateName: "扫码登录",
        wxIds: this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 400 || res.data.error_code == 500) {
            this.$message.error(res.data.error_message);
          } else {
            this.$message({
              message: "上线成功",
              type: "success"
            });
            this.hideModel();
          }
        })
        .catch(err => {
          this.$message.error("上线失败");
        });
    },
    OnekeyOnline() {
      //一键上线 按钮
      let param = {
        taskTemplateName: "扫码登录"
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "一键上线成功",
              type: "success"
            });
            this.hideModel();
            this.timeOutStopBtn = true;
          } else {
            this.$message.error(res.data.error_message);
          }
        })
        .catch(err => {
          this.$message.error("一键上线失败");
        });
    },
    showOnLine() {
      this.flag = "batch-online";
      this.$store.dispatch("showDialog", {
        title: "一键上线",
        showCancel: true,
        flag:"batch-online"
      });
    },
    // 一键下线
    showDownLine() {
      this.flag = "batch-downline";
      this.$store.dispatch("showDialog", {
        title: "一键下线",
        showCancel: true,
        flag:"batch-downline"
      });
    },
    downline() {
      this.isDownline()
    },
    isDownline(){
      //一键下线 按钮
      let param = {
        taskTemplateName: "批量一键下线"
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "一键下线成功",
              type: "success"
            });
            this.hideModel();
          } else {
            this.$message.error("一键下线失败");
          }
        })
        .catch(err => {
          this.$message.error("一键下线失败");
        });
    },
    beforeUploadFriend(file) {
      var $this = this;
      let flag = false;
      var isIMG;
      if (file.type === "image/jpeg") {
        flag = true;
        isIMG = file.type === "image/jpeg";
      } else if (file.type === "image/png") {
        flag = true;
        isIMG = file.type === "image/png";
      }
      const isLt2M = file.size / 1024 < 500;
      if (!flag) {
        this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
        this.img = "";
        return false;
      }
      if (!isLt2M) {
         this.img = "";
        this.$message.error("上传图片大小不能超过 500KB!");
        return false;
      }
      return isIMG && isLt2M;
    },
    // 图片格式验证
    beforeUploadHead(file) {
      var $this = this;
      let flag = false;
      var isIMG;
      if (file.type === "image/jpeg") {
        flag = true;
        isIMG = file.type === "image/jpeg";
      } else if (file.type === "image/png") {
        flag = true;
        isIMG = file.type === "image/png";
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!flag) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
        this.hideModel();
        this.img = "";
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        this.hideModel();
          this.img = "";
        return false;
      }
      return isIMG && isLt2M;
    },
    //表格勾选
    handleSelectionChange(selection) {
      this.jsonName = [];
      this.oldGroupId = [];
      if(selection.length==this.tableData.length){
        if(this.page>1){
          this.previousPage = true;
        }else{
          this.previousPage = false;
        }
      }else{
        this.previousPage = false;
      }
      this.multipleSelection = selection.map(item => {
        this.jsonName.push(item.wx_user_id);
        this.oldGroupId.push(item.groupId);
      });
      this.downloadLength = selection.length;
    },
    // 调出发圈悬浮框
    takeFriend(index) {
      let t = JSON.stringify(index);
      this.$router.push({
        name: "mr_functionContent",
        query: {
          id: 4,
          info: t
        }
      });
    },
    takeFriendTask() {
      let setTakeFriend = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "发送朋友圈多图") {
          setTakeFriend = item.task_template_id;
        }
      });
      this.$http("task/create_task", "POST", {
        task_template_name: "发送朋友圈多图",
        task_template_id: setTakeFriend,
        enum_wxaccount_source: 2,
        account_list: this.friendID
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.Friend = false;
            this.specifyInput = "";
            this.mask = false;
            this.friendsterData.takeImage = [];
            this.friendsterData.wx_username = [];

            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.friendID = [];
            this.getResources();
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

    //图片上传之后的回调
    suc() {
      axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_sendpostImg&key=" +
            sessionStorage.getItem("user_id")
        )
        .then(res => {
          if (res.data.code == 0) {
            this.Friend = false;
            this.mask = false;
            let data = res.data.data;
            this.friendsterData.takeImage.push(data);

            this.friendsterData.content = this.newFriend;
            this.tableNew.unshift(this.friendsterData);
            this.tableNew = JSON.stringify(this.tableNew);
            axios
              .post(
                this.publicUrl.resourceUrl +
                  "api/v1/text?type=tyc_sendpost&key=" +
                  sessionStorage.getItem("user_id"),
                this.tableNew
              )
              .then(res => {
                if (res.data.code == 0) {
                  this.takeFriendTask();
                  this.$message({
                    message: "上传成功",
                    type: "success"
                  });
                  this.takeFriend();
                } else {
                  this.$message({
                    message: "上传失败",
                    type: "error"
                  });
                }
              })
              .catch(err => {});
          } else {
          }
        });
    },
    //获取
    getResources() {
      axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_sendpost&key=" +
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
    //上线
    takeLogin(index) {
      this.friendID = [this.tableData[index].wx_user_id];
      this.flag = "online";
      this.$store.dispatch("showDialog", {
        title: "上线",
        showCancel: true,
        flag:"online"
      });
    },
    loginBnt() { // 上线
       let param = {
        taskTemplateName: "扫码登录",
        wxIds: this.friendID.toString()
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 400 || res.data.error_code == 500) {
            this.$message.error(res.data.error_message);
          } else {
            this.$message({
              message: "上线成功",
              type: "success"
            });
            this.hideModel();
          }
        })
        .catch(err => {
          this.$message.error("上线失败");
        });
    },
    // 下线
    takeLogout(index) {
      this.friendID = [this.tableData[index].wx_user_id];
      this.flag = "downline";
      this.$store.dispatch("showDialog", {
        title: "下线",
        showCancel: true,
        flag:"downline"
      });
    },
    logoutBnt() {
      let param = {
        taskTemplateName: "一键下线",
        wxIds: this.friendID.toString()
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 400 || res.data.error_code == 500) {
            this.$message.error("下线失败");
          } else {
            this.$message({
              message: "下线成功",
              type: "success"
            });
            this.hideModel();
          }
        })
        .catch(err => {
          this.$message.error("下线失败");
        });
    },
    //修改地区
    citybatchUp() {
      let _this = this;
      let selectedOptions = _this.selectedOptions;
      if (selectedOptions.length == 0) {
        _this.$message.error("请选择地区");
        return;
      }
      _this.setcitybatchUp();
      _this.hideModel();
    },
    setcitybatchUp() {
      this.mask = false;
      this.setcityAccording = false;
      this.citySelect.city = this.selectedOptions[1];
      this.citySelect.province = this.selectedOptions[0];
			let param = {};
      param.permission = this.citySelect
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置地区",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.init();
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
    setcity() {
      this.batchName = "修改地区";
      this.mask = true;
      this.jsonName.length > 0
        ? (this.setcityAccording = true)
        : (this.batchChanges = true);
    },
    // 便利
    citysFor() {
      let citysArray = [];
      let shen = [];
      let shi = [];
      for (let j in this.tableData) {
        citysArray.push({
          province: this.tableData[j].province,
          city: this.tableData[j].city
        });
      }
      this.cityOptions.map((item, index) => {
        for (let k = 0; k < citysArray.length; k++) {
          if (item.value == citysArray[k].province) {
            shen.push({
              value: item.value,
              label: item.label
            });
            item.children.map((item, index) => {
              if (item.value == citysArray[k].city) {
                shi.push({
                  value: item.value,
                  label: item.label
                });
              }
            });
          }
        }
      });
      this.tableData.map((item, index) => {
        item['inspect'] = 0;
        for (let k = 0; k < shen.length; k++) {
          if (item.province == shen[k].value) {
            item["pingCity"] = shen[k].label;
            if (item.city == shi[k].value) {
              item["pingCity"] += "/" + shi[k].label;
              break;
            }
          }
        }
      });
    }
  },
  //过滤器
  filters: {
    capitalize: function(value) {
      if (value === 1) {
        return "男";
      } else if (value === 2) {
        return "女";
      } else {
        return "未知";
      }
    },
    statulize: function(value) {
      if (value === 1) {
        return "在线";
      } else if (value === 0) {
        return "离线";
      } else {
        return "未知";
      }
    },
    accountStatus: function(value) {
      if (value === 0) {
        return "正常";
      } else if (value === 1) {
        return "封号";
      } else if (value === 2) {
        return "密码错误";
      } else if (value === 3) {
        return "环境异常";
      } else if (value === 4) {
        return "Token过期";
      } else if (value === 5) {
        return "主机需要授权";
      } else if (value === 101) {
        return "其它错误";
      }
    },
    loginStatus: function(value) {
      if (value === 1) {
        return "账号密码";
      } else if (value === 0) {
        return "扫码";
      }
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../style/css/base.scss";
#managent {
  .el-table__row{
    .el-button{
      margin-left: 4px;
    }
  }
  
  .qrcode-box {
    width: 222px;
    height: 222px;
    padding: 10px;
    border: 1px solid #e8e8e8;
    margin: 0 auto;
  }
  .dialog-content {
    p {
      line-height: 24px;
      color: #888;
      font-size: 16px;
    }
  }
  .manage {
    .manage-header {
      line-height: 1;
      background-size: 16px;
      color: #888;
      font-size: 14px;
    }
    .headerButton {
      text-align: center;
      margin-bottom: 20px;
      .el-button {
        width: 90px;
        margin: 0 22px;
      }
    }
    .search {
      .search-content {
        overflow: hidden;
        margin-bottom: $margin;
        span {
          color: #a94442;
          display: block;
          margin-bottom: 10px;
        }
        .left {
          float: left;
          .ele-select {
            margin-right: 17px;
          }
        }
        .right {
          display: flex;
          align-items: center;
          float: right;
          a {
            background: #409eff;
            color: #fff;
            width: 100px;
            height: 30px;
            line-height: 30px;
            padding: 0;
            border-radius: 3px;
            display: block;
            font-size: 12px;
            text-align: center;
            margin-right: 20px;
            transition: all 0.3s ease;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
    .table {
      border-bottom: 0;
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        object-fit: cover;
      }
      .batch {
        line-height: 1;
        padding: 0px 0px 30px;
        color: #409eff;
        .el-button {
          padding: 0;
          margin-left: 0;
        }
      }
    }
    .page {
      padding: 15px 0 50px;
      text-align: center;
      .el-pagination {
        display: inline-block;
      }
    }
    #addServer2 {
      position: fixed;
      left: 35%;
      top: 30%;
      width: 500px;
      border-radius: 6px;
      background-color: #fff;
      z-index: 11;
      box-sizing: border-box;
    }
    .addServer {
      position: fixed;
      left: 36%;
      top: 30%;
      width: 600px;
      border-radius: 6px;
      background-color: #fff;
      z-index: 11;
      box-sizing: border-box;
      .header {
        padding: 10px 15px;
        overflow: hidden;
        font-size: 14px;
        background-color: #409eff;
        border-radius: 6px 6px 0 0;
        h5 {
          text-align: center;
          float: left;
          width: 100%;
          font-size: 20px;
          line-height: 36px;
          color: #fff;
        }
        span {
          float: right;
          color: #fff;
          cursor: pointer;
          line-height: 20px;
        }
      }
      .content {
        padding: 50px 0 40px;
        text-align: center;
        background: #fff;
        .qrCodeBox {
          width: 222px;
          height: 222px;
          padding: 10px;
          border: 1px solid #e8e8e8;
          display: inline-block;
          line-height: 222px;
          img {
            position: static !important;
            width: 200px;
            height: 200px;
          }
        }
        .specialSelect {
          margin: 10px 0 0 25px;
          width: 260px;
        }
        .contentItem {
          line-height: 1;
          font-size: 16px;
          color: #333;
          overflow: hidden;
          text-align: center;
          img {
            position: static;
            width: 180px;
            height: 180px;
          }
          .left {
            float: left;

            p:nth-child(2) {
              margin-top: 170px;
            }
          }
          .right {
            float: right;
            width: 80%;
            text-align: left;
          }
        }
      }
      .footer {
        padding: 15px;
        text-align: center;
        padding-bottom: 34px;
        background: #fff;
        .el-button {
          width: 90px;
          height: 30px;
          line-height: 0;
        }
      }
    }
  }
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
     border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 180px;
    height: 180px;
    display: block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    object-fit: cover;
  }
  .el-table__body-wrapper{
    .online{
    background: url('../../assets/icon_online.png') no-repeat center left;
    padding-left: 12px;
  }
  .offline{
    background: url('../../assets/icon_offline.png') no-repeat center left;
    padding-left: 12px;
  }
  .abnormal{
     background: url('../../assets/icon_abnormal.png') no-repeat center left;
    padding-left: 12px;
  }
  .normal{
    background: url('../../assets/icon_normal.png') no-repeat center left;
    padding-left: 12px;
  }
  }
  
  .dialog-detail{
     textarea{
      display: block;
      width: 100%;
      height: 200px;
      line-height: 20px;
      color:#333;
      border:solid 1px #eee;
      padding:10px;
      box-sizing: border-box;
      font-size: 14px;
    }
    .total{
      position: absolute;
      right: 5px;
      bottom: 45px;
      font-size: 14px;
    }
  }
 
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
        height: 320px;
        font-size: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
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

</style>
