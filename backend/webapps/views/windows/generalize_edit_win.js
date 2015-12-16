define(["views/modules/base",
    "views/modules/upload",
    "views/windows/store_wares_win"],function(base,upload,store_wares_win){

    var img_fomat = function(obj){
        if(typeof obj.thumbnail_url === 'undefined' || obj.thumbnail_url === ""){
            return '<img src="http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF" class="content" ondragstart="return false"/>';
        }
        return '<img onclick="window.open(\''+obj.raw_url+'\')" src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
    };

    var elements = [
        {view:"text",id:"generalize_id",name:"generalize_id",hidden:true},
        {view:"text",name:"index_no",hidden:true},
        {view:"text",id:"title_img_id",name:"title_img_id",hidden:true},
        {height:150,width:400,id:"cover_img",template:img_fomat},
        {height:25,template:"<a id='cover_img_pickfiles' style='padding-left: 150px' href='javascript:;'>[上传图片]</a>",
            on:{"onAfterRender":function(){
                upload.$bind_upload("cover_img_pickfiles",function(data){
                    if(data.code==='00000'&&data.data!=null){
                        var item = data.data;
                        item.img_id = item.id;
                        $$("cover_img").parse(item);
                        $$("title_img_id").setValue(item.img_id);
                    }
                });
            }}},
        { view:"radio", name:"status", label:"是否启用",value:"disabled", width:350,required:true,options:[
            { value:"启用", id:'enabled' },
            { value:"停用", id:'disabled' }
        ]},
        {view: "richselect",name:"generalize_code",label:"推广类型",value:"banners",required:true,options:[
            {id:"banners",value:"头部banner"},
            {id:"good_suggest",value:"精品推荐"}
        ],placeholder:"推广类型"},
        {view: "richselect",id:"link_type",name:"link_type",label:"链接类型",value:"banners",required:true,options:[
            {id:"ware",value:"单品"},
            {id:"h5_page",value:"H5页面"},
            {id:"topic_list",value:"主题列表"},
            {id:"none",value:"不做任何处理"}
        ],placeholder:"推广类型"},
        {view:"text",label:"关联项",placeholder: "单品/主题列表",name:"link_id",click:function(){
            if($$("link_type").getValue()==='ware'){
                //单品
                webix.ui(store_wares_win.$ui).show();
            }else if($$("link_type").getValue()==='topic_list'){
                //主题列表

            }
        },readonly:true},
        {view:"text",label:"链接地址",placeholder: "http://",name:"link_url"}
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 80,
            labelPosition:"left"
        },
        elements:elements
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

    var init_data = function(advertisement){
        if(advertisement){
            advertisement.enable = advertisement.enable.toString();
            $$("form_view").parse(advertisement);
            $$("cover_img").parse(advertisement.bg_img_view);
        }
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"广告弹窗信息编辑",
        body: {
            type:"space",
            rows:[from_ui,button_ui]
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
