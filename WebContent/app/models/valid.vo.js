(function () {

"use strict";

function ValidVO () {

	var Valid = function (config) {
		var self = this;

		self.id = "";
		self.type  = "string";
		self.value = "";
		self.required  = false;
		self.pattern   = null;
		self.maxlength = 60;
		self.minlength = 0;
		self.placeholder = "";
		self.msg = { empty: "", error: "", print: "" };

		angular.extend(self, config);
	};

	Valid.prototype = {

	};

	return Valid;
}

ValidVO.$inject = [];


angular.module("edtApp.common.model")
	.factory("ValidVO", ValidVO);

}());