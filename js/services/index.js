/**
 * attach services to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules 
 * which avails each service of, for example, the `config` constants object.
 **/
define(['./api',
    './enums',
    './mock_test_instructions',
    './subject_class_map'
], function () {});
