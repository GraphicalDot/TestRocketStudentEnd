define(['./module', 'underscore'], function (controllers, _) {
    'use strict';
    controllers.controller('MockTestListCtrl', ['$scope', '$state', '$sce', 'Ontology', 'StudentMockTests', 'enums', function ($scope, $state, $sce, Ontology, StudentMockTests, Enums) {
        showLoader();
        $scope.examSubtitle = {
            '1': "Preparing for IITs? Let's get started!",
            '2': "Preparing for NITs & Other Colleges? Let's practice!",
            '3': "Preparing for BITS? Start practicing!",
            '4': "Preparing for Medical Colleges? Begin practicing!",
            '5': "Preparing for AIIMS? Let's begin practicing!",
            '6': "Preparing for NTSE? Let's get started"
        };

        $scope.$sce = $sce;

        var ontology = Ontology.list();

        //""http://localhost:8080" + '/student_mock_test'
        // mocket_tests in this response is a dictionary with taget exams 
        // '0'                                      # institute mock tests
        //'1' full mock tests
            // '2'                                          # part mock tests
            // '3'                                          # subject mock tests
            // '4'                                          # chapter mock tests
        //TARGET_EXAMS = {'1': 'JEE Advanced', '2': 'JEE Mains', '3': 'BITSAT',
        // '4': 'AIPMT', '5': 'AIIMS', '6': 'NTSE'}
        // so mock_tests in response will be a dict of dict with parent dict corresponds to institute_mock_test
        // part_mock_tests, subject_mock_tests, chapter_mock_tests
        // ANd each of this key will then have tests corresponding to target exams, which is
        //also represented by integer keys from 1 to 5.
         //         {'institute_name': None,
         // 'mock_tests': {'0': {},
         //                '1': {'1': {'attempted': [],
         //                            'not_attempted': [{'created_at': '2017-01-24 21:00:00.589864',
         //                                               'cutoff': 70.0,
         //                                               'date_closed': False,
         //                                               'description': None,
         //                                               'difficulty': '1',
         //                                               'id': 1,
         //                                               'name': u'Stochiometry',
         //                                               'opening_date': 'None',
         //                                               'prerequisite_id': None,
         //                                               'pushed_id': None,
         //                                               'syllabus': None,
         //                                               'target_exam': '1',
         //                                               'type_id': None},
         //                                              {'created_at': '2017-01-24 21:00:32.498534',
         //                                               'cutoff': 30.0,
         //                                               'date_closed': False,
         //                                               'description': None,
         //                                               'difficulty': '1',
         //                                               'id': 2,
         //                                               'name': u'StochiometryTwo',
         //                                               'opening_date': 'None',
         //                                               'prerequisite_id': None,
         //                                               'pushed_id': None,
         //                                               'syllabus': None,
         //                                               'target_exam': '1',
         //                                               'type_id': None}]}},
         //                '2': {},
         //                '3': {},
         //                '4': {}}}

        var studentMockTestList = StudentMockTests.list();


        studentMockTestList.$promise.then(function (data) {
            $scope.instituteName = data.institute_name;
            var mockTestsApiResponse = data.mock_tests;
            $scope.studentMockTests = angular.copy(data.mock_tests);
            ontology.$promise.then(function(data) {
                // get ontology
                var nodes = angular.copy(data.nodes);
                $scope.ontology = {};
                nodes.forEach(function(node) {
                    $scope.ontology[node.id] = node;
                   
                });

                // get mock tests that the student has attempted or can attempt
                //This loop willl iterate over 0, 1, 2, 3, 4 present in mock_tests, 
                //so mockTestType will be 0, 1, 2, 3 and 4
                for (var mockTestType in $scope.studentMockTests) {
                    //now for the abpove mentioned response in this case, targetExam 
                    // will only be avilable for mockTestsType 1 as rest are empty
                    for (var targetExam in $scope.studentMockTests[mockTestType]) {

                        //below statement will get name of target exam from the int in mock_tests dict
                        //$scope.Enums.TARGET_EXAMS = {'1': 'JEE Advanced', 
                        //'2': 'JEE Mains', '3': 'BITSAT', '4': 'AIPMT', '5': 'AIIMS', '6': 'NTSE'},
                        $scope.studentMockTests[mockTestType][targetExam].name = $scope.Enums.TARGET_EXAMS[targetExam];
                        $scope.studentMockTests[mockTestType][targetExam].showMore = false;
                        // combine attempted and not attempted mock tests in an array
                        $scope.studentMockTests[mockTestType][targetExam].all = [].concat(
                            $scope.studentMockTests[mockTestType][targetExam].attempted.map(function(mockTest) {
                                mockTest.attempted = true;
                                return mockTest;
                            }),
                            $scope.studentMockTests[mockTestType][targetExam].not_attempted.map(function(mockTest) {
                                mockTest.attempted = false;
                                return mockTest;
                            })
                        );

                        // This block will be executed if mockTestType == "subject mock test"
                        if (mockTestType == '3' && $scope.studentMockTests[mockTestType][targetExam].all.length > 0) {
                            $scope.studentMockTests[mockTestType][targetExam].subjects = {};
                            $scope.studentMockTests[mockTestType][targetExam].all.forEach(function(mockTest) {
                                if (mockTest.type_id in $scope.studentMockTests[mockTestType][targetExam].subjects)
                                    $scope.studentMockTests[mockTestType][targetExam].subjects[mockTest.type_id].mockTests.append(mockTest);
                                else
                                    $scope.studentMockTests[mockTestType][targetExam].subjects[mockTest.type_id] = {
                                        name: $scope.ontology[mockTest.type_id].name,
                                        showMore: false,
                                        mockTests: [mockTest ]
                                    }
                            });
                        }
                        // This block will be executed if mockTestType == "chapter mock test"
                        if (mockTestType == '4' && $scope.studentMockTests[mockTestType][targetExam].all.length > 0) {

                            $scope.studentMockTests[mockTestType][targetExam].chapters = {};
                            if(typeof $scope.studentMockTests[mockTestType].subjects == "undefined"){
                                $scope.studentMockTests[mockTestType].subjects = {}
                            }

                            $scope.studentMockTests[mockTestType][targetExam].all.forEach(function(mockTest) {
                                mockTest.type = "chapter";
                                var subjectNodeIndex = $scope.ontology[mockTest.type_id]['parent_path'][0]
                                var subjectNode = $scope.ontology[subjectNodeIndex]
                                if (subjectNodeIndex in $scope.studentMockTests[mockTestType].subjects) {
                                    $scope.studentMockTests[mockTestType].subjects[subjectNodeIndex]['mockTests'].push(mockTest);
                                }
                                else {
                                    $scope.studentMockTests[mockTestType].subjects[subjectNodeIndex] = {
                                        name: subjectNode.name,
                                        showMore: false,
                                        mockTests: [mockTest ]
                                    }
                                }
                            });

                            $scope.studentMockTests[mockTestType][targetExam].all.forEach(function(mockTest) {
                                mockTest.type = "chapter";
                                if (mockTest.type_id in $scope.studentMockTests[mockTestType][targetExam].chapters) {
                                    $scope.studentMockTests[mockTestType][targetExam].chapters[mockTest.type_id].mockTests.push(mockTest);
                                }
                                else
                                    $scope.studentMockTests[mockTestType][targetExam].chapters[mockTest.type_id] = {
                                        name: $scope.ontology[mockTest.type_id].name,
                                        showMore: false,
                                        mockTests: [mockTest ]
                                    }
                            });

                        }
                    }
                }

                /* add mocks as per name in a different object for chapter wise tests */
                /* main use of this is to show the same named mock tests (of different exams) beside each other */
                var allSubjectMocks = $scope.studentMockTests['4']['subjects'];
                for (var subjectId in allSubjectMocks){
                    var subjectMocks = allSubjectMocks[subjectId];
                    subjectMocks['byName'] = {}
                    var sortByName = false;
                    for (var mockTestIndex in subjectMocks.mockTests){
                        var mockTest = subjectMocks.mockTests[mockTestIndex];
                        if (subjectMocks['byName'].hasOwnProperty(mockTest.name)) {
                            subjectMocks['byName'][mockTest.name].push(mockTest)
                        } else {
                            subjectMocks['byName'][mockTest.name] = [mockTest, ]
                        }
                    }
                    for (var nameIndex in subjectMocks['byName']){
                        var mockTestsNumber = subjectMocks['byName'][nameIndex].length
                        if (mockTestsNumber != 2) {
                             sortByName = true;
                        } else {
                            sortByName = true;
                        }
                    }
                    if (sortByName == true){
                        var mockTestsNameSorted = [];
                        for (var nameIndex in subjectMocks['byName']){
                            mockTestsNameSorted = mockTestsNameSorted.concat(subjectMocks['byName'][nameIndex]);
                        }
                        subjectMocks['mockTests'] = mockTestsNameSorted;
                    }
                        
                        $scope.studentMockTests['4']['subjects'][subjectId] = subjectMocks;
                }

                for (var mockTestType in $scope.studentMockTests){
                    for (var targetExam in $scope.studentMockTests[mockTestType]){
                        if (targetExam == "subjects"){
                            continue;
                        }
                        var mockTests = $scope.studentMockTests[mockTestType][targetExam];
                        if (typeof $scope.studentMockTests[mockTestType].totalTests == "undefined"){
                            $scope.studentMockTests[mockTestType].totalTests = mockTests.all.length;
                            $scope.studentMockTests[mockTestType].attemptedTests = mockTests.attempted.length;
                        }
                        else {
                            $scope.studentMockTests[mockTestType].totalTests += mockTests.all.length;
                            $scope.studentMockTests[mockTestType].attemptedTests += mockTests.attempted.length;
                        }
                    }
                }

                // mixpanel tracking
                // mixpanel.track("Mock Test List Loaded");

                hideLoader();
            });
        });

        $scope.Enums = Enums;

        // view more button click handler
        $scope.showMore = function(mockTestType, targetExamOrSubjectID) {
            if (mockTestType == '1')
                $scope.studentMockTests['1'][targetExamOrSubjectID].showMore = true;
            if (mockTestType == '4')
                $scope.studentMockTests['4'].subjects[targetExamOrSubjectID].showMore = true;
        };

        // view less button click handler
        $scope.showLess = function(mockTestType, targetExamOrSubjectID) {
            if (mockTestType == '1')
                $scope.studentMockTests['1'][targetExamOrSubjectID].showMore = false;
            if (mockTestType == '4')
                $scope.studentMockTests['4'].subjects[targetExamOrSubjectID].showMore = false;

        };

        // When a mock test tile is clicked
        $scope.mockTestClick = function(mockTest, mockTestType, targetExam) {

            var testLocked = mockTest.name.toLowerCase().indexOf('%lock%') > 1;

            // var mixPanelTestState;
            // if (testLocked) {
            //     mixPanelTestState = 'Locked Test';
            // } else if (mockTest.attempted) {
            //     mixPanelTestState = 'Attempted';
            // } else {
            //     mixPanelTestState = 'Not Attempted';
            // }
            // mixpanel.track("Mock Test Tile Click", {
            //     'Test Name': mockTest.name,
            //     'Target Exam': Enums.TARGET_EXAMS[targetExam],
            //     'Test State': mixPanelTestState
            // })

            if (testLocked){
                return true;
            }
            if (mockTest.date_closed == true){
                $scope.modalTitle = 'This test will be opened on ' + mockTest.opening_date + '.'
                $scope.modalContent = $sce.trustAsHtml("Come back on <strong>" + mockTest.opening_date + "</strong> to attempt this one!")
                $('#prerequisiteModal').modal();
                return false;
            }
            if (mockTest.prerequisite_id) {
                for (var mtt in $scope.studentMockTests) {
                    for (var te in $scope.studentMockTests[mtt]) {
                        var prerequisiteMockTest = _.findWhere($scope.studentMockTests[mtt][te].all, {id: mockTest.prerequisite_id});
                        if (prerequisiteMockTest) {
                            if (prerequisiteMockTest.attempted) {
                                showLoader();
                                $state.go('mock_test', {id: mockTest.id, pushed_id: mockTest.pushed_id, attempted: mockTest.attempted, attempted_id: mockTest.attempted_id, exam: targetExam});
                                return false;
                            }
                            else {
                                $scope.modalTitle = 'This test has a pre-requisite';
                                $scope.modalContent = $sce.trustAsHtml('You need to first attempt <strong>' + prerequisiteMockTest.name + '</strong> in order to attempt <strong>' + mockTest.name + '</strong>');
                                $('#prerequisiteModal').modal();
                                return false;
                            }
                        }
                    }
                }
            } else {
                showLoader();
                //$state.go('app.mock_test', {id: mockTest.id, pushed_id: mockTest.pushed_id, attempted: mockTest.attempted, attempted_id: mockTest.attempted_id, exam: targetExam, test_name: mockTest.name});
                $state.go('app.mock_test', {id: mockTest.id, pushed_id: 0, attempted: mockTest.attempted, attempted_id: mockTest.attempted_id, exam: targetExam, test_name: mockTest.name});
            }

        };

        $scope.mockTestRowSize = 3;
    }]);
});

 