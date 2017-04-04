(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("edtSelect", ["$timeout", function ($timeout) {
            return {
                restrict: "A",
                require : "ngModel",
                scope   : {
                    value : "=ngModel"
                },
                link : function (scope, element) {
                    element.select2({
                        placeholder : "고객사를 선택해주세요.",
                        allowClear  : true
                    });

                    scope.$watch("value", function (newVal, prevVal) {
                        $timeout(function () {
                            element.select2("val", newVal);
                        }, 1);
                    });
                }
            };
        }]);
}());