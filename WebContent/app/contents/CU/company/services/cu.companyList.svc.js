(function () {
    'use strict';

    angular.module('CU.company.service')
        .factory('CU.companyListSvc', ['APP_CONFIG', '$http', function (APP_CONFIG, $http) {
            return {

            // [CRUD]

                /**
                 * 검색조건에 해당하는 고객사 정보를 가져온다.
                 * @param {object} param
                 * @returns {*}
                 */
                getCompanyList: function (param) {
                    return $http({
                        method  : 'GET',
                        url		: APP_CONFIG.domain +'/client?'+ $.param(param)
                    });
                },

                /**
                 * (고객서비스) 고객사를 조회한다.
                 * @param {string=} param 'no_cust=35'
                 * @returns {HttpPromise}
                 */
                getSvCustCmpList: function (param) {
                    var url = APP_CONFIG.domain +'/svClient';
                    if (param) {
                        url += '?'+ param;
                    }
                    
                    return $http.get(url);
                },


            // [LOGIC]
                /**
                 * 고객사 정보를 가져오기 위한 parameter를 생성한다.
                 * @param param
                 * @returns {{client: string, dept: string, sales: string, technic: string}}
                 */
                makeGetListParam : function (param) {
                    var rtnParam = {
                        client  : 'all',
                        dept    : 'all',
                        sales   : 'all',
                        technic : 'all'
                    };

                    if (param) {
                        if (param.client  !== '') { rtnParam.client  = param.client;  }
                        if (param.dept    !== '') { rtnParam.dept    = param.dept;    }
                        if (param.sales   !== '') { rtnParam.sales   = param.sales;   }
                        if (param.technic !== '') { rtnParam.technic = param.technic; }
                    }

                    return rtnParam;
                }
            };
        }]);
}());