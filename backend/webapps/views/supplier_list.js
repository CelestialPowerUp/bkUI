define(["views/modules/base",
    "views/modules/table_page_m",
    "views/forms/supplier_type",
    "views/windows/supplier_coupon_package_win",
    "views/windows/supplier_product_win"],function(base,table_page,supplier_type,coupon_package,supplier_product){

    var cur_page = 1;

    var layoff_type = "false";

    var search_keys = "";

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
        "fa-check-circle":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商类型
            this.$scope.ui(supplier_type.$ui).show();
            supplier_type.$init_data(item.supplier_id);
        },
        "fa-list-ul":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商管理人员
            if(item.supplier_mold!=='comprehensive'){
                this.$scope.ui(supplier_product.$ui).show();
                supplier_product.$init_data(item.supplier_id);
                return;
            }
            base.$msg.error("综合店不支持该服务");
        },
        "fa-credit-card":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑次卡商品
            if(item.supplier_mold!=='comprehensive'){
                this.$scope.show("/supplier_times_card_list:id="+item.supplier_id);
                return;
            }
            base.$msg.error("综合店不支持该服务");
        },
        "fa-user-md":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商管理人员
            if(item.supplier_mold!=='comprehensive'){
                this.$scope.show("/supplier_user_list:id="+item.supplier_id);
                return;
            }
            base.$msg.error("综合店不支持该服务");
        },
        "fa-gift":function(e, id, node){
            var item = $$("table_list").getItem(id);
            //编辑服务商管理人员
            if(item.supplier_mold!=='comprehensive'){
                this.$scope.ui(coupon_package.$ui).show();
                coupon_package.$init_data(item.supplier_id);
                return;
            }
            base.$msg.error("综合店不支持该服务");
        }
    };

    var elements = [
        {id:"supplier_id",header:"ID",width:80},
        {id:"name", header:"名称",minWidth:300,fillspace:true},
        {id:"supplier_mold", header:"服务类型",width:80,fillspace:false,template:function(obj){
            if(obj.supplier_mold === 'community'){
                return "<span class='status status1'>社区店</span>";
            }else if(obj.supplier_mold === 'self_support'){
                return "<span class='status status1'>自营店</span>";
            }else{
                return "<span class='status status0'>综合店</span>";
            }}
        },
        {id:"address", header:"地址",minWidth:300,fillspace:true},
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
        },
        {header: "图片", width: 100, template: "<img src='#attachments_id[0].thumbnail_url#' width='80px' height='48px' style='margin-top: 10px;'>"},
        {header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='服务商编辑' class='webix_icon fa-pencil'></span>"},
        {header:"&nbsp;", width:35, template:"<span  style=' cursor:pointer;' title='服务商类别' class='webix_icon fa-check-circle'></span>"},
        {header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='商品管理' class='webix_icon fa-list-ul'></span>"},
        {header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='优惠卡包' class='webix_icon fa-gift'></span>"},
        {header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='次卡编辑' class='webix_icon fa-credit-card'></span>"},
        {header:"&nbsp;", width:35, template:"<span  style='cursor:pointer;' title='用户管理' class='webix_icon fa-user-md'></span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:68,
        autoheight:false,
        hover:"myhover",
        rightSplit:5,
        columns:elements,
        data:[],
        onClick:on_event
    };

    var toolbar_ui = {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
        {view:"label", align:"left",label:"服务商列表",height:30},
        {view:"search",id:"search_keys",width:250,placeholder:"输入修理厂名称",keyPressTimeout:1000},
        {view:"segmented",id:"lay_off_type", multiview:true,width:150, options:[
            { id:"false", value:"营业" }, // the initially selected segment
            { id:"true", value:"停业" }]
        },
        { view: "button", type: "iconButton", icon: "plus", label: "新增服务商", width: 135, click: function(){
            //todo
            this.$scope.show("/supplier_edit");
        }}
    ]};


    var table_page_ui = table_page.$create_page_table("table_page_list",table_ui);

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {type:"clean", rows:[toolbar_ui,table_page_ui]}]
    };

    var refresh_table = function(){
        $$("table_list").clearAll();
        base.getReq("/v2/api/meta_supplier_list.json?keys="+search_keys+"&layoff="+layoff_type+"&page="+cur_page+"&size=15",function(data){
            $$("table_list").clearAll();

            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                item.attachments_id = item.attachments_id.length ? item.attachments_id : [
                    {
                        "thumbnail_url": "http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF",
                        "original_url": "http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF",
                        "raw_url": "http://7xiqd8.com2.z0.glb.qiniucdn.com/Fg_yYLTcb6lsCJaKI9DMIBeD53VF"
                    }
                ];
            }

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
            webix.$$("title").parse({title: "服务商管理", details: "服务商管理人员"});
            setTimeout(function(){
                $$("lay_off_type").setValue(layoff_type);
                $$("search_keys").setValue(search_keys);
                $$("lay_off_type").attachEvent("onChange", function(newv, oldv){
                    layoff_type = newv;
                    refresh_table();
                });
                $$("search_keys").attachEvent("onTimedKeyPress",function(){
                    search_keys = $$("search_keys").getValue();
                    cur_page = 1;
                    refresh_table();
                });
            },500);
            refresh_table();
        }
    }
});