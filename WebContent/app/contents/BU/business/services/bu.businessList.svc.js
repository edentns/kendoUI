(function () {
    "use strict";

    /**
     * @name BU.business.service : BU.businessListSvc
     */
    angular.module("BU.business.service")
        .factory("BU.businessListSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // [ CRUD ]
                /**
                 * ORDER 또는 SALES 정보 리스트를 가져온다.
                 * @param   {String} type ORDER 또는 SALES
                 * @param   {Object} param 검색 데이터
                 * @returns {Array}  사업정보 리스트
                 */
                getList: function ( type, param ) {
                    return $http({
                        method	: "POST",
                        url		: APP_CONFIG.domain +"/ordersearch/"+ type,
                        data	: param
                    });
                },

                /**
                 * Excel파일 다운로드를 위한 파일명을 가져온다.
                 * @param {String} type ORDER 또는 SALES
                 * @param {Object} param 검색 데이터
                 * @returns {*}
                 */
                getDownloadFileName: function ( type, param ) {
                    return $http({
                        method	: "POST",
                        url		: APP_CONFIG.domain + "/order/"+ type +"/excel",
                        data	: param
                    });
                },

                /**
                 * 검색된 사업정보 리스트를 Excel파일로 다운로드한다.
                 * @param {String} fileNm getDownloadFileName요청시 받은 파일명
                 * @returns {*}
                 */
                downloadExcel: function ( fileNm ) {
                    return $http({
                        method  : "GET",
                        url     : APP_CONFIG.domain +"/order/exceldown?filename="+ fileNm
                    });
                },


                // [ LOGIC ]
                /**
                 * @description 상세페이지로 이동하기 위한 URL를 구한다.
                 * @param {String} kind insert|update|detail
                 * @param {String} ids 사업 uniq key
                 * @param {Object} dealInfo 사업상세정보
                 * @returns {String} 상세페이지로 이동할 URL
                 */
                getBusinessInfoURL: function ( kind, ids, dealInfo ) {
                    var url = "";
                    if ( kind === "update" ) {
                        if ( dealInfo.WINRATE === 100 ) {
                            url = "/business/businessInfoView?kind=detail&ids=" + ids;
                        } else {
                            if ( dealInfo.STATUS >= 3 ) {
                                url = "/business/businessInfoView?kind=detail&ids=" + ids;
                            }
                        }
                    } else if ( kind === "detail" ) {
                        if ( dealInfo.WINRATE !== 100 ) {
                            url = "/business/businessInfo?kind=update&ids=" + ids;
                        } else {
                            if ( dealInfo.STATUS <= 2 ) {
                                url = "/business/businessInfo?kind=update&ids=" + ids;
                            }
                        }
                    }

                    return url;
                },

                /**
                 * @description 조회된 정보의 total 정보를 구한다.
                 * @param {Array} businessList 조회된 데이터
                 * @returns {*}
                 */
                getSumaryTotal: function ( businessList ) {
                    var
                        tFunnel = 0,
                        tForecast = 0,
                        tCommit = 0,
                        tBill = 0,
                        tCost = 0,
                        tMargin = 0,
                        tMarginRate = 0;

                    if ( angular.isArray( businessList ) ) {
                        angular.forEach( businessList, function ( data ) {
                            if (data.r_BIL_SALES) { tBill += data.r_BIL_SALES; }
                            tFunnel += data.t_SALES;
                            tForecast += data.t_FORCAST;
                            tCommit += data.t_COMMIT;
                            tCost += data.t_BUY;
                            tMargin += data.t_MARGIN;
                        });
                        tMarginRate = (tCommit!==0) ? (tMargin/tCommit)*100 : 0;
                    }

                    return {
                        tFunnel: tFunnel,
                        tForecast: tForecast,
                        tCommit: tCommit,
                        tBill: tBill,
                        tCost: tCost,
                        tMargin: tMargin,
                        tMarginRate: tMarginRate
                    };
                }
            };
        }]);

}());