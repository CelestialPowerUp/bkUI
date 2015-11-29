/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base"],function(base){

    var form_ui = {
        view:"form",
        id:"work_order_form",
        elementsConfig:{
            labelWidth: 100,
            width:450
        },
        rows: [
            { view:"text",name:"user_id",hidden:true,required:true},
            { view:"text", label:'车牌:', name:"service_type",placeholder: "分享名称",value:"",required:true},
            { view:"text", label:'车型:', name:"service_time",placeholder: "分享名称",value:"",required:true},
            { view:"text", label:'用户:', name:"operator_id",placeholder: "分享名称",value:"",required:true},
            { view:"text", label:'状态:', name:"description",placeholder: "分享名称",value:"",required:true},
            { view: "richselect", name:"coupon_package_id",options:[],label:"理由:",required:true,placeholder:"请选择分享卡包",value:""},
            { view:"textarea",label:"备注:", name:"share_url",id:"share_url",height:150,required:true,placeholder:"分享地址",value:"" }
        ]
    };

    var button_ui = {
        margin:15,
        cols:[
            {},
            {view:"button",label:"提交",width:80,click:function(){

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