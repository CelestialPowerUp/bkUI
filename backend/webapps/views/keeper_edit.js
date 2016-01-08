/**
 * Created by wangwr on 2015/5/26.
 */
define(["views/modules/base",
    "views/modules/table_page",
    "views/modules/upload",
    "views/modules/address"],function(base,table_page,upload,address){

    var submit_control_ui = {
        cols:[
            {view:"button",value:"提交",click:function(){
                var fomdata = $$("form_view").getValues()
                var action = "";
                if(fomdata.keeper_id === ""){//新增
                    action = "car_keeper/create.json";
                }else{//更新
                    action = "car_keeper/update.json";
                }
                base.postReq(action,fomdata,function(data){
                    base.$msg.info("数据提交成功");
                });
            }}
        ]
    };

    var elements = [
        {view:"text",id:"keeper_id",name:"keeper_id",hidden:true},
        {view: "text", label:"管家姓名",name:"name", placeholder: "请输入管家姓名",width:350,value:""},
        //{view: "text",type:"password", label:"登陆密码",name:"password",placeholder: "需要修改密码才填写此项", width:350,value:""},
        {view: "text", label:"电话号码",name:"phone_num", placeholder: "请输入管家电话",width:350,value:""},
        {view: "text", label:"身份证号",name:"identity_card_number", placeholder: "请输入二代身份证号",width:350,value:""},
        {view: "text", label:"驾照号",name:"driver_license", placeholder: "请输入驾照号",width:350,value:""},
        {view:"text",name:"attachment_id",id:"attachment_id",hidden:true},
        {cols:[
            {},
            {id:"attachment_url",name:"attachment_url",width:135,height:165,template:"<img id='upload_img' title='点击上传图片', style='width:100%;height:100%;' src='#attachment_url#'>",
                on:{"onAfterRender":function(){
                    upload.$bind_upload("upload_img",function(data){
                        if(data.code==='00000'&&data.data!=null){
                            var form_data = $$("form_view").getValues();
                            form_data.attachment_id = data.data.id;
                            form_data.attachment_url = data.data.thumbnail_url;
                            $$("form_view").parse(form_data);
                            $$("attachment_url").parse(form_data);
                        }
                    });
                }}
            },
            {}
        ]},
        {view: "textarea", label:"工作站",name:"address", placeholder: "点击选择工作站",width:350,height:95,value:"",readonly:true,click:function(){
            $$("main_body").$scope.ui(address.$ui).show();
            address.$addc_confirm_envent(address_callback);
        }},
        submit_control_ui
        //
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 80
        },
        elements:elements
    };

    var base_info = {cols:[from_ui,{}]};

    var onClick = {
        "edit":function(e,id,node){
            var item = this.getItem(id);
            var item = this.getItem(id);
            $$("main_body").$scope.show("/app/order_edit:id="+id);
        }
    };

    var table_bar_ui = {
        cols:[
            { view:"segmented", id:"switch_table", value:"", inputWidth:250, options:[
                { id:"uncompleted", value:"未完成订单" },
                { id:"completed", value:"已完成订单"}
            ],
            on:{
                "onAfterTabClick":function(id){
                    switch_table_list(id);
                }
            }}
        ]
    };

    var table_columns = [
        {id:"number", header:"订单号",template:"<span><u class='edit'>#number#</u></span>", width:180},
        {id:"customer_name", header:"姓名", sort:"string"},
        {id:"customer_phone_number", header:"电话号码",width:120, sort:"string"},
        {id:"car_number", header:"车牌号", sort:"string"},
        {id:"car_model", header:"车型号", sort:"string",width:380,fillspace:true},
        {id:"paid",header:"支付状态",sort:"string",template:function(obj){
            if(obj.pay_status==1){
                return "<span class='status status1'>已支付</span>";
            }
            if(obj.pay_status==2){
                return "<span class='status status0'>未支付</span>";
            }
            if(obj.pay_status==3){
                return "<span class='status status2'>部分支付</span>";
            }
            return "未知";
        }},
        {id:"place_time", header:"下单时间",sort:"string",width:210}
    ];

    var data_table = {
        id:"data_list",
        view:"datatable",
        select:false,
        autowidth:true,
        autoheight:false,
        rowHeight:45,
        hover:"myhover",
        onClick:onClick,
        columns:table_columns
    };

    var layout ={
        margin:15,
        cols:[{rows:[table_bar_ui,data_table]},{paddingY:36,rows:[base_info,{}]}]
    };

    var parse_form_data = function(data){
        data.address = data.work_station.address;
        $$("form_view").parse(data);
        $$("attachment_url").parse(data);
    };

    var init_data = function(keeper_id){
        base.getReq("car_keeper/"+keeper_id,function(data){
            parse_form_data(data);
            switch_table_list("uncompleted",data.keeper_id);
        });
    };

    var update_table = function(value,keeper_id){
        $$("data_list").clearAll();
        if(typeof(keeper_id)==='undefined' || keeper_id === ""){
            return ;
        }
        base.getReq("/v3/api/orders.json?user_type=keeper&keeper_id="+keeper_id+"&order_status="+value,function(data){
            for(var i=0;i<data.length;i++){
                $$("data_list").add(data[i]);
            }
        });
    };

    var switch_table_list = function(value){
        var formdata = $$("form_view").getValues();
        var keeper_id = "";
        if(typeof(formdata)!='undefined'){
            keeper_id = formdata.keeper_id;
        }
        $$("switch_table").setValue(value);
        update_table(value,keeper_id);
    };

    var address_callback = function(item){
        if(typeof(item)!='undefined'&&item!=null){
            var formdata = $$("form_view").getValues();
            delete item.id;
            formdata.work_station = item;
            parse_form_data(formdata);
        }
    };


    return {
        $ui:layout,
        $oninit:function(app,config){
            var keeper_id = base.get_url_param("keeper_id");
            if(typeof(keeper_id)==='undefined') {
                webix.$$("title").parse({title: "管家管理", details: "新增管家"});
            }else{
                webix.$$("title").parse({title: "管家管理", details: "管家编辑"});
                init_data(keeper_id);
            }
        }
    };
});
