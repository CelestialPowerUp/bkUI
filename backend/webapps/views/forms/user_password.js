define(["views/modules/base",
        "views/modules/upload"],function(base,upload){
	
	var submit_callback = null;
	
	var submit_form_ui = {
			view:"form", 
			id:"form_data",
			elements:[
					    {view:"text",type:"password",name:"password",label:"密码",placeholder:"请输入新密码"},
						{
							margin:10,
							cols:[
								{},
								{ view:"button", label:"确定", align:"center", width:120, click:function(){
									if (!$$("form_data").validate()){
										webix.message({type:"error", text:"密码不能为空"});
										return ;
									}
									var formdata = $$("form_data").getValues();
									if(typeof(submit_callback)==='function'){
										submit_callback(formdata);
									}
									webix.$$("form_win").close();
								}},
								{ view:"button", label:"取消",align:"center", width:120, click:function(){
									webix.$$("form_win").close();
								}}
							]
						}
					],
			rules:{
				"password":webix.rules.isNotEmpty
			}
	};

	
	var layout = {
			id:"form_win",
			view:"window", 
			modal:true, 
			position:"center",
			head:"更改密码",
			body:{
				type:"space",
				rows:[submit_form_ui]
			}
		};
	
	var add_submit_callback = function(callback){
		if(typeof(callback)==='function'){
			submit_callback = callback;
		}
	};
	
	var bind_data = function(item){
		$$("form_data").parse(item);
	};
	
	return {
		$ui:layout,
		$add_submit_callback:add_submit_callback
	}
});