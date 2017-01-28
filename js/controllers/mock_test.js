//mockTestInstructions
//enums are all custom services present in services folder


//This controllers html has three sections which can be shown or hide based on the ng-show directives
//"testRunning && (showInstructions || showQuestion || showQuestionList)
// If one div ng-show directive is true, rest are hidden  
//  ng-show="showInstructions"
// If a user clickson the instructions button then this will become active and rest will hide
//  ng-show="showQuestion"
// 
//  ng-show="showQuestionList" 
//      This is to show all the questions all toghther in a list
//  ng-show="showAnalysis">
// If after the test user clicks on analysis, then rest will hide and this iwll be shown 

// then the footer 
//http://stackoverflow.com/questions/20623118/rendering-directives-within-sce-trustashtml
// $sce.trustAsHtml and ng-bind-html are not meant to build HTML with directives. This technique will not work.

// This is because angular works by first compiling and then linking. See the conceptual overview for a good explaination.

// In short, by the time you link the HTML defined in your trustAsHtml, it is too late for angular to compile (and therefore understand) the ng-click directive.

// In order to dynamically add HTML, you should be looking at the $compile service (and/or directives). Docs are here.



define(['./module', 'store', 'mathjax'], function (controllers, store, MathJax) {
    'use strict';
    controllers.controller('MockTestCtrl', ['$scope', '$rootScope', '$state', '$interval', '$timeout', '$sce', 'Ontology', 'AttemptedMockTests',
        'AttemptedMockTest', 'StudentMockTestQuestions', 'enums', 'subjectClassMap', 'mockTestInstructions', '$document', 
        function ($scope, $rootScope, $state, $interval, $timeout, $sce, Ontology, AttemptedMockTests, AttemptedMockTest,
         StudentMockTestQuestions, Enums, subjectClassMap, mockTestInstructions, $document) {
            console.log($state.params.id, $state.params.pushed_id) 

            var setAttemptViewStyle = function() {
                $timeout(function() {
                    var headerPlusMargin = 65;
                    var attemptViewHeight = $(window).height()-headerPlusMargin;
                    $('#attemptView').css('height', attemptViewHeight);
                    var overviewPlusMargin = 48;
                    var saveContainer = 45;
                    var questionContainer = attemptViewHeight-(overviewPlusMargin+saveContainer);
                    $('.questionContainer').css('height', questionContainer);
                    var submitContainer = 135;
                    $('.navigationContainer').css('height', attemptViewHeight-(overviewPlusMargin+submitContainer));
                    $('.question-view').css('height', questionContainer);
                    $('.save-view').css('top', questionContainer);
                }, 500);
            };

            window.onresize = function(event) {
                setAttemptViewStyle();
            };
	    
            /*var fixMathJaxRendering = function() {
              $('span.math[id^=MathJax-Span-]>span:nth-child(2)').css('border-left-style', '');
            };*/
	    
            $scope.Enums = Enums;
            $scope.sce = $sce;
            $scope.examName = Enums.TARGET_EXAMS[$state.params.exam];
            $scope.testName = $state.params.test_name;
            $scope.getSubjectClassName = function (subjectName) {
                return subjectClassMap[subjectName.toLowerCase().replace(/\W+/g, "-")];
            };

            $scope.startTest = function () {
                /*
                if('1'=='2'){
                    mixpanel.track("Mock Test Started", {
                        'Test Name': $scope.testName,
                        'Target Exam': $scope.examName,
                    });
                }
                */
        
                if (!$scope.mockTest.startConfirmation)
                    return false;
                $state.params.attempted = true;
                new StudentMockTestQuestions.get({
                    mock_test_id: $state.params.id
                }).$promise.then(function (resp) {

                    //{'mock_test': <exam_app.models.mock_test.MockTest object at 0x7f5787500c10>,
                    // subjects: [{u'order': 0,
                    //              u'q_ids': [31, 32, 33, 34, 35,....60],
                    //              'questions': [<exam_app.models.question.Question object at 0x7f57874ba1d0>, ...],
                    //              'subject_id': u'1'}]}
                    /*
                     parser.add_argument('comprehension_text', type=unicode)

        # the next field will be present when a comprehension question is updated
        parser.add_argument('comprehension_id', type=int)

        parser.add_argument('ontology_id', type=int)
        parser.add_argument('nature', type=str)
        parser.add_argument('type', type=str)
        parser.add_argument('difficulty', type=str)
        parser.add_argument('average_time', type=int)
        parser.add_argument('content', type=unicode, required=True)
        parser.add_argument('options', type=options_json_type, required=True)
        parser.add_argument('text_solution', type=unicode)
        parser.add_argument('video_solution_url', type=str)
        parser.add_argument('text_solution_by', type=user_json_type)
        parser.add_argument('video_solution_by', type=user_json_type)
        parser.add_argument('proof_read_categorization', type=int, choices=[0,1])
        parser.add_argument('proof_read_text_solution', type=int, choices=[0,1])
        parser.add_argument('proof_read_video_solution', type=int, choices=[0,1])
        parser.add_argument('error_reported', type=str, choices=['0', '1'])
        */

                        if (resp.error) {
                            alert('Error attempting test');
                            hideLoader();
                            return false;
                        }
                        else {
                            var ontology = Ontology.list();
                            ontology.$promise.then(function (data) {
                                var nodes = angular.copy(data.nodes);
                                $scope.ontology = {};
                                nodes.forEach(function (node) {
                                    $scope.ontology[node.id] = node;
                                });

                                $scope.mock_test = resp.mock_test;
                                $scope.showInstructions = false;
                                //The joib of _.extend function is to include elements or overwrite elements
                                //which werent present or were present in the originla from the newone

                                var startInstant = (new Date()).valueOf();
                                _.extend($scope.mockTest, {
                                    id: $scope.mock_test.id,
                                    name: $scope.mock_test.name,
                                    question_ids: $scope.mock_test.question_ids,
                                    pushed_id: $state.params.pushed_id,
                                    start: startInstant,
                                    end: (new Date()).valueOf() + ($scope.mock_test.duration * 1000) + 2,       // grace of 2 seconds
                                    subjects: resp.subjects.map(function (subject) {
                                        subject.subject_name = $scope.ontology[subject.subject_id].name;
                                        subject.questions.map(function (question) {
                                            _.extend(question, {
                                                time: 0,            // in milliseconds
                                                durations: [],
                                                review: false,
                                                viewed: false,
                                                answered: false,
                                                marked: false,
                                                marked_options: []
                                            });

                                            return question;
                                        });
                                        subject.currentQuestionIndex = 0;
                                        return subject;
                                    }),
                                    answeredCount: 0
                                }); //closing brackets for _.extend function
                                //this function extend each each question with new atrributes like time
                                //durations array, review, answered etc

                                $scope.mockTest.currentSubjectIndex = 0;

                                $scope.mockTest.subjects[0].questions[0].viewed = true;
                                $scope.mockTest.subjects[0].questions[0].durations.push([startInstant]);
                                store.set('currentMockTest', $scope.mockTest);
                                $scope.showQuestion = true;

                                setTime();
                                $scope.timer = $interval(setTime, 1000);
                                $rootScope.testRunning = true;
                                var leavingPageText = "You are attempting a test. Are you sure you want to leave this page?";
                                window.onbeforeunload = function () {
                                    return leavingPageText;
                                };
                                $scope.$on('$destroy', function () {
                                    $rootScope.testRunning = false;
                                    $interval.cancel($scope.timer);
                                    window.onbeforeunload = undefined;
                                });
                                hideLoader();
				setAttemptViewStyle();
                            }); //End of ontology api call promise
                        } //End of else staement on studentMOckTestQuestion promise
                    });

            };

            var recordQuestionTime = function (saveToLocalStorage) {
                var currentSubjectIndex = $scope.mockTest.currentSubjectIndex;
                var currentQuestionIndex = $scope.mockTest.subjects[currentSubjectIndex].currentQuestionIndex;
                var currentTime = (new Date).valueOf();
                $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].time += (currentTime - $scope.lastTick);
                var numDurations = $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].durations.length;
                // update the last duration
                $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].durations[numDurations - 1][1] = currentTime;
                $scope.lastTick = currentTime;
                if (saveToLocalStorage)
                    store.set('currentMockTest', $scope.mockTest);
            };

            var setTime = function () {
                //console.log('tick');
                var currentTime = (new Date).valueOf();
                if ($scope.lastTick) {
                    // not the first second, so store current question time. Edge cases when tab is closed or back pressed and test re visited
                    var currentSubjectIndex = $scope.mockTest.currentSubjectIndex;
                    var currentQuestionIndex = $scope.mockTest.subjects[currentSubjectIndex].currentQuestionIndex;
                    $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].time += (currentTime - $scope.lastTick);
                    var numDurations = $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].durations.length;
                    // update the last duration
                    $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].durations[numDurations - 1][1] = currentTime;
                    store.set('currentMockTest', $scope.mockTest);
                }
                $scope.lastTick = currentTime;
                $scope.timeLeft = Math.floor(($scope.mockTest.end - $scope.lastTick) / 1000);
                if ($scope.timeLeft < 1)
                    $scope.submit();
                var seconds = $scope.timeLeft % 60;
                $scope.timeLeftStr = Math.floor($scope.timeLeft / 60) + ':' + (seconds > 9 ? seconds : '0' + seconds);
            };

            var fixOptions = function(questionId, optionIndicesToKeepChecked) {
                $('div[data-question-options="' + questionId + '"] input[type="checkbox"]').each(function(index, elem) {
                    if (optionIndicesToKeepChecked.indexOf(index) == -1)
                        $(elem).prop('checked', false);
                    else
                        $(elem).prop('checked', true);
                });
            };

            $scope.selectSubject = function (subjectIndex) {
                var currentSubjectIndex = $scope.mockTest.currentSubjectIndex;
                var currentQuestionIndex = $scope.mockTest.subjects[currentSubjectIndex].currentQuestionIndex;

                // if question was not marked for review or attempted then clear marked options
                if (!($scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].review || $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].answered)) {
                    $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].marked_options = [];
                }

                // uncheck not saved options
                fixOptions($scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].id, $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].marked_options);

                // record question time that is going to disappear because subject and question will change
                recordQuestionTime();

                subjectIndex = parseInt(subjectIndex);
                if (subjectIndex == $scope.mockTest.currentSubjectIndex)
                    return;

                // set the scope because subject changed
                $scope.mockTest.currentSubjectIndex = subjectIndex;

                // mark the question that is going to appear as `viewed`
                currentQuestionIndex = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].currentQuestionIndex;
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].viewed = true;

                // start a new duration
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].durations.push([(new Date()).valueOf(),]);

                store.set('currentMockTest', $scope.mockTest);
            };

            $scope.selectQuestion = function (currentSubjectIndex, currentQuestionIndex) {
                var csi = $scope.mockTest.currentSubjectIndex;
                var cqi = $scope.mockTest.subjects[currentSubjectIndex].currentQuestionIndex;

                // if question was not marked for review or attempted then clear marked options
                if (!($scope.mockTest.subjects[csi].questions[cqi].review || $scope.mockTest.subjects[csi].questions[cqi].answered)) {
                    $scope.mockTest.subjects[csi].questions[cqi].marked_options = [];
                }

                // uncheck not saved options
                fixOptions($scope.mockTest.subjects[csi].questions[cqi].id, $scope.mockTest.subjects[csi].questions[cqi].marked_options);

                // record question time that is going to disappear because question will change
                recordQuestionTime();

                currentSubjectIndex = parseInt(currentSubjectIndex);
                currentQuestionIndex = parseInt(currentQuestionIndex);
                if (currentSubjectIndex == $scope.mockTest.currentSubjectIndex)
                    if ($scope.mockTest.subjects[currentSubjectIndex].currentQuestionIndex == currentQuestionIndex)
                        return;

                // set the scope because question changed
                $scope.mockTest.currentSubjectIndex = currentSubjectIndex;
                $scope.mockTest.subjects[currentSubjectIndex].currentQuestionIndex = currentQuestionIndex;

                // mark the question that is going to appear as `viewed`
                $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].viewed = true;

                // start a new duration
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].durations.push([(new Date()).valueOf()]);

                store.set('currentMockTest', $scope.mockTest);

                // if question list is shown then hide it and show the question
                if (!$scope.showQuestion)
                    $scope.showQuestionView();
            };

            $scope.nextQuestion = function () {
                var currentSubjectIndex = $scope.mockTest.currentSubjectIndex;
                var currentQuestionIndex = $scope.mockTest.subjects[currentSubjectIndex].currentQuestionIndex;

                // if question was not marked for review or attempted then clear marked options
                if (!($scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].review || $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].answered)) {
                    $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].marked_options = [];
                }

                // uncheck not saved options
                fixOptions($scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].id, $scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].marked_options);

                // record question time that is going to disappear because question will change
                recordQuestionTime();

                while (true) {
                    // if more questions exist in subject
                    if ($scope.mockTest.subjects[currentSubjectIndex].questions.length > (currentQuestionIndex + 1)) {
                        currentQuestionIndex++;
                        /*// if the next question is not answered
                        if (!$scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].answered)
                            break;*/
                        break;
                    }
                    // if more questions dont exist in subject then move to the next subject
                    else {
                        currentSubjectIndex++;
                        currentQuestionIndex = 0;

                        // if next subject does not exist, then move to first subject, first question
                        if (!$scope.mockTest.subjects[currentSubjectIndex]) {
                            currentSubjectIndex = 0;
                            currentQuestionIndex = 0;
                            break;
                        }

                        /*// if the next question is not answered
                        if (!$scope.mockTest.subjects[currentSubjectIndex].questions[currentQuestionIndex].answered)
                            break;*/
                        break;
                    }
                }

                $scope.mockTest.currentSubjectIndex = currentSubjectIndex;
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].currentQuestionIndex = currentQuestionIndex;
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].viewed = true;

                // start a new duration
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].durations.push([(new Date()).valueOf(),]);

                store.set('currentMockTest', $scope.mockTest);
            };

            $scope.markForReviewAndNext = function () {
                var currentQuestionIndex = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].currentQuestionIndex;
                var currentQuestionId = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].id;
                var selectedOptionIndices = $('div[data-question-options="' + currentQuestionId + '"] input[type="checkbox"]:checked').map(function(){return parseInt($(this).attr('id').split('-')[2]);}).toArray();

                if (selectedOptionIndices.length > 0)
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked_options = selectedOptionIndices;

                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].review = true;
                if (!$scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered)
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answerOrder = ++$scope.mockTest.answeredCount;
                if ($scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked_options.length > 0)
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered = true;
                $scope.nextQuestion();
            };

            $scope.saveAndNext = function () {
                var currentQuestionIndex = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].currentQuestionIndex;
                var currentQuestionId = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].id;
                var selectedOptionIndices = $('div[data-question-options="' + currentQuestionId + '"] input[type="checkbox"]:checked').map(function(){return parseInt($(this).attr('id').split('-')[2]);}).toArray();

                // if any option is marked
                if (selectedOptionIndices.length > 0) {
                    // if the question was not answered before, increase answer order and answered count
                    if (!$scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered)
                        $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answerOrder = ++$scope.mockTest.answeredCount;
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked_options = selectedOptionIndices;
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered = true;
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].review = false;
                }
                $scope.nextQuestion();
            };

            $scope.markOption = function (event, optionIndex) {
                return false;
                /*if (event.target.nodeName.toLowerCase() == 'label')
                    return;
                var action = (event.target.checked ? 'add' : 'remove');
                var currentQuestionIndex = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].currentQuestionIndex;

                if (action == 'add') {
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked = true;
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked_options.push(optionIndex);
                }
                else {
                    var marked_options = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked_options;
                    var index = marked_options.indexOf(optionIndex);
                    marked_options.splice(index, 1);
                    // if no marked option left
                    if (marked_options.length == 0) {
                        $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked = false;

                        // if the question was answered, decrease answer order and answered count
                        if ($scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered) {
                            var answerOrder = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answerOrder;
                            $scope.mockTest.subjects.forEach(function (subject) {
                                subject.questions.forEach(function (question) {
                                    if (question.answerOrder > answerOrder)
                                        question.answerOrder--;
                                });
                            });
                            $scope.mockTest.answeredCount--;
                            delete $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answerOrder;
                        }
                    }
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered = false;
                    $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked_options = marked_options;
                }
                store.set('currentMockTest', $scope.mockTest);
                return false;*/
            };

            $scope.resetQuestion = function () {
                var currentQuestionIndex = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].currentQuestionIndex;
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked = false;
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].review = false;
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].marked_options = [];

                // if the question was answered, decrease answer order and answered count
                if ($scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered) {
                    var answerOrder = $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answerOrder;
                    $scope.mockTest.subjects.forEach(function (subject) {
                        subject.questions.forEach(function (question) {
                            if (question.answerOrder > answerOrder)
                                question.answerOrder--;
                        });
                    });
                    delete $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answerOrder;
                    $scope.mockTest.answeredCount--;
                }
                $scope.mockTest.subjects[$scope.mockTest.currentSubjectIndex].questions[currentQuestionIndex].answered = false;

                store.set('currentMockTest', $scope.mockTest);
            };

            //This is the function which will be executed when the user clicks on Instructions button 
            //on the right hand side of right panel
            $scope.showInstructionsView = function () {
                $scope.showInstructions = true;
                $scope.showQuestion = false;
                $scope.showQuestionList = false;
                window.scrollTo(0, 0);
            };

            //This is the function which will be executed when the user clicks on Question paper button 
            //on the right hand side of right panel
            $scope.showQuestionsView = function () {
                $scope.showInstructions = false;
                $scope.showQuestion = false;
                $scope.showQuestionList = true;
                window.scrollTo(0, 0);
            };

            //This will be called when the user clicks on the Question Paper button, then he 
            //sees all the questions and after that if he want to go back to the test
            $scope.showQuestionView = function () {
                $scope.showInstructions = false;
                $scope.showQuestion = true;
                $scope.showQuestionList = false;
                window.scrollTo(0, 0);
            };


            //This is called when the user clicks on the submit button for finishing up the test.
            // This function will call AttemptedMockTests service and updates a attempted_mock_tests 
            //table in the postgres 
            $scope.submit = function () {
                if('1'=='2'){
                    mixpanel.track("Mock Test Finished", {
                        'Test Name': $scope.testName,
                        'Target Exam': $scope.examName,
                    });
                }
            

                /* 30% time limit on submitting the test */
                /*
                var now = new Date().valueOf();
                if ((now - $scope.mockTest.start) < 300*$scope.mock_test.duration) {
                    alert('Cannot submit test before ' + Math.ceil($scope.mock_test.duration*(1/200)) + ' minutes.');
                    return false;
                }
                */

                showLoader();
                if ($scope.timer)
                    $interval.cancel($scope.timer);
                window.onbeforeunload = undefined;
                var answers = {};
                $scope.mockTest.subjects.forEach(function (subject) {
                    subject.questions.forEach(function (question) {
                        answers[question.id] = {
                            options: question.answered ? question.marked_options.map(function (i) {
                                return parseInt(i);
                            }) : [],
                            time: question.time / 1000,
                            answer_order: question.answer_order,
                            durations: question.durations.map(function (d) {
                                // if duration has any instant
                                if (d.length > 0) {
                                    // for each instant, take its difference from test start time and convert it to seconds
                                    d = d.map(function (i) {
                                        i = i - $scope.mockTest.start;
                                        i = i / 1000;
                                        return i;
                                    });
                                }
                                return d;
                            })
                        }
                    });
                });

                $scope.mockTest.start = $scope.mockTest.start / 1000;
                $scope.mockTest.end = $scope.mockTest.end / 1000;

                console.log("pushed id" + $scope.mockTest.pushed_id)
                console.log("mock_test" + $scope.mockTest.id)
                AttemptedMockTests.submitpost({
                   // pushed_mock_test_id: $scope.mockTest.pushed_id,
                    pushed_mock_test_id: 0,
                    mock_test_id: $scope.mockTest.id,
                    answers: angular.toJson(answers)
                })
                    .$promise.then(function (data) {
                        store.remove('currentMockTest');
                        $rootScope.testRunning = false;
                        $scope.attempted_id = data.attempted_mock_test.id;
                        getAnalysis();
                    }, function(errResponse){
                            console.log(errResponse)

                    });
            };

            $scope.showQuestionList = false;

            $scope.letterAt = function (index) {
                return String.fromCharCode(65 + index);
            };

            $scope.partitionArray = function (arr, size) {
                var newArr = [];
                for (var i = 0; i < arr.length; i += size) {
                    newArr.push(arr.slice(i, i + size));
                }
                return newArr;
            };

            $scope.questionClickQW = function (questionId) {
                $scope.questionsResponse[questionId].expanded = !$scope.questionsResponse[questionId].expanded;
                return false;
            };

            $scope.showConcept = function (questionId) {
                $scope.modalQuestionId = questionId;
                var theory = $scope.ontology[$scope.questionsResponse[questionId].ontology[$scope.questionsResponse[questionId].ontology.length - 1]].theory;
                $scope.questionTheory = theory ? $sce.trustAsHtml(theory) : '';
                $('#conceptModal').modal();
            };

            $scope.showSolution = function (questionId) {
                $scope.modalQuestionId = questionId;
                //$('#solutionModal').on('hidden.bs.modal', function () {
                //    $scope.solutionPlayer.stopVideo();
                //});
                $('#solutionModal').modal();
            };

            $scope.switchToSolution = function(questionId) {
                $('#conceptModal').modal('hide');
                $timeout(function() {
                    $('#solutionModal').modal();
                }, 500)
            };

            $scope.switchToConcept = function(questionId) {
                $('#solutionModal').modal('hide');
                $timeout(function() {
                    $('#conceptModal').modal();
                }, 500)
            };

            $scope.showTopicQuestions = function (topicId) {
                if ($scope.shownTopic == topicId)
                    $scope.shownTopic = null;
                else
                    $scope.shownTopic = topicId;
            };

            $scope.showMAnalysis = function () {
                $scope.showAnalysis1 = true;
                $scope.showAnalysis2 = false;
            };

            $scope.showQAnalysis = function () {
                if('1'=='2'){
                    mixpanel.track("Mock Test Question Analysis Loaded", {
                        'Test Name': $scope.testName,
                        'Target Exam': $scope.examName,
                    });
                }            
                $scope.showAnalysis1 = false;
                $scope.showAnalysis2 = true;
                window.scrollTo(0, 0);

                /*
                // Render MathJax
                var contents = $('script[type="math/mml"]');
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

                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                */

            };

            $scope.correctnessFilter = 'all';
            $scope.showFilteredQuestions = function (event, val) {
                var target = event.currentTarget;
                if (target.checked)
                    $scope.correctnessFilter = val;
                return false;
            };

            $scope.scrollToQuestion = function (questionId) {
                var elems = document.querySelectorAll('[data-scroll-qid="' + questionId + '"]');
                if (elems.length > 0) {
                    var someElement = angular.element(elems[0]);
                    $document.scrollToElement(someElement);
                }
            };

            $scope.scrollToSubject = function (subjectId) {
                $scope.showQAnalysis();
                $timeout(function () {
                    var elems = document.querySelectorAll('[data-scroll-sid="' + subjectId + '"]');
                    if (elems.length > 0) {
                        var someElement = angular.element(elems[0]);
                        $document.scrollToElement(someElement);
                    }
                }, 50);
            };

            var getAnalysis = function () {
                if('1'=='2'){
                    mixpanel.track("Mock Test Main Analysis Loaded", {
                        'Test Name': $scope.testName,
                        'Target Exam': $scope.examName,
                    });
                }

                var ontology = Ontology.list();
                ontology.$promise.then(function (data) {
                    var nodes = angular.copy(data.nodes);
                    $scope.ontology = {};
                    nodes.forEach(function (node) {
                        $scope.ontology[node.id] = node;
                    });

                    var id = $state.params.attempted_id ? $state.params.attempted_id : $scope.attempted_id;
                    AttemptedMockTest.get({id: id}).$promise.
                        then(function (data) {
                            $scope.analysis = data.attempted_mock_test.analysis;
                            if (!$scope.analysis) {
                                alert('Error getting analysis');
                                return false;
                            }
                            for (var subjectId in $scope.analysis.subjects) {
                                $scope.analysis.subjects[subjectId].selected = 'all';
                            }
                            $scope.answers = data.attempted_mock_test.answers;
                            $scope.mockTestName = data.mock_test.name;
                            $scope.mockTestResponse = data.mock_test;
                            $scope.pdf_report_url = data.attempted_mock_test.pdf_report_url;
                            $scope.questionsResponse = {};
                            data.questions.forEach(function (question) {
                                question.expanded = false;
                                $scope.questionsResponse[question.id] = question;
                            });
                            $scope.showQuestion = false;
                            $scope.showQuestionList = false;
                            $scope.showInstructions = false;
                            $scope.showAnalysis = true;
                            $scope.showAnalysis1 = true;
                            $scope.showAnalysis2 = false;
                            $timeout(function () {
                                $('input[type="radio"][value="all"]').each(function (i, elem) {
                                    elem.checked = true;
                                });
                                /*$('.modal').on('shown.bs.modal', function(){
                                    $('body').css({overflow: 'hidden'});
                                });
                                $('.modal').on('hide.bs.modal', function(){
                                    $('body').css({overflow: 'visible'});
                                });*/
                            }, 2e3);
                            $(window).scroll(function (event) {
                                var subjectPanel = $('.subject-questions').first();
                                if (!(subjectPanel && $(subjectPanel).offset()))
                                    return false;
                                var diff = $(subjectPanel).offset().top - $(window).scrollTop();
                                if (diff >= 0) {
                                    $('.filter-sidebar').css('top', diff + 'px');
                                } else {
                                    $('.filter-sidebar').css('top', '20px');
                                }
                            });
                            hideLoader();
                        });

                });
            };

            var currentMockTest = store.get('currentMockTest');

            // test has been attempted, show analysis
            if ($state.params.attempted == 'true') {
                store.remove('currentMockTest');
                getAnalysis();
                return;
            }
            // attempt test
            else {
                $scope.showAnalysis = false;
                // no test not started yet in this or some other tab of the current browser
                if (!currentMockTest) {
                    $scope.mockTest = {
                        startConfirmation: false
                    };
                    $scope.instructionFileName = mockTestInstructions[$state.params.exam];
                    $scope.showInstructions = true;

                }
                // test already started from some other tab of the current browser
                else {
                    // if the running test has same pushed id and same mock test id as supplied in the url
                    if (currentMockTest && currentMockTest.pushed_id == ($state.params.pushed_id ? parseInt($state.params.pushed_id) : undefined) &&
                        currentMockTest.id == parseInt($state.params.id)) {
                        $scope.mockTest = currentMockTest;
                        // if running test has time remaining then show question to attempt
                        if (currentMockTest.end > (new Date).valueOf()) {
                            $scope.showQuestion = true;
                            setTime();
                            $scope.timer = $interval(setTime, 1000);
                            $rootScope.testRunning = true;
                            var leavingPageText = "You are attempting a test. Are you sure you want to leave this page?";
                            window.onbeforeunload = function () {
                                return leavingPageText;
                            };
                            $scope.$on('$destroy', function () {
                                $rootScope.testRunning = false;
                                $interval.cancel($scope.timer);
                                window.onbeforeunload = undefined;
                            });
                            $scope.showAnalysis = false;
                            setAttemptViewStyle();
                        }
                        // if running test has no time remaining then submit test
                        else
                            $scope.submit();
                    }
                    // if the running test has different pushed id or different mock test id as supplied in the url
                    else {
                        currentMockTest = null;
                        store.remove('currentMockTest');
                        $scope.mockTest = {
                            startConfirmation: false
                        };
                        $scope.showInstructions = true;
                    }
                    $scope.instructionFileName = mockTestInstructions[$state.params.exam];
                }
            }
            hideLoader();
        }]);
});
