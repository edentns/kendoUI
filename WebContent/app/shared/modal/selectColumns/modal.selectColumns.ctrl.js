(function () {
    "use strict";

    /**
     * modal - column 설정
     */
    angular.module("edtApp.common.modal")
        .controller("modal.selectColumnsCtrl", ["$scope", "$modalInstance", "revColumns",
            function ($scope, $modalInstance, revColumns) {
                var columnVO = $scope.columnVO = {
                    data : {
                        showColumns : angular.copy(revColumns.showColumns, []),
                        hideColumns : angular.copy(revColumns.hideColumns, [])
                    }
                };

                /**
                 * column 설정 정보를 부모차에 전달하고, layer popup창을 닫는다.
                 */
                columnVO.confirm = function () {
                    $modalInstance.close(this.data);
                };

                /**
                 * column 설정을 취소하고 layer popup을 닫는다.
                 */
                columnVO.cancel = function () {
                    $modalInstance.dismiss("cancel");
                };
            }
        ]);

}());