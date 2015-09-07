
(function () {

    "use strict";

    angular.module('common', [
        // Angular modules 
        'ngAnimate',
        //'ngRoute',
        'ngGrid',
        'LocalStorageModule',
        'angular-loading-bar',
        'angular-jwt',

        // Custom modules 
        'common', // common functions, logger, spinner

        // 3rd Party Modules
        'ui.bootstrap', // ui-bootstrap (ex: carousel, pagination, dialog)
        //"ngMap",
        'ui.router'
    ]);

    angular
        .module('common')
        .run(runBlock);

    runBlock.$inject = ['$rootScope', '$state', '$stateParams', 'oauthService', 'currentUserService'];

    function runBlock($rootScope, $state, $stateParams, oauthService, currentUserService) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {

            var authenticated = currentUserService.isAuthenticated();
            if (!authenticated && toState.name !== 'login') {
                $state.transitionTo('login');
                event.preventDefault();
            }

            if (authenticated && ((toState.name === 'login') || (toState.name === 'shell'))) {
                $state.transitionTo('home');
                event.preventDefault();
            }

        });

        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                console.log('stateChangeError');
                console.log(toState, toParams, fromState, fromParams, error);

                if (error.status === 401) {
                    console.log('401 detected. Redirecting...');

                    //oauth.deniedState = toState.name;
                    $state.go('login');
                }

                if (error.status === 400) {
                    console.log('400 detected. Redirecting...');

                    //oauth.deniedState = toState.name;
                    $state.go('login');
                }
            });
    }

})();