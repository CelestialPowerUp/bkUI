/**
 * Created by Administrator on 2015/11/26.
 */
define(["views/modules/base"],function (base) {

    var elements = [
        {id:"p_number",header:"车牌",width:100,template:function(obj){
            return obj.province+obj.number;
        },fillspace:true},
        {id:"customer_phone_s", header:"用户",width:150,template:function(obj){
            return obj.customerName+" "+obj.customerPhoneNumber;

        },fillspace:false,fillspace:true},
        {id:"serviceType", header:"创建原因",template:function(obj,common){
            if(obj.serviceType===1){
                return "保养";
            }else  if(obj.serviceType===2){
                return "续保";
            }else  if(obj.serviceType===3){
                return "验车";
            }else  if(obj.serviceType===4){
                return "维修";
            }else{
                return "失效";
            }
        },width:150,fillspace:false},
        {id:"boughtDate", header:"购车时间",width:150,format:base.$show_time,fillspace:false},
        {id:"serviceTime", header:"保养时间",width:150,format:base.$show_time,fillspace:false},
        {id:"work_status", header:"状态",template:function(obj,common){
            if(obj.procStatus===0){
                return "未认领";
            }else if(obj.procStatus==1){
                return "已认领";
            }
            else if(obj.procStatus==2){
                return "处理中";
            }else if(obj.procStatus==3){
                return "已完成";
            }else if(obj.procStatus==4){
                return "已失效";
            }
        },width:100,fillspace:false},
        {id:"$check", header:"确认",width:100,template:function(obj,common){
            if(obj.workStatus===1){
                return common.checkbox(obj, common, obj.$check,{checkValue:true});
            }
            return "已录入";

        },fillspace:false}
    ];

    var system_order_list_ui = {
        id:"system_order_list",
        view:"datatable",
        headerRowHeight:35,
        autoConfig:true,
        checkboxRefresh:true,
        hover:"myhover",
        scrollY:true,
        columns:elements,
        data:  []
    };


  
    var button_ui = {
        cols:[
            {},
            { view: "button", type: "iconButton", icon: "backward", label: "返回列表", width: 120, click: function(){
                //todo
                this.$scope.show("/system_work_order_list");
            }},
            { view: "button", type: "iconButton", icon: "check-square-o", label: "确认录入", width: 110, click: function(){
                //todo workorder/update
                var datas = $$("system_order_list").serialize();
                var arr = [];
                for(var a in datas){
                    if(datas[a].workStatus===1 && datas[a].$check){
                        arr.push(datas[a].wkid);
                    }
                }
                if(arr.length<=0){
                    base.$msg.error("没有选择可录入的项");
                    return ;
                }
                base.postReq("workorder/updateId",arr,function(data){
                    base.$msg.info("录入成功");
                    init_data();
                });
            }}
        ]

    }

    var header  = {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
        {view:"label",label:"工单筛选"}
    ]}

    var win_ui = {rows:[header,system_order_list_ui,button_ui]};


    var init_data = function(){
        var user_car_id = base.get_url_param("id");
        if(user_car_id){
            base.getReq("workorder/getWorkOrderByCarUserId/"+user_car_id,function(orders){
                $$("system_order_list").clearAll();
                $$("system_order_list").parse(orders)
            });
        }
    }

    return {
        $ui:win_ui,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "工单管理", details: "工单筛选"});
            init_data();
        }
    };
});