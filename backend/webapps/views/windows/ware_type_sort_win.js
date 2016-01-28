define(["views/modules/base"],function(base){
    
    var ware_type_item_format = function(obj){
        return "<div class='title-content'><span>"+obj.indexNo+"</span><label>"+obj.sub_name+"</label></div>";
    };

    var ware_type_list_ui = {
        width:800,
        height:400,
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"单品分类",height:30}
            ]},
            {
                view: "dataview",
                id: "ware_type_list",
                css: "movies",
                select: false,
                scroll: true,
                drag:true,
                type: {width:260,height: 60},
                template: ware_type_item_format,
                data:[]
            }
        ]
    };

    var button_ui = {margin:20,cols:[{},
        { view: "button", type: "iconButton", icon: "sort-alpha-asc", label: "提交排序", width: 120, click: function(){
            //todo
            var types = $$("ware_type_list").serialize();
            base.postReq("/v2/api/store/wares/type/sort.json",types,function(data){
                base.$msg.info("排序处理成功");
                init_data();
            });
        }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]
    };
    
    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"单品分类排序",
        body: {
            type:"space",
            rows:[ware_type_list_ui,button_ui]
        }
    };

    var init_data = function(){
        base.getReq("/v2/api/store/wares/types.json",function(types){
            $$("ware_type_list").clearAll();
            $$("ware_type_list").parse(types);
        });
    };

    return {
        $ui:win_ui,
        $init_data:init_data
    };
});
