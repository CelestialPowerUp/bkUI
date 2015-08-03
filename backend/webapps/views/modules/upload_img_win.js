define(["views/modules/base"],function(base){
	
	var callBack = null;
	
	var upload_pictrue = {
			cols: [
			    {height:25,template:"<a id='pickfiles' href='javascript:;'>[上传图片]</a>",
			    	on:{"onAfterRender":function(){
			    		init_qiniu();
			    	}}},
			    {view:"button",width:120,label:"确定",click:function(){
			    	if(callBack!=null){
			    		var data = {};
			    		data.pics_id = [];
			    		data.pics = $$("img_list").serialize();
			    		for(var i=0;i<data.pics.length;i++){
			    			data.pics_id.push(data.pics[i]['id']);
			    		}
			    		callBack(data);
			    	}
			    	$$("upload_img_win").close();
			    }},
			    {view:"button",width:120,label:"取消",click:function(){
			    	$$("upload_img_win").close();
			    }},
			]
		};
	
	var img_fomat = function(obj){
		return '<img src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
	};
	
	var init_qiniu = function(){
		var uploader = Qiniu.uploader({
		    runtimes: 'html5,flash,html4',    //上传模式,依次退化
		    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
		    uptoken: base.$get_upload_token(),
		    domain: 'http://qiniu-plupload.qiniudn.com/',
		        //bucket 域名，下载资源时用到，**必需**
		    max_file_size: '100mb',           //最大文件体积限制
		    max_retries: 3,                   //上传失败最大重试次数
		    dragdrop: true,                   //开启可拖曳上传
		    chunk_size: '4mb',                //分块上传时，每片的体积
		    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
		    init: {
		        'FileUploaded': function(up, file, info) {
		        	info = jQuery.parseJSON(info);
		        	$$("img_list").add(info['data']);
		        	webix.message("图片上传成功");
		        },
		        'Error': function(up, err, errTip) {
		               //上传出错时,处理相关的事情
		        	webix.message("文件上传失败");
		        }
		    }
		});
	};
	
	var img_list_ui =  {
			view: "dataview",
			id: "img_list",
			css: "nav_list",
			yCount: 3,
			xCount:5,
			select: true,
			scroll: false,
			type: {
				width: 100,
				height: 65
			},
			template: img_fomat,
			on:{"onItemClick":function(id){
				var item = this.getItem(id);
				window.open(item.original_url);
			}}
		};
	
	var layout = {
			view:"window",
			modal:true,
			id:"upload_img_win",
			position:"center",
			head:"图片查看",
			body:{rows:[img_list_ui,upload_pictrue]}
		}
	
	var addCallBack = function(callback){
		callBack = callback;
	};
	
	var init_img  =function(data){
		for(var i=0;i<data.length;i++){
			$$("img_list").add(data[i]);
		}
	};
	
	return {
		$ui:layout,
		$addCallBack:addCallBack,
		$init_img:init_img
	};
});