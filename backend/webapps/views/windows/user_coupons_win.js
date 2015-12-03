/**
 * Created by wangwr on 2015/11/25.
 */
define(["views/modules/base"],function(base){

    var button_ui = {
        margin:15,
        cols:[
            {},
            {view:"button",label:"提交",width:80,click:function(){
                var item = $$("coupon_data_list").getSelectedItem();
                if(!(item)){
                    base.$msg.error("未选择任何优惠券");
                    return;
                }
                if(typeof __callBack === 'function'){
                    __callBack(item);
                }
                webix.$$("work_order_edit_win").close();
            }},
            {view:"button",label:"取消",width:80,click:function(){
                webix.$$("work_order_edit_win").close();
            }}
        ]
    };

    var coupon_ui = {
            id:"coupon_data_list",
            view:"dataview",
            datatype:"json",
            height:300,
            xCount:3,
            borderless:true,
            select:true,
            type:{
                width: 180,
                height: 90,
                template:"<div><div class='webix_strong'>#name#</div><div>价值：#value#</div><div>状态：#status#</div></div>"
            }
        };

    var win_ui = {
        view:"window",
        modal:true,
        id:"work_order_edit_win",
        position:"center",
        head:{
            view:"toolbar",height:40, cols:[
                {view:"label", label: "工单编辑" },
                { view:"button", label: 'X', width: 35, align: 'right', click:"$$('work_order_edit_win').close();"}
            ]},
        body:{
            rows:[coupon_ui,
                {
                    cols:[
                        {view: "icon", icon: "fa fa-exclamation-triangle"},
                        {view:"label", align:"left",css:"warning", label:"优惠券一旦使用过，暂不支持二次更改，请谨慎操作！！"}
                    ]
                },
                button_ui]
        }
    };

    var __callBack = null;

    return {
        $ui:win_ui,
        $init:function(user_id){
            base.getReq("coupons?user_id="+user_id,function(coupons){
                for(var i=0;i<coupons.length;){
                    if(coupons[i].status === "未使用"){
                        i++;
                        continue;
                    }
                    coupons.splice(i,1);
                }
                $$("coupon_data_list").clearAll();
                $$("coupon_data_list").parse(coupons);
            })
        },
        $addCallBack:function(fuc){
            if(typeof fuc === 'function'){
                __callBack = fuc;
            }
        }
    }
});