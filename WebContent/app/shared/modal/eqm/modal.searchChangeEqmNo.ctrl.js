(function () {
	'use strict';

	/**
	 * MODAL - 변경장비번호 검색
	 */
	angular.module('edtApp.common.modal')
		.controller('modal.searchChangeEqmNoCtrl', EqmModalCtrl);

	EqmModalCtrl.$inject = ['$scope', 'EQ.01eqMasterSvc', 'ngTableParams', '$filter', '$modalInstance', 'resolveParam'];
	function EqmModalCtrl ($scope, EqMaasterSvc, ngTableParams, $filter, $modalInstance, resolveParam) {
		var vm = {
			data: [],
			selectedItem: null,
			_cacheItem: null
		};
		/**
		 * 공통코드
		 */
		vm.code = {
			tpList: [
				{ name: '장비번호', value: 'CODE' },
				{ name: '장비명', value: 'NAME' }
			]
		};
		/**
		 * 검색조건
		 */
		vm.search = {
			tp: 'NAME',    // 검색기준
			keyword: '' // 검색어
		};

		/**
		 * 전체 장비리스트를 가져온다.
		 * @private
		 * @returns {promise}
		 */
		vm._getEqmList = function () {
			return EqMaasterSvc.getModalEqmList(this.getSearchParam());
		};
		/**
		 * 검색조건을 생성한다.
		 * @returns {*}
		 */
		vm.getSearchParam = function () {
			var search = this.search,
				rtnParam;

			if (search.keyword) {
				switch (search.tp) {
					case 'CODE':   // 장비번호
						rtnParam = { NO_EQM: search.keyword };
						break;
					case 'NAME':   // 장비명
						rtnParam = { NM_EQM: search.keyword };
						break;
				}
			}
			return rtnParam;
		};
		/**
		 * 장비를 조회한다.
		 * 장비 KEY값(resolve)이 존재하면 해당 장비는 제외한다.
		 */
		vm.inquiry = function () {
			var self = this;
			self._getEqmList().then(function (res) {
				if (resolveParam && resolveParam.NO_EQM) {
					res.data.result = self._splice(res.data.result, resolveParam.NO_EQM.value);
				}

				self.selectedItem = null;
				self.data = res.data.result;
				self.table.reload(self.data);
			});
		};
		/**
		 * resolve 장비 ID와 일치하는 데이터를 제거한다.
		 * @param {Array} data 장비조회 데이터
		 * @param {string} eqmId 장비 ID
		 * @private
		 */
		vm._splice = function (data, eqmId) {
			var i, lng, o, rtnData = [];
			for (i=0, lng=data.length; i<lng; i+=1) {
				o = data[i];
				if (o.NO_EQM !== eqmId) {
					rtnData.push(o);
				}
			}
			return rtnData;
		};

		/**
		 * 선택된 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
		 */
		vm.confirm = function () {
			var self = this;
			if (!self.selectedItem) {
				alert('장비를 선택해주세요.');
				return;
			}
			$modalInstance.close(self.selectedItem);
		};
		/**
		 * 모달창을 닫는다.
		 */
		vm.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
		/**
		 * 페이지 초기 로드시 실행한다.
		 */
		vm.initLoad = function () {
			this.inquiry();
		};


		/**
		 * 장비 Table
		 */
		vm.table = {
			tableParams: new ngTableParams({
				page    : 1,
				count   : 5,
				isShowSelectLength: false,
				sorting : { name: "desc" }
			}, {
				total: vm.data.length,
				getData: function($defer, params) {
					var sortingData = params.sorting() ? $filter("orderBy")(vm.data, params.orderBy()) : vm.data;
					params.total(sortingData.length);
					$defer.resolve(sortingData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			}),
			// 테이블 데이터를 갱신하다.
			reload: function (data) {
				var self = this;
				self.tableParams.settings({ data: data });
				self.tableParams.page(1);
				self.tableParams.reload();
			},
			// 장비 선택 변경
			changeSelected: function (eqm) {
				if (!eqm.selected) {
					if (vm.selectedItem) { vm.selectedItem.selected = false; }
					vm.selectedItem = eqm;
					eqm.selected = true;
				}
			},
			// 장비를 선택하고, 선택된 정보를 부모창에 전달 후, 모달창을 닫는다.
			quickConfirm: function (eqm) {
				this.changeSelected(eqm);
				vm.confirm();
			}
		};

		vm.initLoad();

		$scope.vm = vm;
		$scope.$on('$destroy', function () {
			delete $scope.vm;
		});
	}
}());