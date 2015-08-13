define(["views/modules/base"],function(base){
	
	var priceCallBack = "";

	var carModelId = "";
	
	var create_from = function(user_defined,car_model_id){

		carModelId = car_model_id;

		var products_list = {
        		id:"product_list",
        		view:"list",
        		template:"<div>#product_info#</div>",
        		type:{height:35,width:250},
        		select:true,
        		on:{"onItemClick":function(id, e, node){
        			var item = this.getItem(id);
        			//$$("labour_price").setValue(3);
        			$$("price").setValue(item['price']);
        			$$("product_name").setValue(item['product_name']);
        			$$("product_info").setValue(item['product_info']);
        			$$("product_type").setValue(item['product_type']);
        			$$("labour_price").setValue(item['labour_price']);
        			$$("part_type").setValue(item['part_type']);
        			$$('unit_count').setValue(item['unit_count']==0?1:item['unit_count']);
        			count_total_price();
        		}}
    		};

		var no_part_type_products_list = {
			id:"no_part_type_product_list",
			view:"list",
			template:"<div>#product_info#</div>",
			type:{height:35,width:250},
			select:true,
			on:{"onItemClick":function(id, e, node){
				var item = this.getItem(id);
				$$("price").setValue(item['price']);
				$$("product_name").setValue(item['product_name']);
				$$("product_info").setValue(item['product_info']);
				$$("product_type").setValue(item['product_id']);
				$$("labour_price").setValue(item['labour_price']);
				$$("part_type").setValue(item['part_type']);
				$$('unit_count').setValue(item['unit_count']);
				count_total_price();
			}}
		};
		
		var count_total_price = function(){
			var count = base.toNum($$('unit_count').getValue());
			var price = base.toNum($$('price').getValue());
			var labour_price = $$('labour_price').getValue();
			var totalprice = (count*price)+(labour_price*1);
			if(totalprice==""){
				totalprice = 0;
			}
			$$('total_price').setValue(totalprice);
		};
		
		var submit_form_ui = {
					view:"form", 
					id:"order_product_form",
					elements:[
							    {view:"text",name:"product_type",id:"product_type",hidden:true},
							    {view:"text",name:"part_type",id:"part_type",hidden:true},
							    {view:"text",name:"product_name",id:"product_name",label:"商品名称",placeholder:"商品名称",disabled:true,on:{
									onTimedKeyPress:function(){
										var value = this.getValue().toLowerCase();
										$$("no_part_type_product_list").filter(function(obj){
											return obj.product_info.toLowerCase().indexOf(value) >= 0;
										});
									}
								}},
							    {view:"text",name:"product_info",id:"product_info",hidden:true},
								{ view:"text", name:"unit_count",id:"unit_count", label:"数量",keyPressTimeout:100, on:{"onTimedKeyPress":function(){
									count_total_price();
								}}},
								{ view:"text", name:"price",id:"price", label:"单价" ,disabled:true,keyPressTimeout:100,on:{"onTimedKeyPress":function(){
									count_total_price();
								}}},
								{ view:"text", name:"labour_price",id:"labour_price", label:"工时费",disabled:true,keyPressTimeout:100,on:{"onTimedKeyPress":function(){
									count_total_price();
								}}},
								{ view:"text",name:"total_price",id:"total_price",label:"总价",disabled:true},
								{ view:"text",name:"user_defined",id:"user_defined",hidden:true},
								{
									margin:10,
									cols:[
										{},
										{ view:"button", label:"确定", type:"form", align:"center", width:120, click:function(){
											if (!$$("order_product_form").validate()){
												webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
												return ;
											}
											var data = $$("order_product_form").getValues();
											if(data.product_name===""){
												webix.message({ type:"error", text:"商品名称不能为空" });
												return;
											}
											data.user_defined="false";
											if(data.part_type===""){
												data.user_defined="true";
												var arr = data.product_info.split("_");
												if(arr.length>0){
													arr.pop();
													arr.push(data.product_name);
													data.product_info = arr.join("_");
												}else{
													data.product_info = data.product_name;
												}
												
											}
											$$("order_product_form").parse(data);
											$$('order_product_form').save();
											if(typeof(priceCallBack)==="function"){
												priceCallBack();
											}
											webix.$$("product_win").close();
										}},
										{ view:"button", label:"取消",align:"center", width:120, click:function(){
											webix.$$("product_win").close();
										}}
									]
								}
							],
					rules:{
						"product_name":webix.rules.isNotEmpty,
						"unit_count":webix.rules.isNumber,
						"price":webix.rules.isNumber,
						"labour_price":webix.rules.isNumber
					}
			};
		
		var layout = {
			view:"window", 
			id:"product_win",
			position:"center",
			head:"添加商品",
			modal:true, 
			body:{
				type:"space",
				rows:[{type:"space",cols:[]}]
			}
		};
		
		if(user_defined === true || user_defined === 'true'){//是否显示商品列表
			layout.body.rows[0].cols.push(no_part_type_products_list);
		}else{
			layout.body.rows[0].cols.push(products_list);
		}
		layout.body.rows[0].cols.push(submit_form_ui);
		return layout;
	};

	/**
	 * 非自定义商品
	 * @param data
	 */
	var init_products = function(){
		/*console.log(data);
		var item = data['optional_products'];
		for(var i=0;i<item.length;i++){
			for(var j=0;j<item[i]['products'].length;j++){
				var obj = item[i]['products'][j];
				obj.part_type = item[i].part_type;
				obj.product_info = obj.product_categories.join('_')+'_'+obj.product_name;
				$$("product_list").add(obj);
			}
		}*/

		base.getReq("meta_model_part_product.json/"+carModelId,function(item){
			for(var i=0;i<item.length;i++){
				var obj = item[i];
				obj.product_info = obj.category_name+'_'+obj.product_name;
				if(obj.recommended){
					obj.product_info += "(推荐)"
				}
				$$("product_list").add(obj);
			}
		});
	};

	/**
	 * 自定义商品
	 * @param data
	 */
	var init_no_type_products = function(){
		base.getReq("car_model_rest_part_products.json/"+carModelId,function(item){
			for(var i=0;i<item.length;i++){
				var obj = item[i];
				obj.product_info = obj.product_category_name+'_'+obj.product_name;
				obj.unit_count = 1;
				obj.labour_price = 0;
				$$("no_part_type_product_list").add(obj);
			}
		});
	};
	
	var config_form_type = function(bedit,user_define){
		$$("unit_count").enable();
		if(user_define ===true || user_define === "true"){
			$$("product_name").enable();
			$$("labour_price").enable();
			init_no_type_products();
		}else{
			init_products();
		}
		if(bedit){
			$$("price").enable();
		}
		$$("labour_price").setValue(0);
		$$("unit_count").setValue(0);
		$$("price").setValue(0);
	};
	
	var add_price_callback = function(fuc){
		priceCallBack = fuc;
	};
	
	return {
		$ui:create_from,
		$init_products:init_products,
		$init_no_type_products:init_no_type_products,
		$config_form_type:config_form_type,
		$addPriceCallBack:add_price_callback
	};

});