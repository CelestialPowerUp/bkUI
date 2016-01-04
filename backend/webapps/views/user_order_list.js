define(["models/order",
        "views/forms/order_product",
        "views/modules/base",
		"views/modules/table_page_m"], function(order,product,base,table_page){

	var form_ui = {
		view: "form",
		id: "form",
		elementsConfig:{
			labelWidth: 80
		},
		scroll: false,
		elements:[
			//搜索区
			{
				view:"toolbar",css: "highlighted_header header5",height:40,width:1200,
				elements:[
					{view:"label", align:"left",label:"基本信息",height:30},
					{view: "text",keyPressTimeout:100, id: "search_phone_number",value:"", placeholder: "输入手机号",width:150,on:{
						"onTimedKeyPress":function(){
							if($$("user_phone_number").getValue().length==11){
								load_user_info();
							}
						}
					}},
					{ view: "button", label: "查询", width: 80,click:function(){
						load_user_info();
					}}
			]},

			//隐藏域
			{view:"text",id:"user_id",name:"user_id",hidden:true,width:150},

			{
				view:"dataview",
				id:"user_info",
				scroll: false,
				select:false,
				click:false,
				height:100,
				type:{
					width:1200,
					height: 200,
					template:"<div>" +
					"<div class='webix_strong'>姓名：#user_name#</div>" +
					"<div class='webix_strong'>电话：#phone#</div>" +
					"<div class='webix_strong'>性别：#gender_value#</div>" +
					"</div>"
				}
			},
		]
	};

	/*获取地址栏参数*/
	var getRequestParam = function(){
		var params = base.get_url_params();
		var phone_number = params.phone_number;
		if(phone_number){
			phone_number = phone_number.replace("&","");
			if(phone_number && phone_number.length==11){
				$$("search_phone_number").setValue(phone_number);

				load_user_info();
			}
		}
	};

	/*获取用户信息*/
	var load_user_info = function(){
		base.getReq("meta_user/"+$$("search_phone_number").getValue(),function(data){
			$$("user_info").clearAll();
			$$("user_id").setValue(null);

			$$("user_id").setValue(data["user_id"]);
			$$("user_info").parse(data);

			//获取用户订单
			search(1);
		},function(data){
		});
	};

	/*分页相关*/
	var cur_page = 1;
	function get_page_url(){
		var page_url = '';
		if(cur_page){
			page_url = "&page="+cur_page
						+"&page_size=10";
		}
		return page_url;
	};

	/*查询订单*/
	var search = function(page){
		if(page){
			cur_page = page;
		}

		var user_id = $$("user_id").getValue();
		if(!user_id){
			return;
		}
		var action = "/v1/api/all_orders.json?r=p&user_id="+user_id+get_page_url();
		base.getReq(action,function(data){
			if(!data){
				webix.message("该用户无订单");
				return;
			}
			parse_table_data(data);
		});
	};

	var columns = [
		{id:"number",header:["订单号", {content:"textFilter"} ], width:160},
		{id:"create_time",header:["下单时间"], width:150,template:function(obj){return base.$show_time_sec_double(obj.place_time)}},
		{id:"customer_name",hidden:true, header:["联系人", {content:"textFilter"} ], sort:"string"},
		{id:"customer_phone_number",hidden:true,header:["联系人手机", {content:"textFilter"} ],width:120, sort:"string"},
		{id:"car_number", header:["车牌号", {content:"textFilter"} ], sort:"string"},
		{id:"service_Type",hidden:true,header:"服务类型",sort:"string",template:function(obj){
			if(obj.service_Type=="self"){
				return "<span class='status status1'>自驾到店</span>";
			}
			return "<span class='status status2'>管家接车</span>";
		}},
		//{id:"car_model", header:"车型号", sort:"string",width:380,fillspace:1},
		{id:"keeper", header:["管家", {content:"textFilter"} ], width:90},
		{id:"supplier_mold",hidden:true,header:"店类型",sort:"string",template:function(obj){
			if(obj.supplier_mold=="comprehensive"){
				return "<span class='status status1'>综合店</span>";
			}
			return "<span class='status status2'>社区店</span>";
		}},
		{id:"operator", header:["客服", {content:"textFilter"} ], width:90},
		{id:"peer_source",hidden:true, header:"来源", width:90},
		{id:"paid",header:"支付状态",sort:"string",width:85,template:function(obj){
			if(obj.pay_status==1){
				return "<span class='status status1'>已支付</span>";
			}
			if(obj.pay_status==2){
				return "<span class='status status0'>未支付</span>";
			}
			if(obj.pay_status==3){
				return "<span class='status status2'>部分支付</span>";
			}
			return "未知";
		}},
		{id:"refund_status_value",header:"退款状态",width:85,sort:"string"},
		{id:"disabled",header:"是否删除",sort:"string",width:85,template:function(obj){
			if(obj.disabled){
				return "<span class='status status0'>已删除</span>";
			}
			return "<span class='status status1'>未删除</span>";
		}},
		{id:"order_status_value", header:["订单状态", {content:"textFilter"} ], width:90},
		//{id:"place_time", header:"下单时间",sort:"string",width:210},
		{id:"place_time", header:"接车时间",sort:"string",template:function(obj){
			return base.time_period_format(obj.pick_start_time,obj.pick_end_time);
		},width:210}
	];

	var order_colums = webix.copy(columns);
	order_colums.splice(0,0,{id:"trash", header:"操作",width:90, template:"<span><u class='views row_button'>查看</u><u class='edit row_button'> 编辑</u><!--<u class='call row_button'> 呼叫 </u>--></span>"});

	var onClick = {
		"views":function(e,id,node){
			var item = this.getItem(id);
			this.$scope.show("/order_details:id="+id);
		},
		"edit":function(e,id,node){
			var item = this.getItem(id);
			this.$scope.show("/order_edit:id="+id);
		},
		"pick":function(e,id,node){
			var item = this.getItem(id);
			webix.confirm({
				text:"认领该订单<br/> 确定?", ok:"是", cancel:"取消",
				callback:function(res){
					if(res){
						var p = {};
						p.id = item.id;
						p.operator_id = base.getUserId();
						base.postReq("order/operator_received.json",p,function(data){
							webix.$$("unbelong_order_table").remove(id);
							webix.$$("unprocessed_order_table").add(item);
						});
					}
				}
			});
		},
		"delete":function(e,id,node){
			var item = this.getItem(id);
			webix.confirm({
				text:"删除订单<br/> 确定?", ok:"是", cancel:"取消",
				callback:function(res){
					if(res){
						var p = [];
						p.push(item.id)
						base.postReq("orders/delete.json",p,function(data){
							$$("unbelong_order_table").remove(id);
							$$("unprocessed_order_table").remove(id);
							$$("processed_order_table").remove(id);
						});
					}
				}
			});
		},
		"call":function(e,id,node){
		}
	};

	var order_table = {
		id:"order_table",
		view:"datatable",
		autoConfig:true,
		scrollX:true,
		select:false,
		leftSplit:1,
		autoheight:true,
		hover:"myhover",
		columns:order_colums,
		onClick:onClick
	};

	var order_page_table = table_page.$create_page_table("order_page_list",order_table);

	var page_call_back = function(page){
		search(page);
	};

	var parse_table_data = function(pages){
		var items = pages.items;
		$$("order_table").clearAll();
		for(var i=0;i<items.length;i++){
			$$("order_table").add(items[i]);
		}
		table_page.$update_page_items("order_page_list",pages);
		table_page.$add_page_callback(page_call_back);
	};

	/*初始化数据*/
	var init_data = function(){
		getRequestParam();
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
					order_page_table,
					{cols:[{},{}]}
				]
			},
			{}
		]
	};

	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "用户", details: "订单中心"});
			init_data();
		}
	};
});