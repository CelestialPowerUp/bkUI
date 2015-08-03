/**
 * 车系添加和编辑
 */
define(["views/modules/base",
        "views/modules/upload",
		"models/base_data"],function(base,upload,data_store){
	//车品牌下拉列表
	var win_car_brand_type_select = function(){
		base.getReq("meta_brands.json",function(brands){
			var list = $$("win_car_brand_type").getPopup().getList();
			list.clearAll();
			for(var i=0;i<brands.length;i++){
				list.add({id:brands[i].brand_type,value:brands[i].brand_name});
			}
			if(re_car_brand_type){
				$$("win_car_brand_type").setValue(re_car_brand_type);
				re_car_brand_type = null;
				$$("win_car_brand_type").refresh();
			}
		});
	};
	//车系下拉列表
	var win_car_category_type_select = function(brand_type){
		var list = $$("win_car_category_type").getPopup().getList();
		list.clearAll();
		$$("win_car_category_type").setValue();
		if(brand_type){
			base.getReq("meta_categories.json?brand_type="+brand_type,function(categorys){
				for(var i=0;i<categorys.length;i++){
					list.add({id:categorys[i].category_type,value:categorys[i].category_name});
				}
				if(re_car_category_type){
					$$("win_car_category_type").setValue(re_car_category_type);
					re_car_category_type = null;
					$$("win_car_category_type").refresh();
				}
			});
		}
	};

	var reset_value = function(){
		re_car_brand_type = null;
	}

	//回显车品牌下拉框值
	var re_car_brand_type = null;
	var re_car_category_type = null;

	var submit_callback = null;
	var req_url = "meta_car/create.json";

	var submit_form_ui = {
			view:"form", 
			id:"post_form",
			width:700,
			minHeight:500,
			scroll:true,
			elements:[
						{
							rows:[
								{ template:"基本信息", type:"section"},
								{
									cols:[
										{ rows:[
											{view:"text",id:"brand_type",name:"brand_type",hidden:true},
											{view: "richselect", name: "win_car_brand_type",id:"win_car_brand_type",options:[],label:"品牌",labelWidth:100,placeholder:"选择品牌",
												on:{"onAfterRender":function(){
													win_car_brand_type_select();
												},
													"onChange":function(brand_type){
														win_car_category_type_select(brand_type);
														$$("brand_type").setValue(brand_type);
													}}
											},
											{view:"text",id:"category_type",name:"category_type",hidden:true},
											{view: "richselect", name: "win_car_category_type",id:"win_car_category_type",options:[],label:"车系",labelWidth:100,placeholder:"选择车系",
												on:{
													"onChange":function(n){
														$$("category_type").setValue(n);
													}
												}
											},

											{view:"text",id:"model_type",name:"model_type",hidden:true},
											{view:"text",name:"model_name",id:"model_name",label:"名称",labelWidth:100,placeholder:"请输入名称"},
											{view:"text",name:"engine_displacement",id:"engine_displacement",label:"排量",labelWidth:100,placeholder:"请输入排量"}
										]},
										{ rows:[
											{view:"text",name:"production_year",id:"production_year",label:"年款",labelWidth:100,placeholder:"请输入年款"},
											{view:"text",name:"producer",id:"producer",label:"厂商",labelWidth:100,placeholder:"请输入厂商"},
											{view:"text",name:"engine_oil_amount",id:"engine_oil_amount",label:"机油用量",labelWidth:100,placeholder:"请输入机油用量"},
											{view:"text",name:"first_maintenance_miles",id:"first_maintenance_miles",label:"首保公里数",labelWidth:100,placeholder:"请输入首保公里数"}
										]}
									]
								},
								{ template:"部件信息", type:"section"},
								{
									cols:[
										{ view:"button", label:"确定", align:"center",  click:function(){
											if (!$$("post_form").validate()){
												webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
												return ;
											}
											var post_data = {
												base_msg:{},
												parts:[]
											};
											//基本信息
											var form_data = $$("post_form").getValues();
											post_data.base_msg = form_data;
											//部件信息
											var part_types = data_store.$car_part_type;
											for(var i=0;i<part_types.length;i++){
												var part_form_data = $$("part_form_"+part_types[i].id).getValues();
												post_data.parts.push(part_form_data);
											}
											base.postReq(req_url,post_data,function(data){
												if(typeof(submit_callback)==='function'){
													submit_callback();
												}
												webix.$$("meta_car_model_win").close();
											});
										}},
										{ view:"button", label:"取消",align:"center",  click:function(){
											webix.$$("meta_car_model_win").close();
										}}
									]
								}
							]
						}

					],
			rules:{
				"brand_type":webix.rules.isNotEmpty,
				"category_type":webix.rules.isNotEmpty,
				"model_name":webix.rules.isNotEmpty,
				"engine_displacement":webix.rules.isNotEmpty,
				"production_year":webix.rules.isNumber,
				"engine_oil_amount":webix.rules.isNumber,
				"first_maintenance_miles":webix.rules.isNumber
			}
	};

	var layout = {
			id:"meta_car_model_win",
			view:"window", 
			//modal:true,
			position:"center",
			head:"添加车型",
			body:{
				type:"space",
				rows:[submit_form_ui]
			}
		};

	var create_ui=function(){
		var ui = layout;
		var rowsItem = submit_form_ui.elements[0].rows;
		var lastView = rowsItem.pop();
		//添加部件元素
		var part_types = data_store.$car_part_type;
		for(var i=0;i<part_types.length;){
			var arrayLength = part_types.length;
			if((i%2)==0){
				//创建列组
				var cols_item = {
					id:Math.random(),
					view:"layout",
					borderless:false,
					cols:[
					]
				};
				//添加具体部件
				var count = 1;
				while(count<=2 && i<arrayLength){
					var current_part = part_types[i];
					var c_id = current_part.id;
					var c_value = current_part.value;
					var part_component = {
						id:"part_form_"+c_id,
						view:"form",
						cols:[
							{view:"label",width:100,template:c_value},
							{
								rows:[
									{view:"text",name:"id",id:"id"+c_id,hidden:true},
									{view:"text",name:"part_type",id:"part_type"+c_id,hidden:true,value:c_id},
									{view:"text",name:"part_name",id:"part_name"+c_id,hidden:true,value:c_value},
									{view:"text",name:"cycle_miles",id:"cycle_miles"+c_id,placeholder:"保养周期公里数",value:"0"},
									{view:"text",name:"cycle_days",id:"cycle_days"+c_id,placeholder:"保养周期天数",value:"0"},
									{view:"text",name:"labour_price",id:"labour_price"+c_id,placeholder:"工时费",value:"0"}
								]
							}
						]
					};
					cols_item.cols.push(part_component);
					i++;
					count++;
				}
				if(count==2){
					part_component = {
						id:"part_form_"+c_id+"_"+Math.random(),
						view:"layout",
						borderless:false,
						cols:[
							{}
						]
					};
					cols_item.cols.push(part_component);
				}
				rowsItem.push(cols_item);
			}
		}
		//添加操作按钮
		rowsItem.push(lastView);
		return ui;
	};

	var add_submit_callback = function(callback){
		if(typeof(callback)==='function'){
			submit_callback = callback;
		}
	};
	
	var bind_data = function(item){
		$$("post_form").parse(item);

		//根据车型ID获取车型信息回显表单
		if(item && item.model_type){
			var model_info = null;
			base.getReq("meta_car/"+item.model_type,function(data){
				model_info = data;
				//回显车型基本信息
				$$("post_form").parse(model_info.base_msg);
				//回显车型部件信息
				var parts_data =  model_info.parts;
				for(var i=0;i<parts_data.length;i++){
					var part_type = parts_data[i].part_type;
					var part_form = $$("part_form_"+part_type);
					if(part_form){
						$$("cycle_miles"+part_type).setValue(parts_data[i].cycle_miles);
						$$("cycle_days"+part_type).setValue(parts_data[i].cycle_days);
						$$("labour_price"+part_type).setValue(parts_data[i].labour_price);

					}
				}

				//根据车型ID获取车系信息
				if(model_info && model_info.base_msg.category_type){
					base.getReq("meta_category/"+model_info.base_msg.category_type,function(data){
						re_car_brand_type = data.brand_type;
						re_car_category_type = data.category_type;
						//回显所属车品牌和车系
						//$$("win_car_brand_type").setValue(re_car_brand_type);
						win_car_brand_type_select();
					});
				}
			});
		}
	};
	var set_req_url = function(url){
		req_url = url;
	};
	
	return {
		$ui:create_ui(),
		$add_submit_callback:add_submit_callback,
		$bind_data:bind_data,
		$set_req_url:set_req_url,
		$reset_value:reset_value
	}
});