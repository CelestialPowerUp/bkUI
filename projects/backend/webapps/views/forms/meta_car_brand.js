/**
 * 车辆品牌
 */
define(["views/modules/base",
        "views/modules/upload"],function(base,upload){
	
	var submit_callback = null;
	var req_url = "meta_brand/create.json";
	
	var submit_form_ui = {
			view:"form", 
			id:"meta_car_brand_form",
			elements:[
					    {view:"text",name:"brand_type",hidden:true},
					    {view:"text",name:"brand_name",label:"名称",placeholder:"请输入名称"},
						{view:"text",name:"logo_attachment_id",id:"logo_attachment_id",hidden:true},
						{view:"text",name:"img_url",id:"img_url",label:"图标",placeholder:"点击上传图片",readonly:true,
							on:{"onAfterRender":function(){
								upload.$bind_upload("img_url",function(data){
									if(data.code==='00000'&&data.data!=null){
										$$("logo_attachment_id").setValue(data.data.id);
										$$("img_url").setValue(data.data.thumbnail_url);
									}
								});
							}
						}},
						{
							margin:10,
							cols:[
								{},
								{ view:"button", label:"确定", align:"center", width:120, click:function(){
									if (!$$("meta_car_brand_form").validate()){
										webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
										return ;
									}
									var formdata = $$("meta_car_brand_form").getValues();
									console.log(formdata+"\n"+req_url);
									base.postReq(req_url,formdata,function(data){
										if(typeof(submit_callback)==='function'){
											submit_callback();
										}
										webix.$$("meta_car_brand_win").close();
									});
								}},
								{ view:"button", label:"取消",align:"center", width:120, click:function(){
									webix.$$("meta_car_brand_win").close();
								}}
							]
						}
					],
			rules:{
				"brand_name":webix.rules.isNotEmpty
			}
	};

	
	var layout = {
			id:"meta_car_brand_win",
			view:"window", 
			modal:true, 
			position:"center",
			head:"添加车辆品牌",
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
		$$("meta_car_brand_form").parse(item);
	};
	var set_req_url = function(url){
		req_url = url;
	};
	
	return {
		$ui:layout,
		$add_submit_callback:add_submit_callback,
		$bind_data:bind_data,
		$set_req_url:set_req_url
	}
});