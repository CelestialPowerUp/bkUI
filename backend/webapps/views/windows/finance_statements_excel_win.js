/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base"],function(base){

    var button_ui = {
        margin:15,
        cols:[
            {},
            {view:"button",label:"导出",width:80,click:function(){
                var start = base.format_time($$("start_time_export").getValue());
                var end = base.format_time($$("end_time_export").getValue());
                base.postReqTimeOut("excel/finance_statements.json",{start:start,end:end},function(data){
                    window.open(data);
                    base.$msg.info("excel导出成功");
                },60*3);
            }},
            {view:"button",label:"取消",width:80,click:function(){
                webix.$$("finance_statements_excel_win").close();
            }}
        ]
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"finance_statements_excel_win",
        position:"center",
        head:{
            view:"toolbar",height:40, cols:[
                {view:"label", label: "财务报表导出" },
                { view:"button", label: 'X', width: 35, align: 'right', click:"$$('finance_statements_excel_win').close();"}
            ]},
        body:{
            paddingX:15,
            paddingY:15,
            rows:[
                {cols:[
                    {view:"datepicker", timepicker:false, label:"导出周期", id:"start_time_export", stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250},
                    {view:"datepicker", timepicker:false, label:"--", id:"end_time_export",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:200}
                ]},
                {},
                button_ui
            ]
        }
    };

    return {
        $ui:win_ui
    }
});