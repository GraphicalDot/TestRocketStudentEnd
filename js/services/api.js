define(['./module', 'ng-resource'], function (services) {
    'use strict';
    services.service('apiService', ['ngResource'])
        .factory('Ontology', ['$resource', '$rootScope', function ($resource, $rootScope) {
            //Reurns array of objects like <exam_app.models.ontology.Ontology object at 0x7fa3d94955d0>,
            //under the key node
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
                "http://localhost:8080" + '/mock_test',
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
               "http://localhost:8080" + '/mock_test?id'
            );
        }])

        .factory('AttemptedMockTests', ['$resource', '$rootScope', function ($resource, $rootScope) {
            return $resource(
                "http://localhost:8080" + '/attempted_mock_test',
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
                "http://localhost:8080" + '/attempted_mock_test/:id',
                {id: '@id'},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])

        .factory('StudentMockTests', ['$resource', '$rootScope', function ($resource, $rootScope) {
            //Response returned: {'1': {'1': {'attempted': [],
            // 'not_attempted': [{'date_closed': False, 'cutoff': 70.0, 'description': None, 
            //                      'type_id': None, 'difficulty': '1', 'target_exam': '1', 
            //                      'opening_date': 'None', 'pushed_id': None, 'id': 1, 
            //                      'name': u'Stochiometry', 'created_at': '2017-01-24 21:00:00.589864',
            //                       'syllabus': None, 'prerequisite_id': None}, 
            //                  {'date_closed': False, 'cutoff': 30.0, 'description': None, 
            //                  'type_id': None, 'difficulty': '1', 'target_exam': '1', 
            //                  'opening_date': 'None', 'pushed_id': None, 'id': 2, 
            //                  'name': u'StochiometryTwo', 'created_at': '2017-01-24 21:00:32.498534',
            //                   'syllabus': None, 'prerequisite_id': None}]}}, '0': {}, '3': {}, '2': {}, '4': {}}
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

        .factory('StudentMockTestQuestions', ['$resource',  function ($resource, $rootScope) {
            return $resource(
                "http://localhost:8080" + '/student_mock_test_questions',
                {},
                {
                    get: {
                        method: 'GET'
                    }
                }
            );
        }])
});
