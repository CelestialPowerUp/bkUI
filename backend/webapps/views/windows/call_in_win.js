/**
 * 电话呼入
 * Created by wang shuai on 2015/7/21.
 */
define(function(){

    var timer = null;
    //拒接
    function reject(){
        Cloopen.reject();
        clearLoop();
    }
    //接听
    function accept(){

        $$("reject_btn").hide();
        $$("accept_btn").hide();
        $$("call_in_off_btn").show();

        Cloopen.accept();
        clearLoop();
    }
    //重置来电窗口
    function resetWin(){
        $$("user_info").clearAll();
        $$("reject_btn").show();
        $$("accept_btn").show();
        $$("call_in_off_btn").hide();
        $$("call_in_win").close();

        clearLoop();
    }

    /*停止循环播放来电话提示音定时器*/
    var _clearLoop = null;
    var clearLoop = function (){
        _clearLoop();
    };
    var addCallback = function(clearLoop){
        _clearLoop = clearLoop;
    };

    return {
        $ui:{
            view:"window",
            id:"call_in_win",
            modal:false,
<<<<<<< HEAD
            move:true,
            height:200,
            position:"top",
=======
            position:"top",
			move:true,
>>>>>>> ec802fe083d99854b66fbfe3dfd2915c0e168520
            head:{
                view:"toolbar", cols:[
                    {view:"label", label: "电话呼入" },
                    /*{ view:"button", label: '关闭', width: 100, align: 'right', click:"$$('win3').close();"}*/
                ]
            },
            body:{
                rows:[
                    {
                        view:"dataview",
                        id:"user_info",
                         type: {
                            height: 60
                        },
                        template:"<div class='webix_strong'>#phone#</div>  #user_name#",data:{phone:"手机号",user_name:"姓名"}
                    },
                    {view:"button",id:"accept_btn",value:"接听",type:"form",click:function(){
                        accept();
                    }},
                    {view:"button",id:"reject_btn",value:"拒接",click:function(){
                        reject();
                        resetWin();
                    }},
                    {
                        view:"button",id:"call_in_off_btn",value:"挂断",type:"danger",hidden:true,click:function(){
                            Cloopen.bye();
                            resetWin();
                        }
                    }
                ]
            },
            on:{"onDestruct":function(){
                console.log("销毁了窗体");
                if(timer!==null){
                    window.clearTimeout(timer);
                    console.log("自定清除延时挂断");
                }
              
            },
<<<<<<< HEAD
            "onHide":function(){
                console.log("系统非法关闭，重新打开");
                $$("call_in_win").show();
            },
            "onShow":function(){
                if(timer===null){
                    //第一次初始化
                    console.log("窗口打开了");
                    timer = setTimeout(function(){
                        console.log("15秒到了，自动拒绝,转接其他客服");
                        reject();
                    },15000);
                }
=======
			"onHide":function(){
				console.log("非人为关闭，重新显示");
				$$("call_in_win").show();
			},
            "onShow":function(){
				if(timer===null){
					console.log("窗口打开了");
					timer = setTimeout(function(){
						console.log("15秒到了，自动拒绝,转接其他客服");
						reject();
					},15000);
				}
>>>>>>> ec802fe083d99854b66fbfe3dfd2915c0e168520
            }}
        },
        resetWin:resetWin,
        reject:reject,
        addCallback:addCallback
    }

});
