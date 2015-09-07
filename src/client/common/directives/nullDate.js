(function () {
    'use strict';

    angular.module('common').directive('nullDate', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {

                function fromUser(text) {
                    if (text == null) { return ""; }
                    var _date = moment(text).format("L");
                    if (_date == "01/01/0001") { return ""; }
                    return _date;
                }

                function toUser(text) {
                    if (text == null) { return ""; }
                    var _date = moment(text).format("L");
                    if (_date == "01/01/0001") { return ""; }

                    return _date;
                }

                ngModel.$parsers.push(fromUser);
                ngModel.$formatters.push(toUser);
            }
        };
    });

})();