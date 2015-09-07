(function () {
    'use strict';
    var controllerId = 'storeMapController';

    angular.module('app').controller(controllerId, ['$scope', 'commonService', 'sessionService', 'storeService', storeMapController]);

    function storeMapController($scope, commonService, sessionService, storeService) {

        $scope.session = sessionService.session;

        $scope.selectedMerchandiserId = $scope.session.selectedMerchandiserId;
        $scope.selectedStoreId = $scope.session.selectedStoreId;

        $scope.getStore = function () {
            storeService.getStore($scope.selectedStoreId)
                .success(function (store) {
                    $scope.store = store;
                })
                .error(function (error) {
                    $scope.status = 'Unable to load store data: ' + error.message;
                    commonService.logError($scope.status);
                });
        };

        $scope.getStore();
        var store = $scope.store;

        store.Latitude = '39.590000';
        store.Longitude = '-106.090000';

        var stores = [];
        stores.push(store);

        var geocoder = new google.maps.Geocoder();
        var map;

        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        function codeAddress() {
            var address = store.Address + ',' + store.City + ',' + store.State + ',' + store.ZipCode;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    var mapOptions = {
                        zoom: 17,
                        center: results[0].geometry.location,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    map = new google.maps.Map(document.getElementById('map'), mapOptions);

                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: store.StoreName
                    });
                    marker.content = '<div class="infoWindowContent">' + store.City + '</div>';
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open(map, marker);
                    });

                    $scope.markers.push(marker);


                    google.maps.event.addListenerOnce(map, 'idle', function () {
                        google.maps.event.trigger(map, 'resize');
                        map.setCenter(results[0].geometry.location);
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }


        //var mapOptions = {
        //    zoom: 15,
        //    center: new google.maps.LatLng(store.Latitude, store.Longitude),
        //    mapTypeId: google.maps.MapTypeId.ROADMAP
        //}

        //$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        //$scope.markers = [];

        //var infoWindow = new google.maps.InfoWindow();

        //var createMarker = function(info) {

        //    var marker = new google.maps.Marker({
        //        map: $scope.map,
        //        position: new google.maps.LatLng(info.Latitude, info.Longitude),
        //        title: info.StoreName
        //    });
        //    marker.content = '<div class="infoWindowContent">' + info.City + '</div>';

        //    google.maps.event.addListener(marker, 'click', function() {
        //        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
        //        infoWindow.open($scope.map, marker);
        //    });

        //    $scope.markers.push(marker);

        //}

        //for (var i = 0; i < stores.length; i++) {
        //    createMarker(stores[i]);
        //}

        $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        };

        activate();
        //initialize();
        codeAddress();

        function activate() {
            commonService.activateController([], controllerId)
                .then(function () { commonService.log('Activated Store Map Controller'); });
        }

    }

})();
