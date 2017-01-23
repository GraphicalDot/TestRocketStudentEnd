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
                for (var mockTestType in $scope.studentMockTests) {
                    for (var targetExam in $scope.studentMockTests[mockTestType]) {
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
                $state.go('mock_test', {id: mockTest.id, pushed_id: mockTest.pushed_id, attempted: mockTest.attempted, attempted_id: mockTest.attempted_id, exam: targetExam, test_name: mockTest.name});
            }

        };

        $scope.mockTestRowSize = 3;
    }]);
});
