define(["views/modules/base",
    "views/modules/table_page_m"],function(base,table_page){

    var cur_page = 1;

    var on_event = {
        "fa-trash-o":function(e, id, node){
            var item = $$("table_list").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                    }
                }
            });
        },
        "fa-pencil":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商
            this.$scope.show("/supplier_edit:id="+item.supplier_id);
        },
        "fa-list-ul":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商
            this.$scope.show("/supplier_product_list:id="+item.supplier_id);
        }
    };

    var elements = [
        {id:"edit", header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='编辑' class='webix_icon fa-pencil'></span>"},
        {id:"product_manager", header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='商品管理' class='webix_icon fa-list-ul'></span>"},
        {id:"user_manager", header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='用户管理' class='webix_icon fa-user-md'></span>"},
        {id:"supplier_id",header:"ID",width:80},
        {id:"name", header:"名称",minWidth:350,fillspace:true},
        {id:"address", header:"地址",minWidth:350,fillspace:true},
        {id:"phone", header:"电话",width:185,fillspace:false,template:function(obj){
            var result = "";
            if(obj.mobile_number!==null&&obj.mobile_number!==''){
                result = "<span class='status status1'>"+obj.mobile_number+"</span>";
            }
            if(obj.phone_number!==null&&obj.phone_number!==''){
                result = result+" <span class='status status1'>"+obj.phone_number+"</span>";
            }
            return result;
        }},
        {id:"layoff", header:"状态",width:80,fillspace:false,template:function(obj){
            if(obj.layoff === false){
                return "<span class='status status1'>接单中</span>";
            }else{
                return "<span class='status status0'>停业中</span>";
            }}
        }
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoheight:true,
        hover:"myhover",
        leftSplit:3,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "添加服务商", width: 135, click: function(){
                //todo
                this.$scope.show("/supplier_edit");
            }},
            {}
        ]
    };

    var table_page_ui = table_page.$create_page_table("table_page_list",table_ui);

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[filter_ui,table_page_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("/v2/api/meta_supplier_list.json?page="+cur_page+"&size=15",function(data){
            $$("table_list").clearAll();
            $$("table_list").parse(data.items);
            table_page.$update_page_items("table_page_list",data);
            table_page.$add_page_callback(function(page){
                cur_page = page;
                refresh_table();
            });
        })
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "服务商列表"});
            refresh_table();
        }
    }
});