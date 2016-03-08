define(["views/modules/base"],function(base){

	var confirm_callback = null;

	var search_address  = function(){
		var address = $$("address").getValue();
		if(address==null||address==""){
			webix.message({ type:"error",expire:5000,text:"请输入查询的地址"});
			return;
		}
		base.getLocation(address,function(data){
			if(data['message']=="ok"){
				$$("pick_address").clearAll();
				for(var i=0;i<data.results.length;i++){
					try{
						var obj = {};
						obj.latitude=data.results[i]['location']['lat'];
						obj.longitude=data.results[i]['location']['lng'];
						obj.name=data.results[i].name;
						obj.address=data.results[i].address;
						$$("pick_address").add(obj);
					}catch(e){
						console.log(data.results[i]);
					}
				}
			}
		});
	};

	var address = {
		rows:[
			{cols:[{view: "text", id: "address",name:"address",keyPressTimeout:100, placeholder: "输入地址进行查询",width:250,value:"",
				on:{"onTimedKeyPress":function(){
					search_address();
				}}
			},
				{ view: "button", label: "查询", width: 80,height:45,hotkey: "enter", click:function(){
					search_address();
				}},{}]
			},
			{
				id:"pick_address",
				view:"list",
				height:250,
				template:"<div class='strong_text'>#name#</div><div class='light_text'>#address#</div>",
				type:{height:65,width:500},
				select:true,
				on:{"onItemClick":function(id, e, node){
					var item = this.getItem(id);
				}}
			}
		]
	};

	var button_ui = {
		cols:[
			{view:"button",value:"取消",click:function(){
				$$("address_win").close();
			}},
			{view:"button",value:"确定",click:function(){
				var location = $$("pick_address").getSelectedItem();
				if(typeof(location)==='undefined'){
					base.$msg.error("请选择一个地址！");
					return ;
				}
                confirm_callback(location);
				$$("address_win").close();
			}}
		]
	};

	var window = {
		view:"window",
		modal:true,
		id:"address_win",
		position:"center",
		head:"地址选择",
		body:{
			paddingX:15,
			paddingY:15,
			margin:15,
			type:"space",
			rows:[
				address,
				button_ui
			]
		}
	};

	var addc_confirm_envent = function(fuc){
		if(typeof(fuc)==='function'){
			confirm_callback = fuc;
		}
	};
	
	return {
		$ui:window,
		$addc_confirm_envent:addc_confirm_envent
	}
});