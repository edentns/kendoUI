(function () {
	'use strict';

	angular
		.module('SV.05svEmgObsProc.service')
		.service('SV.05svEmgObsProcInfoBiz', SvEmgObsProcInfoBiz);

	SvEmgObsProcInfoBiz.$inject = ['SV.05svEmgObsProcInfoSvc', 'SY.codeSvc', 'APP_CODE', '$q', 'UtilSvc'];
	function SvEmgObsProcInfoBiz (SvEmgObsProcInfoSvc, SyCodeSvc, APP_CODE, $q, UtilSvc) {
		var self = this;

		self.initLoad = function (code) {
			var param = {
				procedureParam : "USP_SY_CODE_D_GET&cd_cls@s|dc_rmk1@s|dc_rmk2@s|dc_rmk3@s|dc_rmk4@s|dc_rmk5@s",
				cd_cls : APP_CODE.servTp.cd,
				dc_rmk2 : 'EMG'
			};
			
			$q.all([
			    // 접수
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.recWay.cd }),   // 접수방법
				UtilSvc.getList(param),                                 // 서비스유형
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSron.cd }),  // 장애심각도
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.obsSep.cd }),   // 장애구분
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmTp.cd }),    // 장비유형
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.vendor.cd }),   // 제조사
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmItdFrm.cd }),// 장비도입형태
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.yn.cd }),       // yn여부
				// 수행
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.procRptWay.cd })// 처리후 보고방식
			]).then(function (res) {
				var defaults = { CD: 0, NAME: '선택' };
				res[0].data.unshift(defaults);
				res[1].data.results[0].unshift(defaults);
				res[2].data.unshift(defaults);
				res[3].data.unshift(defaults);
				res[4].data.unshift(defaults);
				res[5].data.unshift(defaults);
				res[8].data.unshift(defaults);

				code.recWayCdList   = res[0].data;
				code.servTpCdList   = res[1].data.results[0];
				code.obsSronCdList  = res[2].data;
				code.obsSepCdList   = res[3].data;
				code.eqmTpList      = res[4].data;
				code.vedCList       = res[5].data;
				code.eqmItdFrmCdList= res[6].data;
				code.ynList         = res[7].data;
				code.procAftRptWayList = res[8].data;
			});
		};

		self.getServRec = function () {
			return {};
		};
	}



	function SvServRecVO (servRecInfo) {
		var self = this;

		self.eqm = {};
		self.newEqm = {};
		self.file = {};
	}
}());