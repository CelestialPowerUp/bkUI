define([
    "../libs/engine",
    "views/menus/search",
    "views/menus/mail",
    "views/menus/message",
    "views/menus/profile",
    "views/menus/open_sidebar",
    "views/webix/icon",
    "views/webix/menutree",
],function(engine,search, mail, message, profile, sidebar){

    //Top toolbar

    var mainToolbar = {

        view: "toolbar",
        height:50,
        paddingX:8,
        elements:[
            {view: "label", label: "养爱车系统管理", width: 200},
            /*
             {view: "icon", icon: "search",  width: 45, popup: "searchPopup"},
             {view: "icon", icon: "envelope-o", value: 3, width: 45, popup: "mailPopup"},
             {view: "icon", icon: "comments-o", value: 5, width: 45, popup: "messagePopup"}*/
        ]
    };

    var body = {
        rows:[
            { height: 49, id: "title", css: "title", template: "<div class='header'>#title#</div><div class='details'>( #details# )</div>", data: {text: "养爱车",details:"",title: ""}},
            {
                view: "scrollview", scroll:"xy",id:"main_body",
                body:{ cols:[{ $subview:true}] }
            }
        ]
    };

    var layout = {
        rows:[
            mainToolbar,
            {
                cols:[
                    sidebar,
                    body
                ]
            }
        ]
    };

    return {
        $ui:layout,
        $menu:"app:menu",
        $oninit:function(view, scope){
            scope.ui(search.$ui);
            scope.ui(mail.$ui);
            scope.ui(message.$ui);
            scope.ui(profile.$ui);
            sidebar.$init_data();
        }
    };

});