(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name CO.dashboard.service : CO.dashboardSvc
     * dashboard에 사업현황, 매출현황, 사업수행현황, 주요사업 정보 등을 보여주기위한 정보를 관리한다.
     */
    angular.module("CO.dashboard.service")
        .factory("CO.dashboardSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
                /**
                 * 사업현황 정보를 가져온다.
                 * @param param 검색날짜
                 * @returns {*} angular promise 객체
                 */
                getBusinessCondition: function ( param ) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/dashboard/ordercurrent?"+ $.param( param )
                    });
                },

                /**
                 * @name getSales
                 * @description 매출현황 정보를 가져온다.
                 * @param {Object} param 매출현황 parameter
                 */
                getSales: function ( param ) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/dashboard/orderwhole?"+ $.param( param )
                    });
                },

                /**
                 * 매출공유 현황 정보를 가져온다.
                 * @param param
                 * @returns {*}
                 */
                getSharedSales: function (param) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/dashboard/ordershrwhole?"+ $.param( param )
                    });
                },

                /**
                 * 월/분기 사업현황을 가져온다.
                 * @param {JSON} param {type: string(order | salse), start: string(시작일자), end: string(종료일자)}
                 * @returns {*}
                 */
                getQuarterBusiness: function ( param ) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/dashboard/orderquarter?"+ $.param( param )
                    });
                },


                /**
                 * @description 변경분석 정보를 가져온다.
                 * @param {Object} param 변경분석 정보를 가져오기위한 검색조건
                 */
                getChangeAnalysis: function ( param ) {
                    return $http({
                        method : "GET",
                        url    : APP_CONFIG.domain +"/dashboard/alteration?"+ $.param( param )
                    });
                },

                /**
                 * 중요사업을 가져온다.
                 * @param {JSON} param {type: string(order 또는  sales) , dept: number(부서코드)}
                 * @returns {*}
                 */
                getImportantBusiness: function ( param ) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/dashboard/ordertop?"+ $.param( param )
                    });
                }

            };
        }]);
}());