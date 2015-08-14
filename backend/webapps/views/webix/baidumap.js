webix.protoUI({
	name:"baidu-map",
	$init:function(config){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;

		this.map = null;
		this.$ready.push(this.render);
	},
	render:function(){
        if(typeof BMap=="undefined"||typeof BMap.Map=="undefined"){
            var name = "webix_callback_"+webix.uid();
            window[name] = webix.bind(function(){
                 this._initMap.call(this,true);
            },this);

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//api.map.baidu.com/api?v=2.0&ak=WVAXZ05oyNRXS5egLImmentg&callback="+name;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        else
            this._initMap();
	},
    _initMap:function(define){
        var c = this.config;
		this.map = new BMap.Map(this._contentobj);            // 创建Map实例
		var point = new BMap.Point(c.center[0], c.center[1]); // 创建点坐标
		this.map.centerAndZoom(point,c.zoom);
		this.map.enableScrollWheelZoom();
        webix._ldGMap = null;
		//webix.prototype = BMap;
		/*this.map.getPoint = function(point){
			return new BMap.Point(point[0], point[1]);
		}*/
    },
	center_setter:function(config){
		if(this.map)
            this.map.setCenter(new BMap.Point(config[0], config[1]));
		return config;
	},
	zoom_setter:function(config){
		if(this.map)
			 this.map.setZoom(config);

		return config;
	},
	defaults:{
		zoom: 15,
		center:[ 116.404, 39.915 ]
	},
	$setSize:function(){
		webix.ui.view.prototype.$setSize.apply(this, arguments);
		/*if(this.map)
			BMap.Map.event.trigger(this.map, "resize");*/
	},
	create_point:function(point){
		return new BMap.Point(point[0], point[1]);
	}
}, webix.ui.view);
