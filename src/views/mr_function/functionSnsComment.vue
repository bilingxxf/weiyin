<template>
	<div id="snscomment">
		<div class="snsTop">
			<el-input
            placeholder="请输入内容"
            suffix-icon="el-input__icon el-icon-search"
            v-model="search">
            </el-input>
            <el-select v-model="account" placeholder="请选择">
			  <el-option
			    v-for="item in accounts"
			    :key="item.value"
			    :label="item.label"
			    :value="item.value">
			  </el-option>
			</el-select>
		</div>
		<div class="snsMiddle">
			<el-table
		      :data="tableData"
		      :header-row-style="headerStyle"
		      style="width: 100%">
		      <el-table-column
		        label="评论">
		        <template slot-scope="scope">
		            <div class="comments">
		            	<img :src="scope.row.head_portrait" class="left" />
			        	<p class="right">
			        		<span>{{scope.row.nick_name}}</span>
			        		<span>{{scope.row.nick_name}}</span>
			        	</p>
		            </div>
		        </template>
		      </el-table-column>
		      <el-table-column
		        label="朋友圈内容">
			      <template slot-scope="scope">
			        <el-popover trigger="hover" placement="bottom-end" :offset="80">
			          {{scope.row.sns_content}}
			          <div slot="reference" class="name-wrapper">
			            <div class="content">
			            	<div class="left">
			            		<img v-for="item in scope.row.head_portraits" :src="item" :key="item"/>
			            	</div>
				        	<p class="right">
				        	{{scope.row.sns_content}}
				        	</p>
			            </div>
			          </div>
			        </el-popover>
			       </template>
		      </el-table-column>
		      <el-table-column
		        prop="comment_time"
		        label="评论时间"
		        width="200">
		      </el-table-column>
		      <el-table-column
		        prop="release_account"
		        label="发布账号"
		        width="200">
		      </el-table-column>
		      <el-table-column
		        label="操作"
		        width="200">
		        <template slot-scope="scope">
		        	<el-button type="text" @click="$router.push('/function/snsTDetail')">详情</el-button>
		        	<el-button type="text" @click="mask=true,sendComment=true">回复</el-button>
		        </template>
		      </el-table-column>
		    </el-table>
		</div>
		<div class="snsBottom">
			<el-pagination
		      :current-page="1"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="10"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="10">
		    </el-pagination>
		</div>
		<!-- 回复 -->
		<div class="addServer" v-show="sendComment" v-popup="sendComment">
	     <div class="header">
	       <h5>回复评论</h5>
	       <span @click="mask=false,sendComment=false">×</span>
	     </div>
	     <div class="content">
	       <div class="contentItem">
	         <div id="wang"></div>
	       </div>
	     </div>
	     <div class="footer">
	       <el-button type="success">确定</el-button>
	       <el-button @click="mask=false,sendComment=false">取消</el-button>
	     </div>
	   </div>
	   <div class="mask" v-if="mask"></div>
	</div>
</template>

<script>
import wangEditor from "wangEditor";
export default {
    data() {
	 	return {
	 		wangEditor:null,
	 		search:"",
	 		account:"",
	 		accounts:[{
	 			value: '芳妹',
	 			label: '芳妹'
	 		}, {
	 			value: 'lsh',
	 			label: 'lsh'
	 		}],
	 		tableData:[{
	 			head_portrait: 'http://wx.qlogo.cn/mmhead/ver_1/AuJe4AJEUTdxoRrvyKZ5PYibInbS23Ug8eicQHaSnKVeYzoT9TsmAI9diatCWia82c6MUQMviaOiaLOWkgg49fXwZ8GbX9r2kCg00cwReYD1WtFas/0',
	 			nick_name: '林磊是小狗',
	 			sns_content: '不管在哪里',  // 朋友圈内容
	 			head_portraits: ['http://picture.ewemai.com/YunKong/2018030908/2017101210100072018030908432274249.jpg', 'http://picture.ewemai.com/YunKong/2018030908/2017101210100072018030908432285187.jpg','http://picture.ewemai.com/YunKong/2018030908/2017101210100072018030908432291441.jpg','http://picture.ewemai.com/YunKong/2018030908/2017101210100072018030908432293000.jpg'],
	 			comment_time: '2018/2/6',
	 			release_account: '小磊子'
	 		}],
	 		mask:false,
	 		sendComment:false,
	 		headerStyle: {'background': '#e1ebf4'}
	    }
    },
    methods:{
    	//创建富文本编辑器
	    createEditor(){
	      this.wangEditor = new wangEditor(document.getElementById("wang"));
	      this.wangEditor.customConfig.menus = [
	        'emoticon'
	      ]
	      this.wangEditor.customConfig.zIndex = 12;
	      this.wangEditor.customConfig.uploadImgShowBase64 = true;
	      this.wangEditor.customConfig.showLinkImg = false;
	      this.wangEditor.create();
	    },
    },
    mounted() {
    	this.createEditor();
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#snscomment{
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 20px;
	.addServer{
    position: absolute;
    left: 30%;
    top:30%;
    width: 500px;
    border-radius:6px;
    background-color: #fff;
    z-index: 11;
    box-sizing: border-box;
    .header{
      padding: 10px 15px;
      overflow: hidden;
      font-size: 14px;
      background-color: #e1ebf4;
      border-radius:6px 6px 0 0;
      h5{
        text-align: center;
        float: left;
        width: 95%;
        line-height: 20px;
      }
      span{
      	cursor: pointer;
      }
    }
    .content{
      padding: 15px;
      .contentItem{
        padding: 5px 0;
        #wang{
        	width: 100%;
        	height: 100px;
        }
      }
    }
    .footer{
      padding: 15px;
      border-top:1px solid #e5e5e5;
      text-align: center;
    }
  }
	.snsTop{
		.el-input{
			width: 280px !important;
		}
	}
	.snsMiddle{
		border: 1px solid #eee;
		margin-top: 20px;
		.comments{
			width: 100%;
			height: 100%;
			overflow: hidden;
			.left{
				display: block;
				float: left;
				height: 100%;
				width: 50px;
				border-radius: 4px;
				margin: 0 8px 0 4px;
			}
			.right{
				float: left;
				span{
					display: block;
				}
			}
		}
		.content{
			width: 100%;
			height: 100%;
			overflow: hidden;
			.left{
				width: 100px;
				float: left;
				img{
					width: 40px;
					height:40px;
					border-radius: 4px;
					margin: 0 2px;
				}
			}
			.right{
				float: left;
				line-height: 82px;
			}
		}
	}
	.snsBottom{
		height: 40px;
		margin-top: 30px;
		text-align: center;
	}
}
</style>