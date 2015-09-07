(function () {
    'use strict';

    var controllerId = 'HomeController';

    angular
        .module('app')
        .controller(controllerId, HomeController);

    HomeController.$inject = ['$scope', '$state',
        'commonService', 'sessionService', 'currentUserService', 'sideBarService', 'oauthService', 'appConfig'];

    function HomeController($scope, $state,
        commonService, sessionService, currentUserService, sideBarService, oauthService, appConfig) {
   
        $scope.session = sessionService.session;
        $scope.isAuthenticated = currentUserService.isAuthenticated;

        $scope.logOut = function () {
            oauthService.logout();
            $scope.session.authenticated = false;
            $scope.isAuthenticated = false;
        };

        $scope.showSideBar = true;

        $scope.toggleSideBar = function () {

            $scope.showSideBar = !$scope.showSideBar;
            sideBarService.setSideBarVisible($scope.showSideBar);
            if ($scope.showSideBar) {
                $scope.sideBarWidth = { 'display': 'block', 'width': '95%' };
                $scope.mainBarWidth = { 'width': 'auto' };
            } else {
                $scope.sideBarWidth = { 'display': 'none' };
                $scope.mainBarWidth = { 'width': '100%' };
            }

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.toggleSideBar(); //makes the sidebar initially invisible
        $scope.showSideBar = sideBarService.getSideBarVisible();

        $scope.clearStore = function () {
            sessionService.session.selectedStoreId = 0;
            sessionService.session.selectedStoreName = '';
            sessionService.session.selectedStore = [];
            $scope.session.selectedStoreId = 0;
            $scope.session.selectedStoreName = '';
            $scope.session.selectedStore = [];
            sessionService.saveLocal(sessionService.session);
            $state.go('home');
        };

        function activate() {
            commonService.logSuccess('Home Controller loaded!', null, appConfig.showAuditToast);
            commonService.activateController([], controllerId);
        }

        activate();

    }
})();
