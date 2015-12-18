/**
 * Created by wangwr on 2015/11/6.
 */

define(["views/modules/base",
        "views/menus/popup_menu",
        "views/windows/generalize_edit_win"],function(base,menu,form){

    var img_fomat = function(obj){
        var img = obj.title_img_view;
        return '<img src="'+img.thumbnail_url+'" class="content" ondragstart="return false"/>';
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
            if(item.link_href==='#add'){
                webix.ui(form.$ui).show();
            }else{
                $$("pp_menu").show(e);
            }
        }}
    }

    var toolbar_ui = {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
        {view:"label", align:"left",label:"推广列表",height:30},
        {view: "richselect",id:"generalize_code",label:"类型:",labelWidth:60,value:"banners",options:[
            {id:"banners",value:"头部"},
            {id:"good_suggest",value:"精品推荐"}
        ],placeholder:"推广类型",width:250},
        {view:"segmented",id:"status_type", multiview:true,width:150, value:"enabled", options:[
            { id:"enabled", value:"启用" }, // the initially selected segment
            { id:"disabled", value:"停用" }]
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
        base.getReq("/v2/api/home/"+$$("generalize_code").getValue()+"/"+$$("status_type").getValue(),function(data){
            $$("img_view").clearAll();
            for(var a in data){
                $$("img_view").add(data[a]);
            }
            $$("img_view").add( {
                "link_href": "#add",
                "title_img_view": {
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
            webix.$$("title").parse({title: "商城管理", details: "推广信息"});
            menu.$add_menus(menus);
            form.$addCallBack(function(){
                refresh();
            });
            $$("generalize_code").attachEvent("onChange", function(newv, oldv){
                refresh();
            });
            $$("status_type").attachEvent("onChange", function(newv, oldv){
                refresh();
            });
            refresh();
        }
    }
});
