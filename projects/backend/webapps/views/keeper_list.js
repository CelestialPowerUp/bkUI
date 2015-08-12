define([
	"views/modules/base",
	"views/forms/product",
	"views/modules/table_page"
	], function(base,product,table_page){
	
	var cur_page = 1;
	
	var search_list = function(page){
		if(typeof(page)!='undefined'){
			cur_page=page;
		}
		//var search_value = $$("search").getValue();
		base.getReq("car_keepers.json?page="+cur_page+"&size=8",function(data){
			parse_table_data(data);
		});
	};
	
	var page_call_back = function(page){
		search_list(page);
	};
	
	var parse_table_data = function(pages){
		var items = pages.items;
		$$("keeper_list").clearAll();	
		for(var i=0;i<items.length;i++){
			$$("keeper_list").add(items[i]);
		}
		table_page.$update_page_items(pages);
		table_page.$add_page_callback(page_call_back);
	};
	
	var button_ui = {height:40,
			cols:[
			      /*{view:"search",id:"search",width:250,placeholder:"输入管家名称"},
					{ view: "button", type: "iconButton", icon: "external-link", label: "收索", width: 80,click:function(){
						search_list(1);
				  }},*/
				  { view: "button", type: "iconButton", icon: "plus", label: "新增管家", width: 110, click: function(){
					  $$("main_body").$scope.show("/app/keeper_edit");
			      }},{}
			      ]
			};
	
	var onClick = {
			"edit":function(e,id,node){
				var item = this.getItem(id);
				$$("main_body").$scope.show("/app/keeper_edit:keeper_id="+item.car_keeper_id);
			},
			"delete":function(e,id,node){
				var item = this.getItem(id);
				webix.confirm({
					text:"确定删除该数据<br/> 确定?", ok:"是", cancel:"取消",
					callback:function(res){
						if(res){
							base.postForm("meta_product/delete.json",{id:item.id},function(data){
								webix.message("删除成功");
							});
						}
					}
				});
			}
		};

	var on_event = {
		"onCheck":function(rwo, column, state){
			var item = $$("keeper_list").getItem(rwo);
			if(typeof(item)==='undefined'){
				return ;
			}
			var car_keeper_id = item.car_keeper_id;
			base.getReq("car_keeper/"+car_keeper_id,function(data){
				data.lay_off = state;
				base.postReq("car_keeper/update.json",data,function(id){
					base.$msg.info("接单状态修改成功");
					search_list();
				});
			});
		}
	};
	
	var keeper_data_table = {
		  id:"keeper_list",
		  view:"datatable",
		  select:false,
		  editable:true,
		  autowidth:true,
		  autoheight:true,
		  rowHeight:95,
		  hover:"myhover",
		  onClick:onClick,
		  on:on_event,
		  columns:[
					{id:"car_keeper_id",width:50,hidden:true},
					{id:"name", header:"名字", width:95},
					{id:"phone", header:"电话号码", width:150},
			  		{header:"管家照片", template:"<img style='width:100%;height:100%;' src='#img_url#'>", width:135, css:"noPadding"},
					{id:"id_card", header:"身份证", width:180},
					{id:"address", header:"地址",width:350,fillspace:1},
					{id:"receive_orders", header:"接单数",sort:"int", width:150},
			  		{id:"user_rating", header:"评分",sort:"int",template:function(obj){
						var html = "<div class='rating_bar_element star"+obj.user_rating+"' style='margin-top:32px;'>";
						return html+"</div>";
					}, width:125},
			  		{id:"lay_off",header:"接单状态", template:"{common.checkbox()}", checkValue:false, uncheckValue:true},
					{id:"trash", header:"操作", width:80, template:"<span><a href='#' class='edit'> 编辑</a></span>"}
				]
	};
	
	var keeper_list_ui = table_page.$create_page_table(keeper_data_table);

	var layout =
	{
		type:"space",
		rows:[button_ui,keeper_list_ui]
	};

	return {
		$ui: layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "管家管理", details: "管家列表"});
			search_list(1);
		}
	};

});