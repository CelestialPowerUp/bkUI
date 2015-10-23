define(["views/modules/base",
    "views/forms/driver_license_form"],function(base,driver_license){

    var on_event = {

        "fa-car":function(e, id, node){
            var item = $$("table_list").getItem(id);
            this.$scope.ui(driver_license.$ui).show();
            driver_license.$init_data(item.car_id);
        }

    };

    var elements = [
        {id:"car_id",header:"车辆ID",width:80},
        {id:"car_number", header:"车牌号",width:120,fillspace:true},
        {id:"plate_no", header:"行驶证车牌还",width:120,fillspace:true},
        {id:"phone_number", header:"车主电话",width:80,fillspace:true},
        {id:"owner", header:"车主姓名",width:120,fillspace:true},
        {id:"register_date", header:"注册日期",width:120,fillspace:true},
        {id:"model", header:"车品牌型号",width:120,fillspace:true},
        {id:"trash", header:"行驶证", width:80, template:"<span class='fa fa-car' style=' cursor:pointer;text-decoration: underline;' title='核对行驶证信息'> 核对</span>"}
    ];

    var table_ui = {
        id:"table_list",
        view:"datatable",
        select:false,
        rowHeight:35,
        autoheight:false,
        hover:"myhover",
        rightSplit:1,
        columns:elements,
        data:[],
        onClick:on_event
    }

    var IsNum = function(s)
    {
        if (s!=null && s!="")
        {
            return !isNaN(s);
        }
        return false;
    };

    var getTime = function(index){
        var p = {};
        for(var i = 0;i<arr.length;i++){
            var v = $$(arr[i]+index).getValue();
            p[arr[i]+index] = parseInt(v, 10);
        }
        return p;
    };

    var arr = ['starty','startd','endy','endd'];

    var show_time_ui = function(index){
        for(var i = 0;i<arr.length;i++){
            $$(arr[i]+index).show();
        }
        $$("search_text").hide();
    };

    var hide_time_ui = function(index){
        for(var i = 0;i<arr.length;i++){
            $$(arr[i]+index).hide();
        }
        $$("search_text").show();
    };

    var filter_ui = {
        rows:[
            {view:"toolbar",id:"tool_data",css: "highlighted_header header5",height:45, elements:[
                {view: "richselect", id:"filter_search",label:"车辆信息:",labelWidth:80,value:"car_number",options:[
                    {id:"car_number",value:"车辆车牌号"},
                    {id:"plate_no",value:"行驶证车牌号"},
                    {id:"create_user_name",value:"创建人"},
                    {id:"register_date",value:"注册日期"},
                    {id:"owner",value:"行驶证的姓名"},
                    {id:"car_id",value:"车ID"}
                ],placeholder:"选择关键字",width:250, on:{"onChange":function(n,o){
                    search_type();
                }}},
                {view:"text",id:"search_text",width:180,placeholder:"输入查询关键字",keyPressTimeout:500,on:{
                    onTimedKeyPress:function(){
                        refresh_table();
                    }
                }},
                {view:"text",id:"starty1",width:50,placeholder:"月",keyPressTimeout:500,on:{
                    onTimedKeyPress:function(){
                        var v = this.getValue();
                        if(!(v.length>0 && IsNum(v) && parseInt(v, 10)<=12 && parseInt(v, 10)>=1)){
                            base.$msg.error("日期输入不合法");
                        }
                    }
                }},
                {view:"text",id:"startd1",width:75,label:"/",labelWidth:25,placeholder:"日",keyPressTimeout:500,on:{
                    onTimedKeyPress:function(){
                        var v = this.getValue();
                        if(!(v.length>0 && IsNum(v) && parseInt(v, 10)>=1 && parseInt(v, 10)<=31)){
                            base.$msg.error("日期输入不合法");
                        }
                    }
                }},
                {view:"text",id:"endy1",width:85,label:"--",labelWidth:35,placeholder:"月",keyPressTimeout:500,on:{
                    onTimedKeyPress:function(){
                        var v = this.getValue();
                        if(!(v.length>0 && IsNum(v) && parseInt(v, 10)<=12 && parseInt(v, 10)>=1)){
                            base.$msg.error("日期输入不合法");
                        }
                    }
                }},
                {view:"text",id:"endd1",width:75,label:"/",labelWidth:25,placeholder:"日",keyPressTimeout:500,on:{
                    onTimedKeyPress:function(){
                        var v = this.getValue();
                        if(!(v.length>0 && IsNum(v) && parseInt(v, 10)>=1 && parseInt(v, 10)<=31)){
                            base.$msg.error("日期输入不合法");
                        }
                    }
                }},
                { view: "button", label: "查询", width: 50,click:function(){
                    refresh_table();
                }}
            ]}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:0, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var search_type = function(){
        var type = $$("filter_search").getValue();
        if(type.indexOf('date')>=0){
            show_time_ui(1);
        }else{
            hide_time_ui(1);
        }
        $$("search_text").setValue("");
    }

    var refresh_table = function(){
        var type = $$("filter_search").getValue();
        var param = "";
        if(type.indexOf('date')>=0){
            var time1 = getTime(1);
            param = "register_date_start="+time1.starty1+"-"+time1.startd1+"&register_date_end="+time1.endy1+"-"+time1.endd1;
        }else{
            if($$("search_text").getValue().length<=0){
                return;
            }
            param = type+"="+$$("search_text").getValue();
        }
        base.getReq("cars/info_list.json?"+param,function(data){
            base.$msg.info("数据 "+data.length);
            $$("table_list").clearAll();
            $$("table_list").parse(data);
        });
    };

    var init_data = function(){
        search_type();
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "用户管理", details: "用户车辆信息"});
            init_data();
        }
    }
});