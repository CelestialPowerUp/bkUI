define(["views/modules/base",
    "views/forms/role_api",
    "views/forms/role_menu"],function(base,role_api,role_menu){

    var onClick = {
        "views":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(role_api.$ui).show();
            role_api.$init_data(item.role_type);
        },
        "edit":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(role_menu.$ui).show();
            role_menu.$init_data(item.role_type);
        }
    };

    var elements = [
        {id:"trash", header:"操作", width:210, template:"<span><u class='views'>角色接口</u><u class='edit'> 角色菜单</u></span>"},
        {id:"role_type",width:50,hidden:true},
        {id:"name", header:"角色名称", width:250},
        {id:"code", header:"角色编码", width:250}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        autoheight:true,
        autowidth:true,
        rowHeight:35,
        hover:"myhover",
        columns:elements,
        onClick:onClick
    }

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[table_ui]},{}]
    };

    var init_data = function(){
        base.getReq("roles.json",function(data){
            $$("table_list").parse(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "系统管理", details: "角色列表"});
            init_data();
        }
    }
});