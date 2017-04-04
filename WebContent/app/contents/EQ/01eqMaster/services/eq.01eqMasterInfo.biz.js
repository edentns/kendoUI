(function () {
	'use strict';

	angular
		.module('EQ.01eqMaster.service')

		/**
		 * 장비 Info Biz Service
		 * @constructor
		 */
		.factory('EQ.01eqMasterInfoBiz', ['EQ.01eqMasterSvc', 'EQ.01eqMasterVO', 'SY.codeSvc', 'APP_CODE', '$q',
			function (EqMasterSvc, EqMasterVO, SyCodeSvc, APP_CODE, $q) {

				var BizFn = {
					/**
					 * 페이지 초기 로드시 실행
					 * @param {object} code code 모델
					 */
					initLoad: function (code) {
						BizFn._getCodeAll(code);
					},

					/**
					 * 코드 조회
					 * @returns {app|Route|*|Promise}
					 */
					_getCodeAll: function (code) {
						$q.all([
							SyCodeSvc.getSubcodeList({ cd: APP_CODE.eqmTp.cd  }),   // 장비유형
							SyCodeSvc.getSubcodeList({ cd: APP_CODE.vendor.cd }),   // 제조사
							SyCodeSvc.getSubcodeList({ cd: APP_CODE.yn.cd })        // 여부
						]).then(function (res) {
							var defaults = { CD: 0, NAME: '선택'};
							res[0].data.unshift(defaults);
							res[1].data.unshift(defaults);

							code.eqmTpList = res[0].data;
							code.vedCList  = res[1].data;
							code.ynList    = res[2].data;
						});
					},

					/**
					 * 장비VO를 가져온다.
					 * @param {{ kind:string, user: object, data:object }} param
					 * @param {boolean} bInsPage insert page 여부
					 * @returns {EqMasterVO|*}
					 */
					getEqmVO: function (param, bInsPage) {
						var data = param.data;
						if (bInsPage) {
							data = {
								NM_INSERT : param.user.NAME,
								NO_INSERT : param.user.CD
							};
						}

						return new EqMasterVO(data);
					},

					/**
					 * 장비서비스 접수 전체 조회
					 * @param {string} eqmId 장비ID
					 * @param {string} perTp 접수정보(1), 완료요청일자(2)
					 * @param {object} period 기간
					 */
					getEqmServList: function (eqmId, perTp, period) {
						var strt = [period.start.y, period.start.m, period.start.d],
							end  = [period.end.y, period.end.m, period.end.d];

						return EqMasterSvc.getEqmServList({
							NO_EQM  : eqmId,
							TP_PER  : perTp,
							STRT_PER: strt.join('-'),
							END_PER : end.join('-')
						});
					},

					/**
					 * insert page인지 판단한다.
					 * @param kind
					 * @returns {boolean}
					 */
					isInsPage: function (kind) {
						return kind==='insert';
					},

					/**
					 * 장비를 등록한다.
					 * @param {object} param 등록데이터
					 * @returns {promise}
					 */
					insert: function (param) {
						return EqMasterSvc.insert(param);
					},

					/**
					 * 장비를 수정한다.
					 * @param {object} param 수정데이터
					 * @returns {promise}
					 */
					update: function (param) {
						return EqMasterSvc.update(param);
					}
				};


				return {
					initLoad  : BizFn.initLoad,
					getEqmVO  : BizFn.getEqmVO,
					getEqmServList: BizFn.getEqmServList,
					isInsPage : BizFn.isInsPage,
					insert    : BizFn.insert,
					update    : BizFn.update
				};
			}
		]);
}());