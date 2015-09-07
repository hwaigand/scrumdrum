(function () {

    'use strict';

    //var serviceBase = 'http://localhost:55192/';
    //var serviceBase = 'http://connect.grimmway.com:8090/'; // GCRApiTest
    var serviceBase = 'http://connect.grimmway.com:8050/';   // GCRApi

    var commonConfig = {
        events: { controllerActivateSuccess: 'controller.activateSuccess' },
        apiServiceBaseUri: serviceBase,
        showAuditToast: true,
        version: '1.0.0'
    };

    angular
       .module('common')
       .value('commonConfig', commonConfig);

    angular
        .module('common')
        .config(['$logProvider', function ($logProvider) {
            // turn debugging off/on (no info or warn)
            if ($logProvider.debugEnabled) {
                $logProvider.debugEnabled(true);
            }
        }]);

    angular
        .module('common')
        .config(provider);

    provider.$inject = ['$provide'];

    function provider($provide) {
        $provide.decorator('$exceptionHandler', function($delegate, $injector) {
            return function(exception, cause) {
                $delegate(exception, cause);

                var alerting = $injector.get('alerting');
                alerting.addDanger(exception.message);
            };
        });
    }

})();