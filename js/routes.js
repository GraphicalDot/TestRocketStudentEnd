//Ensure that every route is accessible only when the user is looged in 

define(['./newapp'], function(newapp) {
    'use strict';
    return newapp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/index');
        $stateProvider
        .state('app',{
            url: '/app',
            templateUrl: 'templates/app.html',
            controller: 'AppCtrl',
            data: {
                    css: 'js/css/app.css'
                }
        })

        .state('app.mock_tests',{
            url: '/mock_tests',
            templateUrl: 'templates/mock_test_list.html',
            controller:'MockTestListCtrl'
            

        })
        //Here onENter function is necessary because if a user refresh its page at /mock_test
        //Then all the params will not be sent to the /mock_test controller as all the 
        //necessary params would be at /mock_tests controller which calls the /mock_test
        //So if user refresh the test when at read_instructions page, he will be taken back
        //to /mock_tests page so that necessary params will be provided

        //If a user tries to refresh the page 
        .state('app.mock_test',{
            //url: '/mock_test?id&pushed_id&attempted&exam&attempted_id&test_name',
            url: '/mock_test',
            params: {
                    id: null,
                    pushed_id: null,
                    attempted: null,
                    exam: null,
                    attempted_id: null, 
                    test_name: null
                 },
            templateUrl: 'templates/mock_test.html',
            onEnter: function($state, $stateParams){
                if(!$stateParams.id && !$stateParams.exam){
                    $state.go('app.mock_tests')
                }
            },
            controller: 'MockTestCtrl'
        })
        .state('app.analysis',{
            url: '/analysis',
            templateUrl: 'templates/cumulative_analysis.html',
            controller: 'CumulativeAnalysisCtrl'
        })     

        .state('main',{
            url: '/main',
            templateUrl: 'main.html',
            controller: 'mainCtrl'
        })

        .state('student_signin',{
            url: '/student_signin',
            templateUrl: 'templates/student_signin.html',
            controller: 'StudentSignInCtrl',

            data: {
           
                }
        })

        .state('student_signup',{
            url: '/student_signup',
            templateUrl: 'templates/student_signup.html',
            controller: 'StudentSignUpCtrl',
            data: {
            
                }
        })
       


    })
});