define(["views/modules/base",
    "views/modules/table_page_m"],function(base,table_page){

    var on_event = {
        "fa-times":function(e, id){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                    }
                }
            });
        },
        "fa-pencil":function(e, id){
            var item = $$("table_list").getItem(id);
            //编辑优惠券卡包
            this.$scope.show("/coupon_package_edit:id="+item.coupon_package_id);
        }
    };

    var elements = [
        {id:"coupon_package_id",header:"ID",width:80},
        {id:"coupon_package_name", header:"优惠券卡包名称",width:200,fillspace:false},
        {id:"coupon_package_price", header:"售价",width:100,format:base.priceFormat,fillspace:false},
        {id:"coupon_package_items", header:"优惠卡包项",minWidth:350,fillspace:true,template:function(obj){
            var result = "";
            var items = obj.coupon_package_items;
            for(var a in items){
                result += "<span class='status status1'>"+items[a].link_type_text+"："+items[a].link_info+" "+items[a].discount_type_text+" "+items[a].discount_value+"</span>&nbsp;";
            }
            return result;
        }},
        {id:"create_time", header:"创建时间",width:150,format:base.$show_time,fillspace:false},
        {id:"edit", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='编辑优惠券卡包' class='webix_icon fa-pencil'></span>"},
        {id:"delete", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='删除优惠券卡包' class='webix_icon fa-times'></span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoheight:true,
        hover:"myhover",
        rightSplit:2,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "优惠券卡包", width: 135, click: function(){
                //todo
                this.$scope.show("/coupon_package_edit");
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
        $$("table_list").clearAll();
        base.getReq("coupon_packages.json",function(data){
            console.log(data);
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        })
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "服务商管理人员"});
            refresh_table();
        }
    }
});