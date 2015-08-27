define(["views/modules/base",
    "views/forms/user_role"],function(base,user_role){

    var onClick = {
        "edit":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(user_role.$ui).show();
            user_role.$init_data(item.id);
        }
    };

    var elements = [
        {id:"trash", header:"操作", width:150, template:"<span><u class='edit'>用户角色</u></span>"},
        {id:"id",width:50,hidden:true},
        {id:"phone_number",header:["电话号码", {content:"textFilter"} ], width:250},
        {id:"user_name", header:["姓名",{content:"textFilter"}], width:250},
        {id:"sing_in_origin", header:"注册来源", width:250}
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

    var filter_ui = {
        margin:15,
        cols:[
            {view: "richselect",id:"filter",label:"角色:",labelWidth:45,options:[],placeholder:"选择角色",width:250,
                on:{"onAfterRender":function(){
                        base.getReq("roles.json",function(data){
                            var list = $$("filter").getPopup().getList();
                            list.clearAll();
                            $$("filter").setValue();
                            for(var i=0;i<data.length;i++){
                                list.add({id:data[i].role_type,value:data[i].name});
                            }
                            list.add({id:-1,value:"未分配角色用户"});
                        });
                    },
                    "onChange":function(n,o){
                        base.getReq("users_by_role.json?role_type="+n,function(users){
                            $$("table_list").clearAll();
                            webix.message("用户数:"+users.length);
                            $$("table_list").parse(users);
                        });
                    }
                }
            }
        ]
    }

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_ui]},{}]
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "系统用户", details: "系统用户管理"});
        }
    }
});