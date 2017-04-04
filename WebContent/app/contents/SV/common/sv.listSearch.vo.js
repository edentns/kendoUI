(function () {
	'use strict';

	angular
		.module('SV.common.model')
		.factory('SvListPageVO', ['SvCommonSvc', 'SY.codeSvc', 'UtilSvc', 'ModalSvc', 'CreatorVO', 'APP_CODE', 'APP_CONFIG', '$q', '$timeout', '$location',
			function (SvCommonSvc, SyCodeSvc, UtilSvc, ModalSvc, CreatorVO, APP_CODE, APP_CONFIG, $q, $timeout, $location) {
				function SvListPage (config) {
					var self = this,
						today = edt.getToday();

					self.boxTitle = '검색';
					self.cache = {
						param: null
					};

					self.code = {
						searchTypeList   : [
							{ code: "BS", name: "기본검색", active: false },
							{ code: "DS", name: "상세검색", active: false }
						],
						seniorDeptCdList : [],  // 상위부서 코드 리스트
						subDeptCdList    : [],  // 하위부서 코드 리스트
						recrCdList       : [],  // 접수자 코드 리스트
						recWayCdList     : [],  // 접수방법 코드 리스트
						servTpCdList     : [],  // 서비스유형 코드 리스트
						procStatCdList   : [],  // 처리상태 코드 리스트
						obsSronCdList    : [],  // 장애심각도 코드 리스트
						obsSepCdList     : [],  // 장애구분 코드 리스트
						eqmItdFrmCdList  : [],  // 장비도입형태 코드 리스트
						perTpCdList      : []   // 기간유형
					};

					self.entity = {
						// 검색타입(기본검색:BS, 상세검색:DS)
						type: self.code.searchTypeList[0],

						// 상위부서
						KIND: new CreatorVO({
							type: 'number',
							value: 1
						}),

						// 하위부서
						DEPART: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 유저 종류(1-접수자, 2-계획자, 3-수행자
						CD_USER_TP: new CreatorVO({
							type: 'string',
							value: '1'
						}),

						// 유저
						NO_USER: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 관리고객사 코드
						NO_MNG_CUST: new CreatorVO({
							type: 'number',
							value: 0
						}),

						// 관리고객사 이름
						NM_MNG_CUST: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// 서비스고객사 코드
						NO_SERV_CUST: new CreatorVO({
							type: 'number',
							value: 0
						}),

						// 서비스고객사 이름
						NM_SERV_CUST: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// 서비스요청자
						NM_REQR: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// 접수방법
						CD_REC_WAY: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 서비스유형
						CD_SERV_TP: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 처리상태
						CD_STAT_PROC: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 장애심각도
						CD_OBS_SRON: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 장애구분
						CD_OBS_SEP: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 장비도입형태
						CD_EQM_ITD_FRM: new CreatorVO({
							type: 'array',
							value: []
						}),

						// 장비명
						NM_EQM: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// 장비모델
						NM_MODEL: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// Serial Number
						DC_SRN: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// 프로젝트명
						NM_PJT: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// HPRC CASE
						DC_HPRC_CASE: new CreatorVO({
							type    : 'string',
							value   : ''
						}),

						// 기간유형(1:접수일자, 2:완료요청일2ㅏ, 3:프로젝트수행기간
						TP_PER: new CreatorVO({
							type: 'string',
							value: '1'
						}),

						// 기간
						DATE: {
							dateType   : 'week',
							buttonList : ['prevWeek', 'current', 'nextWeek', 'range'],
							selected   : 'current',
							period : {
								start : angular.copy(today),
								end   : angular.copy(today)
							}
						},

						// 서비스접수번호
						NO_SERV_REC: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// 서비스계획번호
						NO_SERV_PLN: new CreatorVO({
							type: 'string',
							value: ''
						}),

						// 서비스수행번호
						NO_SERV_PFM: new CreatorVO({
							type: 'string',
							value: ''
						})
					};

					if (config.code) {
						angular.forEach(config.code, function (code, key) {
							self.code[key] = angular.copy(code, []);
						});
						delete config.code;
					}

					angular.forEach(config, function (optionData, key) {
						if (self.entity[key]) {
							self.entity[key].value = optionData;
						}
					});
				}

				SvListPage.prototype = {
					/**
					 * 검색조건을 초기화한다.
					 */
					init: function () {
						var entity = this.entity;
						entity.KIND.value    = 1;
						entity.DEPART.value  = [];
						entity.CD_USER_TP.value = '1';
						entity.NO_USER.value = [];
						entity.NO_MNG_CUST.value  = 0;
						entity.NM_MNG_CUST.value  ='';
						entity.NO_SERV_CUST.value = 0;
						entity.NM_SERV_CUST.value = '';
						entity.NM_REQR.value      = '';
						entity.CD_REC_WAY.value   = [];
						entity.CD_SERV_TP.value   = [];
						entity.CD_STAT_PROC.value = [];
						entity.CD_OBS_SRON.value  = [];
						entity.CD_OBS_SEP.value   = [];
						entity.CD_EQM_ITD_FRM.value = [];
						entity.NM_EQM.value = '';
						entity.NM_MODEL.value = '';
						entity.DC_SRN.value = '';
						entity.NM_PJT.value = '';
						entity.DC_HPRC_CASE.value = '';
						entity.TP_PER.vlaue = '1';
						entity.NO_SERV_REC.value = '';
						entity.NO_SERV_PLN.value = '';
						entity.NO_SERV_PFM.value = '';
						entity.DATE.selected = 'current';
						this.changeSeniorDept();
					},
					/**
					 *  하위부서 선택을 초기화 시킨다.
					 */
					initDepart: function () {
						var self = this;
						self.entity.DEPART.value = [];
						self.changeSubDept();
					},
					/**
					 * 접수자 선택을 초기화 시킨다.
					 */
					initNoRecr: function () {
						this.entity.NO_USER.value = [];
					},
					/**
					 * 관리고객사 선택을 초기화한다.
					 */
					initMngCust: function () {
						this.entity.NM_MNG_CUST.value = '';
						this.entity.NO_MNG_CUST.value = 0;
					},
					/**
					 * 서비스고객사 선택을 초기화한다.
					 */
					initServCust: function () {
						this.entity.NM_SERV_CUST.value = '';
						this.entity.NO_SERV_CUST.value = 0;
					},
					/**
					 * 접수방법 선택을 초기화 시킨다.
					 */
					initCdRecWay: function () {
						this.entity.CD_REC_WAY.value = [];
					},
					/**
					 * 서비스유형 선택을 초기화 시킨다.
					 */
					initCdServTp: function () {
						this.entity.CD_SERV_TP.value = [];
					},
					/**
					 * 처리상태 선택을 초기화한다.
					 */
					initCdStatProc: function () {
						this.entity.CD_STAT_PROC.value = [];
					},
					/**
					 * 장애심각도 선택을 초기화한다.
					 */
					initCdObsSron: function () {
						this.entity.CD_OBS_SRON.value = [];
					},
					/**
					 * 장애구분 선택을 초기화 시킨다.
					 */
					initCdObsSep: function () {
						this.entity.CD_OBS_SEP.value = [];
					},
					/**
					 * 장비도입형태 선택을 초기화 시킨다.
					 */
					initCdEqmItdFrm: function () {
						this.entity.CD_EQM_ITD_FRM.value = [];
					},
					/**
					 * 기본검색인지 상세검색인지 판단한다.
					 */
					isDetail: function () {
						return this.entity.type.code === 'DS';
					},
					/**
					 * 검색타입을 변경한다.
					 * @param tab
					 */
					changeSearchBtn: function (tab) {
						var self = this;
						angular.forEach(self.code.searchTypeList, function (o) {
							o.active = false;
						});
						self.entity.type = tab;
						tab.active = true;
					},
					/**
					 * 상위부서 변경시 하위부서/팀, 접수자 코드를 가져온다.
					 */
					changeSeniorDept: function () {
						var self = this,
							selectedItem = self.entity.KIND.value;

						$q.all([
							self._getSubDeptCdList(selectedItem),
							self._getRecrCdList([selectedItem])
						]).then(function (res) {
							self.code.subDeptCdList = res[0].data;
							self.code.recrCdList = res[1].data;
						});
					},
					/**
					 * 하위부서 변경시 접수자 코드를 가져온다.
					 */
					changeSubDept: function () {
						var self = this,
							selectedItem = self.entity.DEPART.value;

						self._getRecrCdList(selectedItem).then(function (res) {
							self.code.recrCdList = res.data;
						});
					},
					/**
					 * 하위부서 코드를 가져온다.
					 * @param {number} selectedItem
					 * @returns {promise}
					 * @private
					 */
					_getSubDeptCdList: function (selectedItem) {
						var self = this;
						self.entity.DEPART.value = [];
						return (selectedItem && selectedItem!==1) ? SvCommonSvc.getSubDept(selectedItem) : SvCommonSvc.getSubDept();
					},
					/**
					 * 접수자 코드를 가져온다
					 * @param {Array} selectedItem
					 * @returns {promise}
					 * @private
					 */
					_getRecrCdList: function (selectedItem) {
						var self = this;
						self.entity.NO_USER.value = [];
						return (selectedItem.length>0 && selectedItem[0]!==1) ? SvCommonSvc.getUser(selectedItem) : SvCommonSvc.getUser();
					},
					/**
					 * 탭코드와 일치하는 객체를 리턴한다.
					 * @param code
					 * @returns {*}
					 */
					getEqualTab: function (code) {
						var tabList = this.code.searchTypeList,
							elem;
						angular.forEach(tabList, function (tab) {
							if (tab.code === code) { elem = tab; }
						});
						return elem;
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
									self.entity.NO_MNG_CUST.value = res.code;
									self.entity.NM_MNG_CUST.value = res.name;
								});
								break;
							case 'SERV':
								modalInstance.result.then(function (res) {
									self.entity.NO_SERV_CUST.value = res.code;
									self.entity.NM_SERV_CUST.value = res.name;
								});
								break;
						}
					}
				};

				return SvListPage;
			}
		]);

}());