(function () {
    "use strict";

    // [CU]	담당자
    var chargeApp = angular.module("CU.charge", ["CU.charge.controller", "CU.charge.service"]);
    angular.module("CU.charge.controller", []);
    angular.module("CU.charge.service", []);

    chargeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.csCharge", {
            url		: "/customer/charge/:kind?menu&ids",
            views	: {
                contentView	: {
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/CU/charge/templates/cu.charge"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "CU.charge"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve: {
                        resData: ["$q", "AuthSvc",
                            function ($q, AuthSvc) {
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