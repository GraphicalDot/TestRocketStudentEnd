"use strict";
require("core-js/es6");
require("core-js/es7/reflect");
require("reflect-metadata");
require("zone.js/dist/zone");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_module_1 = require("./app/app.module");
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
