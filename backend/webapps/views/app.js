define([
	"../libs/engine",
	"views/menus/search",
	"views/menus/mail",
	"views/menus/message",
	"views/menus/activity_message",
	"views/menus/profile",
	"views/menus/sidebar",
	"views/menus/copytext",
	"views/menus/call_out",
	"views/menus/call_in",//暂时不使用
	"views/menus/agent_menu",
	"../js/callcenter",
	"views/windows/call_in_win",
	"views/webix/icon",
	"views/webix/menutree"
],function(engine,search, mail, message,activity_message, profile, sidebar,copy,call_out,call_in,agent_menu,callcenter,call_in_win){

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
			{view: "icon", icon: "coffee", id:"activity_message",tooltip:"新活动单", value: 0, width: 45, popup: "activityMessagePopup"},

			{view: "icon", icon: "phone", id:"call_out",tooltip:"外呼", value: 0, width: 45, popup: "call_out_submenu"},

			/*{view: "icon", icon: "headphones", id:"call_in",tooltip:"呼入", value: '', width: 45, popup: "call_in_submenu",click:function(){
				this.data.value = 0;
				this.refresh();
			}},*/
			{view: "icon", icon: "user", id:"agent_menu",tooltip:"座席状态", value: 0, width: 45,popup:"agent_submenu"}
			/*,{view: "icon", icon: "user", id:"test1",tooltip:"座席状态", value: 0, width: 45,click:function(){
				// this.$scope.ui(call_in_win.$ui).show();
				showCallInWin();
			}}*/
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
		id:"main_layout",
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

	var newCallIn = function(){
		$$("call_in").data.value = '';
		$$("call_in").refresh();
	};
	var showCallInWin = function(){
		webix.message({ type:"default",expire:5000,text:'来电话了...'});
		$$("main_layout").$scope.ui(call_in_win.$ui).show();

		play_info();
		loopPlay();

		setTimeout(call_in_win.reject, 15000);
	}
	var loopPlayInterval = null;
	var loopPlay=function(){
		loopPlayInterval = setInterval(play_info, 2000);
	};
	var play_info = function(){
		var i = Math.round(Math.random()*3);
		palyer = $$("callin_"+i+"_audio");
		var video = palyer.getVideo();
		video.play();
	}

	var clearLoop = function(){
		if(loopPlayInterval){
			window.clearInterval(loopPlayInterval);
		}
	}

	return {
		$ui:layout,
		$menu:"app:menu",
		$newCallIn:newCallIn,
		$oninit:function(view, scope){
			scope.ui(search.$ui);
			scope.ui(mail.$ui);
			scope.ui(message.$ui);
			scope.ui(activity_message.$ui);
			scope.ui(profile.$ui);
			scope.ui(copy.$ui);
			scope.ui(call_out.$ui);
			scope.ui(call_in.$ui);
			scope.ui(agent_menu.$ui);
			sidebar.$init_data();
			callcenter.addCallback(showCallInWin);
			call_in_win.addCallback(clearLoop);
		}
	};
});