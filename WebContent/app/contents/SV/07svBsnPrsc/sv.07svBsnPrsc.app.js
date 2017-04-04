(function () {
    "use strict";

    // [SV] 사업관리
    var buApp = angular.module("SV.07svBsnPrsc", ["SV.07svBsnPrsc.controller", "SV.07svBsnPrsc.service"]);
    angular.module("SV.07svBsnPrsc.controller", []);
    angular.module("SV.07svBsnPrsc.service", []);

    buApp.config(["$stateProvider", function ($stateProvider) {
        // 사업관리
        $stateProvider.state( "app.svBsnPrsc", {
            url		: "/07svBsnPrsc/:kind?menu&ids",
            views	: {
                contentView: {                    
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) { $stateParams.kind = "list"; }
                        return "app/contents/SV/07svBsnPrsc/templates/sv.07svBsnPrsc"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) { $stateParams.kind = "list"; }
                        return "SV.07svBsnPrsc"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve: {
                        resData: ["$q", "AuthSvc", "$stateParams",
                            function ($q, AuthSvc, $stateParams) {
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
}(window));