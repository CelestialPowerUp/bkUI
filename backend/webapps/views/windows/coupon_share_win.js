define(["views/modules/base"],function(base){

	var __call_back = null;

	var note_ui = {
		cols:[
			{view: "icon", icon: "fa fa-exclamation-triangle"},
			{view:"label", align:"left",css:"warning", label:"每条文案之间用换行（回车键--Enter）分割"}
		]
	};

	var form_ui = {
		view:"form",
		id:"coupon_share_form",
		elementsConfig:{
			labelWidth: 100,
			width:450
		},
		rows: [
			{ view:"text",name:"coupon_share_id",hidden:true,required:true},
			{ view:"text", label:'分型名称:', name:"coupon_share_name",placeholder: "分享名称",value:"",required:true},
			{ view: "richselect", id:"coupon_package_id",name:"coupon_package_id",options:[],label:"选择卡包:",required:true,placeholder:"请选择分享卡包",value:""},
			{ view:"textarea",label:"分享文案:", name:"note_list",id:"note_list",height:150,required:true,placeholder:"输入文案",value:"" },
			{ view:"text",label:"分享地址:", name:"share_url",id:"share_url",height:150,required:true,placeholder:"分享地址",value:"" }
		]
	};

	var button_ui = {
		margin:15,
		cols:[
			{},
			{view:"button",label:"提交",width:80,click:function(){
				if($$("coupon_share_form").validate()){
					var formdata = $$("coupon_share_form").getValues();
					var text = formdata.note_list;
					var note_arrs = text.split("\n");
					var phrase_list = [];
					for(var i=0;i<note_arrs.length;i++){
						var user_phone = note_arrs[i].trim();
						if(user_phone===""){
							continue;
						}
						phrase_list.push(user_phone);
					}
					formdata.phrase_list = phrase_list;
					var action = "coupon_share/create.json";
					if(formdata.coupon_share_id){
						action = "coupon_share/update.json";
					}
					base.postReq(action,formdata,function(data){
						if(typeof __call_back === 'function'){
							__call_back(data);
						}
						webix.$$("coupon_share_win").close();
					});
				}
			}},
			{view:"button",label:"取消",width:80,click:function(){
				webix.$$("coupon_share_win").close();
			}}
		]
	};

	var win_ui = {
			view:"window",
			modal:true,
			id:"coupon_share_win",
			position:"center",
			head:{
				view:"toolbar",height:40, cols:[
					{view:"label", label: "文案编辑" },
					{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('coupon_share_win').close();"}
				]},
			body:{
				rows:[
					form_ui,note_ui,button_ui
				]
			}
		};

	var init_data = function(coupon_share_id){
		base.getReq("coupon_packages.json",function(packages){
			var list = $$("coupon_package_id").getPopup().getList();
			list.clearAll();
			for(var a in packages){
				packages[a]['id'] = packages[a].coupon_package_id;
				packages[a]['value'] = packages[a].coupon_package_name;
				list.add(packages[a]);
			}
			if(coupon_share_id){
				$$("coupon_package_id").disable();
				base.getReq("coupon_share/"+coupon_share_id,function(data){
					data.note_list = data.phrase_list.join("\n");
					$$("coupon_share_form").parse(data);
				});
			}
		});
	}

	return {
		$ui:win_ui,
		$init_data:init_data,
		$add_call_back:function(func){
			__call_back = func;
		}
	};
});