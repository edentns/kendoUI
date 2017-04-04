(function () {
	"use strict";

angular.module("edtApp.common.directive")
	.directive("hpdFormat", [function () {
		return {
			require : "ngModel",
			restrict: "A",
			scope	: {
				model : "=ngModel",
				format  : "@hpdFormat",
				change: "&hpdChange"
			},
			link: function (scope, element) {

				var priceReg = /[^(\d)]/gi;

				element.on("click", function () {
					this.select();
				});

				scope.$watch("model", function (current, previous) {
					current += "";

					if (current === previous) { return; }

					switch (scope.format) {
						case "price":
							scope.model = edt.formatPrice(current.replace(priceReg, ""));
							break;
					}
				});

				scope.$on("$destroy", function () {
					element.remove();
				});
			}
		};
	}]);

}());
