/**
 * Created by wangwr on 2015/11/6.
 */

define(["views/modules/base",
        "views/menus/popup_menu",
        "views/windows/article_edit_win"],function(base,menu,form){

    var img_fomat = function(obj){
        var img = obj.article_img;

        if(obj.article_href === "#add"){
            return '<img src="'+img.thumbnail_url+'" class="content" ondragstart="return false"/>';
        }

        var html = "<div class='article-item'>"+"<img src='http://7xiqd8.com2.z0.glb.qiniucdn.com/FkMLHphH21gAY7hAvNj2r9LV5nGG/s1024.jpg'/>"
            +"<div class='article-bottom-content'><p><span>"+obj.article_title+"</span></p></div></div>";
        return html;
    };

    var img_list_ui = {
        view: "dataview",
        id: "img_view",
        css: "nav_list",
        select: true,
        scroll: true,
        drag:true,
        type: {width: 350, height: 260},
        template: img_fomat,
        on:{"onItemClick":function(id, e, node){
            var item = this.getItem(id);
            if(item.article_href==='#add'){
                webix.ui(form.$ui).show();
            }else{
                $$("pp_menu").show(e);
            }
        }}
    }

    var toolbar_ui = {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
        {view:"label", align:"left",label:"文章列表",height:30},

        {view:"segmented",id:"status_type", multiview:true,width:150, value:"enabled", options:[
            { value:"启用", id:'enabled' },
            { value:"停用", id:'disabled' },
            { value:"发布", id:'published' },
            { value:"隐藏", id:'unpublished' }]
        },
        { view: "button", type: "iconButton", icon: "sort-alpha-asc", label: "排序提交", width: 120, click: function(){
            //todo
            var list = $$("img_view").serialize();
            for(var a in list){
                if(list[a].link_href === '#add'){
                    list.splice(a,1);
                    break;
                }
            }
            base.postReq("generalize/sort.json",list,function(){
                base.$msg.info("排序更新成功");
            });

        }}
    ]};

    var layout = {
        rows:[
            toolbar_ui,img_list_ui
        ]
    };

    var refresh = function(){
        base.getReq("articles/"+$$("status_type").getValue()+".json",function(data){
            $$("img_view").clearAll();
            for(var a in data){
                $$("img_view").add(data[a]);
            }
            $$("img_view").add( {
                "article_href": "#add",
                "article_img": {
                    "thumbnail_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/QQ截图20151106142133.jpg"
                }
            });
        });
    };

    var menus = [
        {value:"edit",label:"基本信息",click:function(){
            webix.ui(form.$ui).show();
            var item = $$("img_view").getSelectedItem();
            form.$init_data(item);
        }},
        {value:"link_car_brand",label:"车 品 牌",click:function(){

        }}
    ];

    return{
        $ui:layout,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "商城管理", details: "推广信息"});
            setTimeout(function(){
                menu.$add_menus(menus);
            },500);
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
