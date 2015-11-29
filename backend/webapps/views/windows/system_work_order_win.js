/**
 * Created by Administrator on 2015/11/26.
 */
define(["views/modules/base"],function (base) {

    var elements = [
        {id:"supplier_id",header:"车牌",width:100,template:function(obj){
            return obj.province+obj.number;
        }},
        {id:"product_id", header:"用户",width:150,template:function(obj){
            return obj.customerName+" "+obj.customer_phone_number;

        },fillspace:false},
        {id:"serviceType", header:"创建原因",width:150,fillspace:false},
        {id:"boughtDate", header:"购车时间",width:150,format:base.$show_time,fillspace:false},
        {id:"serviceTime", header:"保养时间",width:150,format:base.$show_time,fillspace:false},
        {id:"procStatus", header:"状态",width:100,fillspace:false},
        {id:"$check", header:"确认",width:50,template:function(obj,common){
            return common.checkbox(obj, common, obj.$check,{checkValue:true});
        },fillspace:false}
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
        data:  []
    };

  
    var button_ui = {
        cols:[
            {},
            { view: "button", type: "iconButton", icon: "check-square-o", label: "确认录入", width: 110, click: function(){
                //todo workorder/update

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

    var init_data = function(car_id){
        $$("system_work_order_table").clearAll();
        base.getReq("workorder/getWorkOrderByCarUserId/"+car_id,function(data){
            $$("system_work_order_table").parse(data);
            console.log(data);
        });
    }

    return {
        $ui:win_ui,
        $init_data : init_data
    };
});