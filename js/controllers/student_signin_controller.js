define(['./module', 'underscore', 'store', "jquerymigrate"], function (controllers, _, store, $) {
    'use strict';
    controllers.controller('StudentSignInCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope){


    	$scope.login = function(){
    		$scope.loggedIn = false
  

    		console.log("login button has been clicked" + $scope.password + $scope.email)
    		console.log($rootScope.URL + "/student_signin")
    		window.showLoader()
    		$.ajax({
                    type: "POST",
                    url: $rootScope.URL + "student_signin",
                    data: {
                        email: $scope.email,
                        password: $scope.password
                    }
                })

                .done(function (data) {
                            "user updated successfully"
                        });
                return false;
           
    	}

    }]);
});
