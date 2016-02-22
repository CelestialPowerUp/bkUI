define(["views/modules/base"],function(base){

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
        {id:"leave_id",width:50,hidden:true},
        {id:"user_name", header:"请假人",minWidth:250,fillspace:true},
        {id:"phone_number", header:"电话",minWidth:120,fillspace:true},
        {id:"start_time", header:"起始时间",minWidth:250,fillspace:true},
        {id:"end_time",header:"结束时间", minWidth:125,fillspace:true},
        {id:"create_time", header:"创建时间", minWidth:125,fillspace:true}
       /* {id:"edit", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' class='webix_icon fa-pencil'></span>"},
        {id:"delete", header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' class='webix_icon fa-trash-o'></span>"}*/
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

    /*var filter_ui = {
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
    };*/

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[table_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("user/keeper_leave_list.json",function(list){
            $$("table_list").parse(list);
        })
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "管家管理", details: "请假记录"});
            refresh_table();
        }
    }
});