(function() {

    'use strict';

    angular
        .module("common")
        .factory('formEncodeService', formEncodeService);

    function formEncodeService() {
        return function(data) {
            var pairs = [];
            if (data) {
                for (var name in data) {
                    if (name) {
                        pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
                    }
                }
                return pairs.join('&').replace(/%20/g, '+');
            } else {
                return pairs;
            }
        };
    };
})();