define(["views/modules/base", "views/modules/ui_utils"], function (base, uiUtils) {

    var richselectData = {
        "工位类型": "/v1/api/position_types?scope=all",
        "工位状态": "/fake/api/wsstatus.json"
    };

    return {
        $load: function (url, richselectId) {
            uiUtils.$getByIds(richselectId, function ($$richselect) {
                base.getReq(url, function (data) {
                    var list = $$richselect.getPopup().getList();
                    list.clearAll();

                    if (data.length) {
                        for (var i = 0; i < data.length; i++) {
                            var obj = data[i];
                            obj.value = obj.name || obj.position_type;
                            list.add(obj);
                        }
                        $$richselect.define("value", list.getIdByIndex(0));
                    } else {
                        webix.message({type: "error", expire: 5000, text: "没有找到数据!"});
                    }

                    $$richselect.refresh();
                });
            });
        },
        $load4WorkStation: function () {
            var self = this;
            self.$load("/v2/api/meta_supplier_list.json?layoff=false", "richselectSuppliers");

            uiUtils.$getByIds("richselectType", function ($$richselectType) {
                self.$load(richselectData[$$richselectType.getText()], "richselectTypeValues");
                $$richselectType.attachEvent("onChange", function (newValueId) {
                    var richselectTypeList = this.getPopup().getList();
                    var url = richselectData[richselectTypeList.getItem(newValueId).value];
                    self.$load(url, "richselectTypeValues");
                });
            });
        },
        $load4AddWorkStation: function () {
            this.$load("/v2/api/meta_supplier_list.json?layoff=false", "wsEditSuppliers");
            this.$load(richselectData["工位类型"], "wsEditType");
            this.$load(richselectData["工位状态"], "wsEditStatus");
        }
    }
});