define(["../forms/login"],function(login){

	//var server = "/ws";
	var server = "";
	if(window.location.href.indexOf("/ws/bk")>=0){
		server = "/ws";
	}
	if(window.location.href.indexOf("/hsj/bk")>=0){
		server = "/hsj";
	}
	if(window.location.href.indexOf("/develop/bk")>=0){
		server = "/develop";
	}
	if(window.location.href.indexOf("/staging/bk")>=0){
		server = "/staging";
	}
	var api_root = "/v1/api/";
	
	var show_login_win = function(){
		$$("main_body").$scope.show("/app/index");
		webix.ui(login.$ui).show();
        $$("login_win").getBody().focus();
	}
	var filter_url = function(url){
		return server+(url.indexOf("/api/")>0?url:api_root+url);
	}

	/**
	 * 请求服务器头信息
	 * @param request
	 */
	var beforeReq = function(request){
		request.setRequestHeader("API-Client-Device-Type", 'backend');
		var user_info = webix.storage.local.get("user_info");
		if(user_info!=null){
			request.setRequestHeader("API-Access-Token", user_info['token']);
		}
	}

	/**
	 * post表单提交
	 * @param url
	 * @param param
	 * @param callBack
	 * @param failureBack
	 */
	var postForm = function(url,param,callBack,failureBack){
		$.ajax({
            type:"POST",
            dataType:"json",
            timeout:15*1000,
            url: filter_url(url),
            data:param,
            beforeSend: beforeReq,
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
            beforeSend: beforeReq,
            success: function(data) {
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

	/**
	 * post请求
	 * @param url
	 * @param param
	 * @param callBack
	 * @param failureBack
	 * @param notAsync
	 */
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
            beforeSend: beforeReq,
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

	/**
	 * get请求
	 * @param url
	 * @param callBack
	 * @param failureBack
	 * @param notAsync
	 */
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
			beforeSend: beforeReq,
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

	/**
	 * 同步get请求
	 * @param url
	 * @param callBack
	 * @param failureBack
	 */
	var getReqSync = function(url,callBack,failureBack){
		$.ajax({
			type:"GET",
			dataType:"json",
			timeout:15*1000,
			url: filter_url(url),
			async:false,
			beforeSend: beforeReq,
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

	/**
	 * 同步post请求
	 * @param url
	 * @param param
	 * @param callBack
	 * @param failureBack
	 */
	var postReqSync = function(url,param,callBack,failureBack){
		$.ajax({
			type:"POST",
			dataType:"json",
			contentType: "application/json",
			timeout:15*1000,
			url: filter_url(url),
			async:false,
			data:JSON.stringify(param),
			beforeSend: beforeReq,
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

	/**
	 * 百度获取地址接口
	 * @param name
	 * @param callBack
	 */
	var getLocation = function(name,callBack){
		$.ajax({
            type:"GET",
            dataType:"json",
            timeout:15*1000,
            url: filter_url("public/address.json?keyword="+name),
            beforeSend: beforeReq,
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

	var format_date = function(time){
		if(check_empty(time)){
			return "";
		}
		var timeArr=time.split("T");
		var d=timeArr[0].split("-");
		var t=timeArr[1].split(":");
		var data = new Date(d[0],(d[1]-1),d[2],t[0],t[1],"");
		var year = data.getFullYear();  //获取年
		var month = data.getMonth() + 1;    //获取月
		var day = data.getDate(); //获取日
		time = year + "-" + month + "-" + day;
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
	
	//座席登陆
	var agentLogin = function(){
		var user_id = getUserId();
		if(!user_id){
			webix.message({ type:"error",expire:5000,text:"座席登陆失败"});
		}
		var url = "ivr/agent?user_id="+user_id;
		getReqSync(url,function(data){
			if(data===null){
				return ;
			}
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
		getReqSync(url,function(data){
			if(data===null){
				return null;
			}
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
		getReqSync(url,function(data){
			if(data===null){
				return null;
			}
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
		getReqSync(url,function(data){
			agentState = data;
		},function(){},true);

		return agentState;
	};

	//更新座席当前状态
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
		postReqSync(url,param,function(data){
			result = true;
		},function(){});

		return result;
	};

	//根据手机号获取用户信息
	var getUserInfoByPhone = function(phone){
		var result = null;
		if(phone){
			var url = "meta_user/"+phone;
			getReqSync(url,function(data){
				result = data;
			},function(){});
		}
		return result;
	};

	/**
	 * 格式化钱
	 * @param obj
	 * @returns {string}
	 */
	var priceFormat = function(obj){
		return "￥"+obj;
	};

	var spilt_time = function(time){
		if(check_empty(time)){
			return ["",""];
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
		return [year+"-"+fill_zero(month)+"-"+fill_zero(day),fill_zero(hours)+":"+fill_zero(minutes)];
	}

	var fill_zero = function(value){
		if(value!==null){
			value += "";
			if(value.length==1){
				return "0"+value;
			}
		}
		return value;
	}

	/**
	 * 时间
	 * @param obj
	 * @returns {string}
	 */
	var time_period_format = function(start,end){
		var start_time = spilt_time(start);
		var end_time = spilt_time(end);
		return start_time[0]+" "+start_time[1]+"～"+end_time[1];
	};
	var getCurrentDate = function(){
		var data = new Date();
		var year = data.getFullYear();  //获取年
		var month = data.getMonth() + 1;    //获取月
		var day = data.getDate(); //获取日
		return  year + "-" + month + "-" + day ;
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
		getUserInfoByPhone:getUserInfoByPhone,
		priceFormat:priceFormat,
		format_date:format_date,
		getCurrentDate:getCurrentDate,
		time_period_format:time_period_format
	};
});