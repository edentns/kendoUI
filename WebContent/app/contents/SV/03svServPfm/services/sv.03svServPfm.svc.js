(function () {
    "use strict";

    angular
        .module("SV.03svServPfm.service")
        .service("SV.03svServPfmSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            var self = this;

            /**
             * 접수번호(NO_SERV_REC) 계획번호(NO_SERV_PLN) 수행번호(NO_SERV_PFM)
             * @param param
             * @returns {*}
             */
            self.getSvServPfm = function (param) {
                return $http({
                    method: 'GET',
                    url: APP_CONFIG.domain +'/svServ?'+ $.param(param)
                });
            };

            /**
             * 서비스 수행 등록
             * @param {object} data
             * @returns {promise}
             */
            self.insert = function (data) {
                return $http({
                    method : 'POST',
                    url    : APP_CONFIG.domain +'/svServPfm',
                    data   : data
                });
            };

            /**
             * 서비스 수행 수정
             * @param {object} data
             * @returns {promise}
             */
            self.update = function (data) {
                return $http({
                    method : 'PUT',
                    url    : APP_CONFIG.domain +'/svServPfm',
                    data   : data
                });
            };

            /**
             * 서비스 수행결과를 반려한다.
             * @param {object} data
             * @returns {promise}
             */
            self.cancel = function (data) {
                return $http({
                    method: 'PUT',
                    url: APP_CONFIG.domain +'/svServPfm/reject',
                    data: data
                });
            };

            /**
             * 서비스 수행자 중복 체크
             * @param {object} param
             * @returns {promise}
             */
            self.pfmrDupCheck = function (data) {
                return $http({
                    method : 'POST',
                    url    : APP_CONFIG.domain +'/svServPfm/pfmr',
                    data   : data
                });
            };
        }]);
}());