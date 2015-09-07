(function () {

    'use strict';

    angular
          .module("common")
          .factory("currentUserService", currentUserService);

    currentUserService.$inject = ['localStorageService', 'jwtHelper'];

    function currentUserService(localStorageService, jwtHelper) {

        var USERKEY = "utoken";
        var profile = initialize();

        var saveUser = function () {
            localStorageService.set(USERKEY, profile);
        };

        var removeUser = function () {
            localStorageService.remove(USERKEY);
        };

        var isAuthenticated = function () {
            if (profile.token.length === 0)
                return false;
            return !jwtHelper.isTokenExpired(profile.token);
        }

        function initialize() {
            var user = {
                username: "",
                token: "",
                get loggedIn() {
                    return this.token ? true : false;
                }
            };

            var localUser = localStorageService.get(USERKEY);
            if (localUser) {
                user.username = localUser.username;
                user.token = localUser.token;
            }
            return user;
        }

        return {
            save: saveUser,
            remove: removeUser,
            profile: profile,
            isAuthenticated: isAuthenticated
        };
    }

})();