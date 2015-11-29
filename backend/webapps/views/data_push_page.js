define(["views/modules/base"],function(base){

    var table_elements = [
        {id:"时间", header:"推送人群",width:100},
        {id:"hand_user_name", header:"推送人群",width:100},
        {id:"hand_coupon_name", header:"推送内容",fillspace:true}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        rowHeight:35,
        autoConfig:true,
        hover:"myhover",
        editable:true,
        columns:table_elements,
        data:[]
    }

    var layout ={
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
                {view:"label",label:"推送系统"},
                {view: "richselect", id:"user_type",label:"定位人群:",labelWidth:80,value:"0",width:180,options:[
                    {id:"0",value:"所有人"},
                    {id:"1",value:"需保养"},
                    {id:"2",value:"需续保"},
                    {id:"3",value:"需验车"}
                ],placeholder:"选择工单类型", on:{"onChange":function(n,o){
                    //todo
                }}
                }
            ]},
            {
                margin:15,cols:[
                    table_ui,
                    {
                        rows:[
                            {view:"textarea",id:"send_msg",label:"发送信息",labelPosition:"top",height:450,placeholder: "输入发送的电话号码,用换行分割"},
                            {margin:15,cols:[
                                {},
                                {view:"button",label:"短信发送",click:function(){
                                    // workorder/actionPushMsgToUsers
                                    base.postForm("workorder/actionPushMsgToUsers",{type:$$("user_type").getValue(),msg:$$("send_msg").getValue()},function(data){
                                        console.log(data);
                                    });
                                }},
                                {view:"button",label:"APP发送",click:function(){
                                    base.postForm("workorder/actionPushMsgToUsers",{type:$$("user_type").getValue(),msg:$$("send_msg").getValue()},function(data){

                                        console.log(data);
                                    });
                                }}
                            ]},
                            {}
                        ]
                    }
                ]
            }
        ]
    };

    var refresh_table = function(){
        base.getReq("workorder/getAllPushMsg?page=1&page_size=10",function(data){
            console.log(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "工单管理", details: "推送信息"});
            refresh_table();
        }
    }
});