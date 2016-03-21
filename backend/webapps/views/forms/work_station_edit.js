define(["views/modules/load_richselect"], function (loadRichSelect) {
    return {
        $getUI: function (configs) {
            var elements = [
                {
                    view: "text",
                    name: "wsName",
                    label: "工位标识",
                    placeholder: "请输入工位标识",
                    labelWidth: "100"
                },
                {
                    view: "richselect",
                    id: "wsEditType",
                    name: "wsType",
                    label: "工位类型",
                    options: [],
                    placeholder: "请选择工位类型",
                    labelWidth: "100"
                },
                {
                    view: "richselect",
                    id: "wsEditStatus",
                    name: "wsStatus",
                    label: "工位状态",
                    options: [],
                    placeholder: "请选择工位状态",
                    labelWidth: "100"
                }
            ];

            if (configs.topElement) {
                elements.splice(0, 0, configs.topElement);
            }

            configs.onHide = configs.onHide || function () {};

            return {
                rows: [
                    {
                        view: "toolbar",
                        height: 30,
                        cols: []
                    },
                    {
                        view: "form",
                        width: 800,
                        elements: elements
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
                                    configs.onHide();
                                }
                            },
                            {
                                view: "button",
                                id: "cancelButton",
                                value: "取消",
                                width: 100,
                                click: function () {
                                    configs.onHide();
                                }
                            }
                        ]
                    }
                ]
            }
        },
        $oninit: function () {
            loadRichSelect.$load4AddWorkStation();
        }
    };
});