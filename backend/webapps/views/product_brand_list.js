define([
	"views/modules/base",
	"views/forms/product_brand",
	"views/modules/table_page"
	], function(base,product_brand,table_page){
	
	var cur_page = 1;
	
	var serch_producs = function(page){
		if(typeof(page)!='undefined'){
			cur_page = page;
		}
		var search_value = $$("search").getValue();
		base.getReq("meta_product_brands.json?page="+cur_page+"&size=5&key="+search_value,function(data){
			parse_table_data(data);
		});
	};
	
	var page_call_back = function(page){
		console.log("点击了第"+page+"页");
		serch_producs(page);
	};
	
	var parse_table_data = function(pages){
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
			      {view:"search",id:"search",width:250,placeholder:"输入品牌名称"},
					{ view: "button", type: "iconButton", icon: "external-link", label: "收索", width: 80,click:function(){
						serch_producs(1);
				  }},
				  { view: "button", type: "iconButton", icon: "plus", label: "添加品牌", width: 110, click: function(){
			    	  this.$scope.ui(product_brand.$ui).show();
			    	  product_brand.$add_submit_callback(function(){
			    		  serch_producs(1);
			    	  });
			      }},
			      {}]
			};
	
	var onClick = {
			"edit":function(e,id,node){
				var item = this.getItem(id);
				this.$scope.ui(product_brand.$ui).show();
				product_brand.$bind_data(item);
				product_brand.$add_submit_callback(function(){
		    		  serch_producs();
		    	  });
			},
			"delete":function(e,id,node){
				var item = this.getItem(id);
				webix.confirm({
					text:"确定删除该数据<br/> 确定?", ok:"是", cancel:"取消",
					callback:function(res){
						if(res){
							base.postForm("meta_product_brand/delete.json",{type:item.product_brand_type},function(data){
								serch_producs(1);
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
		  rowHeight:100,
		  hover:"myhover",
		  onClick:onClick,
		  columns:[
					{id:"product_brand_type", header:"ID", width:50,hidden:true},
					{header:"图标", template:"<img style='width:100%;height:100%;' src='#logo_img_url#'>", width:150, css:"noPadding"},
					{id:"product_brand_name", header:"品牌", width:250},
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
			webix.$$("title").parse({title: "品牌管理", details: "品牌列表"});
			serch_producs(1);
		}
	};

});