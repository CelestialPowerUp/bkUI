define(["views/modules/base",
    "views/modules/upload",
    "views/forms/store_product"],function(base,upload,store_product){

    var img_fomat = function(obj){
        return '<img src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
    };

    var img_list_ui =  {
        view: "dataview",
        id: "img_list",
        css: "nav_list",
        yCount: 1,
        xCount:8,
        select: true,
        scroll: false,
        drag:true,
        type: {
            width: 100,
            height: 65
        },
        template: img_fomat,
        on:{"onItemClick":function(id){
            var item = this.getItem(id);
            window.open(item.original_url);
        }}
    };

    var elements = [
        {view:"text",id:"ware_id",name:"ware_id",hidden:true},
        {view:"text",id:"product_id",name:"product_id",hidden:true},
        {view: "richselect", id:"ware_type_id",name:"ware_type_id",options:[],label:"单品分类",placeholder:"请选择单品类别",width:350},
        {view: "text", label:"关联商品",id:"product_info",name:"product_info", placeholder: "单机选择关联的商品",width:350,readonly:true,click:function(){
            this.$scope.ui(store_product.$ui).show();
            store_product.$init_data($$("product_id").getValue());
            store_product.$add_callback(function(choose_data){
                for(var i=0;i<choose_data.length;i++){
                    $$("product_info").setValue(choose_data[i]['product_category_name']+"-"+choose_data[i]['product_name']);
                    $$("product_id").setValue(choose_data[i]['product_id']);
                    $$("ware_mark_price").setValue(choose_data[i]['price']);
                }
                var formdata = $$("form_view").getValues();
                formdata.ware_products = choose_data;
                $$("form_view").parse(formdata);
            });
        }},
        {view: "text", label:"单品标题",name:"ware_name", placeholder: "请输入单品标题",width:350,value:""},
        {view: "text", label:"养爱车价",id:"ware_mark_price",name:"ware_mark_price", placeholder: "",width:350,value:"",disabled:true},
        {view: "text", label:"市场价",name:"ware_full_price", placeholder: "",width:350,value:""},
        {view:"radio", id:"ware_status",name:"ware_status", label:"单品状态:",value:"up_shelves", width:350,  options:[
            { value:"上架", id:"up_shelves"},
            { value:"下架", id:"down_shelves"}
        ]},
        {view:"text",id:"cover_img_id",name:"cover_img_id",hidden:true},
        {height:25,template:"<a id='cover_img_pickfiles' href='javascript:;'>[上传封面]</a>",
            on:{"onAfterRender":function(){
                upload.$bind_upload("cover_img_pickfiles",function(data){
                    if(data.code==='00000'&&data.data!=null){
                        var item = data.data;
                        item.img_id = item.id;
                        $$("cover_img").parse(item);
                        $$("cover_img_id").setValue(item.img_id);
                    }
                });
            }}},
        {cols:[{height:80,maxWidth:120,id:"cover_img",template:img_fomat}]},
        {height:25,template:"<a id='pickfiles' href='javascript:;'>[上传介绍图图片]</a>",
            on:{"onAfterRender":function(){
                upload.$bind_upload("pickfiles",function(data){
                    if(data.code==='00000'&&data.data!=null){
                        var item = data.data;
                        item.img_id = item.id;
                        $$("img_list").add(item);
                    }
                });
            }}},
        img_list_ui,
        {view:"textarea",name:"brief_introduction",height:80,label:"单品简介"},
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 80
        },
        elements:elements,
        rules:{
            "ware_mark_price":webix.rules.isNumber,
            "ware_full_price":webix.rules.isNumber
        }
    };

    var button_ui = {margin:20,cols:[{},{view:"button",label:"确定",width:80,click:function(){
        if (!$$("form_view").validate()){
            base.$msg.error("请输入正确的参数");
            return;
        }
        var imgs = $$("img_list").serialize();
        var formdata = $$("form_view").getValues();
        formdata.introduction_imgs = imgs;
        var action = "/v2/api/store/ware/update.json";
        if(formdata.ware_id===""){
            action = "/v2/api/store/ware/create.json";
        }
        base.postReq(action,formdata,function(){
            webix.message("单品数据提交成功");
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

    var init_data = function(ware_type_id,type_code){
        base.getReq("/v2/api/store/ware_type_list.json?ware_type_code="+type_code,function(data){
            var list = $$("ware_type_id").getPopup().getList();
            list.clearAll();
            for(var i=0;i<data.length;i++){
                list.add({id:data[i].ware_type_id,value:data[i].sub_name});
            }
            if(typeof(ware_type_id)==='undefined'|| ware_type_id===null){
                return;
            }
            base.getReq("/v2/api/store/ware/detail.json?ware_id="+ware_type_id,function(ware){
                $$("form_view").parse(ware);
                $$("cover_img").parse(ware.cover_img);
                $$("img_list").parse(ware.introduction_imgs);
            });
        });
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"编辑单品",
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
        $init_data:init_data,
        $add_submit_callback:add_submit_callback
    };
});
