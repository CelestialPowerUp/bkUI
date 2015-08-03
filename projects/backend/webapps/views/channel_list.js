define([
	"views/modules/base",
	"views/forms/channel_edit",
	"views/modules/table_page",
	"views/menus/copytext"
	], function(base,channel_edit,table_page,copy){

	var search_list = function(){
		base.getReq("channels.json?all=true",function(data){
			parse_table_data(data);
		});
	};
	
	var parse_table_data = function(items){
		$$("channel_list").clearAll();
		for(var i=0;i<items.length;i++){
			$$("channel_list").add(items[i]);
		}
	};
	
	var button_ui = {height:40,
			cols:[
				  { view: "button", type: "iconButton", icon: "plus", label: "新增渠道", width: 110, click: function(){
			    	  this.$scope.ui(channel_edit.$ui).show();
					  channel_edit.$init_data();
			    	  channel_edit.$add_submit_callback(function(){
			    		  search_list();
			    	  });
			      }},
			      {}]
			};
	
	var onClick = {
			"edit":function(e,id,node){
				var item = this.getItem(id);
				this.$scope.ui(channel_edit.$ui).show();
				channel_edit.$init_data(item.channel_id);
			},
			"views":function(e,id,node){
				var item = this.getItem(id);
				var url = window.location.origin+window.location.pathname+"open-index.html#!/open/channel_valid_order_filter_for_open:code="+item.channel_code;
				copy.$parse(url);
			}
		};

	var on_event = {
		"onCheck":function(rwo, column, state){
			var item = $$("channel_list").getItem(rwo);
			if(typeof(item)==='undefined'){
				return ;
			}
			var channel_id = item.channel_id;
			base.getReq("channel.json/"+channel_id,function(data){
				data.disabled = item.disabled;
				base.postReq("channel/update.json",data,function(id){
					base.$msg.info("状态修改成功");
					search_list();
				});
			});
		}
	};
	
	var product_data_table = {
		  id:"channel_list",
		  view:"datatable",
		  select:false,
		  editable:true,
		  autowidth:true,
		  autoheight:true,
		  rowHeight:45,
		  hover:"myhover",
		  onClick:onClick,
		  on:on_event,
		  columns:[
					{id:"channel_id",width:50,hidden:true},
					{id:"channel_name", header:"渠道名称", width:120},
			  		{id:"channel_code", header:"渠道编码",	template:"<span><u id='#channel_code#' onclick='webix.$$(\"copyPopup\").show(this)' class='views'>#channel_code#</u></span>", width:250},
			 		{id:"create_time", header:"创建时间", width:230},
			        {id:"last_modified_time", header:"修改时间", width:230},
			  		{id:"disabled",header:"是否有效", template:"{common.checkbox()}", checkValue:false, uncheckValue:true},
					{id:"trash", header:"操作", width:150, template:"<span><a href='#' class='edit'> 编辑</a>"}
				]
	};
	
	var layout ={
		cols:[{type:"clean",margin:10,paddingX:15,paddingY:15, rows:[button_ui,product_data_table]}
			,{}
		]

	}

	return {
		$ui: layout,
		$oninit:function(app,config){
			webix.$$("title").parse({title: "管家管理", details: "管家列表"});
			search_list(1);
		}
	};

});