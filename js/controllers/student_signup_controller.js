 //TODO : The user must be notifid if he is registered again and the message shall be shown either to click on password 
 //change 

 define(['./module', 'underscore', 'store', "jquery"], function (controllers, _, store, $) {
    'use strict';
    controllers.controller('StudentSignUpCtrl', ['$scope', '$state', '$rootScope', '$http', function($scope, $state, $rootScope, $http){
    		console.log("contoller from student signup running")
			$scope.formData = {};
    		$scope.units = [{"id": 1, "name": "Engineering"},
                        {"id": 2, "name": "Medical"},
                        {"id":3, "name":  "Foundation"}]

    		//TODO: The backenv receives host also which is now irrelevant
    		//Please remove it from the backend and frontend tooo
    		$scope.formData.host = "localhost"
    		$scope.submitStudent = function(){
            $scope.url =  $rootScope.URL + "/student_signup";
                var data = JSON.stringify($scope.formData)

                $http.post($scope.url, data).then(function(data, status, headers, config){
                          
                            $state.transitionTo('student_signin');
                        }, function(data, status, headers, config){
                                console.log(data)

                        });

    		}

    		//method="post" action="/123_456_789_123_student_signup"
}])
})