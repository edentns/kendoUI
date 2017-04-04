(function () {
    "use strict";

    angular.module("CU.charge.controller")
        .controller("CU.chargeListCtrl",["$scope", "$http", "$state", "ngTableParams", "$sce", "$filter", "CU.chargeListSvc", "CU.chargeInfoSvc", "APP_MSG", "resData", "Page",
            function ($scope, $http, $state, ngTableParams, $sce, $filter, CuChargeListSvc, CuChargeInfoSvc, APP_MSG, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                /**
                 * searchVO
                 * # 검색과 관련된 정보.
                 * # 담당자 정보를 검색한다.
                 */
                var searchVO = $scope.searchVO = {
                    boxTitle : "검색",
                    client	 : "",		// 고객사명
                    dmpl	 : ""		// 부서
                };

                // 초기로드시 실행된다.
                searchVO.initLoad = function () {
                    searchVO.doInquiry();
                };

                // 검색조건을 초기화한다.
                searchVO.init = function () {
                    searchVO.client 	= "all";
                    searchVO.dmpl 		= "all";
                    searchVO.doInquiry();
                };

                // 검색 조건을 생성한다.
                searchVO.makeGetParam = function () {
                    return {
                        client	: (searchVO.client === "") 	? "all" : searchVO.client,
                        dmpl		: (searchVO.dmpl === "") 		? "all" : searchVO.dmpl
                    };
                };

                // 검색을 실행한다.
                searchVO.doInquiry = function () {
                    var param = searchVO.makeGetParam();
                    CuChargeListSvc.getChargeList( param ).then(function ( result ) {
                        angular.forEach(result.data, function (info) {
                            info.checked = false;
                        });

                        chargeVO.total 	= result.data.length;
                        chargeVO.data 	= result.data;
                        chargeVO.doReload( result.data );
                    });
                };


                /**
                 * chargeVO
                 * # 담당자 정보를 보여준다.
                 */
                var chargeVO = $scope.chargeVO = {
                    total: 0,
                    data: []
                };
                chargeVO.tbl = {
                    columns: [
                        {title: "선택", visible: true },
                        {title: "담당자", field: "d_NAME", visible: true },
                        {title: "고객사", field: "c_NAME", visible: true },
                        {title: "소속부서", field: "d_DEPT", visible: true },
                        {title: "직급", field: "d_POS", visible: true },
                        {title: "연락처", field: "d_MOBILE", visible: true },
                        {title: "이메일", field: "d_EMAIL", visible: true }
                    ],
                    tableParams: new ngTableParams({
                        page							: 1,
                        count							: 15,
                        isShowSelectLength: false,
                        sorting						: {
                            d_UPDATE_DT: "desc"
                        }
                    }, {
                        total		: chargeVO.data.length,
                        getData	: function( $defer, params ) {
                            var orderedData = params.sorting() ? $filter("orderBy")(chargeVO.data, params.orderBy()) : chargeVO.data;
                            $defer.resolve( orderedData.slice( (params.page() - 1) * params.count(), params.page() * params.count() ) );
                        }
                    })
                };

                // 테이블 데이터를 갱신하다.
                chargeVO.doReload = function ( data ) {
                    chargeVO.tbl.tableParams.settings({data: data});
                    chargeVO.tbl.tableParams.page(1);
                    chargeVO.tbl.tableParams.reload();
                };

                // 담당자등록페이지로 이동한다.
                chargeVO.moveInsertPage = function () {
                    $state.go('app.csCharge', { kind: 'insert', menu: null, ids: null });
                };

                // 수정, 상세페이지로 이동한다.
                chargeVO.moveDetailPage = function ( info ) {
                    $state.go('app.csCharge', { kind: 'detail', menu: null, ids: info.d_UNIQ_CD });
                };

                // 고객사정보를 삭제한다.
                chargeVO.doDelete = function () {
                    var delData = [];
                    angular.forEach(chargeVO.data, function (info) {
                        if (info.checked) {
                            delData.push({uniq_cd: info.d_UNIQ_CD});
                        }
                    });

                    if ( delData.length === 0 ) {
                        alert("삭제할 담당자를 선택해주세요.");
                        return false;
                    }
                    if ( confirm( APP_MSG.delete.confirm ) ) {
	                    CuChargeInfoSvc.delete(delData).then(function () {
                            alert(APP_MSG.delete.success);
                            searchVO.doInquiry();
                        });
                    }
                };


                // [LOAD]
                searchVO.initLoad();
            }]);
}());