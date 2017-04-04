(function () {
	'use strict';

	angular
		.module('SV.common.service', [])
		.service('SvCommonSvc', ['$http', 'APP_CONFIG',
			function ($http, APP_CONFIG) {
				var self = this;

				/**
				 * 상위부서 조회
				 * @returns {promise}
				 */
				self.getSeniorDept = function () {
					return $http({
						method: 'GET',
						url: APP_CONFIG.domain + '/svdept/kind'
					});
				};
				/**
				 * 하위부서 조회
				 * @param {number} param 검색조건
				 * @returns {promise}
				 */
				self.getSubDept = function (param) {
					var url = APP_CONFIG.domain + '/svdept/dept';
					if (param) {
						url += '?kind='+ param;
					}

					return $http({
						method: 'GET',
						url: url
					});
				};
				/**
				 * 유저 조회
				 * @param {Array=} param 하위부서
				 * @returns {promise}
				 */
				self.getUser = function (param) {
					var url = APP_CONFIG.domain + '/svuser';
					if (param && param.length>0) {
						url += '?'+ edt.makeGetParam(param, 'sel_dept');
					}

					return $http({
						method: 'GET',
						url: url
					});
				};
			}
		])

}());