define(["views/modules/base",
    "views/menus/popup_menu",
    "views/forms/coupon_package_item_form"],function(base,menu,item_form){

    var item_fomat = function(obj){
        return "<div class='overall'>" +
            "<div class='items'><label>卡包项名：</label><span>"+obj.coupon_package_item_name+"</span><label>过期时间：</label><span>"+obj.expired_time+"</span></div>"+
            "<div class='items'><label>关联类型：</label><span>"+obj.link_type_text+"</span><label>关联项：</label><span>"+obj.link_info+"</span></div>"+
            "<div class='items'><label>优惠类型：</label><span>"+obj.discount_type_text+"</span><label>优惠值：</label><span>"+obj.discount_value+"</span></div>"+
            "</div>";
    };

    var note_ui = {
        cols:[
            { view: "icon", icon: "fa fa-exclamation-triangle"},
            {view:"label", align:"left",css:"warning", label:"提交后的卡包项支持编辑但不支持删除，请确认后再提交数据！！！",height:30}
        ]
    };

    var coupon_item_list_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"优惠券卡包项",height:30},
                note_ui,
                { view: "button", type: "iconButton", icon: "plus", label: "新增卡包项", width: 135, click: function(){
                    //todo
                    webix.ui(item_form.$ui).show();
                    item_form.$addCallBack(function(data){
                        $$("coupon_item_list").add(data);
                    });
                }}
            ]},
            {
                view: "dataview",
                id: "coupon_item_list",
                css: "movies",
                select: true,
                scroll: true,
                type: {width: 450, height: 120},
                template: item_fomat,
                on:{"onItemClick":function(id, e, node){
                    var item = this.getItem(id);
                    $$("pp_menu").show(e);
                }},
                data:[]
            }
        ]
    }

    var form_elements = [
        {view:"text",id:"id",name:"id",hidden:true},
        {view:"text",id:"product_category_type",name:"product_category_type",hidden:true},
        {view:"text",label:"卡包名称",placeholder: "输入卡包名称",name:"product_name",required:true},
        {view:"text",label:"卡包售价",placeholder: "卡包售价",id:"price",name:"price",required:true},{}
    ]

    var form_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"优惠券卡包",height:30}
            ]},
            {
                id:"form_view",
                view:"form",
                elementsConfig:{
                    labelWidth: 80,
                    width:250,
                    labelPosition:"left"
                },
                rows:form_elements,
                rules:{
                    price:webix.rules.isNumber
                }
            }
        ]
    }

    var submit_data = function(){
        if (!$$("form_view").validate()){
            base.$msg.error("请输入正确的参数");
            return;
        }
        //卡包基本数据
        var formdata = $$("form_view").getValues();
        formdata.cost = formdata.price;

        //卡包项数据
        var datas = $$("coupon_item_list").serialize();
        if(datas.length<=0){
            base.$msg.error("请至少添加一个成卡包优惠项");
            return;
        }
        var postdata = {coupon_package:formdata,package_items:datas};
        var action = "coupon_packages/update.json";
        if(formdata.id.length===0){
            action = "coupon_packages/create.json";
        }
        base.postReq(action,postdata,function(backdata){
            base.$msg.info("数据提交成功");
            pars_data(backdata);
        });
    }


    var button_ui = {margin:20,cols:[{},
        {view:"button",label:"确定",width:80,click:function(){
            webix.confirm({
                text:"确定提交修改<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        submit_data();
                    }
                }
            });

        }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]
    };

    var win_ui = {
            type:"space",
            rows:[{margin:15,cols:[coupon_item_list_ui,form_ui]},button_ui]
        };

    var menus = [
        {value:"edit",label:"编辑",click:function(){
            webix.ui(item_form.$ui).show();
            var item = $$("coupon_item_list").getSelectedItem();
            item_form.$addCallBack(function(data){
                for(var a in data){
                    if(typeof data[a] === 'function'){
                        continue;
                    }
                    item[a] = data[a];
                }
                $$("coupon_item_list").refresh();
            });
            item_form.$init_data(item);
        }},
        {value:"edit",label:"删除",click:function(){
            var item = $$("coupon_item_list").getSelectedItem();
            if(item.coupon_package_item_id===''){
                $$("coupon_item_list").remove($$("coupon_item_list").getSelectedId());
            }else{
                base.$msg.error("该项已提交后台暂时不支持删除");
            }
        }}
    ];

    var pars_data = function(data){
        $$("form_view").parse(data.coupon_package);
        $$("coupon_item_list").clearAll();
        $$("coupon_item_list").parse(data.package_items);
    }

    var init_data = function(){
        var id = base.get_url_param("id")
        if(id){
            base.getReq("coupon_packages/"+id,function(data){
                pars_data(data);
            });
        }
    }

    return {
        $ui:win_ui,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "优惠券管理", details: "优惠券卡包编辑"});
            init_data();
            menu.$add_menus(menus);
        }
    };
});