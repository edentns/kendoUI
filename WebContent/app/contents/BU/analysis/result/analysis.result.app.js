(function () {
    "use strict";

    // [BU] 사업분석 > 실적분석
    var resultApp = angular.module("analysis.result", ["analysis.result.controller", "analysis.result.service"]);
    angular.module("analysis.result.controller", []);
    angular.module("analysis.result.service", []);

    resultApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.buAnalResult", {
            url   : "/analysis/result?menu",
            views : {
                contentView: {
                    templateUrl : "app/contents/BU/analysis/result/templates/analysis.result.tpl.html",
                    controller  : "analysis.resultCtrl",
                    resolve     : {
                        resData: ["AuthSvc", "$q", function (AuthSvc, $q) {
                            var defer = $q.defer(),
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