define(["views/modules/base", "views/modules/ui_utils"], function (base, uiUtils) {
    return {
        $load: function (url, datatableId) {
            uiUtils.$getByIds(datatableId, function ($$datatable) {
                base.getReq(url, function (data) {
                    if (!data.length) {
                        return;
                    }

                    $$datatable.clearAll();
                    $$datatable.parse(data);
                    $$datatable.refresh();
                });
            });
        }
    };
});