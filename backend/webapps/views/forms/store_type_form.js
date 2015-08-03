define(["views/modules/base",
    "views/modules/upload",
    "views/forms/store_product"],function(base,upload,store_product){


    var elements = [
        {view:"text",id:"ware_type_id",name:"ware_type_id",hidden:true},
        {view:"text",id:"ware_type_code",name:"ware_type_code",value:"store_home_ware",hidden:true},
        {view: "text", label:"单品标题",name:"ware_type_name", placeholder: "请输入单品标题",width:350,value:""},
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 80
        },
        elements:elements
    };

    var button_ui = {margin:20,cols:[{},{view:"button",label:"确定",width:80,click:function(){
        var formdata = $$("form_view").getValues();
        var action = "/v2/api/store/ware_type/create.json";
        base.postReq(action,formdata,function(){
            webix.message("数据更新成功");
            if(typeof(submit_call_back)==='function'){
                submit_call_back();
            }
            webix.$$("pop_win").close();
        });
    }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"编辑单品系列",
        body: {
            type:"space",
            rows:[from_ui,button_ui]
        }
    };

    var submit_call_back = null;

    var add_submit_callback = function(fuc){
        if(typeof(fuc)==='function'){
            submit_call_back = fuc;
        }
    };

    return {
        $ui:win_ui,
        $add_submit_callback:add_submit_callback
    };
});
