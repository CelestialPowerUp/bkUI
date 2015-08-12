/**
 * 车系列表
 */

define([
    "views/modules/base",
    "views/forms/meta_car_category",
    "views/modules/table_page"
], function(base,form_win,table_page){

    //品牌下拉列表
    var car_brand_type_select = function(){
        base.getReq("meta_brands.json",function(brands){
            var list = $$("car_brand_type").getPopup().getList();
            list.clearAll();
            //$$("car_brand_type").setValue();
            for(var i=0;i<brands.length;i++){
                list.add({id:brands[i].brand_type,value:brands[i].brand_name});
            }
        });
    };

    //搜索属性
    var cur_page = 1;
    var search_brand_type = null;

    var search = function(page){
        if(typeof(page)!='undefined'){
            cur_page = page;
        }
        var key = $$("search").getValue();
        var url = "meta_categories.json?page="+cur_page+"&size=18&key="+key;
        if(search_brand_type){
            url+="&brand_type="+search_brand_type;
        }
        base.getReq(url,function(data){
            parse_table_data(data);
        });
    };

    var page_call_back = function(page){
        console.log("点击了第"+page+"页");
        search(page);
    };

    var parse_table_data = function(pages){
        var items = pages.items;
        $$("data_list").clearAll();
        for(var i=0;i<items.length;i++){
            $$("data_list").add(items[i]);
        }
        table_page.$update_page_items(pages);
        table_page.$add_page_callback(page_call_back);
    };

    var button_ui = {height:40,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "添加车系", width: 110, click: function(){
                this.$scope.ui(form_win.$ui).show();
                form_win.$set_req_url("meta_category/create.json");
                form_win.$add_submit_callback(function(){
                    search(1);
                });
            }},
            {view: "richselect", name: "car_brand_type",id:"car_brand_type",width:150,options:[],placeholder:"选择品牌",
                on:{"onAfterRender":function(){
                    car_brand_type_select();
                },
                "onChange":function(brand_type){
                    search_brand_type = brand_type;
                    search(1);
                }}
            },
            {view:"search",id:"search",width:250,placeholder:"输入车系名称"},
            { view: "button", type: "iconButton",icon:"search",label: "查询", width: 80, click: function(){
                    search(1);
            }}
        ]
    };

    var onClick = {
        "edit":function(e,id,node){
            var item = this.getItem(id);
            this.$scope.ui(form_win.$ui).show();
            form_win.$bind_data(item);
            form_win.$set_req_url("meta_category/update.json");
            form_win.$add_submit_callback(function(){
                search();
            });
        },
        "delete":function(e,id,node){
            var item = this.getItem(id);
            webix.confirm({
                text:"确定删除该数据<br/> 确定?", ok:"是", cancel:"取消",
                callback:function(res){
                    if(res){
                        base.postForm("meta_category/delete.json",{type:item.category_type},function(data){
                            search(1);
                        });
                    }
                }
            });
        }
    };

    var data_table = {
        id:"data_list",
        view:"datatable",
        select:false,
        autoheight:true,
        autowidth:true,
        hover:"myhover",
        onClick:onClick,
        columns:[
            {id:"category_type", header:"ID", width:50,hidden:true},
            {id:"brand_type",header:"brand_type",width:50,hidden:true},
            {id:"brand_name", header:"品牌", width:250},
            {id:"category_name", header:"车系", width:250},
            {id:"trash", header:"操作", width:180, template:"<span><u class='edit row_button'> 编辑</u><u class='delete row_button'> 删除</u></span>"}
        ]
    };

    var list_ui = table_page.$create_page_table(data_table);

    var layout = {
        type:"space",
        rows:[button_ui,list_ui]
    };

    return {
        $ui: layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "车系管理", details: "车系列表"});
            search(1);
        }
    };

});