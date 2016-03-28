define(["views/modules/base", "views/modules/ui_utils", "views/modules/table_page_m"], function (base, uiUtils, tablePage) {
    return {
        $load: function (url, datatableId, transform) {
            uiUtils.$getByIds(datatableId, function ($$datatable) {
                base.getReq(url, function (data) {

                    $$datatable.clearAll();

                    if (data.length) {
                        $$datatable.parse(data.filter(transform || function(obj) { return obj; }));
                    } else {
                        webix.message({type: "error", expire: 5000, text: "没有找到数据!"});
                    }

                    $$datatable.refresh();
                });
            });
        },
        $loadPagedData: function (url, datatableId, transform) {
            uiUtils.$getByIds(datatableId, function ($$datatable) {
                base.getReq(url, function (data) {

                    tablePage.$update_page_items('wsOrderListPage', data);

                    $$datatable.clearAll();

                    if (data.items.length) {
                        $$datatable.parse(data.items.filter(transform || function(obj) { return obj; }));
                    } else {
                        webix.message({type: "error", expire: 5000, text: "没有找到数据!"});
                    }

                    $$datatable.refresh();
                });
            });
        }
    };
});