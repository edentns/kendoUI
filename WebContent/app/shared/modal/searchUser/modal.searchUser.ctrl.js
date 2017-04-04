(function () {
	"use strict";


	function ModalSearchUserCtrl ($scope, ModalSearchUserSvc, ngTableParams, $filter, dpParam, $modalInstance) {

		var View = {
			departCodeList : [],
			bPristine : true,
			data   : [],

			// 검색조건
			search : {
				dept: '',
				name: '',
				wk_grp : '0',    // 전체-0, 영업직군-2, 컨설턴트직군-6
				status: 'JOINED',
				searchFlag: '' // 하위부서 검색시 UnderSearch
			},

			// 선택된 유저정보
			selectedUser: {
				roleCd	 : "",
				departCd : "",
				depart	 : "",
				empNo	 : "",
				name	 : ""
			}
		};

		View.table = {
			tableParams: new ngTableParams({
					page	: 1,
					count	: 5,
					isShowSelectLength: false
				}, {
					total	: View.data.length,
					getData: function($defer, params) {
						var orderedData = params.sorting() ? $filter( "orderBy" )(View.data, params.orderBy()) : View.data;
						params.total(orderedData.length);
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				}),

			/**
			 * 테이블 데이터를 갱신하다.
			 * @param {Array} paData 검색된 유저정보리스트
			 */
			reload: function (paData) {
				this.tableParams.settings({ data: paData });
				this.tableParams.page(1);
				this.tableParams.reload();
			}
		};

		/**
		 * 페이지 로드시 실행된다.
		 */
		View.initLoad = function () {
			var self = this;
			ModalSearchUserSvc.init(self.search, dpParam);
			ModalSearchUserSvc.getDeptCodeList({ search: 'all' }).then(function (result) {
				self.departCodeList = result.data;
			});
			this.inquiry();
		};

		/**
		 * 유저정보를 조회한다.
		 */
		View.inquiry = function () {
			var self = this;
			ModalSearchUserSvc.getUserList(self.search).then(function (result) {
				self.bPristine = false;
				self.data = result.data;
				self.table.reload(result.data);
			});
		};

		/**
		 * 클릭시 유저를 선택한다.
		 * @param {Object} poSelecteduser
		 */
		View.clickSelectUser = function (poSelecteduser) {
			ModalSearchUserSvc.setUser(this.selectedUser, poSelecteduser);
		};

		/**
		 * 더블 클릭시 유저를 선택하고, 모달창을 닫는다.
		 * @param {Object} poSelecteduser
		 */
		View.dblClickSelectUser = function (poSelecteduser) {
			ModalSearchUserSvc.setUser(this.selectedUser, poSelecteduser);
			this.confirm();
		};

		View.confirm = function () {
			var user = this.selectedUser;
			if (ModalSearchUserSvc.isValid(user)) {
				$modalInstance.close(user);
			}
		};

		View.cancel = function () {
			$modalInstance.dismiss('cancel');
		};


		$scope.View   = View;



		View.initLoad();
	}

	ModalSearchUserCtrl.$inject = ['$scope', 'ModalSearchUserSvc', 'ngTableParams', '$filter', 'dpParam', '$modalInstance'];


	/**
	 *  유저검색
	 */
	angular.module('edtApp.common.modal').controller('ModalSearchUserCtrl', ModalSearchUserCtrl);
}());