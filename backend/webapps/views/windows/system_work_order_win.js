/**
 * Created by Administrator on 2015/11/26.
 */
define(["views/modules/base"],function (base) {

    var elements = [
        {id:"p_number",header:"车牌",width:100,template:function(obj){
            return obj.province+obj.number;
        }},
        {id:"customer_phone_s", header:"用户",width:150,template:function(obj){
            return obj.customerName+" "+obj.customerPhoneNumber;

        },fillspace:false},
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
            if(obj.workStatus===0){
                return "完成";
            }else if(obj.workStatus==1){
                return "处理中";
            }

        },width:100,fillspace:false},
        {id:"$check", header:"确认",width:100,template:function(obj,common){
            if(obj.workStatus===0){
                return "已录入";
            }
            return common.checkbox(obj, common, obj.$check,{checkValue:true});
        },fillspace:false}
    ];

    var work_order_table_ui = {
        id:"work_order_table",
        view:"datatable",
        headerRowHeight:35,
        autoConfig:true,
        autowidth:true,
        checkboxRefresh:true,
        hover:"myhover",
        scrollY:true,
        columns:elements,
        data:  []
    };

  
    var button_ui = {
        cols:[
            {},
            { view: "button", type: "iconButton", icon: "check-square-o", label: "确认录入", width: 110, click: function(){
                //todo workorder/update
                var datas = $$("work_order_table").serialize();
                var arr = [];
                for(var a in datas){
                    arr.push(datas[a].id);
                }
                if(arr.length<=0){
                    return ;
                }
                base.postReq("workorder/updateId",arr,function(data){
                    base.$msg.info("录入成功");
                    $$("system_work_order_win").close();
                });
            }}
        ]

    }

    var win_ui = {
        view:"window",
        modal:true,
        id:"system_work_order_win",
        height:450,
        position:"center",
        head:{
            view:"toolbar",height:40, cols:[
                {view:"label", label: "工单筛选" },
                { view:"button", label: 'X', width: 35, align: 'right', click:"$$('system_work_order_win').close();"}
            ]},
        body:{
            rows:[work_order_table_ui,button_ui]
        }
    };

    var init_data = function(car_id){
        base.getReq("workorder/getWorkOrderByCarUserId/"+car_id,function(data){
            $$("work_order_table").clearAll();
            for(var a in data){
                $$("work_order_table").add(data[a]);
            }
        });
    }

    return {
        $ui:win_ui,
        $init_data : init_data
    };
});