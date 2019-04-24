<template>
<div class="panel p-content moment-records">
    <div class="panel-heading"><a href="javascript:;" class="index">发朋友圈</a></div>
    <div class="input-group">
    	<input type="text" class="input-web"  placeholder="请输入朋友圈内容" />
    	<div class="search-btn"></div>
    </div>
    <div class="panel-record">
    	<span class="left">朋友圈记录</span>
    	<span class="add-btn"><router-link to='snsTimeLine'>新建朋友圈</router-link></span>
    </div>
    <ul class="record-wrap">
		<li class="record-list">
			<span class="list-number">1</span>
			<span class="list-content">哈哈哈今天好你好好并不是世界上几乎是大家都还记得回家的回家的回家的回家山东黄金热啊...</span>
			<div class="list-time">
				<span class="list-left">2018/6/4  10:37:17</span>
				<span class="list-left">2个账号发布</span>
			</div>
			<div class="list-block">
				<i class="icon iconfont icon-icon4 icon-block"><span class="padding-cell">0</span></i>
				<i class="icon iconfont icon-duanxin"><span class="padding-cell">0</span></i>
			</div>
			<el-row class="block-col-2 show-comment">
			    <el-col :span="12">
				    <el-dropdown trigger="click">
				      <span class="el-dropdown-link">
				        展示评论<i class="el-icon-arrow-down el-icon--right"></i>
				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item ><div @click="chooseComment">展示评论</div></el-dropdown-item>
				        <el-dropdown-item ><div @click="chooseComment">隐藏评论</div></el-dropdown-item>
				      </el-dropdown-menu>
				    </el-dropdown>
			    </el-col>
			</el-row>
			<ol class="operate-option">
				<li class="green">重发</li>
				<router-link tag="li" to="mr_functionSnsTDetail">查看</router-link>
				<li @click="deleteHandle">删除</li>
			</ol>
		</li>
		<li class="record-list">
			<span class="list-number">2</span>
			<span class="list-content">哈哈哈今天好你好好并不是世界上几乎是大家都还记得回家的回家的回家的回家山东黄金热啊...</span>
			<div class="list-time">
				<span class="list-left">2018/6/4  10:37:17</span>
				<span class="list-left">2个账号发布</span>
			</div>
			<div class="list-block">
				<i class="icon iconfont icon-icon4 icon-block"><span class="padding-cell">0</span></i>
				<i class="icon iconfont icon-duanxin"><span class="padding-cell">0</span></i>
			</div>
			<el-row class="block-col-2 show-comment">
			    <el-col :span="12">
				    <el-dropdown trigger="click">
				      <span class="el-dropdown-link">
				        展示评论<i class="el-icon-arrow-down el-icon--right"></i>
				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item ><div @click="chooseComment">展示评论</div></el-dropdown-item>
				        <el-dropdown-item ><div @click="chooseComment">隐藏评论</div></el-dropdown-item>
				      </el-dropdown-menu>
				    </el-dropdown>
			    </el-col>
			</el-row>
			<ol class="operate-option">
				<li class="green">重发</li>
				<router-link tag="li" to="snsTDetail">查看</router-link>
				<li @click="deleteHandle">删除</li>
			</ol>
		</li>
	</ul>
    <!-- 分页  -->
    <div class="block">
	    <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="currentPage4"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="10"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="400">
	    </el-pagination>
	</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      currentPage4: 4
    };
  },
  filters: {
    
  },
  created() {
    this.listLoading = false
  },
  methods: {
     handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    },
    chooseComment() {
    	this.$alert('提交成功', '关闭', {
          confirmButtonText: '确定',
          callback: action => {}
        });
    },
    deleteHandle() {
        this.$confirm('请确认是否删除朋友圈?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          	this.$message({
	            type: 'success',
	            message: '删除成功!'
	        });
        }).catch(() => {
               
       	});
      }
  	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
        width: 98%;
        border-bottom: 1px solid #e1ebf4;
        overflow: hidden;
        padding: 12px 0;
        margin: 0 auto;
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
.filter-container{
    width: 980px;
    margin-bottom: 20px;
    >div,>button{
        margin-right: 10px;
    }
}
.add-btn {
	overflow: hidden !important;
    border-radius: 4px;
    margin: 12px 15px;
    font-size: 14px;
    cursor: pointer;
    float: right;
    padding: 5px 10px;
    background: #43b792 !important;
    color: #FFFFFF;
}
// .pagination-container{
//     /*margin-top: 20px;*/
// }
.cell {
  img {
    width: 80%;
  }
}
.el-select {
	margin: 0 !important;
}
</style>
