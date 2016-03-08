define(['../modules/base','../../models/base_data'],function(base,base_data){
	
	var call_add_order = function(order_id){

		console.log("收到新的活动订单："+order_id);

		base.getReq("/activity_record.json?activity_record_id="+order_id,function(order){

            webix.message({expire:5000,type:"notify",text:"亲,"+order.activity_name+"活动有新的订单了，快去看看吧！"});

			order.id = order.activity_record_id;

			webix.$$("new_activity_order_list").add(order);

			play_info();

		});
	};

	var play_info=function(){
		palyer = $$("default_audio");
		palyer.getVideo().play();
	};

	var layout = {
			view: "popup",
			id: "activityMessagePopup",
			width: 230,
			padding:0,
			zIndex:1,
			css:"list_popup",
			body:{
				type: "clean",
				borderless:true,
				rows:[
					{
						id:"new_activity_order_list",
						view: "list",
						autoheight: true,
						data: [],
						type:{
							height: 45,
							template: "<img class='photo' src='assets/imgs/photos/1.png' /><span class='text'>#user_name#</span><span class='name'>#user_phone_number#</span>"
						},
						on:{"onItemClick":function(id, e, node){
							var item = this.getItem(id);
							$$("new_activity_order_list").remove(id);
							$$("activityMessagePopup").hide();
							if(typeof($$("activity_table_list"))==='undefined'){
								this.$scope.show("app/activity_list:activity_id="+item.activity_record_id+":code="+item.activity_code);
							}else{
								//$$("activity_table_list").add(item);
								$$("refresh").callEvent("onItemClick",[item.activity_record_id,item.activity_code]);
								//$$("activity_table_list").select(item.id);
							}

						},
						"onAfterAdd":function(id,index){
							$$("activity_message").setValue($$("new_activity_order_list").count());
							$$("activity_message").refresh();
						},
						"onAfterDelete":function(id){	
							$$("activity_message").setValue($$("new_activity_order_list").count());
							$$("activity_message").refresh();
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