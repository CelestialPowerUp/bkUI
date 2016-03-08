/**
 * Created by wangwr on 2015/5/26.
 */
define(["views/modules/base"],function(base){

	var update_channel_select =  function(){
		var list = $$("channel_code").getPopup().getList();
		list.clearAll();
		base.getReq("channels.json?all=true",function(data){
			for(var i=0;i<data.length;i++){
				list.add({id:data[i].channel_code,value:data[i].channel_name});
			}
		});
	};

	var search_orders = function(){
		var param = search_value();
		if(param===null){
			return;
		}
		base.getReq("orders/channel_by_code.json?"+search_value(),function(data){
			base.$msg.info("检索成功 有效单数 "+data.length);
			$$("order_table").clearAll();
			$$("order_count_info").parse({order_count:data.length});
			for(var i=0;i<data.length;i++){
				$$("order_table").add(data[i]);
			}
		});
	};

	var search_value = function(){
		var channel_code = $$("channel_code").getValue();
		var start_time = $$("start_time").getValue();
		var end_time = $$("end_time").getValue();
		if(channel_code==="" || start_time ==="" || end_time === ""){
			base.$msg.error("查询参数不能为空");
			return null;
		}
		return "channel_code="+channel_code+"&start_time="+base.$to_day(start_time)+"&end_time="+base.$to_day(end_time);
	};

	var base_header = {
		margin:15,
		cols:[
			{view: "text",id:"channel_code",label:"渠道编码：",options:[],placeholder:"请输入渠道编码",width:250},
			{view:"datepicker", timepicker:true, label:"起始时间：", id:"start_time", stringResult:true, format:"%Y-%m-%d" ,width:200,
				on:{
					"onChange":function(n,o){
						search_orders();
					}
				}
			},
			{view:"datepicker", timepicker:true, label:"结束时间：", id:"end_time", stringResult:true, format:"%Y-%m-%d" ,width:200,
				on:{
					"onChange":function(n,o){
						search_orders();
					}
				}
			},
			{view:"button",css:"webix-button", timepicker:true, label:"查询", width:85,on:{
				"onItemClick":function(){
					search_orders();
				}
			}},
			{}
		]
	}

	var columns = [
		{id:"number", header:"订单号", width:210},
		{id:"price", header:"订单金额",width:210, sort:"string"},
		{id:"sub_channel_name", header:"来源渠道",width:210, sort:"string"},
		{id:"place_time", header:"下单时间",sort:"string",width:210}
	];

	var table_list = {
		id:"order_table",
		view:"datatable",
		//autoConfig:true,
		scrollX:true,
		autowidth:true,
		autoheight:true,
		select:true,
		leftSplit:1,
		columns:columns,
		hover:"myhover"
	};

	var order_count_info_ui = {
		id:"order_count_info",
		height:50,
		template:"<div>"+
		"<div class='big_strong_text'>有效期内订单数：#order_count#</div>"+"</div>",
		data:{order_count:0}
	};

	var layout = {
		margin:20,
		type:"space",
		rows:[base_header,{cols:[{rows:[table_list,order_count_info_ui]},{}]}]
	};

	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "渠道", details: "渠道有效单查询"});
			var code = base.get_url_param("code");
			if(typeof (code) !== 'undefined'){
				$$("channel_code").setValue(code);
			}
		}
	};
});
