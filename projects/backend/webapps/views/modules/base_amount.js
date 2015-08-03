define(function(){

	return {
		$ui:{
			id:"amount_stats_info",
			css: "tiles",
			template: function(data){
				console.log(data);
				var t = null;
				var items = data.items;
				var html = "<div class='flex_tmp'>";
				for(var i=0; i < items.length; i++){
					t = items[i];
					html += "<div class='item "+t.css+"'>";
					html += "<div class='webix_icon icon fa-"+ t.icon+"'></div>";
					html += "<div class='details'>" +
						"<div class='value'>"+t.value+"</div><div class='text'>"+t.text+"</div>" +
						"</div>";
					html += "</div>";
				}
				html += "</div>";
				return html;
			},
			data:{
				items:[
					{id:1, text: "用户总量", value: 300, icon: "user", css: "users"},
					{id:12, text: "本月新增用户", value: 300, icon: "user", css: "users"},
					{id:2, text: "订单总量", value: 250, icon: "check-square-o", css: "orders"},
					{id:22, text: "本月新增订单", value: 250, icon: "check-square-o", css: "orders"},
					{id:3, text: "车总量", value: 85, icon: "line-chart", css:"profit" },
					{id:22, text: "本月新增车", value: 250, icon: "line-chart", css: "profit"}
				]
			}
		}
	};

});