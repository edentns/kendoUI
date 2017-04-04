(function () {
    "use strict";

    // [BU] 사업관리
    var buApp = angular.module("BU.business", ["BU.business.controller", "BU.business.service"]);
    angular.module("BU.business.controller", []);
    angular.module("BU.business.service", []);

    buApp.config(["$stateProvider", function ($stateProvider) {
        // 사업관리
        $stateProvider.state( "app.buBusiness", {
            url		: "/business/:kind?menu&ids",
            views	: {
                contentView: {
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/BU/business/templates/bu.business"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "BU.business"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve: {
                        resData: ["$q", "AuthSvc", "$stateParams", "BU.businessInfoSvc", "Page",
                            function ($q, AuthSvc, $stateParams, BuBusinessInfoSvc, Page) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    var kind = $stateParams.kind,
                                        ids  = $stateParams.ids,
	                                    page = new Page({ auth: resData.access });

                                    if (edt.isValid(ids)) {
                                        BuBusinessInfoSvc.getOrderDetailInfo({uniqCd : ids}).then(function (result) {
                                            var buStatus = BuBusinessInfoSvc.getBuStatus(kind, page, result.data[0]);
                                            if (buStatus === 0) {
	                                            alert('접근 권한이 없습니다.');
	                                            defer.reject();
                                            }
                                            else {
	                                            resData.buStatus = buStatus;
	                                            resData.buInfo = result.data[0];
	                                            defer.resolve(resData);
	                                        }
                                        });
                                    }
                                    else {
	                                    if (kind === "insert" && !page.isSalesWorkGroup()) {
		                                    alert('접근 권한이 없습니다. 영업직군만 등록 가능합니다.');
		                                    defer.reject();
	                                    }
	                                    else {
		                                    defer.resolve(resData);
	                                    }
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
