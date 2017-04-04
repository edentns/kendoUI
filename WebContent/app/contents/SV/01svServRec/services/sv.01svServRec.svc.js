(function () {
    "use strict";

    /**
     * @name SV.svServRec.service : SV.svServRecListSvc
     */
    angular.module("SV.01svServRec.service")
        .service("SV.01svServRecSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            var self = this;

            /**
             * 접수번호(NO_SERV_REC) 계획번호(NO_SERV_PLN) 수행번호(NO_SERV_PFM)
             * @param param
             * @returns {*}
             */
            self.getSvServRec = function (param) {
                return $http({
                    method: 'GET',
                    url: APP_CONFIG.domain +'/svServ?'+ $.param(param)
                });
            };

            /**
             * 서비스 접수 등록
             * @param {object} data
             * @returns {promise}
             */
            self.insert = function (data) {
                return $http({
                    method : 'POST',
                    url    : APP_CONFIG.domain +'/svServRec',
                    data   : data
                });
            };

            /**
             * 서비스 접수 수정
             * @param {object} data
             * @returns {promise}
             */
            self.update = function (data) {
                return $http({
                    method : 'PUT',
                    url    : APP_CONFIG.domain +'/svServRec',
                    data   : data
                });
            };

        }]);

}());