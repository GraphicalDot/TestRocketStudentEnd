define(['./module', 'underscore', 'store', "jquery"], function (controllers, _, store, $) {
    'use strict';
    controllers.controller('StudentForgotPasswordCtrl', ['$scope', '$state', '$rootScope', '$http', function($scope, $state, $rootScope, $http){



            $scope.loginStudent = function(){
                $scope.url = $rootScope.URL + "/student_signin"
                var data = JSON.stringify($scope.login)
                
               
                $http.post($scope.url, data).then(function(response, status, headers, config){
                    //If the user credentials are true only then it will redirect to app
                    if(response.data.success == true){
                    var token = response.data.token;
                    var tokenParts = token.split('|');
                    console.log(token)
                    console.log(tokenParts)
                    var user = {
                            name: atob(tokenParts[3]),
                            id: parseInt(tokenParts[2]),
                            email: atob(tokenParts[0]),
                            password: tokenParts[1],
                            target_exams: atob(tokenParts[4]).split(','),
                            type: 'student'
                                };
                    console.log("student_signin.js: " + "User = " + user  )
                    store.set('user', user);
                    $state.transitionTo('app');
                    }
                    else {
                        $scope.isloggedIn = true;
                    }              
                    
                        }, function(response, satus,  headers, config){
                                console.log(response)

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
