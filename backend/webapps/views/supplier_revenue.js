define(["views/modules/base"],function(base){

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
        {id:"order_cost", header:"订单流水",width:120,format:base.priceFormat,fillspace:false,sort:"string"},
        {id:"order_reward", header:"订单奖励",width:120,format:base.priceFormat,fillspace:false},
        {id:"customer_name", header:"订单用户",width:120,fillspace:false},
        {id:"car_number", header:"车牌号",width:150,fillspace:false},
        {id:"reward_note", header:"奖励原因",width:150,fillspace:false},
        {id:"settled_check",header:"结算状态",template:function(obj,common){
            if(obj.settled){
                return "<span class='status status1'>已结算</span>";
            }
            return common.checkbox(obj, common, obj.settled_check,{checkValue:true});
        },width:95,checkValue:true},
        {id:"order_complete_time", header:"订单完成",width:185,fillspace:false},
        {id:"repair", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='修复数据' class='webix_icon fa-pencil'></span>"}
    ];

    var price_template = {total_revenue:0,total_reward:0,total_price:0,
        settled_revenue:0,settled_reward:0,settled_price:0,
        not_settled_revenue:0,not_settled_reward:0,not_settled_price:0,
        wait_settled_revenue:0,wait_settled_reward:0,wait_settled_price:0
    };

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
                {view: "richselect", id:"s_supplier",options:[],label:"社区店:",placeholder:"请选择社区店",labelWidth:65,value:"",width:350,
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

    var footer_ui = {
        rows:[
            {
                id: "price_show",
                height: 180,
                template:
                "<div class='big_strong_text'><span>总流水：￥#total_revenue#</span><span>总奖励：￥#total_reward#</span><span>总金额：￥#total_price#</span></div>"
                +"<div class='big_strong_text'><span>已结算流水：￥#settled_revenue#</span><span>已结算奖励：￥#settled_reward#</span><span>已结算金额：￥#settled_price#</span></div>"
                +"<div class='big_strong_text'><span>未结算流水：￥#not_settled_revenue#</span><span>未结算奖励：￥#not_settled_reward#</span><span>未结算金额：￥#not_settled_price#</span></div>"
                +"<div class='big_strong_text'><span>待结算流水：￥#wait_settled_revenue#</span><span>待结算奖励：￥#wait_settled_reward#</span><span>待结算金额：￥#wait_settled_price#</span></div>",
                data: webix.copy(price_template)
            },
            {cols:[
                {},
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
            if(item.settled){
                price.settled_revenue += item.order_cost*1;
                price.settled_reward += item.order_reward*1;
            }else{
                price.not_settled_revenue += item.order_cost*1;
                price.not_settled_reward += item.order_reward*1;
            }
            if(item.settled_check){
                price.wait_settled_revenue += item.order_cost*1;
                price.wait_settled_reward += item.order_reward*1;
            }
            price.total_revenue += item.order_cost*1;
            price.total_reward += item.order_reward*1;
            //$$("price_show").parse(price);
        });
        price.total_price = price.total_revenue+price.total_reward;
        price.settled_price = price.settled_revenue+price.settled_reward;
        price.not_settled_price = price.not_settled_revenue+price.not_settled_reward;
        price.wait_settled_price = price.wait_settled_revenue+price.wait_settled_reward;
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
        base.postReq("community/order_rewards.json",param,function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
            countPrice();
        })
    };

    var init_data = function(){
        base.getReq("communities.json",function(communities){
            var list = $$("s_supplier").getPopup().getList();
            list.clearAll();
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