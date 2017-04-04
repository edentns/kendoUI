(function () {
    "use strict";

    // [CU]	고객사
    var companyApp = angular.module("CU.company", ["CU.company.controller", "CU.company.service"]);
    angular.module("CU.company.controller", []);
    angular.module("CU.company.service", []);

    companyApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.csCompany", {
            url		: "/customer/company/:kind?menu&ids",
            views	: {
                contentView	: {
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/CU/company/templates/cu.company"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "CU.company"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
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