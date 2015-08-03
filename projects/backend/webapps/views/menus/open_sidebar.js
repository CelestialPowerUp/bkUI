define(["../modules/base"],function(base){

	var layout = {
		width: 200,
		rows:[
			{
				view: "tree",
				id: "app:menu",
				type: "menuTree2",
				css: "menu",
				activeTitle: true,
				select: true,
				tooltip: {
					template: function(obj){
						return obj.$count?"":obj.value;
					}
				},
				on:{
					onBeforeSelect:function(id){
						if(this.getItem(id).$count){
							return false;
						}

					},
					onItemClick:function(id, e, node){
						var item = this.getItem(id);
						if(item.$count){
							return;
						}
						this.$scope.show("./"+item.page_item);
						webix.$$("title").parse({title: item.value, details: item.value});
					}
				},
				data:[
					{id:"menu_list",value:"菜单列表",open:true,data:[
						{id: "channel_valid_order_filter_for_open",icon: "cube",page_item: "channel_valid_order_filter_for_open",value: "渠道订单查看"}
					]}
				]
			}
		]
	};

	var init_data = function(){

	};

	return {
		$ui:layout,
		$init_data:init_data
	};

});
