export default {
  citys: function() {
    let CityInfo = [
      {
        value: "Beijing",
        label: "北京市",
        children: [
          { value: "Dongcheng", label: "东城区" },
          { value: "Xicheng", label: "西城区" },
          { value: "Chongwen", label: "崇文区" },
          { value: "Xuanwu", label: "宣武区" },
          { value: "Chaoyang", label: "朝阳区" },
          { value: "Fengtai", label: "丰台区" },
          { value: "Shijingshan", label: "石景山区" },
          { value: "Haidian", label: "海淀区" },
          { value: "Mendougou", label: "门头沟区" },
          { value: "Fangshan", label: "房山区" },
          { value: "Tongzhou", label: "通州区" },
          { value: "Shunyi", label: "顺义区" },
          { value: "Changping", label: "昌平区" },
          { value: "Daxing", label: "大兴区" },
          { value: "Huairou", label: "怀柔区" },
          { value: "Pinggu", label: "平谷区" },
          { value: "Miyun", label: "密云县" },
          { value: "Yanqing", label: "延庆县" }
        ]
      },
      {
        value: "Tianjin",
        label: "天津市",
        children: [
          { value: "Heping", label: "和平区" },
          { value: "Hedong", label: "河东区" },
          { value: "Hexi", label: "河西区" },
          { value: "Nankai", label: "南开区" },
          { value: "Hebei", label: "河北区" },
          { value: "Hongqiao", label: "红桥区" },
          { value: "Tanggu", label: "塘沽区" },
          { value: "Hangu", label: "汉沽区" },
          { value: "Dagang", label: "大港区" },
          { value: "Dongli", label: "东丽区" },
          { value: "Xiqing", label: "西青区" },
          { value: "Jingnan", label: "津南区" },
          { value: "Beichen", label: "北辰区" },
          { value: "Wuqing", label: "武清区" },
          { value: "Baodi", label: "宝坻区" },
          { value: "Ninghe", label: "宁河县" },
          { value: "Jinghai", label: "静海县" },
          { value: "Jixian", label: "蓟县" }
        ]
      },
      {
        value: "Hebei",
        label: "河北",
        children: [
          {
            value: "Shijiazhuang",
            label: "石家庄市"
          },
          {
            value: "Tangshan",
            label: "唐山市"
          },
          {
            value: "Qinhuangdao",
            label: "秦皇岛市"
          },
          {
            value: "Handan",
            label: "邯郸市"
          },
          {
            value: "Xingtai",
            label: "邢台市"
          },
          {
            value: "Baoding",
            label: "保定市"
          },
          {
            value: "Zhangjiakou",
            label: "张家口市"
          },
          {
            value: "Chengde",
            label: "承德市"
          },
          {
            value: "Cangzhou",
            label: "沧州市"
          },
          {
            value: "Langfang",
            label: "廊坊市"
          },
          {
            value: "Henshui",
            label: "衡水市"
          }
        ]
      },
      {
        value: "Shanxi",
        label: "山西",
        children: [
          {
            value: "Taiyuan",
            label: "太原市"
          },
          {
            value: "Datong",
            label: "大同市"
          },
          {
            value: "Yangquan",
            label: "阳泉市"
          },
          {
            value: "Changzhi",
            label: "长治市"
          },
          {
            value: "Jincheng",
            label: "晋城市"
          },
          {
            value: "Suzhou",
            label: "朔州市"
          },
          {
            value: "Jinzhong",
            label: "晋中市"
          },
          {
            value: "Yuncheng",
            label: "运城市"
          },
          {
            value: "Xinzhou",
            label: "忻州市"
          },
          {
            value: "Linfen",
            label: "临汾市"
          },
          {
            value: "Lvliang",
            label: "吕梁市"
          }
        ]
      },
      {
        value: "Neimenggu",
        label: "内蒙古",
        children: [
          {
            value: "Hutehaohe",
            label: "呼和浩特市"
          },
          {
            value: "Baotou",
            label: "包头市"
          },
          {
            value: "Wuhai",
            label: "乌海市"
          },
          {
            value: "Chifeng",
            label: "赤峰市"
          },
          {
            value: "Tongliao",
            label: "通辽市"
          },
          {
            value: "Eerduosi",
            label: "鄂尔多斯市"
          },
          {
            value: "Hulunbeier",
            label: "呼伦贝尔市"
          },
          {
            value: "Bayanzhuoer",
            label: "巴彦淖尔市"
          },
          {
            value: "Wulanchabu",
            label: "乌兰察布市"
          },
          {
            value: "Xinganmeng",
            label: "兴安盟"
          },
          {
            value: "Xilinguolemeng",
            label: "锡林郭勒盟"
          },
          {
            value: "Alashanmeng",
            label: "阿拉善盟"
          }
        ]
      },
      {
        value: "Liaoning",
        label: "辽宁",
        children: [
          {
            value: "Shenyang",
            label: "沈阳市"
          },
          {
            value: "Dalian",
            label: "大连市"
          },
          {
            value: "Anshan",
            label: "鞍山市"
          },
          {
            value: "Fushun",
            label: "抚顺市"
          },
          {
            value: "Benxi",
            label: "本溪市"
          },
          {
            value: "Dandong",
            label: "丹东市"
          },
          {
            value: "Jingzhou",
            label: "锦州市"
          },
          {
            value: "Yingkou",
            label: "营口市"
          },
          {
            value: "Fuxin",
            label: "阜新市"
          },
          {
            value: "Liaoyang",
            label: "辽阳市"
          },
          {
            value: "Panjing",
            label: "盘锦市"
          },
          {
            value: "Tieling",
            label: "铁岭市"
          },
          {
            value: "Chaoyang",
            label: "朝阳市"
          },
          {
            value: "Huludao",
            label: "葫芦岛市"
          }
        ]
      },
      {
        value: "Changchun",
        label: "吉林",
        children: [
          {
            value: "Changchun",
            label: "长春市"
          },
          {
            value: "Jilin",
            label: "吉林市"
          },
          {
            value: "Siping",
            label: "四平市"
          },
          {
            value: "Liaoyuan",
            label: "辽源市"
          },
          {
            value: "Tonghua",
            label: "通化市"
          },
          {
            value: "Baishan",
            label: "白山市"
          },
          {
            value: "Songyuan",
            label: "松原市"
          },
          {
            value: "Baicheng",
            label: "白城市"
          },
          {
            value: "Yanbian",
            label: "延边"
          }
        ]
      },
      {
        value: "Heilongjiang",
        label: "黑龙江",
        children: [
          {
            value: "Haerbin",
            label: "哈尔滨市"
          },
          {
            value: "Qiqihaer",
            label: "齐齐哈尔市"
          },
          {
            value: "Jixi",
            label: "鸡西市"
          },
          {
            value: "Hegang",
            label: "鹤岗市"
          },
          {
            value: "Shuangyashan",
            label: "双鸭山市"
          },
          {
            value: "Daqin",
            label: "大庆市"
          },
          {
            value: "Yichun",
            label: "伊春市"
          },
          {
            value: "Jiamusi",
            label: "佳木斯市"
          },
          {
            value: "Qitaihe",
            label: "七台河市"
          },
          {
            value: "Mudanjiang",
            label: "牡丹江市"
          },
          {
            value: "Heihe",
            label: "黑河市"
          },
          {
            value: "Suihua",
            label: "绥化市"
          },
          {
            value: "Daxinganling",
            label: "大兴安岭地区"
          }
        ]
      },
      {
        value: "Shanghai",
        label: "上海",
        children: [
          {
            value: "Baoshan",
            label: "宝山"
          },
          {
            value: "Changning",
            label: "长宁"
          },
          {
            value: "Chongming",
            label: "崇明"
          },
          {
            value: "Fengxian",
            label: "奉贤"
          },
          {
            value: "Hongkou",
            label: "虹口"
          },
          {
            value: "Huangpu",
            label: "黄浦"
          },
          {
            value: "Jiading",
            label: "嘉定"
          },
          {
            value: "Jinshan",
            label: "金山"
          },
          {
            value: "Jingan",
            label: "静安"
          },
          {
            value: "Pudong",
            label: "浦东新区"
          },
          {
            value: "Yangpu",
            label: "杨浦"
          },
        ]
      },
      {
        value: "jiangsu",
        label: "江苏",
        children: [
          {
            value: "Nanjing",
            label: "南京市"
          },
          {
            value: "Wuxi",
            label: "无锡市"
          },
          {
            value: "Xuzhou",
            label: "徐州市"
          },
          {
            value: "Changzhou",
            label: "常州市"
          },
          {
            value: "Suzhou",
            label: "苏州市"
          },
          {
            value: "Nantong",
            label: "南通市"
          },
          {
            value: "Lianyungang",
            label: "连云港市"
          },
          {
            value: "Huaian",
            label: "淮安市"
          },
          {
            value: "Yancheng",
            label: "盐城市"
          },
          {
            value: "Yangzhou",
            label: "扬州市"
          },
          {
            value: "zhengjiang",
            label: "镇江市"
          },
          {
            value: "Taizhou",
            label: "泰州市"
          },
          {
            value: "Suqian",
            label: "宿迁市"
          }
        ]
      },
      {
        value: "Zhejiang",
        label: "浙江",
        children: [
          {
            value: "Hangzhou",
            label: "杭州市"
          },
          {
            value: "Ningbo",
            label: "宁波市"
          },
          {
            value: "Wenzhou",
            label: "温州市"
          },
          {
            value: "Jiaxing",
            label: "嘉兴市"
          },
          {
            value: "Huzhou",
            label: "湖州市"
          },
          {
            value: "Shaoxing",
            label: "绍兴市"
          },
          {
            value: "Jinhua",
            label: "金华市"
          },
          {
            value: "Quzhou",
            label: "衢州市"
          },
          {
            value: "Zhoushan",
            label: "舟山市"
          },
          {
            value: "Taizhou",
            label: "台州市"
          },
          {
            value: "Lishui",
            label: "丽水市"
          }
        ]
      },
      {
        value: "Anhui",
        label: "安徽",
        children: [
          {
            value: "Hefei",
            label: "合肥市"
          },
          {
            value: "Wuhu",
            label: "芜湖市"
          },
          {
            value: "Bengbu",
            label: "蚌埠市"
          },
          {
            value: "Huainan",
            label: "淮南市"
          },
          {
            value: "Maanshan",
            label: "马鞍山市"
          },
          {
            value: "Huaibei",
            label: "淮北市"
          },
          {
            value: "Tongling",
            label: "铜陵市"
          },
          {
            value: "Anqin",
            label: "安庆市"
          },
          {
            value: "Huangshan",
            label: "黄山市"
          },
          {
            value: "Chuzhou",
            label: "滁州市"
          },
          {
            value: "Fuyang",
            label: "阜阳市"
          },
          {
            value: "Suzhou",
            label: "宿州市"
          },
          {
            value: "Chaohu",
            label: "巢湖市"
          },
          {
            value: "Liuan",
            label: "六安市"
          },
          {
            value: "Haozhou",
            label: "亳州市"
          },
          {
            value: "Chizhou",
            label: "池州市"
          },
          {
            value: "Xuancheng",
            label: "宣城市"
          }
        ]
      },
      {
        value: "Fujian",
        label: "福建",
        children: [
          {
            value: "Fuzhou",
            label: "福州市"
          },
          {
            value: "Xiamen",
            label: "厦门市"
          },
          {
            value: "Putian",
            label: "莆田市"
          },
          {
            value: "Sanming",
            label: "三明市"
          },
          {
            value: "Quanzhou",
            label: "泉州市"
          },
          {
            value: "Zhangzhou",
            label: "漳州市"
          },
          {
            value: "Nanping",
            label: "南平市"
          },
          {
            value: "Longyan",
            label: "龙岩市"
          },
          {
            value: "Ningde",
            label: "宁德市"
          }
        ]
      },
      {
        value: "Jiangxi",
        label: "江西",
        children: [
          {
            value: "Nanchang",
            label: "南昌市"
          },
          {
            value: "Jingdezheng",
            label: "景德镇市"
          },
          {
            value: "Pingxiang",
            label: "萍乡市"
          },
          {
            value: "Jiujiang",
            label: "九江市"
          },
          {
            value: "Xinyu",
            label: "新余市"
          },
          {
            value: "Yingtan",
            label: "鹰潭市"
          },
          {
            value: "Ganzhou",
            label: "赣州市"
          },
          {
            value: "Jian",
            label: "吉安市"
          },
          {
            value: "Yichun",
            label: "宜春市"
          },
          {
            value: "Fuzhou",
            label: "抚州市"
          },
          {
            value: "Shangrao",
            label: "上饶市"
          }
        ]
      },
      {
        value: "Shandong",
        label: "山东",
        children: [
          {
            value: "Jinan",
            label: "济南市"
          },
          {
            value: "Qingdao",
            label: "青岛市"
          },
          {
            value: "Zibo",
            label: "淄博市"
          },
          {
            value: "Zaozhuang",
            label: "枣庄市"
          },
          {
            value: "Dongying",
            label: "东营市"
          },
          {
            value: "Yantai",
            label: "烟台市"
          },
          {
            value: "Huaifang",
            label: "潍坊市"
          },
          {
            value: "Jining",
            label: "济宁市"
          },
          {
            value: "Taian",
            label: "泰安市"
          },
          {
            value: "Weihai",
            label: "威海市"
          },
          {
            value: "Rizhao",
            label: "日照市"
          },
          {
            value: "Laiwu",
            label: "莱芜市"
          },
          {
            value: "Linyi",
            label: "临沂市"
          },
          {
            value: "Dezhou",
            label: "德州市"
          },
          {
            value: "Liaocheng",
            label: "聊城市"
          },
          {
            value: "Binzhou",
            label: "滨州市"
          },
          {
            value: "Heze",
            label: "荷泽市"
          }
        ]
      },
      {
        value: "Henan",
        label: "河南",
        children: [
          {
            value: "Zhengzhou",
            label: "郑州市"
          },
          {
            value: "Kaifeng",
            label: "开封市"
          },
          {
            value: "Luoyang",
            label: "洛阳市"
          },
          {
            value: "Pingdingshan",
            label: "平顶山市"
          },
          {
            value: "Anyang",
            label: "安阳市"
          },
          {
            value: "Hebi",
            label: "鹤壁市"
          },
          {
            value: "Xinxiang",
            label: "新乡市"
          },
          {
            value: "Jiaozuo",
            label: "焦作市"
          },
          {
            value: "Puyang",
            label: "濮阳市"
          },
          {
            value: "Xuchang",
            label: "许昌市"
          },
          {
            value: "Luohe",
            label: "漯河市"
          },
          {
            value: "Sanmenxia",
            label: "三门峡市"
          },
          {
            value: "Nanyang",
            label: "南阳市"
          },
          {
            value: "Shangqiu",
            label: "商丘市"
          },
          {
            value: "Xinyang",
            label: "信阳市"
          },
          {
            value: "Zhoukou",
            label: "周口市"
          },
          {
            value: "Zhumadian",
            label: "驻马店市"
          }
        ]
      },
      {
        value: "Hubei",
        label: "湖北",
        children: [
          {
            value: "Wuhan",
            label: "武汉市"
          },
          {
            value: "Huanghsi",
            label: "黄石市"
          },
          {
            value: "Shiyan",
            label: "十堰市"
          },
          {
            value: "Yichang",
            label: "宜昌市"
          },
          {
            value: "XiangFan",
            label: "襄樊市"
          },
          {
            value: "Ezhou",
            label: "鄂州市"
          },
          {
            value: "Jingmen",
            label: "荆门市"
          },
          {
            value: "Xiaogan",
            label: "孝感市"
          },
          {
            value: "Jingzhou",
            label: "荆州市"
          },
          {
            value: "Huanggang",
            label: "黄冈市"
          },
          {
            value: "Xianning",
            label: "咸宁市"
          },
          {
            value: "Suizhou",
            label: "随州市",
            children: [
              { value: "Zengdu", label: "曾都区" },
              { value: "Guangshui", label: "广水市" }
            ]
          },
          {
            value: "Enshi",
            label: "恩施"
          },
          {
            value: "Shengnongjia",
            label: "神农架"
          }
        ]
      },
      {
        value: "Hunan",
        label: "湖南",
        children: [
          {
            value: "Changsha",
            label: "长沙市"
          },
          {
            value: "Zhuzhou",
            label: "株洲市"
          },
          {
            value: "Xiangtan",
            label: "湘潭市"
          },
          {
            value: "Henyang",
            label: "衡阳市"
          },
          {
            value: "Shaoyang",
            label: "邵阳市"
          },
          {
            value: "Yueyang",
            label: "岳阳市"
          },
          {
            value: "Changde",
            label: "常德市"
          },
          {
            value: "Zhangjiajie",
            label: "张家界市"
          },
          {
            value: "Yiyang",
            label: "益阳市"
          },
          {
            value: "Chenzhou",
            label: "郴州市"
          },
          {
            value: "Yongzhou",
            label: "永州市"
          },
          {
            value: "Huaihua",
            label: "怀化市"
          },
          {
            value: "Loudi",
            label: "娄底市"
          },
          {
            value: "Xiangxi",
            label: "湘西"
          }
        ]
      },
      {
        value: "guangdong",
        label: "广东",
        children: [
          {
            value: "Guangzhou",
            label: "广州市"
          },
          {
            value: "Shaoguan",
            label: "韶关市"
          },
          {
            value: "shenzhen",
            label: "深圳市"
          },
          {
            value: "Zhuhai",
            label: "珠海市"
          },
          {
            value: " Shantou",
            label: "汕头市"
          },
          {
            value: "Foshan",
            label: "佛山市"
          },
          {
            value: "Jiangmen",
            label: "江门市"
          },
          {
            value: "Zhanjiang",
            label: "湛江市"
          },
          {
            value: "Maoming",
            label: "茂名市"
          },
          {
            value: "Zhaoqin",
            label: "肇庆市"
          },
          {
            value: "Huizhou",
            label: "惠州市"
          },
          {
            value: "Meizhou",
            label: "梅州市"
          },
          {
            value: "Shanwei",
            label: "汕尾市"
          },
          {
            value: "Heyuan",
            label: "河源市"
          },
          {
            value: "Yangjiang",
            label: "阳江市"
          },
          {
            value: "Qingyuan",
            label: "清远市"
          },
          { value: "Dongguan", label: "东莞市" },
          { value: "Zhongshan", label: "中山市" },
          {
            value: "Chaozhou",
            label: "潮州市"
          },
          {
            value: "Jieyang",
            label: "揭阳市"
          },
          {
            value: "Yunfu",
            label: "云浮市"
          }
        ]
      },
      {
        value: "Guangxi",
        label: "广西",
        children: [
          {
            value: "Nanning",
            label: "南宁市"
          },
          {
            value: "Liuzhou",
            label: "柳州市"
          },
          {
            value: "Guilin",
            label: "桂林市"
          },
          {
            value: "Wuzhou",
            label: "梧州市"
          },
          {
            value: "Beihai",
            label: "北海市"
          },
          {
            value: "Fanghchenggang",
            label: "防城港市"
          },
          {
            value: "Qinzhou",
            label: "钦州市"
          },
          {
            value: "Guigang",
            label: "贵港市"
          },
          {
            value: "Yulin",
            label: "玉林市"
          },
          {
            value: "Baise",
            label: "百色市"
          },
          {
            value: "Hezhou",
            label: "贺州市"
          },
          {
            value: "Hechi",
            label: "河池市"
          },
          {
            value: "Laibin",
            label: "来宾市"
          },
          {
            value: "Congzuo",
            label: "崇左市"
          }
        ]
      },
      {
        value: "Hainan",
        label: "海南",
        children: [
          {
            value: "Haikou",
            label: "海口市"
          },
          {
            value: "Sanya",
            label: "三亚市"
          }
        ]
      },
      {
        value: 'Chongqing',
        label: "重庆市",
        children: [
          { value: "Wanzhou", label: "万州区" },
          { value: "Peiling", label: "涪陵区" },
          { value: "Yuzhong", label: "渝中区" },
          { value: "Dadukou", label: "大渡口区" },
          { value: "Jiangbei", label: "江北区" },
          { value: "Shapingba", label: "沙坪坝区" },
          { value: "Jiulongpuo", label: "九龙坡区" },
          { value: "Nanan", label: "南岸区" },
          { value: "Beibei", label: "北碚区" },
          { value: "Wansheng", label: "万盛区" },
          { value: "Shuangqiao", label: "双桥区" },
          { value: "Yubei", label: "渝北区" },
          { value: "Banan", label: "巴南区" },
          { value: "Qianjiang", label: "黔江区" },
          { value: "Changshou", label: "长寿区" }
        ]
      },
      {
        value: "Sichuan",
        label: "四川",
        children: [
          {
            value: "Chengdu",
            label: "成都市"
          },
          {
            value: "Zigong",
            label: "自贡市"
          },
          {
            value: "Panzhihua",
            label: "攀枝花市"
          },
          {
            value: "Luzhou",
            label: "泸州市"
          },
          {
            value: "Deyang",
            label: "德阳市"
          },
          {
            value: "Mianyang",
            label: "绵阳市"
          },
          {
            value: "Guangyuan",
            label: "广元市"
          },
          {
            value: "Suining",
            label: "遂宁市"
          },
          {
            value: "Neijiang",
            label: "内江市"
          },
          {
            value: "Leshan",
            label: "乐山市"
          },
          {
            value: "Nanchong",
            label: "南充市"
          },
          {
            value: "Meishan",
            label: "眉山市"
          },
          {
            value: "Yibin",
            label: "宜宾市"
          },
          {
            value: "Guangan",
            label: "广安市"
          },
          {
            value: "Dazhou",
            label: "达州市"
          },
          {
            value: "Yaan",
            label: "雅安市"
          },
          {
            value: "Bazhong",
            label: "巴中市"
          },
          {
            value: "Ziyang",
            label: "资阳市"
          },
          {
            value: "Aba",
            label: "阿坝"
          },
          {
            value: "Ganzi",
            label: "甘孜"
          },
          {
            value: "Liangshan",
            label: "凉山"
          }
        ]
      },
      {
        value: "Guizhou",
        label: "贵州",
        children: [
          {
            value: "Guiyang",
            label: "贵阳市"
          },
          {
            value: "Liupanshui",
            label: "六盘水市"
          },
          {
            value: "Zunyi",
            label: "遵义市"
          },
          {
            value: "Anshun",
            label: "安顺市"
          },
          {
            value: "Tongren",
            label: "铜仁地区"
          },
          {
            value: "Qianxi",
            label: "黔西"
          },
          {
            value: "Bijie",
            label: "毕节地区"
          },
          {
            value: "Qiandong",
            label: "黔东"
          },
          {
            value: "Qiannan",
            label: "黔南"
          }
        ]
      },
      {
        value: "Yunnan",
        label: "云南",
        children: [
          {
            value: "Kunming",
            label: "昆明市"
          },
          {
            value: "Qujing",
            label: "曲靖市"
          },
          {
            value: "Yuxi",
            label: "玉溪市"
          },
          {
            value: "Baoshan",
            label: "保山市"
          },
          {
            value: "Zhaotong",
            label: "昭通市"
          },
          {
            value: "Lijiang",
            label: "丽江市"
          },
          {
            value: "Simao",
            label: "思茅市"
          },
          {
            value: "Lincang",
            label: "临沧市"
          },
          {
            value: "Chuxiong",
            label: "楚雄"
          },
          {
            value: "Honghe",
            label: "红河"
          },
          {
            value: "Wenshan",
            label: "文山"
          },
          {
            value: "Xishuangbanna",
            label: "西双版纳"
          },
          {
            value: "Dalian",
            label: "大理"
          },
          {
            value: "Dehong",
            label: "德宏"
          },
          {
            value: "Nujiang",
            label: "怒江"
          },
          {
            value: "Diqing",
            label: "迪庆"
          }
        ]
      },
      {
        value: "Xizang",
        label: "西藏",
        children: [
          {
            value: "Lasa",
            label: "拉萨市"
          },
          {
            value: "Changdu",
            label: "昌都地区"
          },
          {
            value: "Shannan",
            label: "山南地区"
          },
          {
            value: "Rikaze",
            label: "日喀则地区"
          },
          {
            value: "Naqu",
            label: "那曲地区"
          },
          {
            value: "Ali",
            label: "阿里地区"
          },
          {
            value: "Linzhi",
            label: "林芝地区"
          }
        ]
      },
      {
        value: "Shanxisheng",
        label: "陕西",
        children: [
          {
            value: "Xian",
            label: "西安市"
          },
          {
            value: "Tongchuan",
            label: "铜川市"
          },
          {
            value: "Baoji",
            label: "宝鸡市"
          },
          {
            value: "Xianyang",
            label: "咸阳市"
          },
          {
            value: "Weinan",
            label: "渭南市"
          },
          {
            value: "Yanan",
            label: "延安市"
          },
          {
            value: "Hanzhong",
            label: "汉中市"
          },
          {
            value: "YUlin",
            label: "榆林市"
          },
          {
            value: "Ankang",
            label: "安康市"
          },
          {
            value: "ShangLuo",
            label: "商洛市"
          }
        ]
      },
      {
        value: "Gansu",
        label: "甘肃",
        children: [
          {
            value: "Lanzhou",
            label: "兰州市"
          },
          {
            value: "Jiayuguan",
            label: "嘉峪关市"
          },
          {
            value: "Jinchang",
            label: "金昌市"
          },
          {
            value: "Baiyin",
            label: "白银市"
          },
          {
            value: "Tianshui",
            label: "天水市"
          },
          {
            value: "Wuwei",
            label: "武威市"
          },
          {
            value: "Zhangye",
            label: "张掖市"
          },
          {
            value: "Pingliang",
            label: "平凉市"
          },
          {
            value: "Jiuquan",
            label: "酒泉市"
          },
          {
            value: "Qingyang",
            label: "庆阳市"
          },
          {
            value: "Dingxi",
            label: "定西市"
          },
          {
            value: "Longnan",
            label: "陇南市"
          },
          {
            value: "Linxia",
            label: "临夏"
          },
          {
            value: "Gannan",
            label: "甘南"
          }
        ]
      },
      {
        value: "Qinghai",
        label: "青海",
        children: [
          {
            value: "Xining",
            label: "西宁市"
          },
          {
            value: "Haidong",
            label: "海东地区"
          },
          {
            value: "Haibei",
            label: "海北"
          },
          {
            value: "Huangnan",
            label: "黄南"
          },
          {
            value: "Hainan",
            label: "海南"
          },
          {
            value: "Guoluo",
            label: "果洛"
          },
          {
            value: "Yushu",
            label: "玉树"
          },
          {
            value: "Haixi",
            label: "海西"
          }
        ]
      },
      {
        value: "Ningxia",
        label: "宁夏",
        children: [
          {
            value: "Yinchuan",
            label: "银川市"
          },
          {
            value: "Suizuishan",
            label: "石嘴山市"
          },
          {
            value: "Wuzhong",
            label: "吴忠市"
          },
          {
            value: "Guyuan",
            label: "固原市"
          },
          {
            value: "Zhongwei",
            label: "中卫市"
          }
        ]
      },
      {
        value: "Xinjiang",
        label: "新疆",
        children: [
          {
            value: "Wulumuqi",
            label: "乌鲁木齐市"
          },
          {
            value: "Kelamayi",
            label: "克拉玛依市"
          },
          {
            value: "Tulufan",
            label: "吐鲁番地区"
          },
          {
            value: "Hami",
            label: "哈密地区"
          },
          {
            value: "Changji",
            label: "昌吉"
          },
          {
            value: "Boertala",
            label: "博尔塔拉"
          },
          {
            value: "Bayinguoleng",
            label: "巴音郭楞"
          },
          {
            value: "Akesu",
            label: "阿克苏地区"
          },
          {
            value: "Kezilesukeerkezi",
            label: "克孜勒苏柯尔克孜"
          },
          {
            value: "Kashi",
            label: "喀什地区"
          },
          {
            value: "Hetian",
            label: "和田地区"
          },
          {
            value: "Yilihasake",
            label: "伊犁哈萨克"
          },
          {
            value: "Tacheng",
            label: "塔城地区"
          },
          {
            value: "ALetai",
            label: "阿勒泰地区"
          },
          { value: "Shihezi", label: "石河子市" },
          { value: "Alaershi", label: "阿拉尔市"},
          { value: "Tumushukeshi", label: "图木舒克市"},
          { value: "Wujiaqu", label: "五家渠市"}
        ]
      },
      {
        value: "Xianggang",
        label: "香港",
        children: [
          { value: "Beiqu", label: "北区"},
          { value: "Dabuqu", label: "大埔区"},
          { value: "Dongqu", label: "东区"},
          { value: "Guantangqu", label: "观塘区"},
          { value: "Huangdaxianqu", label: "黄大仙区"},
          { value: "Nanqu", label: "南区"},
          { value: "Shatianqu", label: "沙田区"},
          { value: "Xigongqu", label: "西贡区"},
          { value: "Yuanlangqu", label: "元朗区"},
          { value: "Zhongxiqu", label: "中西区"},
          { value: "Tunmenqu", label: "屯门区"},
          { value: "Wanzaiqu", label: "湾仔区"}]

      },
      {
        value: "Aomen",
        label: "澳门",
        children: [
          { value: "Datangqu", label: "大堂区"},
          { value: "Fengshuntangqu", label: "风顺堂区"},
          { value: "Huadimatangqu", label: "花地玛堂区"},
          { value: "Luhuandao", label: "路环岛"},
          { value: "Shenganduonitangqu", label: "圣安多尼堂区"},
          { value: "Wangdetangqu", label: "望德堂区"}]
      },
      {
        value: "Taiwan",
        label: "台湾",
        children: [
          { value: "Gaoxiong", label: "高雄市"},
          { value: "Hualian", label: "花莲县"},
          { value: "Jilong", label: "基隆市"},
          { value: "Jiayi", label: "嘉义市"},
          { value: "Jinmen", label: "金门县"},
          { value: "Nantou", label: "南投县"},
          { value: "Penghu", label: "澎湖县"},
          { value: "Taibei", label: "台北市"},
          { value: "Tainan", label: "台南市"},
          { value: "TaiZhong", label: "台中市"},
          { value: "Xinzhu", label: "新竹县"},
          { value: "Yunlin", label: "云林县"},
          { value: "Xinbei", label: "新北市"},
          { value: "Taoyuan", label: "桃园县"},
          { value: "Yilan", label: "宜兰县"},
          { value: "Zhanghua", label: "彰化县"}]
      }
    ];
    return CityInfo;
  }
};
