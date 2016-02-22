define(["views/modules/base"],function(base){

    var layout = {
        paddingY:15,
        paddingX:15,
        cols:[{}]
    };

    return {
        $ui:layout,
        $oninit:function(app,config){
            webix.$$("title").parse({title: "首页", details: "养爱车"});
        }
    }
});