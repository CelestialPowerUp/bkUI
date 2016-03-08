//中文乱码吗
define(["views/menus/message",
		"views/menus/activity_message",
        "views/modules/base"],function(message,activity_message,base){
	
	  var _global = (function(){return this;}).call(null);
	  
	  var _execute = function(path,params,callBack){
		  sendRemoteCmd(_toRemoteBody(path,params,callBack));
	  };
	  
	  var _toRemoteBody = function (path,params,callBack){
		  return {
			  'path' : path,
			  'params' : params,
			  'timeout' : 30, //30秒默认掉用远程代码失败
			  'callSuccess' : callBack,
			  'callError' : ''
		  };
	  };
	  
	  var ajax_req = function(remoteBody){
		  var param = toSendData(remoteBody);
		  base.$postFormAjax(remoteBody['path'],param,remoteBody['callSuccess'],remoteBody['callError']);
	  };
		
		var getRootPath = function(){
			var host=document.location.host;
			var contextPath=document.location.pathname.split("/")[1];
			return "http://"+host+"/"+contextPath+"/";
		};
		
		var getHttpurl = function(url){
			if(url.indexOf("http://") == 0 || url.indexOf("https://") == 0){
				return url;
			}
			return getRootPath()+url;
		};
		
		var toSendData=function(remoteBody) {
			var datas = "";
			var paramCount = 0;
			for(var param in remoteBody['params']){
				datas += "&"+param+"="+remoteBody['params'][param];
				paramCount++;
			}
			datas += "&paramCount="+paramCount+"&timed=" + new Date().getTime();
			return datas;
		};
		
	  var _getObject = function(prop) {
		var parts = prop.split(".");
	    var value;
	    var scope =  _global;
	    while(parts.length > 0) {
	      var currprop = parts.shift();
	      value = scope[currprop];
	      if (parts.length > 0 && value == null) return undefined;
	      scope = value;
	    }
	    return value;
	  };

	  var _setObject = function(prop, obj) {
	    var parts = prop.split(".");
	    var level;
	    var scope =  _global;
	    while(parts.length > 0) {
	      var currprop = parts.shift();
	      if (parts.length == 0) {
	        scope[currprop] = obj;
	      }
	      else {
	        level = scope[currprop];
	        if (level == null) {
	          scope[currprop] = level = {};
	        }
	        scope = level;
	      }
	    }
	  };
	  
	  var random_words = function(len){
			  var  src="0123456789qwertyuioplkjhgfdsazxcvbnm";
			  var  tmp="";
			  var timestamp = new Date().getTime();
			  for(var  i=0;i<len;i++)  {
				  tmp  +=  src.charAt(Math.ceil(Math.random()*100000000)%src.length);
			  }
			  return  timestamp+tmp;
	  };
	  
	  var longPolling = function(){
		  console.log("long pulling "+document.location.pathname);
		  var remotbody = {
				path : "web_push/polling.json",
				params : {
					'path' : document.location.pathname,
					'timeout' : 30,
					'script_session': random_words(64)
				},
				callSuccess : function(data){
					try{
						var resp = jQuery.parseJSON(data);
						if(typeof(resp["code"])!='undefined'){
							console.log(resp);
							console.log("推送消息启动失败,检测到用户未登陆，或登陆的凭证已过期");
							return;
						}
					}catch(e){
						
					}
					longPolling();
					try{
						pushCallBack(data);
					}catch(e){
						console.log("回调失败");
						console.log(e);
					}
				},
				callError : function(status,msg){
					if(status==0||status==504){//超时
						longPolling();
					}
				}
			};
		  
		  ajax_req(remotbody);
	  };
	  
	  var pushCallBack = function(callbody){
		  eval(callbody);
	  };
	  
	  var _debug = function(message, stacktrace) {
	    var written = false;
	    try {
	      if (window.console) {
	        if (stacktrace && window.console.trace) window.console.trace();
	        window.console.log(message);
	        written = true;
	      }
	      else if (window.opera && window.opera.postError) {
	        window.opera.postError(message);
	        written = true;
	      }
	      else if (window.Jaxer && Jaxer.isOnServer) {
	        Jaxer.Log.info(message);
	        written = true;
	      }
	    }
	    catch (ex) { /* ignore */ }

	    if (!written) {
	      var debug = document.getElementById("dwr-debug");
	      if (debug) {
	        var contents = message + "<br/>" + debug.innerHTML;
	        if (contents.length > 2048) contents = contents.substring(0, 2048);
	        debug.innerHTML = contents;
	      }
	    }
	  };
	  
	  return {
		  $longPolling:longPolling
	  };
	  
});