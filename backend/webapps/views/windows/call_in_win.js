/**
 * 电话呼入
 * Created by wang shuai on 2015/7/21.
 */
define(function(){

    //拒接
    function reject(){
        Cloopen.reject();
    }
    //接听
    function accept(){
        Cloopen.accept();

        $$("reject_btn").hide();
        $$("accept_btn").hide();
        $$("call_in_off_btn").show();
    }
    function resetWin(){
        $$("user_info").clearAll();
        $$("reject_btn").show();
        $$("accept_btn").show();
        $$("call_in_off_btn").hide();
        $$("call_in_win").hide();
    }

    return {
        $ui:{
            view:"window",
            modal:false,
            move:true,
            id:"call_in_win",
            position:"top",
            width:300,
            height:200,
            head:"电话呼入",
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
                    {view:"button",id:"reject_btn",value:"拒接",click:function(){
                        reject();
                        resetWin();
                    }},
                    {view:"button",id:"accept_btn",value:"接听",type:"form",click:function(){
                        accept();
                    }},
                    {
                        view:"button",id:"call_in_off_btn",value:"挂断",type:"danger",hidden:true,click:function(){
                            Cloopen.bye();
                            resetWin();
                        }
                    }
                ]
            }
        },
        resetWin:resetWin
    }

});