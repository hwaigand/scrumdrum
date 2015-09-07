(function () {

    'use strict';

    angular
        .module("common")
        .directive("alerts", alerts);

    function alerts(alertingService) {
        return {
            restrict: "AE",
            templateUrl: "src/client/common/views/alerts.html",
            scope: true,
            controller: function ($scope) {
                $scope.removeAlert = function (alert) {
                    alertingService.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingService.currentAlerts;
            }
        };
    }
})();