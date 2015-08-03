define(["views/modules/base",
        "../../models/base_data"],function(base,base_data){
	
	var create_from = function(user_id,callback){
		
		base.getReq("/meta_brands.json",function(data){
			for(var i=0;i<data.length;i++){
				$$("brand_list").clearAll();
				for(var i=0;i<data.length;i++){
					$$("brand_list").add(data[i]);
				}
			}
		});
		
		var car_type_tab = {rows:[
			{
                borderless:true, view:"tabbar", id:'car_type_choose', value: 'brand_list', multiview:true, options: [
                    { value: '品牌>', id: 'brand_list'},
                    { value: '车系>', id: 'category_list'},
                    { value: '车型', id: 'model_list'}
                ]
            },
            {
            	cells:[{
	            		id:"brand_list",
	            		view:"list",
	            		template:"<div>#brand_name#</div>",
	            		type:{height:35,width:250},
	            		select:true,
	            		on:{"onItemClick":function(id, e, node){
	            			var item = this.getItem(id);
	            			base.getReq("meta_categories.json?brand_type="+item.brand_type,function(data){
	            				if(data.length<=0){
	            					webix.message("该品牌下无车系");
	            					return;
	            				}
	            				$$("car_type_choose").setValue("category_list");
	            				$$("category_list").clearAll();
	            				for(var i=0;i<data.length;i++){
	            					$$("category_list").add(data[i]);
	            				}
	            			});
	            		}}
            		},
            		{
            			id:"category_list",
                		view:"list",
                		template:"<div>#category_name#</div>",
                		type:{height:35,width:250},
                		select:true,
                		on:{"onItemClick":function(id, e, node){
	            			var item = this.getItem(id);
	            			base.getReq("meta_cars.json?category_type="+item.category_type,function(data){
	            				if(data.length<=0){
	            					webix.message("该车系下无车型信息");
	            					return;
	            				}
	            				$$("car_type_choose").setValue("model_list");
	            				$$("model_list").clearAll();
	            				$$("model_type").setValue("");
	            				$$("model_text").setValue("");
	            				for(var i=0;i<data.length;i++){
									console.log(data[i]);
	            					$$("model_list").add(data[i]);
	            				}
	            			});
	            		}}
            		},
            		{
            			id:"model_list",
                		view:"list",
                		template:"<div>#production_year# #car_model_Name#</div>",
                		type:{height:35,width:250},
                		select:true,
                		on:{"onItemClick":function(id,e,node){
                			var item = this.getItem(id);
                			$$("model_type").setValue(item.model_type);
            				$$("model_text").setValue(item.brand_name+"->"+item.category_name+"->"+item.car_model_Name);
                		}}
            		}]
            }
		]};
		
		
		var submit_form_ui =  {
				paddingY:20, paddingX:30,
				elementsConfig:{labelWidth: 120}, 
				width:500,
				view:"form", 
				id:"car_model_form", 
				elements:[
				    {view:"text",name:"model_type",id:"model_type",hidden:true},
				    {view:"text",label:"车型",placeholder:"请在左侧选择车型",id:"model_text",readonly:true},
					{view:"richselect",label:"省份", name: "province",id:"province",value:"京", placeholder:"请选择省份", vertical: true,width:250, options:base_data.citys},
					{view:"text",label:"车牌号",name:"number"},
					{view:"datepicker", timepicker:true, label:"购买时间", name:"bought_time",id:"bought_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" },
					{view:"text",label:"行驶公里数",name:"miles"},
					{view:"text",label:"车架号",name:"chassis_number"},
					{view:"text",label:"发动机编号",name:"engine_number"}
				]
			 };
		
		var layout = {
				view:"window", 
				id:"car_model_win",
				position:"center",
				head:"添加车辆",
				modal:true, 
				body:{
					type:"space",
					rows:[{type:"space",cols:[car_type_tab,submit_form_ui]},
					      {type:"space",cols:[{view:"button",label:"添加",click:function(){
								var formdata = $$("car_model_form").getValues();
								formdata.licence={};
								formdata.licence.province = formdata.province;
								formdata.licence.number = formdata.number;
								formdata.bought_time = base.format_time(formdata.bought_time);
								formdata.user_id = user_id;
								console.log(formdata);
								base.postReq("cars/update.json",[formdata],function(data){
									webix.message("新增车型成功");
									if(typeof(callback)==='function'){
										callback(formdata);
									}
									webix.$$("car_model_win").close();
								});
						}},
						{view:"button",label:"取消",click:function(){
							webix.$$("car_model_win").close();
						}}
						]}
					      
					]
				}
			};
			return layout;
		};
		
	
	return {
		$ui:create_from,
		$oninit:function(app,config){
		}
	};

});