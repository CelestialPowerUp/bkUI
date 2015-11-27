define(["views/modules/base",
	"views/modules/table_page_m",
	"views/forms/community_radius_goods_mapping",
	"views/forms/store_form",
	"views/windows/supplier_coupon_package_win",
	"views/windows/supplier_product_win"],function(base,table_page,community_radius_goods_mapping,coupon_package,supplier_product,store_form){

	var cur_page = 1;

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
			//编辑服务商类型
			this.$scope.ui(community_radius_goods_mapping.$ui).show();
			community_radius_goods_mapping.$init_data(item.goods_id);
			webix.addCallback(refresh_table());
		}
	};

	var elements = [
		{id:"goods_id", header:"社区半径id",Width:80,fillspace:true},
		{id:"goods_name", header:"社区半径商品名称",Width:100,fillspace:true},
		{id:"goods_id_yac",header:"养爱车id",width:80},
		{id:"goods_name_yac", header:"养爱车商品名称",Width:100,fillspace:true},
		{id:"goods_amount", header:"养爱车商品价格",width:150,fillspace:false},
		//{header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='添加关联' class='webix_icon fa-pencil'></span>"},
		{header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='编辑' class='webix_icon fa-pencil'></span>"},
		//{header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='删除' class='webix_icon fa-check-circle'></span>"},
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

	var layout = {
		paddingY:15,
		paddingX:15,
		cols:[
			{margin:15, type:"clean", rows:[table_page_ui]}]
	};

	var refresh_table = function(){
		var i=0;
		$$("table_list").clearAll();
		base.getReq("/v1/api/radius/community_radius_goods.json",function(data){
			$$("table_list").clearAll();
			$$("table_list").parse(data);
			table_page.$update_page_items("table_page_list",data);
			table_page.$add_page_callback(function(page){
				cur_page = page;
				refresh_table();
			});
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