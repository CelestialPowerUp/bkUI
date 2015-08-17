define(["views/modules/base"],function(base){

	var supplier_id = null;
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"type_list",
			height:250,
			width:350,
			type: {
                height: 35,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.name+"</div>";
				}
			},
			data: [],
			on: {
				onItemClick:function(id){
					var item = this.getItem(id);
					item.$check = !item.$check;
					this.refresh(id);
				}
			}
	};
	
	var button_ui = {cols:[{},{view:"button",label:"确定",width:80,click:function(){
								var datas = $$("type_list").serialize();
								var formdata = {supplier_id:supplier_id};
								formdata.supplier_type_ids = [];
								for(var i=0;i<datas.length;i++){
									if(datas[i]['$check']){
										formdata.supplier_type_ids.push(datas[i].type);
									}
								}
								if(supplier_id===null){
									base.$msg.error("更新失败,服务商参数获取失败");
									return ;
								}
								base.postReq("/v2/api/supplier_type/update.json",formdata,function(data){
									webix.message("服务商类型更新成功");
									webix.$$("model_win").close();
								});
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"服务商类型配置",
			body:{
				type:"space",
				rows:[list_ui,button_ui]
			}
		};
	
	var init_data = function(check_data){
		supplier_id = check_data;
		base.getReq("/v2/api/supplier/type_list.json?supplier_id="+check_data,function(check_type){
			base.getReq("/v2/api/supplier/type_list.json",function(data){
				$$("type_list").clearAll();
				for(var i = 0;i<data.length;i++){
					data[i] = parse_check_data(data[i],check_type);
				}
				$$("type_list").parse(data);
			});
		});
	};
	
	var parse_check_data = function(obj,arrs){
		obj.$check = false;
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]['type']===obj['type']){
				obj.$check=true;
				break;
			}
		}
		return obj;
	};
	
	return {
		$ui:layout,
		$init_data:init_data
	}

});