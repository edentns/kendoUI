(function () {
	'use strict';

	angular
		.module('EQ.01eqMaster.service')
		.factory('EQ.01eqMasterListBiz', EqMasterListBiz);


	EqMasterListBiz.$inject = ['UtilSvc', 'EQ.01eqMasterSvc', 'SY.codeSvc', 'ModalSvc', 'APP_CODE', '$q', '$rootScope', '$timeout'];

	/**
	 * 장비 List Biz Service
	 * @constructor
	 */
	function EqMasterListBiz (UtilSvc, EqMasterSvc, SyCodeSvc, ModalSvc, APP_CODE, $q, $rootScope, $timeout) {
		var cache = { prevEqmListParam: null },
			BizFn;

		BizFn = {
			/**
			 * 모든 코드 정보를 가져온다.
			 * @param {object} param composite param
			 * @returns {promise}
			 * @private
			 */
			_getCodeAll: function (param) {
				return $q.all([
					SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmTp.cd  }),   // 장비유형
					SyCodeSvc.getSubcodeList({ cd: APP_CODE.vendor.cd }),   // 제조사
					EqMasterSvc.getEqmList(param)                           // 조회리스트
				]);
			},

			/**
			 * 조회전 검색조건을 가져온다.
			 * @param {object} searchParam 검색Param 모델
			 * @returns {object}
			 * @private
			 */
			_getInitListParam: function (searchParam) {
				cache.prevEqmListParam = UtilSvc.grid.getInquiryParam();
				return !(cache.prevEqmListParam) ? BizFn._getEqmListParam(searchParam) : BizFn._getEqmListParam(cache.prevEqmListParam);
			},

			/**
			 * 검색조건을 가져온다.
			 * @param {object} searchParam 검색Param 모델
			 * @returns {object}
			 * @private
			 */
			_getEqmListParam: function (searchParam) {
				var rtnParam = {
					CD_DTN_YN: searchParam.CD_DTN_YN==='' ? 0 : Number(searchParam.CD_DTN_YN)
				};

				if (searchParam.NM_EQM     ) { rtnParam.NM_EQM    = searchParam.NM_EQM; }
				if (searchParam.NM_EQM_ID  ) { rtnParam.NM_EQM_ID = searchParam.NM_EQM_ID; }
				if (searchParam.DC_SRN     ) { rtnParam.DC_SRN    = searchParam.DC_SRN; }
				if (searchParam.NM_MODEL   ) { rtnParam.NM_MODEL  = searchParam.NM_MODEL; }
				if (searchParam.DC_EQM_POS ) { rtnParam.DC_EQM_POS= searchParam.DC_EQM_POS; }
				if (searchParam.DC_IPA     ) { rtnParam.DC_IPA    = searchParam.DC_IPA; }
				if (searchParam.CD_EQM_TP && searchParam.CD_EQM_TP.length>0) { rtnParam.CD_EQM_TP= searchParam.CD_EQM_TP; }
				if (searchParam.CD_VED_C  && searchParam.CD_VED_C.length>0 ) { rtnParam.CD_VED_C = searchParam.CD_VED_C;  }
				if (searchParam.NO_MNG_CUST  ) { rtnParam.NO_MNG_CUST  = searchParam.NO_MNG_CUST; }
				if (searchParam.NO_SERV_CUST ) { rtnParam.NO_SERV_CUST = searchParam.NO_SERV_CUST; }

				return rtnParam;
			},

			/**
			 * 검색조건과 Column Model에 할당한다.
			 * @param {object} searchParam 검색Param 모델
			 * @param {object} eqm 장비 모델
			 */
			_setParamAndColumn: function (searchParam, eqm) {
				BizFn._setInqParam(searchParam);
				BizFn._setGridColumn(eqm);
			},

			/**
			 * 검색조건을 model에 할당한다.
			 * @param {object} searchParam 검색Param 모델
			 * @private
			 */
			_setInqParam: function (searchParam) {
				if (cache.prevEqmListParam) { angular.copy(cache.prevEqmListParam, searchParam); }
			},

			/**
			 * Grid Column을 설정한다.
			 * @param {object} eqm 장비 모델
			 * @private
			 */
			_setGridColumn: function (eqm) {
				UtilSvc.grid.initColumnSetting(eqm);
			},

			/**
			 * 페이지 초기 로드시 실행된다.
			 * @param {object} code 코드 모델
			 * @param {object} searchParam 검색Param 모델
			 * @param {object} eqm 장비 모델
			 */
			initLoad: function (code, searchParam, eqm) {
				var param = BizFn._getInitListParam(searchParam);

				BizFn._getCodeAll(param).then(function (res) {
					code.eqmTpList  = res[0].data;
					code.vendorList = res[1].data;

					$timeout(function () {
						BizFn._setParamAndColumn(searchParam, eqm);
						eqm.grid.data = res[2].data.result;
						UtilSvc.grid.setInquiryParam(searchParam);
						$rootScope.$emit('event:autoLoader', true);
					});
				});
			},

			/**
			 * 장비전체 조회
			 * @param {object} searchParam 검색Param 모델
			 * @returns {*}
			 */
			inquiry: function (searchParam) {
				var param = BizFn._getEqmListParam(searchParam),
					defer = $q.defer();

				EqMasterSvc.getEqmList(param).then(function (res) {
					UtilSvc.grid.setInquiryParam(searchParam);
					defer.resolve(res.data.result);
				});
				return defer.promise;
			},

			/**
			 * 고객사 검색 팝업을 연다.
			 * @returns {Object}
			 */
			modalCustCmp: function () {
				var modalInstance = ModalSvc.openSearchCustCmp();
				return modalInstance.result;
			},

			/**
			 * Grid Column을 설정한다.
			 * @param {object} eqm 장비 모델
			 */
			modalSetColumn: function (eqm) {
				var column = eqm.column,
					grid   = eqm.grid,

					modalInstance = ModalSvc.openSetColumn({
						resolve		: {
							revColumns : function () {
								return column;
							}
						}
					});

				modalInstance.result.then(function (res) {
					column.showColumns = res.showColumns;
					column.hideColumns = res.hideColumns;
					grid.columnDefs = UtilSvc.grid.getColumnDefs(column);

					UtilSvc.grid.setColumns(res);
				});
			},

			/**
			 * 엑셀 파일을 다운로드한다.
			 */
			downloadExcel: function () {
				var param = BizFn._getEqmListParam(UtilSvc.grid.getInquiryParam());
				EqMasterSvc.downloadExcel(param).then(function (res) {
					UtilSvc.download.excel(res.data.result);
				});
			}
		};

		return {
			initLoad        : BizFn.initLoad,
			inquiry         : BizFn.inquiry,
			modalCustCmp    : BizFn.modalCustCmp,
			modalSetColumn  : BizFn.modalSetColumn,
			downloadExcel   : BizFn.downloadExcel
		};
	}
}());