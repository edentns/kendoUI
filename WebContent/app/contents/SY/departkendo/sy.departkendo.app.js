(function () {
    "use strict";

    // [SY] > 부서관리
    var departkendoApp = angular.module("SY.departkendo", ["SY.departkendo.controller", "SY.departkendo.service"]);
    angular.module("SY.departkendo.controller", []);
    angular.module("SY.departkendo.service", []);

    departkendoApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syDepartKendo", {
            url		: "/admin/departkendo?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/SY/departkendo/templates/sy.departkendo.tpl.html",
                    controller	: "SY.departkendoCtrl",
                    resolve		: {
                        resData: [ "AuthSvc", "SY.departkendoSvc", "SY.codeSvc", "APP_CODE", "$q",
                            function ( AuthSvc, SyDepartkendoSvc, SyCodeSvc, APP_CODE, $q) {
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