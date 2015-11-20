define(["views/modules/base"],function(base){

    __supplier_id = null;

    var item_list_type = {
        height: 30,
        check:  webix.template('<span class="webix_icon_btn fa-{obj.enabled?check-:}square-o list_icon" style="max-width:32px;"></span>'),
        template: function(obj,type){
            return "<div>"+type.check(obj)+"<span class='"+(obj.support?"":"text_delete")+" list_text'>"+obj.link_type_text+":"+obj.coupon_package_item_name+"("+obj.link_info+")"+"</span></div>";
        }
    };

    var item_list = {
        view: "list",
        css: "tasks_list",
        id:"item_list",
        width:300,
        type: item_list_type,
        data: [],
        on: {
            onItemClick:function(id){
                var item = this.getItem(id);
                if(!item.support){
                    base.$msg.error("该社区店不支持该项");
                    return;
                }
                item.enabled = !item.enabled;
                this.refresh(id);
            }
        }
    };

    var er_wei_ma_list = {rows:[
        {view:"toolbar",height:30, cols:[
            {view:"label",label:"选择卡包项"},
        ]},
        item_list
    ]};

    var note_ui = {
        cols:[
            { view: "icon", icon: "fa fa-exclamation-triangle"},
            {view:"label", align:"left",css:"warning", label:"每个卡包必须选择一个卡包项！打杠的卡包项标识该社区店不支持该服务项",height:30}
        ]
    };


    var refresh_package_item = function(coupon_package_id){
        base.getReq("supplier/coupon_package.json?supplier_id="+__supplier_id+"&coupon_package_id="+coupon_package_id,function(data){
            console.log(data);
            $$("item_list").clearAll();
            $$("item_list").parse(data['package_items']);
            if(data.supplier_product){
                $$("supplier_product_name").setValue(data.supplier_product.supplier_product_name);
                $$("supplier_price").setValue(data.supplier_product.supplier_price);
                $$("supplier_cost").setValue(data.supplier_product.supplier_cost);
            }
        });
    };

    var elements = [
        {},
        {view:"text",id:"supplier_id",name:"supplier_id",hidden:true},
        {view: "richselect",label:"选择卡包",placeholder:"请选择优惠券卡包",value:"product",options:[],on:{
            onChange:function(newv, oldv){
                var item = $$("product_id").getPopup().getList().getItem(newv);
                $$("supplier_product_name").setValue(item.coupon_package_name);
                $$("supplier_price").setValue(item.coupon_package_price);
                $$("supplier_cost").setValue(item.coupon_package_price);
                refresh_package_item(newv);
            }
        },id:"product_id",name:"product_id",required:true},
        {view: "text", label:"卡包名称",id:"supplier_product_name",name:"supplier_product_name", placeholder: "",hidden:true},
        {view: "text", label:"卡包售价",id:"supplier_price",name:"supplier_price", placeholder: "请输入卡包售价",value:"",required:true},
        {view: "text", label:"结算价格",id:"supplier_cost",name:"supplier_cost", placeholder: "请输入卡包结算价格",value:"",required:true}
    ];

    var from_ui = {rows:[
        {view:"toolbar",height:30, cols:[
            {view:"label", label: "卡包列表" }
        ]},
        {id:"form_view", view:"form", elementsConfig:{
            width:200,
            labelPosition:"top",
            labelWidth: 80
        }, elements:elements}
    ]};

    var button_ui = {margin:20,cols:[{},{view:"button",label:"确定",width:80,click:function(){
        var items = $$("item_list").serialize();
        var form_data = $$("form_view").getValues();
        var post_data = {supplier_product:form_data,link_package_items:items};
        base.postReq("supplier/coupon_package/update.json",post_data,function(){
            base.$msg.info("数据提交成功");
            if(typeof(submit_call_back)==='function'){
                submit_call_back();
            }
            webix.$$("sub_pop_win").close();
        });
    }},
    {view:"button",label:"取消",width:80,click:function(){
        webix.$$("sub_pop_win").close();
    }}]};

    var init_data = function(supplier_id,coupon_package_id){
        __supplier_id = supplier_id;
        $$("supplier_id").setValue(supplier_id);
        base.getReq("coupon_packages.json",function(packages){
            var list = $$("product_id").getPopup().getList();
            list.clearAll();
            for(var a in packages){
                packages[a]['id'] = packages[a].coupon_package_id;
                packages[a]['value'] = packages[a].coupon_package_name;
                list.add(packages[a]);
            }
            if(coupon_package_id){
                $$("product_id").setValue(coupon_package_id);
                $$("product_id").refresh();
                $$("product_id").disable();
            }
        });
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"sub_pop_win",
        position:"center",
        head:"社区店卡包编辑",
        body: {
            type:"space",
            rows:[{margin:10,cols:[er_wei_ma_list,from_ui]},note_ui,button_ui]
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
        $init_data:init_data,
        $add_submit_callback:add_submit_callback
    };
});