(function () {
    "use strict";

    /**
     * @name BU.business.service : BU.businessInfoSvc
     */
    angular.module("BU.business.service")
        .factory("BU.businessInfoSvc", ["APP_CONFIG", "APP_AUTH", "$http", "$rootScope", function (APP_CONFIG, APP_AUTH, $http, $rootScope) {
            var webApp = $rootScope.webApp;

            function checkBusinessState(buInfo) {
                // (3-수주완료, 4-수주실패, 5-수주지연, 6-수주취소, 7-수주이관, 8-READ
                if (buInfo.STATUS >= 3) {
                    if (buInfo.STATUS === 3) {
	                    return buInfo.REVENUE_FLAG ? 4 : 3;
                    }
                    else { return 4; }
                }
                else { return 2; }
            }

            return {

            // [CRUD]

                /**
                 * 검색조건에 해당하는 목표매출정보를 가져온다.
                 * @param   {Object} param - 상제정보를 가져올 유니크 키값
                 * @returns {Object} 사업상세정보
                 */
                getOrderDetailInfo: function ( param ) {
                    return $http({
                        method: "GET",
                        url: APP_CONFIG.domain +"/order/"+ param.uniqCd
                    });
                },

                /**
                 * ORDER 또는 SALES 정보 리스트를 가져온다.
                 * @param   {String} type  - ORDER 또는 SALES
                 * @param   {Object} param - 검색 데이터
                 * @returns {Array}  사업정보 리스트
                 */
                getList: function ( type, param ) {
                    return $http({
                        method	: "POST",
                        url			: APP_CONFIG.domain +"/ordersearch/"+ type,
                        data		: param
                    });
                },

                /**
                 * 사업을 등록한다.
                 * @param   {Object} param - 등록될 데이터
                 * @returns {Object} result
                 */
                insert: function ( param ) {
                    return $http({
                        method	: "POST",
                        url			: APP_CONFIG.domain +"/order",
                        data		: param
                    });
                },

                /**
                 * 사업을 수정한다.
                 * @param   {Object} param - 수정될 데이터
                 * @returns {Object} result
                 */
                update: function ( param ) {
                    return $http({
                        method	: "PUT",
                        url			: APP_CONFIG.domain +"/order",
                        data		: param
                    });
                },

                /**
                 * @description Upload된 file을 삭제한다.
                 * @param {Array} deleteFileList 삭제할 파일 리스트
                 * @returns {*}
                 */
                deleteFile: function ( deleteFileList ) {
                    return $http({
                        url    : APP_CONFIG.domain +"/order/file?"+ edt.makeStringParam( deleteFileList ),
                        method : "DELETE"
                    });
                },

                /**
                 * 중복딜 여부를 체크한다.
                 * @param param
                 * @returns {*}
                 */
                checkDuplicateOrder :  function ( param ) {
                    return $http({
                        url : APP_CONFIG.domain +"/orderdupcheck",
                        method : "POST",
                        data : param
                    });
                },


            // [LOGIC]

                /**
                 * 사업상세 상태코드를 구한다.(0-권한없음, 1-insert, 2-update, 3-part update, 4-read)
                 * @param {string} kind insert|detail
                 * @param {number} page
                 * @param {object} buInfo
                 * @returns {number}
                 */
                getBuStatus : function (kind, page, buInfo) {
                    var userId = page.user.id.toUpperCase();
                    if (kind === "insert") {
                        return page.isSalesWorkGroup() ? 1 : 0;
                    } else {
	                    if (page.isWriteable(APP_AUTH.ALL)) {
		                    return 2;
	                    }
	                    else {
                            if (page.isWriteable()) {
                                if (page.isWriteable(APP_AUTH.INDIVIDUAL)) {
                                    if ((userId === buInfo.OWN_EMP_CD) || (userId === buInfo.SUB_EMP_CD)) {
                                        return checkBusinessState(buInfo);
                                    }
                                    else { return 8; }
                                } else {
                                    return checkBusinessState(buInfo);
                                }
                            }
                            else { return 8; }
	                    }
                    }
                },

	            /**
	             * 진행상태가 수주이관인지 판단한다.
	             * @param param
	             * @returns {boolean}
	             */
	            isOrderControlTransfer: function(param) {
		            return param.STATUS === 7;
	            }
            };
        }]);

}());
