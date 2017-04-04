(function () {
    "use strict";

    // [BU] 사업분석 > 변경분석
    var changeApp = angular.module("BU.aimSaleskendoMng", ["BU.aimSaleskendoMng.controller", "BU.aimSaleskendoMng.service"]);
    angular.module("BU.aimSaleskendoMng.controller", []);
    angular.module("BU.aimSaleskendoMng.service", []);

    changeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.buAimSaleskendo", {
        	url   : "/bu/aimSaleskendoMng?menu",
			views : {
				contentView: {
					templateUrl : "app/contents/BU/aimSaleskendo/templates/bu.aimSaleskendoMng.tpl.html",
					controller  : "BU.aimSaleskendoMngCtrl",
					resolve     : {
						resData: ["AuthSvc", "SY.codeSvc", "APP_CODE", "$q", 
						    function (AuthSvc, SyCodeSvc, APP_CODE, $q) {
								var defer = $q.defer(),
									resData = {};
	
								AuthSvc.isAccess().then(function (result) {
									resData.access = result[0];
	
									$q.all([
		                                SyCodeSvc.getSubcodeList({ cd: APP_CODE.workgroup.cd }),
		                            ]).then(function (result) {
		                                resData.workCodeList = result[0].data;
		                                defer.resolve( resData );
		                            });
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