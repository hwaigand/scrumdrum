(function() {
    'use strict';

    var controllerId = 'ShellController';
    angular
        .module('app')
        .controller(controllerId, ShellController);

    ShellController.$inject = ['commonService', 'currentUserService', 'appConfig'];

    function ShellController(commonService, currentUserService, appConfig) {

        var vm = this;

        vm.isAuthenticated = currentUserService.isAuthenticated;

        function activate() {
            commonService.logSuccess('Activated Shell Controller', null, appConfig.showAuditToast);
            commonService.activateController([], controllerId);
        }

        activate();
    }
})();
