define(["views/modules/base", "views/modules/upload"], function (base, upload) {

    var cache = {};

    var on_event = {
        "open-link": function (e, id, node) {
            var link = $(node).siblings('input').val();

            console.log(link);

            if (!link) {
                webix.alert({
                    text: "链接内容为空！", ok: "是的"
                });
                return;
            }

            window.open(link);
        },
        "submit-data": function (e, id, node) {
            var banner = $$('banners_view').getItem(id);
            banner.image_url = $(node).siblings('.image-view').css('background').match(/url\((.*)\)/)[1];
            banner.link_url = $(node).siblings('input').val();
            console.log(banner);

            if (!banner.image_url) {
                webix.alert({
                    text: "图片为空！", ok: "是的"
                });
                return;
            }

            if (!banner.link_url) {
                webix.alert({
                    text: "链接地址为空！", ok: "是的"
                });
                return;
            }

            banner.id = banner.banner_id;

            var url = "";
            if (banner.banner_id) {
                url = "/v2/api/store/banner/update";
            } else {
                url = "/v2/api/store/banner/create";
            }

            base.postReq(url, banner, function () {
                refresh();
            });
        },
        "delete-data": function (e, id, node) {
            var banner = $$('banners_view').getItem(id);
            console.log(banner);

            if (!banner.banner_id) {
                webix.alert({
                    text: "未入库元素无需删除！", ok: "是的"
                });
                return;
            }

            webix.confirm({
                text: "删除该Banner<br/> 确定?", ok: "是的", cancel: "取消",
                callback: function (res) {
                    if (res) {
                        base.postReq("/v2/api/store/banner/delete", {
                            id: banner.banner_id
                        }, function () {
                            refresh();
                        });
                    }
                }
            });
        },
        "image-view": function (e, id, node) {
            var banner = $$('banners_view').getItem(id);
            console.log(banner);
            var uid = 'banner' + banner.banner_id;
            $(node).attr('id', uid);
            if (cache[uid]) {
                return;
            }

            upload.$bind_upload(uid, function (data) {
                if (data.code === '00000' && data.data != null) {
                    banner.image_url = data.data['raw_url'];
                    console.log(banner);
                    $$('banners_view').updateItem(id, banner);
                    //$$('banners_view').render(id);
                    cache[uid] = undefined;
                }
            });
            cache[uid] = true;
            setTimeout(function () {
                $(node).click();
            }, 1);
        }
    };

    var data_view = {
        id: 'banners_view',
        view: "dataview",
        container: "dataA",
        drag: true,
        type: {
            width: 761,
            height: 334,
            template: "http->views/store_banner_template.html"
        },
        onClick: on_event
    };

    var add_one_view = {
        id: 'add_one_view',
        view: "button",
        container: "dataB",
        label: "添加一个",
        type: {
            width: 761,
            height: 100
        },
        click: function (e, id, node) {
            var banners_view = $$('banners_view');
            var size = banners_view.count();
            var banner = banners_view.getItem(banners_view.getIdByIndex(size - 1));

            if (!banner.banner_id) {
                webix.alert({
                    text: "还有一条记录未入库！", ok: "是的"
                });
                return;
            }

            var add_data = {
                image_url: "",
                link_url: "",
                rank: size + 1
            };
            banners_view.add(add_data, size);
        }
    };

    var rerange_view = {
        id: 'rerange_view',
        view: "button",
        container: "dataC",
        label: "重新排序",
        type: {
            width: 761,
            height: 100
        },
        click: function (e, id, node) {
            var banners_view = $$('banners_view');
            var size = banners_view.count();
            var order = [], last_rank = 0, is_mod = false;

            for (var i = 0; i < size; i++) {
                var banner = banners_view.getItem(banners_view.getIdByIndex(i));
                if (last_rank > banner.rank) {
                    is_mod = true;
                }
                last_rank = banner.rank;
                order.push(banner.banner_id);
            }

            if (!is_mod) {
                webix.alert({
                    text: "没有修改顺序，无需提交！", ok: "是的"
                });
                return;
            }

            webix.confirm({
                text: "重新排序<br/> 确定?", ok: "是的", cancel: "取消",
                callback: function (res) {
                    if (res) {
                        base.postReq("/v2/api/store/banner/rerange", {order: order}, function () {
                            refresh();
                        });
                    }
                }
            });
        }
    };

    var refresh = function () {
        $$('banners_view').clearAll();
        base.getReq("/v2/api/store/banners.json", function (banners) {
            for (var i = 0; i < banners.length; i++) {
                banners[i].rank = i + 1;
                banners[i].banner_id = banners[i].id;
                banners[i].id = undefined;
            }
            console.log(banners);
            $$('banners_view').parse(banners);
        })
    };

    var layout = {
        paddingY: 15,
        paddingX: 15,
        cols: [{
            margin: 15, type: "clean", rows: [data_view, add_one_view, rerange_view]
        }]
    };

    return {
        $ui: layout,
        $oninit: function () {
            webix.$$("title").parse({title: "商城管理", details: "轮播广告"});
            refresh();
        }
    }

});