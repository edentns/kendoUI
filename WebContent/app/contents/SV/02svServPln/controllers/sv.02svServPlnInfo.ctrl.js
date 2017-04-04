/**
 * 서비스관리 > 수행 > 계획일정등록
 * Created by js.choi on 2015.08.19
 */
(function () {
	'use strict';

	function SvServPlnInfoCtrl ($scope, $state, $stateParams, UtilSvc, SvServRecVO, SvServPlnVO, SvServPlnInfoBiz, resData, Page) {
		var page  = $scope.page = new Page({ auth: resData.access }),
			today = edt.getToday(),
			vm;

		vm = {
			servRec : { boxTitle: '접수정보', open: false },
			servPln  : UtilSvc.extend({
				boxTitle: '계획정보',
				open: true,
				method: resData.svServPln.PLN_LIST.length===0 ? 'POST' : 'PUT',
				option: {
					usePeriod: false,
					enableCustomSettingDay: false,
					CD_CTR_STP_DAYS: { value: 1 }, // 1.첫째날/2.마지막날/3.날짜선택
					DT_CTR_STRT: { value: '', date: { y: today.y, m: today.m, d: '01' } },
					DT_CTR_END: { value: '', date: { y: today.y, m: today.m, d: edt.fillSpace(edt.getLastDate([today.y, today.m, today.d].join('-'), '-')) } },
					NU_CTR_STP_DAYS: { value: 1 }
				},
				PLN_LIST: []
			}, resData.svServPln, { exclude: ['PLN_LIST'] })

		};

		vm.initLoad = function () {
			var self = this;
			SvServPlnInfoBiz.initLoad(self.code);
			SvServPlnInfoBiz.setPlnData(self.servPln.option, resData.svServPln);
		};

		/**
		 * 페이지 수정여부를 판단한다.
		 * @returns {boolean}
		 */
		vm.isEnableWrite = function () {
			return page.isWrite() && resData.svServRec.CD_STAT_PROC<3;
		};

		vm.active = {
			/**
			 * 계획 삭제 버튼 활성화 여부를 판단한다.
			 * @param {object} pln
			 * @returns {boolean}
			 */
			enablePlnRemoveBtn: function (pln) {
				return !UtilSvc.isValid(pln.NO_SERV_PLN.value);
			}
		};

		vm.code = {
			yearList: edt.makeYearList(),
			monthList: edt.makeMonthList(),
			recWayCdList: [],   // 접수방법
			servTpCdList: [],   // 서비스유형
			obsSronCdList: [],  // 장애심각도
			obsSepCdList: [],   // 장애구분
			eqmTpList: [],      // 장비유형
			vedCList: [],       // 제조사
			eqmItdFrmCdList: [],// 장비도입형태
			ynList: [],         // YN여부
			plnStatCdList: [],  // 계획상태
			pfmStatCdList: [],  // 수행상태
			stpDays: []         // 설정코드
		};

		/**
		 * 계획 ROW를 추가한다.
		 */
		vm.servPln.addPln = function () {
			SvServPlnInfoBiz.addPln(this);
		};

		/**
		 * 계획 ROW를 제거한다.
		 * @param {number} idx
		 */
		vm.servPln.removePln = function (idx) {
			vm.servPln.PLN_LIST.splice(idx, 1);
		};

		/**
		 * date 마지막 기간이 변경될 때마다 해당 월 마지막 일자를 구한다.
		 */
		vm.servPln.changeCtrEndDate = function () {
			var self = this,
				date = self.option.DT_CTR_END.date;

			date.d = edt.fillSpace(edt.getLastDate([date.y, date.m].join('-'), '-'));
		};

		/**
		 * 설정일자 코드 변경 이벤트
		 */
		vm.servPln.changeStpDays = function () {
			var plnOpt = this.option;
			plnOpt.CD_CTR_STP_DAYS.value = Number(plnOpt.CD_CTR_STP_DAYS.value);
			switch (plnOpt.CD_CTR_STP_DAYS.value) {
				case 1:
					plnOpt.enableCustomSettingDay = false;
					plnOpt.NU_CTR_STP_DAYS.value = 1;
					break;
				case 2:
					plnOpt.enableCustomSettingDay = false;
					plnOpt.NU_CTR_STP_DAYS.value = 31;
					break;
				case 3:
					plnOpt.enableCustomSettingDay = true;
					break;
			}
		};

		/**
		 * 계획을 등록, 수정 또는 삭제한다.
		 */
		vm.servPln.save = function () {
			var self = this,
				param = SvServPlnInfoBiz.getRestPlnParam(self);

			if (param) {
				SvServPlnInfoBiz.save(self.method, param).then(function (res) {
					alert('계획이 저장되었습니다.');
					$state.go('app.svServPln', { kind:'list', menu:true, ids:null });
				});
			}
		};

		/**
		 * list page로 이동한다.
		 */
		vm.servPln.moveListPage = function () {
			$state.go('app.svServPln', { kind:'list', menu:'true', ids: null });
		};

		UtilSvc.extendVO([
			{ target:vm, name:'servRec', data: resData.svServRec, vo: SvServRecVO, option:{ enableWrite: false } },
			{ target:vm.servPln, name:'PLN_LIST', data: resData.svServPln.PLN_LIST, vo: SvServPlnVO, option:{ enableWrite: vm.isEnableWrite(), flag: 'U' } }
		]);

		$scope.vm = vm;
		vm.initLoad();
	}
	SvServPlnInfoCtrl.$inject = ['$scope', '$state', '$stateParams', 'UtilSvc', 'SvServRecVO', 'SvServPlnVO', 'SV.02svServPlnInfoBiz', 'resData', 'Page'];

	angular
		.module('SV.02svServPln.controller')
		.controller('SV.02svServPlnInfoCtrl', SvServPlnInfoCtrl);

}());