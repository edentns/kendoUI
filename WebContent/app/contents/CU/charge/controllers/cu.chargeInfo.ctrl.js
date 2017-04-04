(function () {
	"use strict";

	angular.module("CU.charge.controller")
		.controller("CU.chargeInfoCtrl",["$stateParams", "$scope", "$state", "CU.chargeInfoSvc", "$modal", "APP_MSG", "resData", "FieldVO", "Page",
			function ($stateParams, $scope, $state, CuChargeInfoSvc, $modal, APP_MSG, resData, FieldVO, Page) {
				var page  = $scope.page = new Page({ auth: resData.access }),
					today = edt.getToday();

				/**
				 * chargeVO
				 * # 담당자를 등록, 수정한다.
				 */
				var chargeVO = $scope.chargeVO = {
					kind    : "",
					ids     : "",
					title   : "",
					param   : {
						c_NAME		: "",		// 고객사명
						d_CUST_CD	: "",		// 고객사 코드
						d_NAME		: "",		// 이름
						d_DEPT		: "",		// 부서
						d_POS		: "",		// 직급
						d_MOBILE	: "",		// 휴대폰
						d_EMAIL		: "",		// 이메일
						c_CORP_ADDR1: "",		// 기본주소
						c_CORP_ADDR2: ""		// 상세주소
					}
				};

				// 초기로드시 실행된다.
				chargeVO.initLoad = function () {
					chargeVO.init();
					chargeVO.kind 	= $stateParams.kind;
					chargeVO.ids 	= $stateParams.ids || "";
					chargeVO.title 	= ($stateParams.kind === "insert") ? "등록" : "수정";

					if (chargeVO.kind === "detail") {// 수정일경우만 실행된다.
						var param = {cust_cd: chargeVO.ids};
						CuChargeInfoSvc.getDetailChargeInfo(param).then(function (result) {
							chargeVO.param = result.data[0];
						});
					}
				};

				// 데이터를 초기화한다.
				chargeVO.init = function () {
					chargeVO.kind 	= "";
					chargeVO.ids 		= "";
					chargeVO.title 	= "";
					chargeVO.param 	= {
						c_NAME			: "",
						d_CUST_CD		: "",
						d_NAME			: "",
						d_DEPT			: "",
						d_POS				: "",
						d_MOBILE		: "",
						d_EMAIL			: "",
						c_CORP_ADDR1: "",
						c_CORP_ADDR2: ""
					};
				};

				// 담당자 등록, 수정을 위한 param을 생성한다.
				chargeVO.makeGetParam = function () {

					var param = chargeVO.param,
						rtnParam = {
							d_CUST_CD   : param.d_CUST_CD,
							d_NAME	    : param.d_NAME,
							d_MOBILE	: param.d_MOBILE
						};

					if ( param.d_DEPT ) {
						rtnParam.d_DEPT = param.d_DEPT;
					}

					if ( param.d_POS ) {
						rtnParam.d_POS = param.d_POS;
					}

					if ( param.d_EMAIL ) {
						rtnParam.d_EMAIL = param.d_EMAIL;
					}

					if ( param.c_CORP_ADDR1 ) {
						rtnParam.c_CORP_ADDR1 = param.c_CORP_ADDR1;
					}

					if ( param.c_CORP_ADDR2 ) {
						rtnParam.c_CORP_ADDR2 = param.c_CORP_ADDR2;
					}


					if ( chargeVO.kind === "detail" ) {
						rtnParam.d_UNIQ_CD = Number( chargeVO.ids );
					}

					if ( chargeVO.kind === "update" ) {
						rtnParam.d_UNIQ_CD = chargeVO.ids;		// 담당자 KEY
					}

					return rtnParam;
				};

				// 담당자 등록, 수정을 위한 validation 체크를 수행한다.
				chargeVO.isValid = function () {
					var data = chargeVO.param,
						oResult1, oResult2, oResult3, oResult4, oResult5, oResult6, oResult7, oResult8;

					oResult1 = new FieldVO(
						{ type: "integer", name: "d_NAME", value: Number(data.d_CUST_CD), displayName: "고객사명" },
						[
							{ category: "require" }

						]
					).validate();
					if (!oResult1.valid) {
						return edt.invalidFocus("companyNameBtn", oResult1.message);
					}

					oResult2 = new FieldVO(
						{ type: "string", name: "d_NAME", value: data.d_NAME, displayName: "이름" },
						[
							{ category: "require" },
							{ category: "pattern", value: /^[가-힣a-zA-Z][가-힣a-zA-Z ]{1,32}$/ }
						]
					).validate();
					if (!oResult2.valid) {
						return edt.invalidFocus("chargeName", oResult2.message);
					}

					oResult3 = new FieldVO(
						{ type: "string", name: "d_DEPT", value: data.d_DEPT, displayName: "부서" },
						[
							{ category: "pattern", value: /^[가-힣a-zA-Z][가-힣\w-()\s]{0,31}$/ }
						]
					).validate();
					if (!oResult3.valid) {
						return edt.invalidFocus("chargeDept", oResult3.message);
					}

					oResult4 = new FieldVO(
						{ type: "string", name: "d_POS", value: data.d_POS, displayName: "직급" },
						[
							{ category: "pattern", value: /^[가-힣a-zA-Z][가-힣a-zA-Z-()\s]{0,31}$/ }
						]
					).validate();
					if (!oResult4.valid) {
						return edt.invalidFocus("chargePos", oResult4.message);
					}

					oResult5 = new FieldVO(
						{ type: "string", name: "d_MOBILE", value: data.d_MOBILE, displayName: "연락처" },
						[
							{ category: "require" },
							{ category: "phone" }
						]
					).validate();
					if (!oResult5.valid) {
						return edt.invalidFocus("chargePhone", oResult5.message);
					}

					oResult6 = new FieldVO(
						{ type: "string", name: "d_EMAIL", value: data.d_EMAIL, displayName: "이메일" },
						[
							{ category: "email" }
						]
					).validate();
					if (!oResult6.valid) {
						return edt.invalidFocus("chargeEmail", oResult6.message);
					}

					if (data.c_CORP_ADDR1 || data.c_CORP_ADDR2) {
						oResult7 = new FieldVO(
							{ type: "string", name: "c_CORP_ADDR1", value: data.c_CORP_ADDR1, displayName: "기본주소" },
							[
								{ category: "require" },
								{ category: "address" }
							]
						).validate();
						if (!oResult7.valid) {
							return edt.invalidFocus("chargeAddr1", oResult7.message);
						}

						oResult8 = new FieldVO(
							{ type: "string", name: "c_CORP_ADDR2", value: data.c_CORP_ADDR2, displayName: "상세주소" },
							[
								{ category: "require" },
								{ category: "address" }
							]
						).validate();
						if (!oResult8.valid) {
							return edt.invalidFocus("chargeAddr2", oResult8.message);
						}
					}

					return true;
				};

				// 담당자를 등록한다.
				chargeVO.doInsert = function () {
					if (confirm(APP_MSG.insert.confirm)) {
						var param = chargeVO.makeGetParam();
						if (chargeVO.isValid(param)) {
							CuChargeInfoSvc.insert(param).then(function () {
								alert(APP_MSG.insert.success);
								$state.go('app.csCharge', { kind: 'list', menu: true, ids: null });
							});
						}
					}
				};

				// 담당자를 수정한다.
				chargeVO.doUpdate = function () {
					if (confirm(APP_MSG.update.confirm)) {
						var param = chargeVO.makeGetParam();
						if (chargeVO.isValid(param)) {
							CuChargeInfoSvc.update(param).then(function () {
								alert(APP_MSG.update.success);
								$state.go('app.csCharge', { kind: 'list', menu: true, ids: null });
							});
						}
					}
				};

				// 담당자등록 및 수정을 취소한다.
				chargeVO.doCancel = function (type) {
					if (type !== "confirm") {
						if (confirm(APP_MSG.cancel)) {
							$state.go('app.csCharge', { kind: 'list', menu: true, ids: null });
						}
					} else {
						$state.go('app.csCharge', { kind: 'list', menu: true, ids: null });
					}
				};

				// 고객사명을 등록하기 위해 모달 팝업 창을 연후 결과값을 저장한다.
				chargeVO.modalSearchCustomerCompany = function () {
					var modalInstance = $modal.open({
						templateUrl : "app/shared/modal/searchCompany/modal.searchCompany.tpl.html",
						controller  : "modal.searchCompanyCtrl",
						size        : "lg"
					});

					modalInstance.result.then(function ( result ) {
						chargeVO.param.d_CUST_CD	= result.code;
						chargeVO.param.c_NAME 		= result.name;
					});
				};

				// [LOAD]
				chargeVO.initLoad();
			}]);

}());
