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
        {id:"order_number", header:"订单号",width:120,fillspace:false},
        {id:"supplier_name", header:"社区店",minWidth:250,fillspace:true},
        {id:"supplier_id", header:"社区店ID",width:80,fillspace:false},
        {id:"order_cost", header:"订单流水",width:120,format:base.priceFormat,fillspace:false},
        {id:"order_reward", header:"订单奖励",width:120,format:base.priceFormat,fillspace:false},
        {id:"customer_name", header:"订单用户",width:120,fillspace:false},
        {id:"car_number", header:"车牌号",width:150,fillspace:false},
        {id:"reward_note", header:"奖励原因",width:150,fillspace:false},
        {id:"order_create_time", header:"车牌号",width:185,fillspace:false},
        {id:"repair", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='修复数据' class='webix_icon fa-pencil'></span>"}
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
        onClick:on_event
    }

    var filter_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"社区店流水奖励",height:30},
                {view:"label",id: "total_revenue", height:30,label:"总流水",width:160},
                {view:"label",id: "total_reward", height:30,label:"奖励",width:160},
                {view:"label",id: "total_price", height:30,label:"总金额",width:160},
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
                }
            ]}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:0, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        var supplier = $$("s_supplier").getValue();
        var year = $$("s_year").getValue();
        var week = $$("s_week").getValue();
        if(week === "" || supplier===""){
            return "";
        }
        base.getReq("community/order_rewards.json?supplier_id="+supplier+"&year="+year+"&week="+week,function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
            var total_revenue = 0;
            var total_reward = 0;
            var total_price = 0;
            for(var i=0;i<data.length;i++){
                total_revenue += data[i].order_cost;
                total_reward += data[i].order_reward;
            }
            total_price = total_revenue+total_reward;
            $$("total_revenue").setHTML("总流水￥"+total_revenue);
            $$("total_reward").setHTML("奖励￥"+total_reward);
            $$("total_price").setHTML("总金额￥"+total_price);
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
            webix.$$("title").parse({title: "服务商管理", details: "社区店流水奖励"});
            init_data();
        }
    }
});