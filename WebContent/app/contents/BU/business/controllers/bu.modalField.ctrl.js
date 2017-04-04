(function () {
    "use strict";

    /**
     * @name BU.business.controller : BU.modalFieldCtrl
     * 사업관리 - set column
     */
    angular.module("BU.business.controller")
        .controller("BU.modalFieldCtrl", ["$scope","$modal", "$modalInstance", "gridInfo",
            function ( $scope, $modal, $modalInstance, gridInfo ) {
                var modalView;

                modalView = $scope.modalView = {
                    setting : {
                        type : gridInfo.type,
                        displayColumns: gridInfo.gridDisplayColumns,
                        hideColumns   : gridInfo.gridHideColumns
                    }
                };

                /**
                 * @description 컬럼변경 정보를 부모창에 전달한다.
                 */
                modalView.doConfirm = function () {
                    $modalInstance.close(this.setting);
                };

                /**
                 * @description 모달창을 닫는다.
                 */
                modalView.doCancel = function () {
                    $modalInstance.dismiss("cancel");
                };
            }
        ]);
}());