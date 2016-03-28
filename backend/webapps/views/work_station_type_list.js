define(["views/modules/base", "views/modules/load_datatable"], function (base, loadDataTable) {

    function hideWorkStationTypeEdit() {
        $("[view_id='workStationTypeEdit']").addClass("hell");
        setTimeout(function () {
            webix.$$("workStationTypeEdit").close();
        }, 1000);
    }

    var workStationTypeEditLayout = {
        view: "window",
        id: "workStationTypeEdit",
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
                    id: "workStationTypeForm",
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
                            width: 100
                        },
                        {
                            view: "button",
                            id: "cancelButton",
                            value: "取消",
                            width: 100,
                            click: hideWorkStationTypeEdit
                        }
                    ]
                }
            ]
        }
    };

    function showWorkStationTypeEdit(title, wsType) {
        workStationTypeEditLayout.head = title;

        var workStationTypeEdit = webix.ui(workStationTypeEditLayout);

        workStationTypeEdit.attachEvent("onShow", function () {
            var params = wsType || {};

            $$("workStationTypeForm").parse({
                wsName: params.position_type
            });

            setTimeout(function () {
                $("[view_id='workStationTypeEdit']").removeClass("hell");

                $$("okButton").attachEvent("onItemClick", function(){
                    var url;

                    if (params.id === undefined) {
                        url = "/v1/api/position_type/save.json";
                    } else {
                        url = "/v1/api/position_type/update.json";
                    }

                    params.position_type = $$("workStationTypeForm").getValues().wsName.replace(/^\s*|\s*$/g, '');

                    if (!params.position_type) {
                        webix.message({type: "error", expire: 5000, text: "请输入工位类型!"});
                        return;
                    }

                    base.postReq(url, params, function () {
                        loadDataTable.$load("/v1/api/position_types?scope=all", "wsTypeList");
                        hideWorkStationTypeEdit();
                    });
                });
            }, 0);
        });

        workStationTypeEdit.show();
    }

    return {
        $ui: {
            rows: [
                {
                    view: "toolbar",
                    height: 50,
                    cols: [
                        {
                            fillspace: true
                        },
                        {
                            view: "button",
                            width: 200,
                            label: '新增',
                            click: function () {
                                showWorkStationTypeEdit("新增工位类型");
                            }
                        }
                    ]
                },
                {
                    view: "datatable",
                    id: "wsTypeList",
                    paddingX: 20,
                    paddingY: 20,
                    width: 800,
                    columns: [
                        {id: "id", header: "ID", width: 100},
                        {id: "position_type", header: "工位类型", fillspace: true},
                        {
                            id: "operations",
                            header: "操作",
                            width: 300,
                            template: "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px;' class='addWorkStationType'>新增</span>" +
                            "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px; margin-left: 10px;' class='editWorkStationType'>编辑</span>" +
                            "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px; margin-left: 10px;' class='deleteWorkStationType'>删除</span>"
                        }
                    ],
                    onClick: {
                        addWorkStationType: function (e, data) {
                            showWorkStationTypeEdit("新增工位类型");
                        },
                        editWorkStationType: function (e, data) {
                            showWorkStationTypeEdit("编辑工位类型", webix.$$("wsTypeList").getItem(data.row));
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
                                        base.postReq("/v1/api/position_type/delete.json?id=" + data.row, {}, function () {
                                            webix.message({type: "info", expire: 5000, text: "删除成功!"});
                                            loadDataTable.$load("/v1/api/position_types?scope=all", "wsTypeList");
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        },
        $oninit: function () {
            $$("title").parse({title: "工位管理", details: "工位类型列表"});
            loadDataTable.$load("/v1/api/position_types?scope=all", "wsTypeList");
        }
    }
});