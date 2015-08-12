define(["views/modules/base"],function(base){
	
	var submit_callback = null;
	
	var type_option = [{id:"type_string",value:"字符串"},
	                   {id:"type_number",value:"数字"},
	                   {id:"type_datetime",value:"日期时间"}];
	
	var columns = [
	               	{ id:"property_id",header:"属性名称",hidden:true},
    			    { id:"name",header:"属性名称",editor:"text", width:150},
    				{ id:"type",header:"类型",editor:"select",options:type_option,width:100},
    				{ id:"unit",header:"单位",editor:"text",width:80},
    				{ id:"describes",editor:"text",editor:"text",header:"属性说明",width:250},
    				{ id:"option",header:"操作", width:80, template:"<span  style='color:#777777; cursor:pointer;'><u class='delete'>删除</u></span>"}
    			];
	
	var category_attributes = {
			id:"category_atrributes_data",
			view:"datatable",
			columns:columns,
			editable:true,
			editaction:"dblclick",
			autoheight:true,
			autowidth:true,
			select:true,
			data: [],
			onClick:{
				"delete":function(e, id, trg){
					var item = $$("category_atrributes_data").getItem(id);
					$$("category_atrributes_data").remove(id);
				}
			},
			rules:{
				"name":webix.rules.isNotEmpty,
				"type":webix.rules.isNotEmpty,
				"unit":webix.rules.isNotEmpty
			}
	      };
	
	var category_attributes_ui = {rows:[{view:"button", label:"添加属性", align:"left", width:120,click:function(){
										$$("category_atrributes_data").add({name:"",type:"",unit:"",describes:""});
									}},
                                    category_attributes]};
	
	var supplier_radio = { view:"radio", name:"supplier_type_id",id:"supplier_type_id", label:"服务商", vertical:false, options:[
             				{ value:"修理厂", id:1 },
             				{ value:"4S店", id:2 },
             				{ value:"美容店", id:3 }
             			] };
	
	var button_ui = {
			margin:10,
			cols:[
				{},
				{ view:"button", label:"确定", align:"center", width:120, click:function(){
					if (!$$("category_form2").validate()||!$$("category_atrributes_data").validate()){
						webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
						return ;
					}
					var formdata = $$("category_form2").getValues();
					var propertys = $$("category_atrributes_data").serialize();
					var supplier = $$("supplier_type_id").getValue();
					if(supplier==null){
						webix.message({type:"error", text:"请选择一个服务商"});
						return ;
					}
					formdata.supplier_type_id = supplier;
					var param = {product_category:formdata,attributes:propertys};
					console.log(param);
					base.postReq("meta_product_category.json",param,function(data){
						webix.message("添加成功");
						if(typeof(submit_callback)==='function'){
							submit_callback();
						}
						webix.$$("category_win").close();
					});
				}},
				{ view:"button", label:"取消",align:"center", width:120, click:function(){
					webix.$$("category_win").close();
				}}
			]
		};
	
	var uodate_parent_category_data = function(selected){
		base.getReq("meta_product_categorys.json?level=1",function(data){
				var list = $$("parent_category_type").getPopup().getList();
				list.clearAll();
				for(var i=0;i<data.length;i++){
					list.add({id:data[i]['current_category_type'],value:data[i]['current_category_name']});
				}
				if(typeof(selected)!='undefined'){
					$$("parent_category_type").setValue(selected);
					//$$("parent_category_type").refresh();
				}
			});
	};
	
	var category_form1 = {
			view:"form", 
			id:"category_form1",
			elements:[
					    {view:"text",name:"category_name",label:"一级分类名称",placeholder:"找不到一级分类在这添加"},
					    {
							margin:10,
							cols:[
								{},
								{ view:"button", label:"确定", align:"center", width:80, click:function(){
									if (!$$("category_form1").validate()){
										webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
										return ;
									}
									var formdata = $$("category_form1").getValues();
									var param = {product_category:formdata};
									base.postReq("meta_product_category.json",param,function(data){
										webix.message("一级分类添加成功");
										uodate_parent_category_data();
									});
								}}
							]
						}
					],
			rules:{
				"category_name":webix.rules.isNotEmpty
			},
			elementsConfig:{
				labelPosition:"left",
				labelWidth:120
			}
		};
	
	var category_form2 = {
			view:"form", 
			id:"category_form2",
			elements:[
		          		{view:"text",name:"current_category_type",hidden:true},
					    {view: "richselect", name: "parent_category_type",id:"parent_category_type",label:"一级分类",options:[],placeholder:"选择一级分类",width:250,
		          			on:{"onAfterRender":function(){
		          				uodate_parent_category_data();
		          			}}},
					    {view:"text",name:"category_name",label:"二级分类",placeholder:"输入二级分类名称"},
					],
			rules:{
				"category_name":webix.rules.isNotEmpty,
				"parent_category_type":webix.rules.isNotEmpty
			},
		}
	
	var submit_form_ui = {type:"space",cols:[category_form2,category_form1]};
	
	var layout = {
			id:"category_win",
			view:"window", 
			modal:true, 
			position:"center",
			head:"添加商品类别",
			body:{
				type:"space",
				rows:[submit_form_ui,category_attributes_ui,supplier_radio,button_ui]
			}
		};
	
	var add_submit_callback = function(callback){
		if(typeof(callback)==='function'){
			submit_callback = callback;
		}
	};
	
	var bind_data = function(item_id){
		base.getReq("meta_product_category.json/"+item_id,function(data){
			uodate_parent_category_data(data['parent_category_type']);
			$$("category_form2").parse(data['product_category']);
			$$("supplier_type_id").setValue(data['product_category']['supplier_type_id']);
			$$("supplier_type_id").refresh();
			
			var attributes = data.attributes;
			$$("category_atrributes_data").clearAll();
			for(var i=0;i<attributes.length;i++){
				$$("category_atrributes_data").add(attributes[i]);
			}
			console.log(data);
		});
	};
	
	return {
		$ui:layout,
		$add_submit_callback:add_submit_callback,
		$bind_data:bind_data
	}
});