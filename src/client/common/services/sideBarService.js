(function () {

    //SideBar
    angular.module('common')
        .factory('sideBarService', sideBarService);

    function sideBarService() {

        var data = {
            showSideBar: true
        };

        return {
            getSideBarVisible: function () {
                return data.showSideBar;
            },
            setSideBarVisible: function (sideBarVisible) {
                data.showSideBar = sideBarVisible;
            }
        };
    }
})();
