define(['./module', 'ng-resource'], function (services) {
    'use strict';
    services.service('apiService', ['ngResource'])
        .factory('Ontology', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                "http://localhost:8080" + '/ontology',
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
                $rootScope + '/mock_test',
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
                $rootScope + '/mock_test?id'
            );
        }])

        .factory('AttemptedMockTests', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                $rootScope + '/attempted_mock_test',
                {},
                {
                    list: {
                        method: 'GET'
                    },

                    submit: {
                        method: 'POST'
                    }
                }
            );
        }])

        .factory('AttemptedMockTest', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                $rootScope + '/attempted_mock_test/:id',
                {id: '@id'},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('StudentMockTests', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                "http://localhost:8080" + '/student_mock_test',
                {},
                {
                    list: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('StudentMockTestQuestions', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                $rootScope + '/student_mock_test_questions',
                {},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])
});
