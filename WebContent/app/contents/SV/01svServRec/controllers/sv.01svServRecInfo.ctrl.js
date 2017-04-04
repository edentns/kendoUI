(function () {
	'use strict';

	function SvServRecInfoCtrl (SvServRecInfoBiz, UtilSvc, SvServRecVO, $scope, $state, $stateParams, resData, Page) {
		var page  = $scope.page = new Page({ auth: resData.access }),
			vm;


		vm = {
			kind: ($stateParams.kind==='insert') ? 'INSERT' : 'UPDATE',
			servRec : { boxTitle: '접수정보', open: true }
		};

		vm.code = {
			recWayCdList: [],   // 접수방법
			servTpCdList: [],   // 서비스유형
			obsSronCdList: [],  // 장애심각도
			obsSepCdList: [],   // 장애구분
			eqmTpList: [],  // 장비유형
			vedCList: [],   // 제조사유형
			eqmItdFrmCdList: [],    // 장비도입형태
			ynList: []  // Yes or No
		};

		UtilSvc.extendVO([
			{ target:vm, name:'servRec', data: resData.svServRec, vo: SvServRecVO, option:{ enableWrite: true } }
		]);

		vm.initLoad = function () {
			if (!resData.svServRec) {
				resData.svServRec = {
					NO_RECR: $scope.webApp.user.CD,
					NM_RECR: $scope.webApp.user.NAME,
					NM_DEPT_RECR: $scope.webApp.user.DEPT_NAME,
					RECR_NO_PHONE_IN: $scope.webApp.user.PHONE_INNER
				};
			}

			SvServRecInfoBiz.initLoad(vm.code);
		};

		vm.isInsPage = function () {
			return this.kind === 'INSERT';
		};

		/**
		 * 접수취소 버튼을 보여줄지 판단한다.
		 * @returns {*|boolean}
		 */
		vm.isServRecCancelBtn = function () {
			return !this.isInsPage() && this.isEnableWrite() &&this.isStatProcRec();
		};

		/**
		 * 접수 상태가 접수인지 판단한다.
		 * @returns {boolean}
		 */
		vm.isStatProcRec = function () {
			return resData.svServRec && resData.svServRec. CD_STAT_PROC===1;
		};

		/**
		 * 수정가능 여부를 판단한다.
		 * @returns {*|boolean}
		 */
		vm.isEnableWrite = function () {
			return !resData.svServRec.CD_STAT_PROC || resData.svServRec.CD_STAT_PROC===1;
		};

		/**
		 * 서비스 접수 REST를 요청한다.
		 */
		vm.doRest = function (method) {
			var self = this,
				param = self.servRec.getRESTParam(method);

			if (param) {
				self.servRec.restProc(method, param).then(function (res) {
					if (res.data.NO_SERV_REC) { self.servRec.NO_SERV_REC.value = res.data.NO_SERV_REC; }
					self.servRec.recFile.api.uploadAll({
						insertedNo: self.servRec.NO_SERV_REC.value
					});
				});
			}
		};

		/**
		 * 접수를 취소한다.
		 */
		vm.doServRecCancel = function () {
			this.servRec.modalServRecCancel();
		};

		/**
		 * 리스트 페이지로 이동한다.
		 */
		vm.moveListPage = function () {
			$state.go('app.svServRec', { kind: 'list', menu: true, ids: null });
		};

		$scope.vm = vm;
		vm.initLoad();
	}
	SvServRecInfoCtrl.$inject = ['SV.01svServRecInfoBiz', 'UtilSvc', 'SvServRecVO', '$scope', '$state', '$stateParams', 'resData', 'Page'];

	angular
		.module('SV.01svServRec.controller')
		.controller('SV.01svServRecInfoCtrl', SvServRecInfoCtrl);
}());
