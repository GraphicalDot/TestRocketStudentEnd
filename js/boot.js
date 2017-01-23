define([
    'require',
    'angular',
    'app',
    'routes',
    'jquery',
    'store',
    'underscore',
    'bootstrap',
    'custom',
    'canvas',
    'highcharts-ng'
], function (require, ng, app, routes, $, store, _) {
    'use strict';

    /*
     * place operations that need to initialize prior to app start here
     * using the `run` function on the top-level module
     */
    var user = store.get('user');

    // if redirected from successful signup/signin then set user
    if (location.hash.indexOf('#token=') == 0) {
        var token = location.hash.slice(7);
        var tokenParts = token.split('|');
        user = {
            name: atob(tokenParts[3]),
            id: parseInt(tokenParts[2]),
            email: atob(tokenParts[0]),
            password: tokenParts[1],
            target_exams: atob(tokenParts[4]).split(','),
            type: 'student'
        };
        store.set('user', user);
        location.hash = '';
    }
    if (!user)
        location.hash = '/student_signin';
    else {
        window.hideLoader = function() {
            // Page Preloader
            $('#status').fadeOut();
            $('#preloader').delay(50).fadeOut(function(){
                $('body').delay(50).css({'overflow':'visible'});
            });
        };

        window.showLoader = function() {
            // Page Preloader
            $('#status').fadeIn();
            $('#preloader').show();
            $('body').css({'overflow':'visible'});
        };

        window.jQuery = $;
	
        //$(window).load(hideLoader);
    }
    require(['domReady!'], function (document) {
        ng.bootstrap(document, ['app']);
    });
});