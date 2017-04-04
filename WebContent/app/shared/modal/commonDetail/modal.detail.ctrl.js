/**
 * 공통 상세 팝업 BOX
 * Created by js.choi on 2015.08.25
 */
(function () {
	'use strict';

	function ModalDetailCtrl ($scope, $modalInstance, resData) {
		$scope.title = resData.title;
		$scope.template = resData.template;
		$scope.vm = resData.vm;

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
	ModalDetailCtrl.$inject = ['$scope', '$modalInstance', 'resData'];

	angular
		.module('edtApp.common.modal')
		.controller('ModalDetailCtrl', ModalDetailCtrl);
}());