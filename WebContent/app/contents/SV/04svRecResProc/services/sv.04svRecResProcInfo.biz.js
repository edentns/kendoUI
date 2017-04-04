/**
 * 서비스관리 > 관리 > 접수결과처리
 * Created by js.choi on 2015.08.25
 */
(function () {
	'use strict';

	function SvRecResProcInfoBiz (ModalSvc, UtilSvc) {
		var self = this;

		/**
		 * 화면에 default로 보여줄 화면을 세팅한다.
		 * @param {object} model
		 */
		self.setDefaultShow = function (model) {
			var servRec = model.servRec,
				servPln = model.servPln,
				servPfm = model.servPfm,
				recResProc = model.recResProc;

			switch (servRec.CD_STAT_PROC.value) {
				case 1:
					servRec.open = true;
					servPln.open = false;
					servPfm.open = false;
					recResProc.open = true;
					break;

				case 2:
					servRec.open = false;
					servPln.open = false;
					servPfm.open = true;
					recResProc.open = true;
					break;
				default:
					servRec.open = true;
					servPln.open = false;
					servPfm.open = false;
					recResProc.open = false;
					break;
			}
		};

		/**
		 * 수행 상세정보를 보여준다.
		 * @param {object} servPfm
		 */
		self.modalPfmDetail = function (servPfm) {
			ModalSvc.detailPopup({
				resolve: {
					resData: function () {
						return {
							title: '수행상세정보',
							template: 'app/contents/SV/03svServPfm/templates/modal.svServPfm.tpl.html',
							vm: servPfm
						};
					}
				}
			});
		};

		/**
		 * 수행정보를 위한 데이터를 셋한다.
		 * @param {object} resServPfm
		 * @param {object} resPlnList
		 * @returns {object}
		 */
		self.getBindServPfm = function (resServPfm, resPlnList) {
			angular.forEach(resServPfm, function (pfm) {
				var pln = UtilSvc.findWhere(resPlnList, { NO_SERV_PLN: pfm.NO_SERV_PLN })[0];
				pfm.DTS_PLN_STRT = pln.DTS_PLN_STRT;
				pfm.DTS_PLN_END = pln.DTS_PLN_END;
			});
			return resServPfm;
		};
	}
	SvRecResProcInfoBiz.$inject = ['ModalSvc', 'UtilSvc'];
	
	angular.module('SV.04svRecResProc.service')
		.service('SV.04svRecResProcInfoBiz', SvRecResProcInfoBiz);

}());