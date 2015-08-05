define(["views/modules/base",
        "views/forms/order_product",
        "views/modules/upload_img_win",
        "views/forms/order_supplier"],function(base,order_product,upload_img_win,order_supplier){
	
	var car_products = "";
	
	var uodate_car_keepers_data = function(current_keeper_id){
		base.getReq("car_keepers.json",function(data){
				var list = $$("current_keeper_id").getPopup().getList();
				list.clearAll();
				for(var i=0;i<data.length;i++){
					if(data[i]['lay_off']){
						continue;
					}
					list.add({id:data[i]['car_keeper_id'],value:data[i]['name']});
				}
				$$("current_keeper_id").setValue(current_keeper_id);
				$$("current_keeper_id").refresh();
			});
	};

	var update_sale_persion = function(sale_person){
		base.getReq("users_by_role_code.json?role_code=UserRoles_SaleUsers",function(data) {
			var list = $$("sale_person_id").getPopup().getList();
			list.clearAll();
			for (var i = 0; i < data.length; i++) {
				list.add({id: data[i]['id'], value: data[i]['user_name']});
			}
			$$("sale_person_id").setValue(sale_person);
			$$("sale_person_id").refresh();
		});
	}

	var get_check_keeper_param = function(){
		var form = $$("order_base_data").getValues();
		var param = {};
		param.order_id = form.id;
		param.user_id = form.current_keeper_id;
		param.start_time=base.format_time(form.pick_start_time);
		param.end_time = base.format_time(form.pick_end_time);
		return param;
	}

	var get_check_keeper_conflict_param = function(){
		var form = $$("order_base_data").getValues();
		var param = {};
		param.order_id = form.id;
		param.current_keeper_id = form.current_keeper_id;
		param.pick_start_time=base.format_time(form.pick_start_time);
		param.pick_end_time = base.format_time(form.pick_end_time);
		return param;
	}


	var check_conflict_order = function(){
		var param = get_check_keeper_conflict_param();
		var param_str = "";
		for(var p in param){
			if(typeof(p)==='function'){
				continue;
			}
			if(param[p] === null || param[p]===''){
				return;
			}
			param_str += (param_str.length>0?"&":"")+p+"="+param[p];
		}
		base.postReq("/v2/api/order/keeper_conflict",param,function(data){
			if(data && data.length>0){
				$$("pick_time_tip").show();
				$$("pick_time_tip").clearAll();
				webix.message({ type:"error",expire:5000,text:"管家当天时间冲突，请谨慎下单。"});
				for(var a=0;a<data.length;a++){
					var item = {};
					item.customer_info=data[a]['customer_phone_number']+"  "+data[a]['customer_name'];
					item.pick_time_info = data[a]['pick_time_segment'];
					$$("pick_time_tip").add(item);
				}
			}else{
				$$("pick_time_tip").hide();
				$$("pick_time_tip").clearAll();
			}
		});
	}

	var check_leave_keeper = function(){
		var param = get_check_keeper_param();
		for(var p in param){
			if(typeof(p)==='function'){
				continue;
			}
			if(param[p] === null || param[p]===''){
				return;
			}
		}
		base.postReq("user/is_leave.json",param,function(data){
			if(data.length>0){
				base.$msg.error("该管家在服务时间内已经请假，请选择其他管家");
			}
		});
	}
	
	var customer_base_info_ui = {
			type:"space",
			rows:[{type:"header",template:"客户基本信息"},
			      {type:"clean",cols:[{
					    view:"form",
						id: "order_base_data",
						elementsConfig:{
							labelWidth: 120
						},
						elements:[
						    {view:"text",id:"order_id",name:"id",hidden:true},
						    {view:"text",name:"user_id",hidden:true},
				          	{view: "text", label:"手机号",name:"phone_number", placeholder: "输入手机号",width:350,value:""},
				          	{view: "text",name: "contact_name",label:"姓名", placeholder: "姓名",width:350},
				          	{view: "richselect", name: "peer_source",label:"订单渠道",placeholder:"选择订单渠道",width:350,
				          		options:[
                                        {id:"backend", value: "后台"},
                           				{id:"xiaomi", value: "小米"},
                           				{id:"weixin", value: "微信"},
                           				{id:"guoqin", value: "国青"},
                           				{id:"alipay", value: "支付宝"},
                           				{id:"app",value:"app"}
                           			]},
                   			{view: "text", name: "car_id",id:"car_id",label:"车辆",value:"", hidden: true,width:250},
							{view: "text", name: "model_type",id:"model_type",label:"车模型",value:"", hidden: true,width:250},
							{view: "richselect", name: "sale_person_id",id:"sale_person_id",label:"销售渠道",options:[],placeholder:"选择销售渠道",width:350,
								on:{"onAfterRender":function(){

								}}
							},
                   			{view: "richselect", name: "current_keeper_id",id:"current_keeper_id",label:"接车管家",options:[],placeholder:"选择接车管家",width:350,
    		          			on:{
									"onChange":function(){
										//检测管家是否请假
										check_leave_keeper();
										//获取冲突数据
										check_conflict_order();
									}
								}
                   			},
							{
								margin:10,
								cols:[
								{view:"datepicker", timepicker:true, label:"预计接车时间：", name:"pick_start_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:350,
									on:{
										"onChange":function(){
											//检测管家是否请假
											check_leave_keeper();
											//获取冲突数据
											check_conflict_order();
										}
									}
								},
								{view:"datepicker", timepicker:true, label:"--", name:"pick_end_time",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250,
									on:{
										"onChange":function(){
											//检测管家是否请假
											check_leave_keeper();
											//获取冲突数据
											check_conflict_order();
										}
									}
								},
							]},
							/*{view:"datepicker", timepicker:true, label:"还车时间：", name:"give_back_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:350},*/
                   			{view:"textarea",name:"comment",label:"客户备注",placeholder:"客户备注",disabled:true},
                   			{view:"textarea",name:"product_comment",label:"商品备注",placeholder:"商品备注",disabled:true},
                   			{view:"textarea",name:"operator_comment",label:"客服备注",placeholder:"客服备注",width:500},
				          ]
			      },
			      {
			    	  rows:[
		             	{width:250,height:120,id:"car_model",template:"<div>" +
		             			"<div class='strong_text'>#car_licence#</div>" +
		             			"<div class='strong_text'>#brand##category#</div>"+
		             			"<div class='light_text'>#model#</div>" +
		             			"</div>",
		             			data:{car_licence:"",model:"",brand:"",category:""}},
						  {
							  id:"pick_time_tip",
							  view:"list",
							  height:220,
							  width:250,
							  hidden:true,
							  template:"<div class='strong_text'>#customer_info#</div><div class='light_text'>#pick_time_info#</div>",
							  type:{height:80,width:250},
							  select:false
						  }
			             ]},
			      {}]},
		      ]
	};
	
	var user_defined_option = {"true" : "自定义","false" : "非自定义"};
	
	var product_columns = [
						    { id:"product_type",header:"ID",hidden:true,width:150},
						    { id:"product_name",header:"名称",width:250,hidden:true},
							{ id:"product_info",header:"名称",width:250},
							{ id:"unit_count",header:"数量",width:100},
							{ id:"price",header:"单价",width:100},
							{ id:"labour_price",header:"工时费",width:100},
							{ id:"total_price",header:"价格",width:100},
							{ id:"pics",header:"图片",hidden:true},
							{ id:"user_defined",header:"自定义",options:user_defined_option},
							{ id:"trash", header:"图片", width:80, template:"<span  style='color:#777777; cursor:pointer;'><u class='links'>查看</u></span>"}
							//{ id:"trash", header:"操作", width:50, template:"<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
							
						];
	
	var product_table_on_event = {
			"onAfterAdd":function(id, index){
				//coutPrice();
			},"onAfterDelete":function(id){
				coutPrice();
			},
			"onItemDblClick":function(id, e, node){
				if(!($$("add_product_button").isEnabled())){
					webix.message({type:"error",text:"该订单已付款，不支持商品编辑"});
					return ;
				}

				var item = $$("order_product_datas").getItem(id);
				var carModelId = getModelId();
				if(carModelId != null){
					this.$scope.ui(order_product.$ui(item.user_defined,carModelId)).show();
					order_product.$config_form_type(true,item.user_defined);//是否是编辑项，是否是自定义商品
					order_product.$addPriceCallBack(coutPrice);//计算价格回调函数
					$$('order_product_form').bind('order_product_datas');
				}
		}};
	
	var product_onClick = {
			"webix_icon":function(e,id,node){
				webix.confirm({
					text:"删除该商品<br/> 确定?", ok:"是", cancel:"取消",
					callback:function(res){
						if(res){
							webix.$$("order_product_datas").remove(id);
						}
					}
				});
			},
			"links":function(e, id, trg){
				var item = $$("order_product_datas").getItem(id);
				this.$scope.ui(upload_img_win.$ui).show();
				upload_img_win.$addCallBack(function(data){
					item.pics = data.pics;
					item.pic_id =data.pics_id;
					webix.message("图片更新成功！！");
				});
				if(item.pics!=null){
					upload_img_win.$init_img(item.pics);
				}
			}
		};
	
	/*var pay_type_ui ={
			view: "list",
			css: "tasks_list",
			id:"pay_type_list",
			scroll:false,
			xCount:1,
			yCount:2,
			type: {
                height: 32,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					console.log(obj);
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.name+"</div>";
				}
			},
			data: [{pay_type:2,name:"线下支付"},{pay_type:1,name:"未付款支付"},],
			on: {
				onItemClick:function(id){
					var item = this.getItem(id);
					item.$check = !item.$check;
					this.refresh(id);
				}
			}
	};*/

	var getModelId = function(){
		var carModelId = $$("model_type").getValue();
		if(carModelId === null || carModelId === ""){
			base.$msg.error("车型信息获取失败");
			return null;
		}
		return carModelId;
	};
	
	var order_product_ui = {
			type:"space",
			rows:[{type:"header",template:"商品信息"},
			      {cols:[{view:"button",id:"add_product_button",label:"添加商品",width:105,click:function(){
					  var carModelId = getModelId();
					  if(carModelId != null){
						  this.$scope.ui(order_product.$ui(false,carModelId)).show();
						  order_product.$config_form_type(true,false);//是否是编辑项，是否是自定义商品
						  order_product.$addPriceCallBack(coutPrice);//计算价格回调函数
						  $$("order_product_datas").unselect();
						  $$('order_product_form').bind('order_product_datas');
					  }
			      }},
			      {view:"button",label:"自定义商品",id:"add_user_define_product_button",width:105,click:function(){
					  var carModelId = getModelId();
					  if(carModelId != null){
						  this.$scope.ui(order_product.$ui(true,carModelId)).show();
						  order_product.$config_form_type(true,true);//是否是编辑项，是否是自定义商品
						  order_product.$addPriceCallBack(coutPrice);//计算价格回调函数
						  $$("order_product_datas").unselect();
						  $$('order_product_form').bind('order_product_datas');
					  }
			      }},
			      {view:"button", id:"submit_product_button",algin:"right",label:"提交商品数据",width:105,click:function(){
			    	  var products = [];
					  $$("submit_product_button").disable();
			    	  var order = {id:$$("order_id").getValue(),products:products};
			    	  $$("order_product_datas").eachRow( 
	        			    function (row){ 
	        			        var item = $$("order_product_datas").getItem(row);
	        			        products.push(item);
	        			    }
		        		)
		        	  var pay_type = $$("pay_type").getValue();
			    	  order.pay_type = pay_type;
			    	  base.postReq("order/product/price",order,function(data){
			    		  parse_products_data(data);
						  $$("submit_product_button").enable();
			    		  webix.message("商品数据更新成功");
			    	  },function(){
						  $$("submit_product_button").enable();
					  });
			      }},{}]},
			      
			      {cols:[
					{
						view:"datatable",
						id:"order_product_datas",
						columns:product_columns,
						select:true,
						autoheight:true,
						autowidth:true,
						data:[],
						on:product_table_on_event,
						onClick:product_onClick
					},{}]},
					
					{cols:[{view: "richselect", name: "pay_type",id:"pay_type",label:"支付方式",
				    	  options:[{id:1,value:"未付款支付"},
				    	           {id:2,value:"线下支付"},
				    	           {id:3,value:"线上支付"}],placeholder:"选择支付方式",width:250},{}]},
		      ]
	};
	
	var total_price_ui = {
			type:"space",
			cols:[{id: "products_info",
				width:500,
				height:50,
				template:"<div>"+
				"<div class='big_strong_text'>总价：￥#total_price#　　已优惠：￥-#free_price#</div>"+"</div>",
				data:{total_price: 0, free_price: 0}
		     },{}]
	};
	
	var suppliers_onClick = {
			webix_icon:function(e,id,node){
				webix.confirm({
					text:"删除该服务商<br/> 确定?", ok:"是", cancel:"取消",
					callback:function(res){
						if(res){
							var item = $$("supplier_table").getItem(id);
							base.postReq("order/suppliers/delete.json",[item.id],function(data){
								webix.$$("supplier_table").remove(id);
								base.$msg.info("服务商删除成功");
							});
						}
					}
				});
			}
		};
	
	var suppliers_ui =  {
			type:"space",
			rows:[{type:"header",template:"服务商列表"},
			      {cols:[{view:"button",id:"add_supplier_button",label:"选择服务商",width:105,click:function(){
			    	  this.$scope.ui(order_supplier.$ui).show();
			    	  $$("supplier_table").unselect();
			    	  order_supplier.$init_data($$("supplier_table").serialize());
			    	  order_supplier.$add_callback(function(checks){
			    		  //$$("supplier_table").clearAll();
			    		  for(var i=0;i<checks.length;i++){
			    			 $$("supplier_table").add(checks[i]);
			    		  }
			    	  });
			      }},{}]},
			      {cols:[
			 			{
							view:"datatable",
							id:"supplier_table",
							scrollY:false,
							columns:[
								{ id:"name",header:"名称",width:250},
								{ id:"contact_name",editor:"text",header:"联系人",width:120},
								{ id:"phone_number",editor:"text",header:"联系电话",width:120},
								{ id:"address",editor:"text",header:"地址",width:500},
								{ id:"type",editor:"text",header:"类型",width:120},
								{id:"trash", header:"&nbsp;", width:35, template:"<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
							],
							select:true,
							autoheight:true,
							autowidth:true,
							data: [],
							onClick:suppliers_onClick
						},{}]
			}]
		};
	
	
	var take_car_photos = {};
	
	var check_result_option = {"true" : "合格","false" : "不合格"};
	
	var check_columns = [
	     			    { id:"result",editor:"select",options:check_result_option,	header:"是否合格" , width:80},
	    				{ id:"id",editor:"text",header:"ID",hidden:true,width:200},
	    				{ id:"name",header:"名称",width:300},
	    				{ id:"comment",editor:"text",header:"备注",width:450},
	    				{ id:"option",header:"操作", width:80, template:"<span  style='color:#777777; cursor:pointer;'><u class='links'>图片</u></span>"}
	    			];
	
	var check_elements = [{view:"text",name:"id",hidden:true},
	                      {view:"text",name:"car_inspection_type",hidden:true},
	                      {view:"text",name:"keeper_id",hidden:true},
	                      {view:"richselect",name:"complete",label:"状态",width:250,options:[{id:"true",value:"已完成"},{id:"false",value:"未完成"}]},
	                      {view:"text",name:"description",label:"备注",width:250}];
	
	var garage_check_ui = {
			type:"space",
			rows:[{type:"header",template:"全检项目"},
			      {cols:[{view:"form",
				    	id:"garage_form",
				    	hidden:true,
				    	elements:webix.copy(check_elements)
			      },{}]},
			      {cols:[{
						id:"garage_check_data",
						view:"datatable",
						columns:check_columns,
						editable:true,
						editaction:"dblclick",
						autoheight:true,
						autowidth:true,
						select:true,
						data: [],
						onClick:{
							"links":function(e, id, trg){
								var item = $$("garage_check_data").getItem(id);
								this.$scope.ui(upload_img_win.$ui).show();
								upload_img_win.$addCallBack(function(data){
									item.pics = data.pics;
									item.pic_id = data.pics_id;
									webix.message("图片更新成功！！");
								});
								if(item.pics!=null){
									upload_img_win.$init_img(item.pics);
								}
							}
						}
				      },{}]}
			      ]
	}
	
	var first_check_ui = {type:"space",
			rows:[{type:"header",template:"初检项目"},
			      {cols:[{view:"form",
				    	id:"suface_form",
				    	hidden:true,
				    	elements:webix.copy(check_elements)
			      },{}]},
			      {cols:[{
						id:"first_check_data",
						view:"datatable",
						columns:check_columns,
						editable:true,
						editaction:"dblclick",
						autoheight:true,
						autowidth:true,
						select:true,
						data: [],
						onClick:{
							"links":function(e, id, trg){
								var item = $$("first_check_data").getItem(id);
								this.$scope.ui(upload_img_win.$ui).show();
								upload_img_win.$addCallBack(function(data){
									item.pics = data.pics;
									item.pic_id = data.pics_id;
									webix.message("图片更新成功！！");
								});
								if(item.pics!=null){
									upload_img_win.$init_img(item.pics);
								}
							}
						}
				      },{}]}
			      
			]};
	
	var take_car_time = {
			type:"space",
			rows:[{type:"header",id:"pick_time",template:"接车时间"},
			      {cols:[{
		        		id:"pick_time",
		        		view:"list",
		        		height:250,
		        		width:250,
		        		template:"<div class='strong_text'>#pick_time#</div><div class='light_text'>#pick_time_segment#</div>",
		        		type:{height:80,width:250},
		        		select:true
		    		},{}]}
			      ]
	};
	
	var submit_ui = {
			cols:[{},
				{view:"button",label:"完成",width:120,click:function(){
					webix.confirm({
						text:"将订单状态更改为已完成<br/> 确定?", ok:"是", cancel:"取消",
						callback:function(res){
							if(res){
								var item = $$("order_base_data").getValues();
								var p = {};
								p.id = item.id;
								p.order_status = "complete";
								base.postReq("order/update.json",p,function(data){
									console.log(data);
									base.$msg.info("修改成功");
								});
							}
						}
					});
				}},
				{view:"button",label:"提交订单修改",width:120,click:function(){
				//基本信息
				var order = $$("order_base_data").getValues();
				/*order.take_time = base.format_time(order.take_time);
				order.give_back_time = base.format_time(order.give_back_time);*/
				order.pick_start_time=base.format_time(order.pick_start_time);
				order.pick_end_time = base.format_time(order.pick_end_time);
				//供应商信息
				var suppliers = $$("supplier_table").serialize();
				order.supplier_ids = [];
				for(var i=0;i<suppliers.length;i++){
					if(typeof(suppliers[i]['supplier_id'])==="undefined" || suppliers[i]['supplier_id'] === ""){
						order.supplier_ids.push(suppliers[i]['id']);
						continue;
					}
					order.supplier_ids.push(suppliers[i]['supplier_id']);
				}
				
				//维护过程信息
				order.inspections=[];
				
				//外观检测first_check_data
				var surface_data = $$("suface_form").getValues();
				surface_data.items = $$("first_check_data").serialize();
				if(surface_data.items.length>0){
					order.inspections.push(surface_data);
				}
				
				//全检测garage_check_data
				var garage_data = $$("garage_form").getValues();
				garage_data.items = $$("garage_check_data").serialize();
				if(garage_data.items.length>0){
					order.inspections.push(garage_data);
				}
				
				order.operator_id = base.getUserId();
				//完结
				var ui = this.$scope;
				base.postReq("order/update.json",order,function(data){
					webix.message("更新订单成功");
					ui.show("order_edit:id="+data.id);
				});
			}}]
	}
	
	var layout = {
			rows:[
			      customer_base_info_ui,
			      order_product_ui,
			      total_price_ui,
			      suppliers_ui,
			      //take_car_time,
			      first_check_ui,
			      garage_check_ui,
			      submit_ui
			      ]
		};
	
	var parse_tile = function(order){
		webix.$$("title").parse({title: "订单编辑", details: "订单号："+order.number+" 订单状态："+order.status});
	}

	var old_pick_time = null;
	var old_current_keeper_id = null;
	var initdata = function(order_id){
		base.getReq("/orders.json?order_id="+order_id,function(order){
			if(order!=null){
				//初始化数据
				
				config_ui_by_order(order);
				
				parse_tile(order);
				//初始化客户信息
				parse_customer_base_info(order);
				
				//初始化商品信息
				parse_products_data(order);
				
				//初始化服务商信息
				parse_suppliers(order);
				
				//初始化检测项目信息
				parse_check_data(order);
			
				//初始化接车时间
				//parse_take_time_info(order);
				
				//初始化商品类别
				get_product_data(order);

				//赋值管家接车时间信息
				old_pick_time = order.pick_time;
				old_current_keeper_id = order.current_keeper_id;
			}
		});
	};
	
	var config_ui_by_order = function(order){
		if(order.paid){//已支付，不能修改
			$$("add_user_define_product_button").disable();
			$$("add_product_button").disable();
			//$$("add_supplier_button").disable();
		}
	}
	
	var get_product_data = function(order){
		base.getReq("products.json?service_type=1&car_model_type="+order.car.model_type,function(data){
    		car_products = data;
		});
	};
	
	var parse_take_time_info = function(order){
		//接车刷新时间
    	base.getReq("time_segments.json?keeper_type=keeper",function(data){
    		for(var a=0;a<data.length;a++){
    			for(var b=0;b<data[a]['data'].length;b++){
    				var item = {};
        			item.pick_time=data[a]['key'];
        			item.pick_time_segment = data[a]['data'][b];
        			$$("pick_time").add(item);
    			}
    		}
    	});
	};
	
	var parse_suppliers = function(order){
		var suppliers = order.suppliers;
		if(suppliers!=null){
			for(var i= 0;i<suppliers.length;i++){
				if(suppliers[i].type==null){
					suppliers[i].type = "修理厂";
				}
				$$("supplier_table").add(suppliers[i]);
			}
		}
	};
	
	var parse_customer_base_info = function(order){
		var data  = {};
		data['id'] = order.id;
		data['phone_number'] = order.client_basic.phone_number;
		data['contact_name'] = order.client_basic.name;
		data['user_id'] = order.client_basic.id;
		data['peer_source'] = order.peer_source;
		data['car_id'] = order.car.id;
		data['model_type'] = order.car.model_type;
		data['current_keeper_id'] = order.current_keeper_id;
		data['comment'] = order.comment;
		data['operator_comment'] = order.operator_comment;
		data['product_comment'] = order.product_comment;
		data['take_time'] = base.$show_time(order.take_time);
		data['give_back_time'] = base.$show_time(order.give_back_time);
		if(order.coupon!=null ){
			data['coupon_id'] = order.coupon.id;
		}
		$$("order_base_data").parse(data);
		setTimeout(function(){coutPrice()}, 1000);
		var car  = order.car;
		uodate_car_keepers_data(order.current_keeper_id);
		update_sale_persion(order.sale_person_id);
		webix.$$("car_model").parse({car_licence:car.licence.province+order.car.licence.number,model:car.model,brand:car.brand,category:car.category});
	};
	
	var parse_products_data = function(order){
		var products = order.products;
		webix.$$("order_product_datas").clearAll()
		for(var i = 0;i<products.length;i++){
			products[i].product_info = products[i].product_categories.join('_')+'_'+products[i].product_name;
			webix.$$("order_product_datas").add(products[i]);
		}
		$$("pay_type").setValue(order.pay_type);
		$$("pay_type").refresh();
		/*var datas = $$("pay_type_list").serialize();
		var pay_types = order.pay_types;
		for(var i=0;i<datas.length;i++){
			check_select(datas[i],pay_types);
			$$("pay_type_list").refresh(datas[i]['id']);
		}*/
	};
	
	var check_select = function(obj,arrs){
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]===obj['pay_type']){
				obj.$check=true;
			}
		}
		return obj;
	};
	
	var parse_first_check_data = function(check){
		if(check.items.length>0){
			$$("suface_form").show();
		}else{
			$$("suface_form").hide();
			return;
		}
		$$("suface_form").parse(check);
		for(var i=0;i<check.items.length;i++){
			$$("first_check_data").add(check['items'][i]);
		}
	};
	
	var parse_garage_check_data = function(check){
		if(check.items.length>0){
			$$("garage_form").show();
		}else{
			$$("garage_form").hide();
			return;
		}
		$$("garage_form").parse(check);
		for(var i=0;i<check.items.length;i++){
			$$("garage_check_data").add(check['items'][i]);
		}
	};
	
	var parse_check_data = function(order){
		var inspections = order.inspections;
		for(var i=0;i<inspections.length;i++){
			if(inspections[i]['car_inspection_type']==="surface"){
				parse_first_check_data(inspections[i]);
			}else if(inspections[i]['car_inspection_type']==="garage"){
				parse_garage_check_data(inspections[i]);
			}
		}
	};
	
	/*var coutPrice = function(){
		var price = {};
		price.total_price = 0;
		$$("order_product_datas").eachRow(function (row){ 
	        var item = $$("order_product_datas").getItem(row);
	        price.total_price += item.total_price*1;
		});
		$$("products_info").parse(price);
	};*/

	var coutPrice = function(){
		var order_info = $$("order_base_data").getValues();
		var paramform = {};
		paramform.order_id = order_info.id;
		paramform.user_id = order_info.user_id;
		paramform.car_model_type = order_info.model_type;
		if(typeof(order_info.coupon_id)!='undefined'){
			paramform.coupon_id = order_info.coupon_id;
		}
		paramform.products = [];
		$$("order_product_datas").eachRow(
			function (row){
				var item = $$("order_product_datas").getItem(row);
				console.log(item);
				var pitem = {};
				pitem.product_type=item.product_type;
				pitem.unit_count =item.unit_count;
				//pitem.part_type=item.part_type;
				pitem.labour_price = item.labour_price;
				pitem.order_item_id = item.id;
				pitem.product_price = item.price;
				paramform.products.push(pitem);
			}
		)
		base.postReq("/order_update_preview.json",paramform,function(data){
			$$("products_info").parse(data);
		},function(err){
			if(err.code="20001"){

			}
		});

	};
	
	return {
		$ui:{type:"space",cols:[layout]},
		$oninit:function(app,config){
			webix.$$("title").parse({title: "订单编辑", details: ""});
			var id = base.get_url_param("id");
			initdata(id);
		}
	};
	

});