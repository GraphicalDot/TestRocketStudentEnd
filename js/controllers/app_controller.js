define(['./module', 'underscore', 'highcharts', 'store', 'jquery'], function (controllers, _, highcharts, store, $) {
    'use strict';
    controllers.controller('AppCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
            $rootScope.logout = function(){
                store.remove('user');
                location.href = '/';
            };
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

             var user = store.get('user');

    // if redirected from successful signup/signin then set user
    /*
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
    */
    if (!user)
        $state.transitionTo('student_signin')
        //location.hash = '/student_signin';
    else {
        

            $rootScope.user = store.get('user');
            $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('student' + '|' + $rootScope.user.id + ":" + $rootScope.user.password);
            if (location.hash == '' || location.hash.slice(1).trim() == '')
                $state.transitionTo('mock_tests');
            if('1'=='2'){
                mixpanel.identify($rootScope.user.email);
                mixpanel.people.set({
                    'name': $rootScope.user.name,
                    'type': 'student',
                    'email': $rootScope.user.email
                });
            }
    }

            }]);



});
