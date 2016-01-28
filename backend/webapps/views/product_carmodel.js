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
						{view: "richselect", name: "car_model_id",id:"car_model_id",label:"车型:",labelWidth:45,options:[],placeholder:"选择车型",width:520,
							on:{"onAfterRender":function(){
								
							},
							"onChange":function(n,o){
								update_item_by_car_model(n);
							}}
						},{}
                     ]};
	
	var item_button = {view:"button",width:120,click:function(){
		var carmodel = $$("car_model_id").getValue();
		if(typeof(carmodel) === 'undefined' || carmodel===null || carmodel === ""){
			webix.message({type:"error",text:"请选择一个车系"});
			return ;
		}
		var part_type = this.getValue().split("#")[0];
		var part_name = this.getValue().split("#")[1];
		this.$scope.ui(model_product.$ui).show();
		model_product.$init_data($$("part_type_"+part_type).serialize(),part_name);
		model_product.$add_callback(function(datas){
			$$("part_type_"+part_type).clearAll();
			for(var i=0;i<datas.length;i++){
				$$("part_type_"+part_type).add(datas[i]);
			}
		});
	}};
	
	var item_lable = {view:"label",label:"机滤",width:120};
	
	var item_list_type = {
            height: 30,
			marker: function(obj){
				return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
			},
			check:  webix.template('<div style="float:right;"><span class="webix_icon_btn fa-{obj.recommended?check-:}square-o list_icon" style="max-width:32px;"></span><span class="list_text">是否推荐</span></div>'),
			template: function(obj,type){
				return "<div><span class='list_text'>"+obj.product_name+"</span>"+type.check(obj)+"</div>";
			}
	};
	
	var item_list = {view: "list",css: "tasks_list",
  			height:150,
  			width:580,
  			type: item_list_type,
  			data: [],
  			on: {
  				onItemClick:function(id){
  					var item = this.getItem(id);
  					item.recommended = !item.recommended;
  					this.refresh(id);
  				}
  			}
  	};
	
	var body = {
			type:"space",
			rows:[controll_ui]};
	

	var submit_click = function(){
		var part_types = data_store.$car_part_type;
		var submit_datas = [];
		var carmodel = $$("car_model_id").getValue();
		if(typeof(carmodel) === 'undefined' || carmodel===null || carmodel === ""){
			webix.message({type:"error",text:"请选择一个车型"});
			return;
		}
		for(var i=0;i<part_types.length;i++){
			var datas = $$("part_type_"+part_types[i].id).serialize();
			for(var j=0;j<datas.length;j++){
				datas[j]['car_model_id'] = carmodel;
				datas[j].part_type = part_types[i].id;
				datas[j].part_name = part_types[i].value;
				submit_datas.push(datas[j]);
			}
		}
		base.postReq("meta_model_part_product/update.json",submit_datas,function(data){
			webix.message("数据更新成功");
		});
	};

	var button_ui ={view:"button",label:"提交数据",click:function(){
		submit_click();
	}};
	
	var create_item_ui = function(){
		
		var ui = webix.copy(body);
		
		var part_types = data_store.$car_part_type;
		ui.rows.push(webix.copy(button_ui));
		for(var i=0;i<part_types.length;i++){
			var item_l = webix.copy(item_list);
			item_l.id = "part_type_"+part_types[i].id;
			var item_b = webix.copy(item_button);
			
			item_b.label = "选"+part_types[i].value
			item_b.value = part_types[i].id+"#"+part_types[i].value;
			
			var item_lable = {view:"label",label:part_types[i].id+"."+part_types[i].value,width:120};
			
			var item = {type:"space",cols:[item_lable,{margin:10,rows:[]},{}]};
			
			item.cols[1].rows.push(item_b);
			item.cols[1].rows.push(item_l);
			ui.rows.push(item);
		}
		ui.rows.push(webix.copy(button_ui));
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