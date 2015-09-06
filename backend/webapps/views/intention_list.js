define(["views/modules/base","views/menus/call_out"],function(base,call_out){

    var elements = [
        {id:"id",width:50,hidden:true},
        {id:"customer_name", header:"姓名", width:100},
        {id:"customer_phone_number", header:"电话", width:100,onClick:function(){
            console.log(arguments);
        }},
        {id:"car_model", header:"车型",template:function(obj){
            return obj.car.model;
        } ,width:250},
        {id:"create_time", header:"创建时间",adjust:true,template:function(obj){
            return base.$show_time(obj.create_time);
        }},
        {id:"description", header:"意向备注",width:300},
        {id:"operate", header:"操作", adjust:true,template:"<span class='call row_button'>呼叫</span><span class='edit row_button'>编辑</span><span class='add row_button'> 新建一单</span>"}
    ];

    var onClick={
        "edit":function(e,id,node){
            var item = this.getItem(id);
            this.$scope.show("/intention_edit:id="+id);
        },
        "add":function(e,id,node){
            this.$scope.show("/order_add:phone_number="+this.getItem(id).customer_phone_number);
        },
        "call":function (e,id,node) {
            var phoneNumber = this.getItem(id).customer_phone_number;
            $$("call_out_submenu").show($$("call_out").getNode());
            $$("phone_number").setValue(phoneNumber);
            call_out.callOut();
        }
    }

    var table_ui = {
        id:"table_list",
        view:"datatable",
        columns:elements,
        leftSplit:1,
        autoheight:true,
        autowidth:true,
        on:{
            "onresize":webix.once(function(){
                this.adjustRowHeight("description", true);
            })
        },
        onClick:onClick

    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:15, type:"clean", rows:[table_ui]},{}]
    };

    var init_data = function(){
        $$("table_list").clearAll();
        base.getReq("intentions.json",function(datas){
            $$("table_list").parse(datas);
        });
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "备忘列表", details: "备忘列表"});
            init_data();
        }
    }
});