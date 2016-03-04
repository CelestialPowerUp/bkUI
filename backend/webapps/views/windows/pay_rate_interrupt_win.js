define(["views/modules/base"],function(base){

	var callback = "";

	var elements = [
		{ id:"rank",header:"序号", css:"rank",width:60},
		{id:"rate_type",header:"费种",width:100},
		{id:"info", header:"信息",width:120,fillspace:true},
	];

	var table_ui = {
		id:"pay_rate_interrupt_list",
		view:"datatable",
		select:false,
		rowHeight:35,
		width:700,
		height:400,
		autoheight:false,
		hover:"myhover",
		columns:elements,
		data:[]
	};

	var button_ui = {cols:[{},
	                       {view:"button",label:"关闭",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"空档期",
			body:{
				type:"space",
				rows:[table_ui,button_ui]
			}
		};
	
	var init_data = function(){
		base.getReq("/v1/api/pay_rate_interrupt.json",function(data){
			if(data && data instanceof Array){
				var no = 1;
				for(var i=0;i<data.length;i++){
					data[i].rank = no++;
				}
			}
			$$("pay_rate_interrupt_list").parse(data);
		});
	};

	var add_callback = function(func){
		callback = func;
	};
	
	return {
		$ui:layout,
		$init_data:init_data,
		$add_callback:add_callback
	}

});