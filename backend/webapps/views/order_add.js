define(["models/order",
        "views/forms/order_product",
        "views/modules/base",
        "views/forms/order_product",
        "views/forms/user_car_model",
        "views/order_details"], function(order,product,base,order_product,user_car_model,order_details){

	var car_products = "";
	
	var user_defined_option = {"true" : "自定义","false" : "非自定义"};

	var search_address = function(){
		var address = $$("address").getValue();
		if(address==null||address==""){
			return;
		}
		base.getLocation(address,function(data){
			if(data['message']=="ok"){
				$$("pick_address").clearAll();
				if(data.results.lenth<=0){
					var item = {};
					item.latitude=21.1;
					item.longitude=21.1;
					item.name=address;
					item.address="--";
					$$("pick_address").add(item);
				}
				for(var i=0;i<data.results.length;i++){
					var obj = {};
					obj.latitude=data.results[i]['location']['lat'];
					obj.longitude=data.results[i]['location']['lng'];
					obj.name=data.results[i].name;
					obj.address=data.results[i].address;
					$$("pick_address").add(obj);
				}
			}
		});
	};

	var clear_info = function(){
		$$("car_data_view").clearAll();
		$$("coupon_data_view").clearAll();
		$$("order_product_datas").clearAll();
		$$("pick_time").clearAll();
	};

	var update_car_model_list = function(user_id){
		base.getReq("cars.json?car_user_id="+user_id,function(cardata){
			if(cardata){
				$$("car_data_view").clearAll();
				$$("car_data_view").parse(cardata);
			}
		});
	};

	var update_coupons_list = function(user_id){
		base.getReq("coupons?user_id="+user_id,function(coupons){
			$$("coupon_data_view").clearAll();
			for(var i=0;i<coupons.length;){
				if(coupons[i].status === "未使用"){
					i++;
					continue;
				}
				coupons.splice(i,1);
			}
			$$("coupon_data_view").parse(coupons);
		});
	};

	var update_user_info = function(){
		base.getReq("meta_user/"+$$("phone_number").getValue(),function(data){
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
	
	var order_form = {
		view: "form",
		id: "order_add",
		position:"center",
		elementsConfig:{
			labelWidth: 80
		},
		scroll: false,
		elements:[
		    {view:"label",label:"手机号"},
			{cols:[{view: "text",keyPressTimeout:100, id: "phone_number",name:"phone_number",value:"18210237734", placeholder: "输入手机号",width:250,value:"",on:{
				"onTimedKeyPress":function(){
					clear_info();
					if($$("phone_number").getValue().length==11){
						check_user_info();
					}
				}
			}},
			       { view: "button", label: "查询", width: 80,click:function(){
			    	   check_user_info();
			       }},
			       { view: "button", label: "注册",id:"register_button", width: 80,hidden:true,click:function(){
			    	   var param = {};
			    	   param.phone = $$("phone_number").getValue();
			    	   base.postForm("car_user/register.json",param,function(data){
			    		   $$("register_button").hide();
						   //获取用户信息
			    		   check_user_info();

			    		   webix.message("新用户注册成功");
			    	   });
			       }},
			       {}]
		    },
			{view:"label",label:"姓名"},
			{view:"text",id:"car_user_id",name:"user_id",hidden:true,width:150},
			{view: "text",id:"user_name", name: "contact_name", placeholder: "姓名",width:250},
			{view:"label",label:"订单渠道"},
	        {view: "richselect", name: "peer_source",value:"backend", placeholder:"选择订单渠道", vertical: true,width:250, options:[
                {id:"backend", value: "后台"},
  				{id:"xiaomi", value: "小米"},
  				{id:"weixin", value: "微信"},
  				{id:"guoqin", value: "国青"},
  				{id:"alipay", value: "支付宝"}
  			]},
			{view:"label",label:"接车管家"},
			{view: "richselect", name: "current_keeper_id",id:"current_keeper_id",options:[],placeholder:"选择接车管家",width:250,
				on:{"onAfterRender":function(){
					base.getReq("car_keepers.json",function(data) {
						var list = $$("current_keeper_id").getPopup().getList();
						list.clearAll();
						for (var i = 0; i < data.length; i++) {
							if (data[i]['lay_off']) {
								continue;
							}
							list.add({id: data[i]['car_keeper_id'], value: data[i]['name']});
						}
					});
				}}
			},
			{view:"label",label:"销售渠道"},
			{view: "richselect", name: "sale_person_id",id:"sale_person_id",options:[],placeholder:"选择销售渠道",width:250,
				on:{"onAfterRender":function(){
					base.getReq("users_by_role_code.json?role_code=UserRoles_SaleUsers",function(data) {
						var list = $$("sale_person_id").getPopup().getList();
						list.clearAll();
						for (var i = 0; i < data.length; i++) {
							list.add({id: data[i]['id'], value: data[i]['user_name']});
						}
					});
				}}
			},
			{view:"label",label:"车型号",height:30},
			{ view: "button", type: "iconButton", icon: "plus", label: "添加车型", width: 130, click: function(){
				if($$("car_user_id").getValue()==null || $$("car_user_id").getValue()==""){
					webix.message({ type:"error",expire:5000,text:"输入手机号并验证是否存在该用户！"});
					return;
				}
				this.$scope.ui(user_car_model.$ui($$("car_user_id").getValue(),function(item){
					//重新获取车型信息
					update_car_model_list($$("car_user_id").getValue());

				})).show();
				
			}},
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
	            	base.getReq("products.json?service_type=1&car_model_type="+modeltype,function(data){
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
			
			{view:"label",label:"选择商品",height:30},
			
			//车型关联商品
			{cols:[{ view: "button", type: "iconButton", icon: "plus", label: "添加商品", width: 130, click: function(){
				var carmodelid = getCarModelId();
				if(carmodelid!=null){
					this.$scope.ui(order_product.$ui(false,carmodelid)).show();//是否显示商品list,是否显示图片
					order_product.$config_form_type(false,false);//是否是编辑项，是否是自定义商品
					$$('order_product_datas').unselect();
					$$('order_product_form').bind('order_product_datas');
				}
			}},
			{view: "button", type: "iconButton", icon: "plus", label: "自定义商品", width: 130, click:function(){
				$$('order_product_datas').unselect();
				var carmodelid = getCarModelId();
				if(carmodelid!=null){
					this.$scope.ui(order_product.$ui(true,carmodelid)).show();
					order_product.$config_form_type(false,true);
					$$('order_product_form').bind('order_product_datas');
				}
			}}]},
			{cols:[
					{
						view:"datatable",
						id:"order_product_datas",
						columns:[
						    { id:"product_type",header:"ID",hidden:true,width:150},
						    { id:"product_name",header:"名称",width:250,hidden:true},
							{ id:"product_info",header:"名称",width:250},
							{ id:"unit_count",header:"数量",width:100},
							{ id:"price",header:"单价",width:100},
							{ id:"labour_price",header:"工时费",width:100},
							{ id:"total_price",header:"价格",width:100},
							{ id:"user_defined",header:"自定义",options:user_defined_option},
							{id:"trash", header:"操作", width:80, template:"<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
						],
						select:true,
						autoheight:true,
						autowidth:true,
						on:{"onAfterAdd":function(id, index){
							coutPrice();
						},"onAfterDelete":function(id){
							coutPrice();
							webix.message("移除了一个商品");
						},"onItemDblClick":function(id, e, node){
							var item = $$("order_product_datas").getItem(id);
							var carmodelid = getCarModelId();
							if(carmodelid!=null){
								this.$scope.ui(order_product.$ui(item.user_defined,carmodelid)).show();
								order_product.$config_form_type(false,item.user_defined);
								order_product.$addPriceCallBack(coutPrice);
								$$('order_product_form').bind('order_product_datas');
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
					},{}]
			},
			
			{id: "products_info",
				width:300,
				height:50,
				template:"<div>"+
				  "<div class='big_strong_text'>总价：￥#total_price#　　　　已优惠：￥-#free_price#</div>"+"</div>",
				data:{total_price: 0, free_price: 0}
		     },

			{view:"label",label:"优惠券"},
			{cols:[{view:"text",id:"coupon_code",width:120,placeholder: "输入优惠券码"},{view:"button",label:"兑换",width:50,click:function(){
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

			}}]},
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
			
			{view:"label",label:"接车时间"},
			{cols:[{
        		id:"pick_time",
        		view:"list",
        		height:250,
        		width:250,
        		template:"<div class='strong_text'>#pick_time#</div><div class='light_text'>#pick_time_segment#</div>",
        		type:{height:80,width:250},
        		select:true,
				on:{"onItemClick":function(id, e, node){
					var item = this.getItem(id);
					if(item.pick_time){
						//获取冲突数据
						var param = "pick_time="+item.pick_time;
						var currentKeeperId = $$("current_keeper_id").getValue();
						if(currentKeeperId && currentKeeperId!=''){
							param = param + "&current_keeper_id="+currentKeeperId;
							base.getReq("order/keeper_conflict.json?"+param,function(data){
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
					}
				}}
    		},{
				id:"pick_time_tip",
				view:"list",
				height:250,
				width:250,
				hidden:true,
				template:"<div class='strong_text'>#customer_info#</div><div class='light_text'>#pick_time_info#</div>",
				type:{height:80,width:250},
				select:false
			}]},
    		//接车地址
    		{view:"label",label:"接车地址"},
    		{cols:[{view: "text", id: "address",name:"address",keyPressTimeout:100, placeholder: "输入地址进行查询",width:250,value:"",
				on:{"onTimedKeyPress":function(){
					search_address();
				}}},
			       { view: "button", label: "查询", width: 80,click:function(){
			    	   var address = $$("address").getValue();
			    	   if(address==null||address==""){
			    		   webix.message({ type:"error",expire:5000,text:"请输入查询的地址"});
			    		   return;
			    	   }
					   search_address();
			       }},{}]
		    },
    		{cols:[{
        		id:"pick_address",
        		view:"list",
        		height:250,
        		template:"<div class='strong_text'>#name#</div><div class='light_text'>#address#</div>",
        		type:{height:80,width:500},
        		select:true,
        		on:{"onItemClick":function(id, e, node){
        			var item = this.getItem(id);
        		}}
    		},{}]},
    		

			{view:"textarea",name:"product_comment",height:80,width:950,label:"商品备注"},
			{view:"textarea",name:"comment",height:80,width:950,label:"客户备注"},
			{view:"textarea",name:"operator_comment",height:80,width:950,label:"客服备注"}
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
		paramform.products = [];
		$$("order_product_datas").eachRow(
			function (row){
				var item = $$("order_product_datas").getItem(row);
				var pitem = {};
				pitem.product_type=item.product_type;
				pitem.unit_count =item.unit_count;
				pitem.part_type=item.part_type;
				paramform.products.push(pitem);
			}
		)
		var scoupon = $$("coupon_data_view").getSelectedItem();
		if(scoupon!=null){
			paramform.coupon_id = scoupon.id;
		}
		base.postReq("/order_preview.json",paramform,function(data){
			console.log(data);
			$$("products_info").parse(data);
		 },function(err){
			if(err.code="20001"){
				$$("coupon_data_view").unselectAll();
			}
		});

	};
	
	var submit = function(view){
		var formdata = $$("order_add").getValues();
		var carmodel = $$("car_data_view").getSelectedItem();
		if(carmodel==null){
			webix.message({ type:"error",expire:5000,text:"请选择一个车型"});
			return;
		}
		formdata['car_id'] = carmodel['id'];
		if($$("coupon_data_view").getSelectedItem()!=null){
			formdata['coupon_id'] = $$("coupon_data_view").getSelectedItem().id;
		}
		formdata.products = [];
		$$("order_product_datas").eachRow( 
		    function (row){ 
		        var item = $$("order_product_datas").getItem(row);
		        item.id="";
		        formdata.products.push(item);
		    }
		)
		var itemtime = $$("pick_time").getSelectedItem();
		if(itemtime==null){
			webix.message({ type:"error",expire:5000,text:"请选择一个接车时间"});
			return;
		}
		formdata.pick_time = itemtime.pick_time;
		formdata.pick_time_segment = itemtime.pick_time_segment;
		formdata.location= {
			latitude: 21.1,
			longitude: 21.1,
			name: "",
			address: ""
		};
		
		 var addre = $$("pick_address").getSelectedItem();
		 if(addre!=null){
			 formdata.location = addre
		 }
		 
		 var scoupon = $$("coupon_data_view").getSelectedItem();
		 if(scoupon!=null){
			 formdata.coupon_id = scoupon.id;
		 }
		 formdata.operator_id = base.getUserId();
		 var ui = view.$scope;
		 $$("commit_data").disable();
		 base.postReq("order/create.json",formdata,function(data){
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
			cols:[
            {},
            {
            	type:"space",
            	rows:[order_form,
            	      {cols:[{},{ view: "button",width:80,height:50,type: "iconButton", id:"commit_data", icon: "plus", label: "提交",click:function(){
                  		submit(this);
                  	}}]}
            	]},{}]};
	return {
		$ui:layout,
		$oninit:function(app,config){
			coutPrice();
			webix.$$("title").parse({title: "新建订单", details: "新增订单"});
			init_url_param();
		}
	};
	

});