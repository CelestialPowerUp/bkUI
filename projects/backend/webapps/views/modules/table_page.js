define(function(){
	
	var page_item_fomat = function(obj){
		return '<button type="button" class="webix_pager_item"> '+obj['label']+'</button>';
	}
	
	var page_click_callback = null;
	
	var page_item_list = {
			view: "dataview",
			id: "page_list",
			yCount: 1,
			xCount:8,
			select: true,
			scroll: false,
			type: {
				width: 60,
				height: 32
			},
			template: page_item_fomat,
			on:{"onItemClick":function(id){
				var item = this.getItem(id);
				if(typeof(page_click_callback)==='function'){
					page_click_callback(item.number);
				}
			}}
	};
	
	var create_page_table = function(datatable){
		var page_table_ui = {cols:[{rows:[]},{}]};
		page_table_ui.cols[0].rows.push(datatable);
		page_table_ui.cols[0].rows.push(page_item_list);
		return page_table_ui;
	};
	
	var update_page_items=function(pages){
		$$("page_list").clearAll();
		var limit = 5;
		var start = pages.cur_page - Math.ceil(limit/2)+1;
		$$("page_list").add({id:'page_first',number:1,label:"<<"});
		for(;start<=pages.total_page;start++){
			if(start<=0){
				continue;
			}
			if((limit--)<1){//最大显示数
				break;
			}
			$$("page_list").add({id:'page_'+start,number:start,label:start});
		}
		$$("page_list").add({id:'page_last',number:pages.total_page,label:">>"});
		$$("page_list").select("page_"+pages.cur_page);
	};
	
	var add_page_click_callback = function(callback){
		if(typeof(callback)==='function'){
			page_click_callback = callback;
		}
	};
	
	return {
		$create_page_table:create_page_table,
		$page_list:page_item_list,
		$update_page_items:update_page_items,
		$add_page_callback:add_page_click_callback
	};
});