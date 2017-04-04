(function ( angular ) {
	'use strict';

	function SvServRecVO (ModalSvc, UtilSvc, SvServRecSvc, EqMasterVO, $state, $modal, $timeout) {

		var SvServRec = function (svServRec, option) {
			var self = this;

			self.enableWrite = true;    // 수정가능여부

			// 서비스접수번호
			self.NO_SERV_REC = { value: '' };
			// 관리고객사 코드
			self.NO_MNG_CUST = { id: 'noMngCust',  value: 0, required: true,  msg: { empty: '관리고객사는 필수 입력값입니다.' } };
			// 관리고객사 이름
			self.NM_MNG_CUST = { value: '' };
			// 영업대표 ID
			self.CUST_NO_EMP = { value: '' };
			// 영업대표 이름
			self.CUST_NM_EMP = { value: '' };
			// 영업대표 부서 이름
			self.CUST_NM_DEPT_EMP = { value: '' };
			// 처리상태 코드
			self.CD_STAT_PROC = { value: 1 };
			// 처리상태 이름
			self.NM_STAT_PROC = { value: '접수' };
			// 서비스고객사 코드
			self.NO_SERV_CUST = { id: 'noServCust',  value: 0, required: true,  msg: { empty: '서비스고객사는 필수 입력값입니다.' } };
			// 서비스고객사 이름
			self.NM_SERV_CUST = { value: '' };
			// 서비스고객사 담당자 코드
			self.NO_IN_CHARGE = { id: 'noInCharge', value: 0, required: true, msg: { empty: '고객사담당자는 필수 입력값입니다.' } };
			// 서비스고객사 담당자 이름
			self.NM_IN_CHARGE = { value: '' };
			// 서비스고객사 담당자 연락처
			self.CHARGE_NO_MOBILE = { value: '' };
			// 서비스고객사 담당자 이메일
			self.CHARGE_NO_EMAIL = { value: '' };
			// 요청자
			self.NM_REQR = { id: 'nmReqr', value: '',
				required: true,
				maxlength: 30,
				msg: { empty: '요청자명은 필수 입력값입니다.', error: '30자리 이내로 입력 가능합니다.' },
				placeholder: '30자리 이내로 입력해주세요.'
			};
			// 긴급여부
			self.YN_EMG = { value: 'N' };
			// 접수방법 코드
			self.CD_REC_WAY = { id: 'cdRecWay', value: 0, required: true, msg: { empty: '접수방법은 필수 선택값입니다.' } };
			// 접수방법 이름
			self.NM_REC_WAY = { value: '' };
			// 서비스유형 코드
			self.CD_SERV_TP = { id: 'cdServTp', value: 0, required: true, msg: { empty: '서비스유형은 필수 선택값입니다.' } };
			// 서비스유형 이름
			self.NM_SERV_TP = { value: '' };
			// 서비스유형 DC_RMK1
			self.SERV_TP_DC_RMK1 = { value: '1' };
			// 접수일시
			self.DTS_SERV = { id: 'dtsServ', value: '',
				option: {
					onShow: function () {
						var value = self.DTS_PROC_CPLT_REQ.value,
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
				msg: { empty: '접수일시는 필수 입력값입니다.', error: '유효한 날짜 포멧이 아닙니다.' }
			};
			// 처리완료요청일시
			self.DTS_PROC_CPLT_REQ = { id: 'dtsProcCpltReq', value: '',
				option: {
					onShow: function () {
						var value = self.DTS_SERV.value,
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
				msg: { error: '유효한 날짜 포멧이 아닙니다.' }
			};
			// 접수자 아이디
			self.NO_RECR = { value: '' };
			// 접수자 이름
			self.NM_RECR = { value: '' };
			// 접수자 부서 이름
			self.NM_DEPT_RECR = { value: '' };
			// 접수자 내선번호
			self.RECR_NO_PHONE_IN = { value: '' };
			// 접수내용
			self.DC_REC = { id: '', value: '', required: true, msg: { empty: '접수내용은 필수 입력값입니다.' } };
			// 접수내용 태그삭제
			self.DC_REC_TAG_DEL = { value: '' };
			// 접수취소내용
			self.DC_REC_CCL = { id: 'dcRecCcl', value: '', msg: { empty: '접수취소내용은 필수 입력값입니다.' } };
			// 접수취소내용 태그삭제
			self.DC_REC_CCL_TAG_DEL = { value: '' };
			// 최종처리내용
			self.DC_FNT_PROC = { id: '', value: '', msg: { empty: '최종처리내용은 필수 입력값입니다.' } };
			// 최종처리내용 태그삭제
			self.DC_FNT_PROC_TAG_DEL = { value: '' };


			// 장애심각도 코드
			self.CD_OBS_SRON = { id: 'cdObsSron', value: 0 };
			// 장애심각도 이름
			self.NM_OBS_SRON = { value: '' };
			// 장애심각도 상세
			self.OBS_SRON_DC_RMK1 = { value: '' };
			// 장애구분 코드
			self.CD_OBS_SEP = { id: 'cdObsSep', value: 0 };
			// 장애구분 이름
			self.NM_OBS_SEP = { value: '' };


			// 설치장소
			self.DC_INS_PLA = { id: 'dcInsPla', value: '',
				maxlength: 60,
				msg: { empty: '설치장소는 필수 입력값입니다.', error: '60자리 이내로 입력 가능합니다.' },
				placeholder: '60자리 이내로 입력해주세요.'
			};
			// 장비도입형태 코드
			self.CD_EQM_ITD_FRM = { id: 'cdEqmItdFrm', value: 1, msg: { empty: '장비도입형태는 필수 선택값입니다.' } };
			// 장비도입형태 이름
			self.NM_EQM_ITD_FRM = { value: '' };


			// 프로젝트명
			self.NM_PJT = { id: 'nmPjt', value: '',
				maxlength: 60,
				msg: { empty: '프로젝트명은 필수 입력값입니다.', error: '60자리 이내로 입력가능합니다.' },
				placeholder: '60자리 이내로 입력가능합니다.'
			};
			// 프로젝트목적
			self.DC_PJT_PPO = { id: 'dcPjtPpo', value: '',
				maxlength: 60,
				msg: { empty: '프로젝트목적은 필수 입력값입니다.', error: '60자리 이내로 입력가능합니다.' },
				placeholder: '60자리 이내로 입력가능합니다.'
			};
			// 프로젝트수행기간 시작
			self.DT_PJT_PFM_STRT = { id: 'dtPjtPfmStrt', value: '',
				option: {
					format: 'Y-m-d',
					timepicker: false,
					onShow: function () {
						var value = self.DT_PJT_PFM_END.value,
							parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD', true),
							dateOption = { minDate: false, minTime: false };

						dateOption.maxDate = parseDate;
						this.setOptions(dateOption);
					}
				},
				msg: { empty: '프로젝트 수행기간은 필수 입력값입니다.', error: '유효한 날짜 형식이 아닙니다.' }
			};
			// 프로젝트수행기간 종료
			self.DT_PJT_PFM_END = { id: 'dtPjtPfmEnd', value: '',
				option: {
					format: 'Y-m-d',
					timepicker: false,
					onShow: function () {
						var value = self.DT_PJT_PFM_STRT.value,
							parseDate = UtilSvc.date.parseDateFormat(value, 'YYYY/MM/DD', true),
							dateOption = { minDate: false, minTime: false };

						dateOption.minDate = parseDate;
						this.setOptions(dateOption);
					}
				},
				msg: { empty: '프로젝트 수행기간은 필수 입력값입니다.', error: '유효한 날짜 형식이 아닙니다.' }
			};

			// 신규장비 리스트
			self.NEW_EQM_LIST = {
				compositeData: [],
				addRow: function () {
					this.compositeData.push(new EqMasterVO());
				},
				deleteRow: function (idx) {
					this.compositeData.splice(idx, 1);
				}
			};
			// 장비 리스트
			self.EQM_LIST = {
				data: [],
				compositeData: [],
				deleteRow: function (delEqm, idx) {
					var mine = this;
					angular.forEach(mine.data, function (eqm) {
						if (eqm.NO_EQM.value === delEqm.NO_EQM.value) {
							eqm.YN_DEL.value = 'Y';
						}
					});
					mine.compositeData.splice(idx, 1);
				}
			};
			// 접수파일 리스트(REC_FILE_LIST)
			self.recFile = {
				data: [],
				CD_AT: 3,
				enableWrite: true,
				onCompleteAll: function (res) {
					alert(res.msg);
					if (res.state) {
						$state.go('app.svServRec', { kind: 'list', menu: true, ids: null });
					}  else {
						$state.go('app.svServRec', { kind: 'detail', ids: self.NO_SERV_REC.value }, { reload: true });
					}
				}
			};
			// 접수취소파일 리스트(CCL_FILE_LIST)
			self.cclFile = {
				data: [],
				CD_AT: 4,
				enableWrite: true,
				showRecFile: false,
				showAddfile: true,
				onCompleteAll: function (res) {
					alert(res.msg);
					$state.go('app.svServRec', { kind: 'list', menu: true, ids: null });
				}
			};
			// 최종처리파일 리스트(FINISH_FILE_LIST)
			self.finishFile = {
				data: [],
				CD_AT: 5,
				enableWrite: true,
				onCompleteAll: function (res) {
					alert(res.msg);
					$state.go('app.svServRec', { kind: 'list', menu: true, ids: null });
				}
			};

			if (option) { angular.extend(self, option); }
			if (svServRec) { self.setData(svServRec, self.enableWrite); }
		};

		SvServRec.prototype = {
			/**
			 * (모달)고객사를 검색한다.
			 */
			modalCustCmp: function (kind) {
				var self = this,
					modalInstance = ModalSvc.openSearchCustCmp();

				switch (kind) {
					case 'MNG':
						modalInstance.result.then(function (res) {
							self.NO_MNG_CUST.value = res.code;
							self.NM_MNG_CUST.value = res.name;
							self.CUST_NM_EMP.value = res.sales_emp_name;
							self.CUST_NM_DEPT_EMP.value = res.sales_dept_name;
						});
						break;
					case 'SERV':
						modalInstance.result.then(function (res) {
							if (res.code !== self.NO_SERV_CUST.value) {
								self.NO_SERV_CUST.value = res.code;
								self.NM_SERV_CUST.value = res.name;
								self.NO_IN_CHARGE.value = '';
								self.NM_IN_CHARGE.value = '';
								self.CHARGE_NO_MOBILE.value = '';
								self.CHARGE_NO_EMAIL.value = '';
							}
						});
						break;
				}
			},
			/**
			 * 고객사 담당자를 검색한다.
			 */
			modalCustCharge: function () {
				var self = this,
					modalInstance;

				if (!self.NO_SERV_CUST.value) {
					return edt.invalidFocus(self.NO_SERV_CUST.id, '서비스고객사를 선택 후 검색해주세요.');
				}

				modalInstance = ModalSvc.openSearchCulnCharge({
					resolve: {
						no_cust: function () { return { VALUE: self.NO_SERV_CUST.value, NAME: self.NM_SERV_CUST.value }; },
						disabled_no_cust : function () { return true; }
					}
				});

				modalInstance.result.then(function (res) {
					self.NO_IN_CHARGE.value = res.code;
					self.NM_IN_CHARGE.value = res.name;
					self.CHARGE_NO_MOBILE.value = res.no_mobile;
					self.CHARGE_NO_EMAIL.value = res.no_email;
				});
			},

			/**
			 * 기존장비등록 모달 팝업을 연다.
			 */
			modalEqm: function () {
				var self = this,
					modalInstance = ModalSvc.openSearchEqm({
					resolve: {
						resolveParam: function () {
							return { equipmentList: self.EQM_LIST.compositeData };
						}
					}
				});

				modalInstance.result.then(function (res) {
					angular.forEach(self.EQM_LIST.data, function (eqm) {
						var state = false;

						angular.forEach(res, function (newEqm) {
							if (eqm.NO_EQM.value === newEqm.NO_EQM) {
								state = true;
								eqm.YN_DEL.value = 'N';
							}
						});
						if (!state) {
							eqm.YN_DEL.value = 'Y';
						}
					});

					self.EQM_LIST.compositeData = [];
					angular.forEach(res, function (newEqm) {
						self.EQM_LIST.compositeData.push(new EqMasterVO(newEqm));
					});

				});
			},

			/**
			 * 접수 취소 모달팝업을 연다.
			 */
			modalServRecCancel: function () {
				var self = this;
				$modal.open({
					templateUrl: 'svServRecCancel/template',
					size: 'lg',
					controller: 'SvServRecCancelCtrl',
					resolve: {
						svServRec: function () {
							return self;
						}
					}
				});
			},

			/**
			 * 데이터를 모델에 할당한다.
			 * @param {object} svServRec 접수데이터
			 * @param {boolean=} enableWrite
			 */
			setData: function (svServRec, enableWrite) {
				var self = this;

				if (!svServRec) { return; }

				if (svServRec.CD_STAT_PROC>1) { self.enableWrite = false; }
				else { self.enableWrite = enableWrite===undefined ? true : enableWrite; }

				angular.forEach(svServRec, function (value, key) {
					var o = self[key];
					switch (key) {
						case 'EQM_LIST':
							self.EQM_LIST.data = [];
							angular.forEach(value, function (eqm) {
								var eqmvo = new EqMasterVO(eqm);
								self.EQM_LIST.data.push(eqmvo);
								self.EQM_LIST.compositeData.push(eqmvo);
							});
							break;
						case 'REC_FILE_LIST':
							self.recFile.enableWrite = self.enableWrite;
							self.recFile.data = value;
							break;
						case 'CCL_FILE_LIST':
							self.cclFile.enableWrite = self.enableWrite;
							self.cclFile.data = value;
							break;
						case 'FINISH_FILE_LIST':
							self.finishFile.enableWrite = self.enableWrite;
							self.finishFile.data = value;
							break;
						default:
							if (o) { o.value = value; }
							break;
					}
				});

				if (self.CD_STAT_PROC.value > 2) {
					self.recFile.enableAction = false;
					self.cclFile.enableAction = false;
					self.finishFile.enableAction = false;
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
			 * 서비스 유형이 설치인지 판단한다.
			 * @returns {boolean}
			 */
			isServTpInstall: function () {
				return this.SERV_TP_DC_RMK1.value === '2';
			},

			/**
			 * 서비스 유형이 프로젝트인지 판단한다.
			 * @returns {boolean}
			 */
			isServTpProject: function () {
				return this.SERV_TP_DC_RMK1.value === '3';
			},

			/**
			 * 처리상태가 취소인지 판단한다.
			 * @returns {boolean}
			 */
			isStatProcCancel: function () {
				return this.CD_STAT_PROC.value === 3;
			},

			/**
			 * 처리상태가 완료인지 판단한다.
			 * @returns {boolean}
			 */
			isStatProcCompleted: function () {
				return this.CD_STAT_PROC.value === 4;
			},

			/**
			 * 접수방법이 변경되었을 경우 실행된다.
			 * @param {Array.<object>} codeList
			 */
			changeRecWay: function (codeList) {
				var self = this,
					codeInfo = UtilSvc.findWhere(codeList, { CD: this.CD_REC_WAY.value })[0];

				self.NM_REC_WAY.value = codeInfo.NAME;
			},

			/**
			 * 접수방법이 변경되었을 경우 실행된다.
			 * @param {Array.<object>} codeList
			 */
			changeServTp: function (codeList) {
				var self = this,
					codeInfo = UtilSvc.findWhere(codeList, { CD: this.CD_SERV_TP.value })[0];

				self.NM_SERV_TP.value = codeInfo.NAME;
				self.SERV_TP_DC_RMK1.value = codeInfo.DC_RMK1;
			},

			/**
			 * 장애심각도가 변경되었을 경우 실행된다.
			 * @param {Array.<object>} codeList
			 */
			changeObsSron: function (codeList) {
				var self = this,
					codeInfo = UtilSvc.findWhere(codeList, { CD: this.CD_OBS_SRON.value })[0];

				self.NM_OBS_SRON.value = codeInfo.NAME;
				self.OBS_SRON_DC_RMK1.value = codeInfo.DC_RMK1;
			},

			/**
			 * REST 요청을 위한 Parameter를 생성한다.
			 * @returns {object}
			 */
			getRESTParam: function (method) {
				var self = this,
					param = {},
					eqmValidState = true,
					eqmList;

				param.NO_SERV_REC = self.NO_SERV_REC.value; // 접수번호

				if (method === 'CANCEL') {
					param.CD_STAT_PROC = 3;
					param.DC_REC_CCL = self.DC_REC_CCL.value;
					return param;
				}

				// 처리상태코드
				param.CD_STAT_PROC = self.CD_STAT_PROC.value;

				// 관리고객사코드
				if (!self.NO_MNG_CUST.value) { return edt.invalidFocus(self.NO_MNG_CUST.id, self.NO_MNG_CUST.msg.empty); }
				param.NO_MNG_CUST = self.NO_MNG_CUST.value;

				// 서비스고객사코드
				if (!self.NO_SERV_CUST.value) { return edt.invalidFocus(self.NO_SERV_CUST.id, self.NO_SERV_CUST.msg.empty); }
				param.NO_SERV_CUST = self.NO_SERV_CUST.value;

				// 서비스담당자코드
				if (!self.NO_IN_CHARGE.value) { return edt.invalidFocus(self.NO_IN_CHARGE.id, self.NO_IN_CHARGE.msg.empty); }
				param.NO_IN_CHARGE = self.NO_IN_CHARGE.value;

				// 요청자
				if (!self.NM_REQR.value) { return edt.invalidFocus(self.NM_REQR.id, self.NM_REQR.msg.empty); }
				param.NM_REQR = self.NM_REQR.value;

				// 접수방법코드
				if (!self.CD_REC_WAY.value) { return edt.invalidFocus(self.CD_REC_WAY.id, self.CD_REC_WAY.msg.empty); }
				param.CD_REC_WAY = self.CD_REC_WAY.value;

				// 서비스유형
				if (!self.CD_SERV_TP.value) { return edt.invalidFocus(self.CD_SERV_TP.id, self.CD_SERV_TP.msg.empty); }
				param.CD_SERV_TP = self.CD_SERV_TP.value;

				// 접수일시
				if (!self.DTS_SERV.value) { return edt.invalidFocus(self.DTS_SERV.id, self.DTS_SERV.msg.empty); }
				if (!moment(self.DTS_SERV.value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) { return edt.invalidFocus(self.DTS_SERV.id, self.DTS_SERV.msg.error); }
				param.DTS_SERV = self.DTS_SERV.value;

				// 처리완료요청일시
				if ( self.DTS_PROC_CPLT_REQ.value ) {
					if ( !moment(self.DTS_PROC_CPLT_REQ.value, 'YYYY-MM-DD HH:mm:ss', true).isValid() ) {
						return edt.invalidFocus(self.DTS_PROC_CPLT_REQ.id, self.DTS_PROC_CPLT_REQ.msg.error);
					} else {
						param.DTS_PROC_CPLT_REQ = self.DTS_PROC_CPLT_REQ.value;
					}
				}

				// 접수일와 처리완료 요청일시 비교
				if (self.DTS_PROC_CPLT_REQ.value) {
					if (new Date(param.DTS_PROC_CPLT_REQ) - new Date(param.DTS_SERV) < 0) {
						return edt.invalidFocus(self.DTS_PROC_CPLT_REQ.id, self.DTS_PROC_CPLT_REQ.msg.error);
					}
				}

				// 접수내용
				if (!self.DC_REC.value) { alert(self.DC_REC.msg.empty); return false; }
				param.DC_REC = self.DC_REC.value;

				param.CD_OBS_SRON = self.CD_OBS_SRON.value; // 장애심각도
				param.CD_OBS_SEP = self.CD_OBS_SEP.value;   // 장애구분

				if (self.isServTpInstall()) {// 설치
					// 설치장소
					if (!self.DC_INS_PLA.value) { return edt.invalidFocus(self.DC_INS_PLA.id, self.DC_INS_PLA.msg.empty); }
					param.DC_INS_PLA = self.DC_INS_PLA.value;

					// 장비도입형태
					if (!self.CD_EQM_ITD_FRM.value) { return edt.invalidFocus(self.CD_EQM_ITD_FRM.id, self.CD_EQM_ITD_FRM.msg.empty); }
					param.CD_EQM_ITD_FRM = self.CD_EQM_ITD_FRM.value;
				}

				if (self.isServTpProject()) {// 프로젝트
					// 프로젝트명
					if (!self.NM_PJT.value) { return edt.invalidFocus(self.NM_PJT.id, self.NM_PJT.msg.empty); }
					param.NM_PJT = self.NM_PJT.value;

					// 프로젝트목적
					if (!self.DC_PJT_PPO.value) { return edt.invalidFocus(self.DC_PJT_PPO.id, self.DC_PJT_PPO.msg.empty); }
					param.DC_PJT_PPO = self.DC_PJT_PPO.value;

					// 프로젝트 수행기간 시작
					if (!self.DT_PJT_PFM_STRT.value) { return edt.invalidFocus(self.DT_PJT_PFM_STRT.id, self.DT_PJT_PFM_STRT.msg.empty); }
					if (!moment(self.DT_PJT_PFM_STRT.value, 'YYYY-MM-DD', true).isValid()) { return edt.invalidFocus(self.DT_PJT_PFM_STRT.id, self.DT_PJT_PFM_STRT.msg.error); }
					param.DT_PJT_PFM_STRT = self.DT_PJT_PFM_STRT.value;

					// 프로젝트 수행기간 종료
					if (!self.DT_PJT_PFM_END.value) { return edt.invalidFocus(self.DT_PJT_PFM_END.id, self.DT_PJT_PFM_END.msg.empty); }
					if (!moment(self.DT_PJT_PFM_END.value, 'YYYY-MM-DD', true).isValid()) { return edt.invalidFocus(self.DT_PJT_PFM_END.id, self.DT_PJT_PFM_END.msg.error); }
					param.DT_PJT_PFM_END = self.DT_PJT_PFM_END.value;

					// 프로젝트 수행기간 비교
					if (new Date(param.DT_PJT_PFM_END) - new Date(param.DT_PJT_PFM_STRT) < 0) {
						return edt.invalidFocus(self.DT_PJT_PFM_STRT.id, self.DT_PJT_PFM_STRT.msg.error);
					}
				}

				eqmList = self.EQM_LIST.data.filter(function (eqm) { return eqm.YN_DEL.value === 'Y'; }).concat(self.EQM_LIST.compositeData);
				if (eqmList.length>0 || self.NEW_EQM_LIST.compositeData.length>0) {


					param.EQM_LIST = [];
					angular.forEach(eqmList.concat(self.NEW_EQM_LIST.compositeData), function (eqm, idx) {
						if (!eqm.NM_EQM.value || !eqm.CD_EQM_TP.value || !eqm.CD_VED_C.value) {
							eqmValidState = false;
						}

						param.EQM_LIST.push({
							NO_EQM: eqm.NO_EQM.value,
							NM_EQM: eqm.NM_EQM.value,
							NM_EQM_ID: eqm.NM_EQM_ID.value,
							DC_SRN: eqm.DC_SRN.value,
							DC_EQM_POS: eqm.DC_EQM_POS.value,
							CD_EQM_TP: eqm.CD_EQM_TP.value,
							CD_VED_C: eqm.CD_VED_C.value,
							DC_IPA: eqm.DC_IPA.value,
							CD_BACK_CTR_YN: eqm.CD_BACK_CTR_YN.value,
							YN_DEL: eqm.YN_DEL.value
						});
					});

					if (!eqmValidState) { alert('장비명, 장비유형, 제조사는 필수 입력 및 선택값입니다.'); return false; }
				}

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
					case 'INSERT': return self._insert(data);
					case 'UPDATE': return self._update(data);
				}
			},

			/**
			 * 서비스 접수 등록
			 * @param data
			 * @returns {*|Object|{confirm, success, error}|promise|{title, items}}
			 * @private
			 */
			_insert: function (data) {
				return SvServRecSvc.insert(data);
			},

			/**
			 * 서비스 접수 수정
			 * @returns {*|Object|promise|{confirm, success, error}}
			 * @private
			 */
			_update: function (data) {
				return SvServRecSvc.update(data);
			}

		};

		return SvServRec;
	}

	angular
		.module('SV.01svServRec.model')
		.factory('SvServRecVO', SvServRecVO);

	SvServRecVO.$inject = ['ModalSvc', 'UtilSvc', 'SV.01svServRecSvc', 'EQ.01eqMasterVO', '$state', '$modal', '$timeout'];

}( angular ));
