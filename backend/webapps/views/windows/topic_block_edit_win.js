define(["views/modules/base",
    "views/modules/upload_win",
    "views/windows/store_wares_win",
    "views/menus/popup_menu",],function(base,upload_win,store_wares_win,popup_menu){

    var __topic_id = null;

    var block_item_format = function(obj){
        return '<div class="list-content">'+
            '<div class="left-img"><img src="'+obj.cover_img.thumbnail_url+'"/></div>'+
            '<div class="right-text">'+
            '<p><span>单品名称:￥</span><span>'+obj.ware_name+'</span></p>'+
            '<p><span>单品售价:￥</span><span>'+obj.ware_mark_price+'</span></p>'+
            '<p><span>单品市场价:￥</span><span>'+obj.ware_full_price+'</span></p>'+
            '</div>'+
            '</div>';
    };

    store_wares_win.$add_callback(function(chose_data){
        if(chose_data.cover_img){
            chose_data.title_img_id = chose_data.cover_img.img_id;
        }
        $$("block_ware_list").add(chose_data);
    });

    var elements = [
        {view:"text",id:"block_id",name:"block_id",hidden:true},
        {view:"text",label:"列表名称",placeholder: "数据主题列表名称",name:"block_name",required:true},
        { view:"radio", name:"block_type", label:"列表分栏",value:"one_block", width:350,required:true,options:[
            { value:"一栏", id:'one_block'},
            { value:"两栏", id:'two_block'}
        ]}
    ];

    var from_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"单品列表",height:30}
            ]},
            {
                id:"block_form_view",
                view:"form",
                elementsConfig:{
                    labelWidth: 80,
                    labelPosition:"left"
                },
                elements:elements
            }
        ]
    };

    var elment = [
        {id:"ware_id",header:"单品ID",hidden:true,width:80},
        {id:"block_id",header:"列表块",hidden:true,width:80},
        {id:"title_img_id", header:"标题图片ID",hidden:true, width:95},
        {id:"cover_img", header:"标题图片",template:function(obj){
            return "<img style='width:100%;height:100%;' src='"+obj.cover_img.thumbnail_url+"'>";
        }, width:120,css:"noPadding"},
        {id:"ware_name", header:"单品标题", width:250},
        {id:"ware_mark_price", header:"商品售价", width:95},
        {id:"ware_full_price", header:"商品市场价", width:95},
        {header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-upload' title='上传图片'>上传</span>"}
    ]

    var table_event = {
        "fa-upload":function(e, id){
            var item = $$("block_edit_list").getItem(id);
            webix.ui(upload_win.$ui).show();
            upload_win.$add_callback(function(upload_img){
                item.cover_img = upload_img;
                item.title_img_id = upload_img.img_id;
                $$("block_ware_list").refresh(id);
            });
        }
    };

    var block_edit_list_ui = {
        width:890,
        height:400,
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"单品列表",height:30},
                { view: "button", type: "iconButton", icon: "plus", label: "添加单品", width: 135, click: function(){
                    //todo
                    webix.ui(store_wares_win.$ui).show();
                }},
            ]},
            {
                view: "dataview",
                id: "block_ware_list",
                css: "movies",
                select: true,
                scroll: true,
                xCount:2,
                drag:true,
                type: {width:430,height: 150},
                template: block_item_format,
                on:{"onItemClick":function(id, e, node){
                    $$("pp_menu").show(e);
                }},
                data:[]
            }
        ]
    };

    var button_ui = {margin:20,cols:[{},
        {view:"button",label:"确定",width:80,click:function(){
            if (!$$("block_form_view").validate()){
                base.$msg.error("请输入正确的参数");
                return;
            }
            var formdata = $$("block_form_view").getValues();
            formdata.topic_id = __topic_id;
            var action = "topic/block/update.json";
            if(formdata.block_id.length===0){
                action = "topic/block/create.json";
            }
            var block_edit_list = $$("block_ware_list").serialize();
            formdata.link_wares = block_edit_list;
            formdata.topic_id = __topic_id;
            base.postReq(action,formdata,function(data){
                base.$msg.info("数据提交成功");
                if(typeof callBack === 'function'){
                    callBack(data);
                }
                webix.$$("pop_win").close();
            });
        }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]
    };

    var menus = [
        {value:"edit",label:"上传",click:function(){
            var item = $$("block_ware_list").getSelectedItem();
            webix.ui(upload_win.$ui).show();
            upload_win.$add_callback(function(upload_img){
                item.cover_img = upload_img;
                item.title_img_id = upload_img.img_id;
                $$("block_ware_list").refresh();
            });
        }},
        {value:"edit",label:"删除",click:function(){
            $$("block_ware_list").remove($$("block_ware_list").getSelectedId());
        }}
    ]

    var init_data = function(topic_id){
        popup_menu.$add_menus(menus);
        __topic_id = topic_id;
    };

    var parse_data = function(block){
        __topic_id = block.topic_id;
        popup_menu.$add_menus(menus);
        $$("block_form_view").parse(block);
        $$("block_ware_list").parse(block.block_wares);
    }

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"主题列表编辑",
        body: {
            type:"space",
            rows:[from_ui,block_edit_list_ui,button_ui]
        }
    };

    var callBack = null;

    return {
        $ui:win_ui,
        $init_data:init_data,
        $parse_data:parse_data,
        $add_callBack:function(func){
            if(typeof func === 'function'){
                callBack = func;
            }
        }
    };
});
