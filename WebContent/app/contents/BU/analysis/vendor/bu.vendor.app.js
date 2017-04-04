(function () {
    "use strict";

    // [BU] 월별회의록
    var meetingApp = angular.module("analysis.vendor", ["analysis.vendor.controller", "analysis.vendor.service"]);
    angular.module("analysis.vendor.controller", []);
    angular.module("analysis.vendor.service", []);

    meetingApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.buAnalVendor", {
            url   : "/analysis/vendor/:kind?menu&ids",
            views : {
                contentView: {
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/BU/analysis/vendor/templates/analysis.vendor"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "analysis.vendor"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve     : {
                        resData: ["AuthSvc", "$q", function (AuthSvc, $q) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];

                                defer.resolve(resData);
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());