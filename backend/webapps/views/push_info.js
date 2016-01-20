define(["models/order",
        "views/forms/order_product",
        "views/modules/base",
        "views/forms/order_product",
        "views/forms/user_car_model",
        "views/order_details",
		"views/forms/supplier",
		"views/webix/baidumap"], function(order,product,base,order_product,user_car_model,order_details,supplier){


	var button_ui = {cols:[
		{},{},{},
		{view:"button",label:"选中全部",width:80,click:function(){
			var datas = $$("role_api_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = true;
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("role_api_list").refresh();
		}},
		{view:"button",label:"取消全部",width:80,click:function(){
			var datas = $$("role_api_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = false;
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("role_api_list").refresh();
		}},
		{view:"button",label:"反选",width:80,click:function(){
			var datas = $$("role_api_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = !(datas[i].$check);
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("role_api_list").refresh();
		}},
	]};

	var car_brand_check_button_ui = {cols:[
		{},{},{},
		{view:"button",label:"全选",width:80,click:function(){
			$$("car_brands").selectAll();
		}},
		{view:"button",label:"全不选",width:80,click:function(){
			$$("car_brands").unselectAll();
		}},
		{view:"button",label:"反选",width:80,click:function(){
			var items = $$("car_brands").serialize();
			for(var i=0;i<items.length;i++){
				$$("car_brands").select(items[i].id,false,true);
			}
		}},
	]};

	var search_user_button_ui = {cols:[
		{},{},{},
		{view:"button",label:"根所选品牌筛选用户",width:200,click:function(){
			var selectedCarBrandIds = $$("car_brands").getSelectedId();
			console.log(selectedCarBrandIds==='');
			if(!selectedCarBrandIds){
				webix.message({ type:"error",expire:5000,text:"筛用户前，请先选车品牌。"});
				return;
			}

			var carBrandIds = [];
			if(selectedCarBrandIds instanceof Array){
				for(var i=0;i<selectedCarBrandIds.length;i++){
					carBrandIds.push(selectedCarBrandIds[i]);
				}
			}else{
				carBrandIds.push(selectedCarBrandIds);
			}

			//获取符合条件用户信息 TODO
			var url_get_users = "";
			base.getReq("/v1/api/app_packages/enable_client.json",function(data){
			},function(data){
			});


			var data = [
				{"$check":true,"user_id":1,"phone_number":"18210237734","user_name":"王帅","app_versions":"android 5.0.0"}
			];
			$$("user_list").parse(data);

			console.log(carBrandIds);
		}}
	]};

	var form_ui = {
		view: "form",
		id: "form",
		elementsConfig:{
			labelWidth: 100
		},
		widht:820,
		scroll: false,
		elements:[
			//表单区域
			{
				view:"toolbar",css: "highlighted_header header5",height:40,width:820,
				elements:[
					{view:"label", align:"left",label:"基本信息",height:30}
			],hidden:false},

			{ view:"text", id:"id", name:"id",hidden:true },

			{ view:"datepicker", timepicker:true, label:"推送时间：", name:"plan_push_time", stringResult:true, format:"%Y-%m-%d %H:%i" ,width:350 },
			{ view:"textarea",label:"推送内容:", name:"push_content",id:"push_content",height:150,required:true,placeholder:"推送内容",value:"" },
			{ view:"text", id:"push_open_target_description",name:"push_open_target_description",label:"划开描述:",required:true,placeholder:"划开内容简介",value:""},
			{ view:"text", id:"push_open_target_params",name:"push_open_target_params",label:"划开描述:",required:true,placeholder:"",value:"",hidden:true},
			{ view:"richselect", id:"push_open_target_type",name:"push_open_target_type",options:[{"id":"h5",value:"H5页面"},{"id":"store_product",value:"单品"}],label:"划开目标:",required:true,placeholder:"划开目标",value:"H5页面"},
			{ view:"text", id:"h5_url",name:"h5_url",label:"H5地址:",required:true,placeholder:"H5地址",value:""},

			//版本
			{
				view:"toolbar",css: "highlighted_header header5",height:40,width:820,
				elements:[
					{view:"label", align:"left",label:"可选版本",height:30},
					button_ui
				],hidden:false},
			{
				view: "list",
				css: "tasks_list",
				id:"role_api_list",
				height:300,
				width:650,
				type: {
					height: 35,
					marker: function(obj){
						return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
					},
					check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
					template: function(obj,type){
						return "<span class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.os_type+"  "+obj.app_version+" ( "+obj.app_name+" ) </span>";
					}
				},
				data: [],
				on: {
					onItemClick:function(id){
						var item = this.getItem(id);
						item.$check = !item.$check;
						this.refresh(id);
					}
				}
			},

			//车品牌
			{
				view:"toolbar",css: "highlighted_header header5",height:40,width:820,
				elements:[
					{view:"label", align:"left",label:"车辆品牌",height:30},
					car_brand_check_button_ui
				],hidden:false},
			{
				view:"dataview",
				id:"car_brands",
				select:"multiselect",
				height:300,
				width:50,
				scroll:true,
				template:"<div class='webix_strong'>#name#</div>" ,
				data:[
					{id:0,name:""},
				],
				on:{
					onItemClick:function(id, e, node){
						$$("car_brands").select(id,false,true);
						return false;
					}
				}
			},

			//筛选用户
			search_user_button_ui,

			//用户列表
			{
				view:"toolbar",css: "highlighted_header header5",height:40,width:820,
				elements:[
					{view:"label", align:"left",label:"用户列表",height:30},
					car_brand_check_button_ui
				],hidden:false},
			{
				view: "list",
				css: "tasks_list",
				id:"user_list",
				height:300,
				width:650,
				type: {
					height: 35,
					marker: function(obj){
						return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
					},
					check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
					template: function(obj,type){
						return "<span class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text view_list_item'>"+obj.user_name+"</span>"
								+"<span class='view_list_item'>"+obj.phone_number+"</span>"
								+"<span class='view_list_item'>"+obj.app_versions+"</span>";
					} //{"$check":true,"user_id":1,"phone_number":"18210237734","user_name":"王帅","app_versions":"android 5.0.0"}
				},
				data: [],
				on: {
					onItemClick:function(id){
						var item = this.getItem(id);
						item.$check = !item.$check;
						this.refresh(id);
					}
				}
			},

			//提交
			{cols:[{},{ view: "button",width:80,height:50,type: "iconButton", id:"commit_btn", icon: "plus", label: "提交",click:function(){
				submit();
			}}]},
		]
	};

	var filter_ui = {
		margin:15,
		cols:[
			{ view: "button", type: "iconButton", icon: "backward", label: "返回列表", width: 840, click: function(){
				this.$scope.show("/push_info_list");
			}},
			{}
		]
	};

	var layout = {
		type:"space",
		margin:15,
		rows:[
			{
				cols:[{},filter_ui,{}]
			},
			{
				cols:[
					{},
					{
						type:"wide",
						borderless:true,
						rows:[
							form_ui,
							{cols:[{},{}]}
						]
					},
					{}
				]
			}
		]
	};

	/*保存限行数据*/
	var submit = function(){
		//基本信息
		var formData = {};
		var date = base.format_time($$("date").getValue());
		var selectNos = $$("numbers").getSelectedItem();
		var numbers = [];
		if(selectNos){
			if(selectNos instanceof Array){
				for(var i=0;i<selectNos.length;i++){
					numbers.push(selectNos[i].no_);
				}
			}else{
				numbers.push(selectNos.no_);
			}
		}
		formData.date = date;
		formData.numbers = numbers;
		formData.car_restriction_type = "custom";

		 base.postReq("/v1/api/car_restriction/create.json",formData,function(data){
			webix.message("限行信息保存成功");
			 freshCustomList();
			 restForm();
	     },function(data){
		 });
	};

	/*重置form表单*/
	var restForm = function(){
		$$("form").clear();
		$$("numbers").selectAll();
		$$("numbers").select($$("numbers").getSelectedId(),false,true);
	};

	/*获取自定义列表信息*/
	var freshCustomList = function(){
		var queryData = {"car_restriction_type":"custom"};
		base.postReq("/v1/api/car_restrictions.json",queryData,function(data){
			$$("custom_list").clearAll();
			$$("custom_list").parse(data);
		},function(data){
		});
	};
	/*获取第三方列表*/
	var freshThirdList = function(){
		var queryData = {"car_restriction_type":"third_api"};
		base.postReq("/v1/api/car_restrictions.json",queryData,function(data){
			$$("third_list").clearAll();
			$$("third_list").parse(data);
		},function(data){
		});
	};

	/*初始化数据*/
	var init_data = function(){

		/*版本*/
		base.getReq("/v1/api/app_packages/enable_client.json",function(checked){
			base.getReq("/v1/api/app_packages/enable_client.json",function(all){
				var data = [];
				for(var i=0;i<all.length;i++){
					data.push(parse_check_data(all[i],checked));
				}
				$$("role_api_list").parse(data);
			});
		});

		/*车品牌*/
		var url_car_brands = "/v1/api/meta_brands.json"
		base.getReq(url_car_brands,function(data){
			console.log(data);
			$$("car_brands").clearAll();

			var arrays = [];
			if(data){
				for(var i=0;i<data.length;i++){
					arrays.push({id:data[i].brand_type,"name":data[i].brand_name});
				}
			}
			$$("car_brands").parse(arrays);
		//	var datas = $$("car_brands").getData();

		});

		base.getReq("/v1/api/app_packages/enable_client.json",function(data){
		},function(data){
		});
	};

	var parse_check_data = function(obj,arrs){
		obj.$check = false;
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]['id']===obj['id']){
				obj.$check=true;
				break;
			}
		}
		return obj;
	};

	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").hide();
			webix.$$("title").parse({title: "车辆限行管理", details: "限行管理"});
			init_data();
		}
	};
});