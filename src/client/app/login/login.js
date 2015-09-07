(function () {
    'use strict';

    var controllerId = 'LoginController';

    angular
       .module('app')
       .controller(controllerId, LoginController);

    LoginController.$inject = ['$state', 'commonService',
        'oauthService', 'currentUserService', 'alertingService', 'appConfig'];

    function LoginController($state, commonService, oauthService, currentUserService, alertingService, appConfig) {

        var vm = this;

        vm.username = '';
        vm.password = '';
        vm.user = currentUserService.profile;

        function loggedIn() {
            vm.isAuthenticated = true;
            $state.go('home');
        }

        vm.login = function(form) {
            try {
                if (form.$valid) {
                    oauthService.login(vm.username, vm.password)
                        .then(loggedIn())
                        .catch(alertingService.errorHandler('Could not login'));
                    vm.password = '';
                }
            } catch (error) {
                throw new Error(error.message);
            }
        };

        vm.signOut = function () {
            oauthService.logout();
        };

        vm.isAuthenticated = currentUserService.isAuthenticated;

        function activate() {
            commonService.logSuccess('Login Controller activated', null, appConfig.showAuditToast);
            commonService.activateController([], controllerId);
        }

        activate();
       
    }
})();
