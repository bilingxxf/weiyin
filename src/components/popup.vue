<template>
	<div class="popup">
		<!--二维码-->
		<div class="bounced" v-show="passType=='qrCode'" :key="2">
			<div class="mask"></div>
			<div class="message">
				<div class="modal-header">
					<h2>{{hint}}<span @click="closeCodeShow">X</span></h2>
				</div>
				<div class="modal-body">
					 <div class="img-wrap"> <img :src='"data:image/gif;base64,"+img' alt=""></div>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		 props: {
		    taskId: {
		      type: Number
		    },
		    passType:{
		    	type: String
		    }
		  },
		data(){
			return{
				img:'',
				hint:'正在获取二维码，请稍后...',
				timer:''
			}
		},
		watch:{
			passType(newval,old){
				if(newval=='qrCode'){
					this.getQrCode(this.taskId)
				}
				if(newval=='close'){
					clearTimeout(this.timer)
				}
			}
		},
		methods:{
			getQrCode(row){
				let $this = this;
				this.$http('get_qr_code','GET',{
		  			task_id:row
		  	}).then(res=>{
		  			if(res.data.error_code==0){
						let data = res.data;
						this.img = data.error_message;
						this.hint="请扫描二维码";
		  			}else if(res.data.error_code==400){
		  				this.timer = setTimeout(()=>{
		  					$this.getQrCode(row);
		  				},1000)
		  			}else if(res.data.error_code==403){
		  				this.$message({
							message: res.data.error_message,
							type: 'error'
						});
		  			}
		  		})
			},
			//关闭
			closeCodeShow(){
				this.img=''
				this.$emit('modifyType')
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.bounced{
			position:absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			.mask{
				background: #000;
				opacity: 0.4;
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 10;
			}
			.message{
				width: 400px;
				position: absolute;
				top: 30%;
				left: 50%;
				margin-left: -200px;
				padding-bottom: 50px;
				background: #fff;
				border-radius: 5px;
				z-index: 15;
				.modal-header{
					height: 50px;
					line-height: 50px;
					font-size: 12px;
					color: #fff;
					font-weight: normal;
					position:relative;
					background-color: rgb(76, 174, 218);
					text-align:center;
					border-bottom:1px solid #bbb;
					h2{
						font-size: 14px;
					}
					span{
						position: absolute;
						right: 15px;
						display: inline-block;
						padding: 0 20px;
						cursor: pointer;
					}
				}
				.export{
					padding: 10px 20px 0px;
					overflow: hidden;
					.el-button {
						float: right;
					}
				}
				.modal-body{
					min-height: 300px;
					max-height: 390px;
					padding: 0px 50px;
					overflow: auto;
					.img-wrap{
						width: 160px;
						height: 160px;
						margin: 70px auto;
						img{
							width: 180px;
						height: 180px;
						}
					}
				}
				.modal-footer{
					text-align:center;	
					margin: 15px 0 30px;
				}
			}
		}
</style>