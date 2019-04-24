<template>
	<div class="mainer">
		<div class="add-btn" @click="modelShow">
			<span class="add">+</span>
			<span>选择发布账号</span>
			<span>(已选账号: <b class="green">{{accountNum}}</b>个)</span>
		</div>
		<div class="object-wrap">
			<span>指定对象</span>
			<template>
			    <el-radio v-model="objRadio" :label="1">全选</el-radio>
			    <div class="inline-block" @change="objectShow"><el-radio v-model="objRadio" :label="2" >部分可见</el-radio></div>
			    <div class="inline-block" @change="objectShow"><el-radio v-model="objRadio" :label="3">部分不可见</el-radio></div>
			</template>
			<p class="prompt" v-show="objRadio===2||objRadio===3">若选择的账号无该标签好友,则默认全部好友可见</p>
			<div v-show="objRadio===2||objRadio===3">
                <span class="choose-label">选择标签</span>
				  <el-select
				    v-model="value10"
				    multiple
				    filterable
				    allow-create
				    default-first-option
				    placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				<span class="calc-all">已选0个标签,共0个好友</span>
            </div>
		</div>
		<div class="content-title">发布内容</div>
		<div class="form-box">
            <div class="dis-tb">
                <div class="col tit w1">文字</div>
                <div id="text-area" class="col"></div>
            </div>
            <div class="dis-tb">
                <div class="col tit w1">类型</div>
                <template>
				    <div class="inline-block" @change="textHandle('添加图片')"><el-radio class="marginTop" v-model="styleRadio" :label="1">图片</el-radio></div>
				    <div class="inline-block" @change="textHandle('添加链接')"><el-radio class="marginTop" v-model="styleRadio" :label="2">链接</el-radio></div>
				</template>
				
				<div class="upload-wrap" v-show="styleRadio===1">
					<el-upload
					  action="https://jsonplaceholder.typicode.com/posts/"
					  list-type="picture-card"
					  :on-success="uploadSuccess"
					  :on-preview="handlePictureCardPreview"
					  :on-remove="handleRemove">
					  <i class="el-icon-plus"></i>
					  <span class="up-load-text" v-show="imgShow">{{upLoadText}}</span>
					</el-upload>
				</div>
				<div class="uploadBtn-wrap" v-show="styleRadio===2">
					<el-button type="success" @click="handleLink">添加链接</el-button>
				</div>
							
            </div>
            <div class="dis-tb">
                <div class="col tit">评论提醒设置</div>
            </div>
            <div class="dis-tb">
                <template>
				    <el-radio class="marginTop" v-model="commentRadio" :label="1">展示评论</el-radio>
				    <el-radio class="marginTop" v-model="commentRadio" :label="2">隐藏评论</el-radio>
				</template>
            </div>
            <div class="dis-tb">
            	<el-button @click="clickHandle" type="success">立即发布</el-button>
  				<el-button @click="dateShow = !dateShow">定时发布</el-button>
            </div>
            
            <!--  定时发布弹框  -->
            <div class="block" v-show="dateShow">
            	<div class="date-wrap">
            		<div class="date-header">
            			<span class="demonstration">定时发布<span class="close-btn" @click="dateShow = false">x</span></span>
            		</div>
            	    <div class="date-hint">可选择<span class="blue">5分钟后</span>的任意时刻定时群发，成功设置后不支持修改,但在设定的时间前可取消。</div>
				    <el-date-picker
				      v-model="dateValue"
				      type="datetime"
				      placeholder="选择日期时间">
				    </el-date-picker>
				    <div class="bottom-wrap">
				    	<button class="confirm-btn" @click="confirmHandle">确定</button>
				    </div>
            	</div>
			    
			</div>
       </div>
       
       <!-- 选择发布账号   弹框  -->
       <div class="modal" v-show="remindShow" :key="4">
			<div class="mask"></div>
			<div class="balance-wrap">
				<div class="modal-header">
					<h2>添加账号<span @click="remindShow= !remindShow">x</span></h2>
				</div>
				<div class="reminder">为避免因数据过多引起异常，最多可选择500个账号，账号数量较大时，请先将账号进行分组，且每组账号数不要超过500。</div>
				 <div class="input">
					<el-input style="width: 350px;" placeholder="请输入账号名称/微信号"></el-input>
					<el-button class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
				</div>
				<div class="modal-body">
					<el-table ref="multipleTable" :data="tableData" height="250" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection">
						</el-table-column>
						<el-table-column prop="date" label="帐户名">
						</el-table-column>
						<el-table-column prop="name" label="状态">
						</el-table-column>
						<el-table-column prop="address" label="到期提醒">
						</el-table-column>
					</el-table>
				</div>
				<div class="choosed-account">当前已选账号: 0个</div>
				<div class="modal-footer" v-show="!hasSelect">
					<el-button plain type="primary" @click="remindShow= !remindShow">确认</el-button>
					<el-button plain @click="remindShow= !remindShow">取消</el-button>
				</div>

			</div>
		</div>
		<!--添加链接-->
		<div class="modal" v-show="linkShow" :key="1">
			<div class="mask"></div>
			<div class="link-wrap">
				<div class="modal-header">
					<h2>选择链接<span @click="linkShow= !linkShow">x</span></h2>
				</div>
				<div class="modal-body">
					<el-tabs type="border-card">
					  <el-tab-pane>
					    <span slot="label">链接管理列表</span>
					    <template>		  
						  <el-table
						  	:data="tableData3"
						    height="350"
						    border
						    style="width: 100%">
						    <el-table-column label="操作">
								<template slot-scope="scope">
									<div class="linkList-wrapper">
										<img class="linkImg" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=241170661,3235713291&fm=27&gp=0.jpg">{{scope.row.date}}
										 <div class="radio">
										 	<el-radio v-model="radio" :label="scope.row.label" @change=radioType>备</el-radio>
										 </div>
									</div>
								</template>
							</el-table-column>
						  </el-table>
						</template>
				         <div class="modal-footer" v-show="!hasSelect">
							<el-button plain type="primary" @click="linkShow= !linkShow">确认</el-button>
							<el-button plain @click="linkShow= !linkShow">取消</el-button>
						</div>     
					  </el-tab-pane>
					  <el-tab-pane label="自定义设置链接">
					  	
					  	
					  	<el-form ref="form" class="preview-wrapper" :model="form" label-width="80px">
						  <el-form-item label="添加标题">
						    <el-input v-model="form.name"></el-input>
						  </el-form-item>
						  <el-form-item label="添加图片">
						   	<el-upload
							  class="avatar-uploader"
							  action="https://jsonplaceholder.typicode.com/posts/"
							  :show-file-list="false"
							  :on-success="handleAvatarSuccess">
							  <img v-if="imageUrl" :src="imageUrl" class="avatar">
							  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						  </el-form-item>
						  <el-form-item label="链接地址">
						    <el-input v-model="form.src"></el-input>
						  </el-form-item>
						  <el-form-item label="链接预览">
						  	<div class="preview">
						  		<p>{{form.name}}</p>
						  		<img :src="previewImg" alt="" class="previewImg"/>
						  	</div>
							
						  </el-form-item>
						</el-form>
					  	
					  	<div class="modal-footer" v-show="!hasSelect">
							<el-button plain type="primary" @click="linkShow= !linkShow">确认</el-button>
							<el-button plain @click="linkShow= !linkShow">取消</el-button>
						</div>   
					  	
					  </el-tab-pane>
					</el-tabs>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
//import wangeditor from 'wangeditor'
import wangJson from '@/assets/face.json'


export default {
	data() {
		return{
			options: [{
	          value: 'HTML',
	          label: 'HTML'
	        }, {
	          value: 'CSS',
	          label: 'CSS'
	        }, {
	          value: 'JavaScript',
	          label: 'JavaScript'
	        }],
	        tableData: [{
               date: '2016-05-03',
               name: '王小虎',
               address: '上海市'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市'
            }],
			tableData3: [{
               date: '由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。',
			   label: 1
            }, {
                date: '由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。',
			   label: 2
            }, {
                date: '由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。',
			   label: 3
            }, {
                date: '由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。',
			   label: 4
            }, {
                date: '由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。',
			   label: 5
            }, {
                date: '由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。',
			   label: 6
            }, {
                date: '由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。',
			   label: 7
            }],
        	value10: [],
        	remindShow: false, // 控制弹框
        	hasSelect: false,
        	port: 3,
			objRadio: 1,
			styleRadio: 1,
			commentRadio: 1,
			wang: {},
			wangJson: wangJson,
			accountNum: 2,// 已选账号数量
			upLoadText: '添加图片',
			imgShow: true,
			dateValue: '',
			linkShow: false,
			radio:'',
			form: {
	          name: '',
	          region: '',
	          src: '',
	          delivery: false,
	          type: [],
	          resource: '',
	          desc: ''
	     	},
	     	imageUrl: '',
	     	previewImg:'',
			dateShow: false
			}  //  定时发布弹框
	},
	mounted() {
		this.wang=new wangeditor(document.getElementById("text-area"));
	    this.wang.customConfig.menus = [
	        "emoticon"
	    ];
	     this.wang.customConfig.emotions = [
	        {
	            // tab 的标题
	            title: '默认',
	            // type -> 'emoji' / 'image'
	            type: 'image',
	            // content -> 数组
	            content: this.wangJson,
	            size: '6'
	        }
	    ];
	    this.wang.customConfig.zIndex = 8;
	    this.wang.create();
	},

	methods: {
		//滚动事件
		scrollfunc() {
			if(document.body.scrollTop) {
				this.scroll = document.body.scrollTop;
			} else {
				this.scroll = document.documentElement.scrollTop
			}
			this.myScroll = document.body.clientHeight;
			this.screenScroll = window.screen.height
			this.screenHeight = document.body.scrollHeight;
			//      	console.log(this.scroll+'滚动')
			//			console.log(this.myScroll+'文')
			//			console.log(this.screenHeight)
			//       	console.log(this.screenScroll+'可')
			//			console.log(this.scroll+this.screenScroll)
			var _this = this
			if(this.scroll + this.screenScroll > this.myScroll + 90) {
				if(this.request) {
					this.request = false
					this.$totalHttp.get('/api/home', {
						params: {
							userId: localStorage.getItem("user_id")
						}
					}).then((res) => {
						if(res.status === 200) {
							this.tableData6.push(...res.data.message.data)
							this.request=true
							let tableData6Length = this.tableData6.length;
							if(tableData6Length<100){
								if(document.body.scrollTop) {
									document.body.scrollTop -= 30
								} else {
									document.documentElement.scrollTop -= 30
								}
							} else if(tableData6Length<200){
								if(document.body.scrollTop) {
									document.body.scrollTop -= 150
								} else {
									document.documentElement.scrollTop -= 150
								}
							} else {
								if(document.body.scrollTop) {
									document.body.scrollTop -= 300
								} else {
									document.documentElement.scrollTop -= 300
								}
							}
							// console.log(this.tableData6)
						} else {
							alert('获取失败')
						}
					})
				}
			}
		},
		handleAvatarSuccess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
			// console.log(this.imageUrl)
			this.previewImg = this.imageUrl
		},
		radioType() {
			//console.log(this.radio)
		},
		handleLink() {
			this.linkShow = true;
		},
		uploadSuccess() {
			this.imgShow = false
		},
		clickHandle() {
			var $this = this;
			var con = $this.wang.txt.html()
			$this.$totalHttp.post('/api/user/snspost', {
					'contents': con
				})
				.then(function(res) {
					//console.log(res);
				})
			var json = this.wang.txt.getJSON()
			//			console.log(json)
			var _html = json[0].children;
			var attrData = [];
			//	       	console.log(_html)
			for(var i = 0; i < _html.length - 1; i++) {
				if(_html[i].tag === 'img') {
					var emjes_val = _html[i].attrs[0].value
					emjes_val = emjes_val.replace('/src/assets/qqface/', '[').replace('.png', ']');
					//	       			console.log(emjes_val);
					attrData.push(emjes_val)

				} else {
					attrData.push(_html[i])
				}
			}
			//	       	console.log(attrData.join(','))

			//			console.log(this.wang.txt.html())
		},
		//  删除上传的图片
		handleRemove(file, fileList) {
			//console.log(file, fileList);
		},
		//  上传的图片
		handlePictureCardPreview(file) {
			//this.dialogImageUrl = file.url;
			//this.dialogVisible = true;
			alert(file)
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			// console.log(this.multipleSelection)
		},
		modelShow() {
			this.remindShow = !this.remindShow;
		},
		objectShow() {
			var $this = this;
			if($this.accountNum <= 0) {
				$this.$alert('请选择账号！', '提示', {
					confirmButtonText: '关闭',
					callback: action => {}
				});
				$this.objRadio = 1;
			} else {
				return;
			}
		},
	
		textHandle(text) {
			this.upLoadText = text;
		},
		confirmHandle() {
			if(this.dateValue == '') {
				this.$message.warning('请选择定时发布时间~~~')
				return
			}
			else {
				this.dateShow = !this.dateShow
			}
			// console.log(this.dateValue)
			let year = this.dateValue.getFullYear()
			let month = this.dateValue.getMonth() + 1
			// console.log(month)
		}
	 }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/*.link-wrap >>> .el-tabs__item{
    	width: 238px !important;
    }*/
.p-content>.panel-heading {
    position: relative;
    padding: 0 15px 0 35px;
    height: 47px;
    line-height: 47px;
    height: 48px;
    border-bottom-color: #ccc;
    font-size: 18px;
    z-index: 5;
    background: #fff;
}
.panel-heading {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
} 
.input-group {
    width: 230px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 30px;
    font-size: 14px;
    padding: 5px 15px;
    color: #555555;
    margin: 20px;
    background-size: 15px 15px;
}
.search-btn {
    width: 30px;
    height: 30px;
    border-right: 1px solid #ccc;
    float: right;
    margin: -6px 15px 0 0;
}
.panel-record {
    width: 97%;
    height: 50px;
    background: #e1ebf4;
    margin: 10px auto;
    border-radius: 3px;
}
.left {
    padding: 0 30px;
    line-height: 50px;
}
.block {
    text-align: center;
    margin: 40px 0;
}
.mainer {
    margin: 20px;
    .add-btn {
        overflow: hidden !important;
        border-radius: 4px;
        margin: 10px 10px;
        font-size: 14px;
        cursor: pointer;
        .add {
            display: inline-block;
            width: 16px;
            height: 16px;
            font-size: 22px;
            color: #FFFFFF;
            background: #1abb9c;
            border-radius: 50%;
            text-align: center;
            line-height: 14px;
            vertical-align: middle;
        }
        .green {
            font-weight: 400;
            font-size: 16px;
            padding: 0 2px;
            color: #58bc9c !important;
        }
    }
    .object-wrap {
        margin: 50px 10px 40px 10px;
        .el-radio__label {
            padding-left: 5px !important;
        }
        .el-radio {
            margin: 0 20px 0 10px;
        }
        .prompt {
            padding: 20px 75px;
            color: #c30d23 !important;
            font-size: 14px;
        }
        .choose-label {
            float: left;
            padding-right: 15px;
            line-height: 35px;
        }
        .calc-all {
            padding: 0 0 0 10px;
            color: #c30d23 !important;
        }
    }
    .content-title {
        width: 100%;
        line-height: 50px;
        padding: 0 15px;
        background: #e1ebf4;
        margin: 0 auto;
        font-size: 18px;
        color: #2a3f54;
    }
    .form-box {
        padding: 30px 25px;
        .dis-tb {
            display: table;
            margin: 10px 0 0 0;
            .w1 {
                width: 80px;
            }
            .col {
                padding: 10px 0;
                vertical-align: top;
                display: table-cell;
            }
            
            #text-area {
                width: 780px;
                height: 340px;
            }
            .marginTop {
                margin: 10px 5px;
                padding: 5px;
            }
        }
    }
}
.record-wrap {
    padding: 2px 11px;
    overflow: hidden;
    color: #73879c;
    .record-list {
        width: 100%;
        border-bottom: 1px solid #e1ebf4;
        overflow: hidden;
        padding: 12px 0;
            vertical-align: inherit;
        .list-number {
            // display: inline-block;
            width: 5%;
            text-align: center;
            float: left;
            line-height: 72px;
        }
        .imgs {
            // display: inline-block;
            width: 56px;
            height: 56px;
            float: left;
            margin: 0 80px 0 30px;
        }
        .list-content {
            width: 300px;
            float: left;
            font-size: 14px;  
            padding: 0 70px 0 0;  
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
            line-height: 70px;
            margin: 0 40px 0 30px;
        }
        .list-time {
            float: left;
            width: 214px;
            overflow: hidden;
            margin-top: 10px;
           .list-left {
               display: block;
               float: left;
           }
           
        }
        .padding-cell {
            padding-left: 4px;
        }
        .list-block {
            float: left;
            margin: 0 70px;
        }
        .icon-block {
            display: block;
            margin-top: 8px;
        }
        .show-comment {
            width: 200px;
            float: left;
            margin: 20px 0 0 90px;
            cursor: pointer !important;
        }
        .operate-option {
            font-size: 14px;
            margin: 23px 0 0 0;
            li {
                margin: 0 25px;
                cursor: pointer;
                float: left;
            }
            .green {
                color: #58bc9c !important;
            }
        }
    }
    
}

.mask {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
}
.balance-wrap {
    position: absolute;
    top: 20%;
    left: 40%;
    z-index: 15;
    width: 500px;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
    border-radius: 5px;
    .modal-header {
        position: relative;
        padding: 10px 15px;
        background: #e1ebf4;
        color: #2a3f54;
        text-align: center;
        border-radius: 6px 6px 0 0;
        border-bottom: 1px solid #e5e5e5;
        h2 {
            font-size: 18px;
            position: relative;
            line-height: 25px;
            span {
                position: absolute;
                right: 10px;
                cursor: pointer;
            }
        }
    }
    .reminder {
        background: #d9edf7;
        border: 1px solid #bce8f1;
        width: 93%;
        margin: 10px auto;
        padding: 16px 20px;
        font-size: 14px;
        color: #31708f;
        border-radius: 5px;
        line-height: 23px;
    }
    .remainingPort {
        padding: 15px;
    }
    .input {
        padding: 15px 20px 0;
        position: relative;
        .filter-item {
            position: absolute;
            right: 15px;
        }
    }
    .modal-body {
        padding: 15px 15px;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #73879c;
        border-bottom: 1px solid #e5e5e5;
    }
    .choosed-account {
        text-align: center;
        color: #58bc9c;
        font-size: 14px;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }
    .modal-footer {
        padding: 15px 0;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #73879c;
        border-bottom: 1px solid #e5e5e5;
    }
}
.link-wrap {
    position: absolute;
    top: 20%;
    left: 40%;
    z-index: 15;
    width: 500px;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
    border-radius: 5px;
    .modal-header {
        position: relative;
        padding: 10px 15px;
        background: #e1ebf4;
        color: #2a3f54;
        text-align: center;
        border-radius: 6px 6px 0 0;
        border-bottom: 1px solid #e5e5e5;
        h2 {
            font-size: 18px;
            position: relative;
            line-height: 25px;
            span {
                position: absolute;
                right: 10px;
                cursor: pointer;
            }
        }
    }
    .reminder {
        background: #d9edf7;
        border: 1px solid #bce8f1;
        width: 93%;
        margin: 10px auto;
        padding: 16px 20px;
        font-size: 14px;
        color: #31708f;
        border-radius: 5px;
        line-height: 23px;
    }
    .remainingPort {
        padding: 15px;
    }
    .input {
        padding: 15px 20px 0;
        position: relative;
        .filter-item {
            position: absolute;
            right: 15px;
        }
    }
    .modal-body {
        padding: 15px 15px;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #73879c;
        border-bottom: 1px solid #e5e5e5;
        .linkList-wrapper {
        	position:relative;
        	height:50px;
        	padding-right:130px;
        	.linkImg{
        		position: absolute;
	        	width: 50px;
	        	height: 50px;
	        	right: 80px;
        	}
        	.radio{
        		position: absolute;
        		right: 20px;
        		top: 20px;
        	}
        }
        .preview-wrapper{
        	.avatar-uploader{
	        	height: 60px;
	        	line-height: 60px;
	        	img{
	        		width: 58px;
	        		height: 58px;
	        	}
	        }
	        .preview{
	        	position: relative;
	        	padding-right: 65px;
	        	line-height: 20px;
	        	p{
	        		line-height: 25px;
	        		height: 50px;
	        	}
	        	.previewImg{
	        		position: absolute;
	        		right: 5px;
	        		top: 0px;
	        		width: 48px;
	        		height: 48px;
	        	}
	        	
	        }
        } 
    }
    .choosed-account {
        text-align: center;
        color: #58bc9c;
        font-size: 14px;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }
    .modal-footer {
        padding: 15px 0;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #73879c;
        border-bottom: 1px solid #e5e5e5;
    }
}


.w-e-item img {
	width: 25px !important;
	height: 25px !important;
}
.w-e-text img {
	width: 20px !important;
	height: 20px !important;
	margin: 0 2px !important;
}
.is-plain {
	width: 110px !important;
}
.upload-wrap {
	position: relative;
}
.uploadBtn-wrap{
	position: relative;
	width: 148px;
	height: 148px;
	line-height: 148px;
	text-align: center;
}
.up-load-text {
	display: inline-block;
	position: absolute;
	top: 26px;
	left: 44px;
}
.inline-block {
	display: inline-block;
}
.block {
	position: absolute;
	color: #73879c;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, .5);
	z-index: 1000;
}
.date-hint {
	width: 270px;
	padding: 10px 25px;
	font-size: 14px;
	line-height: 20px;
	text-align: left;
}
.date-hint .blue {
	color: #58bc9c;
}
.date-wrap {
	background: #FFFFFF;
	position: absolute;
	top: 40%;
	left: 50%;
	border-radius: 4px;
	padding-bottom: 15px;
}
.date-header {
	background: #e1ebf4;
	line-height: 50px;
	text-align: center;
}
.close-btn {
	float: right;
	font-size: 16px;
	padding: 0 10px;
	cursor: pointer;
}
.bottom-wrap {
	border-top: 1px solid #EEEEEE;
	margin: 20px 0 0 0;
}
.confirm-btn {
	cursor: pointer;
	padding: 10px 35px;
	margin: 15px 0 0 0;
	background: #58bc9c;
	color: #FFFFFF;
	border-radius: 4px;
	font-size: 14px;
}
</style>