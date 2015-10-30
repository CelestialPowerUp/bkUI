define(["views/modules/base"],function(base){

	var gl_order_id = null;

	var elment = [
		{ id:"payment_id",header:"payment_id",hidden:true, width:150},
		{ id:"channel",header:"支付渠道",editor:"text",width:100},
		{ id:"price",header:"支付金额",editor:"text",format:base.priceFormat,width:100},
		{ id:"paid",header:"退款状态",template:function(obj){
			if(!obj.paid){
				return "<span class='status status0'>未支付项</span>";
			}
			if(obj.refund_status===0&&obj.paid){
				return "<span class='status status0'>待退款</span>"
			}
			if(obj.refund_status===1){
				return "<span class='status status1'>退款成功</span>"
			}
			if(obj.refund_status===2){
				return "<span class='status status2'>退款中...</span>"
			}
			return "";
		},width:80},
		{ id:"refund_type",header:"退款项",template:function(obj,common){
			if(!obj.paid){
				return "";
			}
			if(obj.refund_status===1){
				return "<span class='status status1'>退款成功</span>";
			}
			if(obj.source !== 'pingxx' || obj.price===0){
				//线下只能线下人工退款
				obj.refund_type = (typeof(obj.refund_type) === 'undefined')?0:obj.refund_type;
				return common.checkbox(obj, common, obj.refund_type,{checkValue:0})+"线下";
			}
			//线上同时支持线上和线下退款
			obj.refund_type = (typeof(obj.refund_type) === 'undefined')?1:obj.refund_type;
			return common.checkbox(obj, common, obj.refund_type,{checkValue:1})+"线上"+common.checkbox(obj, common, obj.refund_type,{checkValue:0})+"线下";
		},width:120},
		{ id:"tip",header:"退款信息",editor:"text",width:200},
		{ id:"confirm_url",header:"退款确认",template:function(obj){
			if(typeof obj.confirm_url !=='undefined' && obj.confirm_url!==''){
				return "<a target='_blank' href='"+obj.confirm_url+"'>密码确认</a>";
			}
			return "";
		},editor:"text",width:95}
	]

	var countPrice = function(){
		var param = {total_refund:0,unrefund:0,wait_refund:0,refund:0,wait_refund_online:0,wait_refun_offline:0};
		$$("refund_list").eachRow(function(row){
			var item = $$("refund_list").getItem(row);
			if(item.refund_status===1){//已退款
				param.refund += param.refund+item.price*1;
			}else{//未退款
				param.unrefund += param.unrefund+item.price*1;
				if(item.refund_type===1){
					param.wait_refund_online += param.wait_refund_online+item.price*1;
				}
				if(item.refund_type===0){
					param.wait_refun_offline += param.wait_refun_offline+item.price*1;
				}
			}
			param.total_refund += param.total_refund+item.price*1;
		});
		param.wait_refund = param.wait_refund_online + param.wait_refun_offline;
		$$("price_show").parse(param);
	};

	var refund_list_ui = {
		id:"refund_list",
		view:"datatable",
		headerRowHeight:35,
		autoConfig:true,
		autowidth:true,
		checkboxRefresh:true,
		hover:"myhover",
		scrollY:true,
		columns:elment,
		on:{"onCheck":function(){
			countPrice();
		}},
		data:  []
	};

	var button_ui ={
		cols:[
			{},
			{ view:"text",type:"password",id:"password", name:"password",width: 180, placeholder: "请输入退款密码",value : "",keyPressTimeout:500,on:{
				"onTimedKeyPress":function(){
					//验证密码
					var password = $$("password").getValue();
					if(password.length>=6){
						base.postForm("user/refund/password/confirm.json",{password:password},function(data){
							base.$msg.info(data);
							$$("send_refund").enable();
							$$("send_refund").refresh();
						});
					}else{
						$$("send_refund").disable();
						$$("send_refund").refresh();
					}
				}}
			},
			{ view: "button", type: "iconButton",id:"send_refund", icon: "fa fa-money",disabled:true, label: "发起退款", width: 120,click:function(){
				$$("password").setValue("");
				$$("send_refund").disable();
				$$("send_refund").refresh();
				var param = {};
				param.refunds = [];
				$$("refund_list").eachRow(function(row){
					var item = $$("refund_list").getItem(row);
					var stype = 0;
					if(item.refund_type===0 || item.refund_type ===1){
						stype = item.refund_type === 0?2:item.refund_type;
						param.refunds.push({payment_id:item.payment_id,type:stype});
					}
				});
				base.$msg.info("正在发送退款请求，请稍等...");
				base.postReq("order/pingxx/refund.json",param,function(data){
					base.$msg.info("退款请求处理成功");
					var results = data.refunds
					for(var i=0;i<results.length;i++){
						var item = $$("refund_list").getItem(results[i].payment_id);
						item.tip = results[i].tip;
						if(typeof(results[i].extra)!=='undefined' && results[i].extra!==null){
							var arr = results[i].extra.split(":");
							arr.shift();
							item.confirm_url = arr.join(":");
						}
						$$("refund_list").refresh();
					}
				},function(){
				});
			}}
			/*{ view: "button", type: "iconButton", icon: "fa fa-refresh", label: "刷新数据", width: 120,click:function(){
				refresh_data();
			}}*/
		]
	}

	var note_ui = {view:"label", align:"left",css:"warning", label:"注：支付宝渠道发起退款请求后需要打开连接填写密码确认退款",height:30};

	var refresh_data = function(){
		base.getReq("order/"+gl_order_id+"/pay_info.json",function(data){
			base.$msg.info("数据加载成功");
			var params = [];
			for(var i=0;i<data.pay_records.length;i++){
				if(data.pay_records[i].paid){
					data.pay_records[i].id = data.pay_records[i].payment_id;
					params.push(data.pay_records[i]);
				}
			}
			$$("refund_list").parse(params);
			setTimeout( function(){
				countPrice();
			},1000);
		});
	};

	var init_data = function(order_id){
		gl_order_id = order_id;
		refresh_data();
	}

	return {
		$ui:{
			view:"window",
			modal:true,
			id:"refund_win",
			height:450,
			position:"center",
			head:{
				view:"toolbar",height:40, cols:[
				{view:"label", label: "退款详单" },
				{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('refund_win').close();"}
			]},
			body:{
				rows:[refund_list_ui,
					{
						id: "price_show",
						height: 35,
						template:"<div class='normal_text'><span>应退款：￥#total_refund#</span><span>未退款：￥#unrefund#</span><span>待退款：￥#wait_refund# ( 线上：￥#wait_refund_online# 线下：￥#wait_refun_offline# ) </span></div>",
						data: {total_refund:0,unrefund:0,wait_refund:0,refund:0,wait_refund_online:0,wait_refun_offline:0}
					},
					note_ui,button_ui]
			}
		},
		init_data:init_data
	};
});