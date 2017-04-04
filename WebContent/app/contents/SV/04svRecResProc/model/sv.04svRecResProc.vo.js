/**
 * 서비스관리 > 관리 > 접수결과처리 VO
 * Created by js.choi on 2015.08.25
 */
(function ( angular ) {
	'use strict';

	/**
	 * 계획
	 * @constructor
	 */
	function SvRecResProcVO (UtilSvc, $state, SvRecResProcSvc) {

		function SvRecResProc (svRecResProc, option) {
			var self = this;

			self.enableWrite = true;
			self.entity = svRecResProc;

			// 서비스접수번호
			self.NO_SERV_REC = { value: '' };
			// 접수상태코드
			self.CD_STAT_PROC = { value: 1 };
			// 총계획횟수
			self.TOT_PLN_CNT = { value: 0 };
			// 총수행횟수
			self.TOT_PFM_CNT = { value: 0 };
			// 수행율
			self.PFM_RATE = { value: 0 };
			// 접수일시
			self.DTS_SERV = { value: '' };
			// 처리완료요청일시
			self.DTS_PROC_CPLT_REQ = { value: '' };
			// 최초수행일시
			self.DTS_PFM_STRT = { value: '' };
			// 최종수행일시
			self.DTS_PFM_SOL = { value: '' };
			// 최종처리비고
			self.DC_FNT_PROC = { value: '', msg: { empty: '최종처리비고는 필수 입력값입니다.' } };
			// 접수결과처리파일
			self.FINISH_FILE_LIST = {
				data: [],
				CD_AT: 5,
				enableWrite: true,
				onCompleteAll: function (res) {
					alert(res.msg);
					if (res.state) {
						$state.go('app.svRecResProc', { kind: 'list', menu: true, ids: null });
					}  else {
						$state.go('app.svRecResProc', { kind: 'detail', ids: self.NO_SERV_REC.value }, { reload: true });
					}
				}
			};

			if (option) { angular.extend(self, option); }
			if (svRecResProc) { self.setData(svRecResProc); }
		}

		SvRecResProc.prototype = {
			/**
			 * 데이터를 모델에 할당한다.
			 * @param {object} svRecResProc 접수결과처리 데이터
			 */
			setData: function (svRecResProc) {
				if (!svRecResProc) { return; }

				var self = this;
				angular.forEach(svRecResProc, function (value, key) {
					switch (key) {
						case 'FINISH_FILE_LIST':
							self.FINISH_FILE_LIST.data = value;
							break;
						default:
							if (value && self[key]) { self[key].value = value; }
							break;
					}

				});

				self._setEnableWrite();
			},

			/**
			 * 데이터 셋 이후 수정가능여부를 판단하여 모델에 할당한다.
			 * @private
			 */
			_setEnableWrite: function () {
				var self= this;
				if (self.CD_STAT_PROC.value>=3) {// 접수상태(취소,완료)
					self.enableWrite = false;
					self.FINISH_FILE_LIST.enableWrite = false;
				}
			},

			/**
			 * 수정가능여부를 판단한다.
			 * @returns {boolean}
			 */
			isEnableWrite: function () {
				return this.enableWrite;
			},

			/**
			 * 접수결과처리를 위한 parameter를 생성한다.
			 * returns {object}
			 */
			getRestParam: function () {
				var self = this,
					rtnParam = {
						NO_SERV_REC: self.NO_SERV_REC.value,
						CD_STAT_PROC: 4
					};

				if (!self.DC_FNT_PROC.value) {
					alert(self.DC_FNT_PROC.msg.empty);
					return false;
				}
				rtnParam.DC_FNT_PROC = self.DC_FNT_PROC.value;

				return rtnParam;
			},

			/**
			 * 접수결과를 처리한다.
			 * @param {object} data
			 * @returns {promise}
			 */
			save: function (data) {
				return SvRecResProcSvc.save(data);
			}
		};

		return SvRecResProc;
	}

	SvRecResProcVO.$inject = ['UtilSvc', '$state', 'SV.04svRecResProcSvc'];

	angular
		.module('SV.04svRecResProc.model')
		.factory('SvRecResProcVO', SvRecResProcVO);
}( angular ));
