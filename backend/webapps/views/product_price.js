define(["views/modules/base",
        "models/base_data",
        "views/forms/car_model_product"],function(base,data_store,model_product){
	
	var car_brand_type_select = function(){
		base.getReq("meta_brands.json",function(brands){
			var list = $$("car_brand_type").getPopup().getList();
			list.clearAll();
			$$("car_brand_type").setValue();
			for(var i=0;i<brands.length;i++){
				list.add({id:brands[i].brand_type,value:brands[i].brand_name});
			}
		});
	};
	
	var car_category_type_select = function(brand_type){
		var list = $$("car_category_type").getPopup().getList();
		list.clearAll();
		$$("car_category_type").setValue();
		if(typeof(brand_type)==='undefined'){
			return;
		}
		base.getReq("meta_categories.json?brand_type="+brand_type,function(categorys){
			for(var i=0;i<categorys.length;i++){
				list.add({id:categorys[i].category_type,value:categorys[i].category_name});
			}
		});
	};
	
	var car_model_id_select = function(category_type){
		var list = $$("car_model_id").getPopup().getList();
		list.clearAll();
		$$("car_model_id").setValue();
		if(typeof(category_type)==='undefined'){
			return;
		}
		base.getReq("meta_cars.json?category_type="+category_type,function(cars){
			for(var i=0;i<cars.length;i++){
				list.add({id:cars[i].model_type,value:"[ "+cars[i].production_year+" "+cars[i].producer+" ] "+cars[i].car_model_Name});
			}
		});
	};
	
	var update_item_by_car_model = function(car_model){
		if(typeof(car_model)==='undefined'){
			return ;
		}
		base.getReq("meta_model_part_product.json/"+car_model,function(model_infos){
			var part_types = data_store.$car_part_type;
			for(var i=0;i<part_types.length;i++){
				$$("part_type_"+part_types[i].id).clearAll();
			}
			for(var j=0;j<model_infos.length;j++){
				$$("part_type_"+model_infos[j].part_type).add(model_infos[j]);
			}
		});
	};
	
	var update_item_by_car_model = function(car_model){
		if(typeof(car_model)==='undefined'){
			return ;
		}
		base.getReq("meta_model_part_product.json/"+car_model,function(model_infos){
			var part_types = data_store.$car_part_type;
			$$("products_data").clearAll();
			for(var i=0;i<model_infos.length;i++){
				model_infos[i].checked = 0;
				model_infos[i].amount=get_amount(model_infos[i]);
				model_infos[i].count_price = model_infos[i].price*model_infos[i].amount+model_infos[i].labour_price;
				$$("products_data").add(model_infos[i]);
			}
		});
	};
	
	var get_amount = function(model_info){
		if(model_info.part_type===9){
			return model_info.oil_amount;
		}
		return 1;
	};
	
	var custom_checkbox = function(obj, common, value){
		if (value)
			return "<div class='webix_table_checkbox checked'> 是 </div>";
		else
			return "<div class='webix_table_checkbox notchecked'> 否 </div>";
	};
	
	var data_table = {
			id:"products_data",
			view:"datatable",
			columns:[
						{ id:"checked", header:"选择", template:custom_checkbox, width:80},
						{ id:"product_name",sort:"string", header:"商品",width:200},
						{ id:"category_name",sort:"string", header:"类型",width:200},
						{ id:"part_name",sort:"string", header:"部件",width:200},
						{ id:"price",  header:"单价" , width:80},
						{ id:"amount",  header:"用量" , width:80},
						{ id:"labour_price",	header:"工时费", 	width:100},
						{ id:"count_price",	header:"合计", 	width:100}
					],
			autoheight:true,
			autowidth:true,
			editable:true,
			checkboxRefresh:true,
			data:[],
			on:{"onAfterRender":function(){
				update_count_price();
			}}
	};
	
	var update_count_price = function(){
		var result = {};
		result.total_price=0;
		result.add_service_price = 0;
		result.repair_price = 0;
		$$("products_data").eachRow(function(row){
			var item = $$("products_data").getItem(row);
			if(item.checked===1){
				result.total_price += item.count_price*1;
			}
		});
		result.repair_price = result.total_price*0.9;
		result.repair_price = result.repair_price.toFixed(2);
		if(typeof($$("total_price"))!='undefined'){
			result.add_service_price = result.total_price+69;
			$$("total_price").parse(result);
		}
		if(typeof($$("repair_shop_price"))!="undefined"){
			$$("repair_shop_price").parse(result);
		}
	};
	
	var price_count_ui = {
			id:"total_price",
			width:300,
			height:50,
			template:"<div>"+
			  "<div class='big_strong_text'>总价(商品价格+服务费69)：#total_price#&nbsp;&nbsp;+&nbsp;&nbsp;69&nbsp;&nbsp;=&nbsp;&nbsp;#add_service_price#</div>",
			data:{total_price:0.00,add_service_price:0.00}
	};
	
	var repair_shop_price_ui = {
			id:"repair_shop_price",
			width:300,
			height:50,
			template:"<div>"+
			  "<div class='big_strong_text'>修理厂价格（商品价格 X 90%）：#total_price#&nbsp;&nbsp;X&nbsp;&nbsp;90%&nbsp;&nbsp;=&nbsp;&nbsp;#repair_price#</div>"+"</div>",
			data:{total_price:0.00,repair_price:0.00}
	};
	
	var controll_ui = {
			align:"center",
			margin:10,
			cols:[
						{view: "richselect", name: "car_brand_type",id:"car_brand_type",label:"品牌:",labelWidth:45,options:[],placeholder:"选择商品",width:250,
								on:{"onAfterRender":function(){
										car_brand_type_select();
									},
									"onChange":function(n,o){
										car_category_type_select(n);
									}}
						},
						
						{view: "richselect", name: "car_category_type",id:"car_category_type",label:"车系:",labelWidth:45,options:[],placeholder:"选择车系",width:250,
							on:{"onAfterRender":function(){
							},
							"onChange":function(n,o){
								car_model_id_select(n);
							}}
						},
						{view: "richselect", name: "car_model_id",id:"car_model_id",label:"车型:",labelWidth:45,options:[],placeholder:"选择车型",width:525,
							on:{"onAfterRender":function(){
								
							},
							"onChange":function(n,o){
								update_item_by_car_model(n);
							}}
						},{}
                     ]};
	
	var body = {
			type:"space",
			rows:[controll_ui,{cols:[{rows:[data_table,price_count_ui,repair_shop_price_ui]},{}]}]};

	var create_item_ui = function(){
		
		var ui = webix.copy(body);
		
		return ui;
	};
	
	var template_ui = function(){
		var item = {type:"space",cols:[item_lable,{margin:10,rows:[]},{}]};
		item.cols[1].rows.push(item_button);
		item.cols[1].rows.push(item_list);
		return item;
	}
	
	var layout = create_item_ui();
		
	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "车型商品", details: "车型商品关系管理"});
		}
	};
});