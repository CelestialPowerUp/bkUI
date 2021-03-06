define(["../modules/base","../../js/callcenter"],function(base,callcenter){

	//座席状态改变
	var agentStateChange = function (stateParam){
		//准备中
		var state = 0;
		if(stateParam==1) {//准备就绪
			//座席状态只能从0到1
			base.setAgentState(state);
			state = stateParam;
		}
		base.setAgentState(state);
	};

	//更新座席状态提示
	function updateStateTip(){
		var currentAgentState = base.getAgentState();
		if(currentAgentState==1){
			$$("agent_state_show").data.label = "在线中(可接听和拨打电话)";
		}else{
			$$("agent_state_show").data.label = "离线中(只可拨打电话)";
		}
		$$("agent_state_show").refresh();
	}

	return {
		$ui:{
			view: "popup",
			id: "agent_submenu",
			width: 250,
			borderless:false,
			padding:0,
			body:{
				rows:[
					{view:"label",id:"agent_state_show",hidden:true,label:"在线中(可接听和拨打电话)",align:"center"},
					{view:"button",id:"agent_state_to_free_btn",value:"上线",click:function(){
						var agentValue = $$("agent_menu").getValue();
						if(agentValue=='非座席'){
							webix.message({ type:"error",expire:3000,text:"非座席：无法登录"});
							return;
						}
						$$("agent_submenu").hide();
						callcenter.ivrLogin();
						agentStateChange(1);
					}},
					{view:"button",id:"agent_state_to_busy_btn",hidden:true,value:"离开",click:function(){
						$$("agent_submenu").hide();
						//agentStateChange(0);
						Cloopen.disconnect();
					}}
				]
			}
		},
		agentStateChange:agentStateChange
	};

});