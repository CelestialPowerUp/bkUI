define(["../modules/base"],function(base){

return {
	$ui:{
		view: "submenu",
		id: "profilePopup",
		width: 200,
		padding:0,
		data: [
			{ $template:"Separator" },
			{id: 1, icon: "sign-out", value: "退出系统"}
		],
		type:{
			template: function(obj){
				if(obj.type)
					return "<div class='separator'></div>";
				return "<span class='webix_icon alerts fa-"+obj.icon+"'></span><span>"+obj.value+"</span>";
			}
		},
		on:{"onItemClick":function(id, e, node){
			var item = this.getItem(id);
			var user_info = webix.storage.local.get("user_info");
			console.log(user_info);
			base.postForm("/login_out",{phone_number:user_info.phone_number},function(){
				webix.storage.local.remove("user_info");
				//删除座席信息
				webix.storage.local.remove("agent_token");
				webix.storage.local.remove("agent_id");

				window.location.reload(true);
			});
		}}
	}
};

});