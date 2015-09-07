(function () {
    'use strict';

    angular.module('common').filter('nullValueFilter', function () {
    return function (input) {

        if (!input) { return ''; }

        var value = input;

        if (value <= 0) {
            value = '';
        }

        return value;

    };
});

})();