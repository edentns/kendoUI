(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name SY.login.service:login.LoginService
	 */
	angular.module("SY.login.service")
		.factory("SY.LoginSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {

			return {

			// [CRUD]

				/**
				 * 로그인을 한다.
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {*}
				 */
				login : function (userDataSet) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/login",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param(this.makeLoginParam(userDataSet))
					});
				},

				/**
				 * 로그아웃을 한다.
				 * @returns {*}
				 */
				logout : function () {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/logout",
						headers	: {
							"Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8",
							menuId : ""
						}
					});
				},

				/**
				 * 로그인 여부를 체크한다.
				 * @returns {*}
				 */
				isLogin : function () {
					return $http.get(APP_CONFIG.domain+ "/logincheck");
				},

				getLoginedInfo: function() {
					return $http.get(APP_CONFIG.domain+ "/loginInfo");
				},


			// [LOGIC]

				/**
				 * 로그인 Parameter 생성한다.
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {{CD_C:string, user:string, password:string}}
				 */
				makeLoginParam : function (userDataSet) {
					return {
						CD_C : userDataSet.bsCd,
						user : userDataSet.user,
						password : userDataSet.password
					};
				}

			};
		}]);
}());