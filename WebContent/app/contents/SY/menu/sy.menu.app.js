(function () {
    "use strict";

    // [SY] > 메뉴관리
    var menuApp = angular.module("SY.menu", ["SY.menu.controller", "SY.menu.service"]);
    angular.module("SY.menu.controller", []);
    angular.module("SY.menu.service", []);

    menuApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syMenu", {
            url   : "/admin/menu?menu",
            views : {
                contentView : {
                    templateUrl : "app/contents/SY/menu/templates/sy.menu.tpl.html",
                    controller  : "SY.menuCtrl",
                    resolve     : {
                        resData : ["AuthSvc", "$q", function (AuthSvc, $q) {
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