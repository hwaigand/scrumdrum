(function () {
    'use strict';

    var controllerId = 'IndexController';

    angular
        .module('app')
        .controller(controllerId, IndexController);

    IndexController.$inject = ['$scope', 'commonService',
        'sessionService', 'onlineStatusService', 'appConfig'];

    function IndexController($scope, commonService,
        sessionService, onlineStatusService, appConfig) {

        //Initializing the Session Service
        $scope.session = sessionService.session;

        //Initializing the Online Status Service
        $scope.onlineStatus = onlineStatusService;

        function reportOnlineStatus() {
            var status = $('#onlineStatus');

            if ($scope.onlineStatus.isOnline()) {
                status.text('Online');
                status.
                    removeClass('offline').
                    addClass('online');
            } else {
                status.text('Offline');
                status.
                    removeClass('online').
                    addClass('offline');
            }
        }

        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.ONLINE_STATUS_STRING = online ? 'online' : 'offline';
            reportOnlineStatus();
        });

        activate();

        function activate() {
            commonService.logSuccess('Index Controller loaded!', null, appConfig.showAuditToast);
            commonService.activateController([], controllerId);
        }

    }
})();
