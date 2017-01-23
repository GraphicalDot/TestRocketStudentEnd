require.config({
    paths: {
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min",
        //"jquery-migrate": "libs/jquery-migrate-1.2.1.min",
        bootstrap: "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/js/bootstrap.min",
        //modernizr: "libs/modernizr.min",
        //retina: "libs/retina.min",
        "chosen-jquery": "//cdnjs.cloudflare.com/ajax/libs/chosen/1.1.0/chosen.jquery.min",
        custom: "./custom",
        'angular': 'libs/angular',
        'ui-router': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router',
        'ng-resource': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.11/angular-resource',
        domReady: 'libs/domReady',
        store: "//cdnjs.cloudflare.com/ajax/libs/store.js/1.3.14/store.min",
        'angular-bootstrap': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.0/ui-bootstrap-tpls',
        underscore: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min",
        mathjax: "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML&amp;delayStartupUntil=configured",
        'angular-youtube-embed': 'libs/angular-youtube-embed.min',
        'angular-scroll': '//cdnjs.cloudflare.com/ajax/libs/angular-scroll/0.6.4/angular-scroll.min',
        highcharts: "//code.highcharts.com/highcharts",
        'highcharts-ng': "libs/highcharts-ng.min",
        canvas: "./canvas",
	angulartics: "libs/angulartics.min"
    },
    waitSeconds: 200,
    shim: {
        angular: {
            exports: 'angular'
        },
        'ui-router': {
            deps: ['angular']
        },
        'ng-resource': {
            deps: ['angular']
        },
        jquery: {
            exports: 'jQuery'
        },
        /*"jquery-migrate": {
            deps: ['jquery']
        },*/
        "chosen-jquery": {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        custom: {
            deps: ['jquery']
        },
        'angular-bootstrap': {
            deps: ['angular', 'bootstrap']
        },
        underscore: {
            exports: '_'
        },
        mathjax: {
            exports: "MathJax",
            init: function () {
                MathJax.Hub.Config({
                    messageStyle: "none",
                    /*tex2jax: {
                        skipTags: ["script", "noscript", "style"],
                        extensions: ["mml2jax.js"]
                    }*/
                });
                MathJax.Hub.Startup.onload();
                return MathJax;
            }
        },
        'angular-youtube-embed': {
            deps: ['angular']
        },
        'angular-scroll': {
            deps: ['angular']
        },
        highcharts: {
            "exports": "Highcharts",
            "deps": ["jquery"]
        },
        'highcharts-ng': {
            deps: ['angular', 'highcharts']
        },
        canvas: {
            deps: ['jquery']
        },
	angulartics: {
            deps: ['angular']
        },
    },
    deps: [
        // kick start application... see boot.js
        './boot'
    ]
});