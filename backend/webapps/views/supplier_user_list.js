define(["views/modules/base",
    "views/forms/role_user"],function(base,role_user){

    var supplier_id = null;

    var on_event = {
        "fa-trash-o":function(e, id, node){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        var formdata = {};
                        formdata.supplier_id = supplier_id;
                        formdata.user_ids = [item.user_id];
                        base.postReq("/v2/api/supplier_user/delete.json",formdata,function(data){
                            base.$msg.info("记录删除成功");
                            $$("table_list").remove(id);
                        });
                    }
                }
            });
        }
    };

    var elements = [
        {id:"trash", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='删除' class='webix_icon fa-trash-o'></span>"},
        {id:"supplier_id",header:"ID",hidden:true,width:80},
        {id:"user_id",header:"ID",hidden:true,width:80},
        {id:"user_name", header:"姓名",minWidth:350,fillspace:true},
        {id:"user_phone_number", header:"电话号码",minWidth:350,fillspace:true}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:true,
        rowHeight:35,
        autoheight:false,
        hover:"myhover",
        leftSplit:1,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "backward", label: "返回列表", width: 120, click: function(){
                //todo
                this.$scope.show("/supplier_list");
            }},
            { view: "button", type: "iconButton", icon: "plus", label: "添加用户", width: 120, click: function(){
                //todo
                if(supplier_id===null || supplier_id === ''){
                    base.$msg.error("请选择一个服务商");
                    return;
                }
                this.$scope.ui(role_user.$ui).show();
                role_user.$init_data("UserRoles_Supplier",$$("table_list").serialize());
                role_user.$add_callback(function(users){
                    var formdata = {supplier_id:supplier_id};
                    formdata.user_ids = [];
                    if(users.length>0){
                        for(var i= 0;i<users.length;i++){
                            formdata.user_ids.push(users[i].id);
                        }
                    }
                    base.postReq("/v2/api/supplier_user/add.json",formdata,function(data){
                        refresh_table();
                    });
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
        base.getReq("/v2/api/supplier_user_list.json/"+supplier_id,function(data){
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