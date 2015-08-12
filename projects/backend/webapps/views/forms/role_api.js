define(["views/modules/base"],function(base){

	var role_id = null;
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"role_api_list",
			height:450,
			width:650,
			type: {
                height: 35,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.method+": "+obj.urls+" ( "+obj.name+" ) </div>";
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
								var datas = $$("role_api_list").serialize();
								var checkdata = [];
								for(var i=0;i<datas.length;i++){
									if(datas[i]['$check']){
										checkdata.push(datas[i]);
									}
								}
								if(role_id===null){
									base.$msg.error("更新失败,角色获取失败");
									return ;
								}
								base.postReq("config_role_api.json/"+role_id,checkdata,function(data){
									webix.message("角色接口更新成功！");
									webix.$$("model_win").close();
								});
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};

	var filter = {cols:[
		{view:"text",label:"请输入过滤的内容:",css:"fltr",labelWidth:135,on:{
			onTimedKeyPress:function(){
				var value = this.getValue().toLowerCase();
				var keys = value.split(" ");
				$$("role_api_list").filter(function(obj){
					var str = obj.name+obj.urls+obj.method;
					for(var i=0;i<keys.length;i++){
						if(str.toLowerCase().indexOf(keys[i])<0){
							return false;
						}
					}
					return true;
				})
			}
		}},{}
	]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"角色接口授权",
			body:{
				type:"space",
				rows:[list_ui,button_ui]
			}
		};
	
	var init_data = function(role_type){
		role_id = role_type;
		base.getReq("role_api.json/"+role_type,function(checked){
			base.getReq("apis.json",function(all){
				var data = [];
				for(var i=0;i<all.length;i++){
					data.push(parse_check_data(all[i],checked));
				}
				$$("role_api_list").parse(data);
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