define(["views/modules/base",
    "views/windows/coupon_share_win"],function(base,coupon_share_win){

    coupon_share_win.$add_call_back(function(){
        refresh_table();
    });

    var on_event = {
        "fa-pencil":function(e, id){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(coupon_share_win.$ui).show();
            coupon_share_win.$init_data(item.coupon_share_id);
        },
        "fa-arrow-circle-up":function(e, id){
            webix.confirm({
                text:"上线该文案<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        var item = $$("table_list").getItem(id);
                        base.postReq("coupon_share/"+item.coupon_share_id+"/online.json","",function(){
                            base.$msg.info("修改成功");
                            refresh_table();
                        });
                    }
                }
            });
        }
    };

    var elements = [
        {id:"coupon_share_id",header:"分享ID",width:80},
        {id:"coupon_package_id",header:"卡包ID",width:80},
        {id:"coupon_share_name", header:"卡包名称",width:200,fillspace:false},
        {id:"coupon_package_price", header:"卡券数量",width:100,template:function(obj){
            return obj.coupon_package_items.length;
        },fillspace:false},
        {id:"coupon_package_items", header:"内容",minWidth:350,fillspace:true,template:function(obj){
            var result = "";
            var items = obj.coupon_package_items;
            for(var a in items){
                result += "<span class='status status1'>"+items[a].link_type_text+"："+items[a].link_info+" "+items[a].discount_type_text+" "+items[a].discount_value+"</span>&nbsp;";
            }
            return result;
        }},
        {id:"status_value", header:"状态",width:120,template:function(obj){
            if(obj.status === 'offline'){
                return "<span class='status status0'>下线</span>"
            }
            return "<span class='status status1'>上线</span>";
        }},
        {id:"create_time", header:"创建时间",width:150,format:base.$show_time,fillspace:false},
        {id:"edit", header:"&nbsp;", width:80, template:"<span class='trash webix_icon fa-pencil' title='编辑文案'>编辑</span>"},
        {id:"edit", header:"发放文案", width:80, template:function(obj){
            if(obj.status === 'offline'){
                return "<span class='trash webix_icon fa-arrow-circle-up' title='分享卡包上线'>上线</span>"
            }
            return "";
        }}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoheight:false,
        autoConfig:true,
        hover:"myhover",
        rightSplit:2,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var filter_ui = {
        margin:15,
        cols:[
            { view: "button", type: "iconButton", icon: "plus", label: "新建分享卡包", width: 135, click: function(){
                //todo
                this.$scope.ui(coupon_share_win.$ui).show();
                coupon_share_win.$init_data();
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
        $$("table_list").clearAll();
        base.getReq("coupon_shares.json",function(data){
            console.log(data);
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "优惠券管理", details: "优惠券卡包分享"});
            refresh_table();
        }
    }
});