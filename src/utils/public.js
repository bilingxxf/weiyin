
export default {
    info:function(status){ 
			let publicUrl = {};
			switch(status){
				case 1:
					publicUrl={	// 测试环境
						resourceUrl : "http://116.62.68.173:8000/",//资源接口
						newResourceUrl: 'http://116.62.68.173/', // 无端口
						linkUrl: "http://47.99.198.9:8888/",    //测试接口
						materTestUrl: 'http://116.62.68.173:8080/', // 素材公网测试
						loginUrl:'http://47.110.226.195/#/',       //登录页
						production:false,
						chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
						redisUrl: "http://116.62.222.134/",
						baseUrl:"http://47.99.198.9:8888/api/v1/"
					}
					break;
				case 2:
					  publicUrl={	// 预发布环境
						resourceUrl : "http://47.111.97.230:8000/",//资源接口
						newResourceUrl: 'http://47.111.97.230/', // 无端口
						linkUrl: "http://47.111.98.235:8080/",    //预发布接口
						materTestUrl: 'http://120.55.57.224:5000/', // 素材
						loginUrl:'http://47.111.98.235/#/',       //登录页
						production:true,
						chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
						redisUrl: "http://116.62.222.134/",
						baseUrl:"http://47.111.98.235:8080/api/v1/"
					}
					break;
					case 3:
						publicUrl={	//生产环境1
							resourceUrl : "http://47.98.100.251:8000/",//资源接口
							newResourceUrl: 'http://47.98.100.251/', // 无端口
							linkUrl: "http://47.110.234.49:8888/",    //正式接口
							materTestUrl: 'http://47.110.233.8:5000/', // 素材公网正式
							loginUrl:'http://47.110.234.49/#/',       //登录页
							production:true,
							chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
							redisUrl: "http://47.98.114.237/",
							baseUrl:"http://47.110.234.49:8888/api/v1/"
						}
				  break;
				  case 4:
					publicUrl={	// 正式环境2
						resourceUrl : "http://47.75.246.185:8000/",//资源接口
						newResourceUrl: 'http://47.75.246.185/', // 无端口
						linkUrl: "http://47.244.13.47:8888/",    //测试接口
						materTestUrl: 'http://47.75.242.133:5000/', // 素材公网测试
						loginUrl:'http://47.75.244.219/#/',       //登录页
						production:true,
						chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
						redisUrl: "http://47.98.114.237/",
						baseUrl:"http://47.244.13.47:8888/api/v1/"
					}
				break;
				case 5:
					publicUrl={	// 正式3
						resourceUrl : "http://47.111.97.60:8000/",//资源接口
						newResourceUrl: 'http://47.111.97.60/', // 无端口
						linkUrl: "http://47.111.97.243:8888/",    //测试接口
						materTestUrl: 'http://47.111.103.241:5000/', // 素材公网测试
						loginUrl:'http://47.111.100.152/#/',       //登录页
						production:true,
						chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
						redisUrl: "http://47.98.114.237/",
						baseUrl:"http://47.111.97.243:8888/api/v1/"
					}
					break;
			}
			
			
			
			// let  publicUrl={	// 预发布环境
			// 	resourceUrl : "http://47.111.97.230:8000/",//资源接口
			// 	newResourceUrl: 'http://47.111.97.230/', // 无端口
			// 	linkUrl: "http://47.111.98.235:8080/",    //预发布接口
			// 	materTestUrl: 'http://120.55.57.224:5000/', // 素材
			// 	loginUrl:'http://47.111.98.235/#/',       //登录页
			// 	production:true,
			// 	chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
			// 	redisUrl: "http://116.62.222.134/",
			// 	baseUrl:"http://47.111.98.235:8080/api/v1/"
			// }


			// let  publicUrl={	//生产环境1
			// 		resourceUrl : "http://47.98.100.251:8000/",//资源接口
			// 		newResourceUrl: 'http://47.98.100.251/', // 无端口
			// 		linkUrl: "http://47.110.234.49:8888/",    //正式接口
			// 		materTestUrl: 'http://47.110.233.8:5000/', // 素材公网正式
			// 		loginUrl:'http://47.110.234.49/#/',       //登录页
			// 		production:true,
			// 		chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
			// 		redisUrl: "http://47.98.114.237/",
			//		baseUrl:"http://47.110.234.49:8888/api/v1/"
			// }

			// let  publicUrl={	// 正式环境2
			// 	resourceUrl : "http://47.75.246.185:8000/",//资源接口
			// 	newResourceUrl: 'http://47.75.246.185/', // 无端口
			// 	linkUrl: "http://47.244.13.47:8888/",    //测试接口
			// 	materTestUrl: 'http://47.75.242.133:5000/', // 素材公网测试
			// 	loginUrl:'http://47.75.244.219/#/',       //登录页
			// 	production:true,
			// 	chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
			// 	redisUrl: "http://47.98.114.237/",
			//	baseUrl:"http://47.244.13.47:8888/api/v1/"
			// }


			// let  publicUrl={	// 正式环境3
			// 	resourceUrl : "http://47.111.97.60:8000/",//资源接口
			// 	newResourceUrl: 'http://47.111.97.60/', // 无端口
			// 	linkUrl: "http://47.111.97.243:8888/",    //测试接口
			// 	materTestUrl: 'http://47.111.103.241:5000/', // 素材公网测试
			// 	loginUrl:'http://47.111.100.152/#/',       //登录页
			// 	production:true,
			// 	chatClientUrl:"http://47.98.100.251/Automaticupdate.exe",
			// 	redisUrl: "http://47.98.114.237/",
			//	baseUrl:"http://47.111.97.243:8888/api/v1/"
			// }
			return publicUrl
		}
}
