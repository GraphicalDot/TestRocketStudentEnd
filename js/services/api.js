//To get more insights visit https://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/

define(['./module', 'ng-resource'], function (services) {
    'use strict';
     var baseUrl = 'http://localhost:8080';
    services.service('apiService', ['ngResource'])
        .factory('Ontology', ['$resource', '$rootScope', function ($resource, $rootScope) {
            //Reurns array of objects like <exam_app.models.ontology.Ontology object at 0x7fa3d94955d0>,
            //under the key node
            return $resource(
                baseUrl + '/ontology',
                {},
                {
                    list: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('MockTests', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                baseUrl + '/mock_test',
                {},
                {
                    list: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('MockTest', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
               baseUrl + '/mock_test?id'
            );
        }])

        .factory('AttemptedMockTests', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                baseUrl + '/attempted_mock_test',
                {},
                {
                    list: {
                        method: 'GET'
                    },

                    submitpost: {
                        method: 'POST', 

                    }
                }
            );
        }])

        .factory('AttemptedMockTest', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                baseUrl + '/attempted_mock_test/:id',
                {id: '@id'},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('StudentMockTests', ['$resource', '$rootScope', function ($resource, $rootScope) {
            //called from mock_test?_list.js to fetch all kinds of tests for the student
            return $resource(
                baseUrl + '/student_mock_test',
                {},
                {
                    list: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('StudentMockTestQuestions', ['$resource',  function ($resource, $rootScope) {
            return $resource(
                baseUrl + '/student_mock_test_questions',
                {},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])
});
