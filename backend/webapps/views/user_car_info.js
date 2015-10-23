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
        {id:"engine_number", header:"发动机编号",minWidth:250,fillspace:true},
        {id:"phone_number", header:"用户电话",width:80,fillspace:true},
        {id:"car_user_name", header:"用户姓名",width:120,fillspace:true},
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

    var filter_ui = {
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:45, elements:[
                {view:"label", align:"left",label:"车辆信息核对",height:30},
                {view:"search",id:"s_car_number",width:250,placeholder:"请输入车牌号",keyPressTimeout:1000,on:{
                    "onTimedKeyPress":function(){
                        $$("s_car_id").setValue("");
                        refresh_table();
                    }
                }},
                {view:"search",id:"s_car_id",width:250,placeholder:"请输入车ID",keyPressTimeout:1000,on:{
                    "onTimedKeyPress":function(){
                        $$("s_car_number").setValue("");
                        refresh_table();
                    }
                }},
            ]}
        ]
    };

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[
            {margin:0, type:"clean", rows:[filter_ui,table_ui]}]
    };

    var refresh_table = function(){
        if($$("s_car_number").getValue().length==0||$$("s_car_number").getValue().length>=3){
            base.getReq("cars/info_list.json?car_number="+$$("s_car_number").getValue()+"&car_id="+$$("s_car_id").getValue(),function(data){
                $$("table_list").clearAll();
                $$("table_list").parse(data);
            })
        }
    };

    var init_data = function(){

    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "用户管理", details: "用户车辆信息"});
            init_data();
        }
    }
});