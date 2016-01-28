/**
 * Created by wangwra on 2015/11/6.
 */

define(function(){

   var popu = {
       view: "popup",
       id: "pp_menu",
       width: 80,
       borderless:false,
       padding:0,
       body:{type: "clean", borderless:true,
           rows:[
               {
                   id:"item_list",
                   view: "list",
                   autoheight: true,
                   data: [],
                   type:{
                       height: 35,
                       template: "<span class='text'>#label#</span>"
                   },
                   on:{"onItemClick":function(id, e, node){
                       var event = this.getItem(id);
                       $$("pp_menu").hide();
                       if(typeof event.click === 'function'){
                           event.click(event);
                       }
                   }}
               }
           ]
       }
   };

    var add_menus = function(menus){
        $$("item_list").clearAll();
        for(var a in menus){
            $$("item_list").add(menus[a]);
        }
    }

    return {
        $ui:popu,
        $add_menus:add_menus
    }
});