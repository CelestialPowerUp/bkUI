define([
	"views/forms/order",
	"views/menus/export",
	"models/meta_car_model"
], function(orderform, exports, carmodels){

	var controls = [
		{ view: "button", type: "iconButton", icon: "plus", label: "添加品牌", width: 130, click: function(){
			this.$scope.ui(orderform.$ui).show();
		}},
		{view:"search",id:"search",width:250},
		{ view: "button", type: "iconButton", icon: "external-link", label: "收索", width: 120,click:function(){
			alert($$("search").getValue());
		}},
		{}
	];

	var grid = {
		margin:10,
		rows:[
			{
				id:"orderData",
				view:"datatable",
				select:true,
				columns:[
					{id:"model_type", header:"ID", width:50},
					{id:"brand_name", header:"品牌", sort:"string", width:80,fillspace:1},
					{id:"category_name", header:"车系", sort:"string", width:80,fillspace:1},

					{id:"engine_displacement", header:"排量", sort:"string", width:90,fillspace:1},
					{id:"production_year", header:"年款", width:90, sort:"string",fillspace:1},
					{id:"producer", header:"厂商", width:90, sort:"string",fillspace:1},
					{id:"car_model_Name", header:"名称", width:90, sort:"string",fillspace:1},
					{id:"engine_oil_amount", header:"机油用量", sort:"string",fillspace:1},
					{id:"trash", header:"操作", width:80, template:"<span><u class='views'>查看</u><u class='edit'> 编辑</u><u class='pick'> 认领</u></span>"}
				],
				export: true,
				on: {
					onAfterLoad: function(){
						this.select(3);
					}
				},
				pager:"pagerA",
				data: carmodels.getAll,
				onClick:{
					webix_icon:function(e,id,node){
						webix.confirm({
							text:"删除该车模型<br/> 确定?", ok:"是", cancel:"取消",
							callback:function(res){
								if(res){
									webix.$$("orderData").remove(id);
								}
							}
						});
					}
				}
			}
		]

	};

	var layout = {
		type: "space",
		rows:[
			{
				height:40,
				cols:controls
			},
			{
				rows:[
					grid,
					{
						view: "toolbar",
						css: "highlighted_header header6",
						paddingX:5,
						paddingY:5,
						height:40,
						cols:[{
							view:"pager", id:"pagerA",
							template:"{common.first()}{common.prev()}&nbsp; {common.pages()}&nbsp; {common.next()}{common.last()}",
							autosize:true,
							height: 35,
							group:5
						}]
					}
				]
			}



		]

	};

	return {
		$ui: layout
	};

});