<template>
	<div>
		<template>
		    <el-select v-model="value8" filterable placeholder="全部账号">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
		    </el-select>
		</template>
		<div class="main-contents">
			<p>哈哈哈哈今天真开心<img class="expression" src="http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/2018new_huaixiao_org.png" /></p>
			<ul class="imgs-list">
				<li><img class="display-img" src="http://picture.ewemai.com/sq/YunKongimages/2018052311/2017101210100072018052311432018960.jpg"></li>
				<li><img class="display-img" src="http://picture.ewemai.com/sq/YunKongimages/2018052311/2017101210100072018052311432018960.jpg"></li>
				<li><img class="display-img" src="http://picture.ewemai.com/sq/YunKongimages/2018052311/2017101210100072018052311432018960.jpg"></li>
				<li><img class="display-img" src="http://picture.ewemai.com/sq/YunKongimages/2018052311/2017101210100072018052311432018960.jpg"></li>
				<li><img class="display-img" src="http://picture.ewemai.com/sq/YunKongimages/2018052311/2017101210100072018052311432018960.jpg"></li>
				<li><img class="display-img" src="http://picture.ewemai.com/sq/YunKongimages/2018052311/2017101210100072018052311432018960.jpg"></li>
			</ul>
			<div class="list-block">
				<i class="icon iconfont icon-icon4 icon-block"><span class="padding-cell">0</span></i>
				<i class="icon iconfont icon-duanxin"><span class="padding-cell">0</span></i>
			</div>
			<div class="aixin">
				<i class="icon iconfont icon-aixin icon-middle"></i>
				<div></div>
			</div>
			<div class="dis-tb">
                <div id="text-area" class="col" ref="textArea"></div>
            </div>
            <button class="comment-btn">发表评论</button>
		</div>
	</div>
</template>

<script>
import wangEditor from 'wangEditor'
import wangJson from '@/assets/face.json'
export default {
    data() {
     	return {
	        options: [{
	          value: '选项1',
	          label: '晴天娃娃'
	        }, {
	          value: '选项2',
	          label: '罗森辉'
	        }],
	        value8: '',
	        wang: {},
			wangJson: wangJson
	    }
    },
    mounted() {
		this.wang=new wangEditor(this.$refs.textArea);
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
	    this.wang.create();
		//监听滚动事件
		window.addEventListener('scroll', function(){
		})
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-select {
    margin: 20px !important;
}
.main-contents {
    padding: 15px 70px;
    .expression {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin: 10px 5px;
        vertical-align: middle;
    }
    .imgs-list {
        overflow: hidden;
        li {
            float: left;
            margin-right: 10px;
        }
        .display-img {
            display: inline-block;
            width: 90px;
            height: 90px;
            border-radius: 4px;
        }
    }
    .list-block {
        text-align: right;
        margin: 20px 0;
        overflow: hidden;
        width: 98%;
    }
    .aixin {
        width: 100%;
        height: 50px;
        background: #eff5f9;
        .icon-middle {
            display: block;
            width: 30px;
            height: 30px;
            line-height: 50px;
            padding: 0 0 0 15px;
        }
    }
    .dis-tb {
        width: 100%;
        margin: 20px auto;
        .col img{
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 0 3px;
        }
    }
    .comment-btn {
        background: #43b792 !important;
        padding: 8px 20px;
        border-radius: 4px;
        color: #FFFFFF;
        cursor: pointer;
    }
}
</style>