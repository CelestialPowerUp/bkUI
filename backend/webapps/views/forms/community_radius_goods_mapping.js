define(["views/modules/base"],function(base){

    var external_product_id = null;

    var list_ui = {
        view: "list",
        css: "tasks_list",
        id:"type_list",
        height:250,
        width:350,
        type: {
            height: 35,
            marker: function(obj){
                return "<span class='webix_icon_btn fa-bell-o marker "+obj.product_name+"' style='max-width:32px;' ></span>";
            },
            check:  webix.template('<span class="webix_icon_btn fa-{obj.$check?check-:}square-o list_icon" style="max-width:32px;"></span>'),
            template: function(obj,type){
                return "<div class='"+(obj.$check?"":"")+"'>"+type.check(obj)+"<span class='list_text'>"+obj.product_name+"</div>";
            }
        },
        data: [],
        on: {
            onItemClick:function(id){
                var item = this.getItem(id);
                var datas = $$("type_list").serialize();
                for(var i=0;i<datas.length;i++){
                    if(datas[i].product_id === item.product_id){
                        datas[i].$check = true;
                        continue;
                    }
                    datas[i].$check = false;
                }
                $$("type_list").refresh();
            }
        }
    };

    var button_ui = {cols:[{},{view:"button",label:"确定",width:80,click:function(){
        var datas = $$("type_list").serialize();
        var formdata = {outer_id:external_product_id};
        for(var i=0;i<datas.length;i++){
            if(datas[i]['$check']){
                formdata.local_id=datas[i].id;
            }
        }

        if(external_product_id===null){
            base.$msg.error("更新失败,社区半径参数获取失败");
            return ;
        }
        base.postReq("/v1/api/radius/product_mapping.json",formdata,function(data){
            webix.message("社区半径商品关联成功");
            webix.$$("model_win").close();
        });
    }},
        {view:"button",label:"取消",width:80,click:function(){
            webix.$$("model_win").close();
        }}]};

    var layout = {
        view:"window", modal:true, id:"model_win", position:"center",
        head:"服务商类型配置",
        body:{
            type:"space",
            rows:[list_ui,button_ui]
        }
    };

    var init_data = function(check_data){
        external_product_id = check_data;
            base.getReq("/v1/api/meta_products.json",function(data){
                $$("type_list").clearAll();
                //for(var i = 0;i<data.length;i++){
                //    data[i] = parse_check_data(data[i],check_type);
                //}
                $$("type_list").parse(data);
            });
    };

    var parse_check_data = function(obj,arrs){
        obj.$check = false;
        for(var i=0;i<arrs.length;i++){
            if(arrs[i]['type']===obj['type']){
                obj.$check=true;
                break;
            }
        }
        return obj;
    };

    return {
        $ui:layout,
        $init_data:init_data
    }

});