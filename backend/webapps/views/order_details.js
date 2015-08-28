define(["views/modules/base"], function(base){
	
	var customer_ui = {
			type:"space",
			rows:[{type:"header",id:"car_user",template:"#name#"},
			      {view:"text",id:"order_id",hidden:true},
			      {type:"space",cols:[
					{id: "order_base_info",
							width:380,
							height:195,
							template:"<div>"+
							  "<div class='strong_text'>电话号码：#phone#</div>"+
							  "<div class='strong_text'>订单来自：#orderfrom#</div>"+
							  "<div class='strong_text'>下单时间：#create_time#</div>"+
							  "<div class='strong_text'>接车时间：#take_time#</div>"+
							  "<div class='strong_text'>接车地址：#take_address_name#</div>"+
							  "<div class='strong_text'>#take_address_details#</div>"+
							  "</div>"
					},
					{width:250,height:120,id:"car_model",template:"<div>" +
             			"<div class='strong_text'>#car_licence#</div>" +
             			"<div class='strong_text'>#brand##category#</div>"+
             			"<div class='light_text'>#model#</div>" +
             			"</div>",
             			data:{car_licence:"",model:"",brand:"",category:""}},{}
			      ]}
			]
		};
	
	var keeper_ui = {
			type:"space",
			rows:[{type:"header",template:"服务管家"},
		      {
	            id:"keeper_view",
				view:"dataview",
				datatype:"json",
	            select:false,
	            height:120,
	            type:{
	                width: 230,
	                height: 120,
	                template:"<div>" +
	                		"<div class='webix_strong'>姓名：#name#</div>" +
	                		"<div class='webix_strong'>电话号码：#phone_number#</div>" +
	                		"<div class='webix_strong'>管家分数：#keeper_rating#</div>" +
	                		"<div class='webix_strong'>订单分数：#order_rating#</div>" +
	                		"</div>"
	            }
			}]
	}
	
	var suppliers_ui = {
			type:"space",
		rows:[{type:"header",template:"服务商列表"},
		      {cols:[
		 			{
						view:"datatable",
						id:"supplier_table",
						scrollY:false,
						columns:[
							{ id:"name",header:"名称",width:150},
							{ id:"contact_name",editor:"text",header:"联系人",width:120},
							{ id:"phone_number",editor:"text",header:"联系电话",width:120},
							{ id:"address",editor:"text",header:"地址",width:500},
							{ id:"type",editor:"text",header:"类型",width:120}
						],
						select:false,
						autoheight:true,
						autowidth:true,
						data: []
					},{}]
		}]
	};
	
	var service_details_ui = {
			type:"space",
			rows:[{type:"header",template:"服务过程"},
			      {view:"label",label:"接车照片"}]
	};
	
	var order_products_ui={
			type:"space",
			rows:[{type:"header",template:"商品列表"},
			      {cols:[
					{
						view:"datatable",
						id:"order_product_datas",
						columns:[
						    { id:"product_type",header:"ID",hidden:true,width:150},
							{ id:"product_name",header:"名称1",width:250,hidden:true},
							{ id:"product_info",header:"名称",width:350},
							{ id:"unit_count",header:"数量",width:100},
							{ id:"price",header:"单价",width:100},
							{ id:"labour_price",header:"工时费",width:100},
							{ id:"total_price",header:"小计",width:100}
						],
						autoheight:true,
						autowidth:true,
						data: []
					},{}]
				  }
		      ]
	};
	
	var price_info_ui = {
			type:"space",
			rows:[{type:"header",template:"费用信息"},
			      {cols:[{id: "order_price",
						width:500,
						height:200,
						template:"<div>"+
						  "<div class='big_strong_text'>管家接车：￥#fee#</div>"+
						  "<div class='big_strong_text'>优惠券抵扣：￥#coupon_price#</div>"+
						  "<div class='big_strong_text'>总价：￥#total_price#</div>"+
						  "<div class='big_strong_text'>支付状态：#pay_status_value#</div>"+"</div>"
				
				      },{}]}
			      ]
	};
	
	var button_ui = {
		type:"space",
		cols:[
	      {},
	      {view:"button",id:"grab_order_button",disabled:true,label:"认领",position:"center",width:120,click:function(){
	    	  var p = {};
				p.id = webix.$$("order_id").getValue();
				p.operator_id = base.getUserId();
				base.postReq("order/update.json",p,function(data){
					webix.message("认领成功订单成功");
					$$("grab_order_button").disable();
					$$("grab_order_button").refresh();
				});
	      }},
	      {view:"button",label:"编辑",position:"center",width:120,click:function(){
	    	  var id = webix.$$("order_id").getValue();
	    	  this.$scope.show("/order_edit:id="+id);
	      }}
        ]
	};
	
	var layout = {rows:[customer_ui,
	                    keeper_ui,
	                    order_products_ui,
	                    suppliers_ui,
	                    //service_details_ui,
	                    price_info_ui,
	                    button_ui]}
	
	var get_order_details = function(order_id){
		base.getReq("/v3/api/orders.json?user_type=operator&order_id="+order_id,function(order){
			if(order!=null){
				prase_title(order);
				//车主信息
				prase_customer(order);
				//管家信息
				prase_keepers(order);
				//服务商信息
				prase_suppliers(order);
				//商品信息
				prase_order_products(order);
				//支付信息
				prase_price_info(order);
			}
		});
	};
	
	var prase_title = function(order){
		webix.$$("title").parse({title: "订单详情", details: "订单号："+order.number+" 订单状态："+order.order_status_value});
		webix.$$("order_id").setValue(order.id);
	};
	
	var prase_customer = function (order){
		var obj = {};
		obj.name = order.client_basic.name;
		obj.phone = order.client_basic.phone_number;
		obj.orderfrom = order.peer_source;
		obj.create_time = order.place_time;
		obj.take_time = order.pick_time+" "+order.pick_time_segment;
		obj.take_address_name = order.client_basic.location.name;
		obj.take_address_details = order.client_basic.location.address;
		$$("car_user").parse(obj);
		$$("order_base_info").parse(obj);
		
		if(order.operator===null){
			$$("grab_order_button").enable();
		}
		
		var car = order.car;
		webix.$$("car_model").parse({car_licence:car.licence.province+order.car.licence.number,model:car.model,brand:car.brand,category:car.category});
	}
	
	var prase_keepers = function(order){
		var keepers = order.keeper_basics;
		var items = [];
		if(keepers!=null){
			for(var i=0;i<keepers.length;i++){
				var keeper = {};
				keeper.name = keepers[i]['name'];
				keeper.phone_number = keepers[i]['phone_number'];
				keeper.keeper_rating = order.keeper_rating;
				keeper.order_rating = order.order_rating;
				items.push(keeper);
			}
		}
		$$("keeper_view").parse(items);
	}
	
	var prase_suppliers = function(order){
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
	
	
	var prase_service_details = function(order){
		
	};
	
	var prase_order_products = function(order){
		var products = order.products;
		if(products!=null){
			for(var i=0;i<products.length;i++){
				$$("order_product_datas").add(products[i])
			}
		}
	};
	
	var prase_price_info = function(order){
		$$("order_price").parse(order);
	};
	
	return {
		$ui:{type:"space",cols:[{rows:[layout]}]},
		$oninit:function(app,config){
			var parmas = base.parse_url_parmas(window.location.href);
			get_order_details(parmas.id);
		}
	};
	

});