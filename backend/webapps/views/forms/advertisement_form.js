define(["views/modules/base",
    "views/modules/upload"],function(base,upload){

    var img_fomat = function(obj){
        if(typeof obj.thumbnail_url === 'undefined' || obj.thumbnail_url === ""){
            return '<img src="http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF" class="content" ondragstart="return false"/>';
        }
        return '<img onclick="window.open(\''+obj.raw_url+'\')" src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
    };

    var recg_pic = function(){
        var img_url = $$("img_url").getValue();
        if(img_url.length<=0){
            base.$msg.error("未找到识别的行驶证，请重新上传行驶证");
            return;
        }
        base.$msg.info("正在尝试识别行驶证内容,请稍后");
        $$("rec_button").disable();
        base.postForm("cars/driving_license_discern_url.json",{url:img_url},function(disc){
            $$("rec_button").enable();
            base.$msg.info("行驶证内容识别完成");
            var formdata = $$("form_view").getValues();
            for(var p in disc){
                if(typeof(disc[p]) !== 'function' ){
                    formdata[p] = disc[p];
                }
            }
            $$("form_view").parse(formdata);
        },function(){
            $$("rec_button").enable();
        });
    };

    var elements = [
        {view:"text",id:"advertisement_id",name:"advertisement_id",hidden:true},
        {view:"text",id:"bg_img_id",name:"bg_img_id",hidden:true},
        {height:230,width:400,id:"cover_img",template:img_fomat},
        {height:25,template:"<a id='cover_img_pickfiles' style='padding-left: 150px' href='javascript:;'>[上传图片]</a>",
            on:{"onAfterRender":function(){
                upload.$bind_upload("cover_img_pickfiles",function(data){
                    if(data.code==='00000'&&data.data!=null){
                        var item = data.data;
                        item.img_id = item.id;
                        $$("cover_img").parse(item);
                        $$("bg_img_id").setValue(item.img_id);
                    }
                });
            }}},
        { view:"radio", name:"enable",id:"enable", label:"是否启用", width:350,required:true,options:[
            { value:"启用", id:'true' },
            { value:"停用", id:'false' }
        ]},
        {view:"text",label:"链接地址",placeholder: "http://",id:"link_href",name:"link_href",required:true},
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 80,
            labelPosition:"left"
        },
        elements:elements,
        rules:{
            "bg_img_id":webix.rules.isNumber,
            "link_href":webix.rules.isNotEmpty,
            "enable":webix.rules.isNotEmpty
        }
    };

    var button_ui = {margin:20,cols:[{},
        {view:"button",label:"确定",width:80,click:function(){
            if (!$$("form_view").validate()){
                base.$msg.error("请输入正确的参数");
                return;
            }
            var formdata = $$("form_view").getValues();
            var action = "advertisement/update.json";
            if(formdata.advertisement_id.length===0){
                action = "advertisement/create.json";
            }
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
