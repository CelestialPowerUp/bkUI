define(["views/modules/base",
    "views/windows/app_win"],function(base,app_win){

    app_win.$add_call_back(function(){
        refresh_table();
    });

    var on_event = {
        "fa-pencil":function(e, id){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(app_win.$ui).show();
            app_win.$init_data(item.id);
        },
        "fa-arrow-circle-up":function(e, id){
            webix.confirm({
                text:"上线该文案<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        var item = $$("table_list").getItem(id);
                        base.postReq("coupon_share/"+item.coupon_share_id+"/online.json","",function(){
                            base.$msg.info("修改成功");
                            refresh_table();
                        });
                    }
                }
            });
        },
        "download":function(){}
    };

    var elements = [
        {id:"id",header:"ID",width:50},
        {id:"plan_push_time", header:"推送时间",width:140,format:base.$show_time},
        {id:"push_content",header:"推送内容",width:350,fillspace:true},
        {id:"push_open_target_description", header:"划开指向",width:200},
        {id:"push_version", header:"发送版本",width:260},
        {id:"push_status_value", header:"状态",width:90},
        {id:"view_users", header:"用户", width:60, template:"<span class='status status2 webix_icon fa-user a-link' title='查看用户信息'></span>"},
        {id:"edit", header:"编辑", width:60, template:"<span class='status status0 webix_icon fa-pencil a-link' title='编辑'></span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoheight:false,
      //  autoConfig:true,
        hover:"myhover",
      //  rightSplit:1,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "新建推送信息", width: 135, click: function(){
                this.$scope.show("/push_info");
            }},
            {}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("/v1/api/push_infos.json",function(data){
            console.log(data);
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "推送管理", details: "推送列表"});
            refresh_table();
        }
    }
});