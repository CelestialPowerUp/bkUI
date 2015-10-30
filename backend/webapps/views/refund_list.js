define(["views/modules/base",
        "views/forms/refund_form"],function(base,refund_form){

    var on_event = {

        "fa-money":function(e, id, node){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(refund_form.$ui).show();
            refund_form.init_data(item.order_id);
            //refund_form.init_data(7111);
        }

    };

    var elements = [
        { id:"order_id",header:"订单ID", width:80},
        {id:"order_number",header:["订单号", {content:"textFilter"} ], minWidth:150,fillspace:true},
        {id:"user_name", header:["订单用户",{content:"textFilter"}],width:120,fillspace:true},
        {id:"user_phone",header:["用户电话",{content:"textFilter"}],width:120,fillspace:true},
        {id:"operator", header:["客服",{content:"textFilter"}],width:120,fillspace:true},
        {id:"car_keeper",header:["管家",{content:"textFilter"}], width:120,fillspace:true},
        {id:"refund_create_time", header:"退款申请时间",width:120,format:base.$show_time,fillspace:true},
        {id:"refund_money", header:"退款金额",width:120,format:base.priceFormat,fillspace:false,sort:"string"},
        {id:"refund_status", header:"退款", width:80, template:function(obj,common){
            if(obj.refund_status==="refunded"){
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
                {view: "richselect", id:"s_refund_type",options:[{id:"refund_all",value:"全部"},{id:"refunded",value:"已退款"},{id:"unrefunded",value:"未退款"}],label:"退款状态:",placeholder:"选择退款状态",labelWidth:80,value:"unrefunded",width:200,
                    on:{
                        onChange:function(newv,oldv){
                            refresh_table();
                        }
                    }
                },
                {view:"datepicker", timepicker:true, label:"时间：", id:"s_start_time",labelWidth:60, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250,
                    on:{
                        "onChange":function(){
                            refresh_table();
                        }
                    }
                },
                {view:"datepicker", timepicker:true, label:"--", id:"s_end_time",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:210,
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
        $$("table_list").clearAll();
        var param = {};
        param.refund_status = $$("s_refund_type").getValue();
        param.start_time = $$("s_start_time").getValue();
        param.end_time = $$("s_end_time").getValue();
        if(param.refund_status===''||param.start_time===''||param.end_time===''){
            return;
        }
        param.start_time = base.format_time( param.start_time);
        param.end_time = base.format_time( param.end_time);
        base.postReq("refund_list.json",param,function(list){
            console.log(list);
            $$("table_list").parse(list);
        });
    };

    var init_data = function(){
        refresh_table();
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "财务管理", details: "退款列表"});
            init_data();
        }
    }
});