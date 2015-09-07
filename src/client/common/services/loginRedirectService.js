(function () {

    "use strict";

    angular
        .module("common")
        .provider("loginRedirectService", loginRedirectService)
        .config(loginRedirectServiceProvider);

    loginRedirectServiceProvider.$inject = ['$httpProvider'];

    function loginRedirectServiceProvider($httpProvider) {
         $httpProvider.interceptors.push("loginRedirectService");
    }
    

    function loginRedirectService() {

        var lastPath = "";

        this.setLoginUrl = function (value) {
            loginUrl = value;
        };

        this.$get = function ($q, $location) {

            return {
                responseError: function (response) {

                    if (response.status === 401 || response.status === 403) {
                        // TODO This is causing in infinite loop in the situation
                        // that the token expires but the session never set
                        // the authentication flag to false (like closing the browswer).
                        // Either set the session.authenticated = false here, or
                        // take out that flag and just use the token.authenticated
                        // everywhere.
                        lastPath = $location.path();
                        $location.path("/");
                    }

                    return $q.reject(response);

                },

                redirectPreLogin: function () {
                    if (lastPath) {
                        $location.path(lastPath);
                        lastPath = "";

                    } else {
                        $location.path("/");
                    }
                }
            };
        };
    }

})();