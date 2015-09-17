define(["views/modules/base"],function(base){

    var elements = [
        {id:"type",width:50,hidden:true},
        {id:"name", header:["接口名称", {content:"textFilter"} ], width:250},
        {id:"method",header:"请求方式", width:150},
        {id:"urls", header:["接口地址", {content:"textFilter"} ], width:350},
        {id:"needAuth", header:"是否token验证", width:150,template:"{common.checkbox()}", checkValue:true, uncheckValue:false},
        {id:"disabled", header:"接口是否有效",width:150,template:"{common.checkbox()}", checkValue:false, uncheckValue:true},
        {id:"counts", header:"访问量",width:150,sort:"int"}
    ];

    var on_event = {
        "onCheck":function(rwo, column, state){
            var item = $$("table_list").getItem(rwo);
            base.postReq("interface/update.json",item,function(data){
                webix.message("接口信息更新成功");
            })
        }
    };

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        autoheight:true,
        autowidth:true,
        leftSplit:1,
        rowHeight:35,
        on:on_event,
        hover:"myhover",
        columns:elements
    }

    var button_ui = {
        cols:[
            {},
            {view:"button",label:"后台有新接口，点我同步吧",click:function(){
                syc_api();
            }},
            {}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[button_ui,table_ui]},{}]
    };

    var init_data = function(){
        $$("table_list").clearAll();
        base.getReq("apis.json",function(datas){
            $$("table_list").parse(datas);
        });
    };

    var syc_api = function(){
        base.getReq("check_new_api.json",function(data){
            webix.message("同步完成,发现新接口："+data+"个");
            init_data();
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "系统管理", details: "接口列表"});
            init_data();
        }
    }
});