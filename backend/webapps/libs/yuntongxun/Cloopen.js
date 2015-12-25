/*:
* web call 所需的js
* 需要jquery.js,swfobject.js,VideoPhone11.swf,expressInstall.swf
*/
var Cloopen = (function() {
	var URL="http://www.cloopen.com/js/voip/"; //swf的默认路径，
	var _restUrl="http://app.cloopen.com:8881/2013-12-26/inner/GetRTMPAddress"; //默认的resst接口地址(生产地址)
	var srv_type='production';// rtmp默认组名 
	var _isForceLogin=false;// 是否强制登陆
	
	var DEBUG = true; //是否调试状态
	var _currentState='IDLE';//场景当前状态:IDLE=空闲,ACTIVE=活动,CONNECTING=连接中,CONNECTED=已连接,OUTBOUND=呼出,INBOUND=呼入
	var swfIsOK = false;//swf是否ok
	var _notifyCallBack = null;//回调函数
	var objSwf = null;//swf对象 
	var _LoginType = null;//用户登录方式：TOKEN或者USER
	var _userToken = null;//TOKEN登录时用户对应的token 
	var _voipId = null;//USER方式登录时的voip子账号
	var _passwd = null;//登录口令
	
	function showLog(msg) { //输出日志
		if (DEBUG) 
		{
			if(window.console) console.log(msg);	
		}
	}

	function init(swfId, initCallBack, notifyCallBack, userToken) { //初始化：swf对象id,定义回调函数	
		_notifyCallBack = notifyCallBack; //定义回调函数
		_LoginType = "TOKEN";
		_userToken = userToken;//用户对应的token 
		swfIsOK = false;
		objSwf =null;
		_currentState='IDLE';
		swfobject.embedSWF(URL+"webcalljs11.swf?timestamp=" + new Date(), swfId, "215", "138", "11.0.0", 
				 "expressInstall.swf", false,{allowScriptAccess: 'always'
		}, null, function(e) {
			//if(!objSwf) objSwf=swfobject.getObjectById("idvideophone");
			if(e.success) {
				objSwf = e.ref; //获取swf对象
				swfIsOK = true;//swf可以使用
				if(typeof initCallBack === "function") {
					initCallBack();
				}
			}
			showLog("e.success = " + e.success + "\ne.id = " + e.id + "\ne.ref = " + e.ref + "\n ====" + objSwf);
			return e.success;
		});
		return swfIsOK;
	}

	function initByUser(swfId, initCallBack, notifyCallBack, voipId, passwd) { //初始化：swf对象id,定义回调函数
		_notifyCallBack = notifyCallBack; //定义回调函数
		_LoginType = "USER";
		_voipId = voipId;
		_passwd = passwd;
		swfIsOK = false;
		objSwf =null;
		_currentState='IDLE';
		swfobject.embedSWF(URL+"webcalljs11.swf?timestamp=" + new Date(), swfId, "215", "138", "11.0.0", "expressInstall.swf", false, {
			allowScriptAccess: 'always'
		}, null, function(e) {
			//if(!objSwf) objSwf=swfobject.getObjectById("idvideophone");
			if(e.success) {
				objSwf = e.ref; //获取swf对象
				swfIsOK = true;//swf可以使用
				if(typeof initCallBack === "function") {
					initCallBack();
				}
			}
			showLog("e.success = " + e.success + "\ne.id = " + e.id + "\ne.ref = " + e.ref + "\n ====" + objSwf);
			return e.success;
		});
		return swfIsOK;
	}

	function connectplus(appidAndtoken) { //连接登陆服务器
		if(swfIsOK){
			_currentState='CONNECTING';//CONNECTING=连接中
			objSwf.connectplus("TOKEN", srv_type, appidAndtoken, "",_isForceLogin);
		}else
			showLog('Cloopen:SWF is not ok');
	}	

	function connectplusByUser(voipId,passwd) { //连接登陆服务器
		if(swfIsOK){
			_currentState='CONNECTING';//CONNECTING=连接中
			objSwf.connectplus("USER", srv_type, voipId, passwd, _isForceLogin);
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function setMediaCodes(codes) { //设置音频格式
		if(swfIsOK){
			objSwf.setMediaCodes(codes);
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function disconnect() { //断开服务器连接
		if(swfIsOK){
			objSwf.disconnect();
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function inviteplus(target) { //呼叫target
		if(swfIsOK){
			var caller = arguments[1]?arguments[1]:'';
			objSwf.inviteplus('TOKEN', target, caller);
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function invitetel(tel) { //呼叫target
		if(swfIsOK){
			 var caller = arguments[1]?arguments[1]:'';
			objSwf.inviteplus('TEL', tel,caller);
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function bye() { //断开通话
		if(swfIsOK){
			objSwf.bye();
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function accept() { //接受呼入
		if(swfIsOK){
			objSwf.accept();
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function reject() { //拒绝呼入
		if(swfIsOK){
			objSwf.reject('reject');//拒绝原因
		}else
			showLog('Cloopen:SWF is not ok');
	}

	function holdCall() { //挂起呼叫
		if(swfIsOK){
			objSwf.sendHold(true);//拒绝原因
		}else
			showLog('Cloopen:SWF is not ok');
	}
	
	function unholdCall() { //接回呼叫
		if(swfIsOK){
			objSwf.sendHold(false);//拒绝原因
		}else
			showLog('Cloopen:SWF is not ok');
	}
	function sendDigit(digit) {
                if(swfIsOK) {
                        objSwf.sendDigit(digit);
                }
        }

	function flexCallJsBack(doFun, msg) { //flex调用js的函数，名称固定
		var result = CryptoJS.enc.Base64.parse(msg);
		msg = result.toString(CryptoJS.enc.Utf8);
		switch (doFun)
		{
		case 'Microphone.Muted'://麦克风被禁止访问，扩大swf面积，现实隐私设置弹窗
			swfIsOK=false;
		  	objSwf.width=215;
		  	objSwf.height=138;
		  	//objSwf.securityshowsettings();
		  	break;
		case 'Microphone.Unmuted'://麦克风被允许访问，缩小swf面积
			swfIsOK=true;
		  	objSwf.width=1;
		  	objSwf.height=1;
		  	if (_currentState=='IDLE'){
				_whenCallBack(funArry.idle);
				objSwf.setDebug(DEBUG);
				objSwf.setRestUrl(_restUrl);
				if (_LoginType == 'USER') {
					connectplusByUser(_voipId,_passwd);
				}
				else {
					connectplus(_userToken);
				}	
			}
		  	break;
		case 'Microphone.NotFound':
				objSwf.width=1;
				objSwf.height=1;
				break;
		case 'Microphone.Error':
				objSwf.width=1;
				objSwf.height=1;
				break;
		case 'trace'://日志消息
			showLog(msg);
			return;
		case 'idle'://恢复未连接初始状态，显示连接注册按钮
			_whenCallBack(funArry.idle);
		  	break;
		case 'connecting'://正在连接服务器注册，显示取消（断开）连接按钮
			_whenCallBack(funArry.connecting);
		  	break;
		case 'connected'://已经注册登录，显示呼叫按钮
			_whenCallBack(funArry.connected);
		  	break;
		case 'outbound'://正在呼出，显示取消按钮
			_whenCallBack(funArry.outbound);
		  	break;
		case 'inbound'://有呼入，显示接听+拒绝按钮
			_whenCallBack(funArry.inbound);
		  	break;
		case 'active'://通话中，显示挂机按钮
			_whenCallBack(funArry.active);
		  	break;
		default:
			;	
		}
		if(typeof _notifyCallBack === "function") {
			_notifyCallBack(doFun, msg);
		}
	}
	function _whenCallBack(callback){//回调函数
		if(typeof callback === "function") callback();
	}
 
	var funArry={idle:null,
			connecting:null,
			connected:null,
			outbound:null,
			inbound:null,
			active:null
		};

	var exports = {
		init: init,
		initByUser: initByUser,
		setRestUrl: function(restUrl) {
			_restUrl = restUrl;
		},
		debug: function() {
			DEBUG = true;
		},
		url:function(address){
			URL=address;
		},
		srvtype:function(st){
			srv_type=st;
		},
		forceLogin:function(){
			_isForceLogin=true;
        },
        unforceLogin:function(){
			_isForceLogin=false;
        },
		showLog: showLog,
		//////////////////////
		'connectplus': connectplus,
		connectplusByUser: connectplusByUser,
		setMediaCodes: setMediaCodes,
		disconnect: disconnect,
		inviteplus: inviteplus,
		invitetel: invitetel,
		bye: bye,
		accept: accept,
		reject: reject,
		holdCall: holdCall,
		unholdCall: unholdCall,
		sendDigit: sendDigit,
		//////////通话状态+动作/////reply///////
		when_idle:function(callback){funArry.idle = callback},//恢复未连接初始状态，显示连接注册按钮
		when_connecting:function(callback){funArry.connecting = callback},//正在连接服务器注册，显示取消（断开）连接按钮
		when_connected:function(callback){funArry.connected = callback},//已经注册登录，显示呼叫按钮
		when_outbound:function(callback){funArry.outbound = callback},//正在呼出，显示取消按钮
		when_inbound:function(callback){funArry.inbound = callback},//有呼入，显示接听+拒绝按钮
		when_active:function(callback){funArry.active = callback},//通话中，显示挂机按钮
		////////////////////
		flexCallJsBack: flexCallJsBack

	};
	return exports;
})();


/*
 * CryptoJS v3.0.2
 * code.google.com/p/crypto-js
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * code.google.com/p/crypto-js/wiki/License
 * */
var CryptoJS=CryptoJS||function(h,o){var f={},j=f.lib={},k=j.Base=function(){function a(){}return{extend:function(b){a.prototype=this;var c=new a;b&&c.mixIn(b);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),i=j.WordArray=k.extend({init:function(a,b){a=
this.words=a||[];this.sigBytes=b!=o?b:4*a.length},toString:function(a){return(a||p).stringify(this)},concat:function(a){var b=this.words,c=a.words,d=this.sigBytes,a=a.sigBytes;this.clamp();if(d%4)for(var e=0;e<a;e++)b[d+e>>>2]|=(c[e>>>2]>>>24-8*(e%4)&255)<<24-8*((d+e)%4);else if(65535<c.length)for(e=0;e<a;e+=4)b[d+e>>>2]=c[e>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=h.ceil(b/4)},clone:function(){var a=
k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*h.random()|0);return i.create(b,a)}}),l=f.enc={},p=l.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,c=[],d=0;d<a;d++){var e=b[d>>>2]>>>24-8*(d%4)&255;c.push((e>>>4).toString(16));c.push((e&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return i.create(c,b/2)}},n=l.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return i.create(c,b)}},q=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},m=j.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=i.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,e=this.blockSize,f=d/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0),a=f*e,d=h.min(4*a,d);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(c,g);g=c.splice(0,a);b.sigBytes-=d}return i.create(g,d)},clone:function(){var a=k.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=m.extend({init:function(){this.reset()},
reset:function(){m.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=m.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return r.HMAC.create(a,c).finalize(b)}}});var r=f.algo={};return f}(Math);


/*
 * CryptoJS v3.0.2
 * code.google.com/p/crypto-js
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * code.google.com/p/crypto-js/wiki/License
 * */
(function(){var h=CryptoJS,i=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();for(var b=[],a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var b=b.replace(/\s/g,""),e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));
for(var c=[],a=0,d=0;d<e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return i.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
