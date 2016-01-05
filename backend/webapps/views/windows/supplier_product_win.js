define(["views/modules/base",
	"views/forms/supplier_product"],function(base,supplier_product){

	var __supplier_id = null;

	var on_event = {
		"onAfterEditStop":function(state, editor, ignoreUpdate){
			var item = $$("supplier_product_list").getItem(editor.row);
			base.postReq("/v2/api/supplier_product/update.json",item,function(data){
				base.$msg.info("信息修改成功");
			});
		},
		"fa-times":function(e, id){
			var item = $$("supplier_product_list").getItem(id);
			webix.confirm({
				text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
				callback:function(res){
					if(res){
						var formdata = {supplier_id:item.supplier_id,product_ids:[item.product_id]};
						base.postReq("/v2/api/supplier_product/delete.json",formdata,function(data){
							base.$msg.info("记录删除成功");
							$$("supplier_product_list").remove(id);
						});
					}
				}
			});
		}
	};

	var elements = [
		{id:"supplier_id",header:"社区店ID",width:80},
		{id:"product_id",header:"商品ID",width:80},
		{id:"supplier_product_name", header:["商品名称", {content:"textFilter"} ],width:200},
		{id:"supplier_price", header:"商品价格",width:100,editor:"text",format:base.priceFormat},
		{id:"supplier_cost", header:"结算价格",width:100,editor:"text",format:base.priceFormat},
		{id:"labour_price", header:"服务的工时费",width:250,template:function(obj){
			return obj.labour_prices.join(",");
		}},
		{id:"delete", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='删除商品' class='webix_icon fa-times'></span>"}
	];

	var supplier_product_list_ui = {
		id:"supplier_product_list",
		view:"datatable",
		headerRowHeight:35,
		editable:true,
		editaction:"dblclick",
		autoConfig:true,
		autowidth:true,
		checkboxRefresh:true,
		hover:"myhover",
		scrollY:true,
		columns:elements,
		data:  [],
		onClick:on_event,
		on:on_event
	};

	var refresh_table = function(){
		base.getReq("/v2/api/supplier_product_list.json/"+__supplier_id,function(data){
			$$("supplier_product_list").clearAll();
			$$("supplier_product_list").parse(data);
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
					{view:"label", label: "商品列表" },
					{ view: "button", type: "iconButton", icon: "plus", label: "添加商品", width: 135, click: function(){
						//todo
						this.$scope.ui(supplier_product.$ui).show();
						supplier_product.$init_data($$("supplier_product_list").serialize());
						supplier_product.$add_callback(function(data){
							var formdata = {};
							formdata.supplier_id = __supplier_id;
							formdata.product_ids = [];
							for(var i=0;i<data.length;i++){
								formdata.product_ids.push(data[i].product_id);
							}
							base.postReq("/v2/api/supplier_product/add.json",formdata,function(data){
								refresh_table();
								base.$msg.info("商品添加成功");
							});
						});
					}},
					{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('supplier_coupon_package_win').close();"}
				]},
			body:{
				rows:[supplier_product_list_ui,
					{type:"space",
						cols:[
							{view: "icon", icon: "fa fa-exclamation-triangle"},
							{view:"label", align:"left",css:"warning", label:"商品最终价格与结算价格，是加上工时费之后显示在客户端，还有结算给修理厂的，请注意！"}
						]
				}]
			}
		};

	return {
		$ui:win_ui,
		$init_data:init_data
	};
});