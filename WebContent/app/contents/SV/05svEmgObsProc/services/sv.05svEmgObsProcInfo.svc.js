(function () {
    "use strict";

    /**
     * @name SV.05svEmgObsProc.service : SV.05svEmgObsProcInfoSvc
     */
    angular.module("SV.05svEmgObsProc.service")
        .service("SV.05svEmgObsProcInfoSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
        	var self = this;

        	/**
             * 긴급장애를 등록한다.
             * @param   {Object} param - 등록될 데이터
             * @returns {Object} result
             */
            self.insert = function ( param ) {
                return $http({
                    method	: "POST",
                    url			: APP_CONFIG.domain +"/svEmgObsProc",
                    data		: param
                });
            };

            /**
             * 사업을 수정한다.
             * @param   {Object} param - 수정될 데이터
             * @returns {Object} result
             */
            self.update = function ( param ) {
                return $http({
                    method	: "PUT",
                    url			: APP_CONFIG.domain +"/svEmgObsProc",
                    data		: param
                });
            };
                
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
        }]);

}());