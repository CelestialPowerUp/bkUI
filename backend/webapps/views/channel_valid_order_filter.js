/**
 * Created by wangwr on 2015/5/26.
 */
define(["views/modules/base"],function(base){

	var update_channel_select =  function(){
		var list = $$("channel_id").getPopup().getList();
		list.clearAll();
		base.getReq("channels.json?all=true",function(data){
			for(var i=0;i<data.length;i++){
				list.add({id:data[i].channel_id,value:data[i].channel_name});
			}
		});
	};

	var search_orders = function(){
		var param = search_value();
		if(param===null){
			return;
		}
		base.getReq("orders/channel.json?"+search_value(),function(data){
			$$("order_table").clearAll();
			$$("order_count_info").parse({order_count:data.length});
			for(var i=0;i<data.length;i++){
				$$("order_table").add(data[i]);
			}
		});
	};

	var search_value = function(){
		var channel_id = $$("channel_id").getValue();
		var start_time = $$("start_time").getValue();
		var end_time = $$("end_time").getValue();
		if(channel_id==="" || start_time ==="" || end_time === ""){
			return null;
		}
		return "channel_id="+channel_id+"&start_time="+base.$to_day(start_time)+"&end_time="+base.$to_day(end_time);
	};

	var base_header = {
		margin:15,
		cols:[
			{view: "richselect",id:"channel_id",label:"选择渠道：",options:[],placeholder:"请选择渠道商",width:250,
				on:{"onAfterRender":function(){
					update_channel_select();

				},
				"onChange":function(n,o){
					search_orders();
				}}
			},
			{view:"datepicker", timepicker:true, label:"起始时间：", id:"start_time", stringResult:true, format:"%Y-%m-%d" ,width:250,
				on:{
					"onChange":function(n,o){
						search_orders();
					}
				}
			},
			{view:"datepicker", timepicker:true, label:"结束时间：", id:"end_time", stringResult:true, format:"%Y-%m-%d" ,width:250,
				on:{
					"onChange":function(n,o){
						search_orders();
					}
				}
			},
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
			webix.$$("title").parse({title: "渠道管理", details: "渠道有效单筛选"});
		}
	};
});
