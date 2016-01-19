define(["views/modules/base",
	"views/modules/upload"],function(base,upload){

	var __call_back = null;

	var note_ui = {
		cols:[
			 {view: "icon", icon: ""},
			// {view:"label", align:"left",css:"warning", label:"每条文案之间用换行（回车键--Enter）分割"}
		]
	};

	var img_fomat = function(obj){
		if(typeof obj.thumbnail_url === 'undefined' || obj.thumbnail_url === ""){
			return '<img src="http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF" class="content" ondragstart="return false"/>';
		}
		return '<img onclick="window.open(\''+obj.raw_url+'\')" src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
	};
	var pic_ui = {rows:[
		{height:300,width:350,id:"cover_img",template:img_fomat},
		{height:25,template:"<a id='cover_img_pickfiles' style='padding-left: 110px' href='javascript:;'>[上传文件]</a>",
			on:{"onAfterRender":function(){
				upload.$bind_upload("cover_img_pickfiles",function(data){
					if(data.code==='00000'&&data.data!=null){
						var item = data.data;
						item.img_id = item.id;
						$$("cover_img").parse(item);
						$$("share_img_id").setValue(item.img_id);
						// $$("img_url").setValue(item.raw_url);
					}
				});
			}}},
		{}
	]};

	var form_ui = {
		view:"form",
		id:"app_form",
		elementsConfig:{
			labelWidth: 100,
			width:450
		},
		rows: [
			{ view:"text",name:"id",hidden:true,required:true},
			{ view:"text", label:'包名:', name:"app_name",placeholder: "包名",value:"",required:true},
			{ view:"text", label:'包版本:', name:"app_version",placeholder: "包版本",value:"",required:true},
			{ view:"richselect", id:"os_type",name:"os_type",options:[{"id":"android",value:"android"},{"id":"ios",value:"ios"}],label:"操作系统:",required:true,placeholder:"请选择分享卡包",value:"android"},
			{ view:"richselect", id:"enable",name:"enable",options:[{"id":"true",value:"是"},{"id":"false",value:"否"}],label:"是否有效:",required:true,placeholder:"",value:"true"},
			{ view:"text", label:"端类型", id:"app_peer_type",name:"app_peer_type",value:"client",hidden:true},
			{ view:"textarea",label:"分享文案:", name:"description",id:"description",height:150,required:true,placeholder:"说明",value:"" },
			{ view:"text",name:"attachment_id",id:"attachment_id",hidden:true}
		]
	};

	var button_ui = {
		margin:15,
		cols:[
			{},
			{view:"button",label:"提交",width:80,click:function(){
				if($$("app_form").validate()){
					var formdata = $$("app_form").getValues();
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
				webix.$$("app_win").close();
			}}
		]
	};

	var win_ui = {
			view:"window",
			modal:true,
			id:"app_win",
			position:"center",
			head:{
				view:"toolbar",height:40, cols:[
					{view:"label", label: "操作窗口" },
					{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('coupon_share_win').close();"}
				]},
			body:{
				cols:[
					{
						rows:[
							form_ui,note_ui
						]
					},
					{
						margin:15,rows:[
							pic_ui,button_ui
						]
					}
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
					console.log(data);
					data.note_list = data.phrase_list.join("\n");
					$$("coupon_share_form").parse(data);

					/*回显图片*/
					var shareImg = data.share_img;
					if(shareImg){
						$$("cover_img").parse(shareImg);
					}
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