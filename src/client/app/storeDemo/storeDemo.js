(function() {
    'use strict';
    var controllerId = 'StoreDemoController';

    angular
        .module('app')
        .controller(controllerId, StoreDemoController);
    
    StoreDemoController.$inject = ['$scope', '$modal', '$http', '$filter',
        'commonService', 'sessionService',
        'storeActivityService', 'appConfig'];

    function StoreDemoController($scope, $modal, $http, $filter,
        commonService, sessionService,
        storeActivityService, appConfig) {

        $scope.session = sessionService.session;

        $scope.reformattedDate = $filter('date')(new Date($scope.session.selectedDate), 'MM-dd-yyyy');

        $scope.getStoreActivityTypes = function() {
            storeActivityService.getStoreActivityTypes()
                .success(function(storeActivityTypes) {
                    $scope.storeActivityTypes = storeActivityTypes.data;
                })
                .error(function(error) {
                    $scope.status = 'Unable to load store activity types: ' + error.message;
                });
        };

        $scope.getStoreActivityTypes();
       
        $scope.weeklyStoreDemos = [];
        $scope.getWeeklyDemos = function(date, storeId, merchandiserId) {
            storeActivityService.getWeeklyDemos(date, storeId, merchandiserId)
                .success(function(weeklyStoreDemos) {
                    $scope.weeklyStoreDemos = weeklyStoreDemos.data;
                })
                .error(function(error) {
                    $scope.status = 'Unable to load store demo data: ' + error.message;
                });
        };

        $scope.getWeeklyDemos($scope.session.selectedDate, $scope.session.selectedStoreId, $scope.session.selectedMerchandiserId);

        $scope.newStoreDemo = {};
        $scope.getNewStoreDemo = function() {
            storeActivityService.getNewStoreDemo()
                .success(function (newStoreDemo) {
                    $scope.newStoreDemo = newStoreDemo;                })
                .error(function (error) {
                    $scope.status = 'Unable to load new store demo: ' + error.message;
                });
        };

        $scope.getNewStoreDemo();
        
        var opts = { minHeight: 300 };

        $scope.storeDemoGridOptions = {
            data: 'session.weeklyStoreDemos',
            enableCellSelection: false,
            enableRowSelection: true,
            enableCellEdit: false,
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'session.numberStoreDemos',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            selectedItems: $scope.selectedStoreActivities,
            keepLastSelected: false,
            multiSelect: false,
            columnDefs: [
                { field: 'StoreActivityDate', displayName: 'Date' },
                { field: 'Store.StoreName', displayName: 'Store' },
                { field: 'ContactsStore', displayName: 'Contacts Store' },
                { field: 'Merchandiser.Name', displayName: 'Merchandiser' },
                { field: 'BrandAmbassador', displayName: 'Brand Ambassador' },
                { field: 'StoreActivityType.StoreActivityTypeShortDescription', displayName: 'Activity Type' },
                { field: 'StoreActivityDescription', displayName: 'Comments' }
            ]
        };

        $scope.addStoreActivity = function() {
            $scope.storeActivity = $scope.newStoreDemo;
            $scope.storeActivity.Store = $scope.session.selectedStore;
            $scope.storeActivity.StoreActivityType.StoreActivityTypeShortDescription = 'Demo';
            $scope.storeActivity.StoreActivityType.StoreActivityTypeID = 3; // Demo Activity
            $scope.storeActivity.StoreActivityDate = $scope.session.selectedDate;
            $scope.storeActivity.Merchandiser.MerchandiserID = $scope.session.selectedMerchandiserId;


            var modalInstance = $modal.open({
                templateUrl: 'src/client/app/storeDemo/storeDemoDetail.html',
                controller: 'ModalStoreActivityController',
                backdrop: 'static',
                size: 'lg',
                scope: $scope,
                resolve: {
                    storeActivity: function() {
                        return $scope.storeActivity;
                    }
                }
            });

            modalInstance.result.then(function(storeActivity) {
                $scope.storeActivity = storeActivity;
                $scope.getWeeklyDemos($scope.session.selectedDate, $scope.session.selectedStoreId, $scope.session.selectedMerchandiserId);
            }, function() {
                commonService.log('Changes dismissed');
            });
        };

        $scope.editStoreActivity = function(storeActivity) {
            $scope.storeActivity = storeActivity;
            $scope.storeActivity.CompletedDateTime = moment($scope.storeActivity.CompletedDateTime).format("MM-DD-YYYY, h:mm:ss a");

            var modalInstance = $modal.open({
                templateUrl: 'src/client/app/storeDemo/storeDemoDetail.html',
                controller: 'ModalStoreActivityController',
                backdrop: 'static',
                size: 'lg',
                scope: $scope,
                resolve: {
                    storeActivity: function() {
                        return $scope.storeActivity;
                    }
                }
            });

            modalInstance.result.then(function(storeActivity) {
                $scope.storeActivity = storeActivity;
                $scope.getWeeklyDemos($scope.session.selectedDate, $scope.session.selectedStoreId, $scope.session.selectedMerchandiserId);
            }, function() {
                commonService.log('Changes dismissed');
            });
        };

        activate();

        function activate() {
            commonService.logSuccess('Activated Store Demo Controller', null, appConfig.showAuditToast);
            commonService.activateController([], controllerId);
        }
    }
})();

angular.module('app').controller('ModalStoreActivityController', function ($scope, $modalInstance, $filter, storeActivityService, storeActivity, sessionService) {

    $scope.storeActivity = storeActivity;

    $scope.close = function() {
        $modalInstance.close($scope.storeActivity);
    };

    $scope.save = function() {
        var storeActivity = this.storeActivity;
        storeActivity.BrandAmbassador = sessionService.session.selectedBrandAmbassadorName;
        if (storeActivity.StoreActivityID === 0 || !storeActivity.StoreActivityID) {
            storeActivityService.insertStoreActivity(storeActivity)
                .success(function(storeActivity) {
                    $scope.storeActivity = storeActivity;
                    $modalInstance.close($scope.storeActivity);
                })
                .error(function(error) {
                    $scope.status = 'Unable to insert store activity data: ' + error.message;
                    $modalInstance.close($scope.storeActivity);
                });
        } else {
            storeActivityService.updateStoreActivity(storeActivity)
                .success(function(storeActivity) {
                    $scope.storeActivity = storeActivity;
                    $modalInstance.close($scope.storeActivity);
                })
                .error(function(error) {
                    $scope.status = 'Unable to save store activity data: ' + error.message;
                    $modalInstance.close($scope.storeActivity);
                });
        }

    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.$watch('storeActivity.StoreActivityType.StoreActivityTypeID', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.storeActivity.StoreActivityType = $filter('filter')($scope.storeActivityTypes, { StoreActivityTypeID: newVal })[0];
            if ((storeActivity.StoreActivityType.StoreActivityTypeShortDescription === 'Demo') &&
            (storeActivity.StoreActivityDemoDetails.length === 0)) {
                // get new StoreActivityDetails
                storeActivityService.getNewStoreActivityDemoDetails()
                    .success(function(storeActivityDemoDetails) {
                        $scope.storeActivity.StoreActivityDemoDetails = storeActivityDemoDetails.data;
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to get new store activity demo detail data: ' + error.message;
                    });
            }
        }
    }, true);

    $scope.$watch('storeActivity.IsCompleted', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.storeActivity.IsCompleted = newVal;
            if ($scope.storeActivity.IsCompleted) {
                $scope.storeActivity.CompletedDateTime = moment().format("MM-DD-YYYY, h:mm:ss a");
            } else {
                $scope.storeActivity.CompletedDateTime = null;
            }
        }
    }, true);

    $scope.calculateBottlesSold = function(detail) {
        detail.BottlesSold = (detail.BottlesBeforeDemo - detail.BottlesDemoed - detail.BottlesAfterDemo);
    };

    $scope.calculateGrandTotalBottlesSold = function(storeActivity) {
        storeActivity.StoreActivtyDemoDetails.forEach(function(detail) {
            storeActivity.GrandTotalBottlesSold += detail.BottlesSold;
        });
    };

    $scope.calculateTotals = function(storeActivity) {
        var details = storeActivity.StoreActivityDemoDetails;
        var totalBottlesBeforeDemo = 0.0;
        var totalBottlesDemoed = 0.0;
        var totalBottlesAfterDemo = 0.0;
        var totalBottlesSold = 0.0;

        details.forEach(function(detail) {
            totalBottlesBeforeDemo += detail.BottlesBeforeDemo;
            totalBottlesDemoed += detail.BottlesDemoed;
            totalBottlesAfterDemo += detail.BottlesAfterDemo;
            totalBottlesSold += detail.BottlesSold;
        });

        $scope.storeActivity.GrandTotalBottlesBeforeDemo = totalBottlesBeforeDemo;
        $scope.storeActivity.GrandTotalBottlesSampled = totalBottlesDemoed;
        $scope.storeActivity.GrandTotalBottlesAfterDemo = totalBottlesAfterDemo;
        $scope.storeActivity.GrandTotalBottlesSold = totalBottlesSold;
    };

});
