define(["views/modules/base",
        "views/modules/upload"],function(base,upload){
	
	var submit_callback = null;
	
	var submit_form_ui = {
			view:"form", 
			id:"product_brand_form",
			elements:[
					    {view:"text",name:"product_brand_type",hidden:true},
					    {view:"text",name:"product_brand_name",label:"商品名称",placeholder:"请输入商品名称"},
						{view:"text",name:"logo_id",id:"logo_id",hidden:true},
						{view:"text",name:"logo_img_url",id:"logo_img_url",label:"图标",placeholder:"点击上传图片",readonly:true,
							on:{"onAfterRender":function(){
								upload.$bind_upload("logo_img_url",function(data){
									if(data.code==='00000'&&data.data!=null){
										$$("logo_id").setValue(data.data.id);
										$$("logo_img_url").setValue(data.data.thumbnail_url);
									}
								});
							}
						}},
						{
							margin:10,
							cols:[
								{},
								{ view:"button", label:"确定", align:"center", width:120, click:function(){
									if (!$$("product_brand_form").validate()){
										webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
										return ;
									}
									var formdata = $$("product_brand_form").getValues();
									base.postReq("meta_product_brand.json",formdata,function(data){
										if(typeof(submit_callback)==='function'){
											submit_callback();
										}
										webix.$$("product_brand_win").close();
									});
								}},
								{ view:"button", label:"取消",align:"center", width:120, click:function(){
									webix.$$("product_brand_win").close();
								}}
							]
						}
					],
			rules:{
				"product_brand_name":webix.rules.isNotEmpty
			},
	};

	
	var layout = {
			id:"product_brand_win",
			view:"window", 
			modal:true, 
			position:"center",
			head:"添加商品品牌",
			body:{
				type:"space",
				rows:[submit_form_ui]
			}
		};
	
	var add_submit_callback = function(callback){
		if(typeof(callback)==='function'){
			submit_callback = callback;
		}
	};
	
	var bind_data = function(item){
		$$("product_brand_form").parse(item);
	};
	
	return {
		$ui:layout,
		$add_submit_callback:add_submit_callback,
		$bind_data:bind_data
	}
});