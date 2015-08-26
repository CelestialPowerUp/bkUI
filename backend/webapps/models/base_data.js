define([],function(){
	
	var citys = [
		"京",
		"津",
		"冀",
		"晋",
		"蒙",
		"辽",
		"吉",
		"黑",
		"苏",
		"浙",
		"皖",
		"沪",
		"闽",
		"赣",
		"鲁",
		"豫",
		"鄂",
		"湘",
		"粤",
		"桂",
		"琼",
		"渝",
		"川",
		"黔",
		"滇",
		"藏",
		"陕",
		"甘",
		"青",
		"宁",
		"新",
		"台",
		"港",
		"澳"
	];
	
	var car_part_type = [
		                 {id:11,value:"空气滤"},
						 {id:9,value:"机油"},
						 {id:10,value:"机滤"},
						 {id:12,value:"汽滤"},
	                     {id:1,value:"左前轮胎"},
	                     {id:2,value:"右前轮胎"},
	                     {id:3,value:"左后轮胎"},
	                     {id:4,value:"右后轮胎"},
	                     {id:5,value:"前刹车片"},
	                     {id:6,value:"后刹车片"},
	                     {id:7,value:"雨刮片"},
	                     {id:8,value:"雨刮器"},
	                     {id:13,value:"变数油箱"},
	                     {id:14,value:"转向助力液"},
	                     {id:15,value:"制动液"},
	                     {id:16,value:"电瓶"},
	                     {id:17,value:"正时皮带"},
	                     {id:18,value:"空滤"},
	                     {id:19,value:"火花塞"}
                 ];

	var audio_order = [
		{id:"default",value:"assets/audio/order.mp3"},
		{id:"app",value:"assets/audio/app_order.mp3"},
		{id:"weixin",value:"assets/audio/weixin_order.mp3"},
		{id:"xiaomi",value:"assets/audio/xiaomi_order.mp3"}
	];

	var audio_callcenter = [
		{id:"callin_0",value:"assets/audio/callin1.mp3"},
		{id:"callin_1",value:"assets/audio/callin1.mp3"},
		{id:"callin_2",value:"assets/audio/callin2.mp3"},
		{id:"callin_3",value:"assets/audio/callin3.mp3"}
	];
	
	return {
		citys:citys,
		$car_part_type:car_part_type,
		$audio_order:audio_order,
		$audio_callcenter:audio_callcenter
	};

});