define(["views/modules/base",
        "views/forms/refund_form"],function(base,refund_form){

    var on_event = {

        "fa-money":function(e, id, node){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(refund_form.$ui).show();
        }

    };

    var elements = [
        {id:"order_number", header:"订单号",minWidth:150,fillspace:true},
        {id:"customer_name", header:"订单用户",width:120,fillspace:false},
        {id:"customer_phone_number", header:"用户电话",width:120,fillspace:false},
        {id:"customer_name", header:"客服",width:120,fillspace:false},
        {id:"customer_name", header:"管家",width:120,fillspace:false},
        {id:"customer_name", header:"下单时间",width:120,fillspace:false},
        {id:"order_cost", header:"退款金额",width:120,format:base.priceFormat,fillspace:false,sort:"string"},
        {id:"customer_name", header:"资金渠道",minWidth:150,fillspace:true},
        {id:"refund", header:"退款", width:80, template:function(obj,common){
            if(obj.refund){
                return "<span class='status status1'>退款成功</span>";
            }
            return "<span class='status status0 fa fa-money' style=' cursor:pointer;text-decoration: underline;' title='退款'>  退 款 </span>";
        }}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        autoConfig:true,
        rowHeight:35,
        autoheight:false,
        hover:"myhover",
        rightSplit:1,
        columns:elements,
        data:[{order_number:12,refund:true},{order_number:2,refund:false}],
        onClick:on_event,
        on:{"onCheck":function(){
            countPrice();
        }}
    }

    var filter_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"退款列表",height:30},
                {view: "richselect", id:"s_refund_type",options:[{id:0,value:"全部"},{id:1,value:"已退款"},{id:2,value:"未退款"}],label:"退款状态:",placeholder:"选择退款状态",labelWidth:80,value:2,width:200,
                    on:{
                        onChange:function(newv,oldv){
                            refresh_table();
                        }
                    }
                },
                {view:"datepicker", timepicker:true, label:"时间：", id:"start_time",labelWidth:60, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250,
                    on:{
                        "onChange":function(){
                            refresh_table();
                        }
                    }
                },
                {view:"datepicker", timepicker:true, label:"--", id:"end_time",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:210,
                    on:{
                        "onChange":function(){
                            refresh_table();
                        }
                    }
                }
            ]}
        ]
    };

    var layout = {
        paddingY:5,
        paddingX:5,
        cols:[
            {margin:0, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var refresh_table = function(){

    };



    var init_data = function(){

    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "财务管理", details: "退款列表"});
            init_data();
        }
    }
});