define(["views/modules/base"],function(base){

    var submit_control_ui = {
        cols:[
            {view:"button",value:"提交",click:function(){
                var fomdata = $$("form_view").getValues()
                var action = "";
                if(fomdata.channel_id === ""){//新增
                    action = "channel/create.json";
                }else{//更新
                    action = "channel/update.json";
                }
                base.postReq(action,fomdata,function(data){
                    base.$msg.info("数据提交成功");
                });
            }}
        ]
    };

    var item_list_type = {
        height: 30,
        check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
        template: function(obj,type){
            return "<div>"+type.check(obj)+"<span class='list_text'>"+obj.sub_channel_name+"</span></div>";
        }
    };

    var item_list = {
        view: "list",
        css: "tasks_list",
        id:"item_list",
        height:150,
        width:150,
        type: item_list_type,
        data: [],
        on: {
            onItemClick:function(id){
                var item = this.getItem(id);
                item.$check = !item.$check;
                this.refresh(id);
            }
        }
    };

    var er_wei_ma_list = {
        rows:[
            {view:"label",label:"选择二维码渠道"},
            item_list
        ]
    }

    var elements = [
        {view:"text",id:"channel_id",name:"channel_id",hidden:true},
        {view: "text", label:"渠道名称",name:"channel_name", placeholder: "请输入渠道名称",width:350,value:""},
        { view:"checkbox", label:"是否有效",name:"disabled",checkValue:false, uncheckValue:true},
        er_wei_ma_list
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 80
        },
        elements:elements
    };

    var button_ui = {margin:20,cols:[{},{view:"button",label:"确定",width:80,click:function(){
        var datas = $$("item_list").serialize();
        var formdata = $$("form_view").getValues();
        formdata.sub_channels = [];
        delete formdata.create_time;
        delete formdata.last_modified_time;
        for(var i=0;i<datas.length;i++){
            if(datas[i]['$check']){
                delete datas[i].$check;
                delete datas[i].id;
                formdata.sub_channels.push(datas[i]);
            }
        }
        base.postReq("channel/update.json",formdata,function(){
            webix.message("数据更新成功");
            if(typeof(submit_call_back)==='function'){
                submit_call_back();
            }
        });
        webix.$$("pop_win").close();
    }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]};

    var parse_form_data = function(data){
        $$("form_view").parse(data);
    };

    var init_list_items = function(chose){
        base.getReq("sub_channels.json",function(data){
            for(var i=0;i<data.length;i++){
                $$("item_list").add(checkItems(data[i],chose));
            }
        });
    };

    var checkItems = function(obj,arr){
        for(var i=0;i<arr.length;i++){
            if(obj.sub_channel_code === arr[i].sub_channel_code){
                obj.$check = true;
                break;
            }
        }
        return obj;
    };

    var init_data = function(id){
        if(typeof(id) === 'undefined' || id === null){
            init_list_items([]);
            return;
        }
        base.getReq("channel.json/"+id,function(data){
            parse_form_data(data);
            init_list_items(data.sub_channels);
        });
    };

    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"编辑渠道",
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
