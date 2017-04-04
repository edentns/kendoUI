(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name edtApp.common.directive : aeInputClickFocus
     * @description
     */
    angular.module("edtApp.common.directive")
        .directive("aeInputClickFocus", [function () {
            return {
                priority    : 1,
                restrict    : "A",
                scope       : true,
                link        : function (scope, element) {
                    var elem  = element[0];

                    elem.addEventListener("click", function () {
                        var value = this.value;
                        if ( value !== "" ) {
                            this.select();
                        }
                    });
                }
            };
        }]);
}());