(function () {

    "use strict";

    angular
        .module("common")
        .factory("onlineStatusService", onlineStatusService);

    onlineStatusService.$inject = ['$window', '$rootScope'];

    function onlineStatusService($window, $rootScope) {

        var onlineStatusServiceLocal = {};

        onlineStatusServiceLocal.onLine = $window.navigator.onLine;

        onlineStatusServiceLocal.isOnline = function () {
            return onlineStatusServiceLocal.onLine;
        };

        $window.addEventListener("online", function () {
            onlineStatusServiceLocal.onLine = true;
            $rootScope.$digest();
        }, true);

        $window.addEventListener("offline", function () {
            onlineStatusServiceLocal.onLine = false;
            $rootScope.$digest();
        }, true);

        return onlineStatusServiceLocal;

    }

})();