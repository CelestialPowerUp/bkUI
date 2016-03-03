define(["views/modules/base"],function(base){



    var img_fomat = function(obj){
        var html = "<div class='article-item'>"+"<img src='"+obj.img_url+"'/>"
            +"<div class='article-bottom-content'><p><span>"+obj.brand_name+"</span></p></div></div>";
        return html;
        //return '<img src="'+obj.img_url+'" class="content" ondragstart="return false"/>';
    };

    var button_ui = {margin:10,cols:[{},
        {view:"button",label:"全选",width:80,click:function(){
            $$("car_brand_list_view").selectAll();
        }},
        {view:"button",label:"反选",width:80,click:function(){
            var ui = $$("car_brand_list_view");
            var items = ui.serialize();
            var selects = [];
            for(var i in items){
                if(ui.isSelected(items[i].id)){
                    continue;
                }
                selects.push(items[i].id);
            }
            if(selects.length===0){
                ui.unselectAll();
            }else{
                ui.select(selects);
            }
        }},
        {view:"button",label:"确定",width:80,click:function(){
            webix.$$("pop_win").close();
        }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("pop_win").close();
        }}]
    };

    var init_data = function(obj){
        base.getReq("meta_brands.json",function(datas){
            console.log(datas);
            $$("car_brand_list_view").parse(datas);
        });
    };

    var brand_list_ui = {
        view: "dataview",
        id: "car_brand_list_view",
        css: "nav_list",
        select: true,
        multiselect:true,
        scroll: true,
        xCount:5,
        yCount:3,
        type: {width: 150, height: 100},
        template: img_fomat
    }


    var win_ui = {
        view:"window",
        modal:true,
        id:"pop_win",
        position:"center",
        head:"文章关联车品牌选择",
        body: {
            type:"space",
            rows:[brand_list_ui,
                {type:"space",
                    cols:[
                        {view: "icon", icon: "fa fa-exclamation-triangle"},
                        {view:"label", align:"left",css:"warning", label:"温馨提示：按住Ctrl键即可实现多选"}
                    ]
                },button_ui]
        }
    };

    var callBack = null;

    return {
        $ui:win_ui,
        $init_data:init_data,
        $addCallBack:function(func){
            if(typeof func === 'function'){
                callBack = func;
            }
        }
    };
});
