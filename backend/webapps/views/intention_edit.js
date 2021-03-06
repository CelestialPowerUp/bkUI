define(["models/order",
        "views/forms/order_product",
        "views/modules/base",
        "views/forms/order_product",
        "views/forms/user_car_model",
        "views/intention_list"], function(order,product,base,order_product,user_car_model,intention_list){

	var car_products = "";
	
	var check_user_info = function(customer_name,car_id){
		base.getReq("meta_user/"+$$("customer_phone_number").getValue(),function(data){
 		   webix.message("用户信息获取成功");
 		   $$("register_button").hide();
 		   $$("car_user_id").setValue(data['user_id']);
 		   //获取车型信息
 		   base.getReq("cars.json?car_user_id="+data['user_id'],function(cardata){
 			   if(cardata){
 				   $$("car_data_view").clearAll();
 				   $$("car_data_view").parse(cardata);
				   //回显选中的car
				   $$("car_data_view").select(car_id);
 			   }
 		   });
 		   if(data['user_name']===null ||data['user_name']==''){
 			   $$("customer_name").setValue("--");
 			   return;
 		   }
 		   $$("customer_name").setValue(data['user_name']);
			//回显客户姓名
			if(customer_name){
				$$("customer_name").setValue(customer_name);
			}
 	   },function(data){
 		   if(data.code==="20004"){
 			   $$("register_button").show();
 		   }
 	   });
	};
	
	var order_form = {
		view: "form",
		id: "order_edit",
		position:"center",
		elementsConfig:{
			labelWidth: 80
		},
		scroll: false,
		elements:[
			{view:"text",id:"id",hidden:true},
		    {view:"label",label:"手机号"},
			{cols:[{view: "text",keyPressTimeout:100, id: "customer_phone_number",name:"customer_phone_number", placeholder: "输入手机号",width:250,value:"",on:{
				"onTimedKeyPress":function(){
					if($$("customer_phone_number").getValue().length==11){
						check_user_info();
					}
				}
			}},
			       { view: "button", label: "查询", width: 80,click:function(){
			    	   check_user_info();
			       }},
			       { view: "button", label: "注册",id:"register_button", width: 80,hidden:true,click:function(){
			    	   var param = {};
			    	   param.phone = $$("customer_phone_number").getValue();
			    	   base.postForm("car_user/register.json",param,function(data){
			    		   $$("register_button").hide();
			    		   check_user_info();
			    		   webix.message("注册成功");
			    	   });
			       }},
			       {}]
		    },
			{view:"label",label:"姓名"},
			{view:"text",id:"car_user_id",name:"car_user_id",hidden:true,width:150},
			{view: "text",id:"customer_name", name: "customer_name", placeholder: "姓名",width:250},

			{view:"label",label:"车型号",height:30},
			{ view: "button", type: "iconButton", icon: "plus", label: "添加车型", width: 130, click: function(){
				if($$("car_user_id").getValue()==null || $$("car_user_id").getValue()==""){
					webix.message({ type:"error",expire:5000,text:"输入手机号并验证是否存在该用户！"});
					return;
				}
				this.$scope.ui(user_car_model.$ui($$("car_user_id").getValue(),function(item){
					//重新获取车型信息
					base.getReq("cars.json?car_user_id="+$$("car_user_id").getValue(),function(cardata){
		    			   if(cardata){
		    				   $$("car_data_view").clearAll();
		    				   $$("car_data_view").parse(cardata);
		    			   }
		    		   });
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
	            }}
			},

			{view:"textarea",name:"description",height:180,width:950,label:"客服备注"}
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
	

	var submit = function(view){
		var formdata = $$("order_edit").getValues();
		var carmodel = $$("car_data_view").getSelectedItem();
		if(carmodel==null){
			webix.message({ type:"error",expire:5000,text:"请选择一个车型"});
			return;
		}
		formdata['car_id'] = carmodel['id'];
		formdata.operator_id = base.getUserId();
		var ui = view.$scope;
		console.log(formdata);
		//return;
		 base.postReq("intention/update.json",formdata,function(data){
			webix.message("意向编辑成功");
			ui.show("/intention_list");
	     });
	};

	//编辑页面回显数据
	var init_data=function(intention_id){
		var url = "intention/"+intention_id;
		base.getReq(url,function(data){
			$$("order_edit").parse(data);
			//手机号，姓名
			var customer_name = data.customer_name;
			var car_id = data.car_id;
			//查询用户信息并回显数据
			check_user_info(customer_name,car_id);
		});
	};

	var layout = {
			cols:[
            {},
            {
            	type:"space",
            	rows:[order_form,
            	      {cols:[{},{ view: "button",width:80,height:50,type: "iconButton", icon: "plus", label: "提交",click:function(){
                  		submit(this);
                  	}}]}
            	]},{}]};
	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "意向管理", details: "编辑意向"});
			var intention_id = base.get_url_param("id");
			if(intention_id){
				init_data(intention_id);
			}
		}
	};
	

});