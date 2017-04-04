(function () {
    'use strict';

    // [SY] 로그인
    var loginApp = angular.module('SY.login', ['SY.login.controller', 'SY.login.service']);
    angular.module('SY.login.controller', []);
    angular.module('SY.login.service', []);

    loginApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('login', {
            url  : '/login',
            templateUrl : 'app/contents/SY/login/templates/sy.login.tpl.html',
            controller  : 'SY.LoginCtrl',
            resolve     : {
                isLogin : ['SY.LoginSvc', '$state', '$rootScope', '$q', function (LoginSvc, $state, $rootScope, $q) {
                    var defer = $q.defer();
                    LoginSvc.isLogin().then(function (result) {
                        if (result.status !== 401) {
	                        $state.go('app.coDashboard', { menu: true });
	                        defer.resolve();
                        } else {
	                        defer.resolve();
                            $rootScope.$emit('event:logout');
                        }

                    });

                    return defer.promise;
                }]
            }
        });
    }]);
}());