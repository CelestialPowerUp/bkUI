define(["../modules/base","../menus/call_out","../app"],function(base,call_out,app){

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

	//拒接
	function reject(){
		Cloopen.reject();
	}
	//接听
	function accept(){
		Cloopen.accept();
	}


return {
	$ui:{
		view: "popup",
		id: "call_in_submenu",
		width: 300,
		borderless:false,
		padding:0,
		body:{
			rows:[
				{view:"dataview",id:"user_info",type: {
					height: 60
				},template:"<div class='webix_strong'>#phone#</div>  #user_name#",data:{phone:"手机号",user_name:"姓名"}},
				{
					cols:[
						{view:"button",id:"reject_btn",value:"拒接",click:function(){
							reject();
						}},
						{view:"button",id:"accept_btn",value:"接听",type:"form",click:function(){
							accept();
						}}
					]
				},
				{view:"button",id:"call_in_off_btn",value:"挂断",type:"danger",click:function(){
					console.log("座席挂机..");
					Cloopen.bye();
				}}
				/*,
				{view:"button",id:"test",value:"测试",click:function(){
					console.log($$("call_out"));
					var popup = $$("call_out").config.popup;
					$$("call_out").click();
					console.log(popup);
				}}*/
			]
		}
	},
	resetView:resetView
};

});