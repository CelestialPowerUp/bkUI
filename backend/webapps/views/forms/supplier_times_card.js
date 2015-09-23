define(["views/modules/base"],function(base){

	var callback = "";

	var elements = [
		{view:"text",id:"times_card_product_id",name:"times_card_product_id",hidden:true},
		{view:"text",id:"supplier_id",name:"supplier_id",hidden:true},
		{view: "richselect", id:"store_ware_id",name:"store_ware_id",options:[],label:"关联单品",placeholder:"请选择关联单品",width:350,required:true},
		{view: "text", label:"次卡名称",name:"times_card_product_name", placeholder: "请输入次卡名称",width:350,required:true},
		{view: "text", label:"总价",name:"total_price", placeholder: "请输入总价",width:350,value:"",required:true},
		{view: "text", label:"购买数量",name:"buy_amount", placeholder: "请输入购买数量",width:350,value:"",required:true},
		{view: "text", label:"赠送数量",name:"send_amount", placeholder: "请输入养爱车赠送的数量",width:350,value:"",required:true}
	];

	var from_ui = {
		id:"form_view",
		view:"form",
		elementsConfig:{
			labelWidth: 80
		},
		elements:elements,
		rules:{
			"total_price":webix.rules.isNumber,
			"buy_amount":webix.rules.isNumber,
			"send_amount":webix.rules.isNumber
		}
	};

	var button_ui = {margin:20,cols:[{},{view:"button",label:"确定",width:80,click:function(){
		if (!$$("form_view").validate()){
			base.$msg.error("请输入正确的参数");
			return;
		}
		var formdata = $$("form_view").getValues();
		var action = "/v2/api/supplier/times_card/update.json";
		if(formdata.times_card_product_id===""){
			action = "/v2/api/supplier/times_card/create.json";
		}
		base.postReq(action,formdata,function(){
			webix.message("单品数据提交成功");
			if(typeof(callback)==='function'){
				callback();
			}
			webix.$$("model_win").close();
		});
	}},
		{view:"button",label:"取消",width:80,click:function(){
			webix.$$("model_win").close();
		}}]
	};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"编辑次卡信息",
			body:{
				type:"space",
				rows:[from_ui,button_ui]
			}
		};
	
	var init_data = function(times_card){
		base.getReq("/v2/api/store/ware_list_by_type.json?ware_type_code=times_card",function(wares){
			console.log(wares);
			var list = $$("store_ware_id").getPopup().getList();
			list.clearAll();
			for(var i=0;i<wares.length;i++){
				list.add({id:wares[i].ware_id,value:wares[i].ware_name+"("+wares[i].product_name+" ￥"+wares[i].ware_mark_price+")"});
			}
			if(typeof(times_card)==='undefined'|| times_card===null){
				$$("supplier_id").setValue(base.get_url_param("id"));
				return;
			}
			$$("form_view").parse(times_card);
		});
	};

	var add_callback = function(func){
		callback = func;
	};
	
	return {
		$ui:layout,
		$init_data:init_data,
		$add_callback:add_callback
	}

});