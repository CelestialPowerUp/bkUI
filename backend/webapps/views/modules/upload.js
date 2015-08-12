define(["views/modules/base"],function(base){
	
	var init_qiniu = function(tab,callback){
		var uploader = Qiniu.uploader({
		    runtimes: 'html5,flash,html4',    //上传模式,依次退化
		    browse_button: tab, //上传选择的点选按钮，**必需**
		    uptoken: base.$get_upload_token(),
		    domain: 'http://qiniu-plupload.qiniudn.com/',
		        //bucket 域名，下载资源时用到，**必需**
		    max_file_size: '100mb',           //最大文件体积限制
		    max_retries: 3,                   //上传失败最大重试次数
		    dragdrop: true,                   //开启可拖曳上传
		    chunk_size: '4mb',                //分块上传时，每片的体积
		    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
			save_key: true,
			//unique_names: true,				 // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
		    init: {
		        'FileUploaded': function(up, file, info) {
		        	webix.message("上传图片成功");
		        	info = jQuery.parseJSON(info);
		        	console.log(info);
		        	if(typeof(callback)==='function'){
		        		callback(info);
		        	}
		        },
		        'Error': function(up, err, errTip) {
		               //上传出错时,处理相关的事情
		        	console.log(up);
		        	console.log(err);
		        	console.log(errTip);
		        	webix.message("文件上传失败");
		        }
		    }
		});
	};
	
	return {
		$bind_upload:init_qiniu
	}
});