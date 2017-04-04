(function () {
	'use strict';

	angular
		.module('SV.01svServRec.controller')
		.controller('SvServRecCancelCtrl', SvServRecCancelCtrl);

	SvServRecCancelCtrl.$inject = ['$scope', 'svServRec', '$modalInstance', '$state'];
	function SvServRecCancelCtrl ($scope, svServRec, $modalInstance, $state) {

		svServRec.confirm = function () {
			var self = this,
				param ;

			if (!self.DC_REC_CCL.value) {
				alert(self.DC_REC_CCL.msg.empty);
				return;
			}

			param = self.getRESTParam('CANCEL');

			if (param) {
				self.restProc('UPDATE', param).then(function (res) {
					if (res.data.NO_SERV_REC) { self.NO_SERV_REC.value = res.data.NO_SERV_REC; }
					self.cclFile.api.uploadAll({
						insertedNo: self.NO_SERV_REC.value
					});
				});
			}
		};

		svServRec.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		svServRec.cclFile.onCompleteAll = function (res) {
			alert(res.msg);
			if (!res.state) {
				return;
			}
			$modalInstance.close();
			$state.go('app.svServRec', { kind: 'list', menu: true, ids: null });

		};

		$scope.svServRec = svServRec;
	}
}());
