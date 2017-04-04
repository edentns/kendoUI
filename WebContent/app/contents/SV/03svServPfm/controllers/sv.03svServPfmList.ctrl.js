(function () {
	'use strict';

	angular
		.module('SV.03svServPfm.controller')
		.controller('SV.03svServPfmListCtrl', ['$scope', '$state', '$timeout', 'SvListPageVO', 'SV.03svServPfmListBiz', 'resData', 'Page',
			function ($scope, $state, $timeout, SvListPageVO, SvServPfmListBiz, resData, Page) {
				var page  = $scope.page = new Page({ auth: resData.access });

				var page_title = "서비스 수행 결과 정보";
				var objBiz = SvServPfmListBiz;
				var strGridProcedureParam = "USP_SV_PFMSEARCH_GET&" +
											"KIND@i|DEPART@l|TP_EMP@s|NO_RECR@l|NO_SERV_REC@s|NO_SERV_PLN@s|" +
							                "NO_SERV_PFM@s|NO_MNG_CUST@i|NO_SERV_CUST@i|NM_REQR@s|CD_REC_WAY@l|" +
							                "CD_SERV_TP@l|CD_STAT_PROC@l|CD_OBS_SRON@l|CD_OBS_SEP@l|CD_EQM_ITD_FRM@l|" +
											"NM_EQM@s|DC_SRN@s|NM_MODEL@s|DC_HPRC_CASE@s|NM_PJT@s|TP_PER@s|STRT_PER@s|END_PER@s";
				var searchObj_perTpCdList = [
												{CD: '1', NAME: '계획시작일자'},
												{CD: '2', NAME: '계획종료일자'}
											];
				var gridObj_BoxTitle = "서비스 수행 결과 정보";
				var gridObj_rowTemplate = "<div ng-dblclick=\"grid.appScope.vm.gridObj.moveDetailPage(row.entity)\" " +
						                       "ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" " +
						                       "class=\"ui-grid-cell\" ui-grid-cell>" +
						                  "</div>";
				var gridObj_InsertPage = "";
				var gridObj_DetailPage = "/03svServPfm/";
				
				var gridObj_GridField = [
					{ visible: true, field: 'NO_SERV_REC',  width: 130, cellClass: 'ta-c', displayName: '접수번호' },
					{ visible: true, field: 'NO_SERV_PLN',  width: 130, cellClass: 'ta-c', displayName: '계획번호' },
					{ visible: true, field: 'NO_SERV_PFM',  width: 130, cellClass: 'ta-c', displayName: '수행번호' },
					{ visible: true, field: 'NM_SERV_CUST', width: 130, cellClass: 'ta-c', displayName: '서비스고객사' },
					{ visible: true, field: 'NM_MNG_CUST',  width: 130, cellClass: 'ta-c', displayName: '관리고객사' },
					{ visible: true, field: 'NM_SERV_TP',  	width: 130, cellClass: 'ta-c', displayName: '서비스유형' },
					{ visible: true, field: 'NM_REC_WAY',  	width: 130, cellClass: 'ta-c', displayName: '접수방법' },
					{ visible: true, field: 'NM_RECR',  	width: 130, cellClass: 'ta-c', displayName: '접수자' },
					{ visible: true, field: 'DTS_SERV',  	width: 130, cellClass: 'ta-c', displayName: '접수일시' },
					{ visible: true, field: 'DTS_PROC_CPLT_REQ',  width: 130, cellClass: 'ta-c', displayName: '처리완료요청일시' },
					{ visible: true, field: 'DTS_PLN_STRT', width: 120, cellClass: 'ta-c', displayName: '계획시작일시' },
					{ visible: true, field: 'DTS_PLN_END',  width: 120, cellClass: 'ta-c', displayName: '계획종료일시' },
					{ visible: true, field: 'NM_PLN'     ,  width:  90, cellClass: 'ta-c', displayName: '계획상태' },
					{ visible: true, field: 'NM_PFM'     ,  width:  90, cellClass: 'ta-c', displayName: '수행상태' },
					{ visible: true, field: 'NM_MODEL'	 ,  width: 125, cellClass: 'ta-c', displayName: '장비모델' },
					{ visible: true, field: 'DC_SRN'	 ,  width: 125, cellClass: 'ta-c', displayName: 'S/N' },
					{ visible: true, field: 'DC_PLN'     ,  width: 100, cellClass: 'ta-l', displayName: '비고' }
				];

				var vm = {
					title : page_title,

					searchObj : new SvListPageVO({
						code: {
							perTpCdList: searchObj_perTpCdList
						},
						CD_USER_TP : '2',
						NO_USER: [$scope.webApp.user.CD]
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
							$state.go('app.svServPfm', { kind: 'insert', menu: null, ids: row.NO_SERV_REC });
						},
						/**
						 * 상세페이지로 이동한다
						 * @param {object} row
						 */
						moveDetailPage : function (row) {
							var checkKind ;
							if(row.NM_PFM ==="미수행"){
								checkKind = 'insert';
							}else{
								checkKind = 'detail';
							}

							/*else if(row.NM_PFM ==="결과처리보고"){
								checkKind = 'detail';
							}else if(row.NM_PFM ==="수행중"){
								checkKind = 'update';
							}*/
							$state.go('app.svServPfm', { kind: checkKind, menu: null, ids: row.NO_SERV_REC, pln: row.NO_SERV_PLN, pfm: row.NO_SERV_PFM});
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