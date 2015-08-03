define(["views/modules/base",
    "views/forms/store_form",
    "views/forms/store_type_form",],function(base,store_form,store_type_form){

    var on_event = {
        "fa-trash-o":function(e, id, node){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该单品<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        base.postForm("/v2/api/store/ware/delete.json",{ware_id:item.ware_id},function(data){
                            webix.$$("table_list").remove(id);
                            base.$msg.info("删除资源成功");
                        });
                    }
                }
            });
        },
        "fa-pencil":function(e, id, node){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(store_form.$ui).show();
            store_form.$init_data(item.ware_id);
            store_form.$add_submit_callback(function(){
                refresh_table();
            });
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
            { view: "button", type: "iconButton", icon: "plus", label: "添加单品", width: 105, click: function(){
                this.$scope.ui(store_form.$ui).show();
                store_form.$init_data();
                store_form.$add_submit_callback(function(){
                    refresh_table();
                });
            }},
            { view: "button", type: "iconButton", icon: "plus", label: "添加单品系列", width: 135, click: function(){
                this.$scope.ui(store_type_form.$ui).show();
                store_type_form.$add_submit_callback(function(){

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
        $$("table_list").clearAll();
        base.getReq("/v2/api/store/ware_list_by_type.json?ware_type_code=store_home_ware",function(ware_list){
            $$("table_list").parse(ware_list);
        })
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "商城管理", details: "单品列表"});
            refresh_table();
        }
    }
});