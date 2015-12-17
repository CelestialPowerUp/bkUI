define(["views/modules/base",
    "views/modules/table_page_m"],function(base,table_page){

    var on_event = {
        "fa-times":function(e, id){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源

                    }
                }
            });
        },
        "fa-pencil":function(e, id){
            var item = $$("table_list").getItem(id);
            //编辑优惠券卡包
            this.$scope.show("/topic_edit:id="+item.topic_id);
        }
    };

    var elements = [
        {id:"topic_id",header:"ID",width:80},
        {id:"topic_name", header:"主题名称",width:200,fillspace:true},
        {id:"edit", header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-pencil' title='卡包编辑'>编辑</span>"},
        {id:"delete", header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-times trash' title='删除卡包'>删除</span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoheight:true,
        hover:"myhover",
        rightSplit:2,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "主题列表", width: 135, click: function(){
                //todo
                this.$scope.show("/topic_edit");
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
        base.getReq("topics/enabled.json",function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        })
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "优惠券管理", details: "优惠券卡包摸版"});
            refresh_table();
        }
    }
});