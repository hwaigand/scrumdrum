///<reference path="~/Scripts/jquery-2.1.4.js"/>
///<reference path="~/Scripts/jasmine/jasmine.js"/>
///<reference path="~/Scripts/angular.js"/>
///<reference path="~/Scripts/angular-animate.js"/>
///<reference path="~/Scripts/angular-local-storage.js"/>
///<reference path="~/Scripts/loading-bar.js"/>
///<reference path="~/Scripts/angular-jwt.js"/>
///<reference path="~/Scripts/ng-grid.js"/>
///<reference path="~/Scripts/toastr.js"/>
///<reference path="~/Scripts/angular-mocks.js"/>
///<reference path="~/Scripts/angular-ui-router.js"/>
///<reference path="~/Scripts/angular-ui/ui-bootstrap-tpls.min.js"/>

///<reference path="~/src/client/app/app.module.js"/>
///<reference path="~/src/client/app/app.config.js"/>
///<reference path="~/src/client/common/common.module.js"/>
///<reference path="~/src/client/common/common.config.js"/>
///<reference path="~/src/client/common/services/oauthService.js"/>
///<reference path="~/src/client/common/services/currentUserService.js"/>
///<reference path="~/src/client/common/services/loginRedirectService.js"/>
///<reference path="~/src/client/common/services/addTokenService.js"/>
///<reference path="~/src/client/common/services/formEncodeService.js"/>
///<reference path="~/src/client/common/services/errorService.js"/>
///<reference path="~/src/client/common/services/onlineStatusService.js"/>
///<reference path="~/src/client/common/services/localStorageService.js"/>
///<reference path="~/src/client/common/services/sideBarService.js"/>
///<reference path="~/src/client/common/services/alertingService.js"/>
///<reference path="~/src/client/app/services/storeService.js"/>
///<reference path="~/src/client/app/services/storeActivityService.js"/>

describe('Services', function () {

    beforeEach(module('app'));

    describe('Authorization service', function () {

        var authService;

        beforeEach(inject(function ($injector) {
            authService = $injector.get('oauthService');
        }));

        it('should return 1 user', function () {
            expect(authService.login('ldee', 'gr1mmway$')).toBeDefined();
        });

        it('should return 4 dogs when querying after adding a dog', function () {
            //dog.add({ name: 'Fido', type: 'German Shepherd' });
            // expect(storeService.query().length).toBe(4);
        });
    });

    describe('Store service', function () {

        var storeService;

        beforeEach(inject(function ($injector) {
            storeService = $injector.get('storeFactory');
        }));

        it('should return a store', function () {
            var store = storeService.getStore(1208);
            expect(store.StoreID).toBe('1208');
        });
    });

    describe('sorting the list of users', function () {
        it('sorts in descending order by default', function () {
            var users = ['jack', 'igor', 'jeff'];
            var sorted = sortUsers(users);
            expect(sorted).toEqual(['jeff', 'jack', 'igor']);
        });
    });
});
