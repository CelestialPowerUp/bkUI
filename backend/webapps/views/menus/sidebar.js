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
				data:[]
			}
		]
	};

	var init_data = function(){
		base.getReq("user_tree_menu.json",function(data){
			$$("app:menu").parse(webix.copy(data));
		});
	};
	
	return {
		$ui:layout,
		$init_data:init_data
	};

});
