define(["views/modules/base",
    "views/windows/pay_rate_win","views/windows/pay_rate_interrupt_win"],function(base,pay_rate_win,pay_rate_interrupt_win){

    pay_rate_win.$add_call_back(function(){
        refresh_table();
    });

    var on_event = {
        "fa-pencil":function(e, id){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(pay_rate_win.$ui).show();
            pay_rate_win.$init_data(item.id);
        },
        "fa-trash-o":function(e, id){
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        var item = $$("table_list").getItem(id);
                        base.postReq("pay_rate/"+item.id+"/delete.json","",function(){
                            base.$msg.info("删除成功");
                            refresh_table();
                        });
                    }
                }
            });
        }
    };

    var elements = [
        {id:"id",header:"ID",width:50},
        {id:"create_time", header:"创建时间",width:200,format:base.$show_time_sec_double},
        {id:"pay_channel_value",header:"费种",width:240},
        {id:"rate", header:"费率",width:70},
        {id:"start_time", header:"起始时间",width:200,format:base.$show_time_sec_double},
        {id:"end_time", header:"截止时间",width:200,template:function(obj){
            var value = obj.end_time;
            if(value){
                return base.$show_time_sec_double(value);
            }else{
                return "至今";
            }
        }},
        {id:"edit", header:"编辑", width:60, template:"<span class='status status1 webix_icon fa-pencil a-link ' title='编辑'></span>"},
        {id:"delete", header:"删除", width:60,fillspace:true, template:"<span class='status status3 webix_icon fa-trash-o a-link ' title='删除'></span>"}
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
            { view: "button", type: "iconButton", icon: "plus", label: "新增配置", width: 135, click: function(){
                this.$scope.ui(pay_rate_win.$ui).show();
                pay_rate_win.$init_data();
            }},
            { id:"search_interrupt", view: "button", type: "iconButton", icon: "search", label: "获取空档期", width: 135, click: function(){
                this.$scope.ui(pay_rate_interrupt_win.$ui).show();
                pay_rate_interrupt_win.$init_data();
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
        base.getReq("/v1/api/pay_rate_list.json",function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "财务配置", details: "费率管理"});
            refresh_table();

            app.$scope.ui(pay_rate_interrupt_win.$ui).show();
            pay_rate_interrupt_win.$init_data();
        }
    }
});