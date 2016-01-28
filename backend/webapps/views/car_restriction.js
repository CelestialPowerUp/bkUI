define(["models/order",
        "views/forms/order_product",
        "views/modules/base",
        "views/forms/order_product",
        "views/forms/user_car_model",
        "views/order_details",
		"views/forms/supplier",
		"views/webix/baidumap"], function(order,product,base,order_product,user_car_model,order_details,supplier){


	var user_defined_option = {"true" : "自定义","false" : "非自定义"};

	var form_ui = {
		view: "form",
		id: "form",
		elementsConfig:{
			labelWidth: 80
		},
		scroll: false,
		elements:[
			//添加编辑区
			{
				view:"toolbar",css: "highlighted_header header5",height:40,width:820,
				elements:[
					{view:"label", align:"left",label:"添加规则",height:30}
			]},

			{view:"datepicker", timepicker:true, label:"日 期", name:"date",id:"date", stringResult:true, format:"%Y-%m-%d" ,width:300 // format:"%Y-%m-%d %H:%i:%s"
			},
			{
				view:"dataview",
				id:"numbers",
				select:"multiselect",
				height:100,
				width:100,
				scroll:false,
				template:"<div class='webix_strong'>#no_#</div>" ,
				data:[
					{id:0,no_:0},
					{id:1,no_:1},
					{id:2,no_:2},
					{id:3,no_:3},
					{id:4,no_:4},
					{id:5,no_:5},
					{id:6,no_:6},
					{id:7,no_:7},
					{id:8,no_:8},
					{id:9,no_:9}
				],
				on:{
					onItemClick:function(id, e, node){
						$$("numbers").select(id,false,true);
						return false;
					}
				}
			},

			//提交
			{cols:[{},{ view: "button",width:80,height:50,type: "iconButton", id:"commit_btn", icon: "plus", label: "提交",click:function(){
				submit();
			}}]},
		]
	};

	var custom_list_ui = {
		type:"clean",
		rows:[
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"自定义列表",height:30}
			]},
			{
				view:"datatable",
				id:"custom_list",
				columns:[
					{ id:"id",header:"ID",hidden:true,width:150},
					{ id:"date",header:"日期",width:250,format:base.$show_day},
					{ id:"numbers",header:"限行号码",width:250,fillspace:true},
					{ id:"trash", header:"操作", width:80, template:"<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
				],
				select:true,
				autoheight:true,
				onClick:{
					webix_icon:function(e,id,node){
						webix.confirm({
							text:"删除该限行信息<br/> 确定?", ok:"是", cancel:"取消",
							callback:function(res){
								if(res){
									var url = "/v1/api/car_restriction/"+id+"/delete.json";
									base.postReq(url,{},function(data){
										webix.message("限行信息删除成功");
										freshCustomList();
									},function(data){

									});
								}
							}
						});
					}
				}
			}
		]
	};

	var third_list_ui = {
		type:"clean",
		rows:[
			{view:"toolbar",css: "highlighted_header header5",height:40, elements:[
				{view:"label", align:"left",label:"第三方列表",height:30}
			]},
			{
				view:"datatable",
				id:"third_list",
				columns:[
					{ id:"id",header:"ID",hidden:true,width:150},
					{ id:"date",header:"日期",width:250,format:base.$show_day},
					{ id:"numbers",header:"限行号码",width:250,fillspace:true},
				],
				autoheight:true,
				select:true
			}
		]
	};

	var layout = {
		type:"space",
		margin:15,
		cols:[
			{},
			{
				type:"wide",
				borderless:true,
				rows:[
					form_ui,
					custom_list_ui,
					third_list_ui,
					{cols:[{},{}]}
				]
			},
			{}
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
	var init_url_param = function(){
		freshCustomList();
		freshThirdList();
	};

	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "车辆限行管理", details: "限行管理"});
			init_url_param();
		}
	};
});