define(["views/modules/base"],function(base){

	var callback = "";
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"ware_products_list",
			height:450,
			width:650,
			type: {
                height: 35,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.product_name+" ( "+obj.product_category_name+" ) </div>";
				}
			},
			data: [],
			on: {
				onItemClick:function(id){
					var item = this.getItem(id);
					var datas = $$("ware_products_list").serialize();
					for(var i=0;i<datas.length;i++){
						if(datas[i].product_id === item.product_id){
							datas[i].$check = true;
							continue;
						}
						datas[i].$check = false;
					}
					//$$("ware_products_list").parse(datas);
					$$("ware_products_list").refresh();
				}
			}
	};

	var filter = {cols:[
		{view:"text",label:"请输入查找的内容:",css:"fltr",labelWidth:135,on:{
			onTimedKeyPress:function(){
				var value = this.getValue().toLowerCase();
				var datas = $$("ware_products_list").serialize();
				for(var i=0;i<datas.length;i++){
					try{
						var str1 = datas[i].product_name+datas[i].product_category_name;
						datas[i].value_weight = base.$value_weight(value,str1);
					}catch(e){
						console.log(datas[i]);
					}
				}
				$$("ware_products_list").sort("#value_weight#","desc");
				$$("ware_products_list").scrollTo(0,0);
			}
		}},
	]};

	var button_ui = {cols:[{},{view:"button",label:"确定",width:80,click:function(){
								var datas = $$("ware_products_list").serialize();
								var checkdata = [];
								for(var i=0;i<datas.length;i++){
									if(datas[i]['$check']){
										checkdata.push(datas[i]);
									}
								}
								if(typeof(callback)==="function"){
									callback(checkdata);
								}
								webix.$$("model_win").close();
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"选择商品",
			body:{
				type:"space",
				rows:[filter,list_ui,button_ui]
			}
		};
	
	var init_data = function(choose_id,category_code){
		if(!category_code){
			category_code = 'normal';
		}
		base.getReq("meta_products.json?category_code="+category_code,function(data){
			for(var i=0;i<data.length;i++){
				$$("ware_products_list").add(parse_check_data(data[i],choose_id));
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
		$init_data:init_data,
		$add_callback:add_callback
	}

});