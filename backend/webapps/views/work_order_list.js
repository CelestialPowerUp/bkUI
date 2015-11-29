/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base",
    "views/windows/work_order_edit_win"],function(base,work_order_edit){

    var search_ui =
    {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
        { view:"segmented", id:"switch_table", value:"", inputWidth:250, options:[
            { id:"1", value:"未认领" },
            { id:"2", value:"处理中"},
            { id:"3", value:"已完成"},
            { id:"4", value:"已失效"}
        ], on:{
            "onAfterTabClick":function(id){
                //todo
                refresh_table();
            }
        }},
        {view: "richselect", id:"create_type",label:"创建类型:",labelWidth:80,value:"0",width:180,options:[
            {id:"0",value:"所有"},
            {id:"1",value:"保养"},
            {id:"2",value:"续保"},
            {id:"3",value:"验车"},
            {id:"4",value:"维修"}
        ],placeholder:"选择创建类型", on:{"onChange":function(n,o){
            //todo
            refresh_table();
        }}
        },
        {view: "richselect", id:"key_type",label:"查询关键字:",labelWidth:80,value:"1",width:180,options:[
            {id:"0",value:"所有"},
            {id:"1",value:"姓名"},
            {id:"2",value:"电话"},
            {id:"3",value:"车牌号"}
        ],on:{"onChange":function(n,o){
            //todo
            if(n==='0'){
                $$("search_text").setValue("");
                $$("search_text").disable();
            }else{
                $$("search_text").enable();
            }

            refresh_table();
        }}
        },
        {view:"search",id:"search_text",width:250,placeholder:"姓名/电话/车牌号",keyPressTimeout:500,on:{
            onTimedKeyPress:function(){
                //todo
                refresh_table();
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

    var refresh_table = function(){
        var type = $$("switch_table").getValue();
        var work_status = $$("create_type").getValue();
        var cond = $$("key_type").getValue()+ "|" +$$("search_text").getValue();
        if($$("key_type").getValue() === "0"){
            cond = $$("key_type").getValue();
        }
        if(type && work_status && cond){
            base.getReq("workorder/getWorkOrderPageListByType.json?type="+type+"&work_status="+work_status+"&cond="+cond+"&page=1"+"&page_size="+10,function(data){
                console.log(data);
            });
        }
    };

    return {
        $ui:layout,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "工单管理", details: "工单列表"});
        }
    }
});