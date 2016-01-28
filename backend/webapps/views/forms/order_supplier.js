define(["views/modules/base"],function(base){

	var callback = "";

	var isNull = function(v){
		return v===null? "" : v;
	};
	
	var supplier_ui = {
			view: "list",
			css: "tasks_list",
			id:"supplier_list",
			height:500,
			width:800,
			type: {
                height: 90,
				marker: function(obj){
					return "<span class='webix_icon_btn fa-bell-o marker "+obj.type+"' style='max-width:32px;' ></span>";
				},
				check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
				template: function(obj,type){
					return "<div class=' "+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text strongtext'>"+obj.name+"</span>"+
						"<span></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电话："+isNull(obj.phone_number)+" "+isNull(obj.mobile_number)+
						"</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+obj.address+"</span></div>";
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
								var datas = $$("supplier_list").serialize();
								var checkdata = [];
								for(var i=0;i<datas.length;i++){
									if(datas[i]['$check']){
										checkdata.push(datas[i]);
									}
								}
								if(typeof(callback)==="function"){
									callback(checkdata);
								}
								webix.$$("supplier_win").close();
							}},
	                       {view:"button",label:"取消",width:80,click:function(){
	                    	    webix.$$("supplier_win").close();
	                       }}]};

	var filter = {cols:[
		{view:"text",label:"请输入过滤的内容:",css:"fltr",labelWidth:135,on:{
			onTimedKeyPress:function(){
				var value = this.getValue().toLowerCase();
				$$("supplier_list").filter(function(obj){
					var str = obj.name+obj.phone_number+obj.mobile_number+obj.address;
					return str.toLowerCase().indexOf(value)>=0;
				})
			}
		}},{}
	]};

	var layout = {
			view:"window", modal:true, id:"supplier_win", position:"center",
			head:"添加服务商",
			body:{
				type:"space",
				rows:[filter,supplier_ui,button_ui]
			}
		};
	
	var init_data = function(checked_data){
		base.getReq("meta_suppliers.json",function(data){
			for(var i=0;i<data.length;i++){
				var parse_data = parse_suppliers(data[i],checked_data);
				if(parse_data.$check){
					continue;
				}
				$$("supplier_list").add(parse_data);
			}
		});
	};
	
	var parse_suppliers = function(obj,arrs){
		for(var i=0;i<arrs.length;i++){
			if(arrs[i]['supplier_id']===obj['id']||arrs[i]['id'] === obj['id']){
				arrs[i].$check=true;
				return arrs[i];
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