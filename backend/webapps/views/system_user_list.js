define(["views/modules/base",
    "views/forms/user_role",
    "views/forms/user_password"],function(base,user_role,user_password){

    var onClick = {
        "fa-user":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(user_role.$ui).show();
            user_role.$init_data(item.id);
        },
        "fa-key":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(user_password.$ui).show();
            user_password.$add_submit_callback(function(data){
                data.user_id = item.id;
                base.postForm("/user/password/update.json",data,function(){
                    base.$msg.info("密码更新成功");
                });
            });
        }
    };

    var elements = [
        {id:"trash", header:"", width:80, template:"<span class='webix_icon fa-user' style=' cursor:pointer;text-decoration: underline;' title='用户角色'>角色</span>"},
        {id:"password", header:"&nbsp;", width:80, template:"<span class='webix_icon fa-key' style=' cursor:pointer;text-decoration: underline;' title='更改密码'>密码</span>"},
        {id:"id",width:50,hidden:true},
        {id:"phone_number",header:"电话号码",fillspace:true},
        {id:"user_name", header:"姓名",fillspace:true},
        {id:"sing_in_origin", header:"注册来源",fillspace:true}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        autoConfig:true,
        hover:"myhover",
        columns:elements,
        onClick:onClick
    }

    var findUser = function(){
        var n = $$("filter").getValue();
        var k = $$("search").getValue();
        base.getReq("users_by_role.json?role_type="+n+"&keys="+k,function(users){
            $$("table_list").clearAll();
            webix.message("用户数:"+users.length);
            $$("table_list").parse(users);
        });
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
                        findUser();
                    }
                }
            },
            {view:"search",id:"search",width:250,placeholder:"输入姓名/电话号码",keyPressTimeout:1000,on:{
                "onTimedKeyPress":function(){
                    findUser();
                }
            }},{}
        ]
    }

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_ui]}]
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "系统用户", details: "系统用户管理"});
        }
    }
});