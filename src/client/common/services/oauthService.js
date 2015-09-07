(function () {

    'use strict';

    angular
           .module("common")
           .config(function ($provide) { $provide.provider("oauthService", oauthService); });

    //oauthService.$inject = ['$http', 'config', 'currentUserService', 'sessionService', 'formEncodeService'];

    function oauthService() {

        this.$get = function ($http, currentUserService, sessionService, formEncodeService, appConfig) {

            var url = appConfig.apiServiceBaseUri + "token";

            var processToken = function (username) {
                return function (response) {
                    currentUserService.profile.username = username;
                    currentUserService.profile.token = response.data.access_token;
                    currentUserService.save();
                    sessionService.login(username);
                    return username;
                }
            };

            var login = function (username, password) {

                var configuration = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                };

                var data = formEncodeService({
                    username: username,
                    password: password,
                    //opCode: config.connectionBase.db,
                    //applicationName: config.applicationName,
                    //useWebConfig: !config.connectionBase.db,
                    grant_type: "password"
                });

                return $http.post(url, data, configuration).then(processToken(username));

            };

            var logout = function () {
                currentUserService.profile.username = "";
                currentUserService.profile.token = "";
                currentUserService.remove();
                sessionService.logout();
            };

            return {
                login: login,
                logout: logout
            };
        }
    }

})();