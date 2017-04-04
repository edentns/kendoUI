(function () {
    "use strict";

    angular.module("edtApp.common.filter")
        // 소수 둘째자리에서 반올림하여 퍼센트를 구한다.
        .filter("percent", [function () {
            return function (num) {
                num = Number(num);
                return num.toFixed(2)+'%';
            };
        }])

        // 반올림하여 소수점 둘째자리까지 구한다.
        .filter("mathFloor", [function () {
            return function (num, unit) {
                var rtnVal = edt.mathFloor(Number(num), 2);
                if (unit) { rtnVal += unit; }
                return rtnVal;
            };
        }])

        // 컴마(,) 포멧팅한다.
        .filter("price", [function () {
            return function (num) {
                return edt.formatPrice(num);
            };
        }]);
}());