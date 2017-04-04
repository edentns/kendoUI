(function () {
    "use strict";

    // [BU]
    angular.module("edtApp.BU", ["BU.business", "BU.analysis", "BU.aimSalesMng", "BU.meeting", "BU.changeHist", "BU.aimSaleskendoMng"]);

    // 목표매출관리
    angular.module("BU.aimSalesMng.controller", []);
    angular.module("BU.aimSalesMng.service", []);
	angular.module("BU.aimSalesMng.model", []);
    angular.module("BU.aimSalesMng", ["BU.aimSalesMng.controller", "BU.aimSalesMng.service", "BU.aimSalesMng.model"])
        .config(["$stateProvider", function ($stateProvider) {
			$stateProvider.state("app.buAimSales", {
				url   : "/bu/aimSalesMng?menu",
				views : {
					contentView: {
						templateUrl : "app/contents/BU/aimSales/templates/bu.aimSalesMng.tpl.html",
						controller  : "BU.AimSalesMngCtrl",
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

	// 변경이력조회
	angular.module("BU.changeHist.controller", []);
	angular.module("BU.changeHist.service", []);
	angular.module("BU.changeHist.model", []);
	angular.module("BU.changeHist", ["BU.changeHist.controller", "BU.changeHist.service", "BU.changeHist.model"])
		.config(["$stateProvider", function ($stateProvider) {
			$stateProvider.state("app.buChangeHist", {
				url   : "/bu/changeHist?menu",
				views : {
					contentView: {
						templateUrl : "app/contents/BU/changeHist/templates/bu.changeHist.tpl.html",
						controller  : "BU.ChangeHistCtrl",
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