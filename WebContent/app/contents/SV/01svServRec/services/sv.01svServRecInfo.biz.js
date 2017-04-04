(function () {
	'use strict';

	function SvServRecInfoBiz (SvServRecSvc, SyCodeSvc, APP_CODE, $q) {
		var self = this;

		self.initLoad = function (code) {
			$q.all([
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.recWay.cd }),   // 접수방법
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.servTp.cd }),   // 서비스유형
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSron.cd }),  // 장애심각도
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSep.cd }),   // 장애구분
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmTp.cd }),    // 장비유형
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.vendor.cd }),   // 제조사
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmItdFrm.cd }),// 장비도입형태
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.yn.cd })        // yn여부
			]).then(function (res) {
				var defaults = { CD: 0, NAME: '선택' };
				res[0].data.unshift(defaults);
				res[1].data.unshift(defaults);
				res[2].data.unshift(defaults);
				res[3].data.unshift(defaults);
				res[4].data.unshift(defaults);
				res[5].data.unshift(defaults);

				code.recWayCdList   = res[0].data;
				code.servTpCdList   = res[1].data;
				code.obsSronCdList  = res[2].data;
				code.obsSepCdList   = res[3].data;
				code.eqmTpList      = res[4].data;
				code.vedCList       = res[5].data;
				code.eqmItdFrmCdList= [{ CD: 0, NAME: "선택" }].concat( res[6].data );
				code.ynList         = res[7].data;
			});
		};

		self.getServRec = function () {
			return {};
		};
	}
	SvServRecInfoBiz.$inject = ['SV.01svServRecSvc', 'SY.codeSvc', 'APP_CODE', '$q'];

	angular
		.module('SV.01svServRec.service')
		.service('SV.01svServRecInfoBiz', SvServRecInfoBiz);
}());