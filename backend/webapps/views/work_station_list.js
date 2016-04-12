define(["views/modules/base",
    "views/modules/load_richselect",
    "views/modules/load_datatable",
    "views/forms/work_station_edit",
    "views/modules/table_page_m"], function (base, loadRichSelect, loadDataTable, wsEdit, pagedTable) {

    var searchData = {
        "工位类型": "?filter=all&position_type_id=",
        "工位状态": "?filter=all&free_or_work="
    };

    var search = function () {
        var $$suppliers = $$("richselectSuppliers");
        var supplierList = $$suppliers.getPopup().getList();
        var supplier = supplierList.getItem($$suppliers.getValue());

        var end = "&supplier_id=" + supplier.supplier_id;

        var searchType = $$("richselectType").getValue();

        var $$typeValues = $$("richselectTypeValues");
        var typeValueList = $$typeValues.getPopup().getList();
        var typeValue = typeValueList.getItem($$typeValues.getValue());

        var url = "/v1/api/positions" + searchData[searchType] + typeValue.id + end;

        loadDataTable.$load(url, "workStationList", function (obj) {
            if (obj.start_time) {
                obj.status = '服务开始于' + obj.start_time;
            } else {
                obj.status = '空闲中';
            }

            return obj;
        });
    };

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
                            width: 100,
                            click: search
                        }
                    ]
                },
                {
                    view: "datatable",
                    id: "workStationList",
                    resizeColumn: true,
                    columns: [
                        {id: "id", header: "ID", width: 100},
                        {id: "position_lable", header: "工位标识", fillspace: true},
                        {id: "position_type_name", header: "工位类型", width: 300},
                        {id: "status", header: "工位状态", width: 300},
                        {id: "lss_publish_address", header: "视频发布地址", width: 200},
                        {
                            id: "orders",
                            header: "订单详情",
                            width: 100,
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
                    onClick: {
                        showOrders: function (e, data) {
                            var item = this.getItem(data.row);
                            console.log(item);

                            var orderDetail = function (pageNum, startTime) {
                                var query = {
                                    position_id: item.id,
                                    page: pageNum,
                                    size: 10,
                                    start_time: startTime || new Date().toISOString().match(/(\d{4}-\d{2}-\d{2})/)[1]
                                };
                                var queryArray = [], keys = Object.keys(query);
                                for (var i = 0; i < keys.length; i++) {
                                    var key = keys[i];
                                    console.log(key);
                                    queryArray.push(key + '=' + query[key]);
                                }
                                loadDataTable.$loadPagedData('/v1/api/order_position.json?' + queryArray.join('&'), 'wsOrderList', function (obj) {
                                    if (!obj.end_time) {
                                        obj.end_time = "未结束";
                                    }

                                    if (!obj.view_data) {
                                        obj.view_data = "暂不支持此功能";
                                    }

                                    return obj;
                                });
                            };

                            var workStationOrders = webix.ui({
                                view: "window",
                                id: "workStationOrders",
                                head: {
                                    view: "toolbar",
                                    height: 50,
                                    cols: [
                                        {
                                            view: "label",
                                            label: "订单详情",
                                            width: 100
                                        },
                                        {
                                            fillspace: true
                                        },
                                        {
                                            view: "datepicker",
                                            id: "wsOrderListStartTime",
                                            value: new Date(),
                                            format: "%Y-%m-%d",
                                            label: "开始时间: ",
                                            timepicker: false,
                                            width: 300,
                                            on: {
                                                onChange: function (newv, oldv) {
                                                    orderDetail(1, moment(newv).tz("Asia/Shanghai").format("YYYY-MM-DD"));
                                                }
                                            }
                                        }
                                    ]
                                },
                                width: 1000,
                                height: 600,
                                position: "center",
                                modal: true,
                                css: "hell animation",
                                body: {
                                    rows: [
                                        pagedTable.$create_page_table('wsOrderListPage', {
                                            view: "datatable",
                                            id: "wsOrderList",
                                            columns: [
                                                {id: "id", header: "ID", width: 100},
                                                {id: "order_id", header: "订单号", fillspace: true},
                                                {id: "start_time", header: "开始时间", width: 200},
                                                {id: "end_time", header: "结束时间", width: 200},
                                                {id: "view_data", header: "视频", width: 200}
                                            ]
                                        }),
                                        {
                                            width: 1000,
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
                                                            workStationOrders.close();
                                                        }, 1000);
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            });
                            workStationOrders.attachEvent("onShow", function () {
                                setTimeout(function () {
                                    $("[view_id='workStationOrders']").removeClass("hell");
                                }, 0);
                            });
                            workStationOrders.show();
                            console.log($$("wsOrderListStartTime").getValue());
                            orderDetail(1);
                            pagedTable.$add_page_callback(orderDetail);
                        },
                        editWorkStation: function (e, data) {
                            var item = this.getItem(data.row);
                            console.log(item);

                            var editData = {
                                wsName: item.position_lable,
                                wsType: item.position_type_id
                            };

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
                                            workStationEdit.close();
                                        }, 1000);
                                    },
                                    okCallback: function () {
                                        var values = $$("wsEditForm").getValues();
                                        values.wsName = values.wsName.replace(/^\s*|\s*$/g, '');

                                        if (!values.wsName) {
                                            webix.message({type: "error", expire: 5000, text: "请输入工位名称!"});
                                            return;
                                        }

                                        base.postReq("/v1/api/position/update.json", {
                                            "id": item.id,
                                            "supplier_id": item.supplier_id,
                                            "position_type_id": values.wsType,
                                            "position_lable": values.wsName,
                                            "lss_publish_address": values.lss_publish_address
                                        }, function () {
                                            webix.message({type: "info", expire: 5000, text: "修改成功! 请同时在摄像设备上更新数据! "});
                                        });
                                    }
                                })
                            });
                            workStationEdit.attachEvent("onShow", function () {
                                wsEdit.$oninit();
                                $$("wsEditForm").parse(editData);
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
                                        base.postReq("/v1/api/position/delete.json?id=" + item.id, {}, function () {
                                            webix.message({type: "info", expire: 5000, text: "删除成功!"});
                                            search();
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        },
        $oninit: function (app, scope) {
            $$("title").parse({title: "工位管理", details: "工位列表"});
            loadRichSelect.$load4WorkStation();
        }
    };
});
