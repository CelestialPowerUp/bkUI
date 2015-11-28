/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base",
        "views/windows/work_order_edit_win"],function(base,work_order_edit){

    var search_ui =
    {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
        { view:"segmented", id:"switch_table", value:"", inputWidth:250, options:[
            { id:"uncompleted", value:"未认领" },
            { id:"completed1", value:"处理中"},
            { id:"completed2", value:"已完成"},
            { id:"completed3", value:"已失效"}
        ], on:{
            "onAfterTabClick":function(id){
                //todo
            }
        }},
        {view: "richselect", id:"filter_search",label:"创建类型:",labelWidth:80,value:"0",width:180,options:[
            {id:"0",value:"所有"},
            {id:"1",value:"保养"},
            {id:"2",value:"续保"},
            {id:"3",value:"验车"},
            {id:"4",value:"维修"}
        ],placeholder:"选择创建类型", on:{"onChange":function(n,o){
            //todo
        }}
        },
        {view:"search",id:"search_text",width:250,placeholder:"工单号/用户名/电话号",keyPressTimeout:500,on:{
            onTimedKeyPress:function(){
                //todo
            }
        }},
        { view: "button", type: "iconButton", icon: "plus", label: "新建工单", width: 135, click: function(){
            //todo
            webix.ui(work_order_edit.$ui).show();
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
            webix.$$("title").parse({title: "工单管理", details: "工单列表"});
        }
    }
});