(function () {
	'use strict';

	angular
		.module('EQ.01eqMaster.service')
		.service('EQ.01eqMasterSvc', EqMasterSvc);


	EqMasterSvc.$inject = ['APP_CONFIG', '$http'];

	/**
	 * 장비 REST Service
	 * @constructor
	 */
	function EqMasterSvc (APP_CONFIG, $http) {
		var self = this;

		/**
		 * 장비등록
		 * @param {object} param
		 * @returns {promise}
		 */
		self.insert = function (param) {
			return $http({
				method: 'POST',
				url   : APP_CONFIG.domain +'/eqm/eqmmaster',
				data  : param
			});
		};

		/**
		 * 장비수정
		 * @param {object} param
		 * @returns {promise}
		 */
		self.update = function (param) {
			return $http({
				method: 'PUT',
				url   : APP_CONFIG.domain +'/eqm/eqmmaster',
				data  : param
			});
		};

		/**
		 * 장비 전체 조회
		 * @param {object} param
		 * @returns {*}
		 */
		self.getEqmList = function (param) {
			return $http({
				method: 'POST',
				url   : APP_CONFIG.domain +'/eqm/eqmmaster/search',
				data  : param
			});
		};

		/**
		 * 모달 장비 전체조회
		 */
		self.getModalEqmList = function (param) {
			var url = APP_CONFIG.domain +'/eqm/eqmmaster/search';
			if (param) {
				url += '?'+ $.param(param);
			}
			return $http({
				method: 'GET',
				url   : url
			});
		},

		/**
		 * 장비 상세 조회
		 * @param {{ids:string}} param 장비 검색조건
		 * @returns {promise}
		 */
		self.getEqmDetail = function (param) {
			return $http.get(APP_CONFIG.domain +'/eqm/eqmmaster?no_eqm='+ param.ids);
		};

		/**
		 * 장비서비스접수정보 전체조회
		 * @param {{NO_EQM:string, STRT_PER:string, END_PER:string, TP_PER:string}} param param 장비접수조건
		 */
		self.getEqmServList = function (param) {
			return $http.get(APP_CONFIG.domain +'/eqm/eqmmaster/svrec?'+ $.param(param));

		};


		/**
		 * 엑셀 다운로드
		 * @param {object} param
		 * @returns {*}
		 */
		self.downloadExcel = function (param) {
			return $http({
				method : 'POST',
				url    : APP_CONFIG.domain +'/eqm/eqmmaster/excel',
				data   : param
			});
		};
	}
}());
