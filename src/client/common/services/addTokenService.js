(function () {

    "use strict";

    angular
        .module("common")
        .factory("addTokenService", addTokenService)
        .config(addTokenServiceProvider);

    addTokenServiceProvider.$inject = ['$httpProvider'];

    function addTokenServiceProvider($httpProvider) {
        $httpProvider.interceptors.push("addTokenService");
    }

    function addTokenService(currentUserService, $q) {
        return {
            request: function (config) {
                if (currentUserService.profile.token) {
                    config.headers.Authorization = "Bearer " + currentUserService.profile.token;
                }
                return $q.when(config);
            }
        };
    }
})();
