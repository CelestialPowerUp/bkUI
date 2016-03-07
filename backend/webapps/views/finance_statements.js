define(["views/modules/base",
        "views/windows/finance_statements_excel_win"],function(base,excel_win){

    var on_event = {
    };

    var elements = [
        {id:"订单类型",header:["订单类型",{content:"selectFilter"}]},
        {id:"订单ID"},
        {id:"下单时间"},
        {id:"完成时间"},
        {id:"客户名称"},
        {id:"订单号"},
        {id:"订单项金额"},
        {id:"服务费"},
        {id:"应收服务款"},
        {id:"补贴客户"},
        {id:"实际收款"},
        {id:"支付宝手续费"},
        {id:"微信手续费"},
        {id:"支付宝流水号"},
        {id:"微信流水号"},
        {id:"到账总额",css:"background_blue"},
        {id:"税额",css:"background_red"},
        {id:"服务商"},
        {id:"服务商类型",header:["服务商类型",{content:"selectFilter"}]},
        {id:"产品成本"},
        {id:"补贴服务商"},
        {id:"实际支付成本",css:"background_red"},
        {id:"支付渠道"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        autoConfig:true,
        rowHeight:35,
        autoheight:false,
        hover:"myhover",
        columns:elements,
        data:[],
        onClick:on_event,
        tooltip:true
    }

    var filter_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"财务报表",height:30},
                {view:"datepicker", timepicker:false, label:"时间：", id:"start_time",labelWidth:60, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250,
                    on:{
                        "onChange":function(){
                            refresh_table();
                        }
                    }
                },
                {view:"datepicker", timepicker:false, label:"--", id:"end_time",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:210,
                    on:{
                        "onChange":function(){
                           refresh_table();
                        }
                    }
                },
                {view:"button",type: "iconButton", icon: "file-excel-o",label:"Excel导出",width:120,click:function(){
                    webix.ui(excel_win.$ui).show();
                }}
            ]}
        ]
    };

    var layout = {
        paddingY:5,
        paddingX:5,
        cols:[
            {margin:0, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        var start = $$("start_time").getValue();
        var end = $$("end_time").getValue();
        if(start === "" || end===""){
            return "";
        }
        var param = {start:base.format_time(start),end:base.format_time(end)};
        base.postReqTimeOut("finance_statements.json",param,function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        },60*15)
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "财务报表", details: "列表与导出"});
        }
    }
});