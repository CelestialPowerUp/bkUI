define(["views/modules/base"],function(base){

	var __call_back = null;

	var form_ui = {
		view:"form",
		id:"form",
		elementsConfig:{
			labelWidth: 100,
			width:450
		},
		rows: [
			{ view:"text",id:"id",name:"id",hidden:true,required:true},
			{ view:"richselect", id:"pay_channel",name:"pay_channel",options:[{"id":"alipay",value:"支付宝费率"},{"id":"wx",value:"微信费率"}],label:"费种:",required:true,placeholder:"",value:"alipay"},
			{ view:"text", label:'费率:', name:"rate",placeholder: "费率",value:"",required:true},
			{ view:"datepicker", timepicker:false,editable:true, label:"开始时间:",id:"start_time", name:"start_time", stringResult:true,required:true, format:"%Y-%m-%d"  },
			{ view:"datepicker", timepicker:false,editable:true, label:"结束时间:",id:"end_time", name:"end_time", stringResult:true, format:"%Y-%m-%d" },
		]
	};

	var button_ui = {
		margin:15,
		cols:[
			{},
			{view:"button",label:"提交",width:80,click:function(){
				if($$("form").validate()){
					var formdata = $$("form").getValues();
					if(formdata.start_time==''){
						webix.message({type:"error",expire:5000,text:"请选择开始时间"});
						return;
					}
					console.log($$("start_time").getValue());
					var start_time = base.format_time($$("start_time").getValue());
					formdata.start_time = start_time;
					if(formdata.end_time){
						formdata.end_time = base.format_time($$("end_time").getValue());
					}

					var action = "/v1/api/pay_rate/create.json";
					if(formdata.id){
						action = "/v1/api/pay_rate/update.json";
					}

					base.postReq(action,formdata,function(data){
						if(typeof __call_back === 'function'){
							__call_back(data);
						}
						webix.$$("pay_rate_win").close();
					});
				}
			}}
		]
	};

	var win_ui = {
			view:"window",
			modal:true,
			id:"pay_rate_win",
			position:"center",
			head:{
				view:"toolbar",height:40, cols:[
					{view:"label", label: "操作窗口" },
					{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('pay_rate_win').close();"}
				]},
			body:{
				cols:[
					{
						rows:[
							form_ui,{},button_ui
						]
					}
				]
			}
		};

	var init_data = function(app_id){
		if(app_id){
			var url = "/v1/api/pay_rate/"+app_id+".json";
			base.getReq(url,function(data){
				data.start_time = base.$show_time_sec(data.start_time);
				data.end_time = base.$show_time_sec(data.end_time);
				$$("form").parse(data);
			});
		}
	};

	return {
		$ui:win_ui,
		$init_data:init_data,
		$add_call_back:function(func){
			__call_back = func;
		}
	};
});