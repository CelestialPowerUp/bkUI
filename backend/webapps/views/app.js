define([
	"../libs/engine",
	"views/menus/search",
	"views/menus/mail",
	"views/menus/message",
	"views/menus/activity_message",
	"views/menus/profile",
	"views/menus/sidebar",
	"views/menus/copytext",
	"views/webix/icon",
	"views/webix/menutree",
],function(engine,search, mail, message,activity_message, profile, sidebar,copy){

	var user_info = webix.storage.local.get("user_info");
	
	if(user_info==null){
		user_info = {id:-1,name:"未登陆"};
	}
	try{
		engine.$longPolling();
	}catch(a){
		console.log(a);
	}
	console.log("启动消息推送服务");

	//$("#myaudio").play();

	//Top toolbar

	var mainToolbar = {
			
		view: "toolbar",

		elements:[
			{view: "label", label: "养爱车系统管理", width: 200},
			{ height:46, id: "person_template", css: "header_person", borderless:true, width: 180, data:user_info ,
				template: function(obj){
					var html = 	"<div style='height:100%;width:100%;' onclick='webix.$$(\"profilePopup\").show(this)'>";
					html += "<img class='photo' src='assets/imgs/photos/3.png' /><span class='name'>"+obj.name+"</span>";
					html += "<span class='webix_icon fa-angle-down'></span></div>";
					return html;
				}
			},
			
			{view: "icon", icon: "file-text-o", id:"order_message", value: 0,tooltip:"新订单", width: 45, popup: "messagePopup"},

			{view: "icon", icon: "coffee", id:"activity_message",tooltip:"新活动单", value: 0, width: 45, popup: "activityMessagePopup"}
		]
	};

	var body = {
		rows:[
			{ height: 49, id: "title", css: "title", template: "<div class='header'>#title#</div><div class='details'>( #details# )</div>", data: {text: "养爱车",details:"",title: ""}},
			{
				view: "scrollview", scroll:"xy",id:"main_body",
				body:{ cols:[{ $subview:true}] }
			}
		]
	};

	var layout = {
		rows:[
			mainToolbar,
			{
				cols:[
					sidebar,
					{ view:"resizer" },
					body
				]
			}
		]
	};

	return {
		$ui:layout,
		$menu:"app:menu",
		$oninit:function(view, scope){
			scope.ui(search.$ui);
			scope.ui(mail.$ui);
			scope.ui(message.$ui);
			scope.ui(activity_message.$ui);
			scope.ui(profile.$ui);
			scope.ui(copy.$ui);
			sidebar.$init_data();
		}
	};
	
});