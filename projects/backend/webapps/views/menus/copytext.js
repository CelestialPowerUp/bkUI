define(["../modules/base"],function(base){

	var clip = null;

	return {
		$ui:{
			view: "popup",
			id: "copyPopup",
			width: 300,
			padding:0,
			css:"list_popup",
			body:{
				rows:[
					{view:"text",id:"data",value:""}
				]
			}
		},
		$parse:function(data){
			$$("data").setValue(data);
		}
	};

});