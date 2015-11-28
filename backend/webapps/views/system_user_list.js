define(["views/modules/base",
    "views/forms/user_role",
    "views/forms/user_password",
    "views/forms/user_job_number"],function(base,user_role,user_password,user_job_number){

    var onClick = {
        "fa-user":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(user_role.$ui).show();
            user_role.$init_data(item.id);
        },
        "fa-keyboard-o":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(user_password.$ui).show();
            user_password.$add_submit_callback(function(data){
                data.user_id = item.id;
                base.postForm("/user/password/update.json",data,function(){
                    base.$msg.info("密码更新成功");
                });
            });
        },
        "fa-github":function(e,id,node){
            var item = $$("table_list").getItem(id);
            $$("main_body").$scope.ui(user_job_number.$ui).show();
            user_job_number.$add_submit_callback(function(data){
                data.id = item.id;
                data.phone_number = item.phone_number;
                data.user_name = item.user_name;
                data.sing_in_origin = item.sing_in_origin;
                base.postReq("meta_user.json",data,function(data){
                    base.$msg.info("信息变更成功");
                    findUser();
                });
            });
        }
    };

    var elements = [
        {id:"id",width:50,hidden:true},
        {id:"phone_number",header:"电话号码",fillspace:true},
        {id:"user_name", header:"姓名",fillspace:true},
        {id:"job_number", header:"员工编号",fillspace:true},
        {id:"sing_in_origin", header:"注册来源",fillspace:true},
        {id:"trash", header:"", width:80, template:"<span class='webix_icon fa-user trash' title='用户角色'>角色</span>"},
        {id:"password", header:"&nbsp;", width:80, template:"<span class='webix_icon trash' title='更改密码'>密码</span>"},
        {id:"job_num", header:"&nbsp;", width:100, template:"<span class='webix_icon trash' title='员工工号'>员工编号</span>"},
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        autoConfig:true,
        hover:"myhover",
        rightSplit:3,
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

    var filter_ui = {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
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
    ]};

    var layout = {
        paddingY:15,
        paddingX:15,
        type:"clean", rows:[filter_ui,table_ui]
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "系统用户", details: "系统用户管理"});
        }
    }
});