/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base"],function(base){

    /**
     * 更新用户车辆信息
     * @param user_id
     */
    var update_car_model_list = function(user_id){
        base.getReq("cars.json?car_user_id="+user_id,function(cardata){
            if(cardata){
                var list = $$("car_id").getPopup().getList();
                list.clearAll();
                for(var i=0;i<cardata.length;i++){
                    list.add({id:cardata[i].id,value:cardata[i].model});
                }
            }
        });
    };

    var form_ui = {
        view:"form",
        id:"work_order_form",
        elementsConfig:{
            labelWidth: 100,
            width:450
        },
        rows: [
            { view:"text",id:"user_id",name:"user_id",hidden:true,required:true},
            {view: "text",keyPressTimeout:100,label:"手机号码", id: "user_phone_number", placeholder: "输入手机号获取用户信息",value:"",required:true,on:{
                "onTimedKeyPress":function(){
                    var list = $$("car_id").getPopup().getList();
                    list.clearAll();
                    if($$("user_phone_number").getValue().length==11){
                        base.getReq("meta_user/"+$$("user_phone_number").getValue(),function(data){
                            base.$msg.info("用户信息获取成功");
                            $$("user_id").setValue(data.user_id);
                            update_car_model_list(data.user_id);
                        },function(data){
                            if(data.code==="20004"){
                                base.$msg.error("用户未注册，请到新建订单页面注册用户并添加车型");
                            }
                        });
                    }
                }
            }},
            {view:"datepicker", timepicker:true, label:"服务时间：", name:"service_time", stringResult:true, format:"%Y-%m-%d %H:%i:%s"},
            { view: "richselect", id:"car_id", name:"car_id",options:[],label:"用户车辆:",required:true,placeholder:"请选择用户车辆",value:""},
            { view: "richselect", name:"service_type",options:[
                {id:"1",value:"保养"},
                {id:"2",value:"续保"},
                {id:"3",value:"验车"},
                {id:"4",value:"维修"}
            ],label:"理由:",required:true,placeholder:"请选择分享卡包",value:""},
            { view:"textarea",label:"备注:", name:"description",height:150,required:true,placeholder:"备注信息",value:"" }
        ]
    };

    var button_ui = {
        margin:15,
        cols:[
            {},
            {view:"button",label:"提交",width:80,click:function(){
                if($$("work_order_form").validate()){
                    var formdata = $$("work_order_form").getValues();
                    formdata.service_time = base.format_time(formdata.service_time);
                    console.log(formdata);
                    base.postReq("workorder/add",formdata,function(data){
                        base.$msg.info("信息上传成功");
                        webix.$$("work_order_edit_win").close();
                    });
                }
            }},
            {view:"button",label:"取消",width:80,click:function(){
                webix.$$("work_order_edit_win").close();
            }}
        ]
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"work_order_edit_win",
        position:"center",
        head:{
            view:"toolbar",height:40, cols:[
                {view:"label", label: "工单编辑" },
                { view:"button", label: 'X', width: 35, align: 'right', click:"$$('work_order_edit_win').close();"}
            ]},
        body:{
            rows:[form_ui, button_ui]
        }
    };

    return {
        $ui:win_ui
    }
});