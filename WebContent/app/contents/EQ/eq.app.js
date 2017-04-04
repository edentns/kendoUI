(function () {
	"use strict";

	angular.module("edtApp.EQ", [
		'EQ.01eqMaster'
	]);

	angular.module('EQ.01eqMaster', [
			'EQ.01eqMaster.controller',
			'EQ.01eqMaster.service',
			'EQ.01eqMaster.model'
		])
		.config(['$stateProvider', function ($stateProvider) {

			// 관리
			$stateProvider.state('app.eqMng', {
				url		: '/01eqMaster/:kind?menu&ids',
				views	: {
					contentView: {
						templateUrl	: function ($stateParams) {
							if ($stateParams.menu) { $stateParams.kind = 'list'; }
							return 'app/contents/EQ/01eqMaster/templates/eq.01eqMaster'+ edt.getMenuFileName($stateParams.kind) +'.tpl.html';
						},
						controllerProvider: ['$stateParams', function ($stateParams) {
							if ($stateParams.menu) { $stateParams.kind = 'list'; }
							return 'EQ.01eqMaster'+ edt.getMenuFileName($stateParams.kind) +'Ctrl';
						}],
						resolve: {
							resData: ['$q', 'AuthSvc', '$stateParams', 'EQ.01eqMasterSvc',
								function ($q, AuthSvc, $stateParams, EqMasterSvc) {

									var defer   = $q.defer(),
										resData = {};

									AuthSvc.isAccess().then(function (result) {
										resData.access = result[0];

										var isDetail = $stateParams.kind==='detail',
											ids  = $stateParams.ids;
										if (isDetail && ids) {
											EqMasterSvc.getEqmDetail({ ids: ids }).then(function (res) {
												resData.equipment = res.data.result;
												defer.resolve(resData);
											});
										} else {
											defer.resolve(resData);
										}
									});

									return defer.promise;
								}
							]
						}
					}
				}
			});
		}]);

}());