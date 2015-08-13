define(["../forms/login"],function(login){
	
	var api_root = "/v1/api/";
	
	var show_login_win = function(){
		$$("main_body").$scope.show("/app/index");
		webix.ui(login.$ui).show();
        $$("login_win").getBody().focus();
	}
	var filter_url = function(url){
		return url.indexOf("/api/")>0?url:api_root+url;
	}

	var postForm = function(url,param,callBack,failureBack){
		$.ajax({
            type:"POST",
            dataType:"json",
            timeout:15*1000,
            url: filter_url(url),
            data:param,
            beforeSend: function (request)
            {
                request.setRequestHeader("API-Client-Device-Type", 'web');
                var user_info = webix.storage.local.get("user_info");
                if(user_info!=null){
                	request.setRequestHeader("API-Access-Token", user_info['token']);
                }
            },
            success: function(data) {
                if(data&&data['code']=='00000'){
                	callBack(data['data']);
                }else if(data&&data['code']=='20007'){
                	show_login_win();
                }else{
                	webix.message({ type:"error",expire:5000,text:data['message']});
                	if(failureBack){
                		failureBack(data);
                	}
                }
            },
            error:function(xhr,status,error){
            	webix.message({ type:"error",expire:5000,text:"服务器异常 status:"+status});
            }
		});
	};
	
	var postFormAjax = function(url,param,callBack,failureBack){
		$.ajax({
            type:"POST",
            dataType:"text",
            timeout:60*1000,
            url: filter_url(url),
            data:param,
            beforeSend: function (request)
            {
                request.setRequestHeader("API-Client-Device-Type", 'web');
                var user_info = webix.storage.local.get("user_info");
                if(user_info!=null){
                	request.setRequestHeader("API-Access-Token", user_info['token']);
                }
            },
            success: function(data) {
            	console.log(data);
            	if(typeof(callBack)==='function'){
            		callBack(data);
            	}
            },
            error:function(xhr,status,error){
            	if(typeof(failureBack)==='function'){
            		failureBack(xhr.status,error);
            	}
            }
		});
	};
	
	var postReq = function(url,param,callBack,failureBack,notAsync){
		var async = true;
		if(notAsync){
			async = false;
		}
		$.ajax({
            type:"POST",
            dataType:"json",
            contentType: "application/json",
            timeout:15*1000,
            url: filter_url(url),
			async:async,
            data:JSON.stringify(param),
            beforeSend: function (request)
            {
                request.setRequestHeader("API-Client-Device-Type", 'web');
                var user_info = webix.storage.local.get("user_info");
                if(user_info!=null){
                	request.setRequestHeader("API-Access-Token", user_info['token']);
                }
            },
            success: function(data) {
                if(data&&data['code']=='00000'){
                	callBack(data['data']);
                }else if(data&&data['code']=='20007'){
                	show_login_win();
                }else{
                	webix.message({ type:"error",expire:5000,text:data['message']});
                	if(failureBack){
                		failureBack(data);
                	}
                }
            },
            error:function(xhr,status,error){
            	webix.message({ type:"error",expire:5000,text:"服务器异常 status:"+status});
            }
		});
	};
	var getReq = function(url,callBack,failureBack,notAsync){
		var async = true;
		if(notAsync){
			async = false;
		}
		$.ajax({
			type:"GET",
			dataType:"json",
			timeout:15*1000,
			url: filter_url(url),
			async:async,
			beforeSend: function (request)
			{
				request.setRequestHeader("API-Client-Device-Type", 'web');
				var user_info = webix.storage.local.get("user_info");
				if(user_info!=null){
					request.setRequestHeader("API-Access-Token", user_info['token']);
				}
			},
			success: function(data) {
				if(data&&typeof(data['code'])==='undefined'){
					callBack(data);
					return ;
				}
				if(data&&data['code']=='00000'){
					callBack(data['data']);
				}else if(data&&data['code']=='20007'){
					show_login_win();
				}else{
					webix.message({ type:"error",expire:5000,text:data['message']});
					if(failureBack){
						failureBack(data);
					}
				}
			},
			error:function(xhr,status,error){
				webix.message({ type:"error",expire:5000,text:"服务器异常 status:"+status});
			}
		});
	};
	
	var getLocation = function(name,callBack){
		$.ajax({
            type:"GET",
            dataType:"json",
            timeout:15*1000,
            url: api_root+"/public/address.json?keyword="+name,
            //data:{keyword:name},
            beforeSend: function (request)
            {
                request.setRequestHeader("API-Client-Device-Type", 'web');
                var user_info = webix.storage.local.get("user_info");
                if(user_info!=null){
                	request.setRequestHeader("API-Access-Token", user_info['token']);
                }
            },
            success: function(data) {
            	callBack(data);
            },
            error:function(xhr,status,error){
            	webix.message({ type:"error",expire:5000,text:"服务器异常 status:"+status});
            }
		});
		
	};
	
	var parse_url_parmas = function(path){
		//child page
		if (path.indexOf("#!") >= 0){
			path = path.substr(path.indexOf("#!")+2);
		}
		//route to page
		var parts = parse_parts(path);
		if(parts.length>0&&parts[parts.length-1].params!=null){
			return parts[parts.length-1].params;
		}
		return [];
	};
	
	var parse_parts = function(url){
		//split url by "/"
		var chunks = url.split("/");
		
		//for each page in url
		for (var i = 0; i < chunks.length; i++){
			var test = chunks[i];
			var result = [];

			//detect params
			var pos = test.indexOf(":");
			if (pos !== -1){
				var params = test.substr(pos+1).split(":");
				//detect named params
				var objmode = params[0].indexOf("=") !== -1;

				//create hash of named params
				if (objmode){
					result = {};
					for (var j = 0; j < params.length; j++) {
						var dchunk = params[j].split("=");
						result[dchunk[0]] = dchunk[1];
					}
				} else {
					result = params;
				}
			}
			
			//store parsed values
			chunks[i] = { page: (pos > -1 ? test.substr(0, pos) : test), params:result };
		}

		//return array of page objects
		return chunks;
	}

	var check_empty = function(value){
		if(typeof(value)==='undefined' || value === null || value === ""){
			return true;
		}
		return false;
	};
	
	var format_time = function(time){
		if(check_empty(time)){
			return "";
		}
		var timeArr=time.split(" ");
		var d=timeArr[0].split("-");
		var t=timeArr[1].split(":");
        var data = new Date(d[0],(d[1]-1),d[2],t[0],t[1],""); 
        var year = data.getFullYear();  //获取年
        var month = data.getMonth() + 1;    //获取月
        var day = data.getDate(); //获取日
        var hours = data.getHours(); 
        var minutes = data.getMinutes();
        var seconds = data.getUTCSeconds();
        var milliseconds = data.getUTCMilliseconds();
        time = year + "-" + month + "-" + day + "T" + hours + ":" + minutes+":"+seconds+"."+milliseconds+"Z";
        return time;
	};

	var show_time = function(time){
		if(check_empty(time)){
			return "";
		}
		time = time.replace("T"," ");
		var timeArr=time.split(" ");
		var d=timeArr[0].split("-");
		var t=timeArr[1].split(":");
		var data = new Date(d[0],(d[1]-1),d[2],t[0],t[1],"");
		var year = data.getFullYear();  //获取年
		var month = data.getMonth() + 1;    //获取月
		var day = data.getDate(); //获取日
		var hours = data.getHours();
		var minutes = data.getMinutes();
		var seconds = data.getUTCSeconds();
		var milliseconds = data.getUTCMilliseconds();
		time = year + "-" + month + "-" + day +" "+ hours + ":" + minutes;
		return time;
	};

	var show_time_sec = function(time){
		if(check_empty(time)){
			return "";
		}
		time = time.replace("T"," ");
		var timeArr=time.split(" ");
		var d=timeArr[0].split("-");
		var t=timeArr[1].split(":");
		var data = new Date(d[0],(d[1]-1),d[2],t[0],t[1],"");
		var year = data.getFullYear();  //获取年
		var month = data.getMonth() + 1;    //获取月
		var day = data.getDate(); //获取日
		var hours = data.getHours();
		var minutes = data.getMinutes();
		var seconds = data.getUTCSeconds();
		time = year + "-" + month + "-" + day +" "+ hours + ":" + minutes+":"+seconds;
		return time;
	};

	var toDay = function(time){
		if(check_empty(time)){
			return "";
		}
		time = time.replace("T"," ");
		var timeArr=time.split(" ");
		var d=timeArr[0].split("-");
		var t=timeArr[1].split(":");
		var data = new Date(d[0],(d[1]-1),d[2],t[0],t[1],"");
		var year = data.getFullYear();  //获取年
		var month = data.getMonth() + 1;    //获取月
		var day = data.getDate(); //获取日
		time = year + "-" + month + "-" + day;
		return time;
	};
	
	var toNum = function(p){
		if(p==null || p==""){
			return 0;
		}
		return Number(p);
	}
	
	var getUserId = function(){
		 var user_info = webix.storage.local.get("user_info");
         if(user_info!=null){
         	return user_info['user_id'];
         }
         return -1;
	};
	
	var getUrlParam = function(key){
		var param = parse_url_parmas(window.location.href);
		if(param!=null){
			return param[key];
		}
		return null;
	};
	
	var getUrlParams = function(){
		return parse_url_parmas(window.location.href);
	}
	
	var request_upload_token = function(){
			getReq("media/uptoken.json",function(data){
				console.log("获取上传图片token"+data);
				webix.storage.session.put("upload_token",data);
			});
			webix.storage.session.put("upload_token_time",new Date());
	};
	
	var check_upload_token = function(){
		var upload_token_time = webix.storage.session.get("upload_token_time");
		var upload_token = webix.storage.session.get("upload_token");
		if(upload_token_time===null || upload_token===null){
			request_upload_token();
			upload_token_time = webix.storage.session.get("upload_token_time");
		}
		if(upload_token_time!=null){
			var cur_time = new Date().getTime();
			var token_time = new Date(upload_token_time).getTime();
			var seconds = Math.floor((cur_time-token_time)/1000);
			if(seconds>10*60){//10分钟更新一次token
				console.log("update token");
				request_upload_token();
			}
		}
	};
	
	var get_upload_token = function(){
		check_upload_token();
		return webix.storage.session.get("upload_token");
	};

	var pop_msg = {
		info:function(text){
			webix.message(text);
		},
		error:function(text){
			webix.message({ type:"error", text:text});
		}
	};

	var str_isEmpty = function(value){
		return typeof (value) === 'undefined' || value === null || value ==="";
	}

	var value_weight = function(value,source){
		value = value.toLowerCase();
		source = source.toLowerCase();
		if(value.length<=0){
			return 0;
		}
		var count = 0;
		for(var i=0;i<value.length;i++){
			var c = value.charAt(i);
			if(source.indexOf(c)>=0){
				count++;
			}
		}
		if(source.indexOf(value)>=0){
			count++;
		}
		if(source.indexOf(value)===0){
			count +=source.length;
		}
		return count/value.length;
	};
	
	check_upload_token();

	var isPhoneNumber = function(value){
		var reg = /^1[34578][0-9]{9}$/;
		if(!reg.test(value)){
			return false;
		}
		return true;
	}
	
	check_upload_token();

	//座席登陆
	var agentLogin = function(){
		var user_id = getUserId();
		if(!user_id){
			webix.message({ type:"error",expire:5000,text:"座席登陆失败"});
		}
		var url = "ivr/agent?user_id="+user_id;
		getReq(url,function(data){
			webix.storage.local.put("agent_token",data.agent_token);
			webix.storage.local.put("agent_id",data.agent_id);
			window.location.reload(true);
		},function(){},true);
	};

	//获取用户座席信息
	var getAgentToken = function(){
		var agentToken = webix.storage.local.get("agent_token");
		if(agentToken){
			return agentToken;
		}
		var user_id = getUserId();
		var url = "ivr/agent?user_id="+user_id;
		getReq(url,function(data){
			webix.storage.local.put("agent_token",data.agent_token);
			return webix.storage.local.get("agent_token");
		},function(){},true);
	};
	//获取座席ID
	var getAgentId = function(){
		var agentId = webix.storage.local.get("agent_id");
		if(agentId){
			return agentId;
		}
		var user_id = getUserId();
		var url = "ivr/agent?user_id="+user_id;
		getReq(url,function(data){
			webix.storage.local.put("agent_id",data.agent_id);
			return webix.storage.local.get("agent_id");
		},function(){},true);
	};

	//查询座席当前状态
	var getAgentState = function(){
		var agentId = getAgentId();
		var agentState = -1;
		if(!agentId){
			webix.message({ type:"error",expire:5000,text:"座席状态获取失败：座席ID不存在"});
			return agentState;
		}
		var url = "ivr/agent/state/"+agentId;
		getReq(url,function(data){
			agentState = data;
		},function(){},true);

		return agentState;
	};

	//查询座席当前状态
	var setAgentState = function(agentStateParam){
		var agentId = getAgentId();
		var agentState = 1;
		if(agentStateParam == 0){
			agentState = agentStateParam;
		}
		if(!agentId){
			webix.message({ type:"error",expire:5000,text:"座席状态获取失败：座席ID不存在"});
			return agentState;
		}

		var result = false;
		var param = {};
		param.agent_id = agentId;
		param.agent_state = agentState;
		var url = "ivr/agent/state/update";
		postReq(url,param,function(data){
			result = true;
		},function(){},true);

		return result;
	};

	//根据手机号获取用户信息
	var getUserInfoByPhone = function(phone){
		var result = null;
		if(phone){
			var url = "meta_user/"+phone;
			getReq(url,function(data){
				result = data;
			},function(){},true);
		}
		return result;
	};

	return {
		postReq:postReq,
		getReq:getReq,
		getLocation:getLocation,
		parse_url_parmas:parse_url_parmas,
		format_time:format_time,
		toNum:toNum,
		postForm:postForm,
		$postFormAjax:postFormAjax,
		getUserId:getUserId,
		get_url_param:getUrlParam,
		get_url_params:getUrlParams,
		$get_upload_token:get_upload_token,
		$request_upload_token:request_upload_token,
		$msg:pop_msg,
		$to_day:toDay,
		$show_time:show_time,
		$show_time_sec:show_time_sec,
		str_isEmpty:str_isEmpty,
		$value_weight:value_weight,
		isPhoneNumber:isPhoneNumber,
		getAgentToken:getAgentToken,
		getAgentId:getAgentId,
		getAgentState:getAgentState,
		setAgentState:setAgentState,
		agentLogin:agentLogin,
		getUserInfoByPhone:getUserInfoByPhone
	};
});