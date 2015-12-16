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

	var filter = {margin:15,cols:[
		{view: "richselect",id:"ware_type_code",labelWidth:60,value:"banners",on:{
			onChange:function(newv, oldv){
				base.getReq("/v2/api/store/ware_list_by_type.json?ware_type_code="+newv,function(data){
					$$("store_ware_list").clearAll();
					$$("store_ware_list").parse(data);
				});
			}
		},options:base_data.ware_type_options,placeholder:"单品类型",width:250},
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

	var get_check_data = function(){
		var datas = $$("store_ware_list").serialize();
		for(var i=0;i<datas.length;i++){
			if(datas[i]['$check']){
				return datas[i];
			}
		}
	};

	var button_ui = {cols:[{},{view:"button",label:"确定",width:80,click:function(){
								var check_data = get_check_data();
								if(!check_data){
									base.$msg.error("未选择关联的单品");
									return;
								}
								if(typeof(callback)==="function"){
									callback(check_data);
								}
								webix.$$("model_win").close();
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"选择单品",
			body:{
				type:"space",
				rows:[filter,list_ui,button_ui]
			}
		};
	
	var init_data = function(){
		base.getReq("/v2/api/store/ware_list_by_type.json?ware_type_code=coupon_package",function(data){
			for(var i=0;i<data.length;i++){
				$$("store_ware_list").add(parse_check_data(data[i],choose_id));
			}
		});
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
		//$init_data:init_data,
		$add_callback:add_callback
	}

});