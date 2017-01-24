define(['./module', 'underscore', 'store', "jquery"], function (controllers, _, store, $) {
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

                var req = {
                        method: 'POST',
                        url: $rootScope.URL + "student_signin",
                         headers: {
                           'Content-Type': undefined
                         },
                         data: { 
                                email: $scope.email,
                                password: $scope.password 
                        }
                        }

                        $http(req).then(function(token){
                            comsole.log(token)
                        }, function(){
                                console.log("sab chutiya hian")

                        });
                                   
    	               }

        /*

    <!-- start Mixpanel --><script type="text/javascript">(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==
    typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);
    b._i.push([a,e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);
    mixpanel.init("6397edeccae8afcf331f7ae9ef1fc0fd", { track_pageview: false });</script><!-- end Mixpanel -->

    <script type="text/javascript">
        mixpanel.track("Login Page Loaded")
    </script>
    */

    }]);
});
