(function () {
	"use strict";

	/**
	 * @name SV.business.controller : SV.svbsnProsListCtrl
	 *  서비스 업무 현황 리스트
	 */
	angular.module("SV.07svBsnPrsc.controller")
		.controller("SV.07svBsnPrscListCtrl", ["$state", "$scope", '$timeout', 'SvListPageVO', 'resData', 'SV.07svBsnPrscListBiz', 'Page',
			function ($state, $scope , $timeout, SvListPageVO, resData, SvBsnPrscListBiz, Page ) {

				var page  = $scope.page = new Page({ auth: resData.access });
			
			var page_title = "업무현황";
			var objBiz = SvBsnPrscListBiz;

			var strGridProcedureParam = "USP_SV_BSNPROCSEARCH_GET&" +
						                "KIND@i|DEPART@l|TP_EMP@s|NO_RECR@l|TP_PER@s|STRT_PER@s|END_PER@s";
			var searchObj_perTpCdList = [
											{ CD: '1', NAME: '접수일자' },
											{ CD: '2', NAME: '완료요청일자' }
										];
			var gridObj_BoxTitle = "업무현황";
			var gridObj_rowTemplate = "";
			var gridObj_InsertPage  = "";
			var gridObj_DetailPage  = "";
			var gridObj_GridField = [
			                         {visible: true, field:'NO_SERV_REC'         , width:130 , cellClass:'ta-c', displayName:'접수번호'},
					                 {visible: true, field:'NM_MNG_CUST'         , width:100 , cellClass:'ta-c', displayName:'관리고객사'},
					                 {visible: true, field:'NM_SERV_CUST'        , width:100 , cellClass:'ta-c', displayName:'서비스고객사'},
					                 {visible: true, field:'NM_RECR'             , width:80  , cellClass:'ta-c', displayName:'접수자'},
					                 {visible: true, field:'NM_DEPT_RECR'        , width:80  , cellClass:'ta-c', displayName:'접수부서'},
					                 {visible: true, field:'NM_REQR'             , width:80  , cellClass:'ta-c', displayName:'요청자'},
					                 {visible: true, field:'PFMR_NM_EMP'         , width:80  , cellClass:'ta-c', displayName:'처리담당자'},
					                 {visible: true, field:'NM_SERV_TP'          , width:80  , cellClass:'ta-l', displayName:'서비스유형'},
					                 {visible: true, field:'NM_STAT_PROC'        , width:80  , cellClass:'ta-c', displayName:'처리상태'},
					                 {visible: true, field:'NM_REC_WAY'          , width:80  , cellClass:'ta-c', displayName:'접수방법'},
					                 {visible: true, field:'DTS_SERV'            , width:125 , cellClass:'ta-c', displayName:'접수일시'},
					                 {visible: true, field:'DTS_PFM_SOL'         , width:125 , cellClass:'ta-c', displayName:'완료일시'},
					                 {visible: false, field:'DTS_LEAD_TIME'      , width:125 , cellClass:'ta-c', displayName:'소요시간'},
					                 {visible: true, field:'NM_PROC_AFT_RPT_WAY' , width:100 , cellClass:'ta-c', displayName:'처리보고방식'},
					                 {visible: true, field:'DC_PROC_TAG_DEL'     ,             cellClass:'ta-l', displayName:'조치사항'},
					                 {visible: true, field:'detail'              , width:80  , cellClass:'ta-c', displayName:'상세',
					                	 cellTemplate: '<div class="ui-grid-cell-contents ta-c" title="TOOLTIP"><button type="button" class="btn btn-default" title="상세" ng-click="grid.appScope.vm.gridObj.detailBsnPrsc(row)">상세</button></div>'
					                 }
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
				 * 그리드 정보
				 * @type {{}}
				 */
				gridObj : {
					boxTitle : gridObj_BoxTitle,
					column : {
						columnDefs : gridObj_GridField,
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
						$state.go('app.svBsnPrsc', { kind: 'insert', menu: null, ids: null });
					},
					/**
					 * 상세페이지로 이동한다
					 * @param {object} row
					 */
					moveDetailPage : function (row) {
						$state.go('app.svBsnPrsc', { kind: 'detail', menu: null, ids: row.NO_SERV_REC });
					},
					/**
					 * 선택된 접수의 상세정보를 보여준다.
					 * @param {object} row
					 */
					detailBsnPrsc: function (row) {
						objBiz.modalDetailBsnPrsc(row.entity);
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
			
			/**
			 * 정보 조회
			 */
			vm.searchObj.inquiry = function () {
				objBiz.inquiry(vm.searchObj, vm.gridObj);
			};
			
			/**
			 * 검색 조건 초기화 후  조회
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