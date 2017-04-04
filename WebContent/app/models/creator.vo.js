(function () {
	'use strict';

	angular
		.module('edtApp.common.model')
		.factory('CreatorVO', [function () {
			return Creator;
		}]);

	/**
	 ** Model 공통요소 Constructor
	 * @param {object} config 설정값
	 * @constructor
	 */
	function Creator (config) {
		var self = this;
		self.elemId = '';
		self.type   = 'string';
		self.value  = '';
		self.required  = false;
		self.pattern   = null;
		self.maxlength = 60;
		self.minlength = 0;
		self.placeholder = '';
		self.msg = {
			empty: '',
			error: ''
		};
		self._showMsg = '';

		angular.extend(self, config);
	}

	Creator.prototype = {
		focus: function () {
			var elem = document.getElementById(self.elemId);
			if (elem) { elem.focus(); }
		},

		showMsg: function () {
			var self = this;
			alert(self._showMsg);
			self.focus();
		},

		valid: function () {
			var self = this;
			if (!self.value) {
				if (self.required) {
					self._showMsg = self.msg.empty;
					return false;
				}
			} else {
				if (!self._validType(self.type, self.value)) {
					self._showMsg = self.msg.error;
					return false;
				}

				if (self.pattern) {
					if (!self.pattern.test(self.value)) {
						self._showMsg = self.msg.error;
						return false;
					}
				}
			}

			return true;
		},

		_validType: function (type, value) {
			var upperType = type.toUpperCase(),
				valid = true;

			switch (upperType) {
				case 'STRING':
					valid = (typeof value) === 'string';
					break;

				case 'NUMBER':
					valid = (typeof value) === 'number';
					break;

				case 'ARRAY':
					valid = Object.prototype.toString.call(value) === '[object Array]';
					break;

				case 'OBJECT':
					valid = Object.prototype.toString.call(value) === '[object Object]';
					break;
			}

			return valid;
		}
	};

}());