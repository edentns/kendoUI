(function () {
    "use strict";

    /**
     * 권한관리
     * @name SY.auth.service : SY.authSvc
     */
    angular.module("SY.auth.service")
        .factory("SY.authSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // [CRUD]

                /**
                 * 권한코드를 가져온다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                getAuthList: function (oParam) {
                    var url = APP_CONFIG.domain +"/sygrp";
                    if (angular.isObject(oParam)) {
                        url += "?"+ $.param(oParam);
                    }

                    return $http({
                        method  : "GET",
                        url		: url
                    });
                },

                /**
                 * 권한메뉴를 가져온다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                getMenuAuthList : function (oParam) {
                    var url = APP_CONFIG.domain + "/sygrpmenu";
                    //var url = "json/auth/authMng.menu.json";
                    if (angular.isObject(oParam)) {
                        url += "?"+ $.param(oParam);
                    }

                    return $http({
                        method  : "GET",
                        url		: url
                    });
                },

                /**
                 * 권한코드를 저장한다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                saveAuth : function (oParam) {
                    return $http({
                        method  : "POST",
                        url     : APP_CONFIG.domain +"/sygrp",
                        data    : oParam
                    });
                },

                /**
                 * 메뉴권한코드를 저장한다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                saveMenuAuth : function (oParam) {
                    return $http({
                        method  : "POST",
                        url     : APP_CONFIG.domain +"/sygrpmenu",
                        data    : oParam
                    });
                }
            };
        }]);

}());