define([
        "views/modules/base",
		"views/windows/store_wares_win",], function(base,store_wares_win){

	/*控制可选版本选择按钮*/
	var button_ui = {cols:[
		{},{},{},
		{view:"button",label:"全选",width:80,click:function(){
			var datas = $$("app_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = true;
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("app_list").refresh();
		}},
		{view:"button",label:"全不选",width:80,click:function(){
			var datas = $$("app_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = false;
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("app_list").refresh();
		}},
		{view:"button",label:"反选",width:80,click:function(){
			var datas = $$("app_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = !(datas[i].$check);
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("app_list").refresh();
		}}
	]};

	/*控制推送用户选择按钮*/
	var chosen_users_check_button_ui = {cols:[
		{},{},{},
		{view:"button",label:"全选",width:80,click:function(){
			var datas = $$("user_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = true;
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("user_list").refresh();
		}},
		{view:"button",label:"全不选",width:80,click:function(){
			var datas = $$("user_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = false;
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("user_list").refresh();
		}},
		{view:"button",label:"反选",width:80,click:function(){
			var datas = $$("user_list").serialize();
			for(var i=0;i<datas.length;i++){
				try{
					datas[i].$check = !(datas[i].$check);
				}catch(e){
					console.log(datas[i]);
				}
			}
			$$("user_list").refresh();
		}}
	]};

	/*控制车品牌选择按钮*/
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

	/*搜索用户*/
	var search_user_button_ui = {cols:[
		{view:"button",label:"根据所选品牌筛选用户",click:function(){
			$$("user_list").clearAll();
			var selectedCarBrandIds = $$("car_brands").getSelectedId();
			if(!selectedCarBrandIds){
				webix.message({ type:"error",expire:5000,text:"想选用户？好歹选点车吧。" });
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

			//获取符合条件用户信息
			var url_get_users = "/v1/api/push_to_be_chosen_users.json";
			var param = carBrandIds;
			base.postReq(url_get_users,param,function(data){
				var chosen_users = [];
				var final_chosen_users = [];
				if(data && data instanceof Array){
					/*获取已选择版本*/
					var selectedAppVersions = [];
					var datas = $$("app_list").serialize();
					for(var i=0;i<datas.length;i++){
						try{
							if(datas[i].$check===true){
								var app_info = datas[i].os_type+" "+datas[i].app_version;
								selectedAppVersions.push(app_info);
							}
						}catch(e){
							console.log(datas[i]);
						}
					}
					if(selectedAppVersions.length<1){
						webix.message({type:"error",expire:5000,text:"亲，建议您先至少选一个版本，否则推给谁？"});
						return;
					}


					if(edit_push_info_users.length>0){//编辑页面
						chosen_users = chosen_users.concat(edit_push_info_users);
					}
					for(var i=0;i<data.length;i++){
						if(edit_push_info_users.length>0){//编辑页面
							if(base.$array_contains(edit_push_info_user_ids,data[i].user_id)){//如果已经存在于编辑之前的用户列表中，则跳过该条用户信息
								continue;
							}
							data[i].$check=true;
							data[i].user_type = "new";
							chosen_users.unshift(data[i]);
						}else{
							data[i].$check=true;
							chosen_users.push(data[i]);
						}
					}
					/*过滤掉版本不匹配*/
					for(var i=0;i<chosen_users.length;i++){
						var app_version_array = chosen_users[i].app_versions.split(",");
						if( array_has_intersection(selectedAppVersions,app_version_array)){
							final_chosen_users.push(chosen_users[i]);
						}
					}
				}
				if(final_chosen_users.length<1 ){
					webix.message({type:"info",expire:5000,text:"没有符合条件的用户。 换换品牌和推送版本试试"});
					return ;
				}
				$$("user_list").parse(final_chosen_users);
			},function(data){
			});
		}}
	]};

	/*判断两数组是否有交集*/
	var array_has_intersection = function(array1,array2){
		if(!array1 || !array2){
			return false;
		}
		if( (array1 instanceof Array) && (array2 instanceof Array) ){
			for(var i=0;i<array1.length;i++){
				var tmp = array1[i];
				for(var j=0;j<array2.length;j++){
					if(tmp == array2[j] ){
						return true;
						break;
					}
				}
			}
		}else{
			return false;
		}
	};

	/*选择单品后回显数据*/
	store_wares_win.$add_callback(function(ware){
		$$("store_product").setValue(ware.ware_name+"("+ware.product_name+")");
		$$("push_open_target_params").setValue(ware.ware_id);
	});

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

			{ view:"datepicker", timepicker:true, label:"推送时间:",id:"plan_push_time", name:"plan_push_time", stringResult:true,required:true, format:"%Y-%m-%d %H:%i" ,width:350 },
			{ view:"textarea",label:"推送内容:", name:"push_content",id:"push_content",height:100,required:true,placeholder:"推送内容",value:"" },
			{ view:"text", id:"push_open_target_description",name:"push_open_target_description",label:"划开描述:",required:true,placeholder:"划开内容简介",value:""},
			{ view:"text", id:"push_open_target_params",name:"push_open_target_params",label:"划开参数:",required:true,placeholder:"",readonly:true,disabled:true,value:"",hidden:false},
			{ view:"richselect", id:"push_open_target_type",name:"push_open_target_type",
				options:[
					{"id":"h5",value:"H5页面"},
					{"id":"store_product",value:"单品"}
				],
				label:"划开目标:",required:true,placeholder:"划开目标",value:"h5",
				on:{
					onChange:function(newv, oldv){
						$$("push_open_target_params").setValue('');
						if(newv=='store_product'){
							$$("h5_url").setValue('');
							$$("h5_url").hide();

							$$("store_product").show();
						}
						if(newv=='h5'){
							$$("store_product").setValue('');
							$$("store_product").hide();

							$$("h5_url").show();
						}
					}
				}
			},
			{ view:"text", id:"h5_url",name:"h5_url",label:"H5地址:",required:true,placeholder:"H5地址",value:"",keyPressTimeout:100,on:{
				"onTimedKeyPress":function(obj){
					$$("push_open_target_params").setValue($$("h5_url").getValue());

				}
			}},
			{view: "text", label:"单品",id:"store_product", name:"store_product",placeholder: "单击选择可选单品",readonly:true,hidden:true,click:function(){
				//单品
				webix.ui(store_wares_win.$ui).show();
			}},
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
				id:"app_list",
				height:200,
				width:650,
				type: {
					height: 35,
					marker: function(obj){
						return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
					},
					check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
					template: function(obj,type){
						return "<span class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.os_type+"  "+obj.app_version+" ( "+obj.app_name+" ) </span>"
								+"<span class='hidden'>"+obj.id+"</span>";
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
					//筛选用户
					search_user_button_ui,
					car_brand_check_button_ui
				],hidden:false},
			{
				view:"dataview",
				id:"car_brands",
				select:"multiselect",
				height:200,
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

			//用户列表
			{
				view:"toolbar",css: "highlighted_header header5",height:40,width:820,
				elements:[
					{view:"label", align:"left",label:"用户列表",height:30},
					chosen_users_check_button_ui
				],hidden:false},
			{
				view: "list",
				css: "tasks_list",
				id:"user_list",
				height:200,
				width:650,
				type: {
					height: 35,
					marker: function(obj){
						return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
					},
					check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
					template: function(obj,type){
						return "<span class='"+(obj.$check?"":"")+"'>"+type.check(obj)
								+"<span class='view_list_item'>"+obj.user_name+"</span>"
								+"<span class='view_list_item'>"+obj.phone_number+"</span>"
								+"<span class='view_list_item'>"+obj.app_versions+"</span>"
								+"<span class='view_list_item color_red'>"+ (obj.user_type ? obj.user_type :"") +"</span>" //是新搜索出来的，还是已经在库中的
								+"<span class='view_list_item hidden'>"+obj.user_id+"</span>";
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

			//提交
			{cols:[{},{ view: "button",width:80,height:50,type: "iconButton", id:"commit_btn", icon: "plus", label: "提交",click:function(){
				submit(this);
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

	/*保存数据*/
	var submit = function(view){
		//基本信息
		var formData = $$("form").getValues();
		/*推送时间*/
		if(formData.plan_push_time==''){
			webix.message({type:"error",expire:5000,text:"请选择推送时间"});
			return;
		}
		var plan_push_time = base.format_time($$("plan_push_time").getValue());
		formData.plan_push_time = plan_push_time;

		/*所选版本*/
		var appIds = [];
		var appVersions = [];
		var datas = $$("app_list").serialize();
		for(var i=0;i<datas.length;i++){
			if(datas[i].$check){
				appIds.push(datas[i].id);
				appVersions.push(datas[i].os_type+" "+datas[i].app_version);
			}
		}
		if(appIds.length<1){
			webix.message({type:"error",expire:5000,text:"请至少选一个版本"});
			return;
		}
		formData.push_version = appVersions.join(",");
		formData.app_ids = appIds;

		/*推送参数*/
		if(formData.push_open_target_params==''){
			webix.message({type:"error",expire:5000,text:"请填写划开内容信息"});
			return;
		}

		/*推送内容*/
		if(formData.push_content==''){
			webix.message({type:"error",expire:5000,text:"请填写推送内容"});
			return;
		}

		/*所选用户*/
		var userDatas = $$("user_list").serialize();
		var users = [];
		for(var i=0;i<userDatas.length;i++){
			if(userDatas[i].$check){
				var user = {};
				user.user_name = userDatas[i].user_name;
				user.phone_number = userDatas[i].phone_number;
				user.user_id = userDatas[i].user_id;
				user.app_versions = userDatas[i].app_versions;
				users.push(user);
			}
		}
		formData.users = users;

		$$("commit_btn").disable();

		var url = "/v1/api/push_info/create.json";
		if(edit_push_info_id){
			url = "/v1/api/push_info/update.json"
			formData.id = edit_push_info_id;
		}
		 base.postReq(url,formData,function(data){
			 webix.message({type:"info",expire:8000,text:"保存成功!由于用户数较多，保存需要较长时间，请稍后查看。"});
			 view.$scope.show("/push_info_list");
	     },function(data){
			 $$("commit_btn").enable();
		 });
	};

	/*重置form表单*/
	var restForm = function(){
		$$("form").clear();
		$$("numbers").selectAll();
		$$("numbers").select($$("numbers").getSelectedId(),false,true);
	};


	var edit_push_info_id = null;//编辑页面时。推送信息ID
	var edit_push_info_users = [];//编辑页面时，推送用户列表
	var edit_push_info_user_ids = [];//编辑页面时，推送用户ID数组

	/*初始化数据*/
	var init_data = function(){
		//TODO
		var id = base.get_url_param("id");
		var appIds = [];
		var appVersions = [];


		/*编辑状态*/
		if(id){
			edit_push_info_id = id;
			base.getReq("/v1/api/push_info/"+id+".json",function(data){
				data.plan_push_time = base.$show_time_sec(data.plan_push_time);

				if(data.push_open_target_type == 'h5'){
					data.h5_url = data.push_open_target_params;
					$$("h5_url").show();
				}
				if(data.push_open_target_type == 'store_product'){
					data.store_product = data.push_open_target_description;
					$$("store_product").show();
				}
				$$("form").parse(data);
				$$("push_open_target_params").setValue(data.push_open_target_params);

				var splitAppIds = data.push_app_ids.split(",");
				for(var i=0;i<splitAppIds.length;i++){
					appIds.push({id:splitAppIds[i]});
				}

				var splitAppVersions = data.push_version.split(",");
				for(var i=0;i<splitAppVersions.length;i++){
					appVersions.push(splitAppVersions[i]);
				}

				/*APP版本*/
				base.getReq("/v1/api/app_packages/enable_client.json",function(all){
					if(appIds.length>0){
						var data = [];
						for(var i=0;i<all.length;i++){
							data.push(parse_check_data(all[i],appIds));
						}
						$$("app_list").parse(data);
					}

					/*用户列表*/
					base.getReq("/v1/api/push_info/"+id+"/user_list.json",function(data){
						if(data && data instanceof Array){
							var push_info_users = [];
							for(var i=0;i<data.length;i++){
								data[i].$check=true;
								/*过滤掉版本不匹配*/
								var app_version_array = data[i].app_versions.split(",");
								if( array_has_intersection(appVersions,app_version_array)) {
									push_info_users.push(data[i]);
								}
								edit_push_info_user_ids.push(data[i].user_id);
								edit_push_info_users.push(data[i]);
							}
							$$("user_list").parse(push_info_users);
						}
					});
				});



			});
		}else{//添加状态

			/*APP版本*/
			base.getReq("/v1/api/app_packages/enable_client.json",function(all){
				var data = [];
				for(var i=0;i<all.length;i++){
					data.push(parse_check_data(all[i],all));
				}
				$$("app_list").parse(data);
			});
		}

		/*车品牌*/
		var url_car_brands = "/v1/api/meta_brands.json"
		base.getReq(url_car_brands,function(data){
			$$("car_brands").clearAll();

			var arrays = [];
			if(data){
				for(var i=0;i<data.length;i++){
					arrays.push({id:data[i].brand_type,"name":data[i].brand_name});
				}
			}
			$$("car_brands").parse(arrays);
		});
	};

	var parse_check_data = function(obj,arrs){
		obj.$check = false;
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]['id']==obj['id']){
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
			webix.$$("title").parse({title: "", details: ""});
			init_data();
		}
	};
});