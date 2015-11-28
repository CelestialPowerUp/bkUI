/**
 * Created by Administrator on 2015/11/26.
 */
define(["views/modules/base"],function (base) {

    var on_event = {
        "fa-times":function(e, id){
            var item = $$("system_work_order_table").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源

                    }
                }
            });
        },
        "fa-pencil":function(e, id){
            var item = $$("system_work_order_table").getItem(id);

        }
    };

    var elements = [
        {id:"supplier_id",header:"车牌",width:80},
        {id:"product_id", header:"用户",width:80,fillspace:false},
        {id:"supplier_product_name", header:"创建原因",width:200,fillspace:false},
        {id:"supplier_price", header:"购车时间",width:100,format:base.priceFormat,fillspace:false},
        {id:"supplier_cost", header:"保养周期",width:100,format:base.priceFormat,fillspace:false},
        {id:"supplier_cost", header:"状态",width:100,format:base.priceFormat,fillspace:false},
        {id:"supplier_cost", header:"确认转工单",width:100,format:base.priceFormat,fillspace:false}
    ];

    var system_work_order_table_ui = {
        id:"system_work_order_table",
        view:"datatable",
        headerRowHeight:35,
        autoConfig:true,
        autowidth:true,
        checkboxRefresh:true,
        hover:"myhover",
        scrollY:true,
        columns:elements,
        data:  [],
        onClick:on_event
    };

  
    var button_ui = {
        cols:[
            {},
            { view: "button", type: "iconButton", icon: "check-square-o", label: "确认录入", width: 110, click: function(){
                //todo

            }}
        ]

    }

    var win_ui = {
        view:"window",
        modal:true,
        id:"system_work_order_win",
        height:450,
        position:"center",
        head:{
            view:"toolbar",height:40, cols:[
                {view:"label", label: "工单筛选" },
                { view:"button", label: 'X', width: 35, align: 'right', click:"$$('system_work_order_win').close();"}
            ]},
        body:{
            rows:[system_work_order_table_ui,button_ui]
        }
    };

    return {
        $ui:win_ui
    };
});