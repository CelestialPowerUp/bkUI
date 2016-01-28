define(["models/order",
        "views/forms/order_product",
        "views/modules/base",
        "views/forms/order_product",
        "views/forms/user_car_model",
        "views/order_details",
		"views/forms/supplier",
		"views/webix/baidumap"], function(order,product,base,order_product,user_car_model,order_details,supplier){

	var car_products = "";
	
	var user_defined_option = {"true" : "自定义","false" : "非自定义"};

	//搜索地址
	var search_address = function(){
		var address = $$("address").getValue();
		if(address==null||address==""){
			refresh_user_address($$("car_user_id").getValue());
			return;
		}
		base.getLocation(address,function(data){
			if(data['message']=="ok"){
				$$("pick_address").clearAll();
				for(var i=0;i<data.results.length;i++){
					if(typeof (data.results[i]['location']) === 'undefined'){
						continue;
					}
					var obj = {};
					obj.latitude=data.results[i]['location']['lat'];
					obj.longitude=data.results[i]['location']['lng'];
					obj.name=data.results[i].name;
					obj.address=data.results[i].address;
					obj.help = "新地址";
					$$("pick_address").add(obj);
				}
			}
		});
	};

	//清除信息
	var clear_info = function(){
		$$("car_data_view").clearAll();
		$$("coupon_data_view").clearAll();
		$$("order_product_datas").clearAll();
		$$("pick_time").clearAll();
		$$("pick_address").clearAll();
	};

	/**
	 * 更新用户车辆信息
	 * @param user_id
	 */
	var update_car_model_list = function(user_id){
		base.getReq("cars.json?car_user_id="+user_id,function(cardata){
			if(cardata){
				$$("car_data_view").clearAll();
				$$("car_data_view").parse(cardata);
			}
		});
	};

	/**
	 * 更新用户的优惠券列表
	 * @param user_id
	 */
	var update_coupons_list = function(user_id){
		base.getReq("coupons?user_id="+user_id,function(coupons){
			$$("coupon_data_view").clearAll();
			/*for(var i=0;i<coupons.length;){
				if(coupons[i].status === "未使用"){
					i++;
					continue;
				}
				coupons.splice(i,1);
			}*/
			$$("coupon_data_view").parse(coupons);
		});
	};

	/**
	 * 更新我的地址
	 * @param user_id
	 */
	var refresh_user_address = function(user_id){
		$$("pick_address").clearAll();
		base.getReq("addresses.json?user_id="+user_id,function(addresses){
			for(var i=0;i<addresses.length;i++){
				var obj = {};
				obj.latitude=addresses[i]['latitude'];
				obj.longitude=addresses[i]['longitude'];
				obj.name=addresses[i]['name'];
				obj.address=addresses[i]['address'];
				obj.help = "我的地址";
				$$("pick_address").add(obj);
			}
		});
	};

	/**
	 * 更新用户信息
	 */
	var update_user_info = function(){
		base.getReq("meta_user/"+$$("user_phone_number").getValue(),function(data){
			webix.message("用户信息获取成功");
			$$("register_button").hide();
			$$("car_user_id").setValue(data['user_id']);
			$$("user_name").setValue(data['user_name']);
			if(data['user_name']===null ||data['user_name']==''){
				$$("user_name").setValue("--");
			}

			//获取车型信息
			update_car_model_list(data['user_id']);

			//获取优惠券信息
			update_coupons_list(data['user_id']);

			//获取用户地址
			refresh_user_address(data['user_id']);

			//检测绑定openid
			check_openid(data.user_id);

		},function(data){
			if(data.code==="20004"){
				$$("register_button").show();
			}
		});
	};

	var check_user_info = function(){
		update_user_info();
	};

	var format_content = function(point,info){
		var content = "经度："+point.lng+"<br/>"+"纬度："+point.lat+"<br/>";
		content += info;
		return content;
	};

	var get_service_type = function(){
		base.getReq("/v1/api/service_products.json?supplier_id="+$$("supplier_id").getValue()+"&code=all",function(products){
			$$("service_type_view").clearAll();
			$$("service_type_view").parse(products);
			$$("service_type_view").select(products[0].id);
		});
	};

	var parse_supplier_info = function(supplier){
		$$("adaption_supplier_info").setHTML((supplier.supplier_mold==='community'?"社区店":"综合店")+" "+supplier.supplier_name);
		$$("supplier_id").setValue(supplier.supplier_id);
	};

	/**
	 * 适配服务商
	 * @param lng
	 * @param lat
	 */
	var adaption_supplier = function(){
		$$("supplier_id").setValue("");
		var lng = $$("longitude").getValue();
		var lat = $$("latitude").getValue();
		base.getReq("/v2/api/supplier/adaption.json?longitude="+lng+"&latitude="+lat,function(suppliers){
			if(suppliers.length>0){
				parse_supplier_info(suppliers[0]);
			}else{
				parse_supplier_info({supplier_id:"",supplier_name:"养爱车自营",supplier_mold:"comprehensive"});
			}
			get_service_type();
		});

	}

	//更新infowindow的信息
	var update_info_window = function(event){
		var content = format_content(event.point,event.address);
		infoWindow.setContent(content);
		$$("map").map.panTo(event.point);
		$$("longitude").setValue(event.point.lng);
		$$("latitude").setValue(event.point.lat);
		$$("take_car_address").setValue(event.address);
		if($$("switch_service_type").getValue()==='auto'){
			adaption_supplier();
		}
		$$("map").map.openInfoWindow(infoWindow,event.point); //开启信息窗口
	};

	//地图位置信息
	var infoWindow = null;
	var parse_address_info = function(address){
		var map = $$("map").map;
		map.clearOverlays();
		var point = new BMap.Point(116.417854,39.921988);//默认点
		var geoc = new BMap.Geocoder();
		var opts = {
			width : 250,     // 信息窗口宽度
			height: 80,     // 信息窗口高度
			offset: new BMap.Size(0, -25),
			title : "当前位置"  // 信息窗口标题
		}
		infoWindow = new BMap.InfoWindow("", opts);  // 创建信息窗口对象
		infoWindow.disableCloseOnClick();
		if(typeof(address)!='undefined'&& address !== null ){
			point = new BMap.Point(address.longitude,address.latitude);

		}
		var marker = new BMap.Marker(point);  // 创建标注
		map.addOverlay(marker);              // 将标注添加到地图中
		map.centerAndZoom(point, 15);
		marker.enableDragging();
		geoc.getLocation(point, function(rs){
			update_info_window(rs); //开启信息窗口
		});
		marker.addEventListener("dragend",function(event){
			geoc.getLocation(event.point, function(rs){
				update_info_window(rs);
			});
		});
		marker.addEventListener("dragging",function(event){
			map.closeInfoWindow();
		});
	};

	var order_form = {
		view: "form",
		id: "order_add",
		elementsConfig:{
			labelWidth: 80
		},
		scroll: false,
		elements:[
			//隐藏域
			{view:"text",id:"car_user_id",name:"user_id",hidden:true,width:150},
			{view:"text",id:"supplier_id",name:"supplier_id",hidden:true,width:150},

			//手机号码
			{
				view:"toolbar",css: "highlighted_header header5",height:40,
				elements:[
				//{view:"label", align:"left",label:"用户信息",height:30},
				{view: "text",keyPressTimeout:100, id: "user_phone_number", placeholder: "输入下单手机号确认用户信息",width:300,value:"",on:{
					"onTimedKeyPress":function(){
						clear_info();
						$$("phone_number").setValue($$("user_phone_number").getValue());
						if($$("user_phone_number").getValue().length==11){
							check_user_info();
						}
					}
				}},
				{ view: "button", label: "查询", width: 80,click:function(){
					check_user_info();
				}},
				{ view: "button", label: "注册",id:"register_button", width: 80,hidden:true,click:function(){
					var param = {};
					param.phone = $$("user_phone_number").getValue();
					base.postForm("car_user/register.json",param,function(data){
						$$("register_button").hide();
						//获取用户信息
						check_user_info();
						webix.message("新用户注册成功");
					});
				}}
			]},

			{view: "text",id: "phone_number",name:"phone_number",label:"联系电话", placeholder: "输入手机号",width:300,value:""},
			{view: "text",label:"联系人",id:"user_name", name: "contact_name", placeholder: "请输入联系人姓名",width:300},
	        {view: "richselect",label:"订单渠道", name: "peer_source",value:"backend", placeholder:"选择订单渠道", vertical: true,width:300, options:[
                {id:"backend", value: "后台"},
  				{id:"xiaomi", value: "小米"},
  				{id:"weixin", value: "微信"},
  				{id:"guoqin", value: "国青"},
  				{id:"alipay", value: "支付宝"}
  			]},

			//接车地址
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"接车地址",height:30},
				{view:"text",id:"longitude",name:"longitude", label:"经度",labelWidth:50,width:250,placeholder: "经度",required:true,disabled:true},
				{view:"text",id:"latitude",name:"latitude", label:"纬度",labelWidth:50,width:250,placeholder: "纬度",required:true,disabled:true},
			]},
			{
				margin:5,
				cols:[
					{rows:[
						{cols:[
							{view: "text", id: "address",name:"address",keyPressTimeout:100, placeholder: "输入地址进行查询",width:250,value:"",
								on:{"onTimedKeyPress":function(){
									search_address();
								}
								}},
							{ view: "button", label: "查询", width: 50,click:function(){
								var address = $$("address").getValue();
								if(address==null||address==""){
									webix.message({ type:"error",expire:5000,text:"请输入查询的地址"});
									return;
								}
								search_address();
							}},{}]
						},
						{
							id:"pick_address",
							view:"list",
							height:450,
							template:"<div class='strong_text'>#name#(#help#)</div><div class='light_text'>#address#</div>",
							type:{height:80,width:300},
							select:true,
							on:{"onItemClick":function(id, e, node){
								var item = this.getItem(id);
								parse_address_info(item);
							}}
						}
					]},
					{
						view:"baidu-map",
						id:"map",
						zoom:15,
						center:[ 116.404, 39.915 ],
						on:{
							"onAfterRender":function(){

							}
						}
					}
				]
			},
			{view:"text",id:"take_car_address", label:"接车地址",labelWidth:80,placeholder: "请输入接车地址",required:true},

			//服务方式
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"服务类型",height:30},
				{view:"label", id:"adaption_supplier_info"},
				/*{view:"button",id:"add_supplier_button",label:"选择服务商",width:105,click:function(){
					this.$scope.ui(supplier.$ui).show();
					supplier.$init_data([]);
					supplier.$add_callback(function(checks){
						debugger;
						if(checks.length>0){
							parse_supplier_info({supplier_id:checks[0].id,supplier_name:checks[0].name,supplier_mold:checks[0].supplier_mold});
						}
					});
				}}*/
				{ view:"segmented", id:"switch_service_type", value:"",tooltip:"sasjdkjkdjasakjsda", inputWidth:250, options:[
						{ id:"auto", value:"自动匹配模式" },
						{ id:"manually", value:"养爱车自营模式"}
					],
					on:{
						"onAfterTabClick":function(id){
							if(id==="auto"){
								adaption_supplier();
								return ;
							}
							parse_supplier_info({supplier_id:"",supplier_name:"养爱车自营",supplier_mold:"comprehensive"});
							get_service_type();
						}
					}}
			]},
			{
				id:"service_type_view",
				view:"dataview",
				datatype:"json",
				yCount:1,
				xCount:2,
				scroll:false,
				select:true,
				type:{
					width: 180,
					height: 90,
					template:"<div class='strong_text'>#product_name#</div><div class='light_text'>服务费 #price#元</div>"
				},
				on:{"onItemClick":function(id,e,node){
					var item = this.getItem(id);

				}}
			},


			//车型信息
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"选择车型",height:30},
				{ view: "button", type: "iconButton", icon: "plus", label: "添加车型", width: 130, click: function(){
					if($$("car_user_id").getValue()==null || $$("car_user_id").getValue()==""){
						webix.message({ type:"error",expire:5000,text:"输入手机号并验证是否存在该用户！"});
						return;
					}
					this.$scope.ui(user_car_model.$ui($$("car_user_id").getValue(),function(item){
						//重新获取车型信息
						update_car_model_list($$("car_user_id").getValue());

					})).show();

				}}
			]},
			{
	            id:"car_data_view",
				view:"dataview",
				datatype:"json",
				yCount:2,
	            select:true,
	            type:{
	                width: 180,
	                height: 90,
	                template:"<div><div class='webix_strong'>#licence.province##licence.number#</div><div class='webix_strong'>#brand##category#</div><div>#model#</div></div>"
	            },
	            on:{"onItemClick":function(id,e,node){
	            	var item = this.getItem(id);
	            	var modeltype = item['model_type'];
	            	$$("order_product_datas").clearAll();
					var action = "/v2/api/products.json?service_type=11&car_model_type="+modeltype;
					if($$("supplier_id").getValue().length>0){
						action += "&supplier_id="+$$("supplier_id").getValue();
					}
	            	base.getReq(action,function(data){
	            		car_products = data;
						var required_products = data.required_products;
						for(var i=0;i<required_products.length;i++){
							var products = required_products[i];
							products.product_info = products.product_categories.join('_')+'_'+products.product_name;
							products.total_price= products.price*products.unit_count+products.labour_price
							$$("order_product_datas").add(products);
						}
					});
	            	
	            	//接车刷新时间
	            	base.getReq("time_segments.json?keeper_type=keeper",function(data){
						$$("pick_time").clearAll();
	            		for(var a=0;a<data.length;a++){
	            			for(var b=0;b<data[a]['data'].length;b++){
	            				var item = {};
		            			item.pick_time=data[a]['key'];
		            			item.pick_time_segment = data[a]['data'][b];
		            			$$("pick_time").add(item);
	            			}
	            		}
	            	});
	            }}
			},

			//车型关联商品
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"订单商品",height:30},
				{ view: "button", type: "iconButton", icon: "plus", label: "添加商品", width: 130, click: function(){
					var carmodelid = getCarModelId();
					if(carmodelid!=null){
						this.$scope.ui(order_product.$ui(false,carmodelid,$$("supplier_id").getValue())).show();//是否显示商品list,是否显示图片
						order_product.$config_form_type(false,false);//是否是编辑项，是否是自定义商品
						$$('order_product_datas').unselect();
						order_product.$addCallBack(function(data){
							$$("order_product_datas").add(data);
						});
					}
				}}
				/*{view: "button", type: "iconButton", icon: "plus", label: "自定义商品", width: 130, click:function(){
					$$('order_product_datas').unselect();
					var carmodelid = getCarModelId();
					var supplier_id = $$("supplier_id").getValue();
					if(carmodelid!=null){
						this.$scope.ui(order_product.$ui(true,carmodelid,supplier_id)).show();
						order_product.$config_form_type(false,true);
						order_product.$addCallBack(function(data){
							$$("order_product_datas").add(data);
						});
					}
				}}*/
			]},
			{
				view:"datatable",
				id:"order_product_datas",
				columns:[
					{ id:"product_type",header:"ID",hidden:true,width:150},
					{ id:"product_name",header:"名称",width:250,hidden:true},
					{ id:"product_info",header:"商品名称",width:250,fillspace:true},
					{ id:"unit_count",header:"数量",width:100},
					{ id:"price",header:"单价",width:100},
					{ id:"labour_price",header:"工时费",width:100},
					{ id:"total_price",header:"价格",width:100},
					{ id:"user_defined",header:"自定义",options:user_defined_option},
					{id:"trash", header:"操作", width:80, template:"<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
				],
				select:true,
				autoheight:true,
				on:{"onAfterAdd":function(id, index){
					coutPrice();
				},"onAfterDelete":function(id){
					coutPrice();
					webix.message("移除了一个商品");
				},"onItemDblClick":function(id, e, node){
					var item = $$("order_product_datas").getItem(id);
					var carmodelid = getCarModelId();
					if(carmodelid!=null){
						this.$scope.ui(order_product.$ui(item.user_defined,carmodelid,$$("supplier_id").getValue())).show();
						order_product.$config_form_type(false,item.user_defined);
						order_product.$parse_data(item);
						order_product.$addCallBack(function(data){
							$$("order_product_datas").updateItem(id,data);
						});
					}
				}},
				onClick:{
					webix_icon:function(e,id,node){
						webix.confirm({
							text:"删除该商品<br/> 确定?", ok:"是", cancel:"取消",
							callback:function(res){
								if(res){
									webix.$$("order_product_datas").remove(id);
								}
							}
						});
					}
				}
			},

			//优惠券
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"优惠券",height:30},
				{view:"text",id:"coupon_code",width:120,placeholder: "输入优惠券码"},{view:"button",label:"兑换",width:50,click:function(){
					var user_id = $$("car_user_id").getValue();
					if(user_id==""){
						webix.message({ type:"error",expire:5000,text:"请填入下单手机号码并验证用户"});
						return;
					}
					var couponcode = $$("coupon_code").getValue();
					if(couponcode==""){
						webix.message({ type:"error",expire:5000,text:"优惠券码不能为空"});
						return;
					}
					var param = {};
					param.user_id=user_id;
					param.coupons=[{"code":couponcode}];
					base.postReq("coupons/conversion.json",param,function(data){
						base.getReq("coupons?user_id="+user_id,function(coupons){
							$$("coupon_data_view").clearAll();
							$$("coupon_data_view").parse(coupons);
						})
					},function(err){
						console.log(err);
					});

				}}
			]},
			{
				id:"coupon_data_view",
				view:"dataview",
				datatype:"json",
				height:100,
				select:true,
				type:{
					width: 180,
					height: 90,
					template:"<div><div class='webix_strong'>#name#</div><div>价值：#value#</div><div>状态：#status#</div></div>"
				},
				on: {
					onSelectChange:function () {
						coutPrice();
					}
				}
			},

			{id: "products_info",
				width:300,
				height:50,
				template:"<div>"+
				"<div class='big_strong_text'>总价：￥#total_price#　　　已优惠：￥-#free_price#</div>"+"</div>",
				data:{total_price: 0, free_price: 0}
			},

			//接车时间
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"接车时间",height:30}
			]},
			{
				id:"pick_time",
				view:"dataview",
				datatype:"json",
				yCount:2,
				select:true,
				type:{
					width: 150,
					height: 80,
					template:"<div class='strong_text'>#pick_time#</div><div class='light_text'>#pick_time_segment#</div>"
				}
			},

			//备注信息
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"订单备注",height:30}
			]},
			{view:"textarea",name:"product_comment",height:80,width:950,label:"商品备注"},
			{view:"textarea",name:"comment",height:80,width:950,label:"客户备注"}
		]
	};
	
	var getCarModelId = function(){
		var carmodel = $$("car_data_view").getSelectedItem();
		if(carmodel==null){
			webix.message({ type:"error",expire:5000,text:"请选择一个车型"});
			return;
		}
		return carmodel['model_type'];
	};

	/**
	 * 获取订单选择的商品
	 */
	var getOrderProducts = function(){
		var products = [];
		$$("order_product_datas").eachRow(
			function (row){
				var item = $$("order_product_datas").getItem(row);
				var pitem = {};
				pitem.product_type=item.product_type;
				pitem.unit_count =item.unit_count;
				pitem.part_type=item.part_type;
				products.push(pitem);
			}
		)
		var service_product = $$("service_type_view").getSelectedItem();
		if(service_product===null){
			base.$msg.error("请选择一个服务类型");
		}
		delete service_product.id;
		products.push(service_product);
		return products;
	}

	var coutPrice = function(){
		var price = {};
		price.total_price = 0;

		var info = $$("order_add").getValues();
		var paramform = {};

		paramform.user_id = info.user_id;

		var carmodel = $$("car_data_view").getSelectedItem();
		if(carmodel==null){
			return;
		}
		paramform.car_model_type = carmodel.model_type;
		paramform.products = getOrderProducts();

		var scoupon = $$("coupon_data_view").getSelectedItem();
		if(scoupon!=null){
			paramform.coupon_id = scoupon.id;
		}

		var formdata = $$("order_add").getValues();
		paramform.supplier_id=formdata.supplier_id;
		base.postReq("order_preview.json",paramform,function(data){
			$$("products_info").parse(data);
		 },function(err){
			if(err.code="20001"){
				$$("coupon_data_view").unselectAll();
			}
		});
	};

	/**
	 * 获取订单地址
	 * @returns {*}
	 */
	var getOrderAddress = function(){
		if($$("latitude").getValue().length<=0 || $$("longitude").getValue().length<=0 || $$("take_car_address").getValue().length<=0){
			return null;
		}
		return {latitude: $$("longitude").getValue(), longitude: $$("latitude").getValue(),name: "", address: $$("take_car_address").getValue()};
	}
	
	var submit = function(view){

		//基本信息
		var formdata = $$("order_add").getValues();

		//接车地址
		var addre = getOrderAddress();
		if(addre===null){
			base.$msg.error("接车地址不能为空");
			return;
		}
		formdata.location = addre;

		//车辆
		var carmodel = $$("car_data_view").getSelectedItem();
		if(carmodel==null){
			webix.message({ type:"error",expire:5000,text:"请选择一个车型"});
			return;
		}
		formdata['car_id'] = carmodel['id'];

		//优惠券
		var scoupon = $$("coupon_data_view").getSelectedItem();
		if(scoupon!=null){
			formdata.coupon_id = scoupon.id;
		}

		//商品
		formdata.products = [];
		$$("order_product_datas").eachRow( 
		    function (row){ 
		        var item = $$("order_product_datas").getItem(row);
		        delete item.id;
		        formdata.products.push(item);
		    }
		)
		var service_product = $$("service_type_view").getSelectedItem();
		if(service_product===null){
			base.$msg.error("请选择一个服务类型");
		}
		delete service_product.id;
		formdata.products.push(service_product);
		formdata.service_type = service_product.service_type;

		//接车时间
		var itemtime = $$("pick_time").getSelectedItem();
		if(itemtime==null){
			webix.message({ type:"error",expire:5000,text:"请选择一个接车时间"});
			return;
		}
		formdata.pick_time = itemtime.pick_time;
		formdata.pick_time_segment = itemtime.pick_time_segment;

		formdata.operator_id = base.getUserId();
		var ui = view.$scope;
		 $$("commit_data").disable();
		 base.postReq("/v2/api/order/create.json",formdata,function(data){
			webix.message("订单新增成功");
			ui.show("/order_details:id="+data.id);
	     },function(data){
			 $$("commit_data").enable();
		 });
	};

	var check_openid = function(user_id){
		var openid = base.get_url_param("openid");
		var openType = base.get_url_param("open_type");
		if(typeof(openid)==='undefined' || openid === null){
			return ;
		}
		if(typeof (openType) === 'undefined' || openType === null){
			return;
		}
		if(typeof (user_id) === 'undefined' || user_id === null){
			return ;
		}
		base.postReq("openid_bind.json",{openid:openid,open_type:openType,user_id:user_id},function(data){
			base.$msg.info("openid绑定成功!");
		});
	};

	var init_url_param = function(){
		var phone = base.get_url_param("phone_number");
		if(typeof (phone) === 'undefined'|| phone === null){
			return;
		}
		$$("phone_number").setValue(phone);
		check_user_info();
	};


var layout = {
			type:"wide",
			cols:[
            {},
            {
				type:"wide",
				borderless:true,
            	rows:[
					order_form,
				  	{cols:[{},{ view: "button",width:80,height:50,type: "iconButton", id:"commit_data", icon: "plus", label: "提交",click:function(){
                  		submit(this);
                  	}}]}
            	]},
				{}
			]
		};
	return {
		$ui:layout,
		$oninit:function(app,config){
			coutPrice();
			webix.$$("title").parse({title: "新建订单", details: "新增订单"});
			init_url_param();
		}
	};
});