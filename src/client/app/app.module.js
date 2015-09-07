(function () {
    'use strict';

    angular.module('app', [
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
        .module('app')
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('shell', {
                url: '/',
                templateUrl: 'src/client/app/layout/shell.html',
                controller: 'ShellController as vm'
            })
            .state('login', {
                //parent: 'site',
                url: '/login',
                views: {
                    'content': {
                        templateUrl: 'src/client/app/login/login.html',
                        controller: 'LoginController as vm'
                    }
                }
            })
            .state('home', {
                //parent: 'shell',
                url: '/home',
                views: {
                    'mainPage@home': {
                        templateUrl: 'src/client/app/stores/storeSearchPhone.html',
                        controller: 'StoreSearchController'
                    },
                    'content': {
                        templateUrl: 'src/client/app/home/home.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('storeDemo', {
                //parent: 'shell',
                url: '/storeDemo',
                views: {
                    'content': {
                        templateUrl: 'src/client/app/home/home.html',
                        controller: 'HomeController'
                    },
                    'mainPage@storeDemo': {
                        templateUrl: 'src/client/app/storeDemo/storeDemo.html',
                        controller: 'StoreDemoController'
                    }
                }
            })
            .state('storeSearch', {
                //parent: 'shell',
                url: '/storeSearch',
                views: {
                    'content': {
                        templateUrl: 'src/client/app/home/home.html',
                        controller: 'HomeController'
                    },
                    'mainPage@storeSearch': {
                        templateUrl: 'src/client/app/stores/storeSearchPhone.html',
                        controller: 'StoreSearchController'
                    }
                }
            }).state('loginErrorNotABrandAmbassador', {
                //parent: 'shell',
                url: '/loginErrorNotABrandAmbassador',
                views: {
                    'content': {
                        templateUrl: 'src/client/app/login/loginErrorNotABrandAmbassador.html',
                        controller: 'LoginController as vm'
                    }
                }
            }).state('loginError', {
                //parent: 'shell',
                url: '/loginError',
                views: {
                    'content': {
                        templateUrl: 'src/client/app/login/loginError.html',
                        controller: 'LoginController as vm'
                    }
                }
            });

            $urlRouterProvider.otherwise('/login');

        });



})();
