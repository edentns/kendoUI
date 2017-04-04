(function () {
    "use strict";

    /**
     * 유저관리 - 리스트
     * @name SY.user.service : SY.userListSvc
     */
    angular.module("SY.user.service")
        .factory("SY.userListSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // CRUD

                /**
                 * 검색조건에 해당하는 유저정보를 가져온다.
                 * @param {object} param
                 * @returns {*}
                 */
                getUserList : function (param) {
                    return $http({
                        method  : "GET",
                        //url		: APP_CONFIG.domain +"/user?"+ $.param( param )
                        url		: APP_CONFIG.domain +"/user?"+ param
                    });
                },

                /**
                 * 검색조건으로 영업사원을 가져온다.
                 * @param {Array.<{ sel_dept:Number }>} param
                 * @returns {*}
                 */
                getUserSearchCode : function (param) {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/user?"+ param
                    });
                },


            // LOGIC
                makeGetUserParam : function (param) {
                    var rtnGetParam = "",
                        defaults = {
                            dept : "all",
                            pos  : "all",
                            name : "all",
                            status  : "JOINED"
                        };

                    if (angular.isArray(param)) { rtnGetParam = edt.makeGetParam(param, "sel_dept"); }
                    else {
                        edt.extend(param, defaults, false);
                        rtnGetParam = $.param(param);
                    }

                    return rtnGetParam;
                }
            };
        }]);

}());