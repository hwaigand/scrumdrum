(function () {
    'use strict';
    var controllerId = 'StoreSearchController';

    angular
        .module('app')
        .controller(controllerId, StoreSearchController);

    StoreSearchController.$inject = ['$scope', '$modal', '$state', 'commonService',
        'sessionService', 'storeService'];

    function StoreSearchController($scope, $modal, $state, commonService,
        sessionService, storeService) {

        $scope.selectedStores = [];
        $scope.session = sessionService.session;

        $scope.getStoresByBrandAmbassadorId = function () {
            storeService.getStoresByBrandAmbassadorId($scope.session.selectedBrandAmbassadorId)
                .success(function (stores) {
                    $scope.stores = stores;

                    if ($scope.session.storeSearchText) {
                        var ft = $scope.session.storeSearchText.toLowerCase();
                        var selectedStores = $scope.stores.filter(function (item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                        });
                        $scope.stores = selectedStores;
                    }

                })
                .error(function () {
                    $scope.status = 'Unable to load store data';
                });
        };

        $scope.getStoresByBrandAmbassadorId();

        $scope.storeDemo = function (store) {
            if (store && store.StoreID > 0) {
                $scope.session.selectedStoreId = store.StoreID;
                $scope.session.selectedStore = store;
                $scope.session.selectedStoreName = store.StoreName;
                $scope.session.selectedMenuTab = 0;
                sessionService.saveLocal($scope.session);

                //$location.path('/storeDemo');
                $state.go('storeDemo');
            }
        };

        // STORE MAP
        $scope.storeMap = function (store) {
            $scope.store = store;

            var modalInstance = $modal.open({
                templateUrl: 'src/client/app/storeMap/storeMap.html',
                controller: 'ModalStoreMapController',
                windowClass: 'wideModalWindow',
                resolve: {
                    store: function () {
                        return $scope.store;
                    }
                }
            });

            modalInstance.result.then(function (store) {
                $scope.store = store;
            }, function () {
                commonService.log('Changes dismissed');
            });

        };

        activate();

        function activate() {
            commonService.activateController([], controllerId)
                .then(function () { commonService.log('Activated Store Search Controller'); });
        }
    }
})();


angular.module('app').controller('ModalStoreMapController', function ($scope, $modalInstance, store) {

    $scope.store = store;


    $scope.close = function () {
        $modalInstance.close($scope.store);
    };
});

angular.module('app').controller('ModalStoreController', function ($scope, $modalInstance, storeService, store) {

    $scope.store = store;

    $scope.close = function () {
        $modalInstance.close($scope.store);
    };

    $scope.save = function () {
        var store = this.store;
        if (store.StoreID === 0 || !store.StoreID) {
            storeService.insertstore(store)
                .success(function (store) {
                    $scope.store = store;
                    $modalInstance.close($scope.store);
                })
                .error(function (error) {
                    $scope.status = 'Unable to insert store data: ' + error.message;
                    $modalInstance.close($scope.store);
                });
        } else {
            storeService.updatestore(store)
                .success(function (store) {
                    $scope.store = store;
                    $modalInstance.close($scope.store);
                })
                .error(function (error) {
                    $scope.status = 'Unable to save store data: ' + error.message;
                    $modalInstance.close($scope.store);
                });
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
