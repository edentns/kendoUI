(function () {
	"use strict";

	/**
	 * @name SV.business.controller : SV.svServRecListCtrl
	 * 사업관리 - 리스트
	 */
	angular.module("SV.06svWeekBsnSch.controller")
		.controller("SV.06svWeekBsnSchInfoCtrl", ["$state", "$rootScope", "$scope", "uiGridConstants", "$http", "$q", "APP_CODE", "APP_CONFIG", "$window", "$timeout", "$modal", "resData", 'UtilSvc', 'ModalSvc', 'Page',
			function ($state, $rootScope, $scope, uiGridConstants, $http, $q, APP_CODE, APP_CONFIG, $window, $timeout, $modal, resData, UtilSvc, ModalSvc, Page) {

				var page  = $scope.page = new Page({ auth: resData.access });

				var view, 
				    SRListVO,
				    svMainWeekBsnVO,
				    svPrpSchBsnVO,
				    svNotProcBsnVO,
				    svWeekBsnVO   = new Array(7),
				    view_title    = "주간업무일정",
				    arrMainGridField = [
						                 {visible: true, field:'ST_DT_CAL'    , cellClass:'ta-c', displayName:'시작날짜'},
						                 {visible: true, field:'ED_DT_CAL'    , cellClass:'ta-c', displayName:'종료날짜'},
						                 {visible: true, field:'REC_CNT'      , cellClass:'ta-c', displayName:'금주 접수 건수'},
						                 {visible: true, field:'PLN_CNT'      , cellClass:'ta-c', displayName:'금주 계획 건수'},
						                 {visible: true, field:'PFM_CNT'      , cellClass:'ta-c', displayName:'금주 수행 건수'},
						                 {visible: true, field:'NEXT_PLN_CNT' , cellClass:'ta-c', displayName:'차주 계획 건수'},
						                 {visible: true, field:'NOT_PROC'     , cellClass:'ta-c', displayName:'미 처리 접수 건수'}
						                ],
					arrGridField  = [
					                 {visible: false, field:'NO_SERV_REC'  , width:130 , cellClass:'ta-c', displayName:'접수번호'},
					                 {visible: false, field:'NO_SERV_PLN'  , width:130 , cellClass:'ta-c', displayName:'계획번호'},
					                 {visible: false, field:'NO_SERV_PFM'  , width:130 , cellClass:'ta-c', displayName:'수행번호'},
					                 {visible: true , field:'NO_MNG_CUST'  , width:100 , cellClass:'ta-c', displayName:'관리고객사'},
					                 {visible: true , field:'NO_SERV_CUST' , width:100 , cellClass:'ta-c', displayName:'서비스고객사'},
					                 {visible: true , field:'DC_REC'       ,             cellClass:'ta-l', displayName:'업무'},
					                 {visible: true , field:'NM_SERV_TP'   , width:100 , cellClass:'ta-l', displayName:'서비스유형'},
					                 {visible: true , field:'DTS_SERV'     , width:125 , cellClass:'ta-c', displayName:'접수일시'},
					                 {visible: true , field:'DTS_PLN'      , width:125 , cellClass:'ta-c', displayName:'계획일시'},
					                 {visible: true , field:'DTS_PFM'      , width:125 , cellClass:'ta-c', displayName:'수행일시'},
					                 {visible: true , field:'DTS_FNT_PROC' , width:125 , cellClass:'ta-c', displayName:'최종완료일시'},
					                 {visible: true , field:'CD_REC'       , width:125 , cellClass:'ta-l', displayName:'상태'},
					                 {visible: true , field:'NM_PFMR'      , width:125 , cellClass:'ta-l', displayName:'지원자'},
					                 {visible: true , field:'NM_SALE'      , width:80  , cellClass:'ta-c', displayName:'영업대표'},
					                 {visible: true , field:'DC_RESULT'    ,             cellClass:'ta-l', displayName:'비고(결과/요청자 등)'}
					                ],
					arrPrpSchBsnGridField  = [
					                 {visible: false, field:'NO_SERV_REC'  , width:130 , cellClass:'ta-c', displayName:'접수번호'},
					                 {visible: false, field:'NO_SERV_PLN'  , width:130 , cellClass:'ta-c', displayName:'계획번호'},
					                 {visible: false, field:'NO_SERV_PFM'  , width:130 , cellClass:'ta-c', displayName:'수행번호'},
					                 {visible: true , field:'NO_MNG_CUST'  , width:100 , cellClass:'ta-c', displayName:'관리고객사명'},
					                 {visible: true , field:'NO_SERV_CUST' , width:100 , cellClass:'ta-c', displayName:'서비스고객사명'},
					                 {visible: true , field:'DC_REC'       ,             cellClass:'ta-l', displayName:'업무'},
					                 {visible: true , field:'NM_SERV_TP'   , width:100 , cellClass:'ta-l', displayName:'서비스유형'},
					                 {visible: true , field:'DTS_SERV'     , width:125 , cellClass:'ta-c', displayName:'접수일시'},
					                 {visible: true , field:'DTS_PLN'      , width:125 , cellClass:'ta-c', displayName:'계획일시'},
					                 {visible: true , field:'DTS_PFM'      , width:125 , cellClass:'ta-c', displayName:'수행일시'},
					                 {visible: true , field:'DTS_FNT_PROC' , width:125 , cellClass:'ta-c', displayName:'최종완료일시'},
					                 {visible: true , field:'CD_REC'       , width:125 , cellClass:'ta-c', displayName:'상태'},
					                 {visible: true , field:'NM_PFMR'      , width:125 , cellClass:'ta-l', displayName:'지원자'},
					                 {visible: true , field:'NM_SALE'      , width:80  , cellClass:'ta-c', displayName:'영업대표'},
					                 {visible: true , field:'DC_RESULT'    ,             cellClass:'ta-l', displayName:'비고(결과/요청자 등)'}
					                ],
					arrNotProcBsnGridField  = [
					                 {visible: true , field:'NO_SERV_REC'       , width:130 , cellClass:'ta-c', displayName:'접수번호'},
					                 {visible: true , field:'DTS_SERV'          , width:125 , cellClass:'ta-c', displayName:'접수일시'},
					                 {visible: true , field:'DTS_PROC_CPLT_REQ' , width:125 , cellClass:'ta-c', displayName:'완료요청일시'},
					                 {visible: true , field:'NM_STAT_PROC'      , width:80  , cellClass:'ta-c', displayName:'처리상태'},
					                 {visible: false, field:'CD_STAT_PROC'      ,             cellClass:'ta-c', displayName:'접수처리상태코드'},
					                 {visible: true , field:'NM_SERV_TP'        , width:100 , cellClass:'ta-l', displayName:'서비스 유형'},
					                 {visible: false, field:'CD_SERV_TP'        ,             cellClass:'ta-c', displayName:'서비스 유형코드'},
					                 {visible: true , field:'YN_EMG'            , width:80  , cellClass:'ta-c', displayName:'긴급여부'},
					                 {visible: true , field:'NM_EMP'            , width:80  , cellClass:'ta-c', displayName:'접수자'},
					                 {visible: false, field:'NO_EMP'            ,             cellClass:'ta-c', displayName:'접수자ID'},
					                 {visible: true , field:'NM_DEPT'           , width:80  , cellClass:'ta-c', displayName:'접수자부서'},
					                 {visible: false, field:'CD_DEPT'           ,             cellClass:'ta-c', displayName:'접수자부서코드'},
					                 {visible: true , field:'DC_REC_TAG_DEL'    ,             cellClass:'ta-l', displayName:'접수내용'}
					               ];
				/**
				 * ------------------------------------------------------------------------------------------------------------------------------------------
				 * [ view ]
				 * @type {String} message 검색결과 메세지
				 * @type {Object} code 공통으로 사용되는 코드
				 * @type {Function} initLoad 사업리스트 초기로드시 실행한다.
				 * -----------------------------------------------------------------------------------------------------------------------------------------*/				
				view = $scope.view = {
					title       : view_title,
					message		: "",
				};

				/**
				 * @description 사업리스트화면 초기로드시 실행된다.
				 */
				view.initLoad = function () {
					console.log("sv.06svWeekBsnSchInfo.ctrl.js view.initLoad !!!!!!!!!!!");
					var self = this;
					
					for(var iIndex = 0; iIndex < svWeekBsnVO.length; iIndex++) {
						if(iIndex === (svWeekBsnVO.lenght-1)) {
							svWeekBsnVO[iIndex].title = "추진예정업무";
						}
						else {
							svWeekBsnVO[iIndex].title = resData.svWeekBsnSch.data[0][iIndex].DT_CAL;
						}
						svWeekBsnVO[iIndex].grid.data = resData.svWeekBsnSch.data[iIndex+1];
						svWeekBsnVO[iIndex].height = 50+(23*resData.svWeekBsnSch.data[iIndex+1].length);
						
						UtilSvc.grid.initColumnSetting(svWeekBsnVO[iIndex], '_info');
					}
					
					svPrpSchBsnVO.title = "추진예정업무";
					svPrpSchBsnVO.grid.data = resData.svWeekBsnSch.data[svWeekBsnVO.length+1];
					svPrpSchBsnVO.height = 50+(23*resData.svWeekBsnSch.data[svWeekBsnVO.length+1].length);
					UtilSvc.grid.initColumnSetting(svPrpSchBsnVO, '_PrpSchBsn');
					
					svNotProcBsnVO.title = "미처리업무";
					svNotProcBsnVO.grid.data = resData.svWeekBsnSch.data[svWeekBsnVO.length+2];
					svNotProcBsnVO.height = 50+(23*resData.svWeekBsnSch.data[svWeekBsnVO.length+2].length);
					UtilSvc.grid.initColumnSetting(svNotProcBsnVO, '_NotProcBsn');
					
					svMainWeekBsnVO.title = "주간 건수계";
					svMainWeekBsnVO.grid.data = resData.svWeekBsnSch.data[svWeekBsnVO.length+3];
					UtilSvc.grid.initColumnSetting(svMainWeekBsnVO, '_MainWeekBsn');
				};

				view.getTableHeight = function (gridNum) {
					return {
				    	height: (gridNum < 7)?(svWeekBsnVO[gridNum].height + "px"):((gridNum === 7)?(svPrpSchBsnVO.height + "px"):(svNotProcBsnVO.height + "px"))
				    };
				};
				
				/**
                 * @description 사업등록 및 수정을 취소하고 리스트화면으로 이동한다.
                 */
                view.doBefore = function () {
                	var svWeekBsnRow_rowInfo = JSON.parse($window.sessionStorage.getItem('svWeekBsnRow_rowInfo'));
                	var searchVO = {
            			boxTitle        : "검색",
    					procedureParam  : "USP_SV_WEEKBSN_INFO_WEEK_GET&strtDays@s|endDays@s|gubun@s",
    					strtDays        : svWeekBsnRow_rowInfo.ST_DT_CAL_SEARCH,
    					endDays         : svWeekBsnRow_rowInfo.ED_DT_CAL_SEARCH,
    					gubun           : "B"
                	};
                	
                	UtilSvc.getList( searchVO ).then(function ( result ) {
                		svWeekBsnRow_rowInfo.ST_DT_CAL_SEARCH = result.data.results[0][0].PERIODSTARTDATE;
                		svWeekBsnRow_rowInfo.ED_DT_CAL_SEARCH = result.data.results[0][0].PERIODENDDATE;
                		$window.sessionStorage.setItem('svWeekBsnRow_rowInfo', JSON.stringify(svWeekBsnRow_rowInfo));
						
                		$window.location.reload();
					});
                };
                
                /**
                 * @description 사업등록 및 수정을 취소하고 리스트화면으로 이동한다.
                 */
                view.doAfter = function () {
                	var svWeekBsnRow_rowInfo = JSON.parse($window.sessionStorage.getItem('svWeekBsnRow_rowInfo'));
                	var searchVO = {
            			boxTitle        : "검색",
    					procedureParam  : "USP_SV_WEEKBSN_INFO_WEEK_GET&strtDays@s|endDays@s|gubun@s",
    					strtDays        : svWeekBsnRow_rowInfo.ST_DT_CAL_SEARCH,
    					endDays         : svWeekBsnRow_rowInfo.ED_DT_CAL_SEARCH,
    					gubun           : "A"
                	};
                	
                	UtilSvc.getList( searchVO ).then(function ( result ) {
                		svWeekBsnRow_rowInfo.ST_DT_CAL_SEARCH = result.data.results[0][0].PERIODSTARTDATE;
                		svWeekBsnRow_rowInfo.ED_DT_CAL_SEARCH = result.data.results[0][0].PERIODENDDATE;
                		$window.sessionStorage.setItem('svWeekBsnRow_rowInfo', JSON.stringify(svWeekBsnRow_rowInfo));
						
                		$window.location.reload();
					});
                };
                
				/**
                 * @description 사업등록 및 수정을 취소하고 리스트화면으로 이동한다.
                 */
                view.doCancel = function () {
					$state.go('app.svWeekBsnSch', { kind: 'list', menu: null, ids: null });
                };

				/**
				 * 접수결과 페이지로 이동한다.
				 * @param row
				 */
				view.moveRecResProcPage = function(row) {
					$state.go("app.svRecResProc", {kind: "detail", menu: null, ids: row.NO_SERV_REC});
				};
				
				/**
				 * -------------------------------------------------------------------------------------------------------------------------
				 * [ SRListVO ]
				 * @description 서비스접수관리 리스트 공통모델
				 * @constructor
				 * ------------------------------------------------------------------------------------------------------------------------*/
				SRListVO = function () {};
				SRListVO.fn = SRListVO.prototype;

				svMainWeekBsnVO = $scope.svMainWeekBsnVO = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrMainGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: []	
					}
				});
				
				/**
				 * -------------------------------------------------------------------------------------------------------------------------
				 * [ svWeekBsnVO[0] ]
				 * @description 접수정보
				 * @constructor
				 * ------------------------------------------------------------------------------------------------------------------------*/
				
				svWeekBsnVO[0] = $scope.svWeekBsnVO_0 = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					},
					/**
					 * 엑셀파일을 다운로드한다.
					 */
					downloadExcel : function () {
						console.log("sv.06svWeekBsnSchInfo.ctrl.js SRListVO.fn.downloadExcel !!!!!!!!!!!");
						
						var firstWeekBsnVOArr = svWeekBsnVO[0].column.showColumns;
						var addWeekBsnVOArr = {visible: true, field:'DT_CAL_VIEW', cellClass:'ta-c', displayName:'날짜'};
						var tempWeekBsnVOArr = [];
						
						tempWeekBsnVOArr.push(addWeekBsnVOArr);
						angular.forEach(firstWeekBsnVOArr, function(value, key){
							tempWeekBsnVOArr.push(value);
						}); 
					
						resData.svWeekBsnSch.searchVO.gridTitle = ["주간일보","추진예정업무","미처리업무"];
						resData.svWeekBsnSch.searchVO.gridInfo = [tempWeekBsnVOArr,svPrpSchBsnVO.column.columnDefs,svNotProcBsnVO.column.columnDefs];
						resData.svWeekBsnSch.searchVO.procedureParam  = "USP_SV_WEEKBSN_EXCEL_INFO_GET&" +
																		"KIND@i|DEPART@l|CD_SEARCHR@s|NO_RECR@l|NO_SERV_REC@s|NO_SERV_PLN@s|" +
														                "NO_SERV_PFM@s|NO_MNG_CUST@i|NO_SERV_CUST@i|NM_REQR@s|CD_REC_WAY@l|" +
														                "CD_SERV_TP@l|CD_STAT_PROC@l|CD_OBS_SRON@l|CD_OBS_SEP@l|CD_EQM_ITD_FRM@l|" +
														                "NM_EQM@s|NM_PJT@s|TP_PER@s|STRT_PER@s|END_PER@s";
						
						UtilSvc.getExcelDownload(resData.svWeekBsnSch.searchVO).then(function(result) {
						});
					},
					/**
					 * 그리드 컬럼을 설정한다.
					 */
					setColumn : function () {
						var column = svWeekBsnVO[0].column,
							grid   = svWeekBsnVO[0].grid,
	
							modalInstance = ModalSvc.openSetColumn({
								resolve		: {
									revColumns : function () {
										return column;
									}
								}
							});
	
						modalInstance.result.then(function (res) {
							for(var iIndex = 0; iIndex < svWeekBsnVO.length; iIndex++) {
								svWeekBsnVO[iIndex].column.showColumns = res.showColumns;
								svWeekBsnVO[iIndex].column.hideColumns = res.hideColumns;
								
								svWeekBsnVO[iIndex].grid.columnDefs = UtilSvc.grid.getColumnDefs(svWeekBsnVO[iIndex].column);
							}
	
							UtilSvc.grid.setColumns(res, "_info");
						});
					}
				});
				
				svWeekBsnVO[1] = $scope.svWeekBsnVO_1 = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					}
				});
				
				svWeekBsnVO[2] = $scope.svWeekBsnVO_2 = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					}
				});
				
				svWeekBsnVO[3] = $scope.svWeekBsnVO_3 = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					}
				});
				
				svWeekBsnVO[4] = $scope.svWeekBsnVO_4 = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					}
				});
				
				svWeekBsnVO[5] = $scope.svWeekBsnVO_5 = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					}
				});
				
				svWeekBsnVO[6] = $scope.svWeekBsnVO_6 = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					}
				});
				
				svPrpSchBsnVO = $scope.svPrpSchBsnVO = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrPrpSchBsnGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: []	
					}
				});
				
				svNotProcBsnVO = $scope.svNotProcBsnVO = edt.create( SRListVO.prototype, {
					column : {
						columnDefs : arrNotProcBsnGridField,
						showColumns : [],
						hideColumns : []
					},
					grid : {
						data: [],
						columnDefs: [],
						rowTemplate	: "<div ng-dblclick=\"grid.appScope.view.moveRecResProcPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>"
					}
				});
				// Init Load
				view.initLoad();
			}]);
}());