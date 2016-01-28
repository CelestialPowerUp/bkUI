define(["views/modules/base", "views/modules/upload"], function (base, upload) {

    var cache_obj = {};

    var submit_data = function (e, id, node) {
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
            webix.alert({
                text: "提交成功！", ok: "是的"
            });
        });
    };
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
        "submit-data": submit_data,
        "delete-data": function (e, id, node) {
            var banner = $$('banners_view').getItem(id);
            console.log(banner);

            if (!banner.banner_id) {
                refresh();
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
        }
    };

    var on_after_render = function () {
        console.log(cache_obj);
        var banners_view = $$('banners_view');
        var size = banners_view.count();
        for (var i = 0; i < size; i++) {
            var banner = banners_view.getItem(banners_view.getIdByIndex(i));
            var idByIndex = banner.id;
            var uid = 'banner' + banner.id;

            $(banners_view.getItemNode(idByIndex)).find('.image-view').eq(0).attr('id', uid);
            if (cache_obj['' + banner.id]) {
                continue;
            }

            console.log(uid);
            upload.$bind_upload(uid, function (data) {
                if (data.code === '00000' && data.data != null) {
                    console.log(JSON.stringify(data));
                    var obj_id = data.tab.match(/banner(.*)/)[1];
                    console.log(obj_id);
                    var last_obj = banners_view.getItem(obj_id);
                    console.log(JSON.stringify(last_obj));
                    last_obj.image_url = data.data['raw_url'];
                    banners_view.updateItem(last_obj.id, last_obj);

                    cache_obj = JSON.parse(JSON.stringify({}));
                    banners_view.render();
                }
            });
            cache_obj['' + banner.id] = true;
        }
    };

    var data_view = {
        id: 'banners_view',
        view: "dataview",
        container: "dataA",
        drag: true,
        type: {
            width: 396,
            height: 165,
            template: "http->views/store_banner_template.html"
        },
        onClick: on_event,
        on: {
            onAfterRender: function () {
                setTimeout(on_after_render, 300);
            },
            onAfterDrop: function (context) {

                cache_obj = JSON.parse(JSON.stringify({}));

                var banners_view = $$('banners_view');
                var size = banners_view.count();
                var last_rank = 0, is_mod = false;

                for (var k = 0; k < size; k++) {
                    var banner = banners_view.getItem(banners_view.getIdByIndex(k));
                    if (last_rank > banner.rank) {
                        is_mod = true;
                    }
                    last_rank = banner.rank;
                }

                if (is_mod) {
                    $('div[view_id="rerange_view"]').show();
                } else {
                    $('div[view_id="rerange_view"]').hide();
                }
            }
        }
    };

    var add_one_view = {
        id: 'add_one_view',
        view: "button",
        container: "dataB",
        label: "添加一个",
        width: 390,
        click: function (e, id, node) {
            var banners_view = $$('banners_view');
            var size = banners_view.count();
            if (size > 0) {

                var abort = false;
                for (var i = 0; i < size; i++) {
                    var banner = banners_view.getItem(banners_view.getIdByIndex(i));
                    if (!banner.banner_id) {
                        abort = true;
                        break;
                    }
                }

                if (abort) {
                    webix.alert({
                        text: "还有一条记录未入库！", ok: "是的"
                    });
                    return false;
                }

            }

            var add_data = {
                image_url: "",
                link_url: "",
                rank: size + 1
            };
            banners_view.add(add_data, size);
            cache_obj = JSON.parse(JSON.stringify({}));
            banners_view.render();
            banners_view.scrollTo(0, 9999);
        }
    };

    var rerange_view = {
        id: 'rerange_view',
        view: "button",
        container: "dataC",
        label: "重新排序",
        width: 390,
        click: function (e, id, node) {
            var banners_view = $$('banners_view');
            var size = banners_view.count();
            var order = [], last_rank = 0, is_mod = false;

            for (var i = 0; i < size; i++) {
                var idByIndex = banners_view.getIdByIndex(i);
                var banner = banners_view.getItem(idByIndex);
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
                text: "重新排序<br/>没有提交的数据将不会被保存<br/>确定?", ok: "是的", cancel: "取消",
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
            $('div[view_id="rerange_view"]').hide();
        });
    };

    var layout = {
        paddingY: 15,
        paddingX: 15,
        cols: [{
            margin: 15, type: "clean", rows: [data_view,
                {
                    cols: [add_one_view, rerange_view]
                }
            ]
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