(function () {
    'use strict';
    
    //var serviceBase = 'http://localhost:55192/';
    //var serviceBase = 'http://mis-testapp:8050/';
    var serviceBase = 'http://172.16.122.68:8050/';
    //var serviceBase = 'http://mis-relapp:8050';
    //var serviceBase = 'http://connect.grimmway.com:8090/'; // GCRApiTest
    //var serviceBase = 'http://connect.grimmway.com:8050/';   // GCRApi

    // Configure Toastr
    toastr.options.timeOut = 10000;
    toastr.options.positionClass = 'toast-bottom-right';

    var appConfig = {
        appErrorPrefix: '[Store Demo Error] ', //Configure the exceptionHandler decorator
        docTitle: 'Store Demo: ',
        showAuditToast: true,
        apiServiceBaseUri: serviceBase,
        version: '2.1.1.0'
    };

    angular
       .module('app')
       .value('appConfig', appConfig);

})();
