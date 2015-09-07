(function () {
    'use strict';
    
    angular.module('common').filter('nullDateFilter', function ($filter) {
    return function (input) {

        if (!input || input === null) { return ''; }

        var date = new Date();
        //date = input;

        //var minDate = new Date('0001-01-01T00:00:00');

        if (input === '0001-01-01T00:00:00') {
            date = '';
        } else {
            date = $filter('date')(new Date(input), 'MM/dd/yyyy', 'UTC');
        }

        return date;

    };
});

})();

