define(["views/modules/base","views/modules/table_page_m",
	"views/forms/role_user","views/menus/call_out"], function(base,table_page,role_user,call_out){

	var initData = function(){
		search(cur_page);
	};

	/*分页相关*/
	var cur_page = 1;
	function get_page_url(){
		var page_url = '';
		if(cur_page){
			page_url = "&page="+cur_page;
		}
		return page_url;
	};

	var get_search_url = function(){
		var text = $$("search_text").getValue();
		var key = $$("filter_search").getValue();
		if(text!==''&& key!==''){
			return "&"+key+"="+text;
		}
		return "";
	}

	var search = function(page){
		if(page){
			cur_page = page;
		}
		var tabCheckId = $$("tabviewdata").getValue();
		var order_status = 0;
		var action = "/v3/api/orders.json?user_type=operator&operator_id="+base.getUserId()+"&page_size=16"+get_page_url()+get_search_url();
		if(tabCheckId === 'unbelong'){
			action += "&received=0";
		}
		if(tabCheckId==='unprocessed'){
			action += "&order_status=uncompleted";
		}
		if(tabCheckId==='processed'){
			action += "&order_status=completed";
		}
		base.getReq(action,function(data){
			parse_table_data(data);
		});
	};
	var page_call_back = function(page){
		search(page);
	};
	var parse_table_data = function(pages){
		var items = pages.items;
		var tabCheckId = $$("tabviewdata").getValue();
		$$(tabCheckId+"_order_table").clearAll();
		for(var i=0;i<items.length;i++){
			$$(tabCheckId+"_order_table").add(items[i]);
		}
		table_page.$update_page_items(tabCheckId+"_page_list",pages);
		table_page.$add_page_callback(page_call_back);
	};


	var paid_options = [{id:"true",value:"已支付"},{id:"false",value:"未支付"}];
	
	var columns = [
					{id:"number",header:["订单号", {content:"textFilter"} ], width:180},
					{id:"customer_name", header:["姓名", {content:"textFilter"} ], sort:"string"},
					{id:"customer_phone_number",header:["电话号码", {content:"textFilter"} ],width:120, sort:"string"},
					{id:"car_number", header:["车牌号", {content:"textFilter"} ], sort:"string"},
					{id:"car_model", header:"车型号", sort:"string",width:380,fillspace:1},
					{id:"keeper", header:["管家", {content:"textFilter"} ], width:150},
					{id:"operator", header:["客服", {content:"textFilter"} ], width:150},
					{id:"peer_source", header:"来源", width:90},
					{id:"paid",header:"支付状态",sort:"string",template:function(obj){
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
					//{id:"place_time", header:"下单时间",sort:"string",width:210},
					{id:"place_time", header:"接车时间",sort:"string",template:function(obj){
						return base.time_period_format(obj.pick_start_time,obj.pick_end_time);
					},width:210}
				];

	var custom_checkbox = function(obj, common, value){
		if (value)
			return "<div class='webix_table_checkbox'><span class='status status0'>选择√</span></div>"
		else
			return "<div class='webix_table_checkbox'><span class='status status1'>选择</span></div>";;
	};
	
	var unbelong_colums = webix.copy(columns);
	
	unbelong_colums.splice(0,0,{id:"trash", header:"操作",width:180, template:"<span><u class='views row_button'>查看</u><u class='edit row_button'> 编辑</u><u class='pick row_button'> 认领</u><u class='call row_button'> 呼叫 </u><u class='delete row_button'>删除</u></span>"});
	
	var unprocessed_colums = webix.copy(columns);

	//<u class='complate row_button'> 完成</u>
	unprocessed_colums.splice(0,0,{id:"trash", header:"操作",width:160,template:"<span><u class='views row_button'>查看</u><u class='edit row_button'> 编辑</u><u class='call row_button'> 呼叫 </u><u class='delete row_button'>删除</u></span>"});

	unprocessed_colums.splice(1,0,{id:"assign",header:"分配",width:65,template:custom_checkbox});
	
	var complated_colums = webix.copy(columns);
	complated_colums.splice(0,0,{id:"trash", header:"操作",width:180, template:"<span><u class='views row_button'>查看</u><u class='edit row_button'> 编辑</u><u class='call row_button'> 呼叫 </u><u class='delete row_button'>删除</u></span>"});
	
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
							base.postReq("/v3/api/order/update.json",p,function(data){
								webix.$$("unbelong_order_table").remove(id);
								webix.$$("unprocessed_order_table").add(item);
							});
						}
					}
				});
			},
			"complate":function(e,id,node){
				var item = this.getItem(id);
				webix.confirm({
					text:"该订单已完成<br/> 确定?", ok:"是", cancel:"取消",
					callback:function(res){
						if(res){
							var p = {};
							p.id = item.id;
							p.order_status = "complete";
							base.postReq("order/update.json",p,function(data){
								webix.$$("unprocessed_order_table").remove(id);
								webix.$$("processed_order_table").add(item);
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
				var phoneNumber = this.getItem(id).customer_phone_number;
				$$("call_out_submenu").show($$("call_out").getNode());
				$$("phone_number").setValue(phoneNumber);
				call_out.callOut();
			}
		};

	var unbelong_table = {
		id:"unbelong_order_table",
		view:"datatable",
		autoConfig:true,
		scrollX:true,
		select:true,
		leftSplit:1,
		columns:unbelong_colums,
		hover:"myhover",
		autoheight:true,
		onClick:onClick
	};

	var unprocessed_table = {
		id:"unprocessed_order_table",
		view:"datatable",
		autoConfig:true,
		scrollX:true,
		select:true,
		hover:"myhover",
		leftSplit:2,
		editable:true,
		checkboxRefresh:true,
		autoheight:true,
		columns:unprocessed_colums,
		onClick:onClick
	};

	var processed_table = {
		id:"processed_order_table",
		view:"datatable",
		autoConfig:true,
		scrollX:true,
		select:true,
		leftSplit:1,
		autoheight:true,
		hover:"myhover",
		columns:complated_colums,
		onClick:onClick
	};

	var unbelong_page_table = table_page.$create_page_table("unbelong_page_list",unbelong_table);

	var unprocessed_page_table = table_page.$create_page_table("unprocessed_page_list",unprocessed_table);

	var processed_page_table = table_page.$create_page_table("processed_page_list",processed_table);

	var tabview = {
			id:"tabviewdata",
			view:"tabview",
			borderless:true, 
			tabbar:{
		        optionWidth:120,
				click:function(){
					search(1);
				}
		    },
			cells:[
			       {
			    	   header:"未认领订单",
			    	   body:{
						   id:"unbelong",
						   rows:[
							   unbelong_page_table
						   ]
					   }
			       },
			       {
			    	   header:"未完成订单",
					   body:{
						   id:"unprocessed",
						   rows:[
							   unprocessed_page_table
						   ]
					   }
				   },
			       {
			    	   header:"已完成订单",
			    	   body:{
						   id:"processed",
						   rows:[
							   processed_page_table
						   ]
					   }
			       }
			]
	};

	var getChooseOrder = function(){
		var orders = $$("unprocessed_order_table").serialize();
		var choose_order = [];
		for(var i in orders){
			if(orders[i].assign===1){
				choose_order.push(orders[i]);
			}
		}
		return choose_order;
	}

	var filter_ui = {
		margin:0,
		css:".highlighted_header.header5",
		cols:[
			{view: "richselect", id:"filter_search",label:"订单查询:",labelWidth:80,options:[
				{id:"order_number",value:"订单号"},
				{id:"customer_name",value:"客户姓名"},
				{id:"customer_phone_number",value:"电话号码"},
				{id:"car_number",value:"车牌号码"},
				{id:"keeper_name",value:"管家姓名"}
			],placeholder:"选择关键字",width:250, on:{"onChange":function(n,o){
				search(1);
			}}
			},
			{view:"text",id:"search_text",width:250,placeholder:"输入查询关键字",keyPressTimeout:500,on:{
				onTimedKeyPress:function(){
					search(1);
				}
			}},
			{ view: "button", label: "查询", width: 50,click:function(){
				search(1);
			}},
			{},
			{ view: "button", label: "订单分配", width: 120,click:function(){
				this.$scope.ui(role_user.$ui).show();
				role_user.$init_data("UserRoles_Operators",[]);
				role_user.$add_callback(function(users){
					var user_length = users.length;
					if(user_length<=0){
						base.$msg.error("分配失败,未选择分配的客服");
						return;
					}
					var choose_order = getChooseOrder();
					var order_length = choose_order.length;
					if(order_length<=0){
						base.$msg.error("分配失败,未选择分配的订单");
						return;
					}
					var param = [];
					var user_index = 0;
					for(var i=0;i<choose_order.length;i++){
						param.push({order_id:choose_order[i].id,operator_id:users[user_index++].id});
						user_index = user_index<users.length?user_index:0;
					}
					base.postReq("/v1/api/order_operator/update.json",param,function(resp){
						console.log("返回数据",resp);
						search();
					});
					console.log("提交的数据",param);
				});
			}}
		]
	}

	var layout = {
		paddingX:15,
		paddingY:15,
		margin:15,
		type:"space",
		rows:[
			filter_ui,tabview
		]
	};

	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "订单列表", details: "订单列表"});
			initData();
		}
	};

});