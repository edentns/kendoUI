(function () {
    "use strict";

    /**
     * @name analysis.change.service : analysis.changeSvc
     * 사업분석 > 변경분석
     */
    angular.module("analysis.change.service")
        .factory("analysis.changeSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // [CRUD]

                /**
                 * 변경분석정보를 가져온다.
                 * @param {object} param 검색 parameter
                 */
                getChangeInfo: function (param) {
                    return $http({
                        method  : "GET",
                        url     : APP_CONFIG.domain +"/analyze/alteration?"+ $.param(param)
                    });
                },

            // [LOGIC]

                /**
                 * 검색을 위한 parameter를 생성한다.
                 * @param {string} tabType ORDER|SALES
                 * @param flag
                 * @param {object} searchVO 검색조건
                 * @returns {object}
                 */
                makeSearchParam: function (tabType, flag, searchVO) {
                    var period = searchVO.date.period;
                    return {
                        flag  : flag,
                        kind  : searchVO.kind,
                        depart 	    : searchVO.depart,
                        saleReps	: searchVO.salesRep,
                        startPeriod	: period.start.y +"-"+ period.start.m +"-"+ period.start.d,
                        endPeriod	: period.end.y +"-"+ period.end.m +"-"+ period.end.d,
                        type        : tabType
                    };
                }
            };
        }]);

}());