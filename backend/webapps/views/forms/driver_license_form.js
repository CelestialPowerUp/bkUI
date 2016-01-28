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

    var driver_pic_ui = {rows:[
        {height:230,width:320,id:"cover_img",template:img_fomat},
        {height:25,template:"<a id='cover_img_pickfiles' style='padding-left: 110px' href='javascript:;'>[上传行驶证]</a>",
            on:{"onAfterRender":function(){
                upload.$bind_upload("cover_img_pickfiles",function(data){
                    if(data.code==='00000'&&data.data!=null){
                        var item = data.data;
                        item.img_id = item.id;
                        $$("cover_img").parse(item);
                        $$("img_id").setValue(item.img_id);
                        $$("img_url").setValue(item.raw_url);
                        //recg_pic();
                    }
                });
            }}},
        {view:"label", align:"left",css:"warning", label:"注：图片上传后行驶证识别过程可能会有点慢"},
        {view:"label", align:"left",css:"warning", label:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图片上传后请耐心等待10秒左右..."},
        {}
    ]};

    var elements = [
        {margin:15,cols:[
            {margin:3,rows:[
                {view:"text",id:"car_id",name:"car_id",hidden:true},
                {view:"text",id:"img_id",name:"img_id",hidden:true},
                {view:"text",id:"img_url",name:"img_url",hidden:true},
                {view: "text", label:"车牌号",name:"plate_no",width:160, placeholder: "车牌号",value:""},
                {view: "text", label:"使用性质",name:"use_character",width:160, placeholder: "使用性质",value:"非运营"},
                {view: "datepicker",timepicker:false,format:"%Y-%m-%d 00:00:00",stringResult:true, label:"注册日期",name:"register_date", placeholder: "注册日期",width:160,value:""},
                {view: "text", label:"姓名",name:"owner", placeholder: "姓名", width:160,value:""},
                {view: "text", label:"信息创建人",name:"create_user_name", placeholder: "信息创建人", width:160,value:"",disabled:true}
            ]},
            {margin:3,rows:[
                {view: "text", label:"车辆类型",name:"vehicle_type", placeholder: "车辆类型",width:160,value:""},
                {view: "text", label:"发动机号码",name:"engine_no", placeholder: "发动机号码",width:160,value:""},
                {view: "datepicker",timepicker:false,format:"%Y-%m-%d 00:00:00", label:"发证日期",stringResult:true,name:"issue_date", placeholder: "发证日期",width:160,value:""},
                {view: "text", label:"车辆识别代号",name:"vin", placeholder: "车辆识别代码",value:""},
                {view: "text", label:"最后核对人",name:"last_modified_user_name", placeholder: "最后核对人", width:160,value:"",disabled:true}
            ]},
            driver_pic_ui
        ]},
        {view: "text", label:"品牌型号",name:"model", placeholder: "品牌型号",value:""},
        {view:"text",name:"address",label:"地址",placeholder: "地址"},
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 10,
            labelPosition:"top"
        },
        elements:elements,
        rules:{}
    };

    var button_ui = {margin:20,cols:[{},
        {view:"button",id:"rec_button",label:"图片识别",width:120,click:function(){
            recg_pic();
        }},
        {view:"button",label:"确定",width:80,click:function(){
        if (!$$("form_view").validate()){
            base.$msg.error("请输入正确的参数");
            return;
        }
        var formdata = $$("form_view").getValues();
        formdata.register_date=base.format_time(formdata.register_date);
        formdata.issue_date=base.format_time(formdata.issue_date);
        var action = "car_driving_license/update.json";
        base.postReq(action,formdata,function(){
            webix.message("行驶证数据提交成功");
            webix.$$("pop_win").close();
        });
        }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]
    };

    var init_data = function(car_id){
        $$("car_id").setValue(car_id);
        base.getReq("car/"+car_id+"/driving_license.json",function(data){
            data.register_date = base.format_date(data.register_date);
            data.issue_date = base.format_date(data.issue_date);
            data.car_id = car_id;
            $$("form_view").parse(data);
            $$("cover_img").parse(data.img);
        });
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"行驶证信息",
        body: {
            type:"space",
            rows:[from_ui,button_ui]
        }
    };

    return {
        $ui:win_ui,
        $init_data:init_data
    };
});
