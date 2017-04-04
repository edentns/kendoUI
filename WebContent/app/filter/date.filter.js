(function () {
	"use strict";

	angular.module("edtApp.common.filter")
		/**
		 * date를 포멧한다.
		 */
		.filter("edtDate", [function () {
			return function (pDate, pFormat) {
				pFormat = pFormat || "-";

				var	dateForm = new Date(pDate),
					y, m, d;

				if (dateForm.toString() === "Invalid Date") {
					var aDate = pDate.substring(0,10).split(pFormat);
					y = aDate[0];
					m = aDate[1];
					d = aDate[2];

				} else {
					y = dateForm.getFullYear();
					m = edt.fillSpace(dateForm.getMonth()+1);
					d = edt.fillSpace(dateForm.getDate());
				}

				return y + pFormat + m + pFormat + d;
			};
		}]);
}());