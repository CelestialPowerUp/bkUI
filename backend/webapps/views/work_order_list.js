/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base",
    "views/windows/work_order_edit_win",
    "views/modules/table_page_m",
    "views/windows/message_win",
    "views/menus/call_out"],function(base,work_order_edit,table_page,message_win,call_out){

    var __cur_page = 1;

    var __page_size = 10;

    var __proc_status = "1";

    var __create_type = "0";

    var __key_type = "0";

    var __search_text = "";

    var search_ui =
    {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
        { view:"segmented", id:"switch_table", value:"", inputWidth:250, options:[
            { id:"1", value:"未认领" },
            { id:"2", value:"处理中"},
            { id:"3", value:"已完成"},
            { id:"4", value:"已失效"}
        ], on:{
            "onAfterTabClick":function(id){
                //todo
                refresh_table();
            }
        }},
        {view: "richselect", id:"create_type",label:"创建类型:",labelWidth:80,value:"0",width:180,options:[
            {id:"0",value:"所有"},
            {id:"1",value:"保养"},
            {id:"2",value:"续保"},
            {id:"3",value:"验车"},
            {id:"4",value:"维修"}
        ],placeholder:"选择创建类型", on:{"onChange":function(n,o){
            //todo
            refresh_table();
        }}
        },
        {view: "richselect", id:"key_type",label:"关键字:",labelWidth:80,value:"0",width:180,options:[
            {id:"0",value:"所有"},
            {id:"1",value:"姓名"},
            {id:"2",value:"电话"},
            {id:"3",value:"车牌号"}
        ],on:{"onChange":function(n,o){
            //todo
            if(n==='0'){
                $$("search_text").setValue("");
                $$("search_text").disable();
            }else{
                $$("search_text").enable();
            }

            refresh_table();
        }}
        },
        {view:"search",id:"search_text",width:250,placeholder:"姓名/电话/车牌号",disabled:true,keyPressTimeout:500,on:{
            onTimedKeyPress:function(){
                //todo
                refresh_table();
            }
        }},
        { view: "button", type: "iconButton", icon: "plus", label: "新建工单", width: 135, click: function(){
            //todo
            webix.ui(work_order_edit.$ui).show();
        }}
    ]};



    var table_columns = [
        {id:"serviceNum",header:"工单号",width:180},
        {id:"number", header:"车牌",template:function(obj){
            return obj.province+obj.number;
        }},
        {id:"full", header:"车型号",width:300},
        {id:"customerName", header:"用户名"},
        {id:"customerPhoneNumber",width:120, header:"手机号"},
        {id:"createTime", header:"创建时间",width:150,format:base.$show_time},
        {id:"operatorName", header:"客服姓名"},
        {id:"serviceType", header:"创建原因",template:function(obj,common){
            if(obj.serviceType===1){
                return "保养";
            }else  if(obj.serviceType===2){
                return "续保";
            }else  if(obj.serviceType===3){
                return "验车";
            }else  if(obj.serviceType===4){
                return "维修";
            }else{
                return "失效";
            }
        }},
        {id:"description", header:"处理方案",width:250},
        {id:"pick", header:"&nbsp;", width:65, template:function(obj){
            if(obj.procStatus===1){
                return "<span class='trash webix_icon fa-user-md' title='认领工单'>认领</span>"
            }
            return "";
        }},
        {id:"complete", header:"&nbsp;", width:65, template:function(obj){
            if(obj.procStatus===2){
                return "<span class='trash webix_icon fa-check-square' title='完成工单'>完成</span>";
            }
            return "";
        }},
        {id:"call", header:"&nbsp;", width:65, template:function(obj){
            if(obj.procStatus===1){
                return ""
            }
            return "<span class='trash webix_icon fa-phone-square' title='呼叫用户'>呼叫</span>";
        }},
        {id:"edit", header:"&nbsp;", width:65,
            template:function(obj){
                if(obj.procStatus===1){
                    return "";
                }
                return "<span class='trash webix_icon fa-pencil' title='工单备注'>备注</span>";
            }
        },
        {id:"delete", header:"&nbsp;", width:65, template:function(obj){
            if(obj.procStatus===1){
                return ""
            }
            return "<span class='trash webix_icon fa-trash-o' title='删除工单'>删除</span>";
        }}

    ];

    var on_event = {
        //删除
        "fa-trash-o":function(e, id, node){
            var item = $$("data_list").getItem(id);
            webix.confirm({
                text:"删除该记录<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        //删除资源
                        base.postReq("workorder/delete?workOrderId="+item.wkid,"",function(dat){
                            base.$msg.info("资源删除成功");
                            $$("data_list").remove(id);
                        });
                    }
                }
            });
        },
        //备注
        "fa-pencil":function(e, id, node){
            var item = $$("data_list").getItem(id);
            webix.ui(message_win.$ui).show();
            if(item.description){
                message_win.$init_data(item.description);
            }
            message_win.$add_ok_callback(function(msg){
                var param = {id:item.wkid,description:msg};
                base.postReq("workorder/updateDesc",param,function(){
                    base.$msg.info("备注成功");
                    refresh_table();
                });
            });
            //this.$scope.show("/supplier_edit:id="+item.supplier_id);
        },
        //打电话
        "fa-phone-square":function(e, id, node){
            var item = $$("data_list").getItem(id);
            $$("call_out_submenu").show($$("call_out").getNode());
            $$("phone_number").setValue(item.customerPhoneNumber);
            call_out.callOut();
        },
        //认领
        "fa-user-md":function(e, id, node){
            var item = $$("data_list").getItem(id);
            webix.confirm({
                text:"认领该工单<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        var param = {id:item.wkid,proc_status:2};
                        base.postReq("workorder/updateProcStatus",param,function(){
                            base.$msg.info("认领成功");
                            $$("data_list").remove(id);
                        });
                    }
                }
            });
        },
        //完成
        "fa-check-square":function(e, id, node){
            var item = $$("data_list").getItem(id);
            webix.confirm({
                text:"订单已完成<br/> 确定?", ok:"是的", cancel:"取消",
                callback:function(res){
                    if(res){
                        var param = {id:item.wkid,proc_status:3};
                        base.postReq("workorder/updateProcStatus",param,function(){
                            base.$msg.info("工单已完成");
                            $$("data_list").remove(id);
                        });
                    }
                }
            });
        }
    };

    var table_ui = {
        id:"data_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoConfig:true,
        rightSplit:5,
        hover:"myhover",
        onClick:on_event,
        columns:table_columns
    };

    var table_page_ui = table_page.$create_page_table("data_page_list",table_ui);

    var layout = {
        paddingX:15,
        paddingY:15,
        rows:[
            search_ui,table_page_ui
        ]
    }

    var refresh_table = function(){

        $$("data_list").clearAll();
        var create_type = $$("create_type").getValue();
        var proc_status = $$("switch_table").getValue();
        var key_type=$$("key_type").getValue();
        var inputText = $$("search_text").getValue();
        if(key_type!== "0" && inputText===""){
            base.$msg.error("请输入关键字");
            return;
        }
        var cond = key_type + "|" + inputText;
        if(create_type && proc_status && cond){
            base.getReq("workorder/getWorkOrderPageListByType.json?type="+create_type+"&proc_status="+proc_status+"&cond="+cond+"&page="+__cur_page+"&page_size="+10,function(data){
                $$("data_list").parse(data.items);
                table_page.$update_page_items("data_page_list",data);
                table_page.$add_page_callback(function(page){
                    __cur_page = page;
                    refresh_table();
                });
            });
        }
    };

    return {
        $ui:layout,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "工单管理", details: "工单列表"});
            refresh_table();
        }
    }
});