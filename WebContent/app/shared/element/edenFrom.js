(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name edmsApp.common.directive:defaultDiv
	 * @description
	 * # defaultDiv
	 * ng-model undefined 제거하기 위한 디렉티브
	 */
	angular.module("edtApp.common.directive")
		.directive("edenType", [function () {
			return {
				require		: "ngModel",
				restrict	: "A",
				scope			: {
					edenType	: "@",
					ngModel		: "=ngModel",
					edenChange: "&"
				},
				link			: function ($scope, elem) {
					if ( $scope.edenType === "number" ) {
						$scope.$watch("ngModel", function ( val ) {
							if ( !edt.validNumber( val ) ) {
								$scope.ngModel = val.substring(0, val.length-1);
							} else {
								val = ""+ val;
								$scope.ngModel = edt.formatPrice( val.replace(/,/g, "") );
							}

							if ( $scope.edenChange ) {
								$scope.edenChange();
							}
						});
					} else if ( $scope.edenType === "kor" ) {
						angular.element( elem[0] ).on("blur", function () {
							$scope.ngModel = elem[0].value;
							$scope.$apply();
						});
					}
				}
			};
		}])

		.directive( "modalFoucs", [function () {
			return {
				restrict	: "A",
				priority	: 1,
				link		: function (scope, elem) {
					elem.focus();
				}
			};
		}]);

}());
