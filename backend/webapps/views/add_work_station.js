define(["views/modules/base", "views/forms/work_station_edit"], function (base, wsEdit) {

    return {
        $ui: wsEdit.$getUI({
            topElement: {
                view: "richselect",
                id: "wsEditSuppliers",
                name: "supplier",
                label: "服务商列表",
                options: [],
                placeholder: "请选择服务商",
                labelWidth: "100"
            }
        }),
        $oninit: function (app, scope) {
            webix.$$("title").parse({title: "工位管理", details: "添加工位"});
            wsEdit.$oninit();
        }
    }
});