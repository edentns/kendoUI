(function () {

"use strict";

angular.module("BU.aimSalesMng.service")
		.factory("BU.aimSalesMngSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
			return {
				/**
				 * 목표매출정보를 검색한다.
				 * @param {String} type 유형(Total-TOTAL, 부서-DEPT, 개인-EMPL)
				 * @param {{year:string, dept:number, name:string}} param 검색조건
				 * @returns {*}
				 */
				find: function (type, param) {
					return $http({
						method  : "GET",
						url     : APP_CONFIG.domain +"/target/"+ type +"?"+ $.param(param)
					});
				},

				/**
				 * 목표매출정보를 등록 또는 수정한다.
				 * @param {String} type 유형(부서-DEPT, 유저-EMPL)
				 * @param {String} method POST or PUT
				 * @param {Object} param 목표매출정보
				 * @returns {*}
				 */
				save: function (type, method, param) {
					return $http({
						method  : method,
						url     : APP_CONFIG.domain +"/target/"+ type,
						data    : param
					});
				}
			};
		}]);

}());
