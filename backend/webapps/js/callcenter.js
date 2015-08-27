define(["views/modules/base","../views/menus/agent_menu","../views/menus/call_out","../views/windows/call_in_win"],function(base,agent_menu,call_out,call_in_win){
  /*  var agentToken = base.getAgentToken();
    var ivrAppId = "aaf98f894ae167eb014ae748e7b404a3";

    *//*call start*//*
    *//*设置为debug模式*//*
    Cloopen.debug();

    *//*设置为强制登录模式*//*
    Cloopen.forceLogin();
    *//*初始化，使用token模式登录*//*
    var appIdToken = ivrAppId+'#'+agentToken;
    Cloopen.init('ivrflash'
        ,initCallBack
        ,notifyCallBack
        ,appIdToken //应用appid与用户token可根据开发者业务自行获取
    );*/

    var ivrLogin = function(){
        var agentToken = base.getAgentToken();
        var ivrAppId = "aaf98f894ae167eb014ae748e7b404a3";

        /*call start*/
        /*设置为debug模式*/
        Cloopen.debug();

        /*设置为强制登录模式*/
        Cloopen.forceLogin();
        /*初始化，使用token模式登录*/
        var appIdToken = ivrAppId+'#'+agentToken;
        Cloopen.init('ivrflash'
            ,initCallBack
            ,notifyCallBack
            ,appIdToken //应用appid与用户token可根据开发者业务自行获取
        );
    };

    ivrLogin();

    /*正在连接服务器中状态*/
    Cloopen.when_connecting(function(){
        console.log("连接中...");
    });
    /*Cloopen初始化成功后的自定义函数*/
    function initCallBack(){
        console.log(arguments);
    }
    /*Cloopen显示事件回调通知的自定义函数*/
    function notifyCallBack(doFun,msg){
        console.log("------",doFun,msg);
        //挂断
        if(doFun=='onHangup'){
            //通话结束后恢复座席为准备就绪状态
            try{
            //    agent_menu.agentStateChange(1);
            }catch (e){
                console.log(e);
            }
            //呼叫菜单恢复为初始状态
            call_out.resetView();
            if("呼叫终止"==msg || "normal"==msg || "callcancel"==msg || "byed"==msg ){
                call_in_win.resetWin();
            }
        }
        //取消
        if(doFun=='onHangup'){
            call_in_win.resetWin();
        }
        if(doFun=='ringing'){
            if(msg=='0000000000'){//呼出时也走这个方法
                Cloopen.accept();
                return ;
            }
            if(msg){//真正的客户呼入
                console.log("有呼入..."+msg);
                callInTip();
                $$("user_info").clearAll();
                console.log("根据手机号获取用户信息..");
                var userInfo = base.getUserInfoByPhone(msg);
                if(userInfo===null){
                    userInfo = {phone:msg,user_name:"未注册用户"};
                }
                $$("user_info").parse(userInfo);
            }
        }
    }
    /*未连接状态*/
    Cloopen.when_idle(function(){
        $$("agent_menu").setValue("离线");
        $$("agent_menu").refresh();

        console.log("...未连接...");
    });
    /*座席准备就绪*/
    Cloopen.when_connected(function(){
        var agentState = base.getAgentState();
        var msg = "";
        if(agentState!=1){
            msg = "未就绪";
            for(var i=0;i<3;i++){
                agentState = base.getAgentState();
                console.log("**"+agentState);
                if(agentState===1){
                    msg = "";
                    break;
                }
            }

        }
        $$("agent_menu").setValue(msg);
        $$("agent_menu").refresh();
        console.log("准备就绪");
    });
    /*通话中*/
    Cloopen.when_active(function(){
        console.log(arguments);
        console.log("通话中");
    });
    /*有呼入*/
    Cloopen.when_inbound(function(){
    });

    var _func = null;
    var callInTip = function (){
        _func();
    };
    var addCallback = function(func){
        _func = func;
    };

    /*call end*/
    return {
        callInTip:callInTip,
        addCallback:addCallback,
        ivrLogin:ivrLogin
    }
});
