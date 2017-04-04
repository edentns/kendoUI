(function () {
    'use strict';

    /**
     * @name SV.svServRec.service : SV.svServRecListSvc
     */
    angular.module('SV.04svRecResProc.service')
        .service('SV.04svRecResProcSvc', ['APP_CONFIG', '$http', 'SV.01svServRecSvc', function (APP_CONFIG, $http, SvServRecSvc) {
            var self = this;

            /**
             * 접수번호(NO_SERV_REC) 계획번호(NO_SERV_PLN) 수행번호(NO_SERV_PFM)
             * @param param
             * @returns {*}
             */
            self.getSvServRecProc = function (param) {
                return $http({
                    method: 'GET',
                    url: APP_CONFIG.domain +'/svServ?'+ $.param(param)
                });
            };

            /**
             * 접수결과처리를 한다.
             * @param {object} data
             * @returns {promise}
             */
            self.save = function (data) {
                return SvServRecSvc.update(data);
            };
        }]);

}());