//BUg $scope.init is executing twice 

define(['./module', 'underscore', 'highcharts', 'store', 'jquery'], function (controllers, _, highcharts, store, $) {
    'use strict';
    controllers.controller('AppCtrl', ['$scope', '$rootScope', '$state', '$http', function ($scope, $rootScope, $state, $http) {
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
        
        var init = function(){
            var user = store.get('user');
            $rootScope.user = user
            console.log(user)
            if (user == undefined){
                $state.transitionTo('student_signin')
                //location.hash = '/student_signin';
            }else {
                console.log("app_controller.js: " + "User: " + $rootScope.user)
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

        }

        init()

        }])
    
});
