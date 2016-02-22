define(["views/modules/base"],function(base){
	
	var submit_callback = null;
	
	var submit_form_ui = {
			view:"form", 
			id:"form_data",
			elements:[
					    {view:"text",type:"job_number",name:"job_number",label:"员工号",placeholder:"请输入员工号"},
						{
							margin:10,
							cols:[
								{},
								{ view:"button", label:"确定", align:"center", width:120, click:function(){
									if (!$$("form_data").validate()){
										webix.message({type:"error", text:"员工编号不能为空"});
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
				"job_number":webix.rules.isNotEmpty
			}
	};

	
	var layout = {
			id:"form_win",
			view:"window", 
			modal:true, 
			position:"center",
			head:"修改员工号",
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