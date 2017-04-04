(function () {
    "use strict";

    /**
     * @name BU.meeting.service : BU.meetingListSvc
     */
    angular.module("BU.meeting.service")
        .factory("BU.meetingListSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // [CRUD]
                
                /**
                 * @description 회의록 리스트를 가져온다.
                 * @param {Object} param 검색조건 { startDate: string, endDate: string }
                 */
                getMeetingList : function (param) {
                    return $http({
                        method  : "GET",
                        url     : APP_CONFIG.domain + "/analyze/meeting?"+ $.param( param )
                    });
                },


            // [LOGIC]

                /**
                 * @description 검색조건 parameter를 생성한다.
                 * @param {Object} searchVO 검색 VO
                 */
                makeSearchParam : function ( searchVO ) {
                    var date = searchVO.date;
                    return {
                        startDate : date.start,
                        endDate   : date.end
                    };
                },

                /**
                 * @description jquery table 정보를 보여주기위한 dataList를 생성한다.
                 * @param {Array} dataList 조회된 회의록 데이터 리스트
                 */
                makeTableData : function ( dataList ) {
                    var rtnDataList = [];
                    angular.forEach( dataList, function ( dataInfo ) {
                        var obj = {
                            "UNIQ_CD"       : dataInfo.UNIQ_CD,
                            "TITLE"         : dataInfo.TITLE,
                            "CREATOR_NAME"  : dataInfo.CREATOR_NAME,
                            "UPDATER_NAME"  : dataInfo.UPDATER_NAME,
                            "CREATE_DT"     : dataInfo.CREATE_DT,
                            "UPDATE_DT"     : dataInfo.UPDATE_DT
                        };
                        rtnDataList.push( obj );
                    });
                    return rtnDataList;
                }
            };
        }]);

}());