(function () {
	"use strict";

	angular.module("edtApp.common.filter")
		.filter("unsafe", ['$sce', function ($sce) {
			return $sce.trustAsHtml;
		}]);
}());