(function () {
    "use strict";

    angular.module("CU.company.controller")
        .controller("CU.companyInfoCtrl", ["$stateParams", "$scope", "$state", "CU.companyInfoSvc", "CU.chargeListSvc", "SY.codeSvc", "SY.departSvc", "ngTableParams", "$sce", "$filter", "APP_MSG", "APP_CODE", "$modal", "resData", "FieldVO", "Page",
            function ($stateParams, $scope, $state, CuCompanyInfoSvc, CuChargeListSvc, SyCodeSvc, SyDepartSvc, ngTableParams, $sce, $filter, APP_MSG, APP_CODE, $modal, resData, FieldVO, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                /**
                 * codeVO
                 * # code정보를 가져온다.
                 */
                var codeVO = $scope.codeVO = {
                    departCodeList: []
                };

                // 초기로드시 실행된다.
                codeVO.initLoad = function () {
                    codeVO.getSubcodeList({ search: "all" });
                };

                // 코드를 가져온다.
                codeVO.getSubcodeList = function ( param ) {
                    SyDepartSvc.getDepart(param).then(function (result) {
                        codeVO.departCodeList = result.data;
                        codeVO.departCodeList.unshift({ CD: 0, NAME: '전체' });
                    });
                };

                /**
                 * compnayVO
                 * # 고객사 정보를 등록, 수정한다.
                 */
                var companyVO = $scope.companyVO = {
                    kind 	: "",			// insert 또는 update
                    ids		: "",			// 수정시 key값
                    title	: "",			// 등록 또는 수정
                    param	: {
                        c_NAME : "",			// 고객사명
                        c_CORP_REG_NUMBER	: "",	// 사업자번호
                        c_CORP_ZIPCODE		: "",	// 우편번호
                        c_CORP_ADDR1		: "", 	// 주소
                        c_CORP_ADDR2		: "",	// 상세주소
                        c_CORP_PHONE		: "",	// 대표번호
                        c_CORP_FAX			: "",	// FAX
                        c_SALES_DEPT_CD		: 0,	// 담당부서
                        SALES_DEPT_NAME     : "",   // 담당부서이름
                        c_NO_EMP			: "",	// 영업대표 id
                        c_SALES_EMP_NAME	: "",	// 영업대표
                        c_TECHNIC_EMP_NAME	: ""	// 기술서비스책임자
                    }
                };

                // 처음 로드되었을 때 실행된다.
                companyVO.initLoad 	= function () {
                    companyVO.kind 		= $stateParams.kind;
                    companyVO.ids 		= $stateParams.ids || "";
                    companyVO.title 	= ($stateParams.kind === "insert") ? "등록" : "수정";

                    // 수정일경우만 실행된다.
                    if ( companyVO.kind === "detail" ) {
                        companyVO.getDetailCompanyInfo();
                        chargeVO.getCompanyChargeList();
                    }
                };

                // 등록정보 객체를 생성한다.
                companyVO.makeGetParam = function () {
                    var param = companyVO.param,
                        rtnParam = {
                            c_NAME				: param.c_NAME,
                            c_CORP_REG_NUMBER	: (!param.c_CORP_REG_NUMBER) ? null : param.c_CORP_REG_NUMBER,
	                        c_CORP_ZIPCODE	    : (!param.c_CORP_ZIPCODE) ? null : param.c_CORP_ZIPCODE,
                            c_CORP_ADDR1		: (!param.c_CORP_ADDR1  ) ? null : param.c_CORP_ADDR1,
                            c_CORP_ADDR2		: (!param.c_CORP_ADDR2  ) ? null : param.c_CORP_ADDR2,
                            c_CORP_PHONE		: (!param.c_CORP_PHONE  ) ? null : param.c_CORP_PHONE,
                            c_CORP_FAX			: (!param.c_CORP_FAX    ) ? null : param.c_CORP_FAX,
                            c_SALES_DEPT_CD		: param.c_SALES_DEPT_CD,
                            c_NO_EMP			: (!param.c_NO_EMP      ) ? null : param.c_NO_EMP,
                            c_TECHNIC_EMP_NAME	: (!param.c_TECHNIC_EMP_NAME) ? null : param.c_TECHNIC_EMP_NAME
                        };

                    if (companyVO.kind === "detail") {
                        rtnParam.c_CD = companyVO.ids;
                    }

                    return rtnParam;
                };

                // validation를 체크한다.
                companyVO.isValid = function () {
	                var data = companyVO.param,
		                oResult1, oResult2, oResult3, oResult4, oResult5, oResult6, oResult7, oResult8;


	                oResult1 = new FieldVO(
		                { type: "string", name: "c_NAME", value: data.c_NAME, displayName: "고객사명" },
		                [
			                { category: "require" },
			                { category: "pattern", value: /^[가-힣a-zA-Z_(,)&@':;/{*}[\]<#>.+-][가-힣\w _(,)&@':;/{*}[\]<#>.+-]{1,32}$/ }
		                ]
	                ).validate();
	                if (!oResult1.valid) {
		                return edt.invalidFocus("companyName", oResult1.message);
	                }

	                oResult2 = new FieldVO(
		                { type: "string", name: "c_CORP_REG_NUMBER", value: data.c_CORP_REG_NUMBER, displayName: "사업자번호" },
		                [
			                { category: "pattern", value: /^\d{3}-\d{2}-\d{5}$/ }
		                ]
	                ).validate();
	                if (!oResult2.valid) {
		                return edt.invalidFocus("corpRegNum", oResult2.message);
	                }

	                oResult3 = new FieldVO(
		                { type: "string", name: "c_CORP_ZIPCODE", value: data.c_CORP_ZIPCODE, displayName: "우편번호" },
		                [
			                { category: "zipcode" }
		                ]
	                ).validate();
	                if (!oResult3.valid) {
		                return edt.invalidFocus("zipcode", oResult3.message);
	                }

	                if (data.c_CORP_ADDR1 || data.c_CORP_ADDR2) {
		                oResult4 = new FieldVO(
			                { type: "string", name: "c_CORP_ADDR1", value: data.c_CORP_ADDR1, displayName: "기본주소" },
			                [
				                { category: "require" },
				                { category: "address" }
			                ]
		                ).validate();
		                if (!oResult4.valid) {
			                return edt.invalidFocus("addr1", oResult4.message);
		                }

		                oResult5 = new FieldVO(
			                { type: "string", name: "c_CORP_ADDR2", value: data.c_CORP_ADDR2, displayName: "상세주소" },
			                [
				                { category: "require" },
				                { category: "address" }
			                ]
		                ).validate();
		                if (!oResult5.valid) {
			                return edt.invalidFocus("addr2", oResult5.message);
		                }
	                }

	                oResult6 = new FieldVO(
		                { type: "string", name: "c_CORP_PHONE", value: data.c_CORP_PHONE, displayName: "대표번호" },
		                [
			                { category: "phone" }
		                ]
	                ).validate();
	                if (!oResult6.valid) {
		                return edt.invalidFocus("phone", oResult6.message);
	                }

	                oResult7 = new FieldVO(
		                { type: "string", name: "c_CORP_FAX", value: data.c_CORP_FAX, displayName: "FAX" },
		                [
			                { category: "fax" }
		                ]
	                ).validate();
	                if (!oResult7.valid) {
		                return edt.invalidFocus("fax", oResult7.message);
	                }

	                oResult8 = new FieldVO(
		                { type: "string", name: "c_TECHNIC_EMP_NAME", value: data.c_TECHNIC_EMP_NAME, displayName: "기술서비스책임자" },
		                [
			                { category: "pattern", value:  /^[가-힣a-zA-Z][가-힣a-zA-Z\s,]{1,19}$/ }
		                ]
	                ).validate();
	                if (!oResult8.valid) {
		                return edt.invalidFocus("technic", oResult8.message);
	                }

                    return true;
                };

                // 고객사를 등록한다.
                companyVO.doInsert = function () {
	                var param;
                    if ( confirm( APP_MSG.insert.confirm ) ) {
                        if (companyVO.isValid()) {
                            param = companyVO.makeGetParam();
                            CuCompanyInfoSvc.insert(param).then(function () {
                                alert( APP_MSG.insert.success );
                                $state.go('app.csCompany', { kind: 'list', menu: true, ids: null });
                            });
                        }
                    }
                };

                // 고객사를 수정한다.
                companyVO.doUpdate = function () {
	                var param;
                    if ( confirm( APP_MSG.update.confirm ) ) {
                        if (companyVO.isValid()) {
                            param = companyVO.makeGetParam();
                            CuCompanyInfoSvc.update( param ).then(function () {
                                alert( APP_MSG.update.success );
                                $state.go('app.csCompany', { kind: 'list', menu: true, ids: null });
                            });
                        }
                    }
                };

                // 고객사등록 및 수정을 취소한다.
                companyVO.doCancel = function (type) {
                    if (type!=="confirm") {
                        if (confirm(APP_MSG.cancel) ) {
                            $state.go('app.csCompany', { kind: 'list', menu: true, ids: null });
                        }
                    } else { $state.go('app.csCompany', { kind: 'list', menu: true, ids: null }); }
                };

                // 고객사 상세정보를 가져온다.
                companyVO.getDetailCompanyInfo = function () {// 고객사 상세정보를 가져온다.
                    var param = {cust_cd: companyVO.ids};
                    CuCompanyInfoSvc.getDetailCompanyInfo( param ).then(function ( result ) {
                        var data    = result.data[0];
                        companyVO.param = data;
                    });
                };

                // 대표자를 검색한다.
                companyVO.modalSearchSalesEmp = function () {
                    var modalInstance = $modal.open({
                        templateUrl : "app/shared/modal/searchUser/modal.searchUser.tpl.html",
                        controller  : "ModalSearchUserCtrl",
                        size    : "lg",
                        resolve : {
                            dpParam: function () {
                                return {
                                    wk_grp: '2' // 영업
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function ( result ) {
	                    companyVO.param.c_NO_EMP = result.empNo;
	                    companyVO.param.c_SALES_EMP_NAME = result.name;
                    });
                };


                /**
                 * chargeVO
                 * # 담당자 정보를 보여준다.
                 */
                var chargeVO = $scope.chargeVO = {
                    data: []
                };
                chargeVO.tbl = {
                    columns: [
                        {title: "담당자", field: "d_NAME", visible: true },
                        {title: "소속부서", field: "d_DEPT", visible: true },
                        {title: "직급", field: "d_POS", visible: true },
                        {title: "연락처", field: "d_MOBILE", visible: true },
                        {title: "이메일", field: "d_EMAIL", visible: true }
                    ],
                    tableParams: new ngTableParams({
                        page							: 1,
                        count							: 15,
                        isShowSelectLength: false
                    }, {
                        total: chargeVO.data.length,
                        getData: function( $defer, params ) {
                            var orderedData = params.sorting() ? $filter("orderBy")(chargeVO.data, params.orderBy()) : chargeVO.data;
                            $defer.resolve( orderedData.slice( (params.page() - 1) * params.count(), params.page() * params.count() ) );
                        }
                    })
                };

                // 처음 로드되었을 때 실행된다.
                chargeVO.initLoad = function () {

                };

                // 테이블 데이터를 갱신하다.
                chargeVO.doReload = function ( data ) {
                    chargeVO.tbl.tableParams.settings( {data: data} );
                    chargeVO.tbl.tableParams.reload();
                };

                // 상세보기 일경우 담당자 정보를 보여준다.
                chargeVO.getCompanyChargeList = function () {
                    var param = {cust_cd: companyVO.ids};
                    CuChargeListSvc.getChargeList(param).then(function (result) {
                        chargeVO.data = result.data;
                        chargeVO.doReload( result.data );
                    });
                };


                // [LOAD]
                codeVO.initLoad();
                companyVO.initLoad();
            }]);

}());
