define(["views/modules/base"],function(base){

	var callback = "";
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"product_category_list",
			height:450,
			width:650,
			type: {
                height: 35,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.category_name+" ( "+obj.category_code+" ) </div>";
				}
			},
			data: [],
			on: {
				onItemClick:function(id){
					var item = this.getItem(id);
					var datas = $$("product_category_list").serialize();
					for(var i=0;i<datas.length;i++){
						if(datas[i].current_category_type === item.current_category_type){
							datas[i].$check = true;
							continue;
						}
						datas[i].$check = false;
					}
					$$("product_category_list").refresh();
				}
			}
	};

	var filter = {cols:[
		{view:"text",label:"请输入查找的内容:",css:"fltr",labelWidth:135,on:{
			onTimedKeyPress:function(){
				var value = this.getValue().toLowerCase();
				var datas = $$("product_category_list").serialize();
				for(var i=0;i<datas.length;i++){
					try{
						var str1 = datas[i].category_name;
						datas[i].value_weight = base.$value_weight(value,str1);
					}catch(e){
						console.log(datas[i]);
					}
				}
				$$("product_category_list").sort("#value_weight#","desc");
				$$("product_category_list").scrollTo(0,0);
			}
		}},
	]};

	var button_ui = {cols:[{},{view:"button",label:"确定",width:80,click:function(){
								var datas = $$("product_category_list").serialize();
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
			head:"选择商品类型",
			body:{
				type:"space",
				rows:[filter,list_ui,button_ui]
			}
		};
	
	var init_data = function(choose_id){
		base.getReq("coupon_packages/link_product_category.json",function(data){
			console.log(data);
			for(var i=0;i<data.length;i++){
				$$("product_category_list").add(parse_check_data(data[i],choose_id));
			}
		});
	};
	
	var parse_check_data = function(obj,choose_id){
		obj.$check = false;
		if(obj.current_category_type===choose_id){
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