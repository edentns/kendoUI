(function () {
    "use strict";

    /**
     * 유저관리 - 상세
     * @name SY.user.service : SY.userInfoSvc
     */
    angular.module("SY.user.service")
        .factory("SY.userInfoSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // CRUD

                /**
                 * 유저의 상세정보를 가져온다.
                 * @param {object} param
                 * @returns {*}
                 */
                getUserDetailInfo: function (param) {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/user/"+ decodeURIComponent( param.cd )
                    });
                },

                /**
                 * 유저정보를 등록한다.
                 * @param {object} param
                 * @returns {*}
                 */
                insert: function (param) {
                    return $http({
                        method  : "POST",
                        url		: APP_CONFIG.domain +"/user",
                        data	: param
                    });
                },

                /**
                 * 유저정보를 수정한다.
                 * @param {object} param
                 * @returns {*}
                 */
                update: function (param) {
                    return $http({
                        method  : "PUT",
                        url		: APP_CONFIG.domain +"/user",
                        data	: param
                    });
                }
            };
        }]);

}());