(function () {
	'use strict';

	angular
		.module('EQ.01eqMaster.controller')
		.factory('EQ.01eqMasterVO', EqMasterVO);


	EqMasterVO.$inject = ['CreatorVO', 'ModalSvc'];

	function EqMasterVO(CreatorVO, ModalSvc) {

		/**
		 * 장비 Model
		 * @constructor
		 */
		function EqMaster (data) {
			var self = this;

			self.entity = data || null;

			// 장비번호
			self.NO_EQM = new CreatorVO({
				value: ''
			});
			// 장비명
			self.NM_EQM = new CreatorVO({
				id : 'nmEqm',
				value: '',
				required : true,
				maxlength: 60,
				msg: { empty: '장비명은 필수 입력입니다.', error: '60자리 이내로 입력 가능합니다.' },
				placeholder: '60자리 이내로 입력해주세요.'
			});
			// 장비ID
			self.NM_EQM_ID = new CreatorVO({
				id : 'nmEqmId',
				value: '',
				maxlength: 60,
				msg: { empty: '', error: '' },
				placeholder: '60자리 이내로 입력해주세요.'
			});
			// SERIAL NUMBER
			self.DC_SRN = new CreatorVO({
				id : 'dcSrn',
				value: '',
				maxlength: 60,
				msg: { empty: '', error: '' },
				placeholder: '60자리 이내로 입력해주세요.'
			});
			// 모델명
			self.NM_MODEL = new CreatorVO({
				id : 'nmModel',
				value: '',
				maxlength: 240,
				msg: { empty: '', error: '' },
				placeholder: '240자리 이내로 입력해주세요.'
			});
			// 장비위치
			self.DC_EQM_POS = new CreatorVO({
				id : 'dcEqmPos',
				value: '',
				maxlength: 240,
				msg: { empty: '', error: '' },
				placeholder: '240자리 이내로 입력해주세요.'
			});
			// IP ADDRESS
			self.DC_IPA = new CreatorVO({
				id : 'dcIpa',
				value: '',
				maxlength: 60,
				msg: { empty: '', error: '' },
				placeholder: '60자리 이내로 입력해주세요.'
			});
			// 확정여부 코드(1:확정, 2:미확정 )
			self.CD_DTM_YN = new CreatorVO({
				id : 'cdDtnYn',
				type: 'number',
				value: 2,
				msg: { empty: '', error: '' }
			});
			// 확정여부 이름
			self.NM_DTM_YN = new CreatorVO({
				value: ''
			});
			// Back계약여부 코드(1:YES, 2:NO)
			self.CD_BACK_CTR_YN = new CreatorVO({
				id : 'cdBackCtrYn',
				type: 'number',
				value: 2,
				msg: { empty: '', error: '' }
			});
			// Back계약여부 이름
			self.NM_BACK_CTR_YN = new CreatorVO({
				value: ''
			});
			// 최초 등록자 ID
			self.NO_INSERT = new CreatorVO({
				value: ''
			});
			// 최초 등록자 이름
			self.NM_INSERT = new CreatorVO({
				value: ''
			});
			// 장비유형 코드
			self.CD_EQM_TP = new CreatorVO({
				id : 'cdEqmTp',
				type: 'number',
				value: 0,
				required: true,
				msg: { empty: '장비유형을 선택해주세요', error: '' }
			});
			// 장비유형 이름
			self.NM_EQM_TP = new CreatorVO({
				value: ''
			});
			// 제조사 코드
			self.CD_VED_C = new CreatorVO({
				id : 'cdVedC',
				type: 'number',
				value: 0,
				required: true,
				msg: { empty: '제조사를 선택해주세요', error: '' }
			});
			// 제조사 이름
			self.NM_VED_C = new CreatorVO({
				value: ''
			});
			/** @type {number} 관리고객사 코드 */
			self.NO_MNG_CUST = new CreatorVO({
				id : 'noMngCust',
				type: 'number',
				value: 0,
				required: true,
				msg: { empty: '관리고객사를 선택해주세요.', error: '' }
			});
			// 관리고객사 이름
			self.NM_MNG_CUST = new CreatorVO({
				value: '',
				placeholder: '관리고객사를 검색해주세요'
			});
			// 서비스고객사 코드
			self.NO_SERV_CUST = new CreatorVO({
				id : 'noServCust',
				type: 'number',
				value: 0,
				required: true,
				msg: { empty: '서비스고객사를 선택해주세요.', error: '' }
			});
			// 서비스고객사 이름
			self.NM_SERV_CUST = new CreatorVO({
				value: '',
				placeholder: '서비스고객사를 검색해주세요'
			});
			// 변경장비번호
			self.NO_CHG_EQM = new CreatorVO({
				id : 'noChgEqm',
				type: 'string',
				value: '',
				msg: { empty: '변경장비번호를 선택해주세요.', error: '' },
				placeholder: '변경장비번호를 검색해주세요'
			});
			// 비고
			self.DC_RMK  = new CreatorVO({
				id : 'dcRmk',
				value: '',
				maxlength: 240,
				msg: { empty: '', error: '' },
				placeholder: '240자리 이내로 입력해주세요.'
			});

			self.YN_DEL = new CreatorVO({
				value: 'N'
			});

			if (data) {
				self.setData(data);
			}

		}

		EqMaster.prototype = {
			/**
			 * data를 모델에 할당한다.
			 * @param data
			 */
			setData: function (data) {
				var self = this;
				angular.forEach(data, function (value, key) {
					if (!(key==='EQM_DUP_LIST' || key==='EQM_SERV_REC_LIST')) {
						if (value && self[key]) { self[key].value = value; }
					}
				});
			},

			/**
			 * 등록,수정 데이터을 생성한다.
			 * @param {string} kind insert, update, delete
			 * @returns {object}
			 */
			getRestParam: function (kind) {
				var self = this,
					param = {};

				// 장비명 필수
				if (!self.NM_EQM.valid()) {
					return {
						state: false,
						model: self.NM_EQM
					};
				}
				param.NM_EQM = self.NM_EQM.value;

				if (self.NM_EQM_ID.valid() ) { param.NM_EQM_ID = self.NM_EQM_ID.value;   }   // 장비ID
				if (self.DC_SRN.valid()    ) { param.DC_SRN = self.DC_SRN.value;         }   // S/N
				if (self.NM_MODEL.valid()  ) { param.NM_MODEL = self.NM_MODEL.value;     }   // 모델명
				if (self.DC_EQM_POS.valid()) { param.DC_EQM_POS = self.DC_EQM_POS.value; }   // 장비위치
				if (self.DC_IPA.valid()    ) { param.DC_IPA = self.DC_IPA.value;         }   // IP ADDRESS

				param.CD_DTM_YN      = self.CD_DTM_YN.value;          // 확정여부
				param.CD_BACK_CTR_YN = self.CD_BACK_CTR_YN.value;     // BACK계약 여부

				// 장비유형
				if (!self.CD_EQM_TP.valid()) {
					return {
						state: false,
						model: self.CD_EQM_TP
					};
				}
				param.CD_EQM_TP = self.CD_EQM_TP.value;

				// 제조사
				if (!self.CD_VED_C.valid()) {
					return {
						state: false,
						model: self.CD_VED_C
					};
				}
				param.CD_VED_C = self.CD_VED_C.value;

				// 관리고객사
				if (!self.NO_MNG_CUST.valid()) {
					return {
						state: false,
						model: self.NO_MNG_CUST
					};
				}
				param.NO_MNG_CUST = self.NO_MNG_CUST.value;

				// 서비스고객사
				if (!self.NO_SERV_CUST.valid()) {
					return {
						state: false,
						model: self.NO_SERV_CUST
					};
				}
				param.NO_SERV_CUST = self.NO_SERV_CUST.value;

				if (self.DC_RMK.valid()     ) { param.DC_RMK = self.DC_RMK.value;         }    // 비고
				if (self.NO_CHG_EQM.valid() ) { param.NO_CHG_EQM = self.NO_CHG_EQM.value; }   // 변경장비번호

				switch (kind) {
					case 'insert':
						break;

					case 'update':
						param.NO_EQM = self.NO_EQM.value;
						break;
				}

				return {
					state : true,
					result: param
				};
			},

			/**
			 * (모달팝업) 고객사를 검색한다.
			 * @param {string} kind 종류(MNG:관리고객사, SERV:서비스고객사)
			 */
			modalCustCmp: function (kind) {
				var self = this,
					modalInstance = ModalSvc.openSearchCustCmp();

				switch (kind) {
					case 'MNG':
						modalInstance.result.then(function (res) {
							self.NO_MNG_CUST.value = res.code;
							self.NM_MNG_CUST.value = res.name;
						});
						break;
					case 'SERV':
						modalInstance.result.then(function (res) {
							self.NO_SERV_CUST.value = res.code;
							self.NM_SERV_CUST.value = res.name;
						});
						break;
				}
			},

			/**
			 * (모달팝업) 변경장비번호를 검색한다.
			 */
			modalNoEqm: function () {
				var self = this,
					modalInstance = ModalSvc.openSearchChangeEqmNo({
						resolve: {
							resolveParam: function () { return { NO_EQM : self.NO_EQM }; }
						}
					});

				modalInstance.result.then(function (res) {
					self.NO_CHG_EQM.value = res.NO_EQM;

				});
			},

			/**
			 * 검색된 고객사 정보를 초기화한다.
			 * @param {string} kind 종류(MNG:관리고객사, SERV:서비스고객사)
			 */
			initCustCmp: function (kind) {
				var self = this;
				switch (kind) {
					case 'MNG':
						self.NO_MNG_CUST.value = 0;
						self.NM_MNG_CUST.value = '';
						break;
					case 'SERV':
						self.NO_SERV_CUST.value = 0;
						self.NM_SERV_CUST.value = '';
						break;
				}
			},

			/**
			 * 검색된 변경장비번호를 초기화한다.
			 */
			initNoEqm: function () {
				this.NO_CHG_EQM.value = '';
			}

		};

		return EqMaster;
	}


}());