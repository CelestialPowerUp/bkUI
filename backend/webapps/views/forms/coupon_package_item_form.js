define(["views/modules/base",
    "views/menus/popup_menu",
    "views/forms/store_product",
    "views/forms/product_category_list"],function(base,menu,store_product,product_category){

    var chose_product = function(){
        webix.ui(store_product.$ui).show();
        store_product.$init_data($$("link_id").getValue());
        store_product.$add_callback(function(choose_data){
            for(var i=0;i<choose_data.length;i++){
                $$("link_info").setValue(choose_data[i]['product_category_name']+"-"+choose_data[i]['product_name']);
                $$("link_id").setValue(choose_data[i]['product_id']);
            }
        });
    };

    var chose_product_category = function(){
        webix.ui(product_category.$ui).show();
        product_category.$init_data($$("link_id").getValue());
        product_category.$add_callback(function(choose_data){
            for(var i=0;i<choose_data.length;i++){
                $$("link_info").setValue(choose_data[i]['category_name']);
                $$("link_id").setValue(choose_data[i]['current_category_type']);
            }
        });
    }

    var form_elements = [
        {view:"text",name:"coupon_package_item_id",hidden:true},
        {view:"text",id:"link_id",name:"link_id",hidden:true,required:true},
        {view:"text",label:"优惠券名称",placeholder: "输入卡包项名称",name:"coupon_package_item_name",required:true},
        {view: "richselect",label:"优惠券类型",placeholder:"选择优惠券类型",value:"product",options:[
            {id:"normal",value:"通用券"},
            {id:"product",value:"特定商品券"},
            {id:"product_category",value:"商品分类券"}
        ],on:{
            onChange:function(newv, oldv){
                $$("link_info").setValue("");
                $$("link_id").setValue("");
                if(newv==='normal'){
                    $$("link_info").disable();
                }else{
                    $$("link_info").enable();
                }
            }
        },id:"link_type",name:"link_type",required:true},
        {view: "text", label:"关联商品",id:"link_info", name:"link_info",placeholder: "单机选择关联的商品",readonly:true,click:function(){
            if($$("link_type").getValue()==='product'){
                chose_product();
            }
            if($$("link_type").getValue()==='product_category'){
                chose_product_category();
            }
            if($$("link_type").getValue()==='normal'){

            }
        }},
        {view: "richselect",label:"优惠类型",placeholder:"选择优惠券类型",value:"reduce_price",options:[
            {id:"fixed_price",value:"定额券"},
            {id:"reduce_price",value:"金额抵扣券"}
        ],name:"discount_type",id:"discount_type",required:true},
        {view:"text",label:"优惠价格",placeholder: "请输入优惠价格",name:"discount_value",required:true},
        {view:"text",label:"过期时间",placeholder: "输入优惠券过期时间（天）",name:"expired_time",required:true}
    ]

    var form_ui = {
        id:"form_item_view",
        view:"form",
        elementsConfig:{
            labelWidth: 100,
            width:320,
            labelPosition:"left"
        },
        elements:form_elements,
        rules:{
            discount_value:webix.rules.isNumber,
            expired_time:webix.rules.isNumber
        }
    }

    var button_ui = {margin:20,cols:[{},
        {view:"button",label:"确定",width:80,click:function(){
            if (!$$("form_item_view").validate()){
                base.$msg.error("请输入正确的参数");
                return;
            }
            var formdata = $$("form_item_view").getValues();
            formdata.discount_type_text = $$("discount_type").getText();
            formdata.link_type_text = $$("link_type").getText();
            if(typeof callBack === 'function'){
                callBack(formdata);
            }
            webix.$$("pop_item_win").close();
        }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_item_win").close();
        }}]
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_item_win",
        position:"center",
        head:"优惠券卡包编辑",
        body: {
            type:"space",
            rows:[form_ui,button_ui]
        }
    };

    var callBack = null;

    var menus = [
        {value:"edit",label:"编辑",click:function(){
            webix.ui(form.$ui).show();
            var item = $$("img_view").getSelectedItem();
            form.$init_data(item);
        }}
    ];

    menu.$add_menus(menus);

    return {
        $ui:win_ui,
        $addCallBack:function(func){
            if(typeof func === 'function'){
                callBack = func;
            }
        },
        $init_data:function(data){
            $$("form_item_view").parse(data);
        }
    };
});
