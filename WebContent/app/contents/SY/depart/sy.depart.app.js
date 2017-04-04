(function () {
    "use strict";

    // [SY] > 부서관리
    var departApp = angular.module("SY.depart", ["SY.depart.controller", "SY.depart.service"]);
    angular.module("SY.depart.controller", []);
    angular.module("SY.depart.service", []);

    departApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syDepart", {
            url		: "/admin/depart?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/SY/depart/templates/sy.depart.tpl.html",
                    controller	: "SY.departCtrl",
                    resolve		: {
                        resData: [ "AuthSvc", "SY.departSvc", "SY.codeSvc", "APP_CODE", "$q",
                            function ( AuthSvc, SyDepartSvc, SyCodeSvc, APP_CODE, $q) {
                                var defer 	= $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    $q.all([
                                        SyDepartSvc.getDepart({ search: "all" }),
                                        SyCodeSvc.getSubcodeList({ cd: APP_CODE.workgroup.cd }),
                                        SyDepartSvc.getDepart({ search: "all" })
                                    ]).then(function (result) {
                                        resData.deptCodeList = result[0].data;
                                        resData.workCodeList = result[1].data;
                                        resData.deptList 	 = result[2].data;

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