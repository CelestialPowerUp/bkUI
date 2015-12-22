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
                        base.postReq("topic/delete.json?topic_id="+item.topic_id,"",function(data){
                            base.$msg.info("资源删除成功！");
                            refresh_table();
                        });
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
        {id:"status", header:"状态",width:80,fillspace:false,template:function(obj){
            if(obj.status === 'enabled'){
                return "<span class='status status1'>激活</span>";
            }else{
                return "<span class='status status0'>停用</span>";
            }}
        },
        {header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-pencil' title='卡包编辑'>编辑</span>"},
        {header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-times trash' title='删除卡包'>删除</span>"}
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

    var layout = {
        paddingX:15,
        paddingY:15,
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"主题列表",height:30},
                { view: "button", type: "iconButton", icon: "plus", label: "主题列表", width: 135, click: function(){
                    //todo
                    this.$scope.show("/topic_edit");
                }},
                {view:"segmented",id:"status_type", multiview:true,width:150, value:"enabled", options:[
                    { id:"enabled", value:"启用" }, // the initially selected segment
                    { id:"disabled", value:"停用" }]
                }
            ]},
            {margin:15, type:"clean", rows:[table_ui]}
        ]
    };


    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("topics/"+$$("status_type").getValue()+".json",function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        })
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "优惠券管理", details: "优惠券卡包摸版"});
            $$("status_type").attachEvent("onChange", function(newv, oldv){
                refresh_table();
            });
            refresh_table();
        }
    }
});