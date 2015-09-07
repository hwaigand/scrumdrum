(function() {

    'use strict';

    angular
        .module('common')
        .controller('ModalDialogController', ModalDialogController);

    ModalDialogController.$inject = ['$scope', '$modalInstance', 'options'];

    function ModalDialogController($scope, $modalInstance, options) {
        $scope.title = options.title || 'Title';
        $scope.message = options.message || '';
        $scope.okText = options.okText || 'OK';
        $scope.cancelText = options.cancelText || 'Cancel';
        $scope.ok = function() { $modalInstance.close('ok'); };
        $scope.cancel = function() { $modalInstance.dismiss('cancel'); };
    }

})();