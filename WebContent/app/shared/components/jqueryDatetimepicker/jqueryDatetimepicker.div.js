(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("jqueryDatetimepicker", ["$timeout", function ( $timeout ) {
            return {
                priority  : 0,
                restrict  : 'AE',
                scope     : {
                    jqDate: '=ngModel',
                    jqOption: '=option'
                },
                link: function (scope, element, attrs) {
                    var defaultOption = {
                            lang: 'ko',
                            format: 'Y-m-d H:i:s',
                            timepicker: true,
                            onChangeDateTime: function (dp, $input) {
                                scope.jqDate = $input.val();
                            }
                        },
                        datetimeElm;

                    angular.extend(defaultOption, scope.jqOption);

                    datetimeElm = $(element[0]).datetimepicker(defaultOption);
                    datetimeElm.on('blur', function () {
                        datetimeElm.datetimepicker('hide');
                    });

                    scope.$on('$destroy', function () {
                        datetimeElm.datetimepicker('hide');
                        datetimeElm.remove();
                    });
                }
            };
        }]);
}());
