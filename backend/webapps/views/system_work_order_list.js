/**
 * Created by Administrator on 2015/11/26.
 */
/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base",
    "views/modules/table_page_m"],function(base,table_page){

    /*分页相关*/
    var cur_page = 1;

    var __start_time = "";

    var __end_time = "";

    var search_ui =
    {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
        {view: "richselect", id:"filter_search",label:"工单类型:",labelWidth:80,value:"0",width:180,options:[
            {id:"0",value:"所有"},
            {id:"1",value:"保养"},
            {id:"2",value:"续保"},
            {id:"3",value:"验车"},
            {id:"4",value:"维修"}
        ],placeholder:"选择工单类型", on:{"onChange":function(n,o){
            refresh_table();
        }}
        },
        {view:"datepicker", timepicker:false, label:"处理周期", id:"start_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250,
            on:{
                "onChange":function(){
                    refresh_table();
                }
            }
        },
        {view:"datepicker", timepicker:false, label:"--", id:"end_time",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:200,
            on:{
                "onChange":function(){
                    refresh_table();
                }
            }
        }
    ]};

    var table_columns = [
        {id:"number", header:"车牌",template:function(obj){
            return obj.province+obj.number;
        }},
        {id:"customerName", header:"客户名称",width:150},
        {id:"customerPhoneNumber", header:"客户手机号",width:200},
        {id:"full", header:"车型",width:200,fillspace:true},
        {id:"serviceTime", header:"服务时间",width:180},
        {id:"9", header:"",template:function(obj){
            return "<span class='trash webix_icon fa-hand-o-right'>进入</a>";
        },width:80}
    ];


    var onClick = {
        "fa-hand-o-right":function(e, id){
            var item = $$("table_list").getItem(id);
            this.$scope.show("/system_work_order_details:id="+item.userId);
        }
    };

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoConfig:true,
        hover:"myhover",
        onClick:onClick,
        columns:table_columns
    };
    var table_page_ui = table_page.$create_page_table("table_page_list",table_ui);

    var layout = {
        paddingX:15,
        paddingY:15,
        rows:[
            search_ui,table_page_ui
        ]
    }
    var refresh_table = function(){

        $$("table_list").clearAll();

        var type = $$("filter_search").getValue();

        if($$("start_time").getValue() && $$("end_time").getValue()){
            __start_time = $$("start_time").getValue();

            __end_time = $$("end_time").getValue();

            base.getReq("/v1/api/workorder/getWorkOrderPageList.json?page="+cur_page+"&type="+type+"&start_time="+base.format_time(__start_time)+"&end_time="+base.format_time(__end_time)+"&page=1&page_size=10",function(data){
                console.log(data.items);
                $$("table_list").parse(data.items);
                table_page.$update_page_items("table_page_list",data);
                table_page.$add_page_callback(function(page){
                    cur_page = page;
                    refresh_table();
                });
            })
        }
    };

    var init_data = function(){
        console.log('""',""?true:false);
        console.log(0,0?true:false);
        console.log("null",null?true:false);
        console.log("undefined",undefined?true:false);
        console.log("{}",{}?true:false);
        console.log("[]",[]?true:false);
        console.log(1,1?true:false);
        $$("start_time").setValue(__start_time);
        $$("end_time").setValue(__end_time);
    };
    return {
        $ui:layout,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "工单管理", details: "系统工单"});
            init_data();
        }
    }
});