(function () {

    'use strict';

    // Session Service
    angular.module('app')
        .factory('sessionService', sessionService);

    sessionService.$inject = ['$http', '$window', '$state', 'localStorageService', 'appConfig'];

    function sessionService($http, $window, $state, localStorageService, appConfig) {

        var sessionModel = {
            user: '',
            userId: 0,
            userName: '',
            authenticated: false,
            merchandiserId: 0,
            merchandiserName: '',
            managerId: 0,
            managerName: '',
            isManager: false,
            selectedStore: [],
            selectedStoreId: 0,
            selectedStoreName: '',
            selectedMerchandiserId: 0,
            selectedMerchandiserName: '',
            selectedBrandAmbassadorId: 0,
            selectedBrandAmbassadorName: '',
            storeSearchText: '',
            storeContactSearchText: '',
            merchandiserSearchText: '',
            databaseName: '',
            selectedDate: currentDate(),
            calendarSelectedDate: currentDate(),
            currentDate: currentDate(),
            selectedMenuTab: 1,
            showCalendar: true,
            showStoreSearch: true,
            showStoreContactSearch: true,
            showMerchandiserSearch: true,
            showMerchandiserRecap: false,
            numberStoreVisits: 0,
            numberSecondaryDisplays: 0,
            numberStoreDemos: 0,
            numberStoresToVisit: 0,
            weeklyStoreVisits: [],
            weeklySecondaryDisplays: [],
            weeklyStoreDemos: []
        };

        var serviceBase = appConfig.apiServiceBaseUri;
        var session = sessionModel;

        return {
            session: getLocal(),
            saveLocal: saveLocal,
            login: login,
            logout: logout
        };

        function saveLocal(sessionModel) {
            localStorageService.set('sessionData', sessionModel);
        }

        function login(userName) {
            $http.get(serviceBase + 'api/account/user/' + userName)
                .success(function (data) {
                    session.authenticated = true;
                    session.userId = data.UserID;
                    session.userName = userName;
                    session.user = data.FullName;
                    session.merchandiserId = data.Merchandiser.MerchandiserID;
                    session.merchandiserName = data.Merchandiser.Name;
                    session.managerId = data.Manager.ManagerID;
                    session.managerName = data.Manager.Name;
                    session.selectedMerchandiserId = data.Merchandiser.MerchandiserID;
                    session.selectedMerchandiserName = data.Merchandiser.Name;
                    session.selectedBrandAmbassadorId = data.BrandAmbassador.BrandAmbassadorId;
                    session.selectedBrandAmbassadorName = data.BrandAmbassador.Name;
                    session.isManager = data.IsManager;
                    session.databaseName = data.DatabaseName;
                    session.showMerchandiserSearch = data.IsManager;
                    session.selectedDate = currentDate();
                    session.currentDate = currentDate();

                    if (data.BrandAmbassador.BrandAmbassadorId > 0) {
                        session.showStoreContactSearch = false;
                        session.showMerchandiserSearch = false;
                        saveLocal(session);
                        $state.go('home');
                    } else {
                        if (userName) {
                            saveLocal(sessionModel);
                            $state.go('loginErrorNotABrandAmbassador');
                        }
                    }


                })
                .error(function (data, status) {

                    $state.go('loginError');
                    saveLocal(sessionModel);

                });

        }

        function logout() {
            saveLocal(sessionModel);
            $state.go('login');
        }

        function currentDate() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            today = mm + '/' + dd + '/' + yyyy;

            return today;
        }

        function getLocal() {
            var data = localStorageService.get('sessionData');
            if (data) {
                return data;
            } else {
                localStorageService.set('sessionData', sessionModel);
                return sessionModel;
            }
        }
    }

})();

