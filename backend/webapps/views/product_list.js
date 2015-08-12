define([
	"views/modules/base",
	"views/forms/product",
	"views/modules/table_page"
	], function(base,product,table_page){
	
	var cur_page = 1;
	
	var serch_producs = function(page){
		if(typeof(page)!='undefined'){
			cur_page=page;
		}
		var search_value = $$("search").getValue();
		base.getReq("meta_products.json?page="+cur_page+"&size=18&key="+search_value,function(data){
			parse_table_data(data);
		});
	};
	
	var page_call_back = function(page){
		console.log("点击了第"+page+"页");
		serch_producs(page);
	};
	
	var parse_table_data = function(pages){
		console.log(pages);
		var items = pages.items;
		$$("product_list").clearAll();	
		for(var i=0;i<items.length;i++){
			$$("product_list").add(items[i]);
		}
		table_page.$update_page_items(pages);
		table_page.$add_page_callback(page_call_back);
	};
	
	var button_ui = {height:40,
			cols:[
			      {view:"search",id:"search",width:250,placeholder:"输入类别名称"},
					{ view: "button", type: "iconButton", icon: "external-link", label: "收索", width: 80,click:function(){
						serch_producs(1);
				  }},
				  { view: "button", type: "iconButton", icon: "plus", label: "添加商品", width: 110, click: function(){
			    	  this.$scope.ui(product.$ui).show();
			    	  product.$add_submit_callback(function(){
			    		  serch_producs(1);
			    	  });
			      }},
			      {}]
			};
	
	var onClick = {
			"edit":function(e,id,node){
				var item = this.getItem(id);
				this.$scope.ui(product.$ui).show();
				product.$bind_data(item.id);
				product.$add_submit_callback(function(){
		    		  serch_producs();
		    	  });
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
	
	var product_data_table = {
		  id:"product_list",
		  view:"datatable",
		  select:false,
		  autoheight:true,
		  autowidth:true,
		  rowHeight:35,
		  hover:"myhover",
		  onClick:onClick,
		  columns:[
					{id:"id",width:50,hidden:true},
					{id:"product_brand_name", header:"品牌", width:150},
					{id:"product_category_name", header:"商品类别", width:150},
					{id:"product_name", header:"商品名称", width:250},
					{id:"cost", header:"成本",width:150},
					{id:"price", header:"售价", width:150},
					{id:"trash", header:"操作", width:80, template:"<span><u class='edit'> 编辑</u><u class='delete'> 删除</u></span>"}
				]
	};
	
	var product_list_ui = table_page.$create_page_table(product_data_table);
	
	var layout = {
			type:"space",
			rows:[button_ui,product_list_ui]
		};
	
	return {
		$ui: layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "商品管理", details: "商品列表"});
			serch_producs(1);
		}
	};

});