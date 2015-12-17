define(["views/modules/base",
	"models/base_data"],function(base,base_data){

	var callback = "";
	
	var list_ui = {
			view: "list",
			css: "tasks_list",
			id:"topic_list_",
			height:250,
			width:450,
			type: {
                height: 35,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.topic_name +"</div>";
				}
			},
			data: [],
			on: {
				onItemClick:function(id){
					var item = this.getItem(id);
					var datas = $$("topic_list_").serialize();
					for(var i=0;i<datas.length;i++){
						if(datas[i].ware_id === item.ware_id){
							datas[i].$check = true;
							continue;
						}
						datas[i].$check = false;
					}
					$$("topic_list_").refresh();
				}
			}
	};

	var filter = {margin:15,cols:[
		{view:"text",placeholder:"请输入查找的内容:",css:"fltr",labelWidth:135,on:{
			onTimedKeyPress:function(){
				var value = this.getValue().toLowerCase();
				var datas = $$("topic_list_").serialize();
				for(var i=0;i<datas.length;i++){
					try{
						var str1 = datas[i].topic_name;
						datas[i].value_weight = base.$value_weight(value,str1);
					}catch(e){
						console.log(datas[i]);
					}
				}
				$$("topic_list_").sort("#value_weight#","desc");
				$$("topic_list_").scrollTo(0,0);
			}
		}}
	]};

	var get_check_data = function(){
		var datas = $$("topic_list_").serialize();
		for(var i=0;i<datas.length;i++){
			if(datas[i]['$check']){
				return datas[i];
			}
		}
	};

	var button_ui = {cols:[{},{view:"button",label:"确定",width:80,click:function(){
								var check_data = get_check_data();
								if(!check_data){
									base.$msg.error("未选择关联的主题");
									return;
								}
								if(typeof(callback)==="function"){
									callback(check_data);
								}
								webix.$$("model_win").close();
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("model_win").close();
	                       }}]};
	
	var layout = {
			view:"window", modal:true, id:"model_win", position:"center",
			head:"选择主题列表",
			body:{
				type:"space",
				rows:[filter,list_ui,button_ui]
			}
		};
	
	var init_data = function(){
		base.getReq("topics/enabled",function(data){
			for(var i=0;i<data.length;i++){
				$$("topic_list_").add(data[i]);
			}
		});
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