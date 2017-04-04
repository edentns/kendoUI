(function () {
    "use strict";

    angular.module("CU.charge.service")
        .factory("CU.chargeInfoSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // [CRUD]

                /**
                 * 하나의 상세 담당자 정보를 가져온다.
                 * @param {object} param
                 * @returns {*}
                 */
                getDetailChargeInfo: function (param) {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/client/dmpl/"+ param.cust_cd +"/"
                    });
                },

                /**
                 * 담당자를 등록한다.
                 * @param {object} param
                 * @returns {*}
                 */
                insert: function (param) {
                    return $http({
                        method  : "POST",
                        url		: APP_CONFIG.domain +"/client/dmpl",
                        data	: param
                    });
                },

                /**
                 * 담당자 정보를 수정한다.
                 * @param {object} param
                 * @returns {*}
                 */
                update: function (param) {
                    return $http({
                        method  : "PUT",
                        url		: APP_CONFIG.domain +"/client/dmpl",
                        data	: param
                    });
                },

                /**
                 * 담당자를 삭제한다.
                 * @param {object} param
                 * @returns {*}
                 */
                delete: function (param) {
                    var strParam = "",
                        i, lng;

                    for (i=0, lng=param.length; i<lng; i+=1) {
                        if ( i < (lng-1) ) {
                            strParam += $.param( param[i] ) +"&";
                        } else {
                            strParam += $.param( param[i] );
                        }
                    }

                    return $http({
                        method  : "DELETE",
                        url		: APP_CONFIG.domain +"/client/dmpl?"+ strParam
                    });
                }


            // [LOGIC]

            };
        }]);
}());