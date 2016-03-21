define(["views/modules/base",
    "views/modules/table_page_m",
    "views/modules/load_richselect",
    "views/forms/work_station_edit"], function (base, tablePager, loadRichSelect, wsEdit) {

    return {
        $ui: {
            paddingX: 20,
            paddingY: 20,
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "服务商列表:",
                            width: 150
                        },
                        {
                            view: "richselect",
                            id: "richselectSuppliers",
                            options: [],
                            autowidth: true
                        },
                        {view: "resizer"},
                        {
                            cols: [
                                {
                                    view: "richselect",
                                    id: "richselectType",
                                    options: ["工位类型", "工位状态"],
                                    value: "工位类型",
                                    autowidth: true
                                },
                                {
                                    view: "richselect",
                                    id: "richselectTypeValues",
                                    options: [],
                                    autowidth: true
                                }
                            ]
                        },
                        {
                            view: "button",
                            id: "searchButton",
                            value: "查询",
                            width: 100
                        }
                    ]
                },
                tablePager.$create_page_table('workStationListPager', {
                        view: "datatable",
                        resizeColumn: true,
                        columns: [
                            {id: "rank", header: "ID", width: 100},
                            {id: "name", header: "工位标识", fillspace: true},
                            {id: "type", header: "工位类型", width: 300},
                            {id: "status", header: "工位状态", width: 300},
                            {
                                id: "orders",
                                header: "订单详情",
                                width: 300,
                                template: "<span style='color: blueviolet; text-decoration: underline; cursor: pointer;' class='showOrders'>详情</span>"
                            },
                            {
                                id: "operations",
                                header: "操作",
                                width: 300,
                                template: "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px;' class='editWorkStation'>编辑</span>" +
                                "<span style='color: white; background-color: deepskyblue; border-radius: 2px; cursor: pointer; padding: 5px; margin-left: 10px;' class='deleteWorkStation'>删除</span>"
                            }
                        ],
                        data: [
                            {id: 1, name: "ABC", type: "洗车", status: "预约中", rank: 1},
                            {id: 2, name: "AC", type: "修车", status: "预约中", rank: 2}
                        ],
                        onClick: {
                            showOrders: function (e, data) {
                                var item = this.getItem(data.row);
                                console.log(item);

                                var workStationOrders = webix.ui({
                                    view: "window",
                                    id: "workStationOrders",
                                    head: "订单详情",
                                    width: 800,
                                    height: 600,
                                    position: "center",
                                    modal: true,
                                    css: "hell animation",
                                    body: {
                                        rows: [
                                            {
                                                view: "datatable",
                                                columns: [
                                                    {id: "rank", header: "ID", width: 100},
                                                    {id: "orderId", header: "订单号", fillspace: true},
                                                    {id: "startTime", header: "开始时间", width: 200},
                                                    {id: "endTime", header: "结束时间", width: 200}
                                                ]
                                            },
                                            {
                                                width: 800,
                                                margin: 20,
                                                paddingX: 20,
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
                                                            $("[view_id='workStationOrders']").addClass("hell");
                                                            setTimeout(function () {
                                                                workStationOrders.hide();
                                                            }, 1000);
                                                        }
                                                    },
                                                    {
                                                        view: "button",
                                                        id: "cancelButton",
                                                        value: "取消",
                                                        width: 100,
                                                        click: function () {
                                                            $("[view_id='workStationOrders']").addClass("hell");
                                                            setTimeout(function () {
                                                                workStationOrders.hide();
                                                            }, 1000);
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                });
                                workStationOrders.attachEvent("onShow", function(){
                                    setTimeout(function () {
                                        $("[view_id='workStationOrders']").removeClass("hell");
                                    }, 0);
                                });
                                workStationOrders.show();
                            },
                            editWorkStation: function (e, data) {
                                var item = this.getItem(data.row);
                                console.log(item);

                                var workStationEdit = webix.ui({
                                    view: "window",
                                    id: "workStationEdit",
                                    head: "编辑工位",
                                    width: 800,
                                    height: 600,
                                    position: "center",
                                    modal: true,
                                    css: "hell animation",
                                    body: wsEdit.$getUI({
                                        onHide: function () {
                                            $("[view_id='workStationEdit']").addClass("hell");
                                            setTimeout(function () {
                                                workStationEdit.hide();
                                            }, 1000);
                                        }
                                    })
                                });
                                workStationEdit.attachEvent("onShow", function(){
                                    wsEdit.$oninit();
                                    setTimeout(function () {
                                        $("[view_id='workStationEdit']").removeClass("hell");
                                    }, 0);
                                });
                                workStationEdit.show();
                            },
                            deleteWorkStation: function (e, data) {
                                var item = this.getItem(data.row);
                                console.log(item);

                                webix.confirm({
                                    title: "确定操作",
                                    ok: "是",
                                    cancel: "否",
                                    type: "confirm-error",
                                    text: "确定要删除这个工位么?",
                                    callback: function (result) {
                                        if (result) {
                                            webix.alert({text: "删删删"});
                                        }
                                    }
                                });
                            }
                        }
                    }
                )
            ]
        },
        $oninit: function (app, scope) {
            webix.$$("title").parse({title: "工位管理", details: "工位列表"});
            loadRichSelect.$load4WorkStation();
        }
    };
});
