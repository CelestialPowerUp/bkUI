define(["views/modules/base",
	"views/modules/table_page_m",
	"views/forms/store_product",
	"views/forms/community_radius_goods_mapping"],function(base,table_page,store_product,community_radius_goods_mapping){

	var cur_page = 1;

	var chose_product = function(){
		webix.ui(store_product.$ui).show();
		store_product.$init_data($$("link_id").getValue());
		store_product.$add_callback(function(choose_data){
			for(var i=0;i<choose_data.length;i++){
				$$("link_info").setValue(choose_data[i]['product_category_name']+"-"+choose_data[i]['product_name']);
				$$("link_id").setValue(choose_data[i]['product_id']);
			}
		});
	};

	var on_event = {
		"fa-trash-o":function(e, id, node){
			var item = $$("table_list").getItem(id);
			webix.confirm({
				text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
				callback:function(res){
					if(res){
						//删除资源
					}
				}
			});
		},
		"fa-pencil":function(e, id, node){
			var item = $$("table_list").getItem(id);
			webix.ui(store_product.$ui).show();
			store_product.$init_data(item.yac_product_id);
			store_product.$add_callback(function(choose_data){
				if(choose_data.length>0){
					var formdata = {outer_id:item.ljy_product_id,local_id:choose_data[0]['product_id']};
					base.postReq("/v1/api/radius/product_mapping.json",formdata,function(data){
						webix.message("社区半径商品关联成功");
						item.yac_product_id = choose_data[0]['product_id'];
						item.yac_product_name = choose_data[0]['product_name'];
						item.yac_product_price = choose_data[0]['price'];
						$$("table_list").refresh(id);
						refresh_table();
					});
				}
			});
		}
	};

	var elements = [
		{id:"ljy_product_id", header:"乐家园id",Width:80,fillspace:true},
		{id:"ljy_product_name", header:"乐家园名称",Width:100,fillspace:true},
		{id:"ljy_product_price", header:"乐家园价格",Width:100,fillspace:true},
		{id:"yac_product_id",header:"养爱车id",width:80},
		{id:"yac_product_name", header:"养爱车名称",Width:100,fillspace:true},
		{id:"yac_product_price", header:"养爱车价格",width:150,fillspace:false},
		{header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='编辑' class='webix_icon fa-pencil'></span>"},
	];

	var table_ui = {
		id:"table_list",
		view:"datatable",
		select:false,
		rowHeight:35,
		autoheight:true,
		hover:"myhover",
		rightSplit:5,
		columns:elements,
		data:[],
		onClick:on_event
	}

	var table_page_ui = table_page.$create_page_table("table_page_list",table_ui);

	table_page.$add_page_callback(function(page){
		cur_page = page;
		refresh_table();
	});


	var page_ui = {rows:[
		{view:"toolbar",css: "highlighted_header header5",height:45, elements:[
			{view:"label",label:"乐家园商品映射维护列表"}
		]},
		table_page_ui
	]};

	var layout = {
		paddingY:15,
		paddingX:15,
		cols:[
			{margin:15, type:"clean", rows:[page_ui]}]
	};

	var refresh_table = function(){
		base.getReq("/v1/api/radius/community_radius_goods.json?page="+cur_page+"&page_size=20",function(data){
			$$("table_list").clearAll();
			$$("table_list").parse(data.items);
			table_page.$update_page_items("table_page_list",data);
		})
	};

	return {
		$ui:layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "乐家园商品管理", details: "商品关联管理"});
			refresh_table();
		}
	}
});