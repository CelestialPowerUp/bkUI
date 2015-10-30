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
        {id:"customer_name", header:"订单用户",width:120,fillspace:false},
        {id:"car_number", header:"车牌号",width:150,fillspace:false},
        //{id:"reward_note", header:"奖励原因",width:150,fillspace:false},
        {id:"order_cost", header:"订单流水",width:120,format:base.priceFormat,fillspace:false,sort:"string"},
        {id:"cost_settled", header:"流水结算",template:function(obj){
            if(obj.cost_settled){
                return "<span class='status status1'>已结算</span>";
            }
            return "<span class='status status0'>未结算</span>";
        },width:120,fillspace:false},
        {id:"order_reward", header:"订单奖励",width:120,format:base.priceFormat,fillspace:false},
        {id:"settled_check",header:"奖励结算",template:function(obj,common){
            if(obj.reward_settled){
                return "<span class='status status1'>已结算</span>";
            }
            return "<span class='status status2'>待结算</span>";
            //return common.checkbox(obj, common, obj.settled_check,{checkValue:true});
        },width:95,checkValue:true},
        {id:"order_complete_time", header:"订单完成",width:185,fillspace:false}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
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
                {view:"label", align:"left",label:"社区店奖励结算",height:30},
                {view: "richselect", id:"s_supplier",options:[],label:"社区店:",placeholder:"请选择社区店",labelWidth:65,value:"",width:350,
                    on:{
                        onChange:function(newv,oldv){
                            refresh_table();
                        }
                    }
                },
                {view: "richselect", id:"s_year",options:[{id:2015,value:2015}],label:"年份:",labelWidth:50,placeholder:"请选择年份",value:"2015",width:250,
                    on:{
                        onChange:function(newv,oldv){
                            refresh_table();
                        }
                    }
                },
                {view: "richselect", id:"s_week",options:[],label:"第几周:",placeholder:"请选择周数",labelWidth:65,value:"",width:350,
                    on:{
                        onChange:function(newv,oldv){
                            refresh_table();
                        }
                    }
                },
                { view: "button", type: "iconButton", icon: "fa fa-file-excel-o", label: "数据导出", width: 120,click:function(){
                    webix.toExcel($$("table_list"), {
                        filename:$$("s_supplier").getText()+$$("s_year").getText()+$$("s_week").getText(),
                        name:"社区店奖励流水"
                    });
                }}
            ]}
        ]
    };

    var price_template = {total_revenue:0,total_reward:0,total_price:0,
        settled_revenue:0,settled_reward:0,settled_price:0,
        not_settled_revenue:0,not_settled_reward:0,not_settled_price:0,
        wait_settled_revenue:0,wait_settled_reward:0,wait_settled_price:0
    };

    var footer_ui = {
        rows:[
            {
                id: "price_show",
                height: 120,
                template:"<div class='big_strong_text'><span>总奖励：￥#reward_total_price#</span><span>好评率：#good_order_rating#</span><span>结算系数：#account_coefficient#</span></div>"
                +"<div class='big_strong_text'><span>应结算(X系数)：￥#account_total_price#</span><span>已结算：￥#settled_price#</span><span>未结算：￥#un_settled_price#</span></div>",
                data: {reward_total_price:"数据获取中...",good_order_rating:"数据获取中...",account_coefficient:"数据获取中...",account_total_price:"数据获取中...",settled_price:"数据获取中...",un_settled_price:"数据获取中..."}
            },
            {cols:[
                {},
                {view:"button",label:"确认结算",width:120,click:function(){
                    webix.confirm({
                        text:"结算余下未结算的订单奖励<br/> 确定?", ok:"是", cancel:"取消",
                        callback:function(res){
                            if(res){
                                var arr = [];
                                $$("table_list").eachRow(function(row){
                                    var item = $$("table_list").getItem(row);
                                    if(!item.reward_settled){
                                        arr.push(item);
                                    }
                                });
                                if(!arr.length>0){
                                    base.$msg.error("没有未结算的订单奖励");
                                    return ;
                                }
                                base.postReq("community/reward/settled.json",arr,function(){
                                    base.$msg.info("奖励结算成功！");
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
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:0, type:"clean", rows:[filter_ui,table_ui,footer_ui]}]
    };

    var countPrice = function(){
        return;
        var price  = webix.copy(price_template);
        $$("table_list").eachRow(function(row){
            var item = $$("table_list").getItem(row);
            if(item.reward_settled){
                price.settled_reward += item.order_reward*1;
            }else{
                price.not_settled_reward += item.order_reward*1;
            }
            if(item.settled_check){
                price.wait_settled_reward += item.order_reward*1;
            }
            price.total_reward += item.order_reward*1;
        });
        $$("price_show").parse(price);
    }

    var refresh_table = function(){
        $$("table_list").clearAll();
        var supplier = $$("s_supplier").getValue();
        var year = $$("s_year").getValue();
        var week = $$("s_week").getValue();
        if(week === "" || supplier===""){
            return "";
        }
        base.getReq("community/order_rewards.json?supplier_id="+supplier+"&year="+year+"&week="+week,function(result){
            if(typeof result.good_order_rating === 'undefined' || result.good_order_rating === null){
                result.good_order_rating = '--'
            }
            $$("price_show").parse(result);
            var data = result.items;
            $$("table_list").clearAll();
            for(var a in data){
                if(data[a].reward_code !== 'times_card_revenue'){
                    data[a].settled_check = false;
                    $$("table_list").add(data[a]);
                }
            }
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
        base.getReq("pub_data/weeks.json",function(weeks){
            var list = $$("s_week").getPopup().getList();
            list.clearAll();
            for(var i=0;i<weeks.length;i++){
                list.add({id:weeks[i],value:"第"+weeks[i]+"周"});
            }
            if(weeks.length>0){
                $$("s_week").setValue(weeks[0]);
            }
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "社区店奖励"});
            init_data();
        }
    }
});