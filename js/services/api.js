define(['./module', 'ng-resource'], function (services) {
    'use strict';
    services.service('apiService', ['ngResource'])
        .factory('Ontology', ['$resource', function ($resource) {
            return $resource(
                '/api' + '/ontology',
                {},
                {
                    list: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('MockTests', ['$resource', function ($resource) {
            return $resource(
                '/api' + '/mock_test',
                {},
                {
                    list: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('MockTest', ['$resource', function ($resource) {
            return $resource(
                '/api' + '/mock_test?id'
            );
        }])

        .factory('AttemptedMockTests', ['$resource', function ($resource) {
            return $resource(
                '/api' + '/attempted_mock_test',
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

        .factory('AttemptedMockTest', ['$resource', function ($resource) {
            return $resource(
                '/api' + '/attempted_mock_test/:id',
                {id: '@id'},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('StudentMockTests', ['$resource', function ($resource) {
            return $resource(
                '/api' + '/student_mock_test',
                {},
                {
                    list: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('StudentMockTestQuestions', ['$resource', function ($resource) {
            return $resource(
                '/api' + '/student_mock_test_questions',
                {},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])
});
