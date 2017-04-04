(function () {

	"use strict";

	function ChangeHistCtrl ($scope, resData, uiGridConstants, SyDepartSvc, SyUserListSvc, BuChangeHistBiz, BuChangeHistSvc, $timeout, $state, $q, Page) {
		var page  = $scope.page = new Page({ auth: resData.access }),
			today = edt.getToday(),
			vm = {}, search, hist;

		page.setPreProcessor("searchStorage", function(next) {
			BuChangeHistBiz.setStorageSearchParam(vm.search);
			next();
		});

		page.setPreProcessor("columnStorage", function(next) {
			BuChangeHistBiz.setStorageColumnsConfig(vm.hist.items);
			next();
		});

		page.setPreProcessor("code", function(next) {
			var me = this;

			me.code = {};
			BuChangeHistBiz.getCodeData(vm.search).then(function(result) {
				if (page.isAccessAll()) {
					result[0].data.unshift({CD: 1, NAME: "전사"});
				}

				// 상위부서코드(0), 하위부서코드(1), 영업대표코드(2)
				var codeKeys = ['seniorCodeList', 'departCodeList', 'salesRepList'];
				angular.forEach(codeKeys, function (key, idx) {
					me.code[key] = result[idx].data;
				});

				next();
			});
		});



		var paintPrice = function (grid, row, col) {
				var amount = grid.getCellValue(row,col),
					rtnClass = "ta-r pr-10";

				if (amount < 0) { rtnClass += " red"; }

				return rtnClass;
			},
			footerTemplate = "<div class=\"ui-grid-cell-contents\" data-col-index=\"renderIndex\"><div class=\"ta-r pr-15\" data-ng-class=\"{'red': col.getAggregationValue() < 0}\">{{col.getAggregationValue() | number}}</div></div>",
			gridFields = [
				{ visible: true, field: "STATUS_FLAG", displayName: "Status", width:  70, cellClass: "ta-c" },
				{ visible: true, field: "NM_PJT"	, displayName: "사업명", width: 145, cellClass: "ta-c" },
				{ visible: true, field: "NM_CUST", displayName: "고객사", width: 145, cellClass: "ta-c" },
				{ visible: true, field: "NM_EMP", displayName: "영업대표", width:  90, cellClass: "ta-c" },
				{ visible: true, field: "FD_COMMIT", displayName: "FD-매출금액", width: 145, cellClass: paintPrice, cellFilter: "number" },
				{ visible: true, field: "AD_COMMIT", displayName: "AD-매출금액", width: 145, cellClass: paintPrice, cellFilter: "number" },
				{ visible: true, field: "GAP_COMMIT", displayName: "매출차이금액", width: 145, cellClass: paintPrice, cellFilter: "number",
					aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, footerCellTemplate: footerTemplate
				},
				{ visible: true, field: "FD_COST", displayName: "FD-매입금액", width: 145, cellClass: paintPrice, cellFilter: "number" },
				{ visible: true, field: "AD_COST", displayName: "AD-매입금액", width: 145, cellClass: paintPrice, cellFilter: "number" },
				{ visible: true, field: "GAP_COST", displayName: "매입차이금액"	, width: 145, cellClass: paintPrice, cellFilter: "number",
					aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, footerCellTemplate: footerTemplate },
				{ visible: true, field: "FD_DT_SALES", displayName: "FD-매출년월", width: 145, cellClass: "ta-c" },
				{ visible: true, field: "AD_DT_SALES", displayName: "AD-매출년월", width: 145, cellClass: "ta-c" },
				{ visible: true, field: "FD_MARGIN", displayName: "FD-Margin", width: 145, cellClass: paintPrice, cellFilter: "number" },
				{ visible: true, field: "AD_MARGIN", displayName: "AD-Margin", width: 145, cellClass: paintPrice, cellFilter: "number" },
				{ visible: true, field: "GAP_MARGIN", displayName: "Magin차이금액"	, width: 145, cellClass: paintPrice, cellFilter: "number",
					aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, footerCellTemplate: footerTemplate },
				{ visible: true, field: "FD_COMMIT_YN"	, displayName: "FD-Commit여부", width: 145, cellClass: "ta-c" },
				{ visible: true, field: "AD_COMMIT_YN", displayName: "AD-Commit여부", width: 145, cellClass: "ta-c" },
				{ visible: true, field: "FD_NM_ORDER_ST", displayName: "FD-수주상태", width: 145, cellClass: "ta-c" },
				{ visible: true, field: "AD_NM_ORDER_ST", displayName: "AD-수주상태", width: 145, cellClass: "ta-c" }
			];


		/**
		 * 검색
		 * @type {{boxTitle: string, kind: number, departList: Array, saleRepsList: Array, dtStandard: {buttonList: *[], selected: string, today: string, expect: {value: string, option: {format: string, timepicker: boolean}}, reality: {value: string, option: {format: string, timepicker: boolean}}}, dtPeriod: {dateType: string, buttonList: string[], selected: string, period: {start: *, end: *}}}}
		 */
		search = vm.search = {
			boxTitle: '검색',
			kind : (page.isAccessAll())  ? 1 : page.user.deptCode,
			departList  : [],
			saleRepsList: [],
			// 기준날짜
			dtStandard	: {
				buttonList : [
					{ active: true , code: "prevWeek1", value: "1주" },
					{ active: false, code: "prevWeek2", value: "2주" },
					{ active: false, code: "prevWeek3", value: "3주" },
					{ active: false, code: "prevWeek4", value: "4주" },
					{ active: false, code: "range"	  , value: "범위선택" }
				],
				selected: "prevWeek1",
				today	: [ today.y, today.m, today.d ].join("-"),
				expect	: {
					value	: [today.y, today.m, today.d].join("-"),
					option	: { format: "Y-m-d", timepicker: false }
				},
				reality	: {
					value	: [today.y, today.m, today.d].join("-"),
					option	: { format: "Y-m-d", timepicker: false }
				}
			},
			// 기간
			dtPeriod	: {
				dateType   : "month",
				buttonList : ["prevMonth", "current", "nextMonth", "1st", "2nd", "3rd", "4th", "year", "range"],
				selected   : "current",
				period : {
					start : angular.copy(today),
					end   : angular.copy(today)
				}
			}
		};
		/**
		 * @name vm.search.init
		 * @kind function
		 * @description
		 * 검색조건을 초기화 한다.
		 */
		search.init = function (){
			var me = this;

			me.kind = (page.isAccessAll())  ? 1 : page.user.deptCode;
			me.getDeptAndResp();
			me.clickDtStandard(me.dtStandard.buttonList[0]);
			me.dtPeriod.selected = "current";

			$timeout(function () {
				me.inquiry();
			});
		};
		/**
		 * @name vm.search.initDept
		 * @kind function
		 * @description
		 * 하위부서/팀 선택을 초기화 한다.
		 */
		search.initDept =function (){
			this.getDeptAndResp();
		};
		/**
		 * @name vm.search.initResp
		 * @kind function
		 * @description
		 * 영업대표 선택을 초기화한다.
		 */
		search.initResp = function (){
			this.saleRepsList = [];
		};
		/**
		 * @name vm.search.clickDtStandard
		 * @description
		 * 변경구간 버튼 변경 시 날짜와 버튼을 세팅한다.
		 *
		 * @param {object} btn - vm.search.dtStandard.buttonList의 button 객체
		 */
		search.clickDtStandard = function(btn) {
			var me = this;
			me.dtStandard.selected = btn.code;
			BuChangeHistBiz.clickDtStandard(me.dtStandard);
		};
		/**
		 * @name vm.search.getDeptAndResp
		 * @kind function
		 * @description
		 * 상위부서를 선택시 하위부서/팀 정보를 가져온다.
		 */
		search.getDeptAndResp = function () {
			var me = this,
				param;

			me.departList 	= [];
			me.saleRepsList = [];
			param = BuChangeHistBiz.createDeptAndRespCodeParam(me);

			$q.all([
				SyDepartSvc.getDepart(param.dept),			    // 소속코드리스트
				SyUserListSvc.getUserSearchCode(param.resp) 	// 영업사원코드리스트
			]).then(function ( result ) {
				page.code.departCodeList   = result[0].data;
				page.code.salesRepList     = result[1].data;
			});
		};
		/**
		 * @name vm.search.getSalesUser
		 * @kind function
		 * @description
		 * 영업대표정보를 가져온다.
		 */
		search.getSalesUser = function () {
			var me = this,
				param;

			me.saleRepsList = [];
			param = BuChangeHistBiz.createRespCodeParam(me);

			SyUserListSvc.getUserSearchCode(param).then(function (result) {
				page.code.salesRepList = result.data;
			});
		};
		/**
		 * @name vm.search.inquiry
		 * @description
		 * 변경이력 정보를 조회한다.
		 */
		search.inquiry = function() {
			var me = this,
				result = BuChangeHistBiz.getInquiryParam(me);

			if (result.valid) {
				BuChangeHistSvc.getChangeHistList(result.data).then(function (res) {
					BuChangeHistBiz.setChangeHistData(me, vm.hist, res.data.result);
				});
			}
			else {
				alert(result.message);
			}
		};



		/**
		 * @name vm.hist
		 * @description
		 * 변경이력 정보
		 */
		hist = vm.hist = {
			boxTitle: "변경이력"
		};
		/**
		 * @name vm.hist.summary
		 * @description
		 * 변경이력 요약정보
		 */
		hist.summary = null;
		/**
		 * @name vm.hist.items
		 * @description
		 * 변경이력 GRID
		 *
 		 * @type {{total: number, column: {columnDefs: *[], showColumns: Array, hideColumns: Array}, filter: {fields: *[]}, grid: {rowTemplate: string, originData: Array, data: Array, columnDefs: *[], showColumnFooter: boolean, enableColumnResizing: boolean}}}
		 */
		hist.items = {
			total   : 0,
			column  : {
				columnDefs  : gridFields,
				showColumns : [],
				hideColumns : []
			},
			filter  : {
				fields: [
					{ checked: true, code: "ALL", name: "전체" },
					{ checked: true, code: "C"	, name: "Commit(C)" },
					{ checked: true, code: "RA"	, name: "매출금액(RA)" },
					{ checked: true, code: "CS"	, name: "매입금액(CS)" },
					{ checked: true, code: "RD"	, name: "매출날짜(RD)" },
					{ checked: true, code: "N"	, name: "신규(N)" },
					{ checked: true, code: "D"	, name: "삭제(D)" }
				]
			},
			grid : {
				rowTemplate	: "<div ng-dblclick=\"grid.appScope.vm.hist.moveDetailPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>",
				originData   : [],
				data         : [],
				columnDefs   : gridFields,
				showColumnFooter	: true,
				enableColumnResizing: true
			}
		};
		/**
		 * @name vm.hist.moveDetailPage
		 * @description
		 * 사업 상세페이지로 이동한다.
		 *
		 * @param entity
		 */
		hist.moveDetailPage = function(entity) {
			$state.go('app.buBusiness', { kind: 'detail', menu: null, ids: entity.NO_ORDER_H });
		};
		/**
		 * @name vm.hist.downloadExcel
		 * @description
		 * 엑셀파일을 다운로드한다.
		 */
		hist.downloadExcel = function() {
			BuChangeHistBiz.downloadExcel(search);
		};
		/**
		 * @name vm.hist.downloadExcel
		 * @description
		 * 그리드 컬럼을 설정한다.
		 */
		hist.modalSetColumn = function() {
			BuChangeHistBiz.modalSetColumn(this.items);
		};
		/**
		 * @name vm.hist.toggleChangeField
		 * @kind function
		 * @description
		 * 변경이력 필드 선택 시 그리드 데이터를 필터링한다.
		 *
		 * @param {object} field
		 */
		hist.toggleChangeField = function(field) {
			BuChangeHistBiz.toggleChangeField(this.items, field);
		};


		$scope.vm = vm;

		page.bootstrap(function() {
			$timeout(function() {
				//search.clickDtStandard(search.dtStandard.buttonList[0]);
				search.inquiry();
			}, 0);
		});
	}

	ChangeHistCtrl.$inject = ["$scope", "resData", "uiGridConstants", "SY.departSvc", "SY.userListSvc", "BU.changeHistBiz", "BU.changeHistSvc", "$timeout", "$state", "$q", "Page"];
	angular.module("BU.changeHist.controller")
		.controller("BU.ChangeHistCtrl", ChangeHistCtrl);

}());