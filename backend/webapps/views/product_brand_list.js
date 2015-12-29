define([
	"views/modules/base",
	"views/forms/product_brand",
	"views/modules/table_page_m"
	], function(base,product_brand,table_page){
	
	var cur_page = 1;
	
	var serch_product_brands = function(page){
		if(typeof(page)!='undefined'){
			cur_page = page;
		}
		var search_value = $$("search").getValue();
		base.getReq("meta_product_brands.json?page="+cur_page+"&size=6&key="+search_value,function(data){
			parse_table_data(data);
		});
	};
	
	var page_call_back = function(page){
		serch_product_brands(page);
	};
	
	var parse_table_data = function(pages){
		var items = pages.items;
		$$("product_brand_list").clearAll();	
		for(var i=0;i<items.length;i++){
			$$("product_brand_list").add(items[i]);
		}
		table_page.$update_page_items("product_brand_list_page",pages);
		table_page.$add_page_callback(page_call_back);
	};
	
	var button_ui = {height:40,
			cols:[
			      {view:"search",id:"search",width:250,placeholder:"输入品牌名称",keyPressTimeout:500,on:{
					  onTimedKeyPress:function(){
						  serch_product_brands(1);
					  }
				  }},
					{ view: "button", type: "iconButton", icon: "external-link", label: "查询", width: 80,click:function(){
						serch_product_brands(1);
				  }},
				  { view: "button", type: "iconButton", icon: "plus", label: "添加品牌", width: 110, click: function(){
			    	  this.$scope.ui(product_brand.$ui).show();
			    	  product_brand.$add_submit_callback(function(){
			    		  serch_product_brands(1);
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
		    		  serch_product_brands();
		    	  });
			},
			"delete":function(e,id,node){
				var item = this.getItem(id);
				webix.confirm({
					text:"确定删除该数据<br/> 确定?", ok:"是", cancel:"取消",
					callback:function(res){
						if(res){
							base.postForm("meta_product_brand/delete.json",{type:item.product_brand_type},function(data){
								serch_product_brands(1);
							});
						}
					}
				});
			}
		};
	
	var product_data_table = {
		  id:"product_brand_list",
		  view:"datatable",
		  select:false,
		  autoheight:true,
		  autoConfig:true,
		  rowHeight:100,
		  hover:"myhover",
		  onClick:onClick,
		  columns:[
					{id:"product_brand_type", header:"ID", width:50,hidden:true},
					{header:"图标", template:"<img style='width:100%;height:100%;' src='#logo_img_url#'>", width:150, css:"noPadding"},
					{id:"product_brand_name", header:"品牌", width:250,fillspace:true},
					{id:"trash", header:"操作", width:80, template:"<span><u class='edit'> 编辑</u><u class='delete'> 删除</u></span>"}
				]
	};
	
	var product_brand_list_ui = table_page.$create_page_table("product_brand_list_page",product_data_table);
	
	var layout = {
			type:"space",
			rows:[button_ui,product_brand_list_ui]
		};
	
	return {
		$ui: layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "品牌管理", details: "品牌列表"});
			serch_product_brands(1);
		}
	};

});