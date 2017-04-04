(function () {
    "use strict";

    // [SV] 사업관리
    var svApp = angular.module("SV.05svEmgObsProc", ["SV.05svEmgObsProc.controller", "SV.05svEmgObsProc.service"]);
    angular.module("SV.05svEmgObsProc.controller", []);
    angular.module("SV.05svEmgObsProc.service", []);

    svApp.config(["$stateProvider", function ($stateProvider) {
        // 사업관리
        $stateProvider.state("app.svEmgObsProc", {
            url		: "/05svEmgObsProc/:kind?menu&ids",
            views	: {
                contentView: {                    
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/SV/05svEmgObsProc/templates/sv.05svEmgObsProc"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "SV.05svEmgObsProc"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve: {
                        resData: ["$q", "AuthSvc", "$stateParams", 'SV.05svEmgObsProcInfoSvc',
                            function ($q, AuthSvc, $stateParams, SvEmgObsProcInfoSvc) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];
                                    
                                    var isDetail = $stateParams.kind==='detail',
                                        ids      = $stateParams.ids;
                                    if(isDetail && ids) {
                                    	SvEmgObsProcInfoSvc.getSvServRec({NO_SERV_REC: ids}).then(function (res) {
                                    		resData = res.data.result;
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