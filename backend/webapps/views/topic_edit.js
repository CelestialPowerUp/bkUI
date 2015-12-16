define(["views/modules/base",
    "views/menus/popup_menu",
    "views/modules/upload",
    "views/windows/topic_block_edit_win"],function(base,menu,upload,topic_block){

    var item_fomat = function(obj){
        return "<div class='overall'>" +
            "<div class='items'><label>卡包项名：</label><span>"+obj.coupon_package_item_name+"</span><label>过期时间：</label><span>"+obj.expired_time+"天</span></div>"+
            "<div class='items'><label>关联类型：</label><span>"+obj.link_type_text+"</span><label>关联项：</label><span>"+obj.link_info+"</span></div>"+
            "<div class='items'><label>优惠类型：</label><span>"+obj.discount_type_text+"</span><label>优惠值：￥</label><span>"+obj.discount_value+"</span></div>"+
            "</div>";
    };

    var note_ui = {
        cols:[
            { view: "icon", icon: "fa fa-exclamation-triangle"},
            {view:"label", align:"left",css:"warning", label:"提交后的卡包项支持编辑但不支持删除，请确认后再提交数据！！！",height:30}
        ]
    };

    var topic_block_list_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"主题列表块",height:30},
                note_ui,
                { view: "button", type: "iconButton", icon: "plus", label: "新增列表块", width: 135, click: function(){
                    //todo
                    webix.ui(topic_block.$ui).show();

                }}
            ]},
            {
                view: "dataview",
                id: "topic_block_list",
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

    var img_fomat = function(obj){
        if(typeof obj.thumbnail_url === 'undefined' || obj.thumbnail_url === ""){
            return '<img src="http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF" class="content" ondragstart="return false"/>';
        }
        return '<img onclick="window.open(\''+obj.raw_url+'\')" src="'+obj.thumbnail_url+'" class="content" ondragstart="return false"/>';
    };

    var form_elements = [
        {view:"text",id:"topic_id",name:"topic_id",hidden:true},
        {view:"text",name:"topic_name",label:"主题名称",placeholder: "输入主题名称",required:true},
        { view:"radio", name:"status", label:"主题状态",value:"disabled", width:350,required:true,options:[
            { value:"启用", id:'enabled' },
            { value:"停用", id:'disabled' }
        ]},
        {view:"text",id:"header_img_id",name:"header_img_id",hidden:true},
        {height:150,width:400,id:"header_img",template:img_fomat},
        {height:25,borderless:true,template:"<a id='cover_img_pickfiles' style='padding-left: 150px' href='javascript:;'>[上传头图]</a>",
            on:{"onAfterRender":function(){
                upload.$bind_upload("cover_img_pickfiles",function(data){
                    if(data.code==='00000'&&data.data!=null){
                        var item = data.data;
                        item.img_id = item.id;
                        $$("header_img").parse(item);
                        $$("header_img_id").setValue(item.img_id);
                    }
                });
            }}
        }
    ]

    var form_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"主题基本信息",height:30}
            ]},
            {
                id:"form_view",
                view:"form",
                elementsConfig:{
                    labelWidth: 80,
                    width:250,
                    labelPosition:"left"
                },
                rows:form_elements
            }
        ]
    }

    var submit_data = function(){
        if (!$$("form_view").validate()){
            base.$msg.error("请输入正确的参数");
            return;
        }
        //基本数据
        var formdata = $$("form_view").getValues();
        var action = "topic/update.json";
        if(formdata.topic_id.length===0){
            action = "topic/create.json";
        }
        base.postReq(action,formdata,function(backdata){
            base.$msg.info("数据提交成功");
        });
    }


    var button_ui = {margin:20,cols:[{},
        {view:"button",label:"确定",width:120,click:function(){
            webix.confirm({
                text:"确定提交修改<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        submit_data();
                    }
                }
            });

        }}]
    };

    var win_ui = {
            type:"space",
            cols:[topic_block_list_ui,
                {margin:15,rows:[form_ui,button_ui,{}]}
            ]
        };

    var menus = [
        {value:"edit",label:"编辑",click:function(){
            webix.ui(item_form.$ui).show();
            var item = $$("topic_block_list").getSelectedItem();
            item_form.$addCallBack(function(data){
                for(var a in data){
                    if(typeof data[a] === 'function'){
                        continue;
                    }
                    item[a] = data[a];
                }
                $$("topic_block_list").refresh();
            });
            item_form.$init_data(item);
        }},
        {value:"edit",label:"删除",click:function(){
            var item = $$("topic_block_list").getSelectedItem();
            if(item.coupon_package_item_id===''){
                $$("topic_block_list").remove($$("topic_block_list").getSelectedId());
            }else{
                base.$msg.error("该项已提交后台暂时不支持删除");
            }
        }}
    ];

    var pars_data = function(data){
        $$("form_view").parse(data);
        $$("header_img").parse(data.header_img);
        /*$$("topic_block_list").clearAll();
        $$("topic_block_list").parse(data.package_items);*/
    }

    var init_data = function(){
        var id = base.get_url_param("id")
        id = 1;
        if(id){
            base.getReq("topic/"+id,function(data){
                console.log(data);
                pars_data(data);
            });
        }
    }

    return {
        $ui:win_ui,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "优惠券管理", details: "优惠券卡包编辑"});
            menu.$add_menus(menus);
            init_data();
        }
    };
});