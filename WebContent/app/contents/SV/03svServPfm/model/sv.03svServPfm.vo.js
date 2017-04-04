(function ( angular ) {
	'use strict';

	function SvServPfmVO (ModalSvc,UtilSvc, SvServPfmSvc, $state ) {

		var SvServPfm = function (svServPfm, option) {
			var self = this;

			self.enableWrite = true;
			self.entity = svServPfm || null;

			self.NM_INSERT = { value: '' };
			self.NM_DEPT_INSERT = { value: '' };

			self.NO_SERV_REC = { value: '' };
			self.NO_SERV_PLN = { value: '' };
			self.NO_SERV_PFM = { value: '' };


			self.DC_STAT = { value: '' };
			self.DC_STAT_TAG_DEL = { value: '' };
			self.DC_CUS = { value: '' };
			self.DC_CUS_TAG_DEL = { value: '' };
			self.DC_PROC = { value: '' };
			self.DC_PROC_TAG_DEL = { value: '' };
			self.DC_CTM = { value: '' };
			self.DC_CTM_TAG_DEL = { value: '' };
			self.CD_STAT_PROC = { value: 0 };
			self.CD_PFM = { value:1 };
			self.NM_PFM = { value: '수행중' };
			self.CD_PLN = { value: 0 };
			self.DTS_PLN_STRT = { value: '' };
			self.DTS_PLN_END = { value: '' };
			self.DTS_PFM_STRT = { id: 'dtsPfmStrt', value: '',msg: { empty: '수행 출발 일시는 필수 입력값입니다.' } ,option: {
				onShow: function () {
					var value = self.DTS_PFM_ARV.value,
						parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD HH:mm:ss', true),
						dateOption = { maxDate: false, maxTime: false },
						split;

					if (parseDate) {
						split = parseDate.split(' ');
						dateOption.maxDate = split[0];
					}

					this.setOptions(dateOption);
				}
			}};
			self.DTS_PFM_ARV = { id: 'dtsPfmArv', value: '', msg: { empty: '수행 도착 일시는 필수 입력값입니다.',error:'도착일시는 출발일시 보다 이후 시간을 등록하세요' } ,option: {
				onShow: function () {
					var value = self.DTS_PFM_STRT.value,
						parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD HH:mm:ss', true),
						dateOption = { minDate: false, minTime: false },
						split;

					if (parseDate) {
						split = parseDate.split(' ');
						dateOption.minDate = split[0];
					}

					this.setOptions(dateOption);
				}
			}};
			self.DTS_PFM_CFM = { id: 'dtsPfmCfm', value: '',msg: { empty: '수행 확인 일시는 필수 입력값입니다.',error:'확일일시는 도착일시 보다 이후 시간을 등록하세요' } , option: {
				onShow: function () {
					var value = self.DTS_PFM_ARV.value,
						parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD HH:mm:ss', true),
						dateOption = { minDate: false, minTime: false },
						split;

					if (parseDate) {
						split = parseDate.split(' ');
						dateOption.minDate = split[0];
					}

					this.setOptions(dateOption);
				}
			}};
			self.DTS_PFM_SOL = { id: 'dtsPfmSol', value: '',msg: { empty: '수행 해결 일시는 필수 입력값입니다.',error:'해결일시는 확인일시 보다 이후 시간을 등록하세요' } , option: {
				onShow: function () {
					var value = self.DTS_PFM_CFM.value,
						parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD HH:mm:ss', true),
						dateOption = { minDate: false, minTime: false },
						split;

					if (parseDate) {
						split = parseDate.split(' ');
						dateOption.minDate = split[0];
					}

					this.setOptions(dateOption);
				}
			}};
			self.DTS_TIME_REQ = { value: '' };
			self.CD_PROC_AFT_RPT_WAY = { id:'cdProcAftRptWay', value: 0 ,msg: { empty: '처리 보고 방식은 필수 입력값입니다.' } };
			self.NM_PROC_AFT_RPT_WAY = { value: '' };
			self.DC_HPRC_CASE_1 = { id: 'dcHprcCase1', value: '' };
			self.DC_HPRC_CASE_2 = { id: 'dcHprcCase2', value: '' };
			self.DC_HPRC_CASE_3 = { id: 'dcHprcCase1', value: '' };

			self.PFM_FILE_LIST = {
				data: [],
				CD_AT: 6,
				enableWrite: true,
				showAddfile: true,
				onCompleteAll: function (res) {
					alert(res.msg);
					if (res.state) {
						$state.go('app.svServPfm', { kind: 'list', menu: true, ids: null });
					} else {
						$state.go('app.svServPfm', { kind: 'detail', ids: self.NO_SERV_REC.value , pln: self.NO_SERV_PLN.value ,pfn: self.NO_SERV_PFM.value }, { reload: true });
					}
				}
			};
			self.PFMR_LIST = {
				id:'servPfmEmpModalBtn',
				msg: { empty: '수행 인원은 필수 입력값입니다.' } ,
				data: [],
				compositeData: []};
			self.CHECK_METHOD =  { value: "" };

			if (option) { angular.extend(self, option); }
			if (svServPfm) { self.setData(svServPfm); }
		};

		SvServPfm.prototype = {
			/**
			 * 데이터를 모델에 할당한다.
			 * @param {object} svServPfm 접수데이터
			 */
			setData: function (svServPfm) {
				if (!svServPfm) { return; }

				var self = this;

				angular.forEach(svServPfm, function (value, key) {
					var column = self[key];
					switch(key) {
						case 'PFM_FILE_LIST':
							self.PFM_FILE_LIST.data = value;
							break;
						case 'PFMR_LIST':
							if (svServPfm.NO_SERV_PFM) {
								value.map(function (pfmr) { pfmr.flag = 'U'; });
								self.PFMR_LIST.data = value;
							}

							self.PFMR_LIST.compositeData = angular.copy(value);
							break;
						default:
							if (column && value) { column.value = value; }
							break;
					}
				});
				self._setEnableWrite();

				self.CHECK_METHOD.value = (UtilSvc.isValid(self.NO_SERV_PFM.value)) ? 'UPDATE' :'INSERT';
			},

			_setEnableWrite: function () {
				var self= this;
				if (self.CD_STAT_PROC.value !==2 || self.CD_PLN.value === 4  || self.CD_PFM.value >1) {
					self.enableWrite = false;
					self.PFM_FILE_LIST.enableWrite = false;
				}
			},

			/**
			 * 수정가능여부를 판단한다.
			 * @returns {boolean|*}
			 */
			isEnableWrite: function () {
				return this.enableWrite;
			},


			/**
			 * 처리후 보고 방식이 변경되었을 경우 실행된다.
			 * @param {Array.<object>} codeList   어디서 호출이냐 changeServTp
			 */
			changeProcAftRptWay: function (codeList) {
				var self = this,
					code = UtilSvc.findWhere(codeList, { CD: this.CD_PROC_AFT_RPT_WAY.value })[0];
				self.CD_PROC_AFT_RPT_WAY.value = code.CD;
			},

			/**
			 * 사원 모달 팝업을 연다.
			 */
			modalEmp: function () {

				var self = this,
					modalInstance = ModalSvc.openSearchEmp({
						resolve: {
							resolveParam: function () {
								return { empList: self.PFMR_LIST.compositeData };
							}
						}
					});

				modalInstance.result.then(function (res) {
					angular.forEach(self.PFMR_LIST.data, function (emp) {
						var findList = UtilSvc.findWhere(res, { NO_EMP: emp.NO_EMP });
						if (findList.length===0) { emp.flag = 'D'; }
					});

					self.PFMR_LIST.compositeData = [];
					angular.forEach(res, function (newUser) {
						self.PFMR_LIST.compositeData.push(newUser);
					});

				});
			},

			/**
			 * 유저 태그에서 x버튼 클릭시 제거한다.
			 * @param {object} user
			 * @param {number} idx
			 */
			removeUser: function (user, idx) {
				var self = this,
					findList = UtilSvc.findWhere(self.PFMR_LIST.data, { NO_EMP: user.NO_EMP });

				if (findList.length>0) { findList[0].flag = 'D'; }
				self.PFMR_LIST.compositeData.splice(idx, 1);
			},

			/**
			 * REST 요청을 위한 Parameter를 생성한다.
			 * @returns {object}
			 */
			getRESTParam: function (method) {
				var self = this,
					param = {},
					pfmrList;

				if(method === "INSERT" || method === "UPDATE") {
					self.CD_PFM.value = 1;
				}else if (method === "FINISHINSERT" || method === "FINISHUPDATE"){
					self.CD_PFM.value = 2;
				}

				//수행상태
				param.CD_PFM  = self.CD_PFM.value;
				//수행상태명
				param.NM_PFM  = self.NM_PFM.value;
				//수행후 보고방식명
				param.NM_PROC_AFT_RPT_WAY  = self.NM_PROC_AFT_RPT_WAY.value;
				//대책내용
				param.DC_CTM  = self.DC_CTM.value;
				//원인 내용
				param.DC_CUS  = self.DC_CUS.value;
				//처리내용
				param.DC_PROC  = self.DC_PROC.value;
				//현상내용
				param.DC_STAT  = self.DC_STAT.value;
				//수행 출발일시
				if (!self.DTS_PFM_STRT.value) { return edt.invalidFocus(self.DTS_PFM_STRT.id, self.DTS_PFM_STRT.msg.empty); }
				if (!moment(self.DTS_PFM_STRT.value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) { return edt.invalidFocus(self.DTS_PFM_STRT.id, self.DTS_PFM_STRT.msg.empty); }
				param.DTS_PFM_STRT  = self.DTS_PFM_STRT.value;
				//수행도착일시
				if (!self.DTS_PFM_ARV.value) { return edt.invalidFocus(self.DTS_PFM_ARV.id, self.DTS_PFM_ARV.msg.empty); }
				if (!moment(self.DTS_PFM_ARV.value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) { return edt.invalidFocus(self.DTS_PFM_ARV.id, self.DTS_PFM_ARV.msg.empty); }
				param.DTS_PFM_ARV  = self.DTS_PFM_ARV.value;
				//수행확인일시
				if (!self.DTS_PFM_CFM.value) { return edt.invalidFocus(self.DTS_PFM_CFM.id, self.DTS_PFM_CFM.msg.empty); }
				if (!moment(self.DTS_PFM_CFM.value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) { return edt.invalidFocus(self.DTS_PFM_CFM.id, self.DTS_PFM_CFM.msg.empty); }
				param.DTS_PFM_CFM  = self.DTS_PFM_CFM.value;
				//수행 해결일시
				if (!self.DTS_PFM_SOL.value) { return edt.invalidFocus(self.DTS_PFM_SOL.id, self.DTS_PFM_SOL.msg.empty); }
				if (!moment(self.DTS_PFM_SOL.value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) { return edt.invalidFocus(self.DTS_PFM_SOL.id, self.DTS_PFM_SOL.msg.empty); }
				param.DTS_PFM_SOL  = self.DTS_PFM_SOL.value;


				// 수행 출발 일시와 수행 도착 일시 비교
				if (self.DTS_PFM_STRT.value) {
					if (new Date(param.DTS_PFM_ARV) - new Date(param.DTS_PFM_STRT) < 0) {
						return edt.invalidFocus(self.DTS_PFM_ARV.id, self.DTS_PFM_ARV.msg.error);
					}
				}

				// 수행 도착 일시와 수행 확일 일시 비교
				if (self.DTS_PFM_CFM.value) {
					if (new Date(param.DTS_PFM_CFM) - new Date(param.DTS_PFM_ARV) < 0) {
						return edt.invalidFocus(self.DTS_PFM_CFM.id, self.DTS_PFM_CFM.msg.error);
					}
				}

				// 수행 확인 일시와 수행 해결일시 비교
				if (self.DTS_PFM_CFM.value) {
					if (new Date(param.DTS_PFM_SOL) - new Date(param.DTS_PFM_CFM) < 0) {
						return edt.invalidFocus(self.DTS_PFM_SOL.id, self.DTS_PFM_SOL.msg.error);
					}
				}

				//수행후 보고방식
				if (!self.CD_PROC_AFT_RPT_WAY.value) { return edt.invalidFocus(self.CD_PROC_AFT_RPT_WAY.id, self.CD_PROC_AFT_RPT_WAY.msg.empty); }
				param.CD_PROC_AFT_RPT_WAY  = self.CD_PROC_AFT_RPT_WAY.value;

				// HPRC CASE
				if ( self.DC_HPRC_CASE_1.value ) { param.DC_HPRC_CASE_1 = self.DC_HPRC_CASE_1.value; }
				if ( self.DC_HPRC_CASE_2.value ) { param.DC_HPRC_CASE_2 = self.DC_HPRC_CASE_2.value; }
				if ( self.DC_HPRC_CASE_3.value ) { param.DC_HPRC_CASE_3 = self.DC_HPRC_CASE_3.value; }


				//계획번호
				param.NO_SERV_PFM  = self.NO_SERV_PFM.value;
				//수행번호
				param.NO_SERV_PLN  = self.NO_SERV_PLN.value;
				//접수번호
				param.NO_SERV_REC  = self.NO_SERV_REC.value;

				if (self.PFMR_LIST.compositeData.length === 0) { return edt.invalidFocus(self.PFMR_LIST.id, self.PFMR_LIST.msg.empty); }
				pfmrList = self.PFMR_LIST.compositeData.concat(UtilSvc.findWhere(self.PFMR_LIST.data, {flag:'D'}));
				param.PFMR_LIST = [];
				angular.forEach(pfmrList, function (pfmr) {
					param.PFMR_LIST.push({
						flag: pfmr.flag || 'I',
						NO_EMP: pfmr.NO_EMP
					});
				});

				return param;
			},

			/**
			 * method에 따라 접수 등록, 수정, 취소를 처리한다.
			 * @param method
			 * @param data
			 * @returns {promise}
			 */
			restProc: function (method, data) {
				var self = this;
				switch (method) {
					case 'INSERT':
					case 'FINISHINSERT':
						return self._insert(data);
					case 'UPDATE':
					case 'FINISHUPDATE':
						return self._update(data);
				}
			},

			pfmrDupCheckProc:function (data){
				return SvServPfmSvc.pfmrDupCheck(data);
			},

			/**
			 * 수행결과 반려가 가능한지 판단한다.
			 * @returns {boolean}
			 */
			enableCancel: function () {
				return this.CD_STAT_PROC.value===2 && this.CD_PFM.value === 2;
			},

			/**
			 * 수행결과를 반려한다.
			 */
			cancelPfm: function () {
				var self = this;
				SvServPfmSvc.cancel({
					NO_SERV_REC: self.NO_SERV_REC.value,
					NO_SERV_PLN: self.NO_SERV_PLN.value,
					NO_SERV_PFM: self.NO_SERV_PFM.value
				}).then(function (res) {
					alert('취소처리되었습니다.');
					self.CD_PFM.value = 1;
					self.NM_PFM.value = '수행중';
				});
			},

			/**
			 * 서비스 접수 등록
			 * @param data
			 * @returns {*|Object|{confirm, success, error}|promise|{title, items}}
			 * @private
			 */
			_insert: function (data) {
				return SvServPfmSvc.insert(data);
			},

			/**
			 * 서비스 접수 수정
			 * @returns {*|Object|promise|{confirm, success, error}}
			 * @private
			 */
			_update: function (data) {
				return SvServPfmSvc.update(data);
			}
		};

		return SvServPfm;
	}

	SvServPfmVO.$inject = ['ModalSvc','UtilSvc', 'SV.03svServPfmSvc','$state'];

	angular
		.module('SV.03svServPfm.model')
		.factory('SvServPfmVO', SvServPfmVO);




}( angular ));
