define(["views/modules/base",
    "views/forms/store_form",
    "views/forms/store_type_form",
    "models/base_data",
    "views/windows/ware_type_sort_win"],function(base,store_form,store_type_form,base_data,ware_type_sort_win){

    var on_event = {
        "fa-trash-o":function(e, id, node){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该单品<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        base.postForm("/v2/api/store/ware/delete.json",{ware_id:item.ware_id},function(data){
                            webix.$$("table_list").remove(id);
                            base.$msg.info("删除资源成功");
                        });
                    }
                }
            });
        },
        "fa-pencil":function(e, id, node){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(store_form.$ui).show();
            store_form.$init_data(item.ware_id,item.ware_type_code);
            store_form.$add_submit_callback(function(){
                refresh_table();
            });
        }
    };

    var elements = [
        {id:"ware_id",width:50,header:"ID"},
        {id:"cover_img", header:"关联单品",template:function(ware){
            return "<img style='width:100px;height:100%;padding:0px 5px; display:block; float:left;' src='"+ware.cover_img.thumbnail_url+"'>";
        },css:"noPadding",width:130},
        {id:"ware_name", header:"单品名称",minWidth:250,fillspace:true},
        {id:"ware_type_name", header:"单品类别",minWidth:120,fillspace:true},
        {id:"product_name", header:"关联商品",minWidth:250,fillspace:true},
        {id:"ware_full_price",header:"市场价",format:base.priceFormat, minWidth:125,fillspace:true},
        {id:"ware_mark_price", header:"养爱车价",format:base.priceFormat, minWidth:125,fillspace:true},
        {id:"ware_status", header:"状态", width:80,template:function(obj){
            if(obj.ware_status === "up_shelves"){
                return "<span class='status status1'>上架</span>";
            }else{
                return "<span class='status status0'>下架</span>";
            }}
        },
        {header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-pencil' >编辑</span>"},
        {header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-trash-o' >删除</span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        drag:true,
        rowHeight:85,
        hover:"myhover",
        columns:elements,
        data:[],
        onClick:on_event
    }

    var check = function(check){
        return '<span class="webix_icon_btn fa-check-square-o list_icon" style="max-width:32px;"></span>'
    };

    var filter_ui = {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
        {view:"label", align:"left",label:"主题列表",height:30},
        {view: "richselect", id:"type_code",name:"type_code",options:base_data.ware_type_options,label:"单品分类",placeholder:"请选择单品类别",value:"",width:250,
            on:{
                onChange:function(newv,oldv){
                    $$("sub_type_code").setValue("");
                    base.getReq("/v2/api/store/ware_type_list.json?ware_type_code="+$$("type_code").getValue(),function(data){
                        var list = $$("sub_type_code").getPopup().getList();
                        list.clearAll();
                        for(var i=0;i<data.length;i++){
                            list.add({id:data[i].ware_type_id,value:data[i].sub_name});
                        }
                        if(data.length>0){
                            $$("sub_type_code").setValue(data[0].ware_type_id);
                        }
                    });
                }
            }
        },
        {view: "richselect", id:"sub_type_code",name:"sub_type_code",options:[],label:"二级分类",placeholder:"请选择二级类别", width:250,
            on:{
                onChange:function(newv,oldv){
                    refresh_table();
                }
            }
        },
        { view: "button", type: "iconButton", icon: "plus", label: "添加单品", width: 120, click: function(){
            this.$scope.ui(store_form.$ui).show();
            store_form.$init_data(null,$$("type_code").getValue());
            store_form.$add_submit_callback(function(){
                refresh_table();
            });
        }},
        { view: "button", type: "iconButton", icon: "plus", label: "单品分类", width: 120, click: function(){
            this.$scope.ui(store_type_form.$ui).show();
            store_type_form.$add_submit_callback(function(){

            });
        }},
        { view: "button", type: "iconButton", icon: "sort-alpha-asc", label: "单品排序", width: 120, click: function(){
            //todo
            var list = $$("table_list").serialize();
            base.postReq("/v2/api/store/wares/sort.json",list,function(data){
                base.$msg.info("单品排序成功");
            });
        }},
        { view: "button", type: "iconButton", icon: "sort-alpha-asc", label: "分类排序", width: 120, click: function(){
            //todo
            webix.ui(ware_type_sort_win.$ui).show();
            ware_type_sort_win.$init_data();
        }}
    ]};

    var layout = {
        paddingY:15,
        paddingX:15,
        rows:[filter_ui,table_ui]
    };

    var refresh_table = function(){
        var sub_type_code = $$("sub_type_code").getValue();
        if(sub_type_code){
            base.getReq("/v2/api/store/wares/"+sub_type_code,function(ware_list){
                $$("table_list").clearAll();
                $$("table_list").parse(ware_list);
            });
        }
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "商城管理", details: "单品列表"});
        }
    }
});