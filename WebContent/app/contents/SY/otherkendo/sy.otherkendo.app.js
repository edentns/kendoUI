(function () {
    "use strict";

    // [SY] > 부서관리
    var departkendoApp = angular.module("SY.otherkendo", ["SY.otherkendo.controller", "SY.otherkendo.service"]);
    angular.module("SY.otherkendo.controller", []);
    angular.module("SY.otherkendo.service", []);

    departkendoApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syOtherKendo", {
            url		: "/admin/otherkendo?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/SY/otherkendo/templates/sy.otherkendo.tpl.html",
                    controller	: "SY.otherkendoCtrl",
                    resolve		: {
                        resData: [ "AuthSvc", "SY.otherkendoSvc", "SY.codeSvc", "APP_CODE", "$q",
                            function ( AuthSvc, SyOtherkendoSvc, SyCodeSvc, APP_CODE, $q) {
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