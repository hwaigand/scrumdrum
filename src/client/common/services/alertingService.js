﻿(function() {

    "use strict";

    angular
        .module("common")
        .factory("alertingService", alertingService);

    alertingService.$inject = ['$timeout'];

    function alertingService($timeout) {

        var currentAlerts = [];
        var alertTypes = ["success", "info", "warning", "danger"];

        var addWarning = function(message) {
            addAlert("warning", message);
        };

        var addDanger = function(message) {
            addAlert("danger", message);
        };

        var addInfo = function(message) {
            addAlert("info", message);
        };

        var addSuccess = function(message) {
            addAlert("success", message);
        };

        function addAlert(type, message) {
            var alert = { type: type, message: message };
            currentAlerts.push(alert);

            $timeout(function() {
                removeAlert(alert);
            }, 5000);
        };

        function removeAlert(alert) {
            for (var i = 0; i < currentAlerts.length; i++) {
                if (currentAlerts[i] === alert) {
                    currentAlerts.splice(i, 1);
                    break;
                }
            }
        };

        function errorHandler(description) {
            return function() {
                addDanger(description);
            };
        };

        return {
            addWarning: addWarning,
            addDanger: addDanger,
            addInfo: addInfo,
            addSuccess: addSuccess,
            addAlert: addAlert,
            removeAlert: removeAlert,
            errorHandler: errorHandler,
            currentAlerts: currentAlerts,
            alertTypes: alertTypes
        };
    }
})();