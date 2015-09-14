define(["views/modules/base","../views/menus/agent_menu","../views/menus/call_out","../views/windows/call_in_win"],function(base,agent_menuWin,call_out,call_in_win){

    /*voip初始化登录*/
    var ivrLogin = function(){
        var agentToken = base.getAgentToken();
        var ivrAppId = "aaf98f894ae167eb014ae748e7b404a3";

        if(!agentToken){
            return;
        }

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

    /*定时更新座席状态*/
    function refreshAgentState(){
        console.log("定时更新座席状态...");
        var agentMenu = $$("agent_menu");
        if(!agentMenu){
            return ;
        }
        var currentValue = agentMenu.getValue();
        if(currentValue == '非座席'){//非座席用户直接返回
            return ;
        }
        if(currentValue == '离线'){//离线用户，登陆
            ivrLogin();
        }
        if(currentValue == '未就绪'){//未就绪状态，更新状态
            var agentState = base.getAgentState();
            var msg = "";
            if(agentState==='0'){
                agent_menuWin.agentStateChange(1);
            }
            agentState = base.getAgentState();
            if(agentState!='1'){
                msg = "未就绪";
            }
            $$("agent_menu").setValue(msg);
            $$("agent_menu").refresh();
        }
    };
    setInterval(refreshAgentState,1000*60*2);

    /*正在连接服务器中状态*/
    Cloopen.when_connecting(function(){
    });
    /*Cloopen初始化成功后的自定义函数*/
    function initCallBack(){
    }
    /*Cloopen显示事件回调通知的自定义函数*/
    function notifyCallBack(doFun,msg){
        console.log("------",doFun,msg);
        //挂断
        if(doFun=='onHangup'){
            //恢复呼入呼出窗口样式
            call_out.resetView();
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
    });
    /*座席准备就绪*/
    Cloopen.when_connected(function(){
        var agentState = base.getAgentState();
        var msg = "";
        if(agentState!=1){
            msg = "未就绪";
        }
        $$("agent_menu").setValue(msg);
        $$("agent_menu").refresh();
        console.log("准备就绪");
    });
    /*通话中*/
    Cloopen.when_active(function(){
        console.log(arguments);
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
