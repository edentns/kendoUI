(function () {

'use strict';

function BuAimSalesMngBiz(BuAimSalesMngSvc, SyDepartSvc, AimSales) {
	var CODE_PARAM   = { group: 2},
		AIM_NM_TOTAL = 'TOTAL',
		AIM_NM_DEPT  = 'DEPT',
		AIM_NM_EMPL  = 'EMPL';

	return {
		/**
		 * @name createDeptAndRespCodeParam
		 * @kind function
		 * @description
		 * 소속부서와 영업대표를 가져오기 위한 parameter를 생성한다.
		 *
		 * @param {object} searchData - vm.search.data
		 * @returns {{dept: ({mgr_cd}|{mgr_cd: string}), reps: string}}
		 */
		createDeptAndRespCodeParam: function(searchData) {
			var me = this;
			return {
				dept: me.createDeptCodeParam(searchData),
				resp: me.createRespCodeParam(searchData)
			};
		},
		/**
		 * @name createDeptCodeParam
		 * @kind function
		 * @description
		 * 소속부서를 가져오기 위한 Parameter를 생성한다.
		 *
		 * @param {object} searchData - vm.search.data
		 * @returns {{mgr_cd: string}}
		 */
		createDeptCodeParam: function(searchData) {
			var mgrCode = searchData.kind ? ''+ searchData.kind : '1';
			return { mgr_cd: mgrCode };
		},
		/**
		 * @name createRespCodeParam
		 * @kind function
		 * @description
		 * 영업대표를 가져오기 위한 Parameter를 생성한다.
		 *
		 * @param {object} searchData - vm.search.data
		 * @returns {string}
		 */
		createRespCodeParam: function(searchData) {
			return (searchData.depart !== 1) ? 'sel_dept='+ searchData.depart : (searchData.kind !== 1) ? 'sel_dept='+ searchData.kind : 'sel_dept=1';
		},
		/**
		 * @name getFindParam
		 * @kind function
		 * @description
		 * 검색조건을 생성한다.
		 *
		 * @param {object} searchData - vm.search.data
		 * @returns {object}
		 */
		getFindParam: function (searchData) {
			return {
				year        : ''+ searchData.year,
				kind        : searchData.kind,
				depart      : searchData.depart,
				saleReps    : searchData.salesRep === 1 ? null : searchData.salesRep
			};
		},
		/**
		 * @description
		 * 모델에 데이터를 할당한다.
		 *
		 * @param {object} target - 모델(vm.aim.total|vm.aim.depart|vm.aim.person)
		 * @param {object} data - response result data
		 * @param {boolean} enableWrite - 수정 가능 여부
		 */
		setData: function (target, data, enableWrite) {
			var me = this,
				dataList = [];

			angular.forEach(data.month, function(data) {
				dataList.push(new AimSales(data, { enableWrite: enableWrite }));
			});

			target.data = dataList;
		}
	};
}

BuAimSalesMngBiz.$inject = ['BU.aimSalesMngSvc', 'SY.departSvc', 'AimSales'];


angular.module('BU.aimSalesMng.service')
	.factory('BU.aimSalesMngBiz', BuAimSalesMngBiz);

}());
