(function () {
    "use strict";

    // [SV] 사업관리
    var buApp = angular.module("SV.03svServPfm", ["SV.03svServPfm.controller", "SV.03svServPfm.service", "SV.03svServPfm.model"]);
    angular.module("SV.03svServPfm.controller", []);
    angular.module("SV.03svServPfm.service", []);
    angular.module('SV.03svServPfm.model', []);

    buApp.config(["$stateProvider", function ($stateProvider) {
        // 사업관리
        $stateProvider.state( "app.svServPfm", {
            url		: "/03svServPfm/:kind?menu&ids&pln&pfm",
            views	: {
                contentView: {                    
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        if($stateParams.kind === 'detail' || $stateParams.kind === 'insert' || $stateParams.kind === 'update'  ){
                            $stateParams.kind = "detail";
                        }
                        return "app/contents/SV/03svServPfm/templates/sv.03svServPfm"+ edt.getMenuFileName($stateParams.kind) +'.tpl.html';
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "SV.03svServPfm"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve: {
                        resData: ["$q", "AuthSvc", "$stateParams",'SV.03svServPfmSvc',
                            function ($q, AuthSvc, $stateParams,SvServPfmSvc) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    var isDetail;
                                    if($stateParams.kind === 'detail' || $stateParams.kind === 'insert' || $stateParams.kind === 'update'  ){
                                        isDetail = true;
                                    }
                                    var ids  = $stateParams.ids;
                                    var pln  = $stateParams.pln;
                                    var pfm  = $stateParams.pfm;

                                    if (isDetail && ids && pln) {
                                            SvServPfmSvc.getSvServPfm({ NO_SERV_REC: ids ,NO_SERV_PLN: pln , NO_SERV_PFM: pfm }).then(function (res) {
                                            resData.svServPfm = res.data.result.svServPfm;
                                            resData.svServPln = res.data.result.svServPln;
                                            resData.svServRec = res.data.result.svServRec;
                                            defer.resolve(resData);
                                        });

                                    } else {
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