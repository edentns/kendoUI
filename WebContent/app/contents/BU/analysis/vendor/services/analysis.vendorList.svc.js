(function () {
    "use strict";

    /**
     * @typedef {Object} SearchParam
     * @property {number} kind 상위부서(1-전사)
     * @property {Array.<string>} departList 하위부서
     * @property {Array.<string>} saleRepsList 영업대표
     * @property {Array.<string>} cd_vendor 제조사
     * @property {string} customerCompany 고객사
     * @property {string} salesCompany 매출처
     * @property {string} businessName 사업명
     * @property {string} duplicationYn 중복사업(YES|NO)
     * @property {string} commitYn commit(YES|NO)
     * @property {Array.<string> businessTypeList 사업유형
     * @property {Array.<string> productTypeList 제품유형
     * @property {Array.<string> winrateList winrate
     * @property {Array.<string> ingStateList 수주진행상태
     * @property {string} funnelKind Funnel 검색 범위 종류(BELOW-이하, ABOVE-이상, EXCESS-초과, EQUAL-동등, UNDER-미만, SCOPE-범위)
     * @property {number} funnelStartScale Funnel 시작금액
     * @property {number} funnelEndScale Funnel 마지막금액
     * @property {string} costKind Cost 검색 범위 종류(BELOW-이하, ABOVE-이상, EXCESS-초과, EQUAL-동등, UNDER-미만, SCOPE-범위)
     * @property {number} costStartScale Cost 시작금액
     * @property {number} costEndScale Cost 마지막금액
     * @property {string} marginKind Margin 검색 범위 종류(BELOW-이하, ABOVE-이상, EXCESS-초과, EQUAL-동등, UNDER-미만, SCOPE-범위)
     * @property {number} marginStartScale Margin 시작금액
     * @property {number} marginEndScale Margin 마지막금액
     * @property {string} periodKind 검색기간 종류(ORDER-수주, SALES-매출, COLLECT-수금)
     * @property {string} periodStartDate 시작년월일(2015-06-01)
     * @property {Date} periodStartDate 시작년월일(2015-06-01)
     * @property {Date} periodEndDate 시작년월일(2015-06-01)
     */


    /**
     * @name BU.vendor.service : BU.vendorListSvc
     * 사업분석 > Vendor - 리스트
     */
    var vendorApp = angular.module("analysis.vendor.service");
	vendorApp.factory("analysis.vendorListSvc", ["APP_CONFIG", "$http", "$q", "SY.codeSvc", "SY.departSvc", "APP_CODE", "UtilSvc", "SY.userListSvc", "$timeout",
		function ( APP_CONFIG, $http, $q, SyCodeSvc, SyDepartSvc, APP_CODE, UtilSvc, SyUserListSvc, $timeout ) {
			return {

	            // [ CRUD ]
				/**
				 * 벤더사 리스트를 가져온다.
				 * @param {SearchParam} param
				 * @returns {*}
				 */
	            getVendorList: function ( param ) {
		            return $http({
			            method : "POST",
			            url    : APP_CONFIG.domain + "/analyze/vendor",
			            data   : param
		            });
	            },
				/**
				 * 조회된 정보를 엑셀로 다운로드 받는다.
				 * @returns {Promise}
				 */
				download : function ()  {
					var param = this.makeListInqParam(UtilSvc.grid.getInquiryParam());
					return $http({
						method : "POST",
						url  : APP_CONFIG.domain +"/analyze/vendor/excel",
						data : param
					});
				},


	            // [ LOGIC ]
				/**
				 * @name setStorageSearchParam
				 * @kind function
				 * @description
				 * 세션스토리에 있는 검색조건을 SearchVO에 할당한다.
				 *
				 * @param {searchVO} search - 검색 객체
				 * @param {object|null} param - 세션스토리에 저장되어있는 검색정보
				 */
				setStorageSearchParam: function(search, param) {
					var me = this;
					if (param) {
						search.kind = Number(param.kind);
						search.departList         = me.changeType(param.departList || [], 'number') ;
						search.saleRepsList       = param.saleRepsList || [];
						search.vendorCd           = me.changeType(param.cd_vendor || [], 'number');
						search.customerCompany    = (param.customerCompany === "all") ? "" : param.customerCompany;
						search.salesCompany       = (param.salesCompany === "all") ? "" : param.salesCompany;
						search.businessName       = (param.businessName === "all") ? "" : param.businessName;
						search.duplicationYn      = param.duplicationYn==="YES" || false;
						search.commitYn           = param.commitYn==="YES" || false;
						search.businessTypeList   = me.changeType(param.businessTypeList || [], 'number');
						search.productTypeList    = me.changeType(param.productTypeList || [], 'number');
						search.winrateList        = param.winrateList || [];
						search.ingStateList       = me.changeType(param.ingStateList || [], 'number');

						if (param.funnelKind) {
							search.funnelKind = param.funnelKind;
							search.funnelStartScale = Number(param.funnelStartScale);
							search.funnelEndScale   = (param.funnelKind === "SCOPE") ? Number(param.funnelEndScale) : 0;
						}

						if ( param.costKind ) {
							search.costKind = param.costKind;
							search.costStartScale = Number(param.costStartScale);
							search.costEndScale   = (param.costKind === "SCOPE") ? Number(param.costEndScale) : 0;
						}

						if ( param.marginKind ) {
							search.marginKind = param.marginKind;
							search.marginStartScale = Number(param.marginStartScale);
							search.marginEndScale   = (param.marginKind === "SCOPE") ? Number(param.marginEndScale) : 0;
						}

						search.date = param.date;
						search.date.selected = param.date.selected;
					}
				},
				/**
				 * @name setStorageColumnsConfig
				 * @kind function
				 * @description
				 * 세션스토리에 있는 검색조건을 SearchVO에 할당한다.
				 *
				 * @param {vendorVO} vendor - 제조사 객체
				 * @param {object|null} columns - 로컬스토리에 저장되어있는 컬럼정보
				 */
				setStorageColumnsConfig: function(vendor, columns) {
					if (columns) {
						vendor.gridInfo.showColumns = columns.showColumns;
						vendor.gridInfo.hideColumns = columns.hideColumns;
						vendor.options.columnDefs   = UtilSvc.grid.getColumnDefs(vendor.gridInfo);
					}
				},
				/**
				 * @name getCodeData
				 * @kind function
				 * @description
				 * 페이지에 사용되는 코드를 가져온다.
				 *
				 * @param {object} param - 검색조건(mngDept, dept, resp)
				 * @returns {Promise}
				 */
				getCodeData: function(param) {
					return $q.all([
						SyDepartSvc.getMngDepart(param.mngDept),
						SyDepartSvc.getDepart(param.dept),
						SyUserListSvc.getUserSearchCode(param.resp),
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.business.cd, search: "all" }),      // 사업코드
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.product.cd, search: "all" }),		// 제품코드
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.orderStatus.cd, search: "all" }),	// 진행상태코드
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.collect.cd, search: "all" }),		// 수금상태코드
						SyCodeSvc.getSubcodeList({cd: APP_CODE.vendor.cd})                          // 제조사코드
					]);
				},
				/**
				 * @name doInquiry
				 * @kind function
				 * @description
				 * 제조사 검색 정보를 가져온다.
				 *
				 * @param {searchVO} searchVO - search 객체
				 * @returns {Promise}
				 */
				doInquiry : function (searchVO) {
					var self = this,
						param = self.makeListInqParam(searchVO),
						defer = $q.defer();

					self.getVendorList(param).then(function(result) {
						param.date = searchVO.date;
						UtilSvc.grid.setInquiryParam(param);
						defer.resolve(result);
					});

					return defer.promise;
				},
				/**
				 * @description
				 * 제조사 검색조건을 생성한다.
				 *
				 * @param {searchVO} search - search 객체
				 * @returns {{kind: *, customerCompany: string, salesCompany: string, businessName: string, duplicationYn: *, commitYn: *, periodKind: string, periodStartDate: (*|string), periodEndDate: (*|string)}}
				 */
				makeListInqParam: function (search) {
					var me = this,
						rtnParam = {
							kind : search.kind,
							customerCompany	: (search.customerCompany === "") ? "all" : search.customerCompany,
							salesCompany	: (search.salesCompany === "") ? "all" : search.salesCompany,
							businessName	: (search.businessName === "") ? "all" : search.businessName,
							duplicationYn	: (!search.duplicationYn ) ? null : "YES",
							commitYn		: (!search.commitYn ) ? null : "YES",
							periodKind      : "ORDER",
							periodStartDate : edt.transDateString(search.date.period.start, "-"),
							periodEndDate   : edt.transDateString(search.date.period.end, "-")
						};

					// 하위부서
					if (angular.isArray(search.departList) && search.departList.length>0) { rtnParam.departList = me.changeType(search.departList, 'string'); }

					// 영업대표
					if (angular.isArray(search.saleRepsList) && search.saleRepsList.length>0) { rtnParam.saleRepsList = search.saleRepsList; }

					// 제조사 (1)
					if (angular.isArray( search.vendorCd ) && search.vendorCd.length>0) { rtnParam.cd_vendor = me.changeType(search.vendorCd, 'string'); }

					// 제조사 (2)
					// 엑셀 다운로드 버튼시 값이 다름.
					if (angular.isArray( search.cd_vendor ) && search.cd_vendor.length>0) { rtnParam.cd_vendor = me.changeType(search.cd_vendor, 'string'); }

					// 사업유형
					if (angular.isArray( search.businessTypeList ) && search.businessTypeList.length>0) { rtnParam.businessTypeList = me.changeType(search.businessTypeList, 'string'); }

					// 제품
					if (angular.isArray( search.productTypeList ) && search.productTypeList.length>0) { rtnParam.productTypeList = me.changeType(search.productTypeList, 'string'); }

					// winrate
					if (angular.isArray( search.winrateList ) && search.winrateList.length>0) { rtnParam.winrateList = search.winrateList; }

					// 진행상태
					if (angular.isArray( search.ingStateList ) && search.ingStateList.length>0) { rtnParam.ingStateList = me.changeType(search.ingStateList, 'string'); }


					// funnel
					if (search.funnelKind) {
						rtnParam.funnelKind = search.funnelKind;
						rtnParam.funnelStartScale = Number( search.funnelStartScale );
						rtnParam.funnelEndScale   = ( search.funnelKind === "SCOPE") ? Number( search.funnelEndScale ) : 0;
					}

					// cost
					if (search.costKind) {
						rtnParam.costKind = search.costKind;
						rtnParam.costStartScale = Number( search.costStartScale );
						rtnParam.costEndScale   = ( search.costKind === "SCOPE") ? Number( search.costEndScale ) : 0;
					}

					// margin
					if (search.marginKind) {
						rtnParam.marginKind = search.marginKind;
						rtnParam.marginStartScale = Number( search.marginStartScale );
						rtnParam.marginEndScale   = ( search.marginKind === "SCOPE") ? Number( search.marginEndScale ) : 0;
					}

					return rtnParam;
				},
	            /**
	             * @name getSumaryTotal
	             * @type function
	             * @description
	             * 벤더사 리스트의 total 값을 구한다.
	             *
	             * @param {Array} dataList - 제조사 검색 결과 리스트
	             * @returns {{totFunnel: number, totForecast: number, totCommit: number, totCost: number, totMargin: number, avgMarginRate: number}}
	             */
	            getSumaryTotal: function (dataList) {
	                var i, lng, o,
	                    totFunnel = 0,
	                    totForecast = 0,
	                    totCommit = 0,
	                    totCost = 0,
	                    totMargin = 0;

	                for (i = 0, lng = dataList.length; i < lng; i += 1) {
	                    o = dataList[i];
	                    totFunnel   += o.FUNNEL;
	                    totForecast += o.FORECAST;
	                    totCommit   += o.COMMIT;
	                    totCost     += o.COST;
	                    totMargin   += o.MARGIN;
	                }

	                return {
	                    totFunnel   : totFunnel,
	                    totForecast : totForecast,
	                    totCommit   : totCommit,
	                    totCost     : totCost,
	                    totMargin   : totMargin,
	                    avgMarginRate : (totCommit!==0) ? (totMargin/totCommit)*100 : 0
	                };
	            },
				/**
				 * @name changeType
				 * @kind function
				 * @description
				 * 단일 배열의 타입을 변경한다.
				 *
				 * @param {Array.<*>} data - 변경될 데이터
				 * @param {string} type - 변경될 데이터 타입(string, number)
				 * @returns {Array}
				 */
				changeType: function(data, type) {
					var result = [];

					angular.forEach(data, function(d) {
						var changedData;
						switch (type) {
							case 'number':
								changedData = d * 1;
								break;
							case 'string':
								changedData = d +'';
								break;
							default:
								changedData = d;
								break;
						}
						result.push(changedData);
					});
					return result;
				}
	        };
	    }]);
}());
