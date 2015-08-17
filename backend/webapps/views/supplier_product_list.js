define(["views/modules/base",
    "views/forms/supplier_product"],function(base,supplier_product){

    var supplier_id = null;

    var on_event = {
        "onAfterEditStop":function(state, editor, ignoreUpdate){
            var item = $$("table_list").getItem(editor.row);
            base.postReq("/v2/api/supplier_product/update.json",item,function(data){
                base.$msg.info("信息修改成功");
            });
        },
        "fa-trash-o":function(e, id, node){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        var formdata = {};
                        formdata.supplier_id = supplier_id;
                        formdata.product_ids = [item.product_id];
                        base.postReq("/v2/api/supplier_product/delete.json",formdata,function(data){
                            base.$msg.info("记录删除成功");
                            $$("table_list").remove(id);
                        });
                    }
                }
            });
        }
    };

    var elements = [
        {id:"trash", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='删除' class='webix_icon fa-trash-o'></span>"},
        {id:"supplier_id",header:"ID",hidden:true,width:80},
        {id:"product_id",header:"ID",hidden:true,width:80},
        {id:"supplier_product_name", header:["商品名称", {content:"textFilter"} ],minWidth:350,fillspace:true},
        {id:"supplier_price", header:"商品价格",minWidth:350,editor:"text",fillspace:true}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:true,
        rowHeight:35,
        autoheight:false,
        editable:true,
        editaction:"dblclick",
        hover:"myhover",
        leftSplit:1,
        columns:elements,
        data:[],
        onClick:on_event,
        on:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "backward", label: "返回列表", width: 120, click: function(){
                //todo
                this.$scope.show("/supplier_list");
            }},
            { view: "button", type: "iconButton", icon: "plus", label: "添加商品", width: 120, click: function(){
                //todo
                if(supplier_id===null || supplier_id === ''){
                    base.$msg.error("请选择一个服务商");
                    return;
                }
                this.$scope.ui(supplier_product.$ui).show();
                supplier_product.$init_data($$("table_list").serialize());
                supplier_product.$add_callback(function(data){
                    var formdata = {};
                    formdata.supplier_id = supplier_id;
                    formdata.product_ids = [];
                    for(var i=0;i<data.length;i++){
                        formdata.product_ids.push(data[i].product_id);
                    }
                    base.postReq("/v2/api/supplier_product/add.json",formdata,function(data){
                        refresh_table();
                        base.$msg.info("商品添加成功");
                    });
                });
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
        if(supplier_id===null || supplier_id === ''){
            base.$msg.error("请选择一个服务商");
            return;
        }
        base.getReq("/v2/api/supplier_product_list.json/"+supplier_id,function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "服务商列表"});
            supplier_id = base.get_url_param("id");
            refresh_table();
        }
    }
});