define(["views/modules/base",
	"views/modules/upload"],function(base,upload){

	var img_fomat = function(obj){
		if(typeof obj.thumbnail_url === 'undefined' || obj.thumbnail_url === ""){
			return '<img src="http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF" class="content" ondragstart="return false"/>';
		}
		return '<img onclick="window.open(\''+obj.raw_url+'\')" src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
	};

	var layout = {
			view:"window",
			modal:true,
			id:"upload_wins",
			position:"center",
			head:{view:"toolbar",height:40, cols:[
					{view:"label", label: "图片上传" },
					{ view:"button", label: 'X', width: 35, align: 'right', click:"$$('upload_wins').close();"}
				]
			},
			body:{rows:[
				{height:150,width:400,id:"header_img",template:img_fomat},
				{height:25,borderless:true,template:"<a id='img_pick_files' style='padding-left: 150px' href='javascript:;'>[上传图片]</a>",
					on:{"onAfterRender":function(){
						upload.$bind_upload("img_pick_files",function(data){
							if(data.code==='00000'&&data.data!=null){
								var item = data.data;
								item.img_id = item.id;
								if(typeof callback === 'function'){
									callback(item);
								}
								$$("upload_wins").close();
							}
						});
					}}
				}
			]}
		}

	var callback = null;

	return {
		$ui:layout,
		$add_callback:function(func){
			if(typeof func === 'function'){
				callback = func;
			}
		}
	};
});