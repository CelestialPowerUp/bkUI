define(["views/modules/base",
    "views/windows/app_win"],function(base,app_win){

    app_win.$add_call_back(function(){
        refresh_table();
    });

    var on_event = {
        "fa-pencil":function(e, id){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(app_win.$ui).show();
            app_win.$init_data(item.id);
        },
        "fa-arrow-circle-up":function(e, id){
            webix.confirm({
                text:"上线该文案<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        var item = $$("table_list").getItem(id);
                        base.postReq("coupon_share/"+item.coupon_share_id+"/online.json","",function(){
                            base.$msg.info("修改成功");
                            refresh_table();
                        });
                    }
                }
            });
        },
        "download":function(){}
    };

    var elements = [
        {id:"id",header:"ID",width:50},
        {id:"app_name",header:"包名",width:240},
        {id:"app_version", header:"版本",width:70},
        {id:"os_type", header:"操作系统",width:90},
        {id:"create_time", header:"创建时间",width:140,format:base.$show_time},
        {id:"enable", header:"是否有效",width:90,template:function(obj){
            if(obj.enable === false){
                return "<span class='status status0'>未启用</span>"
            }
            return "<span class='status status1'>已启用</span>";
        }},
        {id:"description", header:"说明",width:350,fillspace:true},
        {id:"download", header:"下载", width:60, template:function(obj){
            if(obj.attachment_id && obj.attachment_view && obj.attachment_view.raw_url){
                return "<a class='status status2 webix_icon fa-download a-link' href='"+obj.attachment_view.raw_url+"' target='_blank'></a>"
            }
            return "";
        }},
        {id:"edit", header:"编辑", width:60, template:"<span class='status status1 webix_icon fa-pencil a-link ' title='编辑'></span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoheight:false,
      //  autoConfig:true,
        hover:"myhover",
      //  rightSplit:1,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "新建应用包", width: 135, click: function(){
                //todo
                this.$scope.ui(app_win.$ui).show();
                app_win.$init_data();
            }},
            {}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("/v1/api/app_packages.json",function(data){
            console.log(data);
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "应用管理", details: "应用列表"});
            refresh_table();
        }
    }
});