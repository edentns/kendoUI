(function () {
	"use strict";

	function BuChangeHistSvc (APP_CONFIG, $http) {
		return {
			/**
			 * 변경 이력 정보를 가져온다.
			 * @param {Object} param 조회조건
			 * @returns {promise}
			 */
			getChangeHistList: function (param) {
				return $http({
					method	: "POST",
					url		: APP_CONFIG.domain +"/buChgHistSearch",
					data	: param
				});
			},

			/**
			 * 변경이력정보를 엑셀 다운로드한다.
			 * @param {Object} param 조회조건
			 * @returns {promise}
			 */
			downloadExcel: function (param) {
				return $http({
					method	: "POST",
					url		: APP_CONFIG.domain +"/buChgHist/excel",
					data	: param
				});
			}
		};
	}

	BuChangeHistSvc.$inject = ["APP_CONFIG", "$http"];


	angular.module("BU.changeHist.service")
		.factory("BU.changeHistSvc", BuChangeHistSvc);
}());