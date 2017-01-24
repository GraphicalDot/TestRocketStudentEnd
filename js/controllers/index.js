/** attach controllers to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules
 * which avails each controller of, for example, the `config` constants object.
 **/
define([
    './mock_test_list',
    './mock_test',
    './cumulative_analysis',
    './main_controller',
    './student_signin_controller',`
    './student_signup_controller'
], function () {});
