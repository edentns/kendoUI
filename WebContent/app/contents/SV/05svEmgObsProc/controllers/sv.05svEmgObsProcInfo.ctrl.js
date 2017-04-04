(function () {
	'use strict';

	angular
		.module('SV.05svEmgObsProc.controller')
		.controller('SV.05svEmgObsProcInfoCtrl', ['SV.05svEmgObsProcInfoBiz', '$scope', '$state', '$stateParams', 'resData', '$timeout', 'SV.05svEmgObsProcInfoSvc', 'UtilSvc', 'SvServRecVO', 'SvServPlnVO', 'SvServPfmVO', 
			function (SvEmgObsProcInfoBiz, $scope, $state, $stateParams, resData, $timeout, SvEmgObsProcInfoSvc, UtilSvc, SvServRecVO, SvServPlnVO, SvServPfmVO) {

				var vm = {
					servRec : { boxTitle: '접수정보', open: true },
					servPfm : { boxTitle: '수행정보', open: true },
					kind: ($stateParams.kind==='insert') ? 'INSERT' : 'UPDATE',
					initLoad: function () {
						var self = this;
						
						if (!resData.svServRec) {
							resData.svServRec = {
								NO_RECR: $scope.webApp.user.CD,
								NM_RECR: $scope.webApp.user.NAME,
								NM_DEPT_RECR: $scope.webApp.user.DEPT_NAME,
								RECR_NO_PHONE_IN: $scope.webApp.user.PHONE_INNER
							};
						}
												
						SvEmgObsProcInfoBiz.initLoad(self.code);
						
						self.servRec.boxTitle = '접수정보';
						self.servPfm.boxTitle = '수행정보';
					},
					isInsPage: function () {
						return this.kind === 'INSERT';
					},
					/**
					 * 긴급장애 저장/수정/최종완료 상태
					 * @returns {*|boolean}
					 */
					getStatPage: function () {
						if (resData.svServRec.CD_STAT_PROC) {
							if(resData.svServRec.CD_STAT_PROC === '4') {
								return 'complate';
							}
							else {
								return 'update';
							}
						}
						else {
							return 'save';
						}
					},
					/**
					 * 접수취소 버튼을 보여줄지 판단한다.
					 * @returns {*|boolean}
					 */
					isServRecCancelBtn: function () {
						return !this.isInsPage() && this.isEnableWrite();
					},

					/**
					 * 수정가능 여부를 판단한다.
					 * @returns {*|boolean}
					 */
					isEnableWrite: function () {
						return !resData.svServRec.CD_STAT_PROC || resData.svServRec.CD_STAT_PROC<=2;
					},

					/**
					 * 서비스 접수 REST를 요청한다.
					 */
					doRest: function (paramMethod) {
						var servRec = $scope.vm.servRec;
						var servPfm = $scope.vm.servPfm;
						var method = (this.kind === "INSERT")?"INSERT":"UPDATE";
						
						var emgObsProc = {
							recParam : [],
							plnParam : [],
							pfmParam : []
						};
						
						vm.getRecRESTParam = function(method) {
							var self = this;
							var param = self.servRec.getRESTParam(method);
							param.YN_EMG = 'Y';       // 긴급 여부 : Y. 긴급
							if(paramMethod === 'COMPLATE') {
								param.CD_STAT_PROC = '4'; // 처리완료
							}
							else {
								param.CD_STAT_PROC = '2'; // 처리중
							}
							return param;
						};

						vm.getPlnRESTParam = function(method, data) {
							var param = {};
							
							if(method === 'UPDATE') {
								param = resData.svServPln;
								param.PLN_LIST[0].DTS_PLN_STRT = data.DTS_PFM_STRT;
								param.PLN_LIST[0].DTS_PLN_END = data.DTS_PFM_SOL;
								param.PLN_LIST[0].flag = 'U';
								param.PLN_LIST[0].PLNR_LIST = data.PFMR_LIST;
							}
							else {
								// 계약데이터 없음
								param.NO_SERV_REC = '';
								param.PLN_LIST = [{
									NO_SERV_REC : '',
									NO_SERV_PLN : '',
									NO_SERV_PFM : '',
									DTS_PLN_STRT : data.DTS_PFM_STRT,
									DTS_PLN_END : data.DTS_PFM_SOL,
									CD_PLN : '1', // 1.계획
									DC_PLN : '',
									flag : 'I',
									PLNR_LIST : data.PFMR_LIST
								}];
							}
							return param;
						};
						
						vm.getPfmRESTParam = function(method) {
							var param = servPfm.getRESTParam(method);
							param.CD_PFM = '2';       // 2.결과처리 보고
//							param.PFMR_LIST = [{
//								flag : (method === 'INSERT'?'I':'U'),
//								NO_EMP : 'shin'
//							}];
							
							return param;
						};
						
						emgObsProc.recParam = vm.getRecRESTParam(method); // 접수 Param
						emgObsProc.pfmParam = vm.getPfmRESTParam(method); // 수행 Param
						emgObsProc.plnParam = vm.getPlnRESTParam(method, emgObsProc.pfmParam); // 계획 Param
						
						vm.restProc(method, emgObsProc).then(function (res) {
							if (res.data.NO_SERV_REC) { servRec.NO_SERV_REC.value = res.data.NO_SERV_REC; }
							if (res.data.NO_SERV_PFM) { servPfm.NO_SERV_PFM.value = res.data.NO_SERV_PFM; }
							
							vm.onRecFileCompleteAll = function (res) {
								// res.state = true 성공 / false 실패
								if (res.state) {
									servPfm.PFM_FILE_LIST.api.uploadAll({
										insertedNo: servPfm.NO_SERV_PFM.value
									});
								} else {
									alert(res.msg);
								}
							}; 
							
							servRec.recFile.api.callback.onCompleteAll = vm.onRecFileCompleteAll;
							
							servRec.recFile.api.uploadAll({
								insertedNo: servRec.NO_SERV_REC.value
							});
							
							vm.onPfmFileCompleteAll = function (res) {
								alert(res.msg);
								res.state ? $state.go('app.svEmgObsProc', { kind: 'list', menu: true, ids: null }) : $state.go('app.svEmgObsProc', { kind: 'detail', ids: self.NO_SERV_REC.value }, { reload: true });
							}; 
							
							servPfm.PFM_FILE_LIST.api.callback.onCompleteAll = vm.onPfmFileCompleteAll;
						});
					},

					/**
					 * 리스트 페이지로 이동한다.
					 */
					moveListPage: function () {
						$state.go('app.svEmgObsProc', { kind: 'list', menu: true, ids: null });
					},
					
					restProc:  function (method, data) {
						switch (method) {
							case 'INSERT': return SvEmgObsProcInfoSvc.insert(data);
							case 'UPDATE': return SvEmgObsProcInfoSvc.update(data);
						}
					},
					
					getRec: function () {
						var ret = resData.svServRec;
						
						if(resData.svServRec) {
							if(resData.svServRec.CD_STAT_PROC === 4) {
								return ret;
							}
							else {
								// 접수 상태를 접수중으로 변경
								ret.CD_STAT_PROC = 1;
								return ret;
							}
						}
						
						return ret;
					},
					
					getPfm: function () {
						var ret = null;
						
						// 접수 정보가 있으면
						if(resData.svServRec) {
							// 수행 정보가 있으면
							if(resData.svServPfm) {
								ret = resData.svServPfm[0];
							}
							
							if(ret && resData.svServRec.CD_STAT_PROC !== 4) {
								ret.CD_STAT_PROC = 2; // 접수 상태는 2.처리중
								ret.CD_PFM = 1;       // 수행 상태는 1.수행중으로 변경
							}
						} 
						
						return ret;
					}
				};
				
				UtilSvc.extendVO([
					{ 
						target:vm, 
						name:'servRec', 
						data: vm.getRec(), 
						vo: SvServRecVO, 
						option:{ enableWrite: true } 
					},
					{ 
						target:vm, 
						name:'servPfm', 
						data: vm.getPfm(), 
						vo: SvServPfmVO, 
						option:{ enableWrite: true } 
					}
				]);
				
				vm.code = {
					recWayCdList   : [],
					servTpCdList   : [],
					obsSronCdList  : [],
					obsSepCdList   : [],
					eqmTpList      : [],
					vedCList       : [],
					eqmItdFrmCdList: [],
					ynList         : [],
					procAftRptWayList : []
				};

				$scope.vm = vm;
				vm.initLoad();

			}
		]);
}());