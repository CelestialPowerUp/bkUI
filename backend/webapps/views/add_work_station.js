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
            },
            okCallback: function () {
                var values = $$("wsEditForm").getValues();
                values.wsName = values.wsName.replace(/^\s*|\s*$/g, '');

                if (!values.wsName) {
                    webix.message({type: "error", expire: 5000, text: "请输入工位名称!"});
                    return;
                }

                var supplier = $$("wsEditSuppliers").getPopup().getList().getItem(values.supplier);

                base.postReq("/v1/api/position/save.json", {
                    "position_type_id": values.wsType,
                    "position_lable": values.wsName,
                    "supplier_id": supplier.supplier_id
                }, function () {
                    webix.message({type: "info", expire: 5000, text: "添加成功!"});
                });
            }
        }),
        $oninit: function (app, scope) {
            $$("title").parse({title: "工位管理", details: "添加工位"});
            wsEdit.$oninit();
        }
    }
});