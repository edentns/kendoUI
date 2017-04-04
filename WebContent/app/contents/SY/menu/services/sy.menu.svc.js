(function () {
    "use strict";

    /**
     * 메뉴관리
     * SY.menu.service : SY.menuSvc
     */
    angular.module("SY.menu.service")
        .factory( "SY.menuSvc", [ "APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
                /**
                 * 메뉴정보를 가져온다.
                 * @returns {*}
                 */
                getMenuList: function () {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/symenu"
                    });
                }
            };
        }]);
}());