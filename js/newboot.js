define([
    'require',
    'angular',
    'newapp',
    'routes',
    'jquery',
    'store',
    'underscore',
    'bootstrap',
    'custom',
    'canvas',
    'highcharts-ng'
], function (require, ng, newapp, routes, $, store, _) {
    'use strict';

    /*
     * place operations that need to initialize prior to app start here
     * using the `run` function on the top-level module
     */
    
    require(['domReady!'], function (document) {
        ng.bootstrap(document, ['newapp']);
    });
});