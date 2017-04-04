(function () {
	'use strict';

	angular
		.module("SV.05svEmgObsProc.service")
		/**
		 * 서비스 분석 주간업무일정 리스트 Biz
		 */
		.service('SV.05svEmgObsProcListBiz', ['UtilSvc', 'SvCommonSvc', 'SvListPageVO', 'SY.codeSvc', 'ModalSvc', 'APP_CODE', '$q', '$timeout',
			function (UtilSvc, SvCommonSvc, SvListPageVO, SyCodeSvc, ModalSvc, APP_CODE, $q, $timeout) {

				var self = this;

				self.cache = {
					param: null
				};
				
				/**
				 * 페이지 초기 로드시 실행한다.
				 * @param searchObj
				 * @param servRec
				 * @returns {*}
				 */
				self.initLoad = function (searchObj, gridObj) {
					var self = this,
						defer = $q.defer();
					
					$timeout(function () {
						var param = self.cache.param = UtilSvc.grid.getInquiryParam(),
							compositeParam = UtilSvc.isValid(param) ? self.getParam(param) : self.getParam(searchObj.entity);

						compositeParam.procedureParam = gridObj.grid.procedureParam;
						
						self.getCodeAndData(compositeParam).then(function (res) {
							res[0].data.unshift({ CD: 1, NAME: '전사' });

							searchObj.code.seniorDeptCdList = res[0].data;
							searchObj.code.subDeptCdList    = res[1].data;
							searchObj.code.recrCdList       = res[2].data;
							searchObj.code.recWayCdList     = res[3].data;
							searchObj.code.servTpCdList     = res[4].data.results[0];
							searchObj.code.procStatCdList   = res[5].data;
							searchObj.code.obsSronCdList    = res[6].data;
							searchObj.code.obsSepCdList     = res[7].data;
							searchObj.code.eqmItdFrmCdList  = res[8].data;
							UtilSvc.grid.setInquiryParam(searchObj.entity);
							gridObj.grid.data = res[9].data.results[0];

							self.setDataAndParam(searchObj, gridObj);

							defer.resolve();
						});
					});

					return defer.promise;
				};
				
				/**
				 * 검색조건을 생성한다.
				 * @param {object} entity 검색조건
				 * @returns {object}
				 */
				self.getParam = function (entity) {
					var period  = entity.DATE.period,
						start = [period.start.y, period.start.m, period.start.d],
						end   = [period.end.y, period.end.m, period.end.d],
						rtnParam = {
							KIND: entity.KIND.value,
							TP_PER: entity.TP_PER.value,
							STRT_PER: start.join('-'),
							END_PER : end.join('-')
						};

					if (entity.DEPART.value.length>0 ) { rtnParam.DEPART = entity.DEPART.value; }
					if (entity.NO_USER.value.length>0) {
						rtnParam.TP_EMP  = entity.CD_USER_TP.value;
						rtnParam.NO_RECR = entity.NO_USER.value;
					}

					if (entity.NM_EQM.value) { rtnParam.NM_EQM = entity.NM_EQM.value; }
					if (entity.DC_SRN.value) { rtnParam.DC_SRN = entity.DC_SRN.value; }
					if (entity.NM_MODEL.value) { rtnParam.NM_MODEL = entity.NM_MODEL.value; }

					if (entity.type.code === 'DS') {
						if (entity.NO_SERV_REC.value            ) { rtnParam.NO_SERV_REC = entity.NO_SERV_REC.value; }
						if (entity.NO_SERV_PLN.value           ) { rtnParam.NO_SERV_PLN = entity.NO_SERV_PLN.value; }
						if (entity.NO_SERV_PFM.value           ) { rtnParam.NO_SERV_PFM = entity.NO_SERV_PFM.value; }
						if (entity.NO_MNG_CUST.value            ) { rtnParam.NO_MNG_CUST = entity.NO_MNG_CUST.value; }
						if (entity.NO_SERV_CUST.value           ) { rtnParam.NO_SERV_CUST = entity.NO_SERV_CUST.value; }
						if (entity.NM_REQR.value                ) { rtnParam.NM_REQR = entity.NM_REQR.value; }
						if (entity.CD_REC_WAY.value.length>0    ) { rtnParam.CD_REC_WAY = entity.CD_REC_WAY.value; }
						if (entity.CD_SERV_TP.value.length>0    ) { rtnParam.CD_SERV_TP = entity.CD_SERV_TP.value; }
						if (entity.CD_STAT_PROC.value.length>0  ) { rtnParam.CD_STAT_PROC = entity.CD_STAT_PROC.value; }
						if (entity.CD_OBS_SRON.value.length>0   ) { rtnParam.CD_OBS_SRON = entity.CD_OBS_SRON.value; }
						if (entity.CD_OBS_SEP.value.length>0    ) { rtnParam.CD_OBS_SEP = entity.CD_OBS_SEP.value; }
						if (entity.CD_EQM_ITD_FRM.value.length>0) { rtnParam.CD_EQM_ITD_FRM = entity.CD_EQM_ITD_FRM.value; }
						if (entity.NM_PJT.value                 ) { rtnParam.NM_PJT = entity.NM_PJT.value; }
						if (entity.DC_HPRC_CASE.value           ) { rtnParam.DC_HPRC_CASE = entity.DC_HPRC_CASE.value; }
					}

					return rtnParam;
				};

				self.inquiry = function (searchObj, gridObj) {
					var self = this,
						param = self.getParam(searchObj.entity);
					
					param.procedureParam = gridObj.grid.procedureParam;
					
					UtilSvc.getList(param).then(function (res) {
						UtilSvc.grid.setInquiryParam(searchObj.entity);
						gridObj.grid.data = res.data.results[0];
					});
				};

				/**
				 * 코드와 데이터를 조회한다.
				 * @param {object} param 가공된 검색조건
				 * @returns {promise}
				 */
				self.getCodeAndData = function (param) {
					var kind = param.KIND,
						depart = param.DEPART || [kind];

					var code_param = {
						procedureParam : "USP_SY_CODE_D_GET&cd_cls@s|dc_rmk1@s|dc_rmk2@s|dc_rmk3@s|dc_rmk4@s|dc_rmk5@s",
						cd_cls : APP_CODE.servTp.cd,
						dc_rmk2 : 'EMG'
					};
					
					return $q.all([
						SvCommonSvc.getSeniorDept(),
						SvCommonSvc.getSubDept(kind),
						SvCommonSvc.getUser(depart),
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.recWay.cd }),    // 접수방법
						UtilSvc.getList(code_param),                             // 서비스유형
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.procStat.cd }),  // 처리상태
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSron.cd }),   // 장애심각도
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSep.cd }),    // 장애구분
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmItdFrm.cd }), // 장비도입형태
						UtilSvc.getList(param)
					]);
				};

				self.setDataAndParam = function (searchObj, gridObj) {
					self._setParam(searchObj);
					self._setGridColumn(gridObj);
				};

				/**
				 * 세션에 검색조건이 있을경우 Model에 할당한다.
				 * @param searchObj
				 * @private
				 */
				self._setParam = function (searchObj) {
					var self = this;
					if (self.cache.param) {
						angular.copy(self.cache.param, searchObj.entity);
					}
					searchObj.getEqualTab(searchObj.entity.type.code).active = true;
				};

				/**
				 * grid column을 설정한다.
				 * @param {object} servRec 서비스접수 Model
				 * @private
				 */
				self._setGridColumn = function (gridObj) {
					UtilSvc.grid.initColumnSetting(gridObj);
				};

				/**
				 * 엑셀을 다운로드한다.
				 */
				self.downloadExcel = function (gridObj) {
					var self = this,
						param = self.getParam(UtilSvc.grid.getInquiryParam());
					param.procedureParam = gridObj.grid.procedureParam;

					param.gridTitle = [gridObj.boxTitle];
					param.gridInfo = [gridObj.column.columnDefs];
					
					UtilSvc.getExcelDownload(param).then(function (res) {
					});
				};

				/**
				 * Grid Column을 설정한다.
				 * @param {object} servRec 서비스접수
				 */
				self.modalSetColumn = function (gridObj) {
					var column = gridObj.column,
						grid   = gridObj.grid,

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
				};
			}
		]);
}());