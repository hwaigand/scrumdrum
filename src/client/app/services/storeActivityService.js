(function () {
    'use strict';

    var factoryId = 'storeActivityService';

    // Store Activity Factory
    angular
        .module('app')
        .factory('storeActivityService', storeActivityService);

    storeActivityService.$inject = ['$http', 'appConfig', 'commonService', '$filter'];

    function storeActivityService($http, appConfig, commonService, $filter) {

        var serviceBase = appConfig.apiServiceBaseUri;
        var urlBaseStoreActivity = serviceBase + 'api/storeactivity';

        return {
            getStoreActivities: getStoreActivities,
            getStoreActivity: getStoreActivity,
            insertStoreActivity: insertStoreActivity,
            updateStoreActivity: updateStoreActivity,
            getNewStoreDemo: getNewStoreDemo,
            getStoreActivityTypes: getStoreActivityTypes,
            getNewStoreActivityDemoDetails: getNewStoreActivityDemoDetails,
            getWeeklyDemos: getWeeklyDemos
        };

        function getStoreActivities(date, id) {
            return $http.get(urlBaseStoreActivity + /Date/ + date + '/store/' + id);
        }

        function getStoreActivity(id) {
            return $http.get(urlBaseStoreActivity + '/' + id);
        }

        function insertStoreActivity(storeActivity) {
            return $http.post(urlBaseStoreActivity, JSON.stringify(storeActivity));
        }

        function updateStoreActivity(storeActivity) {
            return $http.put(urlBaseStoreActivity + '/' + storeActivity.StoreActivityID, JSON.stringify(storeActivity));
        }

        function getNewStoreDemo() {
            return $http.get(urlBaseStoreActivity + '/newStoreDemo');
        }

        function getStoreActivityTypes() {
            return $http.get(urlBaseStoreActivity + '/storeActivityTypes');
        }

        function getNewStoreActivityDemoDetails() {
            return $http.get(urlBaseStoreActivity + '/newStoreActivityDemoDetails');
        }

        function getWeeklyDemos(date, storeId, merchandiserId) {
            //Add one day to get current Demos - due to change in Business Rules (ViewModel)
            var myDate = new Date(date);
            myDate.setDate(myDate.getDate() + 1);
            var reformattedDate = $filter('date')(new Date(myDate), 'MM-dd-yyyy');
            return $http.get(urlBaseStoreActivity + '/weeklyDemos/date/' + reformattedDate + '/store/' + storeId + '/merchandiser/' + merchandiserId);
        }
    }

})();
