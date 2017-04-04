(function () {
	'use strict';

	/**
	 * dashboard
	 */
	angular
		.module('CO.dashboard.service')
		.service('CoDashboardBiz', CoDashboardBiz);
	
	
	CoDashboardBiz.$inject = ['SY.userListSvc', 'ModalSvc', 'SY.departSvc', 'CO.dashboardSvc'];
	
	function CoDashboardBiz (SyUserListSvc, ModalSvc, SyDepartSvc, CoDashboardSvc) {
		var self = this;

	// 유저검색
		/**
		 * 유저검색을 위한 PARAM을 생성한다.
		 * @param {Object} search vm.search MODEL
		 * @returns {Object}
		 */
		self.getFindUserParam = function (search) {
			return {
				dept 		: 'all',
				pos			: 'all',
				status		: 'JOINED',
				searchFlag	: 'UnderSearch',
				name		: (search.name !== '') ? search.name : 'all'
			};
		};

		/**
		 * 유저 검색 모달팝업을 연다.
		 * @param {Object} param 검색조건
		 */
		self.openModalToFindUser = function (param) {
			return ModalSvc.openSearchMember({
				resolve		: {
					paramSvc : function () {
						return param;
					}
				}
			});
		};

		/**
		 * 검색조건과 일치하는 유저정보를 가져온다.
		 * @param {Object} search vm.search MODEL
		 */
		self.findUser = function (search) {
			var param = self.getFindUserParam(search);

			return SyUserListSvc.getUserList(SyUserListSvc.makeGetUserParam(param)).then(function (result) {
				var findedUser;

				if (result.data.length !== 1) {
					param.data = result.data;
					return self.openModalToFindUser(param).result;
				} else {
					findedUser = result.data[0];
                    
					return {
                        empNo       : findedUser.CD,
                        name	    : findedUser.NAME,
                        departCd    : findedUser.DEPT_CD,
                        depart      : findedUser.NM_DEPT,
						roleCd      : Number(findedUser.ROLE_CD)
					};
				}
			});
		};

	// 코드
		/**
		 * 부서코드를 가져오기 위한 PARAM을 생성한다.
		 * @param {{accessCode:number, id:string, deptCode:number}} search 부서코드를 가져오기 위해 필요한 정보
		 * @returns {{ROLE_CD:number, USER_CD:string, mgr_cd:number}}
		 */
		self.getFindDeptCodeParam = function(search) {
			return {
				ROLE_CD	: search.accessCode,
				USER_CD : search.id,
				mgr_cd	: search.auth.manager ? 0 : search.deptCode
			};	
		};

		/**
		 * 부서코드를 가져온다.
		 * @param {Object} search vm.search MODEL
		 * @returns {promise}
		 */
		self.findDeptCode = function (search) {
			return SyDepartSvc.getDepart(self.getFindDeptCodeParam(search));
		};

	// 대시보드
		/**
		 * 사업현황 정보 조회를 위한 PARAM을 생성한다.
		 * @param {Object} search vm.search MODEL
		 * @param {Object} busiPrscSearch vm.busiPrsc.chart.search | vm.busiPrsc.table.search;
		 * @returns {Object}
		 */
		// self.getFindBusiPrscParam = function (search, busiPrscSearch) {
		// 	var period	= busiPrscSearch.period,
		// 		param 	= {
		// 			start 	: period.startYear +'-'+ period.startMonth +'-01',
		// 			USER_CD : search.userCd,
		// 			ROLE_CD : search.userRoleCd
		// 		};
        //
		// 	if (period.type!=='current' && period.type!=='previous' && period.type!=='next') {
		// 		param.end = period.endYear +'-'+ period.endMonth +'-01';
		// 	}
        //
		// 	return param;
		// };

		/**
		 * 사업현황 정보를 가져온다.
		 * @param {String} tabNm 'CHART' | 'TABLE'
		 * @param {Object} search vm.search MODEL
		 * @param {Object} busiPrsc vm.busiPrsc;
		 * @returns {Object}
		 */
		// self.findBusiPrsc = function (tabNm, search, busiPrsc) {
		// 	var isChart = tabNm === 'CHART',
		// 		busiPrscSearch = isChart ? busiPrsc.chart.search : busiPrsc.table.search;
        //
		// 	return CoDashboardSvc.getBusinessCondition(self.getFindBusiPrscParam(search, busiPrscSearch)).then(function (result) {
		// 		var isReadTotal = search.userRoleCd < 6,
		// 			total = { signupCnt: 0, progressCnt: 0, completionCnt: 0, failCnt: 0, cancelCnt: 0, delayCnt: 0 };
        //
		// 		self.setBusiPrscData(busiPrsc, result.data, {
		// 			isChart     : isChart,
		// 			isReadTotal : isReadTotal
		// 		});
        //
        //
        //
		// 		if (isReadTotal) {
		// 			angular.forEach(result.data, function (data) {
		// 				total.signupCnt     += data.signupCnt;
		// 				total.progressCnt   += data.progressCnt;
		// 				total.completionCnt += data.completionCnt;
		// 				total.failCnt       += data.failCnt;
		// 				total.cancelCnt     += data.cancelCnt;
		// 				total.delayCnt      += data.delayCnt;
		// 			});
		// 			busiPrsc.data = [{
		// 				signupCnt    : total.signupCnt,
		// 				progressCnt  : total.progressCnt,
		// 				completionCnt: total.completionCnt,
		// 				failCnt      : total.failCnt,
		// 				cancelCnt    : total.cancelCnt,
		// 				delayCnt     : total.delayCnt
		// 			}];
		// 		}
        //
		// 		busiPrsc.data = busiPrsc.data.concat(result.data);
        //
		// 		// 초기설정
		// 		if (busiPrsc.chart.search.deptList.length === 0) {
		// 			busiPrsc.chart.search.deptList = isReadTotal ? [{ name: '전체', value: 0 }] : [];
		// 			angular.forEach(result.data, function (data, idx) {
		// 				busiPrsc.chart.search.deptList.push({ name: data.DEPT_NAME, value: isReadTotal ? idx+1 : idx });
		// 			});
		// 		}
        //
		// 		busiPrsc.chart.config.data = result.data[busiPrsc.chart.search.selected];
        //
		// 		return result.data;
		// 	});
		// };

		/**
		 * 사업현황 VIEW 모델에 데이터를 할당한다.
		 * @param {Object} busiPrsc 사업현황 MODEl
		 * @param {Object} result 사업현황 조회 결과
		 * @param {{isChart:boolean, isReadTotal:boolean}} config 현재 상태
		 */
		// self.setBusiPrscData = function (busiPrsc, result, config) {
		// 	var isChart	    = config.isChart,
		// 		isReadTotal = config.isReadTotal,
		// 		target      = isChart ?  busiPrsc.chart : busiPrsc.table,
		// 		total       = { signupCnt: 0, progressCnt: 0, completionCnt: 0, failCnt: 0, cancelCnt: 0, delayCnt: 0, totalCnt: 0 };
        //
		// 	busiPrsc.data = [];
        //
		// 	angular.forEach(result, function (data) {
		// 		total.signupCnt     += data.signupCnt;
		// 		total.progressCnt   += data.progressCnt;
		// 		total.completionCnt += data.completionCnt;
		// 		total.failCnt       += data.failCnt;
		// 		total.cancelCnt     += data.cancelCnt;
		// 		total.delayCnt      += data.delayCnt;
		// 		total.totalCnt      += data.totalCnt;
		// 	});
        //
		// 	if (isChart) {
		// 		if (isReadTotal) {
		// 			busiPrsc.data = [{
		// 				signupCnt    : total.signupCnt,
		// 				progressCnt  : total.progressCnt,
		// 				completionCnt: total.completionCnt,
		// 				failCnt      : total.failCnt,
		// 				cancelCnt    : total.cancelCnt,
		// 				delayCnt     : total.delayCnt
		// 			}];
		// 		}
        //
		// 		busiPrsc.data = busiPrsc.data.concat(result);
        //
		// 		// 초기설정
		// 		if (target.search.deptList.length === 0) {
		// 			target.search.deptList = isReadTotal ? [{ name: '전체', value: 0 }] : [];
		// 			angular.forEach(result, function (data, idx) {
		// 				target.search.deptList.push({ name: data.DEPT_NAME, value: isReadTotal ? idx+1 : idx });
		// 			});
		// 		}
        //
		// 		target.config.data = result[target.search.selected];
		// 	} else {
		// 		target.data = busiPrsc.data = result;
        //
		// 		target.total = {
		// 			signupCnt: total.signupCnt,
		// 			progressCnt: total.progressCnt,
		// 			completionCnt: total.completionCnt,
		// 			failCnt: total.failCnt,
		// 			cancelCnt: total.cancelCnt,
		// 			delayCnt: total.delayCnt,
		// 			totalCnt: total.totalCnt
		// 		};
		// 	}
		// };

	// 매출현황
		/**
		 * 매출현황 정보를 가져오기 위한 PARAMETER를 생성한다.
		 * @param {Object} search Global Search(유저정보)
		 * @param {Object} salesPrsc 매출현황 search
		 * @returns {{start: string, USER_CD: (string|*), ROLE_CD: (string|*)}}
		 */
		// self.getFindSalesPrscParam = function (search, salesPrsc) {
		// 	var period = salesPrsc.period,
		// 		param = {
		// 			start 	: period.startYear +'-'+ period.startMonth +'-01',
		// 			USER_CD : search.userCd,
		// 			ROLE_CD : search.userRoleCd
		// 		};
        //
		// 	if (period.type!=='current' && period.type!=='previous' && period.type!=='next') {
		// 		param.end = period.endYear +'-'+ period.endMonth +'-01';
		// 	}
        //
		// 	return param;
		// };
		/**
		 * 매출 현황정보를 가져온다.
		 * @param {String} tabNm 'CHART' | 'TABLE'
		 * @param {Object} search Global Search(유저정봉)
		 * @param {Object} salesPrsc 매출현황 모델(vm.salesPrsc);
		 * @returns {*}
		 */
		// self.getFindSalesPrsc = function (tabNm, search, salesPrsc) {
		// 	var isChart = tabNm === 'CHART',
		// 		salesPrscSearch = isChart ? salesPrsc.chart.search : salesPrsc.table.search;
        //
		// 	return CoDashboardSvc.getSales(self.getFindSalesPrscParam(search, salesPrscSearch)).then(function (result) {
		// 		self.setSalesPrsc(salesPrsc, result.data, { isChart: isChart });
		// 	});
		// };
		/**
		 * 매출현황 정보를 모델에 할당한다.
		 * @param {Object} salesPrsc 매출현황 모델
		 * @param {Array} result 매출현황 정보
		 * @param {{isChart:boolean}} config 현재 상태
		 */
		// self.setSalesPrsc = function (salesPrsc, result, config) {
		// 	var isChart = config.isChart,
		// 		target  = isChart ?  salesPrsc.chart : salesPrsc.table,
		// 		total   = {
		// 			targetRevenue   : 0,
		// 			funnel          : 0,
		// 			forecast        : 0,
		// 			commit          : 0,
		// 			targetMargin    : 0,
		// 			margin          : 0,
		// 			marginRate      : 0,
		// 			smrBill         : 0,
		// 			forecastAchieve : 0.00,
		// 			commitAchieve   : 0.00,
		// 			marginAchieve   : 0.00
		// 		};
        //
		// 	salesPrsc.data = result;
        //
		// 	result.forEach(function (data) {
		// 		total.targetRevenue += data.TARGET_REVENUE;
		// 		total.funnel        += data.FUNNEL;
		// 		total.forecast      += data.FORECAST;
		// 		total.commit        += data.COMMIT;
		// 		total.targetMargin  += data.TARGET_MARGIN;
		// 		total.margin        += data.MARGIN;
		// 		total.smrBill       += data.BIL_SALES;
		// 	});
        //
		// 	if (isChart) {
		// 		target.first.config.data = target.second.config.data = result;
		// 	} else {
		// 		target.data  = result;
		// 		target.total = total;
		// 		target.total.marginRate      = (total.commit !== 0) ? (total.margin/total.commit)*100 : 0;
		// 		target.total.forecastAchieve = (total.targetRevenue !==0 ) ? edt.mathFloor(Number(total.forecast/total.targetRevenue * 100), 2) : 0.00;
		// 		target.total.commitAchieve   = (total.targetRevenue !==0 ) ? edt.mathFloor(Number(total.commit/total.targetRevenue * 100 ), 2)  : 0.00;
		// 		target.total.marginAchieve   = (total.targetMargin  !==0 ) ? edt.mathFloor(Number(total.margin/total.targetMargin * 100 ), 2 )  : 0.00;
		// 	}
		// };

	// Managed 매출현황
		/**
		 * Managed 매출현황 정보를 가져오기 위한 PARAMETER를 생성한다.
		 * @param {Object} search Global Search(유저정보)
		 * @param {Object} mngSalesPrscSearch Managed 매출현황 search
		 * @returns {{start: string, USER_CD: (string|*), ROLE_CD: (string|*)}}
		 */
		// self.getFindMngSalesPrscParam = function (search, mngSalesPrscSearch) {
		// 	var period = mngSalesPrscSearch.period,
		// 		param  = {
		// 			start 	: period.startYear +'-'+ period.startMonth +'-01',
		// 			USER_CD : search.userCd,
		// 			ROLE_CD : search.userRoleCd
		// 		};
        //
		// 	if (period.type!=='current' && period.type!=='previous' && period.type!=='next') {
		// 		param.end = period.endYear +'-'+ period.endMonth +'-01';
		// 	}
        //
		// 	return param;
		// };
		/**
		 * Managed 매출현황 정보를 가져온다.
		 * @param {String} tabNm 'CHART' | 'TABLE'
		 * @param {Object} search Global Search(유저정봉)
		 * @param {Object} mngSalesPrsc 매출현황 모델(vm.mngSalesPrsc);
		 * @returns {*}
		 */
		// self.getFindMangSalesPrsc = function (tabNm, search, mngSalesPrsc) {
		// 	var isChart = tabNm === 'CHART',
		// 		mngSalesPrscSearch = isChart ? mngSalesPrsc.chart.search : mngSalesPrsc.table.search;
        //
		// 	return CoDashboardSvc.getSharedSales(self.getFindMngSalesPrscParam(search, mngSalesPrscSearch)).then(function (result) {
		// 		self.setMngSalesPrsc(mngSalesPrsc, result.data, { isChart: isChart });
		// 	});
		// };
		/**
		 * Managed 매출현황 정보를 모델에 할당한다.
		 */
		// self.setMngSalesPrsc = function (mngSalesPrsc, result, config) {
		// 	var isChart = config.isChart,
		// 		target  = isChart ?  mngSalesPrsc.chart : mngSalesPrsc.table,
		// 		total   = {
		// 			targetRevenue   : 0,
		// 			funnel          : 0,
		// 			forecast        : 0,
		// 			commit          : 0,
		// 			targetMargin    : 0,
		// 			margin          : 0,
		// 			marginRate      : 0,
		// 			smrBill         : 0,
		// 			forecastAchieve : 0.00,
		// 			commitAchieve   : 0.00,
		// 			marginAchieve   : 0.00
		// 		};
        //
		// 	mngSalesPrsc.data = result;
        //
		// 	result.forEach(function (data) {
		// 		total.targetRevenue += data.TARGET_REVENUE;
		// 		total.funnel        += data.FUNNEL;
		// 		total.forecast      += data.FORECAST;
		// 		total.commit        += data.COMMIT;
		// 		total.targetMargin  += data.TARGET_MARGIN;
		// 		total.margin        += data.MARGIN;
		// 		total.smrBill       += data.BIL_SALES;
		// 	});
        //
		// 	if (isChart) {
		// 		target.first.config.data = target.second.config.data = result;
		// 	} else {
		// 		target.data  = result;
		// 		target.total = total;
		// 		target.total.marginRate      = (total.commit !== 0) ? (total.margin/total.commit)*100 : 0.00;
		// 		target.total.forecastAchieve = (total.targetRevenue !== 0 ) ? edt.mathFloor(Number(total.forecast/total.targetRevenue * 100), 2) : 0.00;
		// 		target.total.commitAchieve   = (total.targetRevenue !== 0 ) ? edt.mathFloor(Number(total.commit/total.targetRevenue * 100 ), 2)  : 0.00;
		// 		target.total.marginAchieve   = (total.targetMargin  !== 0 ) ? edt.mathFloor(Number(total.margin/total.targetMargin * 100 ), 2 )  : 0.00;
		// 	}
		// };

	// 월/분기 사업현황
		/**
		 * 월/분기 사업현황 정보를 가져오기 위한 PARAMETER를 생성한다.
		 * @param {Object} search Global Search(유저정보)
		 * @param {Object} detailSalesPrscSearch 월/분기 사업현황 search
		 * @returns {{start: string, type: (string|string|*), USER_CD: (string|*), ROLE_CD: (string|*)}}
		 */
		// self.getFindDetailSalesPrscParam = function (search, detailSalesPrscSearch) {
		// 	var period = detailSalesPrscSearch.period,
		// 		param  = {
		// 			start 	: period.startYear +'-'+ period.startMonth +'-01',
		// 			type	: detailSalesPrscSearch.tab.activeTabNm,
		// 			dept    : detailSalesPrscSearch.deptCode,
		// 			USER_CD : search.userCd,
		// 			ROLE_CD : search.userRoleCd
		// 		};
        //
		// 	if (period.type!=='current' && period.type!=='previous' && period.type!=='next') {
		// 		param.end = period.endYear +'-'+ period.endMonth +'-01';
		// 	}
        //
		// 	return param;
		// };
		/**
		 * 월/분기 사업현황 정보를 가져온다.
		 * @param {String} tabNm 'CHART' | 'TABLE'
		 * @param {Object} search Global Search(유저정봉)
		 * @param {Object} detailSalesPrsc 매출현황 모델(vm.detailSalesPrsc);
		 * @returns {*}
		 */
		// self.getFindDetailSalesPrsc = function (tabNm, search, detailSalesPrsc) {
		// 	var isChart = tabNm === 'CHART',
		// 		detailSalesPrscSearch = isChart ? detailSalesPrsc.chart.search : detailSalesPrsc.table.search;
        //
		// 	return CoDashboardSvc.getQuarterBusiness(self.getFindDetailSalesPrscParam(search, detailSalesPrscSearch)).then(function (result) {
		// 		self.setDetailSalesPrsc(detailSalesPrsc, result.data, { isChart: isChart });
		// 	});
		// };
		/**
		 * 월/분기 사업현황 정보를 모델에 할당한다.
		 * @param {Object} detailSalesPrsc 매출현황 모델(vm.detailSalesPrsc);
		 * @param {Array} result 월/분기 사업현황 정보
		 * @param {{isChart:boolean}} config 상태정보
		 */
		// self.setDetailSalesPrsc = function (detailSalesPrsc, result, config) {
		// 	var isChart = config.isChart,
		// 		target  = isChart ?  detailSalesPrsc.chart : detailSalesPrsc.table,
		// 		total   = {
		// 			funnel     : 0,
		// 			forecast   : 0,
		// 			commit     : 0,
		// 			cost       : 0,
		// 			margin     : 0,
		// 			marginRate : 0.00
		// 		};
        //
		// 	detailSalesPrsc.data = result;
        //
		// 	result.forEach(function (data) {
		// 		total.funnel    += data.FUNNEL;
		// 		total.forecast  += data.FORECAST;
		// 		total.commit    += data.COMMIT;
		// 		total.cost      += data.COST;
		// 		total.margin    += data.MARGIN;
        //
		// 		data.ACCUMULATE_FUNNEL  = total.funnel;
		// 		data.ACCUMULATE_FORECAST= total.forecast;
		// 		data.ACCUMULATE_COMMIT  = total.commit;
		// 		data.ACCUMULATE_COST    = total.cost;
		// 		data.ACCUMULATE_MARGIN  = total.margin;
		// 	});
        //
		// 	if (isChart) {
		// 		target.first.config.data = target.second.config.data = result;
		// 	} else {
		// 		target.data  = result;
		// 		target.total = total;
		// 		target.total.marginRate = (total.commit !== 0) ? (total.margin/total.commit)*100 : 0.00;
		// 	}
		// };


	// BIG DEAL
		/**
		 * BIG DEAL 검색을 위한 PARAMETER를 생성한다.
		 * @param {Object} search Global Search(유저정보)
		 * @param {Object} bigDealSearch BIG DEAL 모델
		 * @returns {{type: (string|string|*), USER_CD: (string|*), ROLE_CD: (string|number|*), dept: *}}
		 */
		// self.getFindBigDealParam = function (search, bigDealSearch) {
		// 	var param 	= {
		// 		type	: bigDealSearch.tab.activeTabNm,
		// 		USER_CD : search.userCd,
		// 		ROLE_CD : search.userRoleCd,
		// 		dept    : bigDealSearch.deptCode
		// 	};
        //
		// 	return param;
		// };
		/**
		 * BIG DEAL 정보를 가져온다.
		 * @param {String} tabNm Global TAB('CHART' | 'TABLE')
		 * @param {Object} search Global Search(유저정보)
		 * @param {Object} bigDeal BIG DEAL 모델
		 * @returns {*}
		 */
		// self.findBigDeal = function (tabNm, search, bigDeal) {
		// 	var isChart = tabNm === 'CHART',
		// 		bigDealSearch = isChart ? bigDeal.chart.search : bigDeal.table.search;
        //
		// 	return CoDashboardSvc.getImportantBusiness(self.getFindBigDealParam(search, bigDealSearch)).then(function (result) {
		// 		self.setBigDealData(bigDeal, result.data, { isChart: isChart});
		// 	});
		// };
		/**
		 * BIG DEAL 정보를 모델에 할당한다.
		 * @param {Object} bigDeal BIG DEAL 모델
		 * @param {Array} result BIG DEAL 정보
		 * @param {{isChart:boolean}} config 현재 상태
		 */
		// self.setBigDealData = function (bigDeal, result, config) {
		// 	var isChart	    = config.isChart,
		// 		target      = isChart ?  bigDeal.chart : bigDeal.table;
        //
		// 	bigDeal.data = result;
        //
		// 	if (isChart) { target.config.data = result; }
		// 	else { target.data = result; }
		// };


	// 개인변경분석
		/**
		 * 개인변경분석 검색을 위한 PARAMETER를 생성한다.
		 * @param {Object} search Global Search(유저정보)
		 * @param {Object} changeAnalysisSearch 개인변경분석 모델
		 */
		// self.getChangeAnalysisParam = function (search, changeAnalysisSearch) {
		// 	return {
		// 		flag	    : changeAnalysisSearch.tab.activeTabNm,
		// 		startPeriod : changeAnalysisSearch.date.year +'-'+ changeAnalysisSearch.date.month +'-01',
		// 		USER_CD     : search.userCd,
		// 		ROLE_CD     : search.userRoleCd
		// 	};
		// };
		/**
		 * 개인변경분석 정보를 가져온다.
		 * @param {String} tabNm Global TAB('CHART' | 'TABLE')
		 * @param {Object} search Global Search(유저정보)
		 * @param {Object} changeAnalysis 개인변경분석 모델
		 * @returns {*}
		 */
		// self.findChangeAnalysis = function (tabNm, search, changeAnalysis) {
		// 	var isChart = tabNm === 'CHART',
		// 		changeAnalysisSearch = isChart ? changeAnalysis.chart.search : changeAnalysis.table.search;
        //
		// 	return CoDashboardSvc.getChangeAnalysis(self.getChangeAnalysisParam(search, changeAnalysisSearch)).then(function (result) {
		// 		self.setChangeAnalysisData(changeAnalysis, result.data, { isChart: isChart});
		// 	});
		// };
		/**
		 * 개인변경분석 정보를 모델에 할당한다.
		 * @param {Object} changeAnalysis 개인변경분석 모델
		 * @param {Array} result 개인변경분석 정보
		 * @param {{isChart:boolean}} config 현재 상태
		 */
		// self.setChangeAnalysisData = function (changeAnalysis, result, config) {
		// 	var isChart	 = config.isChart,
		// 		target   = isChart ?  changeAnalysis.chart : changeAnalysis.table;
        //
		// 	changeAnalysis.data = result;
        //
		// 	if (isChart) {
		// 		target.config.data = [];
        //
		// 		result.forEach(function (o) {
		// 			var d1  = o.alterationList[0],
		// 				d2  = o.alterationList[1],
		// 				dif = o.alterationList[2];
        //
		// 			target.config.target.y1[0].name = d1.TITLE;
		// 			target.config.target.y2[0].name = d2.TITLE;
        //
		// 			target.config.data[0] = { name: 'funnel',   accuracy: o.FUNNEL_ACCURACY,   date1: d1.TITLE, value1: d1.FUNNEL,     date2: d2.TITLE, value2: d2.FUNNEL,     difference: dif.FUNNEL };
		// 			target.config.data[1] = { name: 'forecast', accuracy: o.FORECAST_ACCURACY, date1: d1.TITLE, value1: d1.FORCAST,    date2: d2.TITLE, value2: d2.FORCAST,    difference: dif.FORCAST };
		// 			target.config.data[2] = { name: 'commit',   accuracy: o.COMMIT_ACCURACY,   date1: d1.TITLE, value1: d1.COMMIT,     date2: d2.TITLE, value2: d2.COMMIT,     difference: dif.COMMIT };
		// 			target.config.data[3] = { name: 'cost',     accuracy: o.COST_ACCURACY,     date1: d1.TITLE, value1: d1.COST,       date2: d2.TITLE, value2: d2.COST,       difference: dif.COST };
		// 			target.config.data[4] = { name: 'margin',   accuracy: o.MARGIN_ACCURACY,   date1: d1.TITLE, value1: d1.MARGIN,     date2: d2.TITLE, value2: d2.MARGIN,     difference: dif.MARGIN };
		// 		});
		// 	} else {
		// 		target.data = [];
		// 		result.forEach(function (o) {
		// 			target.data.push({
		// 				TITLE   : '정확도',
		// 				FUNNEL  : o.FUNNEL_ACCURACY,
		// 				FORECAST: o.FORECAST_ACCURACY,
		// 				COMMIT  : o.COMMIT_ACCURACY,
		// 				COST    : o.COST_ACCURACY,
		// 				MARGIN  : o.MARGIN_ACCURACY
		// 			});
        //
		// 			o.alterationList.forEach(function (alteration) {
		// 				target.data.push({
		// 					TITLE	: alteration.TITLE,
		// 					FUNNEL	: alteration.FUNNEL,
		// 					FORECAST: alteration.FORCAST,
		// 					COMMIT	: alteration.COMMIT,
		// 					COST	: alteration.COST,
		// 					MARGIN	: alteration.MARGIN
		// 				});
		// 			});
		// 		});
		// 	}
		// };

		/**
		 * max와 min 값을 구한다.
		 * @param {object} data 데이터
		 * @param {Array} target target List
		 * @returns {*|{max, min}|{max: number, min: number}}
		 */
		self.getMaxMin = function (data, target) {
			var visibleList = edt.findAll(target, 'visible', true),
				visibleData = [];

			visibleList.forEach(function (conf) {
				visibleData.push(data[conf.field]);
			});

			return edt.getMaxMin(visibleData);
		};
        
        /**
         * @description
         * 공통적인 payload를 객체에 할당한다.
         * 
         * @param target
         * @param payload
         * @returns {*}
         */
        self.setPayload = function(target, payload) {
            payload = payload || {};
            
            var key;
            for (key in payload) {
                if (payload.hasOwnProperty(key)) {
                    target[key] = payload[key];
                }
            }
            
            return target;
        };
	}
}());