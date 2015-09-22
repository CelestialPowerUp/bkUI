define(["views/modules/base",
    "views/forms/supplier_times_card"],function(base,supplier_times_card){

    var supplier_id = null;

    var on_event = {
        "fa-trash-o":function(e, id, node){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        base.postReq("/v2/api/supplier/times_card/delete.json",item,function(data){
                            base.$msg.info("记录删除成功");
                            refresh_table();
                        });
                    }
                }
            });
        },
        "fa-pencil":function(e, id, node){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(supplier_times_card.$ui).show();
            supplier_times_card.$init_data(item);
            supplier_times_card.$add_callback(function(data){
                refresh_table();
            });
        }
    };

    var elements = [
        {id:"times_card_product_id",header:"次卡ID",hidden:true,width:80},
        {id:"times_card_product_name", header:["次卡名称", {content:"textFilter"} ],minWidth:350,fillspace:true},
        {id:"total_price", header:"次卡价格",minWidth:350,editor:"text",fillspace:true},
        {id:"buy_amount", header:"购买数量",minWidth:350,editor:"text",fillspace:true},
        {id:"send_amount", header:"赠送数量",minWidth:350,editor:"text",fillspace:true},
        {id:"trash", header:"&nbsp;", width:80, template:"<span  style=' cursor:pointer;text-decoration: underline;' title='删除次卡' class='webix_icon fa-trash-o'>删除</span>"},
        {id:"edit", header:"&nbsp;", width:80, template:"<span  style=' cursor:pointer;text-decoration: underline;' title='编辑次卡' class='webix_icon fa-pencil'>编辑</span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        hover:"myhover",
        autoConfig:true,
        rightSplit:2,
        columns:elements,
        data:[],
        onClick:on_event,
        on:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "backward", label: "返回列表", width: 120, click: function(){
                //todo
                this.$scope.show("/supplier_list");
            }},
            { view: "button", type: "iconButton", icon: "plus", label: "添加商品", width: 120, click: function(){
                //todo
                if(supplier_id===null || supplier_id === ''){
                    base.$msg.error("请选择一个服务商");
                    return;
                }
                this.$scope.ui(supplier_times_card.$ui).show();
                supplier_times_card.$init_data();
                supplier_times_card.$add_callback(function(data){
                    refresh_table();
                });
            }},
            {}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var refresh_table = function(){
        if(supplier_id===null || supplier_id === ''){
            base.$msg.error("请选择一个服务商");
            return;
        }
        base.getReq("/v2/api/supplier/times_card/list.json/"+supplier_id,function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "服务商列表"});
            supplier_id = base.get_url_param("id");
            refresh_table();
        }
    }
});