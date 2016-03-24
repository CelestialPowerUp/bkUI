define(["views/modules/base", "views/modules/ui_utils"], function (base, uiUtils) {
    return {
        $load: function (url, datatableId) {
            uiUtils.$getByIds(datatableId, function ($$datatable) {
                base.getReq(url, function (data) {
                    $$datatable.clearAll();

                    if (data.length) {
                        $$datatable.parse(data);
                    } else {
                        webix.message({type: "error", expire: 5000, text: "没有找到数据!"});
                    }

                    $$datatable.refresh();
                });
            });
        }
    };
});