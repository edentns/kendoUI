(function () {
    "use strict";

    // [SY] > 권한관리
    var authApp = angular.module("SY.auth", ["SY.auth.controller", "SY.auth.service"]);
    angular.module("SY.auth.controller", []);
    angular.module("SY.auth.service", []);

    authApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syAuth", {
            url		: "/admin/auth?menu",
            views	: {
                contentView: {
                    templateUrl	: "app/contents/SY/auth/templates/sy.auth.tpl.html",
                    controller	: "SY.authMngCtrl",
                    resolve: {
                        resData: ["$stateParams", "$q", "AuthSvc", "SY.authSvc",
                            function ($stateParams, $q, AuthSvc) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];
	                                defer.resolve(resData);
                                });

                                return defer.promise;
                            }
                        ]
                    }
                }
            }
        });
    }]);
}());