(function () {
    'use strict';

    angular
        .module('SV.02svServPln.service')
        .service('SV.02svServPlnSvc', ['APP_CONFIG', '$http', function (APP_CONFIG, $http) {
            var self = this;

            /**
             * 접수번호(NO_SERV_REC) 계획번호(NO_SERV_PLN) 수행번호(NO_SERV_PFM)
             * @param {{NO_SERV_REC:string}} param
             * @returns {*}
             */
            self.getSvServPln = function (param) {
                return $http({
                    method: 'GET',
                    url: APP_CONFIG.domain +'/svServ?'+ $.param(param)
                });
            };

            /**
             * 계획정보를 등록, 수정, 삭제한다.
             * @param {string} method
             * @param {object} param
             * @returns {*}
             */
            self.save = function (method, param) {
                return $http({
                    method: method,
                    url: APP_CONFIG.domain +'/svServPln',
                    data: param
                });
            };
        }]);
}());