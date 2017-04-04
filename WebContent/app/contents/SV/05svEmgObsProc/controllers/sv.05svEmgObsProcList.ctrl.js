(function () {
	'use strict';

	angular
		.module('SV.05svEmgObsProc.controller')
		.controller('SV.05svEmgObsProcListCtrl', ['$scope', '$state', '$timeout', 'SvListPageVO', 'SV.05svEmgObsProcListBiz', 'resData', 'UtilSvc', 'Page',
			function ($scope, $state, $timeout, SvListPageVO, SvEmgObsProcListBiz, resData, UtilSvc, Page) {
				var page  = $scope.page = new Page({ auth: resData.access });

				var page_title = "긴급장애처리";
				var strGridProcedureParam = "USP_SV_EMGOBSPROCLIST_GET&" +
											"KIND@i|DEPART@l|TP_EMP@s|NO_RECR@l|NO_SERV_REC@s|NO_SERV_PLN@s|" +
							                "NO_SERV_PFM@s|NO_MNG_CUST@i|NO_SERV_CUST@i|NM_REQR@s|CD_REC_WAY@l|" +
							                "CD_SERV_TP@l|CD_STAT_PROC@l|CD_OBS_SRON@l|CD_OBS_SEP@l|CD_EQM_ITD_FRM@l|" +
							                "NM_EQM@s|DC_SRN@s|NM_MODEL@s|DC_HPRC_CASE@s|NM_PJT@s|TP_PER@s|STRT_PER@s|END_PER@s";
				var searchObj_perTpCdList = [
												{ CD: '1', NAME: '접수일자' },
												{ CD: '2', NAME: '완료요청일자' },
												{ CD: '3', NAME: '프로젝트수행기간' }
											];
				var gridObj_BoxTitle = "긴급장애처리";
				var gridObj_rowTemplate = "<div ng-dblclick=\"grid.appScope.vm.gridObj.moveDetailPage(row.entity)\" " +
						                       "ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" " +
						                       "class=\"ui-grid-cell\" ui-grid-cell>" +
						                  "</div>";
				var gridObj_InsertPage = "/05svEmgObsProc/insert";
				var gridObj_DetailPage = "/05svEmgObsProc/detail?ids=";
				var gridObj_GridField = [
					                 {visible: true, field:'NO_SERV_REC'      , width:130 , cellClass:'ta-c', displayName:'접수번호'},
					                 {visible: true, field:'NM_RECR_DEPT'     , width:80  , cellClass:'ta-c', displayName:'접수부서'},
					                 {visible: true, field:'NM_MNG_CUST'      , width:100 , cellClass:'ta-c', displayName:'관리고객사'},
					                 {visible: true, field:'NM_SERV_CUST'     , width:100 , cellClass:'ta-c', displayName:'서비스고객사'},
					                 {visible: true, field:'NM_GEN_EMP'       , width:100 , cellClass:'ta-c', displayName:'영업대표'},
					                 {visible: true, field:'NM_GEN_DEPT'      , width:100 , cellClass:'ta-c', displayName:'영업부서'},
					                 {visible: true, field:'NM_SERV_TP'       , width:100 , cellClass:'ta-l', displayName:'서비스유형'},
					                 {visible: true, field:'NM_STAT_PROC'     , width:80  , cellClass:'ta-c', displayName:'처리상태'},
					                 {visible: true, field:'YN_EMG'           , width:80  , cellClass:'ta-c', displayName:'긴급여부'},
					                 {visible: true, field:'NM_REC_WAY'       , width:100 , cellClass:'ta-c', displayName:'접수방법'},
					                 {visible: true, field:'DTS_SERV'         , width:125 , cellClass:'ta-c', displayName:'접수일시'},
					                 {visible: true, field:'DTS_PROC_CPLT_REQ', width:125 , cellClass:'ta-c', displayName:'처리완료요청일시'},
									 {visible: true, field:'NM_MODEL'	 	  , width:125 , cellClass:'ta-c', displayName:'장비모델'},
									 {visible: true, field:'DC_SRN'	 	   	  , width:125 , cellClass:'ta-c', displayName:'S/N'},
					                 {visible: true, field:'DC_REC_TAG_DEL'   ,             cellClass:'ta-l', displayName:'접수내용'}
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
							$state.go('app.svEmgObsProc', { kind: 'insert', menu: null, ids: null });
						},
						/**
						 * 상세페이지로 이동한다
						 * @param {object} row
						 */
						moveDetailPage : function (row) {
							$state.go('app.svEmgObsProc', { kind: 'detail', menu: null, ids: row.NO_SERV_REC });
						},
						/**
						 * 엑셀파일을 다운로드한다.
						 */
						downloadExcel : function () {
							SvEmgObsProcListBiz.downloadExcel(this);
						},
						/**
						 * 그리드 컬럼을 설정한다.
						 */
						setColumn : function () {
							SvEmgObsProcListBiz.modalSetColumn(this);
						}
					}
				};
				
				/**
				 * 정보 조회
				 */
				vm.searchObj.inquiry = function () {
					SvEmgObsProcListBiz.inquiry(vm.searchObj, vm.gridObj);
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

				SvEmgObsProcListBiz.initLoad(vm.searchObj, vm.gridObj).then(function () {
					$scope.$emit("event:autoLoader", true);
				});
			}
		]);
}());