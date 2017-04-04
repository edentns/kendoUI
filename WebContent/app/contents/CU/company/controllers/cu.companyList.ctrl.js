(function () {
    "use strict";

    angular.module("CU.company.controller")
        .controller("CU.companyListCtrl", ["$scope", "$http", "$state", "CU.companyListSvc", "CU.companyInfoSvc", "SY.codeSvc", "SY.departSvc", "APP_CODE", "ngTableParams", "$sce", "$filter", "APP_MSG", "resData", "Page",
            function ($scope, $http, $state, CuCompanyListSvc, CuCompanyInfoSvc, SyCodeSvc, SyDepartSvc, APP_CODE, ngTableParams, $sce, $filter, APP_MSG, resData, Page) {
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
                    });
                };


                /**
                 * searchVO
                 * # 검색과 관련된 정보.
                 * # 고객사 정보를 검색한다.
                 */
                var searchVO = $scope.searchVO = {
                    boxTitle : "검색",
                    client	 : "",			// 고객사명
                    dept	 : "all",		// 부서
                    sales	 : "",			// 영업대표
                    technic	 : ""			// 기술서비스책임자
                };

                // 초기로드시 실행된다.
                searchVO.initLoad = function () {
                    searchVO.doInquiry();
                };

                // 검색조건을 초기화한다.
                searchVO.init = function () {
                    searchVO.client 	= "";
                    searchVO.dept 		= "all";
                    searchVO.sales 		= "";
                    searchVO.technic 	= "";
                    searchVO.initLoad();
                };

                // 검색을 실행한다.
                searchVO.doInquiry = function () {
                    var param = CuCompanyListSvc.makeGetListParam(searchVO);
                    CuCompanyListSvc.getCompanyList(param).then(function ( result ) {
                        angular.forEach(result.data, function (info) {
                            info.checked = false;
                        });

                        companyVO.total = result.data.length;
                        companyVO.data 	= result.data;
                        companyVO.doReload( result.data );
                    });
                };



                /**
                 * compnayVO
                 * # 고객사 등록페이지이동, 수정페이지이동, 삭제를한다.
                 */
                var companyVO = $scope.companyVO = {
                    total: 0,
                    data: [],
                    itemsByPage : 10
                };
                companyVO.tbl = {
                    columns: [
                        {title: "선택", visible: true },
                        {title: "고객사", field: "c_NAME", visible: true },
                        {title: "사업자번호", field: "c_CORP_REG_NUMBER", visible: true },
                        {title: "담당자수", field: "IN_CHARGE_CNT", visible: true },
                        {title: "담당부서", field: "SALES_DEPT_NAME", visible: true },
                        {title: "영업대표", field: "c_SALES_EMP_NAME", visible: true },
                        {title: "기술서비스책임자", field: "c_TECHNIC_EMP_NAME", visible: true }
                    ],
                    tableParams: new ngTableParams({
                        page							: 1,
                        count							: 15,
                        isShowSelectLength: false,
                        sorting						: {
                            c_UPDATE_DT: "desc"
                        }
                    }, {
                        total		: companyVO.data.length,
                        getData	: function( $defer, params ) {
                            var orderedData = params.sorting() ? $filter("orderBy")(companyVO.data, params.orderBy()) : companyVO.data;
                            $defer.resolve( orderedData.slice( (params.page() - 1) * params.count(), params.page() * params.count() ) );
                        }
                    })
                };

                // 초기로드시 실행된다.
                companyVO.initLoad = function () {

                };

                // 테이블 데이터를 갱신하다.
                companyVO.doReload = function (data) {
                    companyVO.tbl.tableParams.settings({data: data});
                    companyVO.tbl.tableParams.page(1);
                    companyVO.tbl.tableParams.reload();
                };

                // 고객사등록페이지로 이동한다.
                companyVO.moveInsertPage = function () {
                    $state.go('app.csCompany', { kind: 'insert', menu: null, ids: null });
                };

                // 수정, 상세페이지로 이동한다.
                companyVO.moveDetailPage = function ( info ) {
                    $state.go('app.csCompany', { kind: 'detail', menu: null, ids: info.c_CD });
                };

                // 고객사정보를 삭제한다.
                companyVO.doDelete = function () {
                    var delData = [];
                    angular.forEach(companyVO.data, function (info) {
                        if (info.checked) {
                            delData.push({cd: info.c_CD});
                        }
                    });

                    if (delData.length === 0) {
                        alert("삭제할 고객사를 선택해주세요.");
                        return false;
                    }
                    if (confirm(APP_MSG.delete.confirm)) {
                        CuCompanyInfoSvc.delete(delData).then(function () {
                            alert(APP_MSG.delete.success);
                            searchVO.doInquiry();
                        });
                    }
                };


                // [LOAD]
                codeVO.initLoad();
                searchVO.initLoad();
            }]);

}());