/**
 * Created by Administrator on 2015/11/25.
 */
define(["views/modules/base",
        "views/windows/message_win"],function(base,message_win){

    var choose_tab = "check_wait";

    var cur_page = 1;

    var page_size = 10;

    var search_ui =
    {view:"toolbar",css: "highlighted_header header5",height:45,margin:15, cols:[
        { view:"segmented", id:"switch_table", value:"", options:[
            { id:"check_wait", value:"待审核" },
            { id:"check_pass", value:"审核通过"},
            { id:"send_success", value:"已发送"},
            { id:"send_failure", value:"发送失败"},
            { id:"check_un_pass", value:"已驳回"}
        ], on:{
            "onAfterTabClick":function(id){
                //todo
                choose_tab = id;
                refresh_table();
            }
        }},
        {},
        { view: "button", type: "iconButton", icon: "hand-o-left", label: "上一页", width: 100, click: function(){
            //todo
            cur_page = cur_page-1;
            if(cur_page<0){
                cur_page=1;
            }
            refresh_table();
        }},
        { view: "button", type: "iconButton", icon: "hand-o-right", label: "下一页", width: 100, click: function(){
            //todo
            cur_page = cur_page+1;
            refresh_table();
        }},
    ]};

    var table_columns = [
        {id:"supplier_name", header:"服务商",width:250},
        {id:"message_content",header:"短信内容",editor:"popup",fillspace:true},
        {id:"check_note", header:"审核信息",editor:"popup",width:200},
        {id:"apply_time", header:"申请时间",width:150},
        {id:"edit", header:"&nbsp;", width:80, template:function(obj){
            if(obj.message_status==='check_wait'){
                return "<span class='trash webix_icon fa-heart' title='卡包编辑'>通过</span>";
            }
            return "";
        }},
        {id:"delete", header:"&nbsp;", width:80, template:function(obj){
            if(obj.message_status==='check_wait'){
                return "<span class='trash webix_icon fa-frown-o trash' title='删除卡包'>驳回</span>"
            }
            return "";
        }}
    ];

    var onClick = {
        "fa-heart":function(e, id){
            var item = $$("data_list").getItem(id);
            webix.ui(message_win.$ui).show();
            message_win.$add_ok_callback(function(msg){
                var param = {message_id:item.message_id,check_note:msg,check_ok:true};
                base.postReq("message/service_info/check.json",param,function(){
                    base.$msg.info("通过成功，系统将发送短信");
                    $$("data_list").remove(id);
                });
            });
        },
        "fa-frown-o":function(e, id){
            var item = $$("data_list").getItem(id);
            webix.ui(message_win.$ui).show();
            message_win.$add_ok_callback(function(msg){
                var param = {message_id:item.message_id,check_note:msg,check_ok:false};
                base.postReq("message/service_info/check.json",param,function(){
                    base.$msg.info("驳回成功");
                    $$("data_list").remove(id);
                });
            });
        }
    };

    var table_ui = {
        id:"data_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoConfig:true,
        editable:true,
        hover:"myhover",
        onClick:onClick,
        columns:table_columns
    };

    var layout = {
        paddingX:15,
        paddingY:15,
        rows:[
            search_ui,table_ui
        ]
    }

    var refresh_table = function(){
        $$("switch_table").setValue(choose_tab);
        $$("data_list").clearAll();
        base.getReq("message/service_info/"+choose_tab+"?page="+cur_page+"&page_size="+page_size,function(data){
            $$("data_list").parse(data.items);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,scope){
            webix.$$("title").parse({title: "服务商管理", details: "短信审核"});
            refresh_table();
        }
    }
});