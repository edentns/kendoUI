/**
 * 서비스관리 > 관리 > 접수결과처리 상세
 * Created by js.choi on 2015.08.20
 */
(function () {
	'use strict';

	function SvRecResProcInfoCtrl ($scope, $state, $stateParams, UtilSvc, SvRecResProcInfoBiz, SvServRecVO, SvServPlnVO, SvServPfmVO, SvRecResProcVO, resData, Page) {
		var page  = $scope.page = new Page({ auth: resData.access }),
			vm;

		vm = {
			kind: ($stateParams.kind==='insert') ? 'INSERT' : 'UPDATE',
			servRec: { boxTitle: '접수정보', open: false },
			servPln: {
				boxTitle: '계획정보',
				open: false,
				PLN_LIST: []
			},
			servPfm: {
				boxTitle: '수행정보',
				open: true,
				PFM_LIST: []
			},
			recResProc: {
				boxTitle: '집계정보',
				open: true
			}
		};

		/**
		 * 페이지 초기 로드시 실행된다.
		 */
		vm.initLoad = function () {
			SvRecResProcInfoBiz.setDefaultShow(vm);
		};

		/**
		 * 리스트 페이지로 이동한다.
		 */
		vm.moveListPage = function () {
			$state.go('app.svRecResProc', { kind:'list', menu:true, ids:null });
		};

		/**
		 * 접수결과를 처리한다.
		 */
		vm.save = function () {
			var self = this,
				param = self.recResProc.getRestParam();

			if (!param) { return; }
			self.recResProc.save(param).then(function (res) {
				var noServRec = self.servRec.NO_SERV_REC.value;
				if (res.data.NO_SERV_REC) { noServRec = res.data.NO_SERV_REC; }

				self.recResProc.FINISH_FILE_LIST.api.uploadAll({
					insertedNo: noServRec
				});
			});
		};

		/**
		 * 수행상세정보 모달팝업을 띄운다.
		 */
		vm.modalPfmDetail = function (servPfm) {
			SvRecResProcInfoBiz.modalPfmDetail(servPfm);
		};

		UtilSvc.extendVO([
			{ target:vm, name:'servRec', data: resData.svServRec, vo: SvServRecVO, option:{ enableWrite: false } },
			{ target:vm.servPln, name:'PLN_LIST', data: resData.svServPln.PLN_LIST, vo: SvServPlnVO, option:{ enableWrite: false, expanded: false } },
			{ target:vm.servPfm, name:'PFM_LIST', data: SvRecResProcInfoBiz.getBindServPfm(resData.svServPfm, resData.svServPln.PLN_LIST), vo: SvServPfmVO, option:{ enableWrite: false }, include: { NO_SERV_REC: resData.svServRec.NO_SERV_REC, CD_STAT_PROC: resData.svServRec.CD_STAT_PROC } },
			{ target:vm, name:'recResProc', data: resData.svServRecResProc, vo: SvRecResProcVO, option:{ enableWrite: true}, include: { NO_SERV_REC: resData.svServRec.NO_SERV_REC, CD_STAT_PROC: resData.svServRec.CD_STAT_PROC } }
		]);

		$scope.vm = vm;
		vm.initLoad();

	}
	SvRecResProcInfoCtrl.$inject = ['$scope', '$state', '$stateParams', 'UtilSvc', 'SV.04svRecResProcInfoBiz', 'SvServRecVO', 'SvServPlnVO', 'SvServPfmVO', 'SvRecResProcVO', 'resData', 'Page'];

	angular
		.module('SV.04svRecResProc.controller')
		.controller('SV.04svRecResProcInfoCtrl', SvRecResProcInfoCtrl);
}());