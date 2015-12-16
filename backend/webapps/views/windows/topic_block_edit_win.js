define(["views/modules/base",
    "views/modules/upload",
    "views/windows/store_wares_win"],function(base,upload,store_wares_win){

    store_wares_win.$add_callback(function(chose_data){
        $$("block_list").add(chose_data);
    });

    var img_fomat = function(obj){
        if(typeof obj.thumbnail_url === 'undefined' || obj.thumbnail_url === ""){
            return '<img src="http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF" class="content" ondragstart="return false"/>';
        }
        return '<img onclick="window.open(\''+obj.raw_url+'\')" src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
    };

    var elements = [
        {view:"text",id:"block_id",name:"block_id",hidden:true},
        {view:"text",label:"列表名称",placeholder: "数据主题列表名称",name:"block_name",required:true},
        { view:"radio", name:"status", label:"列表分栏",value:"one_block", width:350,required:true,options:[
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
                id:"form_view",
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
        {id:"title_img", header:"标题图片",template:function(obj){
            return "<img style='width:100%;height:100%;' src='http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF'>";
        }, width:120,css:"noPadding"},
        {id:"ware_name", header:"单品标题", width:250},
        {id:"ware_mark_price", header:"商品售价", width:95},
        {id:"ware_full_price", header:"商品市场价", width:95},
        {id:"index_no", header:"排列序号", width:95}
    ]

    var block_list_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"单品列表",height:30},
                { view: "button", type: "iconButton", icon: "plus", label: "添加单品", width: 135, click: function(){
                    //todo
                    webix.ui(store_wares_win.$ui).show();
                }},
            ]},
            {
                id:"block_list",
                view:"datatable",
                headerRowHeight:35,
                rowHeight:85,
                //autoConfig:true,
                height:300,
                autowidth:true,
                hover:"myhover",
                scrollY:true,
                drag:true,
                columns:elment,
                on:{"onCheck":function(){
                    countPrice();
                }},
                data:  []
            }
        ]
    };

    var button_ui = {margin:20,cols:[{},
        {view:"button",label:"确定",width:80,click:function(){
            if (!$$("form_view").validate()){
                base.$msg.error("请输入正确的参数");
                return;
            }
            var formdata = $$("form_view").getValues();
            var action = "generalize/update.json";
            if(formdata.generalize_id.length===0){
                action = "generalize/create.json";
            }
            console.log(formdata);
            /*base.postReq(action,formdata,function(data){
                base.$msg.info("数据提交成功");
                if(typeof callBack === 'function'){
                    callBack(data);
                }
                webix.$$("pop_win").close();
            });*/
        }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]
    };

    var init_data = function(){

    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"主题列表编辑",
        body: {
            type:"space",
            rows:[from_ui,block_list_ui,button_ui]
        }
    };

    var callBack = null;

    return {
        $ui:win_ui,
        $init_data:init_data,
        $addCallBack:function(func){
            if(typeof func === 'function'){
                callBack = func;
            }
        }
    };
});
