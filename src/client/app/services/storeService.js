(function () {
    'use strict';

    // Store Service
    angular.module('app')
        .factory('storeService', storeService);

    storeService.$inject = ['$http', 'appConfig'];

    function storeService($http, appConfig) {

        var serviceBase = appConfig.apiServiceBaseUri;
                var urlBaseStore = serviceBase + 'api/store';

        return {
            getStoresByBrandAmbassadorId: getStoresByBrandAmbassadorId,
            getStore: getStore,
            insertStore: insertStore,
            updateStore: updateStore,
            deleteStore: deleteStore
        };

        function getStoresByBrandAmbassadorId(brandAmbassadorId) {
                    return $http.get(urlBaseStore + '/brandAmbassador/' + brandAmbassadorId);
        }

        function getStore(id) {
                    return $http.get(urlBaseStore + '/' + id);
        }

        function insertStore(store) {
                    return $http.post(urlBaseStore, JSON.stringify(store));
        }

        function updateStore(store) {
                    return $http.put(urlBaseStore + '/' + store.StoreID, JSON.stringify(store));
        }

        function deleteStore(id) {
                    return $http.delete(urlBaseStore + '/' + id);
        }
            }

})();


