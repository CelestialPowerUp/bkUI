define(["views/modules/base"],function(base){

	var elment = [
		//{ id:"source_number",header:"流水号", width:150},
		{ id:"channel",header:"支付渠道",editor:"text",width:100},
		{ id:"price",header:"支付金额",editor:"text",format:base.priceFormat,width:100},
		{ id:"refund_type",header:"退款项",template:function(obj,common){
			console.log(obj);
			if(obj.refund_status===1){
				return "<span class='status status1'>退款成功</span>";
			}
			if(obj.refund_status===2){
				return "<span class='status status2'>退款中....</span>";
			}
			if(obj.refund_status===0){
				if(obj.source === 'off_line'){
					//线下只能线下人工退款
					return common.checkbox(obj, common, obj.refund_type,{checkValue:true})+"线上";
				}
				//线上同时支持线上和线下退款
				return common.checkbox(obj, common, obj.refund_type,{checkValue:true})+"线上"+common.checkbox(obj, common, obj.refund_type,{checkValue:false})+"线下";
			}
		},width:120},
		{ id:"confirm_url",header:"退款密码确认地址",editor:"text",width:120}
	]

	var refund_list_ui = {
		id:"refund_list",
		view:"datatable",
		headerRowHeight:35,
		autoConfig:true,
		autowidth:true,
		hover:"myhover",
		scrollY:true,
		columns:elment,
		data:  [
			{
				"source": "pingxx",
				"channel": "alipay",
				"price": 0.01,
				"paid": true,
				"payment_id": 13478,
				"source_number": "ch_rfDynPbnHqfDaDaTW1mrTaTK",
				"refund_status": 1
			},
			{
				"source": "off_line",
				"channel": "线下",
				"price": 0.01,
				"paid": true,
				"payment_id": 13478,
				"source_number": "ch_rfDynPbnHqfDaDaTW1mrTaTK",
				"refund_status": 0
			},
			{
				"source": "pingxx",
				"channel": "alipay",
				"price": 0.01,
				"paid": true,
				"payment_id": 13478,
				"source_number": "ch_rfDynPbnHqfDaDaTW1mrTaTK",
				"refund_status": 2
			},
			{
				"source": "pingxx",
				"channel": "wx",
				"price": 0.01,
				"paid": true,
				"payment_id": 13478,
				"source_number": "ch_rfDynPbnHqfDaDaTW1mrTaTK",
				"refund_status": 0
			}
		]
	};

	var button_ui ={
		cols:[
			{},
			{ view: "button", type: "iconButton", icon: "fa fa-money", label: "发起退款", width: 120,click:function(){
			}}
		]
	}

	var note_ui = {view:"label", align:"left",css:"warning", label:"注：支付宝渠道发起退款请求后需要打开连接填写密码确认退款",height:30};

	return {
		$ui:{
			view:"window",
			modal:true,
			id:"refund_win",
			height:350,
			position:"center",
			head:{
				view:"toolbar",height:40, cols:[
				{view:"label", label: "退款详单" },
				{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('refund_win').close();"}
			]},
			body:{
				rows:[refund_list_ui,note_ui,button_ui]
			}
		}
	};
});