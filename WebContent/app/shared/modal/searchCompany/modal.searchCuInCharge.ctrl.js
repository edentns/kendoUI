(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 고객사 검색
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.searchCuInChargeCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "$sce", "$filter", "CU.chargeListSvc", "no_cust", "disabled_no_cust",
			function ($scope, $modal, $modalInstance, ngTableParams, $sce, $filter, CuInChargeListSvc, no_cust, disabled_no_cust) {

				var searchCuInChargeVO;

				/**
				 * ===================================================
				 * @description 검색 layout을 관리한다.
				 * ===================================================
				 */
				searchCuInChargeVO = $scope.searchCuInChargeVO = {
					isSearchStatus: false,
					searchCompanyWord: no_cust.NAME,
					searchCuInChargeWord: "",
					data: [],
					selectedCuInChargeInfo: {code: "", name: "", no_mobile: "", no_email: ""},
					disabled: disabled_no_cust
				};
				
				searchCuInChargeVO.tbl = {// 테이블 세팅
					tableParams: new ngTableParams({
						page              : 1,
						count             : 5,
						isShowSelectLength: false,
						sorting           : {
							name: "desc"
						}
					}, {
						total: searchCuInChargeVO.data.length,
						getData: function( $defer, params ) {
							var orderedData = params.sorting() ? $filter("orderBy")(searchCuInChargeVO.data, params.orderBy()) : searchCuInChargeVO.data;
							params.total(orderedData.length);
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					})
				};

				/**
				 * 테이블 데이터를 갱신힌다.
				 * @param {Array} data 검색된 데이터 리스트
				 */
				searchCuInChargeVO.doReload = function ( data ) {// 테이블 데이터를 갱신하다.
					searchCuInChargeVO.tbl.tableParams.settings({data: data});
					searchCuInChargeVO.tbl.tableParams.page(1);
					searchCuInChargeVO.tbl.tableParams.reload();
				};

				/**
				 * 등록 모달창을 띄운다.
				 */
				searchCuInChargeVO.modalInsert = function () {
                    $modal.open({
						templateUrl : "app/shared/modal/searchCompany/modal.insertCuInCharge.tpl.html",
						controller  : "modal.insertCuInChargeCtrl",
						size        : "lg",
						resolve: {
                          no_cust: function () {
                            return no_cust;
                          },
                          disabled_no_cust : function () {
                        	  return true;   // true : 고객사명 조회 desabled, false : 고객사명으로 조회 가능
                          },
                          upInstance : function () {
                        	  return searchCuInChargeVO;
                          }
                        }
					});
				};

				/**
				 * 검색조건과 데이터를 초기화한다.
				 */
				searchCuInChargeVO.initSearch = function () {
					searchCuInChargeVO.isSearchStatus           = false;
					searchCuInChargeVO.data                     = [];
					searchCuInChargeVO.selectedCuInChargeInfo.code = "";
					searchCuInChargeVO.selectedCuInChargeInfo.name = "";
					searchCuInChargeVO.selectedCuInChargeInfo.no_mobile = "";
					searchCuInChargeVO.selectedCuInChargeInfo.no_email = "";
					
					searchCuInChargeVO.doInquiry();
				};

				/**
				 * 검색조건에 해당하는 고객사를 검색한다.
				 */
				searchCuInChargeVO.doInquiry = function () {
					var param = {
						client	: (searchCuInChargeVO.searchCompanyWord === "") ? "all" : searchCuInChargeVO.searchCompanyWord,
			            dmpl	: (searchCuInChargeVO.searchCuInChargeWord === "") ? "all" : searchCuInChargeVO.searchCuInChargeWord,
			            cust_cd	: no_cust.VALUE
					};

					CuInChargeListSvc.getChargeList( param ).then(function ( result ) {
						searchCuInChargeVO.isSearchStatus = true;
						searchCuInChargeVO.data = result.data;
						searchCuInChargeVO.doReload(result.data);
					});
				};

				/**
				 * 유효성을 체크한다.
				 * @returns {boolean}
				 */
				searchCuInChargeVO.isValid = function () {
					if (searchCuInChargeVO.selectedCuInChargeInfo.code === "") {
						alert("담당자를 선택해주세요.");
						return false;
					}
					return true;
				};

				/**
				 * 테이블 Row를 선택했을경우 동작을 처리한다.
				 * @param {Object} cuInChargeInfo 선택된 거래처
				 */
				searchCuInChargeVO.changeSelected = function ( cuInChargeInfo ) {
					var vo = $scope.searchCuInChargeVO;
					if (!cuInChargeInfo.selected) {
						vo.data.forEach(function (info) {
							info.selected = false;
						});
						cuInChargeInfo.selected = true;
						vo.selectedCuInChargeInfo.code = cuInChargeInfo.d_UNIQ_CD;
						vo.selectedCuInChargeInfo.name = cuInChargeInfo.d_NAME;
						vo.selectedCuInChargeInfo.no_mobile = cuInChargeInfo.d_MOBILE;
						vo.selectedCuInChargeInfo.no_email = cuInChargeInfo.d_EMAIL;
					}
				};

				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 */
				searchCuInChargeVO.doConfirm = function () {
					if ( searchCuInChargeVO.isValid() ) {
						$modalInstance.close( searchCuInChargeVO.selectedCuInChargeInfo );
					}
				};

				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 * @param {Object} cuInChargeInfo 선택된 거래처
				 */
				searchCuInChargeVO.doDblConfirm = function ( cuInChargeInfo ) {
					searchCuInChargeVO.changeSelected( cuInChargeInfo );
					searchCuInChargeVO.doConfirm();
				};

				/**
				 * 모달창을 닫는다.
				 */
				searchCuInChargeVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};


				// 처음 로드되었을 때 실행된다.
				(function  () {
					searchCuInChargeVO.initSearch();
				}());
			}]);

}());