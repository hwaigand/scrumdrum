///<reference path="~/Scripts/jasmine/jasmine.js"/>
///<reference path="~/Scripts/angular.js"/>
///<reference path="~/Scripts/angular-mocks.js"/>

///<reference path="~/src/client/app/app.module.js"/>
///<reference path="~/src/client/app/layout/index.js"/>

describe('Controllers', function () {

    beforeEach(function () {
        module('ngAnimate');
        module('ngGrid');
        module('LocalStorageModule');
        module('angular-loading-bar');
        module('angular-jwt');
        module('common');
        module('ui.bootstrap');
        module('ui.router');
        module('app');
    });

    //beforeEach(angular.mock.module('app'));

    describe('Index controller', function () {

        var scope,
            index,
            controller;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();

            index = {
                query: function () {
                    return [{ name: 'TEST', type: 'TEST' }];
                }
            }

            controller = $controller('IndexController', { $scope: scope, Index: index });
        }));

        //it('should have a Method activate', function () {
        //    Date dt = scope.session.selectedDate;
        //    expect(dt).toBeDate();
        //});

        it('Session should be defined', function () {
            expect(scope.session).toBeDefined();
        });

        it('onlineStatusServiceLocal should be defined', function () {
            expect(scope.onlineStatusServiceLocal).toBeDefined();
        });

        it('Initial UserId should be zero', function () {
            expect(scope.session.userId).toBe(0);
        });
    });
});
