define(['./module', 'underscore', 'highcharts', 'store', 'jquery'], function (controllers, _, highcharts, store, $) {
    'use strict';
    controllers.controller('CumulativeAnalysisCtrl', ['$scope', '$state', '$sce', 'Ontology', 'AttemptedMockTests', 'enums',
        'subjectClassMap', '$document', '$timeout', function ($scope, $state, $sce, Ontology, AttemptedMockTests, Enums, subjectClassMap, $document, $timeout) {
            showLoader();
            if('1'=='2')
                mixpanel.track("Cumulative Analysis Loaded");
            $scope.Enums = Enums;
            $scope.sce = $sce;

            $scope.getSubjectClassName = function (subjectName) {
                return subjectClassMap[subjectName.toLowerCase().replace(/\W+/g, "-")];
            };

            $scope.showQAnalysis = function () {
                //Will be executed when the user clicks on the view questionwise analysis button
                $scope.qAnalysisVisisble = true;
                $scope.mAnalysisVisisble = false;
            };

            $scope.showMAnalysis = function () {
                $scope.mAnalysisVisisble = true;
                $scope.qAnalysisVisisble = false;
            };

            $scope.studentTargetExams = [];
            $scope.mockTestTypes = [];
            var user = store.get('user');
            user.target_exams.forEach(function (t) {
                $scope.studentTargetExams.push({id: t, name: Enums.TARGET_EXAMS[t]});
            });
            for (var t in Enums.MOCK_TEST_TYPES) {
                $scope.mockTestTypes.push({id: t, name: Enums.MOCK_TEST_TYPES[t]});
            }
            $scope.selectedExam = -1;
            $scope.selectedType = -1;

            $scope.chart1Config = {

                //This is not a highcharts object. It just looks a little like one!
                options: {
                    //This is the Main Highcharts chart config. Any Highchart options are valid here.
                    //will be ovverriden by values specified below.
                    chart: {
                        type: 'line',
                        backgroundColor: '#FCFCFC',
                    },
                    tooltip: {
                        style: {
                            padding: 10,
                            fontWeight: 'bold'
                        }
                    },
                    legend: {
                        itemWidth: 130,
                        itemMarginTop: 15,
                        itemMarginBottom: 15
                    }
                },
                //The below properties are watched separately for changes.

                //Series object (optional) - a list of series using normal highcharts series options.
                series: [],
                //Title configuration (optional)
                title: {
                    text: '',
                },
                //Boolean to control showng loading status on chart (optional)
                //Could be a string if you want to show specific loading text.
                loading: false,
                //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
                //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
                xAxis: {
                    categories: [],
                    title: {text: 'Tests', margin: 20}
                },
                yAxis: {
                    currentMin: -100,
                    currentMax: 100,
                    title: {text: 'Marks', margin: 20}
                },
                //size (optional) if left out the chart will default to size of the div or something sensible.
                /*size: {
                 width: 650,
                 height: 600
                 },*/
                //function (optional)
                func: function (chart) {
                    //setup some logic for the chart
                }
            };

            $scope.filtersChanged = function () {
                var eligibleMockTests = {};
                var subjects = {};
                for (var amtId in $scope.attemptedMockTests) {
                    var amt = $scope.attemptedMockTests[amtId];
                    var mockTest = $scope.mockTests[amt.mock_test_id];
                    if (parseInt($scope.selectedExam) == -1 || parseInt($scope.selectedExam) == mockTest.target_exam) {
                        if (parseInt($scope.selectedType) == -1 || $scope.selectedType == mockTest.type) {
                            var subjectIds = _.keys(amt.analysis.subjects);
                            subjectIds.forEach(function (sid) {
                                if (!(sid in subjects))
                                    subjects[sid] = [];
                            });
                            eligibleMockTests[amtId] = {
                                id: amtId,
                                subjects: amt.analysis.subjects,
                                attempted_at: new Date(amt.attempted_at).valueOf()
                            }
                        }

                    }
                }

                var xAxisValues = [];
                var yAxisValues = [];
                var max, min;

                var sortedMockTests = _.sortBy(_.values(eligibleMockTests), function (t) {
                    return t.attempted_at;
                });
                sortedMockTests.forEach(function (amt) {
                    for (var sid in subjects) {
                        if (sid in amt.subjects) {
                            var marks = amt.subjects[sid].marks;
                            subjects[sid].push(marks);
                            if (!min)
                                min = marks;
                            else if (marks < min)
                                min = marks;
                            if (!max)
                                max = marks;
                            else if (marks > max)
                                max = marks;
                        }
                        else
                            subjects[sid].push(null)
                    }
                    var name = $scope.mockTests[$scope.attemptedMockTests[amt.id].mock_test_id].name;
                    var type = $scope.Enums.TARGET_EXAMS[$scope.mockTests[$scope.attemptedMockTests[amt.id].mock_test_id].target_exam];
                    xAxisValues.push(name + ' (' + type + ')');
                });

                for (var sid in subjects) {
                    yAxisValues.push({
                        name: $scope.ontology[sid].name,
                        data: subjects[sid]
                    });
                }

                $scope.chart1Config.xAxis.categories = xAxisValues;
                $scope.chart1Config.series = yAxisValues;
                // $scope.chart1Config.size.width = xAxisValues.length*30 > 600 ? xAxisValues.length*30 : 600;
                $scope.chart1Config.yAxis.currentMin = min + (min == 0 ? min : parseInt(min / 2));
                $scope.chart1Config.yAxis.currentMax = max + (max == 0 ? max : parseInt(max / 2));
            };

            $scope.optimumAccuracy = 40;            // percent

            var position = $('<div id="position"/>').css('position', 'absolute');
            var dot = $('<div id="position-dot"/>').css({
                width: '10px',
                height: '10px',
                '-webkit-border-radius': '5px',
                '-moz-border-radius': '5px',
                'border-radius': '5px',
                display: 'inline-block'
            });
            position.append(dot).append($('<span style="padding-left: 2px;">You.<span/>'));

            $scope.showTopicQuestions = function (topicId) {
                if ($scope.shownTopic == topicId)
                    $scope.shownTopic = null;
                else
                    $scope.shownTopic = topicId;
            };

            $scope.letterAt = function (index) {
                return String.fromCharCode(65 + index);
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
                $('#solutionModal').on('hidden.bs.modal', function () {
                    $scope.solutionPlayer.stopVideo();
                }).modal();
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

            $scope.scrollToQuestion = function (questionId) {
                var elems = document.querySelectorAll('[data-scroll-qid="' + questionId + '"]');
                if (elems.length > 0) {
                    var someElement = angular.element(elems[0]);
                    $document.scrollToElement(someElement);
                }
            };

            $scope.scrollToSubject = function (subjectId) {
                $scope.showQAnalysis();
                setTimeout(function () {
                    var elems = document.querySelectorAll('[data-scroll-sid="' + subjectId + '"]');
                    if (elems.length > 0) {
                        var someElement = angular.element(elems[0]);
                        $document.scrollToElement(someElement);
                    }
                }, 50);
            };

            $scope.correctnessFilter = 'all';
            $scope.showFilteredQuestions = function (event, val) {
                var target = event.currentTarget;
                if (target.checked)
                    $scope.correctnessFilter = val;
                return false;
            };

            var ontology = Ontology.list();
            ontology.$promise.then(function (data) {
                var nodes = angular.copy(data.nodes);
                $scope.ontology = {};
                nodes.forEach(function (node) {
                    $scope.ontology[node.id] = node;
                });

                AttemptedMockTests.list().$promise.then(function (data) {
                    $scope.mockTests = {};
                    $scope.attemptedMockTests = data.attempted_mock_tests.length > 0 ? {} : null;
                    $scope.analysis = {
                        subjects: {},
                        topics: {},
                        speed: 0,
                        accuracy: 0
                    };
                    $scope.answers = {};
                    $scope.questionsResponse = {};
                    data.questions.forEach(function (question) {
                        question.expanded = false;
                        $scope.questionsResponse[question.id] = question;
                    });

                    data.mock_tests.forEach(function (mockTest) {
                        $scope.mockTests[mockTest.id] = mockTest;
                    });

                    data.attempted_mock_tests.forEach(function (amt) {
                        $scope.attemptedMockTests[amt.id] = amt;
                        $scope.answers[amt.id] = amt.answers;
                        var subjects = amt.analysis.subjects;
                        $scope.analysis.speed += amt.analysis.speed;
                        $scope.analysis.accuracy += amt.analysis.accuracy;
                        for (var subjectId in subjects) {
                            if (subjectId in $scope.analysis.subjects) {
                                $scope.analysis.subjects[subjectId].correct = $scope.analysis.subjects[subjectId].correct.concat(subjects[subjectId].correct);
                                $scope.analysis.subjects[subjectId].incorrect = $scope.analysis.subjects[subjectId].incorrect.concat(subjects[subjectId].incorrect);
                                $scope.analysis.subjects[subjectId].not_attempted = $scope.analysis.subjects[subjectId].not_attempted.concat(subjects[subjectId].not_attempted);
                                $scope.analysis.subjects[subjectId].correct_t = $scope.analysis.subjects[subjectId].correct_t.concat(subjects[subjectId].correct.map(function (qId) {
                                    return [qId, amt.id];
                                }));
                                $scope.analysis.subjects[subjectId].incorrect_t = $scope.analysis.subjects[subjectId].incorrect_t.concat(subjects[subjectId].incorrect.map(function (qId) {
                                    return [qId, amt.id];
                                }));
                                $scope.analysis.subjects[subjectId].not_attempted_t = $scope.analysis.subjects[subjectId].not_attempted_t.concat(subjects[subjectId].not_attempted.map(function (qId) {
                                    return [qId, amt.id];
                                }));
                                subjects[subjectId].topic_ids.forEach(function (tid) {
                                    if ($scope.analysis.subjects[subjectId].topic_ids.indexOf(tid) == -1)
                                        $scope.analysis.subjects[subjectId].topic_ids.push(tid);
                                });
                                $scope.analysis.subjects[subjectId].marks += subjects[subjectId].marks;
                                $scope.analysis.subjects[subjectId].maximum_marks += subjects[subjectId].maximum_marks;
                                $scope.analysis.subjects[subjectId].perfect_attempts[amt.id] = subjects[subjectId].perfect_attempts;
                                $scope.analysis.subjects[subjectId].overtime_attempts[amt.id] = subjects[subjectId].overtime_attempts;
                                $scope.analysis.subjects[subjectId].wasted_attempts[amt.id] = subjects[subjectId].wasted_attempts;
                                $scope.analysis.subjects[subjectId].completely_wasted_attempts[amt.id] = subjects[subjectId].completely_wasted_attempts;
                            }
                            else {
                                $scope.analysis.subjects[subjectId] = {
                                    name: $scope.ontology[subjectId].name,
                                    correct: subjects[subjectId].correct,
                                    incorrect: subjects[subjectId].incorrect,
                                    not_attempted: subjects[subjectId].not_attempted,
                                    topic_ids: subjects[subjectId].topic_ids,
                                    marks: subjects[subjectId].marks,
                                    maximum_marks: subjects[subjectId].maximum_marks,
                                    correct_t: subjects[subjectId].correct.map(function (qId) {
                                        return [qId, amt.id];
                                    }),
                                    incorrect_t: subjects[subjectId].incorrect.map(function (qId) {
                                        return [qId, amt.id];
                                    }),
                                    not_attempted_t: subjects[subjectId].not_attempted.map(function (qId) {
                                        return [qId, amt.id];
                                    })
                                };
                                $scope.analysis.subjects[subjectId].perfect_attempts = {};
                                $scope.analysis.subjects[subjectId].overtime_attempts = {};
                                $scope.analysis.subjects[subjectId].wasted_attempts = {};
                                $scope.analysis.subjects[subjectId].completely_wasted_attempts = {};
                                $scope.analysis.subjects[subjectId].perfect_attempts[amt.id] = subjects[subjectId].perfect_attempts;
                                $scope.analysis.subjects[subjectId].overtime_attempts[amt.id] = subjects[subjectId].overtime_attempts;
                                $scope.analysis.subjects[subjectId].wasted_attempts[amt.id] = subjects[subjectId].wasted_attempts;
                                $scope.analysis.subjects[subjectId].completely_wasted_attempts[amt.id] = subjects[subjectId].completely_wasted_attempts;
                            }
                        }

                        var topics = amt.analysis.topics;
                        for (var topicId in topics) {
                            if (topicId in $scope.analysis.topics) {
                                $scope.analysis.topics[topicId].correct = $scope.analysis.topics[topicId].correct.concat(topics[topicId].correct);
                                $scope.analysis.topics[topicId].incorrect = $scope.analysis.topics[topicId].incorrect.concat(topics[topicId].incorrect);
                                $scope.analysis.topics[topicId].not_attempted = $scope.analysis.topics[topicId].not_attempted.concat(topics[topicId].not_attempted);
                                $scope.analysis.topics[topicId].correct_t = $scope.analysis.topics[topicId].correct_t.concat(topics[topicId].correct.map(function (qId) {
                                    return [qId, amt.id];
                                }));
                                $scope.analysis.topics[topicId].incorrect_t = $scope.analysis.topics[topicId].incorrect_t.concat(topics[topicId].incorrect.map(function (qId) {
                                    return [qId, amt.id];
                                }));
                                $scope.analysis.topics[topicId].not_attempted_t = $scope.analysis.topics[topicId].not_attempted_t.concat(topics[topicId].not_attempted.map(function (qId) {
                                    return [qId, amt.id];
                                }));
                            }
                            else {
                                $scope.analysis.topics[topicId] = {
                                    name: $scope.ontology[topicId].name,
                                    correct: topics[topicId].correct,
                                    incorrect: topics[topicId].incorrect,
                                    not_attempted: topics[topicId].not_attempted,
                                    correct_t: topics[topicId].correct.map(function (qId) {
                                        return [qId, amt.id];
                                    }),
                                    incorrect_t: topics[topicId].incorrect.map(function (qId) {
                                        return [qId, amt.id];
                                    }),
                                    not_attempted_t: topics[topicId].not_attempted.map(function (qId) {
                                        return [qId, amt.id];
                                    })
                                }
                            }
                        }

                    });

                    $scope.analysis.speed = $scope.analysis.speed / data.attempted_mock_tests.length;
                    $scope.analysis.accuracy = $scope.analysis.accuracy / data.attempted_mock_tests.length;
                    if ($scope.analysis.speed >= 0 && $scope.analysis.accuracy >= $scope.optimumAccuracy) {
                        var diff_percent = $scope.analysis.accuracy - $scope.optimumAccuracy;
                        var block_width_percent = 100 - $scope.optimumAccuracy;
                        var offset_percent = diff_percent * 100 / block_width_percent;
                        position.css('left', offset_percent + '%');
                        position.css('top', '50%');
                        position.css('color', 'green');
                        dot.css('background-color', 'green');
                        $('#top-right').append(position);
                    }
                    if ($scope.analysis.speed >= 0 && $scope.analysis.accuracy < $scope.optimumAccuracy) {
                        var diff_percent = $scope.optimumAccuracy - $scope.analysis.accuracy;
                        var block_width_percent = $scope.optimumAccuracy;
                        var offset_percent = diff_percent * 100 / block_width_percent;
                        position.css('left', offset_percent + '%');
                        position.css('color', 'blue');
                        dot.css('background-color', 'blue');
                        $('#top-left').append(position);
                    }
                    if ($scope.analysis.speed < 0 && $scope.analysis.accuracy < $scope.optimumAccuracy) {
                        var diff_percent = $scope.optimumAccuracy - $scope.analysis.accuracy;
                        var block_width_percent = $scope.optimumAccuracy;
                        var offset_percent = diff_percent * 100 / block_width_percent;
                        position.css('left', offset_percent + '%');
                        position.css('color', 'red');
                        dot.css('background-color', 'red');
                        $('#bottom-left').append(position);
                    }
                    if ($scope.analysis.speed < 0 && $scope.analysis.accuracy >= $scope.optimumAccuracy) {
                        var diff_percent = $scope.analysis.accuracy - $scope.optimumAccuracy;
                        var block_width_percent = 100 - $scope.optimumAccuracy;
                        var offset_percent = diff_percent * 100 / block_width_percent;
                        position.css('color', 'blue');
                        dot.css('background-color', 'blue');
                        $('#bottom-right').append(position);
                    }
                    /*drawPosition(ctx, xOffset, yOffset, cartessianSize, pointRadius, $scope.analysis.speed, $scope.analysis.accuracy);*/

                    for (var subjectId in $scope.analysis.subjects) {
                        var subject = $scope.analysis.subjects[subjectId];
                        var attemptedCount = subject.correct.length + subject.incorrect.length;
                        $scope.analysis.subjects[subjectId].accuracy = attemptedCount == 0 ? 0.0 : (subject.correct.length * 100 / (attemptedCount)).toFixed(1);
                    }

                    $scope.filtersChanged();
                    $scope.showMAnalysis();
                    setTimeout(function () {
                        $('input[type="radio"][value="all"]').each(function (i, elem) {
                            elem.checked = true;
                        });
                        /*$('.modal')
                          .on('shown.bs.modal', function(){
                            $('body').css({overflow: 'hidden'});
                          })
                          .on('hidden.bs.modal', function(){
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
        }]);
});
