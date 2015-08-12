define(["views/modules/base"],function(base){

	var user_id = null;
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"role_menu_list",
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
								var datas = $$("role_menu_list").serialize();
								var checkdata = [];
								for(var i=0;i<datas.length;i++){
									if(datas[i]['$check']){
										checkdata.push(datas[i]);
									}
								}
								if(user_id===null){
									base.$msg.error("更新失败,用户参数为空");
									return ;
								}
								base.postReq("config_user_role.json/"+user_id,checkdata,function(data){
									webix.message("角色菜单更新成功！");
									webix.$$("model_win").close();
								});
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"用户角色授权",
			body:{
				type:"space",
				rows:[list_ui,button_ui]
			}
		};
	
	var init_data = function(user){
		user_id = user;
		base.getReq("user_roles.json/"+user_id,function(checked){
			base.getReq("roles.json",function(all){
				var data = [];
				for(var i=0;i<all.length;i++){
					data.push(parse_check_data(all[i],checked));
				}
				$$("role_menu_list").parse(data);
			});
		});
	};
	
	var parse_check_data = function(obj,arrs){
		obj.$check = false;
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]['role_type']===obj['role_type']){
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