define(["views/modules/base"],function(base){

    var coupon_template_api = "coupon/all_coupon_template.json";

    var append_msg = function(msg){
        var text = $$("send_msg_text").getValue();
        text += msg+"\n";
        $$("send_msg_text").setValue(text);
    }

    var elements = [
        {view: "richselect", id:"coupon_template_type",name:"coupon_template_type",options:[],label:"优惠券摸版",placeholder:"请选择发放的优惠券摸版",width:350,on:{
            "onChange":function(newv, oldv){
                $$("coupon_name").setValue($$("coupon_template_type").getText());
                if(newv.split("-")[1]!=="coupon_type_1"){
                    $$("coupon_value").hide();
                    $$("coupon_value").setValue("0");
                    return;
                }
                $$("coupon_value").show();
                $$("coupon_value").setValue("");
               }
        }},
        {view: "text", label:"优惠券名称",id:"coupon_name",name:"coupon_name", placeholder: "优惠券名称",readonly:true,width:350,value:""},
        {view: "text", label:"优惠券值",id:"coupon_value",name:"coupon_value",keyPressTimeout:100, placeholder: "请输入优惠券优惠金额",width:350,value:"",on:{
            "onTimedKeyPress":function(){
                var coupon_value = $$("coupon_value").getValue();
                var coupon_name = $$("coupon_template_type").getText()+$$("coupon_value").getValue()+"元";
                $$("coupon_name").setValue(coupon_name);
            }
        }},
        {view:"datepicker", timepicker:true, label:"截止日期", name:"expiration_time",id:"expiration_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s" },
        {view:"textarea",id:"hand_reason",name:"hand_reason",height:60,label:"发放原因",placeholder: "不能少于5个字符"},
        { view:"button",id:"submit_button", value: "发送", click:function(){

            $$("submit_button").disable();

            var text = $$("user_phone_text").getValue();
            var phones = text.split("\n");
            var user_phones = [];
            for(var i=0;i<phones.length;i++){
                var user_phone = phones[i].trim();
                if(user_phone===""){
                    continue;
                }
                user_phones.push(user_phone);
            }

            var form_data = $$("form_view").getValues();
            form_data.coupon_template_type = form_data.coupon_template_type.split("-")[0];
            form_data.expiration_time = base.format_time(form_data.expiration_time);
            var send_data = {};
            send_data.user_phones = user_phones;
            send_data.coupon_param = form_data;
            append_msg("正在发放优惠券...");
            base.postReq("coupon/hand_out_by_user_phones.json",send_data,function(data){
                append_msg("优惠券发放完成 [OK]");
                append_msg("共发送用户数："+user_phones.length);
                append_msg("成功用户数："+data.success_users.length);
                append_msg("失败用户数："+data.not_exist_users.length);
                if(data.not_exist_users.length>0){
                    append_msg("失败用户列表：");
                    for(var i=0;i<data.not_exist_users.length;i++){
                        append_msg(data.not_exist_users[i]);
                    }
                    append_msg("失败原因：系统不存在该用户");
                }
                $$("submit_button").enable();
                refresh_table();
            },function(data){
                append_msg("优惠券发放出错啦 [ERROR] "+data.message );
                $$("submit_button").enable();
            });
        }}
    ]

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 120
        },
        elements:elements
    };

    var table_elements = [
        {id:"coupon_log_id",hidden:true},
        {id:"hand_user_name", header:"发放人",width:100},
        {id:"hand_coupon_name", header:"优惠券名称",width:150},
        {id:"hand_reason", header:"发放原因",width:200},
        {id:"success_count", header:"成功用户数",width:120},
        {id:"failure_count",header:"不存在用户数", width:120},
        {id:"success_user", header:"成功用户", minWidth:250,editor:"popup",fillspace:true},
        {id:"not_exist_user", header:"不存在的用户", minWidth:250,editor:"popup",fillspace:true},
        {id:"create_time", header:"发送时间", width:185}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:true,
        rowHeight:35,
        hover:"myhover",
        editable:true,
        columns:table_elements,
        data:[]
    }

    var layout = {
        paddingY:15,
        paddingX:15,
        margin:15,
        type:"space",
        rows:[
            {margin:15,cols:[from_ui,
                {view:"textarea",id:"user_phone_text",label:"发送号码",labelPosition:"top",placeholder: "输入发送的电话号码,用换行分割"},
                {view:"textarea",id:"send_msg_text",name:"send_msg_text",labelPosition:"top",label:"发送结果",readonly:true},
               ]},
            table_ui
        ]
    };

    var init_data = function(){
        base.getReq(coupon_template_api,function(data) {
            var list = $$("coupon_template_type").getPopup().getList();
            list.clearAll();
            for (var i = 0; i < data.length; i++) {
                list.add({
                    id: data[i].coupon_template_type + "-" + data[i].coupon_type,
                    value: data[i].coupon_template_name
                });
            }
            if (typeof(ware_type_id) === 'undefined' || ware_type_id === null) {
                return;
            }
        });
        refresh_table();
    }

    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("coupon/hand_log_list.json",function(data){
            $$("table_list").parse(data);
        })
    }

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "优惠券", details: "发送优惠券"});
            init_data();
        }
    }
});