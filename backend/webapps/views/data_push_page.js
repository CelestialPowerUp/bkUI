define(["views/modules/base",
    "views/modules/table_page_m"],function(base,table_page){

    var cur_page = 1;

    var page_size = 10;

    var table_elements = [
        {id:"create_time", header:"推送时间",width:100},
        {id:"target_type", header:"推送类型",width:100},
        {id:"info_users_id", header:"推送人群",width:100},
        {id:"msg", header:"推送内容",fillspace:true}
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

    var page_table_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
                {view:"label",label:"推送历史"}
            ]},
            table_page.$create_page_table("table_page_list",table_ui)
        ]
    }



    var push_layout = {
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

            {view:"textarea",id:"send_msg",label:"发送信息",labelPosition:"top",height:450,required:true,placeholder: "输入发送的电话号码,用换行分割"},

            {margin:15,type:"space",cols:[
                {},
                {view:"button",label:"短信发送",disabled:true,click:function(){
                    // workorder/actionPushMsgToUsers
                    $$("send_msg").validate();
                    base.postForm("workorder/actionPushMsgToUsers",{type:$$("user_type").getValue(),msg:$$("send_msg").getValue()},function(data){
                        base.$msg.info("发送成功");
                        refresh_table();
                    });
                }},
                {view:"button",label:"APP发送",click:function(){
                    base.postForm("workorder/actionPushMsgToUsers",{type:$$("user_type").getValue(),msg:$$("send_msg").getValue()},function(data){
                        base.$msg.info("发送成功");
                        refresh_table();
                    });
                }}
            ]},
            {}
        ]
    }

    var layout ={
        paddingX:15,
        paddingY:15,
        type:"space",
        margin:15,
        cols:[
            page_table_ui,
            push_layout
        ]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("workorder/getAllPushMsg?page="+cur_page+"&page_size="+page_size,function(data){
            $$("table_list").parse(data.items);
            table_page.$update_page_items("table_page_list",data);
            table_page.$add_page_callback(function(page){
                cur_page = page;
                refresh_table();
            });
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