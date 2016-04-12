define(['require'],function(require){

	var sumbit = function(){
		if ($$("login_form").validate()){ //validate form
			var base = require("../modules/base");
			base.postReq("operator/sign_in.json",$$("login_form").getValues(),function(data){
				webix.message("登陆成功");
				webix.storage.local.put('user_info',data);
				base.$request_upload_token();
				$$("login_win").close();
				window.location.reload(true);

				//座席登陆
				//base.agentLogin();
			});
		}
		else
			webix.message({ type:"error", text:"请输入正确的账号和密码" });
	};

	var onEvent = {
		"onKeyPress":function(code,e){
			if(code===13){
				sumbit();
			}
		}
	};

	var timer_count_button = function(time){
		setTimeout(function(){
			if(time===0){
				$$("get_code_button").enable();
				$$("get_code_button").setValue("重新获取");
				$$("get_code_button").refresh();
				return;
			}
			$$("get_code_button").setValue("（"+time+"）获取");
			$$("get_code_button").refresh();
			timer_count_button(time-1);
		},1000);
	};
	
	return {
		$ui:{
			view:"window",
			modal:true,
			id:"login_win",
			width:350,
			position:"center",
			head:"用户登陆",
			body:{
				view:"form",
				id:"login_form",
		        position:"center",
				elements: [
					{type:"clean",
						cols:[
							{view: "icon", icon: "fa fa-exclamation-triangle"},
							{view:"label", align:"left",css:"warning", label:"请短信验证再登陆"}
						]
					},
					{ view:"text", label:'账号',id:"user_account_l", name:"user_account",placeholder: "输入登陆的账号",required:true,value:"",on:onEvent},
					{ view:"text",type:"password",id:"password_input", label:'密码',hidden:true, name:"password", placeholder: "输入密码",required:true,value : "",on:onEvent},
					{id:"sms_code_ui",margin:10,rows:[
						{ view:"text",id:"sms_code_input", name:"sms_code",label:'验证码', placeholder: "输入验证码",value : ""},
						{margin:15,cols:[
							{ view:"button",id:"get_code_button", value: "获取验证码", click:function(){
								$$("get_code_button").disable();
								var base = require("../modules/base");
								if ($$("user_account_l").validate()){
									base.getReq("sms_code.json/"+$$("user_account_l").getValue(),function(data){
										base.$msg.info("验证码已发送至账号绑定的手机【"+data+"】");
										timer_count_button(59);
									},function(){
										$$("get_code_button").enable();
									});
								}
							}},
							{ view:"button", value: "验证", click:function(){
								var base = require("../modules/base");
								if ($$("user_account_l").validate()){
									if($$("sms_code_input").getValue()===''){
										base.$msg.error("请输入验证码");
										return;
									}
									base.postForm("user/sms_code/verify.json",$$("login_form").getValues(),function(){
										base.$msg.info("短信验证成功");
										$$("sms_code_ui").hide();
										$$("submit_button").show();
										$$("password_input").show();
									});
								}
							}}
						]}
					]},
					{ view:"button",id:"submit_button", value: "登陆",hidden:true, click:function(){
						sumbit();
					}}
				],
				rules:{
					"user_account":webix.rules.isNotEmpty,
					"password":webix.rules.isNotEmpty
				},
				elementsConfig:{
					labelPosition:"left"
				}
			}
		}
	};
});