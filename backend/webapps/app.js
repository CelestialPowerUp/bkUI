/*
	App configuration
*/

define([
	"libs/core",
	"helpers/menu",
	"helpers/locale",
	"helpers/theme",
	"libs/rollbar",
	"libs/webix/codebase/i18n/zh"
], function(core, menu, locale, theme, tracker){

	webix.codebase = document.location.href.split("#")[0].replace("index.html","")+"libs/webix/";
	webix.i18n.setLocale("zh-CN");
	if(!webix.env.touch && webix.ui.scrollSize && webix.CustomScroll)
		webix.CustomScroll.init();

	if (webix.production)
		tracker.init({
			accessToken: '650b007d5d794bb68d056584451a57a8',
			captureUncaught: true,
			source_map_enabled: true,
			code_version:"0.8.0",
			payload: {
				environment: 'production'
			}
		});

	//configuration
	var app = core.create({
		id:			"ycar",
		name:		"养爱车",
		version:	"0.1",
		debug:		true,
		start:		"/app/index"
	});

	app.use(menu);
	app.use(locale);
	app.use(theme);

	return app;
});