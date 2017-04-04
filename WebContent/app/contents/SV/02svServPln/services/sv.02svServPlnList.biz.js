(function () {
	'use strict';

	angular
		.module('SV.02svServPln.service')
	/**
	 * 서비스 접수 리스트 Biz
	 */
		.service('SV.02svServPlnListBiz', ['UtilSvc', 'SvCommonSvc', 'SvListPageVO', 'SV.02svServPlnSvc', 'SY.codeSvc', 'ModalSvc', 'APP_CODE', '$q', '$timeout',
			function (UtilSvc, SvCommonSvc, SvListPageVO, SvServPlnSvc, SyCodeSvc, ModalSvc, APP_CODE, $q, $timeout) {

				var self = this;

				self.cache = {
					param: null
				};
				/**
				 * 페이지 초기 로드시 실행한다.
				 * @param search
				 * @param servPln
				 * @returns {*}
				 */
				self.initLoad = function (search, servPln) {
					var self = this,
						defer = $q.defer();

					$timeout(function () {
						var param = self.cache.param = UtilSvc.grid.getInquiryParam(),
							compositeParam = UtilSvc.isValid(param) ? self.getParam(param) : self.getParam(search.entity);

							compositeParam.procedureParam = servPln.grid.procedureParam;
							
						self.getCodeAndData(compositeParam).then(function (res) {
							res[0].data.unshift({ CD: 1, NAME: '전사' });

							search.code.seniorDeptCdList = res[0].data;
							search.code.subDeptCdList    = res[1].data;
							search.code.recrCdList       = res[2].data;
							search.code.recWayCdList     = res[3].data;
							search.code.servTpCdList     = res[4].data;
							search.code.procStatCdList   = res[5].data;
							search.code.obsSronCdList    = res[6].data;
							search.code.obsSepCdList     = res[7].data;
							search.code.eqmItdFrmCdList  = res[8].data;
							servPln.grid.data = res[9].data.results[0];

							self.setDataAndParam(search, servPln);
							UtilSvc.grid.setInquiryParam(search.entity);

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

					if (entity.DEPART.value.length>0    ) { rtnParam.DEPART = entity.DEPART.value; }
					if (entity.NO_USER.value.length>0) {
						rtnParam.TP_EMP  = entity.CD_USER_TP.value;
						rtnParam.NO_RECR = entity.NO_USER.value;
					}
					if (entity.NM_EQM.value) { rtnParam.NM_EQM = entity.NM_EQM.value; }
					if (entity.DC_SRN.value) { rtnParam.DC_SRN = entity.DC_SRN.value; }
					if (entity.NM_MODEL.value) { rtnParam.NM_MODEL = entity.NM_MODEL.value; }

					if (entity.type.code === 'DS') {
						if (entity.NO_MNG_CUST.value            ) { rtnParam.NO_MNG_CUST = entity.NO_MNG_CUST.value; }
						if (entity.NO_SERV_CUST.value           ) { rtnParam.NO_SERV_CUST = entity.NO_SERV_CUST.value; }
						if (entity.NM_REQR.value                ) { rtnParam.NM_REQR = entity.NM_REQR.value; }
						if (entity.CD_REC_WAY.value.length>0    ) { rtnParam.CD_REC_WAY = entity.CD_REC_WAY.value; }
						if (entity.CD_SERV_TP.value.length>0    ) { rtnParam.CD_SERV_TP = entity.CD_SERV_TP.value; }
						if (entity.CD_OBS_SRON.value.length>0   ) { rtnParam.CD_OBS_SRON = entity.CD_OBS_SRON.value; }
						if (entity.CD_OBS_SEP.value.length>0    ) { rtnParam.CD_OBS_SEP = entity.CD_OBS_SEP.value; }
						if (entity.CD_EQM_ITD_FRM.value.length>0) { rtnParam.CD_EQM_ITD_FRM = entity.CD_EQM_ITD_FRM.value; }
						if (entity.NM_PJT.value                 ) { rtnParam.NM_PJT = entity.NM_PJT.value; }
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

					return $q.all([
						SvCommonSvc.getSeniorDept(),
						SvCommonSvc.getSubDept(kind),
						SvCommonSvc.getUser(depart),
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.recWay.cd }),    // 접수방법
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.servTp.cd }),    // 서비스유형
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.procStat.cd }),  // 처리상태
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSron.cd }),   // 장애심각도
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSep.cd }),    // 장애구분
						SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmItdFrm.cd }), // 장비도입형태
						UtilSvc.getList(param)
					]);
				};

				self.setDataAndParam = function (search, servPln) {
					self._setParam(search);
					self._setGridColumn(servPln);
				};

				/**
				 * 세션에 검색조건이 있을경우 Model에 할당한다.
				 * @param search
				 * @private
				 */
				self._setParam = function (search) {
					var self = this;
					if (self.cache.param) {
						angular.copy(self.cache.param, search.entity);
					}
					search.getEqualTab(search.entity.type.code).active = true;
				};

				/**
				 * grid column을 설정한다.
				 * @param {object} servPln 서비스접수 Model
				 * @private
				 */
				self._setGridColumn = function (servPln) {
					UtilSvc.grid.initColumnSetting(servPln);
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
				 * @param {object} servPln 서비스접수
				 */
				self.modalSetColumn = function (servPln) {
					var column = servPln.column,
						grid   = servPln.grid,

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