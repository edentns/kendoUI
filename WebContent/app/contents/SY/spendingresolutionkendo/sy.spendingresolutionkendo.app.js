(function () {
    "use strict";

    // [SY] > 부서관리
    var departkendoApp = angular.module("SY.spendingresolutionkendo", ["SY.spendingresolutionkendo.controller", "SY.spendingresolutionkendo.service"]);
    angular.module("SY.spendingresolutionkendo.controller", []);
    angular.module("SY.spendingresolutionkendo.service", []);

    departkendoApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.sySpendingResolutionKendo", {
            url		: "/admin/spendingresolutionkendo?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/SY/spendingresolutionkendo/templates/sy.spendingresolutionkendo.tpl.html",
                    controller	: "SY.spendingresolutionkendoCtrl",
                    resolve		: {
                        resData: [ "AuthSvc", "SY.spendingresolutionkendoSvc", "SY.codeSvc", "APP_CODE", "$q",
                            function ( AuthSvc, SySpendingResolutionkendoSvc, SyCodeSvc, APP_CODE, $q) {
                                var defer 	= $q.defer(),
                                    resData = {};
                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    $q.all([
                                        SyCodeSvc.getSubcodeList({ cd: APP_CODE.workgroup.cd }),
                                    ]).then(function (result) {
                                        resData.workCodeList = result[0].data;
                                        defer.resolve( resData );
                                    });
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