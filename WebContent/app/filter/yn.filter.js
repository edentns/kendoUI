(function () {
    "use strict";

    angular.module("edtApp.common.filter")
        .filter('ynText', [function () {
            return function (ynValue, yText, nText) {
                if (ynValue==='Y' || ynValue.toUpperCase()==='YES') {
                    return yText;
                } else {
                    return nText;
                }
            }
        }])

        .filter("ynUse", [function () {
            return function (sYnUse, sY, sN) {
                var rtnValue = "";
                switch (sYnUse) {
                    case "Y" :
                        rtnValue = (angular.isString(sY)) ? sY : "사용";
                        break;

                    case "N" :
                        rtnValue = (angular.isString(sN)) ? sN : "사용안함";
                        break;

                    default :
                        break;
                }

                return rtnValue;
            };
        }])

        .filter("ynExe", [function () {
            return function (sYnUse) {
                var rtnValue = "";
                switch (sYnUse) {
                    case "Y" :
                        rtnValue = "실행";
                        break;

                    case "N" :
                        rtnValue = "폴더";
                        break;

                    default :
                        break;
                }

                return rtnValue;
            };
        }]);
}());