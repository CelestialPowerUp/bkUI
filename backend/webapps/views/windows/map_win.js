define(["views/modules/base",
    "views/webix/baidumap"], function (base) {

    var _call_back = null;

    var search_address = function(){
        var address = $$("address").getValue();
        if(address==null||address==""){
            refresh_user_address($$("car_user_id").getValue());
            return;
        }
        base.getLocation(address,function(data){
            if(data['message']=="ok"){
                $$("pick_address").clearAll();
                for(var i=0;i<data.results.length;i++){
                    if(typeof (data.results[i]['location']) === 'undefined'){
                        continue;
                    }
                    var obj = {};
                    obj.latitude=data.results[i]['location']['lat'];
                    obj.longitude=data.results[i]['location']['lng'];
                    obj.name=data.results[i].name;
                    obj.address=data.results[i].address;
                    obj.help = "";
                    $$("pick_address").add(obj);
                }
            }
        });
    };

    var format_content = function(point,info){
        var content = "经度："+point.lng+"<br/>"+"纬度："+point.lat+"<br/>";
        content += info;
        return content;
    };

    //更新infowindow的信息
    var update_info_window = function(event){
        var content = format_content(event.point,event.address);
        infoWindow.setContent(content);
        $$("map").map.panTo(event.point);
        $$("address_longitude").setValue(event.point.lng);
        $$("address_latitude").setValue(event.point.lat);
        $$("address_detail").setValue(event.address);
        $$("map").map.openInfoWindow(infoWindow,event.point); //开启信息窗口
    };

    //地图位置信息
    var infoWindow = null;
    var parse_address_info = function(address){
        var map = $$("map").map;
        map.clearOverlays();
        var point = new BMap.Point(116.417854,39.921988);//默认点
        var geoc = new BMap.Geocoder();
        var opts = {
            width : 250,     // 信息窗口宽度
            height: 80,     // 信息窗口高度
            offset: new BMap.Size(0, -25),
            title : "当前位置"  // 信息窗口标题
        }
        infoWindow = new BMap.InfoWindow("", opts);  // 创建信息窗口对象
        infoWindow.disableCloseOnClick();
        if(typeof(address)!='undefined'&& address !== null ){
            point = new BMap.Point(address.longitude,address.latitude);
        }
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        map.centerAndZoom(point, 15);
        marker.enableDragging();
        geoc.getLocation(point, function(rs){
            update_info_window(rs); //开启信息窗口
        });
        marker.addEventListener("dragend",function(event){
            geoc.getLocation(event.point, function(rs){
                update_info_window(rs);
            });
        });
        marker.addEventListener("dragging",function(event){
            map.closeInfoWindow();
        });
    };

    var search_ui = {
        rows: [{
            cols: [
                {
                    view: "text",
                    id: "address",
                    keyPressTimeout: 100,
                    placeholder: "输入地址进行查询",
                    width: 250,
                    value: "",
                    on: {
                        "onTimedKeyPress": function () {
                            search_address();
                        }
                    }
                },
                {
                    view: "button", label: "查询", width: 50, click: function () {
                        var address = $$("address").getValue();
                        if (address == null || address == "") {
                            webix.message({type: "error", expire: 5000, text: "请输入查询的地址"});
                            return;
                        }
                        search_address();
                }
                },
                {}]
        },
            {
                id: "pick_address",
                view: "list",
                height: 450,
                template: "<div class='strong_text'>#name#</div><div class='light_text'>#address#</div>",
                type: {height: 80, width: 300},
                select: true,
                on: {
                    "onItemClick": function (id, e, node) {
                        var item = this.getItem(id);
                        parse_address_info(item);
                    }
                }
            }
        ]
    }

    var map_ui = {
        type:"clean",
        rows:[
            {view:"toolbar",css: "highlighted_header header5",height:40, elements:[
                {view:"label", align:"left",label:"地址信息",height:30},
                {view:"text",id:"address_detail", label:"地址",labelWidth:50,placeholder: "地址详细信息",required:true},
                {view:"text",id:"address_longitude", label:"经度",labelWidth:50,width:160,placeholder: "经度",required:true,readonly:true},
                {view:"text",id:"address_latitude", label:"纬度",labelWidth:50,width:160,placeholder: "纬度",required:true,readonly:true}
            ]},
            {
                margin: 5,
                cols: [
                    {
                        view: "baidu-map",
                        id: "map",
                        zoom: 15,
                        width: 700,
                        center: [116.404, 39.915],
                        on: {
                            "onAfterRender": function () {
                                
                            }
                        }
                    },
                    search_ui
                ]
            }
        ]
    }

    var button_ui = {
        margin: 20, cols: [{},
            {
                view: "button",
                type: "iconButton",
                icon: "hand-o-up",
                label: "确认",
                width: 80,
                click: function () {
                    var arr = ["address_detail","address_longitude","address_latitude"];
                    var data = {};
                    for(var a in arr){
                        if(!$$(arr[a]).validate()){
                            base.$msg.error("地址信息不能为空");
                            return;
                        }
                        data[arr[a]] = $$(arr[a]).getValue();
                    }
                    if(typeof _call_back === 'function'){
                        _call_back(data);
                    }
                    webix.$$("address_pop_win").close();
                }
            },
            {
                view: "button", label: "取消", width: 80, click: function () {
                webix.$$("address_pop_win").close();
            }
            }]
    };

    var win_ui = {
        view: "window",
        modal: true,
        id: "address_pop_win",
        position: "center",
        head: "地图信息",
        body: {
            type: "space",
            rows: [map_ui, button_ui]
        }
    };

    return {
        $ui: win_ui,
        $call_back:function(func){
            _call_back = func;
        }
    };
});
