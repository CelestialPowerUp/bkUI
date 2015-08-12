define(["views/modules/base",
    "views/forms/user_role"],function(base,user_role){

    var activity_code = null;

    var activity_id = null;

    var activity_status_change_event = null;

    var on_event = {
        "onCheck":function(rwo, column, state){
            var item = $$("activity_table_list").getItem(rwo);
            base.postReq("activity_record/update.json",item,function(data){
                base.$msg.info("回访状态修改成功");
            });
        },
        /*"onItemDblClick":function(id){
            this.editRow(id);
        },*/
        "onAfterEditStop":function(state, editor, ignoreUpdate){
            var item = $$("activity_table_list").getItem(editor.row);
            base.postReq("activity_record/update.json",item,function(data){
                base.$msg.info("信息修改成功");
            });
        }
    };

    var elements = [
        {id:"activity_record_id",width:50,hidden:true},
        {id:"user_id", header:"",hidden:true},
        {id:"user_name",editor:"text", header:["客户姓名", {content:"textFilter"} ],sort:"string", width:125},
        {id:"user_phone_number", header:["电话号码", {content:"textFilter"} ], width:125},
        {id:"pay_status",header:"是否已支付", width:120,sort:"string",template:function(obj){
            if(obj.pay_status === 0){
                return "<span class='status status"+obj.pay_status+"'>未支付</span>";
            }else{
                return "<span class='status status"+obj.pay_status+"'>已支付</span>";
            }
        }},
        {id:"revisit", header:"是否已回访", width:120,sort:"string",template:"{common.checkbox()}", checkValue:1, uncheckValue:0},
        {id:"create_time", header:"创建时间",template:function(obj){
            return base.$show_time(obj.create_time);
        }, width:160,sort:"string"},
        {id:"note", header:"备注",editor:"text",width:500,sort:"string"}
    ];

    var table_ui = {
        id:"activity_table_list",
        view:"datatable",
        select:true,
        autowidth:true,
        rowHeight:35,
        editable:true,
        editaction:"dblclick",
        hover:"myhover",
        columns:elements,
        data:[],
        on:on_event
    }

    var check = function(check){
        return '<span class="webix_icon_btn fa-check-square-o list_icon" style="max-width:32px;"></span>'
    };

    var filter_ui = {
        margin:15,
        cols:[
            { view:"button", id:"refresh",type:"iconButton",icon:"refresh",label:"刷新数据",width:120,
                on:{"onItemClick":function(id,code){
                    if(id!='refresh'){
                        activity_id=id;
                        activity_code = code;
                    }
                    refresh_data();
                }}
            },
            {view: "richselect", name: "activities",id:"activities",options:[],label:"选择活动：",labelWidth:90,placeholder:"请选择活动",width:350,
                on:{
                    "onAfterRender":function(){
                        init_activity_select();
                    },
                    "onChange":function(newv, oldv){
                        activity_code = newv;
                        refresh_data();
                    }
                }
            },
            { view:"radio", name:"activity_status",id:"activity_status", label:"活动状态:",value:-1, width:350,  options:[
                { value:"未启动", id:0 },
                { value:"进行中", id:1 }
            ]},
            {}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_ui]},{}]
    };

    var init_activity_select = function(){
        base.getReq("all_activities.json",function(data) {
            var list = $$("activities").getPopup().getList();
            list.clearAll();
            for (var i = 0; i < data.length; i++) {
                list.add({id: data[i]['code'], value: data[i]['name']});
            }

            if(typeof (activity_code) === 'undefined' || activity_code === null || activity_code ===""){
                return ;
            }
            $$("activities").setValue(activity_code);
        });
    };

    var refresh_data = function(){

        if(activity_code==null || activity_code == ""){
            base.$msg.error("请选择一个活动");
            return;
        }

        $$("activities").setValue(activity_code);

        base.getReq("activity/is_valid.json?code="+activity_code,function(data){
            $$("activity_status").setValue(data.status);
        });

        base.getReq("activity_records.json?code="+activity_code,function(data){

            for(var i=0;i<data.length;i++){
                data[i].id = data[i].activity_record_id;
            }

            $$("activity_table_list").clearAll();

            $$("activity_table_list").parse(data);

            if(typeof(activity_id)!=='undefined'&& activity_id !== null&&data.length>0){
                $$("activity_table_list").select(activity_id);
            }

            base.$msg.info("数据加载成功 数量 "+data.length);

        });
    }

    var activity_status_event = function(newv,oldv){
        if(activity_code==null || activity_code==""){
            base.$msg.error("请选择一个活动");
            reValue(oldv);
            return ;
        }
        if(oldv===-1){
            return;
        }

        var post_data = {code:activity_code, status:newv};

        base.postReq("activity/status/update.json",post_data,function(data){
            base.$msg.info("活动状态更新成功");
        },function(){
            reValue(oldv);
        })
    }

    var reValue = function(value){
        if(activity_status_change_event != null){
            $$("activity_status").detachEvent(activity_status_change_event);
        }
        $$("activity_status").setValue(value);
        activity_status_change_event = $$("activity_status").attachEvent("onChange",activity_status_event);
    };

    var init_data = function(){

        activity_status_change_event = $$("activity_status").attachEvent("onChange",activity_status_event);

        if(activity_code==null || activity_code == ""){
            return;
        }
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "活动管理", details: "活动列表"});
            activity_id = base.get_url_param("activity_id");
            activity_code = base.get_url_param("code");
            init_data();
        }
    }
});