define(["views/modules/base"],function(base){

	var callback = "";
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"user_list",
			height:450,
			width:650,
			type: {
                height: 35,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.user_name+" ( "+obj.phone_number+" ) </div>";
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
								var datas = $$("user_list").serialize();
								var checkdata = [];
								for(var i=0;i<datas.length;i++){
									if(datas[i]['$check']){
										checkdata.push(datas[i]);
									}
								}
								if(typeof(callback)==="function"){
									callback(checkdata);
								}
								webix.$$("model_win").close();
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};


	var filter = {cols:[
		{view:"text",label:"请输入查找的内容:",css:"fltr",labelWidth:135,on:{
			onTimedKeyPress:function(){
				var value = this.getValue().toLowerCase();
				var datas = $$("user_list").serialize();
				for(var i=0;i<datas.length;i++){
					try{
						var str1 = datas[i].user_name+datas[i].phone_number;
						datas[i].value_weight = base.$value_weight(value,str1);
					}catch(e){
						console.log(datas[i]);
					}
				}
				$$("user_list").scrollTo(0,0);
				$$("user_list").sort("#value_weight#","desc");
			}
		}},
	]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"服务商用户",
			body:{
				type:"space",
				rows:[filter,list_ui,button_ui]
			}
		};
	
	var init_data = function(role_code,choose_data){
		console.log(choose_data);
		base.getReq("users_by_role_code.json?role_code="+role_code,function(users){
			for(var i=0;i<users.length;i++){
				var parse_data = parse_check_data(users[i],choose_data);
				if(parse_data.$check){
					continue;
				}
				$$("user_list").add(parse_data);
			}
		});
	};
	
	var parse_check_data = function(obj,arrs){
		obj.$check = false;
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]['user_id']===obj['id']){
				obj.$check=true;
				break;
			}
		}
		return obj;
	};

	var add_callback = function(func){
		callback = func;
	};
	
	return {
		$ui:layout,
		$init_data:init_data,
		$add_callback:add_callback
	}

});