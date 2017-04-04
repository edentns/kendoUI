(function () {

	"use strict";

	function FieldVO (UtilSvc) {

		var Field = function Field(data, validators) {
			var me = this;
			me.name         = "";
			me.displayName  = "";
			me.type         = "string";
			me.value        = null;
			me.defaultValue = "";
			me.order        = 1;
			me.dirty        = false;
			me.validators   = validators || [];

			angular.extend(me, data);
		};

		Field.prototype = {
			validate: function() {
				var me = this,
					nI, nLng, oValidator, oResult;

				for (nI=0, nLng=me.validators.length; nI<nLng; nI++) {
					oValidator  = me.validators[nI];
					oResult     = me.validCategory(oValidator);
					if (!oResult.valid) {
						return oResult;
					}
				}

				return oResult;
			},

			validCategory: function(validator) {
				var me = this;

				switch (validator.category) {
					case "require":
						validator.require = true;
						if (!me.isValid(validator)) {
							return me.getValidResult(false, validator);
						}
						break;
					case "pattern":
						if (me.isValid(validator) &&(!UtilSvc.isType("regexp", validator.value) || !validator.value.test(me.value))) {
							return me.getValidResult(false, validator);
						}
						break;
					case "date":
						if (me.isValid(validator) && !moment(me.value, validator.format, true).isValid()) {
							return me.getValidResult(false, validator);
						}
						break;
					case "period":
						if (me.isValid(validator)) {
							validator.format = validator.format || "YYYY-MM-DD";
							if (!moment(me.value, validator.format, true).isValid()) {
								return me.getValidResult(false, validator);
							}

							if (validator.value === "start" && (new Date(me.value) - new Date(validator.reference) > 0)) {
								return me.getValidResult(false, validator);
							}

							if (validator.value === "end" && (new Date(me.value) - new Date(validator.reference) < 0)) {
								return me.getValidResult(false, validator);
							}
						}

						break;
					case "range":
						if (me.isValid(validator)) {
							if (validator.min || validator.min===0 ) {
								if (me.value < validator.min) {
									return me.getValidResult(false, validator);
								}
							}

							if (validator.max || validator.max===0 ) {
								if (me.value > validator.max) {
									return me.getValidResult(false, validator);
								}
							}
						}
						break;
					case "length":
						break;
					case "zipcode":
						if (me.isValid(validator) && !/^[1-9]\d{2}-\d{3}$|^\d{5}$/.test(me.value)) {
							return me.getValidResult(false, validator);
						}
						break;
					case "address":
						if (me.isValid(validator) && !/^[가-힣a-zA-Z0-9\s\-().[\]&,@]{0,99}$/.test(me.value)) {
							return me.getValidResult(false, validator);
						}
						break;
					case "phone":
						if (me.isValid(validator) && !/(^0\d{1,2}-[1-9]\d{2,3}-\d{4}$|^\d{3,4}-\d{4}$)/.test(me.value)) {
							return me.getValidResult(false, validator);
						}
						break;
					case "fax":
						if (me.isValid(validator) && !/^0\d{1,2}-[1-9]\d{2,3}-\d{4}$/.test(me.value)) {
							return me.getValidResult(false, validator);
						}
						break;
					case "email":
						if (me.isValid(validator) && !/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(me.value)) {
							return me.getValidResult(false, validator);
						}
						break;
					case "enum":
						break;
				}

				return me.getValidResult(true, validator);
			},

			/**
			 * 유효성 결과 정보를 가져온다.
			 * @param {Boolean} result 유효성 결과
			 * @param {Object} validator 유효성 정보
			 * @returns {{type: String, valid: Boolean, validator: Object, message: String}}
			 */
			getValidResult: function(result, validator) {
				var me = this;

				return {
					type    : this.type,
					valid   : result,
					validator: validator,
					message : result ? "유효한 형식입니다." : validator.message || me.getErrorMessage(validator)
				};
			},

			/**
			 * 에러메시지를 가져온다.
			 * @param {Object} validator 유효성 정보
			 * @returns {string} 에레메세지
			 */
			getErrorMessage: function(validator) {
				var me = this,
					defaultMessage  = "[형식] "+ me.displayName +"은(는) 유효하지 않은 형식입니다.",
					messageMap      = {
						"require"   : "[필수] "+ me.displayName +"은(는) 필수 입력값입니다.",
						"period"    : "[기간] ",
						"range"     : "[범위] "+ me.displayName +"의 범위("+ validator.min +"~"+ validator.max  +")가 유효하지 않습니다.",
						"length"    : "[길이] "+ me.displayName +"의 길이("+ validator.min +"~"+ validator.max  +")가 유효하지 않습니다.",
						"zipcode"   : "[우편번호] "+ me.displayName +"은(는) 유효하지 않은 형식입니다.",
						"address"   : "[주소] "+ me.displayName +"은(는) 유효하지 않은 형식입니다.",
						"phone"     : "[PHONE] "+ me.displayName +"은(는) 유효하지 않은 형식입니다.",
						"fax"       : "[FAX] "+ me.displayName +"은(는) 유효하지 않은 형식입니다.",
						"email"     : "[이메일] "+ me.displayName +"은(는) 유효하지 않은 형식입니다."
					};

				return messageMap[validator.category] || defaultMessage;
			},

			/**
			 * include를 포함하여 유효한 값인지 판단한다.
			 * @param {Object} validator
			 * @returns {boolean}
			 */
			isValid: function(validator) {
				var me = this;
				return !(!me.value && (!validator.include || validator.include.indexOf(me.value) === -1));
			}
		};

		return Field;
	}

	FieldVO.$inject = ["UtilSvc"];


	angular.module("edtApp.common.model")
		.factory("FieldVO", FieldVO);

}());