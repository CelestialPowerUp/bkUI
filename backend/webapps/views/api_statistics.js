define(["views/modules/base"],function(base){

    var elements = [
        {id:"urls", header:["接口地址"], width:350},
        {id:"method",header:"请求方式", width:150},
        {id:"api_name", header:["接口名称"], width:250},
        {id:"counts", header:"访问量",width:150}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        autoheight:true,
        autowidth:true,
        leftSplit:1,
        rowHeight:35,
        hover:"myhover",
        columns:elements
    }

    var search_ui = {
        cols:[

            {id:"search_result_size",view:"text",label:"结果数：", labelWidth:75,width:130,value:50,keyPressTimeout:500,
                on:{
                    "onTimedKeyPress":function(){
                        search_data();
                    }
                }
            },
            {id:"search_start_time",view:"datepicker", timepicker:true, label:"起止时间：", labelWidth:90,name:"start_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" , width:350,
                on:{
                    "onChange":function(){
                        search_data();
                    }
                }
            },
            {id:"search_end_time",view:"datepicker", timepicker:true, label:"--", name:"end_time",labelWidth:30, stringResult:true, format:"%Y-%m-%d %H:%i:%s" , width:290,
                on:{
                    "onChange":function(){
                        search_data();
                    }
                }
            },
            {id:"search_sort_type",view:"checkbox",label:"访问量低到高",checkValue:"asc",uncheckValue:"desc",labelWidth:110,width:150,
                on:{
                    "onChange":function(){
                        search_data();
                    }
                }
            },
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[search_ui,table_ui]},{}]
    };

    var search_data = function(){
        $$("table_list").clearAll();
        var url = "api_statistics.json?";
        var search_result_size = $$("search_result_size").getValue();
        var search_start_time = $$("search_start_time").getValue();
        var search_end_time = $$("search_end_time").getValue();
        var search_sort_type = $$("search_sort_type").getValue();

        if(search_result_size){
            url = url+"&result_size="+search_result_size;
        }
        if(search_start_time){
            url = url+"&start_time="+base.format_time(search_start_time);
        }
        if(search_end_time){
            url = url+"&end_time="+base.format_time(search_end_time);
        }
        if(search_sort_type){
            url = url+"&sort_type="+search_sort_type;
        }

        base.getReq(url,function(datas){
            $$("table_list").parse(datas);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "系统管理", details: "接口统计"});
            search_data();
        }
    }
});