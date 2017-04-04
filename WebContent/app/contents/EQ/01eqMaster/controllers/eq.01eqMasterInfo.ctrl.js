(function () {
	'use strict';

	angular
		.module('EQ.01eqMaster.controller')
		/**
		 * 장비관리 Info Controller
		 * @constructor
		 */
		.controller('EQ.01eqMasterInfoCtrl', ['$scope', '$state', '$stateParams', 'UtilSvc', 'EQ.01eqMasterInfoBiz', 'EQ.01eqMasterVO', 'uiGridConstants', 'resData', 'Page',
			function ($scope, $state, $stateParams, UtilSvc, EqMasterInfoBiz, EqMasterVO, uiGridConstants, resData, Page) {
				var page  = $scope.page = new Page({ auth: resData.access }),
					today = edt.getToday(),
					resEquipment = resData.equipment,
					vm = {};


				/**
				 * 등록페이지인지 판단한다.
				 * @type {*|boolean}
				 */
				vm.isInsPage = EqMasterInfoBiz.isInsPage($stateParams.kind);

				/**
				 * 페이지 초기 로드시 실행한다.
				 */
				vm.initLoad = function () {
					var self = this;
					EqMasterInfoBiz.initLoad(self.code);
				};

				/**
				 * 장비를 등록한다.
				 */
				vm.insert = function () {
					var param = vm.eqm.getRestParam('insert');
					if (!param.state) {
						param.model.showMsg();
						return;
					}

					EqMasterInfoBiz.insert(param.result).then(function (res) {
						alert(res.data.msg);
						vm.moveListPage();
					});
				};

				/**
				 * 장비를 수정한다.
				 */
				vm.update = function () {
					var param = vm.eqm.getRestParam('update');
					if (!param.state) {
						param.model.showMsg();
						return;
					}

					EqMasterInfoBiz.update(param.result).then(function (res) {
						alert(res.data.msg);
						vm.moveListPage();
					});
				};

				/**
				 * 장비 등록 또는 수정을 취소한다.
				 */
				vm.cancel = function () {
					var msg = vm.isInsPage ? '등록을 취소하시겠습니까?' : '수정을 취소하시겠습니까?';
					if (confirm(msg)) {
						vm.moveListPage();
					}
				};

				/**
				 * 리스트 페이지로 이동한다.
				 */
				vm.moveListPage = function () {
					$state.go('app.eqMng', { kind: 'list', menu: true, ids: null });
				};


				/**
				 * 코드 정보
				 */
				vm.code = {
					eqmTpList: [],
					vedCList : [],
					ynList   : []
				};

				/**
				 * 장비정보
				 */
				vm.eqm = angular.extend(EqMasterInfoBiz.getEqmVO({ user: page.user, data: resEquipment }, vm.isInsPage), {
					boxTitle: '장비정보'
				});


				/**
				 * 중복장비정보
				 */
				vm.duplEqm = {
					boxTitle: '중복장비정보',
					grid: {
						data: (resEquipment) ? resEquipment.EQM_DUP_LIST.map(function (eqm) { eqm.action = ''; return eqm; }) : [],
						columnDefs: [
							{ displayName: '관리고객사', field: 'NM_MNG_CUST' },
							{ displayName: '서비스고객사', field: 'NM_SERV_CUST' },
							{ displayName: '장비명', field: 'NM_EQM' },
							{ displayName: '장비번호', field: 'NO_EQM' },
							{ displayName: '장비ID', field: 'NM_EQM_ID' },
							{ displayName: 'Serail Number', field: 'DC_SRN' },
							{ displayName: '모델명', field: 'NM_MODEL' },
							{ displayName: '장비위치', field: 'DC_EQM_POS' },
							{ displayName: '장비유형', field: 'NM_EQM_TP' },
							{ displayName: 'IP Address', field: 'DC_IPA' },
							{ displayName: '확정여부', field: 'NM_DTM_YN' },
							{ displayName: 'Action', field: 'action',
								cellTemplate: '<div class="ui-grid-cell-contents ta-c" title="TOOLTIP"><button type="button" class="btn btn-danger" title="중복장비취소" ng-click="grid.appScope.vm.duplEqm.cancelDuplEqm(row, $parent.$parent.rowRenderIndex)">중복장비취소</button></div>'
							}
						],
						enableSorting: false,
						enableColumnMenus: false,
						enablePinning: false,
						enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
					},

					/**
					 * 변경장비를 해제한다.
					 * @param {object} eqm
					 * @param {number} idx
					 */
					cancelDuplEqm: function (eqm, idx) {
						var self = this,
							param = UtilSvc.extend({}, eqm.entity, { exclude: ['$$hashKey', 'NO_CHG_EQM', 'DTS_INSERT', 'DTS_UPDATE', 'NO_INSERT', 'NO_UPDATE', 'YN_DEL'] });

						EqMasterInfoBiz.update(param).then(function (res) {
							self.grid.data.splice(idx, 1);
							alert('중복장비가 해제되었습니다.');
						});


					}
				};


				/**
				 * 서비스 접수정보
				 */
				vm.servRec = {
					boxTitle: '서비스접수정보',
					perTp: '1',
					date : {
						dateType: 'week',
						buttonList: ['prevWeek', 'current', 'nextWeek', 'range'],
						selected: 'current',
						period: {
							start: angular.copy(today),
							end: angular.copy(today)
						},
						inquiry: function (period) {
							EqMasterInfoBiz.getEqmServList($stateParams.ids, vm.servRec.perTp, period).then(function (res) {
								vm.servRec.grid.data = res.data.result;
							});
						}
					},
					grid: {
						data: (resEquipment) ? resEquipment.EQM_SERV_REC_LIST : [],
						columnDefs: [
							{ displayName: '접수번호', field: 'NO_SERV_REC' },
							{ displayName: '접수자', field: 'NM_RECR' },
							{ displayName: '접수부서', field: 'NM_DEPT_RECR' },
							{ displayName: '관리고객사', field: 'NM_MNG_CUST' },
							{ displayName: '서비스고객사', field: 'NM_SERV_CUST' },
							{ displayName: '영업대표', field: 'CUST_NM_EMP' },
							{ displayName: '영업부서', field: 'CUST_NM_DEPT_EMP' },
							{ displayName: '서비스유형', field: 'NM_SERV_TP' },
							{ displayName: '처리상태', field: 'NM_STAT_PROC' },
							{ displayName: '접수방법', field: 'NM_REC_WAY' },
							{ displayName: '접수일시', field: 'DTS_SERV' },
							{ displayName: '처리완료요청일시', field: 'DTS_PROC_CPLT_REQ' },
							{ displayName: '접수내용', field: 'DC_REC_CCL_TAG_DEL' }
						],
						enableSorting: false,
						enableColumnMenus: false,
						enablePinning: false,
						enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
					}
				};


				vm.initLoad();
				$scope.vm = vm;
			}
		]);
}());