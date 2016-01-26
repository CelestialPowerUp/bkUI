define(["views/modules/base",
	"models/base_data"],function(base,base_data){

	var callback = "";
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"store_ware_list",
			height:250,
			width:450,
			type: {
                height: 35,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.ware_name +"("+obj.product_name+")</div>";
				}
			},
			data: [],
			on: {
				onItemClick:function(id){
					var item = this.getItem(id);
					var datas = $$("store_ware_list").serialize();
					for(var i=0;i<datas.length;i++){
						if(datas[i].ware_id === item.ware_id){
							datas[i].$check = true;
							continue;
						}
						datas[i].$check = false;
					}
					$$("store_ware_list").refresh();
				}
			}
	};

	var elements = [
		{ id:"rank",header:"序号", css:"rank",width:60},
		{id:"id",header:"ID",width:50,hidden:true},
		{id:"user_name",header:"用户姓名",width:100},
		{id:"phone_number", header:"电话",width:120},
		{id:"app_versions", header:"用户版本",fillspace:true},
		{id:"push_time", header:"实推时间",width:125,format:base.$show_time},
		{id:"push_status_value", header:"状态",width:70},
	];

	var table_ui = {
		id:"push_user_list",
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

	var filter = {margin:15,cols:[
		{view: "richselect",id:"ware_type_code",labelWidth:60,value:"banners",on:{
			onChange:function(newv, oldv){
				base.getReq("/v2/api/store/ware_list_by_type.json?ware_type_code="+newv,function(data){
					$$("store_ware_list").clearAll();
					$$("store_ware_list").parse(data);
				});
			}
		},options:base_data.ware_type_choose_options,placeholder:"单品类型",width:250},
		{view:"text",placeholder:"请输入查找的内容:",css:"fltr",labelWidth:135,on:{
			onTimedKeyPress:function(){
				var value = this.getValue().toLowerCase();
				var datas = $$("store_ware_list").serialize();
				for(var i=0;i<datas.length;i++){
					try{
						var str1 = datas[i].product_name+datas[i].product_category_name;
						datas[i].value_weight = base.$value_weight(value,str1);
					}catch(e){
						console.log(datas[i]);
					}
				}
				$$("store_ware_list").sort("#value_weight#","desc");
				$$("store_ware_list").scrollTo(0,0);
			}
		}}
	]};

	var button_ui = {cols:[{},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"推送用户列表",
			body:{
				type:"space",
				rows:[table_ui,button_ui]
			}
		};
	
	var init_data = function(push_info_id){
		if(push_info_id){
			base.getReq("/v1/api/push_info/"+push_info_id+"/user_list.json",function(data){
				if(data && data instanceof Array){
					var no = 1;
					for(var i=0;i<data.length;i++){
						data[i].rank = no++;
					}
				}
				$$("push_user_list").parse(data);
			});
		}
	};
	
	var parse_check_data = function(obj,choose_id){
		obj.$check = false;
		if(obj.product_id===choose_id){
			obj.$check = true;
		}
		return obj;
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