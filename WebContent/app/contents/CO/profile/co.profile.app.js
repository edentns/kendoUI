(function () {
    "use strict";

    // [CO] profile
    var profileApp = angular.module("CO.profile", ["CO.profile.controller", "CO.profile.service"]);
    angular.module("CO.profile.controller", []);
    angular.module("CO.profile.service", []);

    profileApp.config(["$stateProvider", function ($stateProvider){
        $stateProvider.state("app.profile", {
            url   : "/profile",
            views : {
                contentView : {
                    templateUrl : "app/contents/CO/profile/templates/co.profile.tpl.html",
                    controller  : "CO.profileCtrl",
                    resolve		: {
                        resData : ["SY.LoginSvc", "$q", "$rootScope", function (SyLoginSvc, $q, $rootScope) {
                            var defer = $q.defer(),
                                resData = {};

                            SyLoginSvc.isLogin().then(function () {
                                $rootScope.$emit("event:login");
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