define(["views/modules/base"],function(base){
	
	var ok_callback = null;
	
	var submit_form_ui = {
			view:"form", 
			id:"form_data",
			elements:[
					    {view:"textarea",type:"message",id:"message",name:"message",placeholder:"输入信息"},
						{
							margin:10,
							cols:[
								{},
								{ view:"button", label:"确定", align:"center", width:120, click:function(){
									if (!$$("form_data").validate()){
										webix.message({type:"error", text:"信息不能为空"});
										return ;
									}
									if(typeof(ok_callback)==='function'){
										ok_callback($$("message").getValue());
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
				"message":webix.rules.isNotEmpty
			}
	};

	
	var layout = {
			id:"form_win",
			view:"window", 
			modal:true, 
			position:"center",
			head:"信息录入窗口",
			body:{
				type:"space",
				rows:[submit_form_ui]
			}
		};
	
	var add_ok_callback = function(callback){
		if(typeof(callback)==='function'){
			ok_callback = callback;
		}
	};
	
	var bind_data = function(item){
		$$("form_data").parse(item);
	};
	
	return {
		$ui:layout,
		$add_ok_callback:add_ok_callback,
		$init_data:function(msg){
			$$("message").setValue(msg);
		}
	}
});