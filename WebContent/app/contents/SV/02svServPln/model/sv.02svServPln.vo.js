/**
 * 서비스관리 > 수행 > 계획일정등록 VO
 * Created by js.choi on 2015.08.19
 */
(function ( angular ) {
	'use strict';

	/**
	 * 계획
	 * @constructor
	 */
	function SvServPlnVO (UtilSvc, ModalSvc) {

		function SvServPln (svServPln, option) {
			var self = this;

			self.enableWrite = true;
			self.expanded = true;
			self.icon = {
				expanded: 'fa fa-minus-square-o fa-lg',
				collapsed: 'fa fa-plus-square-o fa-lg'
			};
			self.entity = svServPln || null;

			self.flag = 'I';
			self.NO_SERV_REC = { value: '' };
			self.NO_SERV_PLN = { value: '' };
			self.NO_SERV_PFM = { value: '' };
			self.DTS_PLN_STRT = { id: 'dtsPlnStrt', value: '',
				option: {
					onShow: function () {
						var value = self.DTS_PLN_END.value,
							parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD HH:mm:ss', true),
							dateOption = { maxDate: false, maxTime: false },
							split;

						if (parseDate) {
							split = parseDate.split(' ');
							dateOption.maxDate = split[0];
						}

						this.setOptions(dateOption);
					}
				},
				msg: { empty: '계획시작일시는 필수 입력값입니다.', error: '유효한 날짜 포멧이 아닙니다.' }
			};
			self.DTS_PLN_END = { id: 'dtsPlnEnd', value: '',
				option: {
					onShow: function () {
						var value = self.DTS_PLN_STRT.value,
							parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD HH:mm:ss', true),
							dateOption = { minDate: false, minTime: false },
							split;

						if (parseDate) {
							split = parseDate.split(' ');
							dateOption.minDate = split[0];
						}

						this.setOptions(dateOption);
					}
				},
				msg: { empty: '계획종료일시는 필수 입력값입니다.', error: '유효한 날짜 포멧이 아닙니다.' }
			};
			self.CD_PLN = { value: 1 };
			self.NM_PLN = { value: '계획' };
			self.CD_PFM = { value: 0 };
			self.NM_PFM = { value: '미수행' };
			self.DC_PLN = { value: '' };
			self.PLNR_LIST = {
				data: [],
				compositeData: []
			};

			if (option) { angular.extend(self, option); }
			if (svServPln) { self.setData(svServPln); }
		}

		SvServPln.prototype = {
			/**
			 * 데이터를 모델에 할당한다.
			 * @param {object} svServPln 계획데이터
			 * @param {boolean=} enableWrite
			 */
			setData: function (svServPln, enableWrite) {
				if (!svServPln) { return; }

				var self = this;
				angular.forEach(svServPln, function (value, key) {
					var column = self[key];
					switch(key) {
						case 'PLNR_LIST':
							value.map(function (plnr) { plnr.flag = 'U'; });
							self.PLNR_LIST.data = value;
							self.PLNR_LIST.compositeData = angular.copy(value);
							break;
						default:
							if (column && value) { column.value = value; }
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
				if (self.CD_PLN.value===4 || self.CD_PFM.value>=1 ) {
					self.enableWrite = false;
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
			 * 계획인원 모달팝업을 연다.
			 */
			modalPlnUser: function () {
				var self = this,
					modalInstance = ModalSvc.openSearchEmp({
						resolve: {
							resolveParam: function () {
								return { empList: self.PLNR_LIST.compositeData };
							}
						}
					});

				modalInstance.result.then(function (res) {
					angular.forEach(self.PLNR_LIST.data, function (emp) {
						var findList = UtilSvc.findWhere(res, { NO_EMP: emp.NO_EMP });
						if (findList.length===0) { emp.flag = 'D'; }
					});

					self.PLNR_LIST.compositeData = [];
					angular.forEach(res, function (newUser) {
						self.PLNR_LIST.compositeData.push(newUser);
					});

				});
			},

			/**
			 * 계획된 유저를 삭제한다.
			 * @param {object} user
			 * @param {number} idx
			 */
			removeUser: function (user, idx) {
				var self = this,
					findList = UtilSvc.findWhere(self.PLNR_LIST.data, { NO_EMP: user.NO_EMP });

				if (findList.length>0) { findList[0].flag = 'D'; }
				self.PLNR_LIST.compositeData.splice(idx, 1);
			},

			toggleExpand: function (pln) {
				pln.expanded = !pln.expanded;
			}
		};

		return SvServPln;
	}

	SvServPlnVO.$inject = ['UtilSvc', 'ModalSvc'];

	angular
		.module('SV.02svServPln.model')
		.factory('SvServPlnVO', SvServPlnVO);
}( angular ));
