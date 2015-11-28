/**
 * Created by Administrator on 2015/11/26.
 */
/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base",
        "views/windows/system_work_order_win"],function(base,system_work_order_win){

    var search_ui =
    {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
        {view: "richselect", id:"filter_search",label:"工单类型:",labelWidth:80,value:"0",width:180,options:[
            {id:"0",value:"所有"},
            {id:"1",value:"保养"},
            {id:"2",value:"续保"},
            {id:"3",value:"验车"},
            {id:"4",value:"维修"}
        ],placeholder:"选择工单类型", on:{"onChange":function(n,o){
            //todo

        }}
        },
        {view:"datepicker", timepicker:false, label:"处理周期", name:"pick_start_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250,
            on:{
                "onChange":function(){

                }
            }
        },
        {view:"datepicker", timepicker:false, label:"--", name:"pick_end_time",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:200,
            on:{
                "onChange":function(){

                }
            }
        },
        { view: "button", type: "iconButton", icon: "fa-apple", label: "进入", width: 135, click: function(){
            //todo
            webix.ui(system_work_order_win.$ui).show();
        }}
    ]};

    var table_columns = [
        {id:"1",header:"工单号"},
        {id:"2", header:"车牌"},
        {id:"3", header:"车型号"},
        {id:"4", header:"用户名"},
        {id:"5", header:"手机号"},
        {id:"6", header:"创建时间"},
        {id:"7", header:"客服"},
        {id:"8", header:"创建原因"},
        {id:"9", header:"处理方案"}
    ];

    var table_ui = {
        id:"data_list",
        view:"datatable",
        select:false,
        rowHeight:45,
        autoConfig:true,
        hover:"myhover",
        rowLineHeight:25,
        //onClick:onClick,
        columns:table_columns
    };

    var layout = {
        paddingX:15,
        paddingY:15,
        rows:[
            search_ui,table_ui
        ]
    }

    return {
        $ui:layout,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "工单管理", details: "系统工单"});
        }
    }
});