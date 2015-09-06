define(["../modules/base"],function(base){

	//验证手机号手否有效
	function callOutCheck(){
		var phoneNumber = $$("phone_number").getValue();
		var isPhone = base.isPhoneNumber(phoneNumber);
		if(!isPhone){
			webix.message({ type:"error",expire:5000,text:"手机号码不正确"});
			return false;
		}
		return true;
	}
	//呼叫中按钮显示隐藏
	function callingLabelSh(show){
		if(show){
			$$("calling").show();
		}else{
			$$("calling").hide();
		}
	}
	//呼出按钮显示隐藏
	function callOutBtnSh(show){
		if(show){
			$$("call_out_btn").show();
		}else{
			$$("call_out_btn").hide();
		}
	}
	//恢复界面
	var resetView = function(){
		callOutBtnSh(true);
		callingLabelSh(false);
	}

	//外呼
	var callOut = function(){
		if(!callOutCheck()){
			return ;
		}
		//呼出时
		//显示呼叫中
		callingLabelSh(true);
		//隐藏呼出按钮
		callOutBtnSh(false);
		//发送外呼请求
		var jsonParam = {};
		jsonParam.agent_id = base.getAgentId();
		jsonParam.call_number = $$("phone_number").getValue();
		base.postReq("ivr/agent/callout",jsonParam,function(data){
			//base.$msg.info("外呼成功");
			console.log(data);
		});
	};


return {
	$ui:{
		view: "popup",
		id: "call_out_submenu",
		width: 300,
		borderless:false,
		padding:0,
		body:{
			rows:[
				{
					cols:[
						{view:"text",id:"phone_number",placeholder:"请输入手机号"},
						/*{view:"button",id:"search",value:"搜索"}*/
					]
				},
				{view:"label",id:"calling",label:"呼叫中...",align:"center",hidden:true},
				{view:"button",id:"call_out_btn",value:"呼出",type:"form",click:function(){
					 callOut();
				}},
				{view:"button",id:"call_off_btn",value:"挂断",type:"danger",click:function(){
					//外呼结束通话
					Cloopen.bye();
					resetView();
				}}
			]
		}
	},
	resetView:resetView,
	callOut:callOut
};

});