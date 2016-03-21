define(["views/modules/base"], function (base) {

    var workStationTypeEdit = webix.ui({
        view: "window",
        id: "workStationTypeEdit",
        head: {
            id: "workStationTypeEditHead",
            view:"label",
            label: "",
            inputWidth:400,
            align:"center"
        },
        width: 400,
        height: 200,
        position: "center",
        modal: true,
        css: "hell animation",
        body: {
            rows: [
                {
                    view: "toolbar",
                    height: 30,
                    cols: []
                },
                {
                    view: "form",
                    width: 400,
                    elements: [
                        {
                            "view": "text",
                            "name": "wsName",
                            "label": "工位类型",
                            "placeholder": "请输入工位类型",
                            "labelWidth": "100"
                        }
                    ]
                },
                {
                    height: 60,
                    paddingX: 10,
                    paddingY: 10,
                    margin: 10,
                    cols: [
                        {
                            fillspace: true
                        },
                        {
                            view: "button",
                            id: "okButton",
                            value: "确定",
                            width: 100,
                            click: function () {
                                $("[view_id='workStationTypeEdit']").addClass("hell");
                                setTimeout(function () {
                                    workStationTypeEdit.hide();
                                }, 1000);
                            }
                        },
                        {
                            view: "button",
                            id: "cancelButton",
                            value: "取消",
                            width: 100,
                            click: function () {
                                $("[view_id='workStationTypeEdit']").addClass("hell");
                                setTimeout(function () {
                                    workStationTypeEdit.hide();
                                }, 1000);
                            }
                        }
                    ]
                }
            ]
        }
    });

    workStationTypeEdit.attachEvent("onShow", function () {
        setTimeout(function () {
            $("[view_id='workStationTypeEdit']").removeClass("hell");
        }, 0);
    });

    function showWorkStationTypeEdit(title) {
        webix.$$("workStationTypeEditHead").setValue(title);
        workStationTypeEdit.show();
        console.log(workStationTypeEdit);
    }

    return {
        $ui: {
            view: "datatable",
            paddingX: 20,
            paddingY: 20,
            width: 800,
            columns: [
                {id: "rank", header: "ID", width: 100},
                {id: "name", header: "工位类型", fillspace: true},
                {
                    id: "operations",
                    header: "操作",
                    width: 300,
                    template: "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px;' class='addWorkStationType'>新增</span>" +
                    "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px; margin-left: 10px;' class='editWorkStationType'>编辑</span>" +
                    "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px; margin-left: 10px;' class='deleteWorkStationType'>删除</span>"
                }
            ],
            data: [
                {id: 1, name: "ACB", rank: 1},
                {id: 2, name: "AC", rank: 2}
            ],
            onClick: {
                addWorkStationType: function (e, data) {
                    showWorkStationTypeEdit("新增工位");
                },
                editWorkStationType: function (e, data) {
                    showWorkStationTypeEdit("编辑工位");
                },
                deleteWorkStationType: function (e, data) {
                    webix.confirm({
                        title: "确定操作",
                        ok: "是",
                        cancel: "否",
                        type: "confirm-error",
                        text: "确定要删除这个工位类型么?",
                        callback: function (result) {
                            if (result) {
                                webix.alert({text: "删删删"});
                            }
                        }
                    });
                }
            }
        },
        $oninit: function () {
            webix.$$("title").parse({title: "工位管理", details: "工位类型列表"});
        }
    }
});