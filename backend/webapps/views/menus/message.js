define(['../modules/base','../../models/base_data'],function(base,base_data){
	
	var call_add_order = function(order_id){
		console.log("收到的订单："+order_id);
		base.getReq("/orders.json?order_id="+order_id,function(order){
			var obj = {};
			obj.order_number = order.number;
			var car = order.car;
			obj.model = car.brand+car.category+car.model;
			obj.order_id = order.id;
            webix.message({expire:-1,type:"notify",text:"亲,有新的订单,快去查看认领吧"});
			webix.$$("new_order_list").add(obj);
            if(order.peer_source){
                play_info(order.peer_source);
            }
		});
	};

    var play_info=function(peer_source){
        var palyer = $$(peer_source+"_audio");
        if(typeof(palyer)==='undefined'){
            palyer = $$("default_audio");
        }
        palyer.getVideo().play();
    };

	var create_audio_ui = function(){
        var arr = base_data.$audio_order;
        var audio_ui = {hidden:true,cols:[]};
        for(var i=0;i<arr.length;i++){
            audio_ui.cols.push({
                id:arr[i].id+"_audio",
                view:"video",
                src: [arr[i].value],
                hidden:true,
                autoplay: false
            });
        }
        return audio_ui;
	};

	var audio_ui = create_audio_ui();
	
	var layout = {
			view: "popup",
			id: "messagePopup",
			width: 300,
			padding:0,
			zIndex:1,
			css:"list_popup",
			body:{
				type: "clean",
				borderless:true,
				rows:[
					audio_ui,
					{
						id:"new_order_list",
						view: "list",
						autoheight: true,
						data: [],
						type:{
							height: 35,
							template: "<span class='text'>#model#</span><span class='name'>#order_number#</span>"
						},
						on:{"onItemClick":function(id, e, node){
							var item = this.getItem(id);
							$$("new_order_list").remove(id);
							$$("messagePopup").hide();
							this.$scope.show("app/order_details:id="+item.order_id);
						},
						"onAfterAdd":function(id,index){
							$$("order_message").setValue($$("new_order_list").count());
							$$("order_message").refresh();
						},
						"onAfterDelete":function(id){	
							$$("order_message").setValue($$("new_order_list").count());
							$$("order_message").refresh();
						}}
					}
				]
	
			}
		};
	
	return {
		$ui:layout,
		$call_add_order:call_add_order
	};

});