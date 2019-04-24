<!--
<Dialog @callback="callback">
  <div slot='content' class="dialog-content">
    <p>2222</p>
    <h2>3333</h2>
  </div>
</Dialog>

this.$store.dispatch("showDialog",{
  title:'修改',
  content:"2222"
})
-->
<template>
	<div class="init-dialog" v-if="visible">
		<div class="dialog-box">
			<div class="dialog-head">
				<span>{{dialogData.title}}</span>
				<div class="close" @click="cancel"></div>
			</div>
			<div class="dialog-body">
				<div class="dialog-msg" v-if="dialogData.content" v-html="dialogData.content"></div>
        		<slot class="dialog-content" name='content' v-else>如果没有传dialogData.content，可以利用插槽格式化组件内容</slot>
			</div>
			<div class="dialog-footer" v-if="showBtn">
				<el-button type="primary" class="ele-btn" @click="submit">{{sureText}}</el-button>
				<el-button @click="cancel"  class="ele-default cancel" v-if="dialogData.showCancel">取 消</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
	export default{
		props: {
      sureText:{
        default:"确 定",
        type:String
      },
      isToggle:{
        default:false,
        type:Boolean
      },
      showBtn:{
        default:true,
        type:Boolean
      }
		},
		data(){
			return{
        timeStamp:new Date().getTime(),
        first:true
			}
		},
		created(){

		},
    computed:{
      ...mapState([
        'visible',
        'dialogData'
      ])
    },
		watch:{},
		methods:{
			submit(){
          //当点击确定需要回调时调用;
          if(this.$listeners.callback){
          //点击确定即关闭弹窗，不等接口信息返回，防止接口返回过慢，用户多次点击
          //this.$store.dispatch("hideDialog");
            let time=new Date().getTime();
            if(this.first){
              this.$emit('callback');
              this.timeStamp=time;
              this.first=false;
            }else{
              if(time-this.timeStamp>=2000){
                this.$emit('callback');
                this.timeStamp=time;
              }
            }
          }else{
            this.cancel();
          }
			},
			cancel(){
				if(this.$listeners.cancelCallback){
					this.$emit('cancelCallback');
				}else{
					this.$store.dispatch("hideDialog");
				}
			},
			...mapMutations([

			]),
			...mapActions([

			])
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
