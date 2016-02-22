/**
 * 车系添加和编辑
 */
define(["views/modules/base",
        "views/modules/upload"],function(base,upload){

	var win_car_brand_type_select = function(){
		base.getReq("meta_brands.json",function(brands){
			var list = $$("win_car_brand_type").getPopup().getList();
			list.clearAll();
			for(var i=0;i<brands.length;i++){
				list.add({id:brands[i].brand_type,value:brands[i].brand_name});
			}
			if(setValueSize<2){
				set_car_brand_type();
			}
		});
	};

	//回显车品牌下拉框值
	var reValue = null;
	var setValueSize = 0;
	var set_car_brand_type = function(){
		if(reValue){
			$$("win_car_brand_type").setValue(reValue);
			setValueSize ++;
			$$("win_car_brand_type").refresh();
		}
	};

	var submit_callback = null;
	var req_url = "meta_category/create.json";
	
	var submit_form_ui = {
			view:"form", 
			id:"post_form",
			elements:[
						{view:"text",id:"brand_type",name:"brand_type",hidden:true},
						{view: "richselect", name: "win_car_brand_type",id:"win_car_brand_type",label:"品牌",options:[],placeholder:"选择品牌",
							on:{"onAfterRender":function(){
								win_car_brand_type_select();
							},
							"onChange":function(brand_type){
								$$("brand_type").setValue(brand_type);
							}}
						},
					    {view:"text",name:"category_name",id:"category_name",label:"名称",placeholder:"请输入名称"},
						{
							margin:10,
							cols:[
								{},
								{ view:"button", label:"确定", align:"center", width:120, click:function(){
									if (!$$("post_form").validate()){
										webix.message({type:"error", text:"参数不能为空或输入格式不合法"});
										return ;
									}
									var formdata = $$("post_form").getValues();
									console.log(formdata);
									base.postReq(req_url,formdata,function(data){
										if(typeof(submit_callback)==='function'){
											submit_callback();
										}
										webix.$$("meta_car_category_win").close();
									});
								}},
								{ view:"button", label:"取消",align:"center", width:120, click:function(){
									webix.$$("meta_car_category_win").close();
								}}
							]
						}
					],
			rules:{
				"brand_type":webix.rules.isNotEmpty,
				"category_name":webix.rules.isNotEmpty
			}
	};

	var layout = {
			id:"meta_car_category_win",
			view:"window", 
			modal:true, 
			position:"center",
			head:"添加车系",
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
		$$("post_form").parse(item);
		setValueSize = 0;
		console.log(item);
		reValue = item.brand_type;
	};
	var set_req_url = function(url){
		req_url = url;
	};
	
	return {
		$ui:layout,
		$add_submit_callback:add_submit_callback,
		$bind_data:bind_data,
		$set_car_brand_type:set_car_brand_type,
		$set_req_url:set_req_url
	}
});