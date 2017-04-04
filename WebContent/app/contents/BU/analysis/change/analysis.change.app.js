(function () {
    "use strict";

    // [BU] 사업분석 > 변경분석
    var changeApp = angular.module("analysis.change", ["analysis.change.controller", "analysis.change.service"]);
    angular.module("analysis.change.controller", []);
    angular.module("analysis.change.service", []);

    changeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.buAnalChange", {
            url   : "/analysis/change?menu",
            views : {
                contentView: {
                    templateUrl: "app/contents/BU/analysis/change/templates/analysis.change.tpl.html",
                    controller: "analysis.changeCtrl",
                    resolve: {
                        resData: ["AuthSvc", "$q", function (AuthSvc, $q) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function ( result ) {
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