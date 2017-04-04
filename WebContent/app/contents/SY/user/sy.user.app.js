(function () {
    "use strict";

    // [SY] > 유저관리
    var userApp = angular.module("SY.user", ["SY.user.controller", "SY.user.service"]);
    angular.module("SY.user.controller", []);
    angular.module("SY.user.service", []);

    userApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syUser", {
            url		: "/admin/user/:kind?menu&ids",
            views	: {
                contentView	: {
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/SY/user/templates/sy.user"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "SY.user"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve		: {
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
