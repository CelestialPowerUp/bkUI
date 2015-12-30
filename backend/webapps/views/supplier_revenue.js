define(["views/modules/base",
        "views/windows/supplier_revenue_excel_win"],function(base,excel_win){

    var on_event = {

        "fa-pencil":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商
            base.postForm("community/order_reward_repair.json",item,function(data){
                base.$msg.info("数据修复成功");
                refresh_table();
            });
        }

    };

    var elements = [
        {id:"reward_id",header:"奖励ID",width:80},
        {id:"order_id",header:"订单ID",width:80},
        {id:"supplier_id", header:"社区店ID",width:80,fillspace:false},
        {id:"order_number", header:"订单号",minWidth:150,fillspace:true},
        {id:"order_type", header:"订单类型",template:function(obj){
            if("default_order" === obj.order_type){
                return "<span class='status status2'>普通订单</span>";
            }
            return "<span class='status status0'>次卡订单</span>";
        },width:80,fillspace:false},
        {id:"customer_name", header:"订单用户",width:120,fillspace:false},
        {id:"car_number", header:"车牌号",width:150,fillspace:false},
        //{id:"reward_note", header:"奖励原因",width:150,fillspace:false},
        {id:"order_cost", header:"订单流水",width:120,format:base.priceFormat,fillspace:false,sort:"string"},
        {id:"settled_check",header:"流水结算",template:function(obj,common){
            if(obj.cost_settled){
                return "<span class='status status1'>已结算</span>";
            }
            return common.checkbox(obj, common, obj.settled_check,{checkValue:true});
        },width:95,checkValue:true},
        {id:"order_reward", header:"订单奖励",width:120,format:base.priceFormat,fillspace:false},
        {id:"reward_settled", header:"奖励结算",template:function(obj){
            if(obj.reward_settled){
                return "<span class='status status1'>已结算</span>";
            }
            return "<span class='status status0'>未结算</span>";
        },width:120,fillspace:false},
        {id:"order_complete_time", header:"订单完成",width:185,fillspace:false},
        {id:"repair", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='修复数据' class='webix_icon fa-pencil'></span>"}
    ];

    var price_template = {total_revenue:0, settled_revenue:0, not_settled_revenue:0, wait_settled_revenue:0};

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
        data:[],
        onClick:on_event,
        on:{"onCheck":function(){
            countPrice();
        }}
    }

    var filter_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"社区店流水奖励",height:30},
                {view:"text",id:"key_text",placeholder:"输入关键字",keyPressTimeout:500,width:250,on:{
                    "onTimedKeyPress":function(){
                        $$("s_supplier").getPopup().show($$("key_text").getNode());
                        init_data();
                    },
                    "onFocus":function(){
                        $$("s_supplier").getPopup().show($$("key_text").getNode());
                    },
                    "onItemClick":function(){
                        $$("s_supplier").getPopup().show($$("key_text").getNode());
                    }
                }},
                {view: "richselect", id:"s_supplier",options:[],label:"社区店:",placeholder:"请选择社区店",labelWidth:65,value:"",width:350,
                    on:{
                        onChange:function(newv,oldv){
                            refresh_table();
                        }
                    }
                },
                {view:"datepicker", timepicker:false, label:"时间：", id:"start_time",labelWidth:60, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:250,
                    on:{
                        "onChange":function(){
                            refresh_table();
                        }
                    }
                },
                {view:"datepicker", timepicker:false, label:"--", id:"end_time",labelWidth:25, stringResult:true, format:"%Y-%m-%d %H:%i:%s" ,width:210,
                    on:{
                        "onChange":function(){
                           refresh_table();
                        }
                    }
                },
                {view:"button",type: "iconButton", icon: "file-excel-o",label:"Excel导出",width:120,click:function(){
                    webix.ui(excel_win.$ui).show();
                }}
            ]}
        ]
    };

    var footer_ui = {
        rows:[
            {
                id: "price_show",
                height: 60,
                template:"<div class='big_strong_text'><span>总流水：￥#total_revenue#</span><span>已结算流水：￥#settled_revenue#</span><span>未结算流水：￥#not_settled_revenue#</span><span>待结算流水：￥#wait_settled_revenue#</span></div>",
                data: webix.copy(price_template)
            },
            {margin:15,cols:[
                {},
                {view:"button",label:"选中全部",width:120,click:function(){
                    $$("table_list").eachRow(function(row){
                        var item = $$("table_list").getItem(row);
                        if(!item.cost_settled){
                            item.settled_check = true;
                        }
                    });
                    $$("table_list").refresh();
                    countPrice();
                }},
                {view:"button",label:"清除选中",width:120,click:function(){
                    $$("table_list").eachRow(function(row){
                        var item = $$("table_list").getItem(row);
                        if(!item.cost_settled){
                            item.settled_check = false;
                        }
                    });
                    $$("table_list").refresh();
                    countPrice();
                }},
                {view:"button",label:"确认结算",width:120,click:function(){
                    webix.confirm({
                        text:"结算选择的订单项<br/> 确定?", ok:"是", cancel:"取消",
                        callback:function(res){
                            if(res){
                                var arr = [];
                                $$("table_list").eachRow(function(row){
                                    var item = $$("table_list").getItem(row);
                                    if(item.settled_check){
                                        arr.push(item);
                                    }
                                });
                                if(!arr.length>0){
                                    base.$msg.error("未选择任何结算项");
                                    return ;
                                }
                                base.postReq("community/revenue/settled.json",arr,function(){
                                    base.$msg.info("结算成功！");
                                    refresh_table();
                                });
                            }
                        }
                    });
                }}
            ]}
        ]
    }

    var layout = {
        paddingY:5,
        paddingX:5,
        cols:[
            {margin:0, type:"clean", rows:[filter_ui,table_ui,footer_ui]}]
    };

    var countPrice = function(){
        var price  = webix.copy(price_template);
        $$("table_list").eachRow(function(row){
            var item = $$("table_list").getItem(row);
            if(item.cost_settled){
                price.settled_revenue += item.order_cost*1;
            }else{
                price.not_settled_revenue += item.order_cost*1;
            }
            if(item.settled_check){
                price.wait_settled_revenue += item.order_cost*1;
            }
            price.total_revenue += item.order_cost*1;
        });
        $$("price_show").parse(price);
    }

    var refresh_table = function(){
        $$("table_list").clearAll();
        var supplier = $$("s_supplier").getValue();
        var start = $$("start_time").getValue();
        var end = $$("end_time").getValue();
        if(start === "" || end===""){
            return "";
        }
        var param = {supplier_id:supplier,start:base.format_time(start),end:base.format_time(end)};
        base.postReq("community/order_revenue.json",param,function(data){
            $$("table_list").clearAll();
            for(var a in data){
                if(data[a].reward_code !== 'first_order_reward'){
                    $$("table_list").add(data[a]);
                }
            }
            countPrice();
        })
    };

    var init_data = function(){
        var list = $$("s_supplier").getPopup().getList();
        base.getReq("communities.json?key="+$$("key_text").getValue(),function(communities){
            list.clearAll();
            $$("s_supplier").setValue("");
            for(var i=0;i<communities.length;i++){
                list.add({id:communities[i].supplier_id,value:communities[i].name});
            }
            if(communities.length>0){
                $$("s_supplier").setValue(communities[0].supplier_id);
            }
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "社区店流水"});
            init_data();
        }
    }
});