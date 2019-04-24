/*数字:0,中文:1,英文:2,英文数字:3,中文数字:4,中文英文:5,手机号:6*/
const regExp=function(data,length,obj){
	let regSpecial=new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%]");
	let regNumber=new RegExp("^([1-9][0-9]*)$");
	let regChina=new RegExp("^[\u4e00-\u9fa5],{0,}$");
	let regEnglish=new RegExp("^[A-Za-z]+$");
	let regEngAndNumber=new RegExp("^[A-Za-z0-9]+$");
	let regChAndNumber=new RegExp("^[\u4e00-\u9fa50-9]+$");
	let regChAndEng=new RegExp("^[\u4e00-\u9fa5A-Za-z]+$");
	let regPhone=new RegExp("/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/");
	if(regSpecial.test(data)){
		this.$message({
          message: '请不要输入特殊字符',
          type: 'warning'
        })
        return true;
	}
	else if(this.$codeLength(data)>length){
		this.$message({
          message: '输入值过长',
          type: 'warning'
        })
        return true;
	}
	else if(data==""){
		this.$message({
          message: '输入值不能为空',
          type: 'warning'
        })
        return true;
	}
	else if(obj!=undefined){
		if(obj==0){
			if(!regNumber.test(parseInt(data))){
				this.$message({
		          message: '请输入纯数字',
		          type: 'warning'
		        })
		        return true;
			}
		}
		if(obj==1){
			if(!regChina.test(data)){
				this.$message({
		          message: '请输入中文',
		          type: 'warning'
		        })
		        return true;
			}
		}
		if(obj==2){
			if(!regEnglish.test(data)){
				this.$message({
		          message: '请输入英文',
		          type: 'warning'
		        })
		        return true;
			}
		}
		if(obj==3){
			if(!regEngAndNumber.test(data)){
				this.$message({
		          message: '请输入英文和数字',
		          type: 'warning'
		        })
		        return true;
			}
		}
		if(obj==4){
			if(!regChAndNumber.test(data)){
				this.$message({
		          message: '请输入中文和数字',
		          type: 'warning'
		        })
		        return true;
			}
		}
		if(obj==5){
			if(!regChAndEng.test(data)){
				this.$message({
		          message: '请输入中文和英文',
		          type: 'warning'
		        })
		        return true;
			}
		}
		if(obj==6){
			if(!regPhone.test(data)){
				this.$message({
		          message: '请输入手机号',
		          type: 'warning'
		        })
		        return true;
			}
		}
	}
	else{
		return false;
	}
}
export default regExp;