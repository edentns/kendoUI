(function () {
    "use strict";

    // [SY] > 코드관리
    var codeApp = angular.module("SY.code", ["SY.code.controller", "SY.code.service"]);
    angular.module("SY.code.controller", []);
    angular.module("SY.code.service", []);

    codeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syCode", {
            url: "/admin/code?menu",
            views: {
                contentView: {
                    templateUrl : "app/contents/SY/code/templates/sy.code.tpl.html",
                    controller  : "SY.codeCtrl",
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