/**
 * Created by wangwr on 2015/11/6.
 */

define(["views/modules/base",
        "views/menus/popup_menu",
        "views/forms/advertisement_form"],function(base,menu,form){

    var img_fomat = function(obj){
        var img = obj.bg_img_view;
        return '<img src="'+img.thumbnail_url+'" class="content" ondragstart="return false"/>';
    };

    var img_list_ui = {
        view: "dataview",
        id: "img_view",
        css: "nav_list",
        select: true,
        scroll: true,
        type: {width: 350, height: 260},
        template: img_fomat,
        on:{"onItemClick":function(id, e, node){
            var item = this.getItem(id);
            if(item.link_href==='#add'){
                webix.ui(form.$ui).show();
            }else{
                $$("pp_menu").show(e);
            }
        }}
    }

    var toolbar_ui = {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
        {view:"label", align:"left",label:"广告弹窗编辑",height:30},
        {view:"segmented",id:"status_type", multiview:true, value:"enable", options:[
            { id:"enable", value:"启用" }, // the initially selected segment
            { id:"disabled", value:"停用" }]
        }
    ]};

    var layout = {
        rows:[
            toolbar_ui,img_list_ui
        ]
    };

    var refresh = function(){
        $$("img_view").clearAll();
        base.getReq("advertisement/"+$$("status_type").getValue()+".json",function(data){
            for(var a in data){
                $$("img_view").add(data[a]);
            }
            $$("img_view").add( {
                "link_href": "#add",
                "bg_img_view": {
                    "thumbnail_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/QQ截图20151106142133.jpg"
                }
            });
        });
    };

    var menus = [
        {value:"edit",label:"编辑",click:function(){
            webix.ui(form.$ui).show();
            var item = $$("img_view").getSelectedItem();
            form.$init_data(item);
        }}
    ];

    return{
        $ui:layout,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "商城管理", details: "广告弹窗"});
            //scope.ui(menu.$ui);
            menu.$add_menus(menus);
            form.$addCallBack(function(){
                refresh();
            });
            $$("status_type").attachEvent("onChange", function(newv, oldv){
                refresh();
            });
            refresh();
        }
    }
});
