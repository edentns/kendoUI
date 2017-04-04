(function () {

'use strict';

function AimSalesMngCtrl ($scope, resData, UtilSvc, AimSales, BuAimSalesMngSvc, BuAimSalesMngBiz, Page, $q, $timeout, SyDepartSvc, SyUserListSvc, APP_AUTH) {
	var page  = $scope.page = new Page({ auth: resData.access });

	page.setPreProcessor('code', function(next) {
		var me = this,
			param =  BuAimSalesMngBiz.createDeptAndRespCodeParam(search.data);

		me.code = {
			seniorCodeList  : [],
			departCodeList  : [],
			salesRepList    : []
		};

		$q.all([
			SyDepartSvc.getMngDepart({ wk_grp: 2 }),
			SyDepartSvc.getDepart(param.dept),
			SyUserListSvc.getUserSearchCode(param.resp)
		]).then(function ( result ) {
			var allCode = { CD: 1, NAME: '전체' };
			result[0].data.unshift(allCode);
			result[1].data.unshift(allCode);
			result[2].data.unshift(allCode);

			me.code.seniorCodeList  = result[0].data;
			me.code.departCodeList  = result[1].data;
			me.code.salesRepList    = result[2].data;

			next();
		});
	});
	
	var	today = edt.getToday(),
		tabs = [
			{ title: '월별', active: true },
			{ title: '분기별', active: false }
		],
		header = {
			month   : ['구분', '합계', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			quarter : ['구분', '합계', '1분기', '2분기', '3분기', '4분기']
		},
		vm = {
			isAccessTotal   : page.isAccessable(APP_AUTH.ALL),
			isAccessDepart  : page.isAccessable(APP_AUTH.ALL, APP_AUTH.MANAGER, APP_AUTH.TEAM),
			save    : function(aim) {
				aim.save().then(function() {
					alert('저장되었습니다.');
					!aim.userId ? (search.inquiry({ total : 'TOTAL', depart: 'DEPT' })) : search.inquiry({ person: 'EMPL' });
				});
			}
		},
		search, aim;

	/**
	 * @name vm.search
	 * @kind object
	 * @description
	 * 목표매출 검색
	 *
	 * @type {{boxTitle: string, data: {year, kind: number, depart: number, salesRep: number}}}
	 */
	search = vm.search = {
		boxTitle: '검색',
		data: {
			year        : today.y,
			kind        : (page.isAccessAll())  ? 1 : page.user.deptCode,
			depart      : 1,
			salesRep    : 1
		}
	};
	/**
	 * @name vm.search.inquiry
	 * @kind function
	 * @description
	 * 목표매출정보를 조회한다.
	 */
	search.inquiry = function(list) {
		list = list || { total : 'TOTAL', depart: 'DEPT', person: 'EMPL' };

		var me = this,
			param = BuAimSalesMngBiz.getFindParam(me.data);

		angular.forEach(list, function(type, key) {
			BuAimSalesMngSvc.find(type, param).then(function(response) {
				BuAimSalesMngBiz.setData(vm.aim[key], response.data.result, page.isWriteable());
			});
		});

	};
	/**
	 * @name vm.search.init
	 * @kind function
	 * @description
	 * 목표매출 검색조건을 초기화한다.
	 */
	search.init = function() {
		var me = this;

		me.data.year    = today.y;
		me.data.kind    = (page.isAccessAll())  ? 1 : page.user.deptCode;
		me.data.depart  = 1;
		me.data.salesRep= 1;

		$timeout(function() {
			me.inquiry({ total : 'TOTAL', depart: 'DEPT', person: 'EMPL' });
		}, 0);
	};
	/**
	 * @name vm.search.getDeptAndResp
	 * @kind function
	 * @description
	 * 상위부서 선택시 하위부서/팀 과 영업대표를 가져온다.
	 */
	search.getDeptAndResp = function () {
		var me = this,
			param;

		me.data.depart      = 1;
		me.data.salesRep    = 1;
		param = BuAimSalesMngBiz.createDeptAndRespCodeParam(me.data);

		$q.all([
			SyDepartSvc.getDepart(param.dept),			    // 소속코드리스트
			SyUserListSvc.getUserSearchCode(param.resp) 	// 영업사원코드리스트
		]).then(function ( result ) {
			page.code.departCodeList    = page.code.departCodeList.slice(0, 1).concat(result[0].data);
			page.code.salesRepList      = page.code.salesRepList.slice(0, 1).concat(result[1].data);
		});
	};
	/**
	 * @name vm.search.getSalesUser
	 * @kind function
	 * @description
	 * 영업대표 리스트를 가져온다.
	 */
	search.getSalesUser = function () {
		var me = this,
			param;

		me.data.salesRep = 1;
		param = BuAimSalesMngBiz.createRespCodeParam(me.data);

		SyUserListSvc.getUserSearchCode(param).then(function (result) {
			page.code.salesRepList = page.code.salesRepList.slice(0, 1).concat(result.data);
		});
	};

	/**
	 * 목표매출
	 */
	aim = vm.aim = {
		boxTitle: '목표매출'
	};
	/**
	 * AIM - TOTAL
	 */
	aim.total = {
		boxTitle: 'TOTAL',
		tabs    : angular.copy(tabs, []),
		header  : header,
		data    : []
	};
	/**
	 * AIM - 부서
	 */
	aim.depart = {
		boxTitle: '부서별',
		tabs    : angular.copy(tabs, []),
		header  : {
			month   : ['부서'].concat(header.month),
			quarter : ['부서'].concat(header.quarter)
		},
		data: []
	};
	/**
	 * AIM - 개인
	 */
	aim.person = {
		boxTitle: '개인별',
		tabs    : angular.copy(tabs, []),
		header  : {
			month   : ['부서', '이름'].concat(header.month),
			quarter : ['부서', '이름'].concat(header.quarter)
		},
		data: []
	};

	$scope.vm = vm;


	page.bootstrap(function() {
		$timeout(function() {
			search.inquiry();
		}, 0);
	});
}

AimSalesMngCtrl.$inject = ['$scope', 'resData', 'UtilSvc', 'AimSales', 'BU.aimSalesMngSvc', 'BU.aimSalesMngBiz', 'Page', '$q', '$timeout', 'SY.departSvc', 'SY.userListSvc', 'APP_AUTH'];
angular.module('BU.aimSalesMng.controller')
	.controller('BU.AimSalesMngCtrl', AimSalesMngCtrl);

}());