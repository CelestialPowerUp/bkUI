define(["views/modules/base","views/modules/table_page"], function(base,table_page){

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
	var search = function(page){
		if(page){
			cur_page = page;
		}
		var tabCheckId = $$("tabviewdata").getValue();
		var order_status = 1;
		if(tabCheckId=='unprocessed_order_table'){
			order_status = 2;
		}
		if(tabCheckId=='processed_order_table'){
			order_status = 3;
		}
		base.getReq("orders?operator_id="+base.getUserId()+"&order_status="+order_status+"&size=15"+get_page_url(),function(data){
			parse_table_data(data);
		});
	};
	var page_call_back = function(page){
		search(page);
	};
	var parse_table_data = function(pages){
		var items = pages.items;
		var tabCheckId = $$("tabviewdata").getValue();
		$$(tabCheckId).clearAll();
		for(var i=0;i<items.length;i++){
			$$(tabCheckId).add(items[i]);
		}
		table_page.$update_page_items(pages);
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
					{id:"peer_source", header:"来源", width:90},
					{id:"paid",header:"支付状态",sort:"string",template:function(obj){
						if(obj.paid){
							return "已支付";
						}
						return "未支付";
					}},
					{id:"place_time", header:"下单时间",sort:"string",width:210}
				];
	
	var unbelong_colums = webix.copy(columns);
	
	unbelong_colums.splice(0,0,{id:"trash", header:"操作",width:250, template:"<span><u class='views row_button'>查看</u><u class='edit row_button'> 编辑</u><u class='pick row_button'> 认领</u><u class='delete row_button'>删除</u></span>"});
	
	var unprocessed_colums = webix.copy(columns);
	
	unprocessed_colums.splice(0,0,{id:"trash", header:"操作",width:220,template:"<span><u class='views row_button'>查看</u><u class='edit row_button'> 编辑</u><u class='complate row_button'> 完成</u><u class='delete row_button'>删除</u></span>"});
	
	var complated_colums = webix.copy(columns);
	complated_colums.splice(0,0,{id:"trash", header:"操作",width:180, template:"<span><u class='views row_button'>查看</u><u class='edit row_button'> 编辑</u><u class='delete row_button'>删除</u></span>"});
	
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
							base.postReq("order/update.json",p,function(data){
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
			}
		};
	
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
			    		    id:"unbelong_order_table",
							view:"datatable",
							autoConfig:true,
							scrollX:true,
							select:true,
						    leftSplit:1,
							columns:unbelong_colums,
							hover:"myhover",
						   autoheight:true,
						   autowidth:true,
							onClick:onClick
					   }
			       },
			       {
			    	   header:"未完成订单",
			    	   body:{
			    		    id:"unprocessed_order_table",
							view:"datatable",
							autoConfig:true,
							scrollX:true,
							select:true,
							hover:"myhover",
						    leftSplit:1,
						   autoheight:true,
						   autowidth:true,
							columns:unprocessed_colums,
							onClick:onClick
			    	   }	
			       },
			       {
			    	   header:"已完成订单",
			    	   body:{
			    		    id:"processed_order_table",
							view:"datatable",
							autoConfig:true,
							scrollX:true,
							select:true,
						    leftSplit:1,
						   autoheight:true,
						   autowidth:true,
							hover:"myhover",
							columns:complated_colums,
							onClick:onClick
			    	   }	
			       }
			]
	};

	var table_ui = table_page.$create_page_table(tabview);
	return {
		$ui:table_ui,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "订单列表", details: "订单列表"});
			initData();
		}
	};

});