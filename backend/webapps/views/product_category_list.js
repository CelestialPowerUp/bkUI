define([
	"views/modules/base",
	"views/forms/product_category",
	"views/modules/table_page_m"
	], function(base,product_category,table_page){
	
	var cur_page = 1;
	
	var serch_product_categories = function(page){
		if(typeof(page)!='undefined'){
			cur_page = page;
		}
		var search_value = $$("search").getValue();
		base.getReq("meta_product_categorys.json?page="+cur_page+"&size=15&key="+search_value,function(data){
			parse_table_data(data);
		});
	};
	
	var page_call_back = function(page){
		console.log("点击了第"+page+"页");
		serch_product_categories(page);
	};
	
	var parse_table_data = function(pages){
		var items = pages.items;
		$$("product_list").clearAll();	
		for(var i=0;i<items.length;i++){
			$$("product_list").add(items[i]);
		}
		table_page.$update_page_items("product_list_page",pages);
		table_page.$add_page_callback(page_call_back);
	};
	
	var onClick = {
			"edit":function(e,id,node){
				var item = this.getItem(id);
				this.$scope.ui(product_category.$ui).show();
				product_category.$bind_data(item.current_category_type);
				product_category.$add_submit_callback(function(){
					webix.message("修改成功");
		    		serch_product_categories();
				});
			},
			"delete":function(e,id,node){
				var item = this.getItem(id);
				webix.confirm({
					text:"确定删除该数据<br/> 确定?", ok:"是", cancel:"取消",
					callback:function(res){
						if(res){
							base.postForm("meta_product_category/delete.json",{type:item.current_category_type},function(data){
								webix.message("删除成功");
								serch_product_categories(1);
							});
						}
					}
				});
			}
		};
	
	var button_ui = {height:40,
			cols:[
				{view:"search",id:"search",width:250,placeholder:"输入类别名称",keyPressTimeout:500,on:{
					onTimedKeyPress:function(){
						serch_product_categories(1);
					}
				}},
				{ view: "button", type: "iconButton", icon: "external-link", label: "查询", width: 80,click:function(){
						serch_product_categories(1);
				  }},
				  { view: "button", type: "iconButton", icon: "plus", label: "添加分类", width: 110, click: function(){
			    	  this.$scope.ui(product_category.$ui).show();
			    	  product_category.$add_submit_callback(function(){
			    		  serch_product_categories(1);
			    	  });
			      }},
			      {}]
			};
	
	var product_data_table = {
		  id:"product_list",
		  view:"datatable",
		  select:false,
		  autoheight:true,
		  autoConfig:true,
		  rowHeight:35,
		  hover:"myhover",
		  onClick:onClick,
		  columns:[
					{id:"current_category_type",width:50,hidden:true},
					{id:"parent_category_type", width:250,hidden:true},
					{id:"parent_category_name", header:"一级类别", width:250,fillspace:true},
					{id:"current_category_name", header:"二级类别", width:250,fillspace:true},
			  		{id:"category_code", header:"CODE", width:250},
					{id:"trash", header:"操作", width:80, template:"<span><u class='edit'> 编辑</u><u class='delete'> 删除</u></span>"}
				]
	};
	
	var product_list_ui = table_page.$create_page_table("product_list_page",product_data_table);
	
	var layout = {
			type:"space",
			rows:[button_ui,product_list_ui]
		};
	
	return {
		$ui: layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "商品分类管理", details: "商品分类列表"});
			serch_product_categories(1);
		}
	};

});