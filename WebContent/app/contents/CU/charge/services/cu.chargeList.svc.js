(function () {
    'use strict';

    angular.module('CU.charge.service')
        .factory('CU.chargeListSvc', ['APP_CONFIG', '$http', function (APP_CONFIG, $http) {
            return {
                /**
                 * 검색조건에 해당하는 담당자 정보를 가져온다.
                 * @param {object} param
                 * @returns {*}
                 */
                getChargeList: function (param) {
                    return $http({
                        method  : 'GET',
                        url		: APP_CONFIG.domain +'/client/dmpl?'+ $.param(param)
                    });
                },

	            /**
	             * (고객서비스) 고객사담당자를 조회한다.
	             * @param {string=} param 'no_cust=35'
	             * @returns {HttpPromise}
	             */
	            getSvCustCmpChargeList: function (param) {
		            var url = APP_CONFIG.domain +'/svClient/dmpl';
		            if (param) {
			            url += '?'+ param;
		            }

		            return $http.get(url);
	            }
            };
        }]);

}());