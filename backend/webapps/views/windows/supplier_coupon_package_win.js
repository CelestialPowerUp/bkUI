define(["views/modules/base",
		"views/forms/supplier_coupon_package_form"],function(base,supplier_coupon_package){

	var __supplier_id = null;

	var on_event = {
		"fa-times":function(e, id){
			var item = $$("supplier_coupon_package_list").getItem(id);
			webix.confirm({
				text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
				callback:function(res){
					if(res){
						//删除资源
						base.postReq("supplier/coupon_package/delete.json?supplier_id="+item.supplier_id+"&coupon_package_id="+item.product_id,{},function(){
							base.$msg.info("资源删除成功");
							$$("supplier_coupon_package_list").remove(id);
						});
					}
				}
			});
		},
		"fa-pencil":function(e, id){
			var item = $$("supplier_coupon_package_list").getItem(id);
			//编辑优惠券卡包
			console.log(item);
			webix.ui(supplier_coupon_package.$ui).show();
			supplier_coupon_package.$init_data(item.supplier_id,item.product_id);
			supplier_coupon_package.$add_submit_callback(function(){
				refresh_table();
			});
		}
	};

	var elements = [
		{id:"supplier_id",header:"社区店ID",width:80},
		{id:"product_id", header:"卡包ID",width:80,fillspace:false},
		{id:"supplier_product_name", header:"优惠券卡包名称",width:200,fillspace:false},
		{id:"supplier_price", header:"售价",width:100,format:base.priceFormat,fillspace:false},
		{id:"supplier_cost", header:"结算价",width:100,format:base.priceFormat,fillspace:false},
		{id:"edit", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='编辑卡包' class='webix_icon fa-pencil'></span>"},
		{id:"delete", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='删除卡包' class='webix_icon fa-times'></span>"}
	];

	var supplier_coupon_package_list_ui = {
		id:"supplier_coupon_package_list",
		view:"datatable",
		headerRowHeight:35,
		autoConfig:true,
		autowidth:true,
		checkboxRefresh:true,
		hover:"myhover",
		scrollY:true,
		columns:elements,
		data:  [],
		onClick:on_event
	};

	var refresh_table = function(){
		base.getReq("supplier/coupon_packages/"+__supplier_id,function(data){
			$$("supplier_coupon_package_list").clearAll();
			$$("supplier_coupon_package_list").parse(data);
		});
	}

	var init_data = function(supplier_id){
		__supplier_id = supplier_id;
		refresh_table();
	}


	var win_ui = {
			view:"window",
			modal:true,
			id:"supplier_coupon_package_win",
			height:450,
			position:"center",
			head:{
				view:"toolbar",height:40, cols:[
					{view:"label", label: "卡包列表" },
					{ view: "button", type: "iconButton", icon: "plus", label: "添加包项", width: 135, click: function(){
						//todo
						webix.ui(supplier_coupon_package.$ui).show();
						supplier_coupon_package.$init_data(__supplier_id);
						supplier_coupon_package.$add_submit_callback(function(){
							refresh_table();
						});
					}},
					{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('supplier_coupon_package_win').close();"}
				]},
			body:{
				rows:[supplier_coupon_package_list_ui]
			}
		};

	return {
		$ui:win_ui,
		$init_data:init_data
	};
});