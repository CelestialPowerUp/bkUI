define(["views/modules/base"],function(base){

    var base_info_ui = {
        id:"amount_stats_info",
        css: "tiles",
        height:150,
        template: function(data){
            var t = null;
            var items = data.items;
            var html = "<div class='flex_tmp'>";
            for(var i=0; i < items.length; i++){
                t = items[i];
                html += "<div class='item "+t.css+"'>";
                html += "<div class='webix_icon icon fa-"+ t.icon+"'></div>";
                html += "<div class='details'>" +
                    "<div class='value'>"+t.value+"</div><div class='text'>"+t.text+"</div>" +
                    "</div>";
                html += "</div>";
            }
            html += "</div>";
            return html;
        },
        data:{
            items:[
                {id:"all_user", text: "用户总量", value: "加载中...", icon: "user", css: "users"},
                {id:"cur_month_added_user", text: "本月新增用户", value: "加载中...", icon: "user", css: "users"},
                {id:"all_order", text: "订单总量", value: "加载中...", icon: "check-square-o", css: "orders"},
                {id:"cur_month_added_order", text: "本月新增订单", value: "加载中...", icon: "check-square-o", css: "orders"},
                {id:"all_car", text: "车总量", value: "加载中...", icon: "line-chart", css:"profit" },
                {id:"cur_month_added_car", text: "本月新增车", value: "加载中...", icon: "line-chart", css: "profit"}
            ]
        }
    };

    var table_bar_ui = {
        cols:[
            { view:"segmented", id:"switch_table", value:"UserRoles_CarKeepers", inputWidth:250, options:[
                { id:"UserRoles_CarKeepers", value:"管家单量" },
                { id:"UserRoles_SaleUsers", value:"销售单量"}
            ],
                on:{
                    "onAfterTabClick":function(id){
                        swich_user_order(id);
                    }
                }}
        ]
    };

    var table_columns = [
        {id:"name", header:["姓名", {content:"textFilter"} ], width:180,fillspace:1},
        {id:"all_orders", header:"累计订单总量", sort:"int",fillspace:1},
        {id:"cur_month_added_orders", header:"本月新增订单",width:120, sort:"int",fillspace:1}
    ];


    var data_table = {
        id:"data_list",
        view:"datatable",
        select:false,
        rowHeight:45,
        hover:"myhover",
        columns:table_columns
    };

    var layout = {
        type:"clean",
        rows:[
            base_info_ui,{
                type:"space",
                cols:[
                    {rows:[table_bar_ui,data_table]},
                    {}]
            }
        ]
    }

    var init_base_amount_data = function(){
        base.getReq("amount/user_order_info.json",function(data){
            var obj = {items:[]};
            var temps = $$("amount_stats_info").data.items;
            for(var i in temps){
                var item = webix.copy(temps[i]);
                item.value = data[item.id];
                obj.items.push(item);
            }
            $$("amount_stats_info").parse(obj);
        });
    };

    var swich_user_order = function(id){
        if(typeof(id) === 'undefined'){
            id = "UserRoles_CarKeepers";
        }
        $$("switch_table").setValue(id);
        $$("data_list").clearAll();
        base.getReq("amount/user_service_order_info.json?code="+id,function(data){
            $$("data_list").parse(data);
            base.$msg.info("数据加载成功");
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "统计面板", details: "统计信息"});
            init_base_amount_data();
            swich_user_order();
        }
    }
});