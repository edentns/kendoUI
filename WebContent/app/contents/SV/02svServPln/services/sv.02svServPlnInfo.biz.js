/**
 * 서비스관리 > 수행 > 계획일정등록 상세 BIZ
 * Created by js.choi on 2015.08.19
 */
(function () {
	'use strict';

	function SvServPlnInfoBiz (UtilSvc, SvServPlnSvc, SyCodeSvc, SvServPlnVO, APP_CODE, $q) {
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
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.yn.cd }),       // yn여부
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.plnStat.cd }),  // 계획상태
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.pfmStat.cd }),  // 수행상태
				SyCodeSvc.getSubcodeList({ cd: APP_CODE.ctrStpDays.cd })// 계약설정코드
			]).then(function (res) {
				var defaults = { CD: 0, NAME: '선택' };
				res[0].data.unshift(defaults);
				res[1].data.unshift(defaults);
				res[2].data.unshift(defaults);
				res[3].data.unshift(defaults);
				res[4].data.unshift(defaults);
				res[5].data.unshift(defaults);

				code.recWayCdList = res[0].data;
				code.servTpCdList = res[1].data;
				code.obsSronCdList = res[2].data;
				code.obsSepCdList = res[3].data;
				code.eqmTpList = res[4].data;
				code.vedCList = res[5].data;
				code.eqmItdFrmCdList= res[6].data;
				code.ynList = res[7].data;
				code.plnStatCdList = res[8].data;
				code.pfmStatCdList = res[9].data;
				code.stpDays = res[10].data;
			});
		};

		/**
		 * 계획 data를 모델에 할당한다.
		 * @param {object} plnOpt
		 * @param {object} resServPln
		 */
		self.setPlnData = function (plnOpt, resServPln) {
			var splitStrtDt, splitEndtDt;
			if (resServPln.DT_CTR_STRT) {
				plnOpt.usePeriod = true;
				splitStrtDt = resServPln.DT_CTR_STRT.split('-');
				splitEndtDt = resServPln.DT_CTR_END.split('-');
				plnOpt.DT_CTR_STRT.date = { y: splitStrtDt[0], m: splitStrtDt[1], d: splitStrtDt[2] };
				plnOpt.DT_CTR_END.date = { y: splitEndtDt[0], m: splitEndtDt[1], d: splitEndtDt[2] };
			}

			plnOpt.enableCustomSettingDay = (resServPln.CD_CTR_STP_DAYS === 3);
			if (resServPln.CD_CTR_STP_DAYS) { plnOpt.CD_CTR_STP_DAYS.value = resServPln.CD_CTR_STP_DAYS; }
			if (resServPln.NU_CTR_STP_DAYS) { plnOpt.NU_CTR_STP_DAYS.value = resServPln.NU_CTR_STP_DAYS; }
		};

		/**
		 * 계획 리스트를 추가한다.
		 * @param servPln
		 */
		self.addPln = function (servPln) {
			var option = servPln.option,
				today = edt.getToday(),
				strtDt = option.DT_CTR_STRT.date,
				endDt = option.DT_CTR_END.date,
				sStrtDt = [strtDt.y, strtDt.m, strtDt.d].join('-'),
				sEndDt = [endDt.y, endDt.m, endDt.d].join('-'),
				createCnt, momentDt, endDate, i,
				lastPln, sY, sM, sD;

			if (servPln.option.usePeriod && servPln.PLN_LIST.length===0) {
				if (edt.getDitcDay(sStrtDt, sEndDt) < 0) {
					alert('기간이 유효하지 않습니다.');
					return;
				}

				createCnt = edt.getDitcMonth(sStrtDt, sEndDt) + 1;
				//createCnt = createCnt===0 ? 1 : createCnt;

				momentDt = moment(sStrtDt);

				for (i=0; i<createCnt; i+=1) {
					momentDt.set('year', strtDt.y);
					momentDt.set('month', (Number(strtDt.m)-1)+ i);
					endDate = edt.getLastDate([momentDt.get('year'), edt.fillSpace(momentDt.get('month')+1)].join('-'));

					sY = String(momentDt.get('year'));
					sM = edt.fillSpace(momentDt.get('month')+1);
					sD = edt.fillSpace(option.NU_CTR_STP_DAYS.value>endDate ? endDate: option.NU_CTR_STP_DAYS.value);

					servPln.PLN_LIST.push(new SvServPlnVO({
						NO_SERV_REC: servPln.NO_SERV_REC,
						DTS_PLN_STRT: [sY, sM, sD].join('-') +' 09:00:00',
						DTS_PLN_END: [sY, sM, sD].join('-') +' 18:00:00'
					}));
				}
			} else {
				if (servPln.PLN_LIST.length>0) {
					lastPln = servPln.PLN_LIST[servPln.PLN_LIST.length-1];
					servPln.PLN_LIST.push(new SvServPlnVO({
						NO_SERV_REC: servPln.NO_SERV_REC,
						DTS_PLN_STRT: lastPln.DTS_PLN_STRT.value,
						DTS_PLN_END: lastPln.DTS_PLN_END.value
					}));
				} else {
					sY = today.y;
					sM = today.m;
					sD = today.d;
					servPln.PLN_LIST.push(new SvServPlnVO({
						NO_SERV_REC: servPln.NO_SERV_REC,
						DTS_PLN_STRT: [sY, sM, sD].join('-') +' 09:00:00',
						DTS_PLN_END: [sY, sM, sD].join('-') +' 18:00:00'
					}));
				}
			}

		};

		/**
		 * 계획을 등록 또는 수정, 삭제한다.
		 * @param {string} method
		 * @param {object} param
		 * @returns {*|{confirm, success, error}}
		 */
		self.save = function (method, param) {
			return SvServPlnSvc.save(method, param);
		};

		/**
		 * 계획을 등록 또는 수정, 삭제를 위한 parameter를 생성한다.
		 * @param {object} servPln
		 * @returns {object|boolean}
		 */
		self.getRestPlnParam = function (servPln) {
			if (servPln.PLN_LIST.length===0) {
				alert('계획을 등록 후 저장해주세요.');
				return;
			}

			var option = servPln.option,
				param = {
					CD_CTR_STP_DAYS: option.CD_CTR_STP_DAYS.value,
					NU_CTR_STP_DAYS: option.NU_CTR_STP_DAYS.value,
					NO_SERV_REC: servPln.NO_SERV_REC,
					PLN_LIST: []
				},
				plnParam,
				i, lng, j, lng2, pln, plnrList, plnr;

			if (option.usePeriod) {
				param.DT_CTR_STRT = [option.DT_CTR_STRT.date.y, option.DT_CTR_STRT.date.m, option.DT_CTR_STRT.date.d].join('-');
				param.DT_CTR_END = [option.DT_CTR_END.date.y, option.DT_CTR_END.date.m, option.DT_CTR_END.date.d].join('-');
			}


			for (i=0, lng=servPln.PLN_LIST.length; i<lng; i+=1) {
				pln = servPln.PLN_LIST[i];

				if (pln.enableWrite) {
					plnParam = {
						flag: pln.flag || 'I',
						NO_SERV_REC: pln.NO_SERV_REC.value,
						NO_SERV_PLN: pln.NO_SERV_PLN.value,
						CD_PLN: pln.CD_PLN.value,
						DC_PLN: pln.DC_PLN.value
					};

					// 계획시작일시
					if (!pln.DTS_PLN_STRT.value) { return edt.invalidFocus(pln.DTS_PLN_STRT.id+i, pln.DTS_PLN_STRT.msg.empty); }
					if (!moment(pln.DTS_PLN_STRT.value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) { return edt.invalidFocus(pln.DTS_PLN_STRT.id, pln.DTS_PLN_STRT.msg.error); }
					plnParam.DTS_PLN_STRT = pln.DTS_PLN_STRT.value;

					// 계획종료일시
					if (!pln.DTS_PLN_END.value) { return edt.invalidFocus(pln.DTS_PLN_END.id+i, pln.DTS_PLN_END.msg.empty); }
					if (!moment(pln.DTS_PLN_END.value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) { return edt.invalidFocus(pln.DTS_PLN_END.id, pln.DTS_PLN_END.msg.error); }
					plnParam.DTS_PLN_END = pln.DTS_PLN_END.value;

					// 계획 시작일시 와 계획 종료일시 비교
					if (pln.DTS_PLN_END.value) {
						if (new Date(plnParam.DTS_PLN_END) - new Date(plnParam.DTS_PLN_STRT) < 0) {
							return edt.invalidFocus(pln.DTS_PLN_END.id+i, pln.DTS_PLN_END.msg.error);
						}
					}

					if (pln.PLNR_LIST.compositeData.length === 0) {
						return edt.invalidFocus('addPlnUserBtn'+ i, '계획인원을 등록해주세요.');
					}
					plnrList = pln.PLNR_LIST.compositeData.concat(UtilSvc.findWhere(pln.PLNR_LIST.data, {flag:'D'}));
					plnParam.PLNR_LIST = [];
					for(j=0, lng2=plnrList.length; j<lng2; j+=1) {
						plnr = plnrList[j];
						plnParam.PLNR_LIST.push({
							flag: plnr.flag || 'I',
							NO_EMP: plnr.NO_EMP
						});
					}
					param.PLN_LIST.push(plnParam);
				}
			}

			return param;
		};
	}
	SvServPlnInfoBiz.$inject = ['UtilSvc', 'SV.02svServPlnSvc', 'SY.codeSvc', 'SvServPlnVO', 'APP_CODE', '$q'];

	angular
		.module('SV.02svServPln.service')
		.service('SV.02svServPlnInfoBiz', SvServPlnInfoBiz);
}());