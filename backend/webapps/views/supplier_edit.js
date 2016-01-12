define(["views/modules/base","views/webix/baidumap"],function(base){

    var map = {
        rows:[
            {
                view:"baidu-map",
                id:"map",
                zoom:15,
                center:[ 116.404, 39.915 ]
            }
        ]
    };

    var format_content = function(point,info){
        var content = "经度："+point.lng+"<br/>"+"纬度："+point.lat+"<br/>";
        content += info;
        return content;
    };

    var update_sale_persion = function(sale_person){
        base.getReq("users_by_role_code.json?role_code=UserRoles_SaleUsers",function(data) {
            var list = $$("sale_id").getPopup().getList();
            list.clearAll();
            for (var i = 0; i < data.length; i++) {
                list.add({id: data[i]['id'], value: data[i]['user_name']});
            }
            $$("sale_id").setValue(sale_person);
            $$("sale_id").refresh();
        });
    }

    var parse_address_info = function(address){
        var map = $$("map").map;
        var point = new BMap.Point(116.417854,39.921988);//默认点
        var geoc = new BMap.Geocoder();
        var opts = {
            width : 250,     // 信息窗口宽度
            height: 80,     // 信息窗口高度
            offset: new BMap.Size(0, -25),
            title : "当前位置"  // 信息窗口标题
        }
        var infoWindow = new BMap.InfoWindow("", opts);  // 创建信息窗口对象
        infoWindow.disableCloseOnClick();
        if(typeof(address)!='undefined'&& address !== null ){
            point = new BMap.Point(address.x,address.y);
        }
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        map.centerAndZoom(point, 15);
        marker.enableDragging();
        geoc.getLocation(point, function(rs){
            var content = format_content(point,rs.address);
            infoWindow.setContent(content);
            map.panTo(point);
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        });
        marker.addEventListener("dragend",function(event){
            geoc.getLocation(event.point, function(rs){
                var content = format_content(event.point,rs.address);
                infoWindow.setContent(content);
                map.panTo(event.point);
                $$("longitude").setValue(event.point.lng);
                $$("latitude").setValue(event.point.lat);
                map.openInfoWindow(infoWindow,event.point); //开启信息窗口
            });
        });
        marker.addEventListener("dragging",function(event){
            map.closeInfoWindow();
        });
    };

    var elements = [
        {view:"text",id:"supplier_id",name:"supplier_id",hidden:true},
        {view: "richselect", id:"supplier_mold",name:"supplier_mold",options:[
            {id:"community",value:"社区店"},
            {id:"comprehensive",value:"综合店"}
        ],label:"服务类型",placeholder:"请选择服务类型",required:true,width:350},
        {view: "text", label:"名称",name:"name", placeholder: "请输入服务商名称",required:true,width:350,value:""},
        {view: "text", label:"联系人",placeholder: "请输入联系人",name:"contact_name", width:350,value:""},
        {view: "text", label:"联系人手机",placeholder: "请输入联系人电话",name:"mobile_number",width:350,value:""},
        {view: "text", label:"服务商座机",placeholder: "请输入服务商座机",name:"phone_number",width:350,value:""},
        {view: "textarea", label:"服务商地址",placeholder: "请输入服务商地址",required:true,name:"address",width:350,value:""},
        {view:"text",id:"longitude",name:"longitude", label:"经度",placeholder: "拖动地图图标选择经纬度",required:true,disabled:true},
        {view:"text",id:"latitude",name:"latitude", label:"纬度",placeholder: "拖动地图图标选择经纬度",required:true,disabled:true},
        { view:"radio", name:"layoff",id:"layoff", label:"服务商状态", width:350,required:true,  options:[
            { value:"营业中", id:'false' },
            { value:"停业中", id:'true' }
        ]},
        {view: "text", label:"综合评分",name:"rating", placeholder: "新建服务商默认4分",width:350,value:4,required:true,disabled:true},
        {view: "richselect", id:"sale_id", name:"sale_id", label:"负责销售",placeholder:"这里面选择销售人员", width:350,
            options: [],
            on:{"onAfterRender":function(){

            }}
        },
        {view: "text", label:"首单奖励",name:"first_order_reward",placeholder: "首单奖励金额",width:350,required:true},
        {view: "text", label:"匹配距离",name:"adaption_distance",placeholder: "社区店匹配距离最距离",width:350,required:false},
        {view: "text", label:"银行卡号",id:"bank_card",name:"bank_card",placeholder:"这里面填写银行卡号", width:350},

        {
            paddingY:15,
            paddingX:15,
            margin:15,
            borderless:true,
            cols:[
                {},
                { view:"button", value: "确定", click:function(){
                    if ($$("form_view").validate()){
                        var form_data = $$("form_view").getValues();
                        if(form_data.rating===""){//
                            form_data.rating = 4;
                        }
                        var action = "/v2/api/meta_supplier/create.json";
                        if(form_data.supplier_id!==""){
                            action = "/v2/api/meta_supplier/update.json";
                        }
                        base.postReq(action,form_data,function(bkdata){
                            base.$msg.info("数据提交成功...");
                            bkdata.layoff = bkdata.layoff.toString();
                            $$("form_view").parse(bkdata);
                        });
                    }else{
                        base.$msg.error("参数格式不正确或不能为空...");
                    }
                }}
            ]
        }
    ];

    var from_ui = {
        id:"form_view",
        view:"form",
        elementsConfig:{
            labelWidth: 120
        },
        elements:elements,
        rules:{
            "latitude":webix.rules.isNumber,
            "longitude":webix.rules.isNumber,
            "supplier_mold":webix.rules.isNotEmpty,
            "name":webix.rules.isNotEmpty,
            "address":webix.rules.isNotEmpty,
            "layoff":webix.rules.isNotEmpty
        }
    };

    var filer_ui = {
        cols:[
            { view: "button", type: "iconButton", icon: "backward", label: "返回列表", width: 120, click: function(){
                //todo
                this.$scope.show("/supplier_list");
            }},{}
        ]
    }

    var layout = {
        paddingY:15,
        paddingX:15,
        margin:15,
        rows:[
            filer_ui,
            {
                paddingY:15,
                paddingX:15,
                margin:15,
                cols:[
                    map,from_ui
                ]
            }
        ]
    }

    var init_data = function(){
        var id = base.get_url_param("id");
        if(typeof(id)==='undefined' || id===null || id === ""){
            parse_address_info(null);
            update_sale_persion('');
            return;
        }
        base.getReq("/v2/api/supplier.json/"+id,function(data){
            update_sale_persion(data['sale_id']);
            data.layoff = data.layoff.toString();
            $$("form_view").parse(data);
            var address = {};
            address.x = data.longitude;
            address.y = data.latitude;
            parse_address_info(address);
            $$("supplier_mold").disable();
        });
    }

    return {
        $ui:layout ,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "服务商管理", details: "服务商编辑"});
            setTimeout( function(){
                init_data();
            },1000);

        }
    };
});