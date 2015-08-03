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
	
	return {
		$ui:{
			view:"window",
			modal:true,
			id:"login_win",
			position:"center",
			head:"用户登陆",
			body:{
				view:"form",
				id:"login_form",
		        position:"center",
				elements: [
					{ view:"text", label:'账号', name:"phone_number",placeholder: "手机号",value:"",on:onEvent},
					{ view:"text",type:"password", label:'密码', name:"password", placeholder: "输入密码",value : "",on:onEvent},
					{ view:"button", value: "登陆", click:function(){
						sumbit();
					}}
				],
				rules:{
					"phone_number":webix.rules.isNotEmpty,
					"password":webix.rules.isNotEmpty
				},
				elementsConfig:{
					labelPosition:"left"
				}
			}
		}
	};
});