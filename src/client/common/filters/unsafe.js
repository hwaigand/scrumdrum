(function () {
    'use strict';

    angular.module('common').filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });
})();