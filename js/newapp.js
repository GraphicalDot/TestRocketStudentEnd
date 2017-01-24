'use strict';

//The https://www.startersquad.com/blog/angularjs-requirejs/ here is the link which describes the 
//the holistic level architecture of this application

//For brief introduction to use require.js with angular application
//Read:http://beletsky.net/2013/11/using-angular-dot-js-with-require-dot-js.html

define([
    'angular',
    'store',
    'mathjax',
    'ui-router',
    'ng-resource',
    'angular-bootstrap',
    'angular-youtube-embed',
    'angular-scroll',
    'highcharts-ng',
    'uiRouterStyles',
    './controllers/index',
    './services/index',
    './filters/index',
], function (ng, store, MathJax) {
    'use strict';

    var newapp = ng.module('newapp', [
        'app.filters',
        'app.services',
        'app.controllers',
        'ui.router',
        'ngResource',
        'ui.bootstrap',
        'youtube-embed',
        'duScroll',
        'highcharts-ng',
        "uiRouterStyles"
    ]).controller("entryCtrl", ['$scope', '$rootScope', '$state', '$templateCache', function ($scope, $rootScope, $state, $templateCache) {
            $rootScope.logout = function(){
                store.remove('user');
                location.href = '/';
            };



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
    
            // the popover template block taken from http://stackoverflow.com/a/21979258
            $templateCache.put("template/popover/popover.html",
                "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
                "  <div class=\"arrow\"></div>\n" +
                "\n" +
                "  <div class=\"popover-inner\">\n" +
                "      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n" +
                "      <div class=\"popover-content\"ng-bind-html=\"content | unsafe\"></div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "");









        $rootScope.URL = "http://localhost:8080" //This is the url on which all the backend apis will be accessed
        $rootScope.state = $state;
            $rootScope.$on('$stateChangeStart', function(event, toState,   toParams, fromState, fromParams){
                if(fromState.name == 'mock_test' && $rootScope.testRunning == true){
                    var answer = confirm("You are attempting a test. Are you sure you want to leave this page?");
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });
        }])
        .run(['$rootScope', '$state', '$http', '$templateCache', function($rootScope, $state, $http, $templateCache) {
            // the popover template block taken from http://stackoverflow.com/a/21979258
            $templateCache.put("template/popover/popover.html",
                "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
                "  <div class=\"arrow\"></div>\n" +
                "\n" +
                "  <div class=\"popover-inner\">\n" +
                "      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n" +
                "      <div class=\"popover-content\"ng-bind-html=\"content | unsafe\"></div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "");


            //CHeck if user exists, that means either the user is coming from the signin state
            var user = store.get('user');

            if (!user) {
                console.log("User not signed in ")
                $state.transitionTo('main') 
            } else {
            $rootScope.user = store.get('user');
            $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('student' + '|' + $rootScope.user.id + ":" + $rootScope.user.password);
            $state.transitionTo('app');
            //if (location.hash == '' || location.hash.slice(1).trim() == '')
            /*
            if('1'=='2'){
                mixpanel.identify($rootScope.user.email);
                mixpanel.people.set({
                    'name': $rootScope.user.name,
                    'type': 'student',
                    'email': $rootScope.user.email
                });
            }
            */
        }
            }])
 
    newapp.directive('mathjaxBind', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(function(scope){
                    return attrs.id;
                }, function(html) {
                    var contents = ele.find('script');
                    _.each(contents, function(content){
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, content]);
                        setTimeout(function(){
                            $('.MathJax').each(function () {
                                this.style.setProperty( 'text-align', 'inherit', 'important' );
                                this.style.setProperty( 'display', 'inline-block', 'important' );
                                this.style.setProperty( 'width', 'inherit', 'important' );
                                this.style.setProperty( 'margin', 'initial', 'important' );
                            });
                        }, 1.5e3);
                    });
                });
            }
        };
    });

    return newapp;
});
