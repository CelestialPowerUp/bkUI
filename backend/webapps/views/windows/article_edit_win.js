define(["views/modules/base",
    "views/modules/upload",
    "views/windows/store_wares_win",
    "views/windows/topic_list_win"],function(base,upload,store_wares_win,topic_list_win){

    store_wares_win.$add_callback(function(ware){
        $$("link_text").setValue(ware.ware_name+"("+ware.product_name+")");
        $$("link_id").setValue(ware.ware_id);
    });

    topic_list_win.$add_callback(function(topic){
        $$("link_text").setValue(topic.topic_name);
        $$("link_id").setValue(topic.topic_id);
    });

    var clear_link_info = function(){
        $$("link_text").setValue('');
        $$("link_id").setValue('');
    };

    var img_fomat = function(obj){
        if(typeof obj.thumbnail_url === 'undefined' || obj.thumbnail_url === ""){
            return '<img src="http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF" class="content" ondragstart="return false"/>';
        }
        return '<img onclick="window.open(\''+obj.raw_url+'\')" src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
    };

    var elements = [
        {view:"text",id:"article_id",name:"article_id",hidden:true},
        {view:"text",name:"index_no",hidden:true},
        {view:"text",id:"article_pic_id",name:"article_pic_id",value:"1000",hidden:true},
        {view:"text",label:"标题",id:"article_title",name:"article_title",required:true},
        {height:150,width:400,id:"cover_img",template:img_fomat},
        {height:25,template:"<a id='cover_img_pickfiles' style='padding-left: 150px' href='javascript:;'>[上传图片]</a>",
            on:{"onAfterRender":function(){
                upload.$bind_upload("cover_img_pickfiles",function(data){
                    if(data.code==='00000'&&data.data!=null){
                        var item = data.data;
                        item.img_id = item.id;
                        $$("cover_img").parse(item);
                        $$("article_pic_id").setValue(item.img_id);
                    }
                });
            }}},
        { view:"radio", name:"status", label:"状态",value:"disabled", width:350,required:true,options:[
            { value:"启用", id:'enabled' },
            { value:"停用", id:'disabled' },
            { value:"发布", id:'published' },
            { value:"隐藏", id:'unpublished' }
        ]},
        {view:"text",label:"链接",name:"article_href",placeholder: "http://",required:true}
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 50,
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
            var action = "article/update.json";
            if(formdata.article_id.length===0){
                action = "article/create.json";
            }

            console.log(formdata);
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

    var init_data = function(obj){
        if(obj){
            $$("form_view").parse(obj);
            $$("cover_img").parse(obj.title_img_view);
        }
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"文章信息编辑",
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
