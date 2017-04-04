(function () {
    "use strict";

    /**
     * @name analysis.result.service : analysis.resultSvc
     * 사업분석 > 실적분석
     */
    angular.module("analysis.result.service")
        .factory("analysis.resultSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // [CRUD]

                /**
                 * 상위부서 실적정보를 가져온다.
                 * @param {Object} param 검색조건
                 * @returns {*}
                 */
                getSeniorResult: function ( param ) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/analyze/kindresult?"+ $.param( param )
                    });
                },

                /**
                 * 하위부서 실적정보를 가져온다.
                 * @param {Object} param 검색조건
                 * @returns {*}
                 */
                getSubResult: function ( param ) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/analyze/departresult?"+ $.param( param )
                    });
                },

                /**
                 * 개인 실적정보를 가져온다.
                 * @param {Object} param 검색조건
                 * @returns {*}
                 */
                getIndividualResult: function ( param ) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/analyze/salesresult?"+ $.param( param )
                    });
                },


            // [LOGIC]

                /**
                 * 검색조건을 생성한다.
                 * @param {object} searchVO 검색조건 $scope.searchVO
                 * @returns {{kind: *, startPeriod: string, endPeriod: string, depart: number, saleReps: number}}
                 */
                makeSearchParam: function (searchVO) {
                    var period = searchVO.date.period;
                    return {
                        kind		: searchVO.kind,
                        startPeriod	: period.start.y +"-"+ period.start.m +"-"+ period.start.d,
                        endPeriod	: period.end.y +"-"+ period.end.m +"-"+ period.end.d,
                        depart 		: searchVO.depart,
                        saleReps	: searchVO.salesRep
                    };
                },

                /**
                 * @method function
                 * @name getCommonSumaryTotal
                 * @description 상위부서 Total을 구한다.
                 * @param {Array} resultData 상위부서 데이터
                 */
                getCommonSumaryTotal: function (resultData) {
                    var tTargetRevenue 	= 0,
                        tCommit 		= 0,
                        tTargetMargin 	= 0,
                        tMargin 		= 0;

                    angular.forEach(resultData, function (data) {
                        tTargetRevenue 	+= data.TARGET_REVENUE;
                        tCommit 		+= data.COMMIT;
                        tTargetMargin 	+= data.TARGET_MARGIN;
                        tMargin 		+= data.MARGIN;
                    });

                    return {
                        tTargetRevenue	: tTargetRevenue,
                        tCommit 		: tCommit,
                        avgCommitRate	: (tTargetRevenue!==0) ? (tCommit/tTargetRevenue)*100 : 0,
                        tTargetMargin	: tTargetMargin,
                        tMargin 		: tMargin,
                        avgMarginRate	: (tTargetMargin!==0) ? (tMargin/tTargetMargin)*100 : 0
                    };
                },

                getSubSumaryTotal: function (resultData) {
                    var tTargetRevenue 	= 0,
                        tCommit			= 0,
                        tSalesState		= 0,
                        tTargetMargin 	= 0,
                        tMargin			= 0,
                        tMarginState	= 0;

                    angular.forEach(resultData, function (data) {
                        if (data.DEPT_CHECK === "YES") {
                            tTargetRevenue 	+= data.TARGET_REVENUE;
                            tCommit 		+= data.COMMIT;
                            tSalesState		+= data.COMMIT_PRESENT;
                            tTargetMargin 	+= data.TARGET_MARGIN;
                            tMargin 		+= data.MARGIN;
                            tMarginState 	+= data.MARGIN_PRESENT;
                        }

                    });

                    return {
                        tTargetRevenue	: tTargetRevenue,
                        tCommit 		: tCommit,
                        avgCommitRate	: (tTargetRevenue!==0) ? (tCommit/tTargetRevenue)*100 : 0,
                        tSalesState		: tSalesState,
                        tTargetMargin	: tTargetMargin,
                        tMargin 		: tMargin,
                        avgMarginRate	: (tTargetMargin!==0) ? (tMargin/tTargetMargin)*100 : 0,
                        tMarginState	: tMarginState
                    };
                }
            };
        }]);

}());