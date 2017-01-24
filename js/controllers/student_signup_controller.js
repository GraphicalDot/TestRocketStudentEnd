define(['./module', 'underscore', 'store', "jquery"], function (controllers, _, store, $) {
    'use strict';
    controllers.controller('StudentSignUpCtrl', ['$scope', '$state', '$rootScope', '$http', function($scope, $state, $rootScope, $http){
    		console.log("contoller from student signup running")
			$scope.formData = {};
    		$scope.units = ['Engineering', 'Medical', 'Foundation']

    		//TODO: The backenv receives host also which is now irrelevant
    		//Please remove it from the backend and frontend tooo
    		$scope.formData.host = "localhost"
    		$scope.submitStudent = function(){
  
  				/*
    			var req = {
                        method: 'POST',
                        url: $rootScope.URL + "/student_signup",
                         headers: {
                           'Content-Type': undefined
                         },
                         data: JSON.stringify($scope.formData)
                        }
                        
           		*/
           		$scope.url =  $rootScope.URL + "/student_signup";
                var data = JSON.stringify($scope.formData)
                console.log(data)
                console.log($scope.formData.branches)

                $http.post($scope.url, data).then(function(data, status, headers, config){
                            console.log(data)
                            $state
                        }, function(data, status, headers, config){
                                console.log(data)

                        });

    		}

    		//method="post" action="/123_456_789_123_student_signup"
}])
})