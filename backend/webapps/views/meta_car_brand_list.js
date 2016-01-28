/**
 * 车辆品牌管理
 */

define([
    "views/modules/base",
    "views/forms/meta_car_brand",
    "views/modules/table_page"
], function(base,car_brand,table_page){

    var cur_page = 1;

    var search = function(page){
        if(typeof(page)!='undefined'){
            cur_page = page;
        }
        var search_value = $$("search").getValue();
        base.getReq("meta_brands.json?page="+cur_page+"&size=5&key="+search_value,function(data){
            parse_table_data(data);
        });
    };

    var page_call_back = function(page){
        console.log("点击了第"+page+"页");
        search(page);
    };

    var parse_table_data = function(pages){
        var items = pages.items;
        $$("product_list").clearAll();
        for(var i=0;i<items.length;i++){
            $$("product_list").add(items[i]);
        }
        table_page.$update_page_items(pages);
        table_page.$add_page_callback(page_call_back);
    };

    var button_ui = {height:40,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "添加品牌", width: 110, click: function(){
                this.$scope.ui(car_brand.$ui).show();
                car_brand.$set_req_url("meta_brand/create.json");
                car_brand.$add_submit_callback(function(){
                    search(1);
                });
            }},
            {view:"search",id:"search",width:250,placeholder:"输入品牌名称",click:function(){
                search(1);
            }}
        ]
    };

    var onClick = {
        "edit":function(e,id,node){
            var item = this.getItem(id);
            this.$scope.ui(car_brand.$ui).show();
            car_brand.$bind_data(item);
            car_brand.$set_req_url("meta_brand/update.json");
            car_brand.$add_submit_callback(function(){
                search();
            });
        },
        "delete":function(e,id,node){
            var item = this.getItem(id);
            webix.confirm({
                text:"确定删除该数据<br/> 确定?", ok:"是", cancel:"取消",
                callback:function(res){
                    if(res){
                        base.postForm("meta_brand/delete.json",{type:item.brand_type},function(data){
                            search(1);
                        });
                    }
                }
            });
        }
    };

    var product_data_table = {
        id:"product_list",
        view:"datatable",
        select:false,
        autoheight:true,
        autowidth:true,
        rowHeight:100,
        hover:"myhover",
        onClick:onClick,
        columns:[
            {id:"brand_type", header:"ID", width:50,hidden:true},
            {header:"图标", template:"<img style='width:100%;height:100%;' src='#img_url#'>", width:150, css:"noPadding"},
            {id:"brand_name", header:"品牌", width:250},
            {id:"trash", header:"操作", width:180, template:"<span><u class='edit row_button'> 编辑</u><u class='delete row_button'> 删除</u></span>"}
        ]
    };

    var product_list_ui = table_page.$create_page_table(product_data_table);

    var layout = {
        type:"space",
        rows:[button_ui,product_list_ui]
    };

    return {
        $ui: layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "车辆品牌管理", details: "品牌列表"});
            search(1);
        }
    };

});