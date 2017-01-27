define(['./module', 'underscore', 'highcharts', 'store', 'jquery'], function (controllers, _, highcharts, store, $) {
    'use strict';
    controllers.controller('mainCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope){

    	//This $scope.on function will be executed only after the loading of template
    	//Otherwise you couldnt gurantee which loads first the template or the function content
    	//$scope.$on('$stateChangeSuccess', function () {

		//});
		//this function add scroll to the navbar tabs present on main.html and also have 
		//the login to submit contact form

    	var init = function () {   

            var pull = $('#pull');
            var menu = $('nav ul');
            var menuHeight = menu.height();
            $(pull).on('click', function (e) {
                e.preventDefault();
                menu.slideToggle();
            });
            $(window).resize(function () {
                var w = $(window).width();
                if (w > 320 && menu.is(':hidden')) {
                    menu.removeAttr('style');
                }
                
            });

            //Meant for clicking on the nav li and navigating and scrolling to the mentioned feature
            $(".scroll").click(function (event) {
                event.preventDefault();
                $('html,body').animate({scrollTop: $(this.hash).offset().top}, 1000);
            });

            $('#contact-us').submit(function () {
                $('#contact-us input[type="submit"]').attr('disabled', true);
                console.log($rootScope.URL)
                $.ajax({
                    type: "POST",
                    url: "/api/contact_us",
                    data: {
                        name: $('#contact-us input[name="name"]').val(),
                        email: $('#contact-us input[name="email"]').val(),
                        message: $('#contact-us textarea[name="message"]').val()
                    }
                })

                .done(function (data) {
                            $('#contact-us input[name="name"]').val('');
                            $('#contact-us input[name="email"]').val('');
                            $('#contact-us textarea[name="message"]').val('');
                            $('#contact-us input[type="submit"]').attr('disabled', false);
                            $("#contact_us_confirmation").show();
                            $("#contact_us_confirmation").fadeOut(3000);
                        });
                return false;
            });
}




	init();



    }]);
    

});