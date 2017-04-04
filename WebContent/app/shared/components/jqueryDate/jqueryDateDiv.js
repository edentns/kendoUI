(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("jqueryDate", ["$timeout", function ( $timeout ) {
            return {
                priority    : 0,
                restrict    : "AE",
                scope       : {
                    settingDate : "=ngModel"
                },
                link        : function (scope, elem) {
                    var dateElem = $( elem[0] ).datepicker({
                        dateFormat			: "yy-mm-dd",
                        monthNamesShort		: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
                        dayNamesShort		: ["일", "월", "화", "수", "목", "금", "토"],
                        changeMonth			: true,
                        changeYear			: true,
                        showMonthAfterYear: true,
                        onSelect          : function (selectedDate) {
                            $timeout(function () {
                                scope.settingDate = selectedDate;
                            });
                        }
                    });
                    dateElem.datepicker("setDate", scope.settingDate );
                }
            };
        }]);
}());