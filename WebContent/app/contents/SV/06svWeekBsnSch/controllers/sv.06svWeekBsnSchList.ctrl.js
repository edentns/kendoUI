(function () {
	"use strict";

	/**
	 * @name SV.business.controller : SV.svServRecListCtrl
	 * 사업관리 - 리스트
	 */
	angular.module("SV.06svWeekBsnSch.controller")
		.controller("SV.06svWeekBsnSchListCtrl", ['$scope', '$state', '$timeout', 'SvListPageVO', 'SV.06svWeekBsnSchListBiz', 'resData', 'UtilSvc', '$window', 'CreatorVO', 'Page',
            function ($scope, $state, $timeout, SvListPageVO, SvWeekBsnSchListBiz, resData, UtilSvc, $window, CreatorVO, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access });
				
				var page_title = "주간업무일정";
				var objBiz = SvWeekBsnSchListBiz;
				var strGridProcedureParam = "USP_SV_WEEKBSN_LIST_GET&" +
											"KIND@i|DEPART@l|TP_EMP@s|NO_RECR@l|NO_SERV_REC@s|NO_SERV_PLN@s|" +
							                "NO_SERV_PFM@s|NO_MNG_CUST@i|NO_SERV_CUST@i|NM_REQR@s|CD_REC_WAY@l|" +
							                "CD_SERV_TP@l|CD_STAT_PROC@l|CD_OBS_SRON@l|CD_OBS_SEP@l|CD_EQM_ITD_FRM@l|" +
							                "NM_EQM@s|NM_PJT@s|TP_PER@s|STRT_PER@s|END_PER@s";
				var searchObj_perTpCdList = [
												{ CD: '1', NAME: '주간보고일자' }
											];
				var gridObj_BoxTitle = "주간업무일정";
				var gridObj_rowTemplate = "<div ng-dblclick=\"grid.appScope.vm.gridObj.moveDetailPage(row.entity)\" " +
								               "ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" " +
								               "class=\"ui-grid-cell\" ui-grid-cell>" +
								          "</div>";
				var gridObj_InsertPage = "/06svWeekBsnSch/insert";
				var gridObj_DetailPage = "/06svWeekBsnSch/detail?";
				var arrGridField = [
				                 {visible: true, field:'ST_DT_CAL'    , cellClass:'ta-c', displayName:'시작날짜'},
				                 {visible: true, field:'ED_DT_CAL'    , cellClass:'ta-c', displayName:'종료날짜'},
				                 {visible: true, field:'REC_CNT'      , cellClass:'ta-c', displayName:'금주 접수 건수'},
				                 {visible: true, field:'PLN_CNT'      , cellClass:'ta-c', displayName:'금주 계획 건수'},
				                 {visible: true, field:'PFM_CNT'      , cellClass:'ta-c', displayName:'금주 수행 건수'},
				                 {visible: true, field:'NEXT_PLN_CNT' , cellClass:'ta-c', displayName:'차주 계획 건수'},
				                 {visible: true, field:'NOT_PROC'     , cellClass:'ta-c', displayName:'미 처리 접수 건수'}
				                ];
				
				var vm = {
					title : page_title,
					
					/**
					 * 검색
					 * @type {SvListPageVO|*}
					 */
					searchObj : new SvListPageVO({
						code: {
							perTpCdList: searchObj_perTpCdList
						}
					}),
						
					/**
					 * 주간업무일정 그리드
					 * @type {{}}
					 */
					gridObj : {
						boxTitle : gridObj_BoxTitle,
						column : {
							columnDefs : arrGridField,
							showColumns : [],
							hideColumns : []
						},
						grid : {
							rowTemplate	: gridObj_rowTemplate,
							data: [],
							columnDefs: [],
							procedureParam: strGridProcedureParam			
						},
						/**
						 * 등록페이지로 이동한다.
						 */
						moveInsPage : function () {
							$state.go('app.svWeekBsnSch', { kind: 'insert', menu: null, ids: null });
						},
						/**
						 * 상세페이지로 이동한다
						 * @param {object} row
						 */
						moveDetailPage : function (row) {
							$window.sessionStorage.setItem('svWeekBsnRow_rtnParam', JSON.stringify(vm.searchObj.entity));
							$window.sessionStorage.setItem('svWeekBsnRow_rowInfo', JSON.stringify(row));
							
							$state.go('app.svWeekBsnSch', { kind: 'detail', menu: null, ids: null });
						},
						/**
						 * 엑셀파일을 다운로드한다.
						 */
						downloadExcel : function () {
							objBiz.downloadExcel(this);
						},
						/**
						 * 그리드 컬럼을 설정한다.
						 */
						setColumn : function () {
							objBiz.modalSetColumn(this);
						}
					}
				};
				
				vm.searchObj.entity.CD_SEARCHR = new CreatorVO({
					type: 'string',
					value: '1'
				});

				/**
				 * 서비스접수 정보 조회
				 */
				vm.searchObj.inquiry = function () {
					objBiz.inquiry(vm.searchObj, vm.gridObj);
				};
				
				/**
				 * 주간업무일정 검색 조건 초기화 후  조회
				 */
				vm.searchObj.initParam = function () {
					var self = this;
					
					self.init();
					$timeout(function () { self.inquiry(); });
				};
				
				$scope.vm = vm;
	
				objBiz.initLoad(vm.searchObj, vm.gridObj).then(function () {
					$scope.$emit("event:autoLoader", true);
				});
			}
		]);
}());