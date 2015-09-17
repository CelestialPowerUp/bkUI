define(["views/modules/base"],function(base){

    var elements = [
        {id:"urls", header:["接口地址"], width:350},
        {id:"method",header:"请求方式", width:150},
        {id:"api_name", header:["接口名称"], width:250},
        {id:"counts", header:"访问量",width:150}
    ];

    var on_event = {
        "onCheck":function(rwo, column, state){
            var item = $$("table_list").getItem(rwo);
            base.postReq("api_statistics.json",item,function(data){
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

    var search_ui = {
        cols:[

            {view:"text",label:"结果数：", labelWidth:75,width:130},
            {view:"datepicker", timepicker:true, label:"起止时间：", labelWidth:90,name:"start_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" , width:350,
                on:{
                    "onChange":function(){
                        search();
                    }
                }
            },
            {view:"datepicker", timepicker:true, label:"--", name:"end_time",labelWidth:30, stringResult:true, format:"%Y-%m-%d %H:%i:%s" , width:290,
                on:{
                    "onChange":function(){
                        search();
                    }
                }
            },
            {view:"checkbox",label:"从高到低",checkValue:"asc",uncheckValue:"desc"},
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[search_ui,table_ui]},{}]
    };

    var init_data = function(){
        $$("table_list").clearAll();
        base.getReq("api_statistics.json",function(datas){
            $$("table_list").parse(datas);
        });
    };

    var search = function(){
        var init_data = function(){
            $$("table_list").clearAll();
            base.getReq("api_statistics.json",function(datas){
                $$("table_list").parse(datas);
            });
        };
    }

    var syc_api = function(){
        base.getReq("check_new_api.json",function(data){
            webix.message("同步完成,发现新接口："+data+"个");
            init_data();
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "系统管理", details: "接口统计"});
            init_data();
        }
    }
});