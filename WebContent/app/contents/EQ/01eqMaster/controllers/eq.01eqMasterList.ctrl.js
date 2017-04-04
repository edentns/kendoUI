
(function () {
	'use strict';

	angular
		.module('EQ.01eqMaster.controller')

		/**
		 * 장비관리 List Controller
		 */
		.controller('EQ.01eqMasterListCtrl', ['$scope', 'EQ.01eqMasterListBiz', '$state', 'resData', 'Page',
			function ($scope, EqMasterListBiz, $state, resData, Page) {
				var page  = $scope.page = new Page({ auth: resData.access }),
					today = edt.getToday(),
					vm = {};

				/**
				 * @name code
				 * @memberOf EQ.eqMaster.controller.EqMasterListCtrl
				 */
				vm.code = {
					eqmTpList   : [],
					vendorList  : []
				};

				/**
				 * @name search
				 * @memberOf EQ.eqMaster.controller.EqMasterListCtrl
				 */
				vm.search = {
					boxTitle: '장비검색',
					param: {
						NM_EQM      : '',   // 장비명
						NM_EQM_ID   : '',   // 장비ID
						DC_SRN      : '',   // Serial Number
						NM_MODEL    : '',   // 모델명
						DC_EQM_POS  : '',   // 장비위치
						DC_IPA      : '',   // IP Address
						CD_DTN_YN   : 0,    // 확정여부
						CD_EQM_TP   : [],   // 장비유형
						CD_VED_C    : [],   // 제조사
						NO_MNG_CUST : '',   // 관리고객사 코드
						NM_MNG_CUST : '',   // 관리고객사 이름
						NO_SERV_CUST: '',   // 서비스고객사 코드
						NM_SERV_CUST: ''    // 서비스고객사 이름
					},

					/**
					 * 조건에 일치하는 장비를 검색한다.
					 */
					inquiry: function () {
						var self = this;
						EqMasterListBiz.inquiry(self.param).then(function (resData) {
							vm.eqm.grid.data = resData;
						});
					},
					/**
					 * 검색조건 초기화 후 검색한다.
					 */
					init: function () {
						var self  = this,
							param = self.param;

						param.NM_EQM      = '';
						param.NM_EQM_ID   = '';
						param.DC_SRN      = '';
						param.NM_MODEL    = '';
						param.DC_EQM_POS  = '';
						param.DC_IPA      = '';
						param.CD_DTN_YN   = 0;
						param.CD_EQM_TP   = [];
						param.CD_VED_C    = [];
						param.NO_MNG_CUST = '';
						param.NM_MNG_CUST = '';
						param.NO_SERV_CUST= '';
						param.NM_SERV_CUST= '';

						self.inquiry();
					},
					/**
					 * 장비유형 선택을 초기화한다.
					 */
					intEqmTp: function () {
						this.param.CD_EQM_TP = [];
					},
					/**
					 * 제조사 선택을 초기화한다.
					 */
					initCdVedC: function () {
						this.param.CD_VED_C = [];
					},
					/**
					 * 관리고객사를 초기화한다.
					 */
					initMngCust: function () {
						this.param.NO_MNG_CUST = '';
						this.param.NM_MNG_CUST = '';
					},
					/**
					 * 관리고객사를 초기화한다.
					 */
					initServCust: function () {
						this.param.NO_SERV_CUST = '';
						this.param.NM_SERV_CUST = '';
					},
					/**
					 * 고객사 검객 모달 팝업을 연다.
					 * @param {string} flag 관리고객사(MNG), 서비스고객사(SERV)
					 */
					modalCustCmp: function (flag) {
						var self = this;
						EqMasterListBiz.modalCustCmp().then(function (res) {
							if (flag === 'MNG') {
								self.param.NO_MNG_CUST = res.code;
								self.param.NM_MNG_CUST = res.name;
							} else if (flag === 'SERV') {
								self.param.NO_SERV_CUST= res.code;
								self.param.NM_SERV_CUST= res.name;
							}
						});
					}
				};

				/**
				 * @name eqm
				 * @memberOf EQ.eqMaster.controller.EqMasterListCtrl
				 */
				vm.eqm = {
					boxTitle: '장비정보',
					column: {
						columnDefs  : [
							{ visible: true, displayName: '관리고객사', field: 'NM_MNG_CUST', cellClass: 'ta-c' },
							{ visible: true, displayName: '서비스고객사', field: 'NM_SERV_CUST', cellClass: 'ta-c' },
							{ visible: true, displayName: '장비명', field: 'NM_EQM', cellClass: 'ta-c' },
							{ visible: true, displayName: '장비번호', field: 'NO_EQM', cellClass: 'ta-c' },
							{ visible: true, displayName: '장비ID', field: 'NM_EQM_ID', cellClass: 'ta-c' },
							{ visible: true, displayName: 'Serial Number', field: 'DC_SRN', cellClass: 'ta-c' },
							{ visible: true, displayName: '모델명', field: 'NM_MODEL', cellClass: 'ta-c' },
							{ visible: true, displayName: '장비위치', field: 'DC_EQM_POS' },
							{ visible: true, displayName: '장비유형', field: 'NM_EQM_TP', cellClass: 'ta-c' },
							{ visible: true, displayName: '제조사', field: 'NM_VED_C', cellClass: 'ta-c' },
							{ visible: true, displayName: 'IP ADDRESS', field: 'DC_IPA', cellClass: 'ta-c' },
							{ visible: true, displayName: '확정여부', field: 'NM_DTM_YN', cellClass: 'ta-c' }
						],
						showColumns : [],
						hideColumns	: []
					},
					grid: {
						rowTemplate	: '<div ng-dblclick="grid.appScope.vm.eqm.moveDetailPage(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
						data: [],
						columnDefs: []
					},
					/**
					 * 장비 등록페이지로 이동한다.
					 */
					moveInsertPage: function () {
						$state.go('app.eqMng', { kind: 'insert', menu: null, ids: null });
					},
					/**
					 * 장비 상세페이지로 이동한다.
					 * @param {object} rowEqm 장비정보
					 */
					moveDetailPage: function (rowEqm) {
						$state.go('app.eqMng', { kind: 'detail', menu: null, ids: rowEqm.NO_EQM });
					},
					/**
					 * column을 설정한다.
					 */
					modalSetColumn: function () {
						EqMasterListBiz.modalSetColumn(this);
					},
					/**
					 * Excel File을 다운로드한다.
					 */
					downloadExcel: EqMasterListBiz.downloadExcel
				};

				$scope.vm = vm;
				EqMasterListBiz.initLoad(vm.code, vm.search.param, vm.eqm);
			}
		]);
}());