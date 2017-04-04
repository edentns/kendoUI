(function () {
    "use strict";

    // [CO] dashboard
    var dbApp = angular.module("CO.dashboard", ["CO.dashboard.controller", "CO.dashboard.service", "CO.dashboard.model"]);
    angular.module("CO.dashboard.controller", [] );
    angular.module("CO.dashboard.service", [] );
    angular.module("CO.dashboard.model", [] );

    dbApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.coDashboard", {
            url		: "/coDashboard?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/CO/dashboard/templates/co.dashboard.tpl.html",
                    controller	: "CoDashboardCtrl as vm",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "$rootScope", "SY.departSvc",
                            function (AuthSvc, $q, $rootScope, SyDepartSvc) {
                                var defer 	= $q.defer(),
                                    webApp  = $rootScope.webApp,
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];
                                    defer.resolve( resData );
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