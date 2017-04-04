(function () {
    "use strict";

    // [SV] 사업관리
    var buApp = angular.module("SV.02svServPln", ["SV.02svServPln.controller", "SV.02svServPln.service", "SV.02svServPln.model"]);
    angular.module("SV.02svServPln.controller", []);
    angular.module("SV.02svServPln.service", []);
    angular.module("SV.02svServPln.model", []);

    buApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.svServPln", {
            url		: "/02svServPln/:kind?menu&ids",
            views	: {
                contentView: {                    
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/SV/02svServPln/templates/sv.02svServPln"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "SV.02svServPln"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve: {
                        resData: ['$q', 'AuthSvc', '$stateParams', 'SV.02svServPlnSvc',
                            function ($q, AuthSvc, $stateParams, SvServPlnSvc) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    var isDetail = $stateParams.kind==='detail',
                                        ids  = $stateParams.ids;
                                    if (isDetail && ids) {
                                        SvServPlnSvc.getSvServPln({ NO_SERV_REC: ids }).then(function (res) {
                                            var data = res.data.result;
                                            resData.svServRec  = data.svServRec;
                                            resData.svServPln   = data.svServPln;
                                            resData.svServPfm  = data.svServPfm;
                                            defer.resolve(resData);
                                        });

                                    } else {
                                        $stateParams.ids = null;
                                        defer.resolve(resData);
                                    }
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