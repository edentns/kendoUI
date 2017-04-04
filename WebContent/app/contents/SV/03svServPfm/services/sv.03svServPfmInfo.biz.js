(function () {
	'use strict';

	angular
		.module('SV.03svServPfm.service')
		.service('SV.03svServPfmInfoBiz', SvServPfmInfoBiz);

	SvServPfmInfoBiz.$inject = ['SV.03svServPfmSvc', 'SY.codeSvc', 'APP_CODE', '$q'];
	function SvServPfmInfoBiz (SvServPfmSvc, SyCodeSvc, APP_CODE, $q) {
		var self = this;

		/**
		 * 최초 페이지 로드시 실행된다.
		 * @param code
		 */
		self.initLoad = function (code) {
			$q.all([
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.pfmStat.cd }),   // 수행 상태
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.procRptWay.cd })   // 처리후 보고방식
			]).then(function (res) {
				var defaults = { CD: 0, NAME: '선택' };
				res[0].data.unshift(defaults);
				res[1].data.unshift(defaults);

				code.pfmList = res[0].data;
				code.procAftRptWayList = res[1].data;
			});
		};

		/**
		 * 수행정보를 위한 데이터를 셋한다.
		 * @param {object} resServRec
		 * @param {object} servPln
		 * @param {object} resServPfm
		 * @returns {object}
		 */
		self.getServPfm = function (resServRec, servPln, resServPfm) {
			var pfmData = {};
			if (resServPfm.length>0) {
				pfmData = resServPfm[0];
			} else {
				pfmData.NO_SERV_REC = resServRec.NO_SERV_REC;
				pfmData.NO_SERV_PLN = servPln.NO_SERV_PLN;
			}
			pfmData.CD_PLN = servPln.CD_PLN;
			pfmData.CD_STAT_PROC = resServRec.CD_STAT_PROC;
			pfmData.DTS_PLN_STRT = servPln.DTS_PLN_STRT;
			pfmData.DTS_PLN_END = servPln.DTS_PLN_END;

			// 처리중일 경우에만 접수계획자를 가져온다.
			if (resServRec.CD_STAT_PROC===2 && !pfmData.NO_SERV_PFM) {
				pfmData.PFMR_LIST = servPln.PLNR_LIST;
			}

			return pfmData;
		};
	}
}());