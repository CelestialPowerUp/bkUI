define(["views/modules/base",
    "views/modules/table_page_m"],function(base,table_page){

    var on_event = {
        "fa-trash-o":function(e, id, node){
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
        "fa-pencil":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商
        }
    };

    var elements = [
        {id:"ware_id",width:50,hidden:true},
        {id:"ware_name", header:"单品名称",minWidth:250,fillspace:true},
        {id:"ware_type_name", header:"单品类别",minWidth:120,fillspace:true},
        {id:"product_name", header:"关联商品",minWidth:250,fillspace:true},
        {id:"ware_full_price",header:"市场价", minWidth:125,fillspace:true},
        {id:"ware_mark_price", header:"养爱车价", minWidth:125,fillspace:true},
        {id:"ware_status", header:"单品状态", minWidth:125,fillspace:true,template:function(obj){
            if(obj.ware_status === "up_shelves"){
                return "<span class='status status1'>上架</span>";
            }else{
                return "<span class='status status0'>下架</span>";
            }}
        },
        {id:"edit", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' class='webix_icon fa-pencil'></span>"},
        {id:"delete", header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:true,
        rowHeight:35,
        hover:"myhover",
        columns:elements,
        data:[],
        onClick:on_event
    }

    var check = function(check){
        return '<span class="webix_icon_btn fa-check-square-o list_icon" style="max-width:32px;"></span>'
    };

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "添加服务商", width: 105, click: function(){
                //todo
            }},
            {}
        ]
    };

    var table_page_ui = table_page.$create_page_table("table_page_list",table_ui);

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_page_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();

    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "服务商列表"});
            refresh_table();
        }
    }
});