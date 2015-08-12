define(["views/modules/base"],function(base){

	var callback = "";
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"car_model_products_list",
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
					item.$check = !item.$check;
					this.refresh(id);
				}
			}
	};
	
	var button_ui = {cols:[{},{view:"button",label:"确定",width:80,click:function(){
								var datas = $$("car_model_products_list").serialize();
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
				rows:[list_ui,button_ui]
			}
		};
	
	var init_data = function(checked_data,key){
		base.getReq("meta_products.json?key="+key,function(data){
			for(var i=0;i<data.length;i++){
				$$("car_model_products_list").add(parse_check_data(data[i],checked_data));
			}
		});
	};
	
	var parse_check_data = function(obj,arrs){
		obj.recommended = false;
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]['product_id']===obj['product_id']){
				obj.$check=true;
				obj.recommended = arrs[i].recommended;
				break;
			}
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