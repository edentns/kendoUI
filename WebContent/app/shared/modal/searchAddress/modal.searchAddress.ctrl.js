(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 고객사 검색
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.searchCompanyCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "$sce", "$filter", "CU.companyListSvc",
			function ($scope, $modal, $modalInstance, ngTableParams, $sce, $filter, CuCompanyListSvc) {

				var searchCompanyVO;

				/**
				 * ===================================================
				 * @description 검색 layout을 관리한다.
				 * ===================================================
				 */
				searchCompanyVO = $scope.searchCompanyVO = {
					isSearchStatus: false,
					searchWord: "",
					data: [],
					selectedCompanyInfo: {code: "", name: "", sales_emp_name: "", sales_dept_cd: 0, sales_dept_name: "" }
				};
				searchCompanyVO.tbl = {// 테이블 세팅
					tableParams: new ngTableParams({
						page              : 1,
						count             : 5,
						isShowSelectLength: false,
						sorting           : {
							name: "desc"
						}
					}, {
						total: searchCompanyVO.data.length,
						getData: function( $defer, params ) {
							var orderedData = params.sorting() ? $filter("orderBy")(searchCompanyVO.data, params.orderBy()) : searchCompanyVO.data;
							params.total(orderedData.length);
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					})
				};

				/**
				 * 테이블 데이터를 갱신힌다.
				 * @param {Array} data 검색된 데이터 리스트
				 */
				searchCompanyVO.doReload = function ( data ) {// 테이블 데이터를 갱신하다.
					searchCompanyVO.tbl.tableParams.settings({data: data});
					searchCompanyVO.tbl.tableParams.page(1);
					searchCompanyVO.tbl.tableParams.reload();
				};

				/**
				 * 등록 모달창을 띄운다.(모달창에서 등록 못함)
				 */
				/*searchCompanyVO.modalInsert = function () {
					$modal.open({
						templateUrl : "app/shared/modal/searchCompany/modal.insertCompany.tpl.html",
						controller  : "modal.insertCompanyCtrl",
						size        : "lg"
					});
				};*/

				/**
				 * 검색조건과 데이터를 초기화한다.
				 */
				searchCompanyVO.initSearch = function () {
					searchCompanyVO.isSearchStatus           = false;
					searchCompanyVO.data                     = [];
					searchCompanyVO.selectedCompanyInfo.code = "";
					searchCompanyVO.selectedCompanyInfo.name = "";
					searchCompanyVO.selectedCompanyInfo.sales_emp_name = "";
					searchCompanyVO.selectedCompanyInfo.sales_dept_cd = 0;
					searchCompanyVO.selectedCompanyInfo.sales_dept_name = "";
				};

				/**
				 * 검색조건에 해당하는 고객사를 검색한다.
				 */
				searchCompanyVO.doInquiry = function () {
					var param = {
						client: (searchCompanyVO.searchWord === "") ? "all" : searchCompanyVO.searchWord,
						dept    : "all",
						sales   : "all",
						technic : "all"
					};

					CuCompanyListSvc.getCompanyList( param ).then(function ( result ) {
						searchCompanyVO.isSearchStatus = true;
						searchCompanyVO.data = result.data;
						searchCompanyVO.doReload(result.data);
					});
				};

				/**
				 * 유효성을 체크한다.
				 * @returns {boolean}
				 */
				searchCompanyVO.isValid = function () {
					if (searchCompanyVO.selectedCompanyInfo.code === "") {
						alert("거래처를 선택해주세요.");
						return false;
					}
					return true;
				};

				/**
				 * 테이블 Row를 선택했을경우 동작을 처리한다.
				 * @param {Object} companyInfo 선택된 거래처
				 */
				searchCompanyVO.changeSelected = function ( companyInfo ) {
					var vo = $scope.searchCompanyVO;
					if (!companyInfo.selected) {
						vo.data.forEach(function (info) {
							info.selected = false;
						});
						companyInfo.selected = true;
						vo.selectedCompanyInfo.code = companyInfo.c_CD;
						vo.selectedCompanyInfo.name = companyInfo.c_NAME;
						vo.selectedCompanyInfo.sales_emp_name = companyInfo.c_SALES_EMP_NAME;
						vo.selectedCompanyInfo.sales_dept_cd = companyInfo.c_SALES_DEPT_CD;
						vo.selectedCompanyInfo.sales_dept_name = companyInfo.SALES_DEPT_NAME;
					}
				};

				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 */
				searchCompanyVO.doConfirm = function () {
					if ( searchCompanyVO.isValid() ) {
						$modalInstance.close( searchCompanyVO.selectedCompanyInfo );
					}
				};

				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 * @param {Object} companyInfo 선택된 거래처
				 */
				searchCompanyVO.doDblConfirm = function ( companyInfo ) {
					searchCompanyVO.changeSelected( companyInfo );
					searchCompanyVO.doConfirm();
				};

				/**
				 * 모달창을 닫는다.
				 */
				searchCompanyVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};


				// 처음 로드되었을 때 실행된다.
				(function  () {
					searchCompanyVO.initSearch();
				}());
			}]);

}());