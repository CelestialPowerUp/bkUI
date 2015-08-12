define(["views/modules/base"],function(base){
	
	var submit_callback = null;
	
	var update_category_type_select = function(selected){
		base.getReq("meta_product_categorys.json",function(data){
			var list = $$("product_category_type").getPopup().getList();
			list.clearAll();
			for(var i=0;i<data.length;i++){
				list.add({id:data[i]['current_category_type'],value:data[i]['current_category_name']});
			}
			if(typeof(selected)!='undefined'){
				$$("product_category_type").setValue(selected);
				$$("product_category_type").refresh();
			}
		});
	};
	
	var update_brand_type_select = function(selected){
		base.getReq("meta_product_brands.json",function(data){
			var list = $$("product_brand_type").getPopup().getList();
			list.clearAll();
			for(var i=0;i<data.length;i++){
				list.add({id:data[i]['product_brand_type'],value:data[i]['product_brand_name']});
			}
			if(typeof(selected)!='undefined'){
				$$("product_brand_type").setValue(selected);
				//$$("product_brand_type").refresh();
			}
		});
	};
	
	var base_info_ui = {
			id:"product_base_info_form",
			view:"form",
			elements:[
				{view: "richselect", name: "product_category_type",id:"product_category_type",label:"商品分类",options:[],placeholder:"选择商品分类",width:250,
					on:{
						"onAfterRender":function(){update_category_type_select()},
						"onChange":function(n,o){
							base.getReq("meta_product_category.json/"+n,function(data){
								var attributes = data.attributes;
								$$("property_data").clearAll();
								for(var i=0;i<attributes.length;i++){
									$$("property_data").add(attributes[i]);
								}
							});
						}
					}
				},
				{view: "richselect", name: "product_brand_type",id:"product_brand_type",label:"商品品牌",options:[],placeholder:"选择商品品牌",width:250,
					on:{
						"onAfterRender":function(){update_brand_type_select()}
					}
				},
				{view:"text",name:"product_name",label:"名称",placeholder:"请输入商品名称"},
				{view:"text",name:"cost",label:"成本价",placeholder:"请输入成本价",},
				{view:"text",name:"price",label:"零售价",placeholder:"请输入零售价",},
				],
				rules:{
					"product_category_type":webix.rules.isNotEmpty,
					"product_brand_type":webix.rules.isNotEmpty,
					"product_name":webix.rules.isNotEmpty,
					"cost":webix.rules.isNotEmpty,
					"price":webix.rules.isNotEmpty
				}
	};
	
	var property_info_ui = {
			id:"property_data",
			view:"datatable",
			headerRowHeight:25,
			scrollY:true,
			columns:[{ id:"name",header:"属性名称", width:150},
    				{ id:"value",header:"属性值",editor:"text",width:100}
			],
			editable:true,
			editaction:"dblclick",
			autoheight:true,
			autowidth:true,
			select:true,
			data: [],
			rules:{
				"name":webix.rules.isNotEmpty,
				"value":webix.rules.isNotEmpty
			}
	};
	
	var button_ui = {cols:[{},
	                       {view:"button", label:"确定", align:"center", width:120, click:function(){
	                    	   if (!$$("product_base_info_form").validate()||!$$("property_data").validate()){
		       						webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
		       						return ;
	       						}
	                    	   var param = {"product":$$("product_base_info_form").getValues(),properties:$$("property_data").serialize()};
	                    	   console.log(param);
	                    	   base.postReq("meta_product.json",param,function(data){
	                    		   submit_callback();
	                    	   });
	                    	   $$("win_ui").close();
	                       }},
	                       {view:"button", label:"取消", align:"center", width:120, click:function(){
	                    	   $$("win_ui").close();
	                       }},
                       ]}; 
	
	var win_ui = {
			id:"win_ui",
			view:"window",
			modal:true,
			position:"center",
			head:"添加商品",
			body:{
				type:"space",
				rows:[{type:"clean",
					cols:[base_info_ui,property_info_ui]
				},button_ui]
			}
	};
	
	var add_submit_callback = function(callback){
		submit_callback = callback;
	};
	
	var bind_data = function(data){
		base.getReq("meta_product.json/"+data,function(resp){
			update_category_type_select(resp.product.product_category_type);
			update_brand_type_select(resp.product.product_brand_type);
			$$("product_base_info_form").parse(resp.product);
			$$("property_data").clearAll();
			var attributes = resp.properties;
			for(var i=0;i<attributes.length;i++){
				$$("property_data").add(attributes[i]);
			}
		});
	};
	
	return {
		$ui:win_ui,
		$add_submit_callback:add_submit_callback,
		$bind_data:bind_data
	};
});