(function () {
	'use strict';

	function SvServPfmInfoCtrl (SvServPfmInfoBiz, SvServRecVO, SvServPfmVO, UtilSvc, $scope, $state, $stateParams, resData, Page) {

		var page  = $scope.page = new Page({ auth: resData.access }),
			vm;

		/**
		 * VIEW MODEL
		 */
		vm = {
			kind: ($stateParams.pfm !== undefined  || $stateParams.pfm === '' ) ? 'INSERT' : 'UPDATE',
			servRec : { boxTitle: '접수정보'  },
			servPfm  : { boxTitle: '수행정보' }
		};

		/**
		 * 코드
		 * @type {{pfmList: Array, procAftRptWayList: Array}}
		 */
		vm.code = {
			pfmList: [],
			procAftRptWayList : []
		};

		/**
		 * 페이지 최초 로드시 실행된다.
		 */
		vm.initLoad = function () {
			var self = this,
				hasPln =  self.hasServPlan(),
				tabOpenCheck = resData.svServRec.CD_STAT_PROC === 3 || false,
				voConfig = [{ target:vm, name:'servRec', data: resData.svServRec, vo: SvServRecVO, option:{ enableWrite: false, open:tabOpenCheck }}];

			SvServPfmInfoBiz.initLoad(vm.code);
			if (hasPln) {
				voConfig.push({
					target:vm,
					name:'servPfm',
					data: SvServPfmInfoBiz.getServPfm(resData.svServRec, UtilSvc.findWhere(resData.svServPln.PLN_LIST, { NO_SERV_PLN: $stateParams.pln })[0], resData.svServPfm),
					vo: SvServPfmVO,
					option:{ enableWrite: true, open: !tabOpenCheck }
				});
			} else {
				self.servRec.open = !hasPln;
				//self.servRec.open = false;
			}

			UtilSvc.extendVO(voConfig);
		};

		/**
		 * 서비스 계획코드가 존재하는지 판단한다.
		 * @returns {*|boolean|{state, msg}|{state: boolean, msg: string}}
		 */
		vm.hasServPlan = function () {
			return UtilSvc.isValid($stateParams.pln);
		};

		/**
		 * INSERT 여부를 판단한다.
		 * @returns {boolean}
		 */
		vm.isInsPage = function () {
			return this.kind === 'INSERT';
		};

		/**
		 * 수행결과보고를 처리한다.
		 * @param method
		 */
		vm.doRest = function (method) {
			var self = this,
				param = self.servPfm.getRESTParam(method);

			if (param) {
				self.servPfm.pfmrDupCheckProc(param).then(function (res) {
					var msg = res.data.result.NO_EMP +" 수행인원은 \n동일한 접수의 다른수행에 수행인원으로 일정등록 되어있습니다 \n계속 진행하시겠습니까?";

					if (res.data.result.NO_EMP==='' || confirm(msg)) {
						self.servPfm.restProc(method, param).then(function (res) {
							if (res.data.NO_SERV_PFM) { self.servPfm.NO_SERV_PFM.value = res.data.NO_SERV_PFM; }
							self.servPfm.PFM_FILE_LIST.api.uploadAll({
								insertedNo: self.servPfm.NO_SERV_PFM.value
							});
						});
					}
				});
			}
		};

		/**
		 * 수행결과보고 리스트 페이지로 이동한다.
		 */
		vm.moveListPage = function () {
			$state.go('app.svServPfm', { kind: 'list', menu: true, ids: null , pln:null , pfm:null });
		};

		$scope.vm = vm;
		vm.initLoad();
	}
	SvServPfmInfoCtrl.$inject = ['SV.03svServPfmInfoBiz', 'SvServRecVO', 'SvServPfmVO', 'UtilSvc', '$scope', '$state', '$stateParams', 'resData', 'Page'];

	angular
		.module('SV.03svServPfm.controller')
		.controller('SV.03svServPfmInfoCtrl', SvServPfmInfoCtrl);
}());
