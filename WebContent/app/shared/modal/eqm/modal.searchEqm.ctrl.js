/**
 * MODAL - multi 장비 검색(장바구니)
 * Modified by js.choi on 2015.08.19
 */
(function () {
	"use strict";



	function EqmModalCtrl ($scope, EqMaasterSvc, $modalInstance, EqMasterVO, resolveParam) {
		var KEY_EQM = "NO_EQM",
			vm = {
			/**
			 * 선택된 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
			 */
			confirm: function () {
				var self = this,
					selectedItem = self.selectedEqm.grid.rowData;

				if (!selectedItem || selectedItem.length===0) {
					alert("장비를 선택해주세요.");
					return;
				}
				$modalInstance.close(selectedItem);
			},
			/**
			 * 모달창을 닫는다.
			 */
			cancel: function () {
				$modalInstance.dismiss("cancel");
			},
			/**
			 * 초기 로드시 실행된다.
			 */
			initLoad: function () {
				var self = this;
				EqMaasterSvc.getModalEqmList(self.search.getSearchParam()).then(function (res) {
					var keepedEqmList = [];
					vm.originData = res.data.result;
					if (resolveParam && resolveParam.equipmentList) {
						angular.forEach(resolveParam.equipmentList, function (eqm, idx) {
							keepedEqmList[idx] = eqm.entity;
						});
						vm.selectedEqm.render(keepedEqmList);
					}

					vm.eqm.render(res.data.result);
				});
			}
		};

		/**
		 * 공통코드
		 */
		vm.code = {
			tpList: [
				{ name: "장비번호", value: "CODE" },
				{ name: "장비명", value: "NAME" },
				{ name: "S/N", value: "S/N" }
			]
		};

		/**
		 * 검색 Component
		 */
		vm.search = {
			tp: "NAME",    // 검색기준
			keyword: "",  // 검색어
			getSearchParam: function () {
				var self = this,
					rtnParam;

				if (self.keyword) {
					switch (self.tp) {
						case "CODE":   // 장비번호
							rtnParam = { NO_EQM: self.keyword };
							break;
						case "NAME":   // 장비명
							rtnParam = { NM_EQM: self.keyword };
							break;
						case "S/N":     // 시리얼번호
							rtnParam = { DC_SRN: self.keyword };
							break;
					}
				}
				return rtnParam;
			},
			inquiry: function () {
				var self = this;
				EqMaasterSvc.getModalEqmList(self.getSearchParam()).then(function (res) {
					vm.eqm.render(res.data.result);
				});
			}
		};

		/**
		 * 장비 그리드
		 */
		vm.eqm = {
			grid: {
				rowData: [],
				columnDefs: [
					{ headerName: "장비명", field: "NM_EQM", headerGroup: "장비", width: 170 },
					{ headerName: "S/N", field: "DC_SRN", headerGroup: "장비", width: 160 },
					{ headerName: "관리고객사", field: "NM_MNG_CUST", headerGroup: "장비", width: 155 },
					{ headerName: "서비스고객사", field: "NM_SERV_CUST", headerGroup: "장비", width: 155 }
				],
				enableFilter: true,
				groupHeaders: true,
				enableSorting: true,
				rowSelection: "multiple",
				groupSelectsChildren: true,
				suppressRowClickSelection: true,
				groupDefaultExpanded: true,
				groupKeys: ["NM_EQM_TP"],
				groupColumnDef: { headerName: "장비유형", field: "NM_EQM_TP", headerGroup: "장비", width: 100, cellRenderer: {
					renderer: "group",
					checkbox: true
				}}
			},
			render: function (data, compareData) {
				var self = this;
				self.grid.rowData = data;
				self.grid.api.onNewRows();
			},
			putCart: function () {
				var self = this,
					rows = self.grid.selectedRows,
					selectedRowData = vm.selectedEqm.grid.rowData,
					cartList = [];

				angular.forEach(rows, function (row) {
					var state = false;
					angular.forEach(selectedRowData, function (selEqm) {
						if (row.NO_EQM === selEqm.NO_EQM) { state = true; }
					});
					if (!state) { cartList.push(row); }
				});
				vm.selectedEqm.render(cartList.concat(selectedRowData));
			}
		};

		/**
		 * 선택된 장비 그리드
		 */
		vm.selectedEqm = {
			render: function (data) {
				var self = this;
				self.grid.rowData = data;
				self.grid.api.onNewRows();
			},
			bindDeleteRow: function (params) {
				params.$scope.rowIndex = params.rowIndex;
				params.$scope.deleteRow = function (row, idx) {
					vm.selectedEqm.grid.rowData.splice(idx, 1);
					vm.selectedEqm.grid.api.onNewRows();
				};
				return '<i class="fa fa-minus-circle red-dark hover-cursor" ng-click="deleteRow(data, rowIndex)"></i>';
			}
		};
		vm.selectedEqm.grid = {
			rowData: [],
			columnDefs: [
				{ headerName: "장비유형", field: "NM_EQM_TP", headerGroup: "Selected 장비", width: 180 },
				{ headerName: "장비명", field: "NM_EQM", headerGroup: "Selected 장비", width: 160 },
				{ headerName: "S/N", field: "DC_SRN", headerGroup: "Selected 장비", width: 160 },
				{ headerName: "관리고객사", field: "NM_MNG_CUST", headerGroup: "Selected 장비", width: 145 },
				{ headerName: "서비스고객사", field: "NM_SERV_CUST", headerGroup: "Selected 장비", width: 145 },
				{ headerName: "삭제", field: "BTN_DEL", headerGroup: "Selected 장비", width: 50, cellClass: "ta-c", cellRenderer: vm.selectedEqm.bindDeleteRow }
			],
			groupHeaders: true,
			enableSorting: true,
			suppressCellSelection: true,
			angularCompileRows: true
		};



		$scope.vm = vm;
		vm.initLoad();

		$scope.$on("$destroy", function () {
			delete $scope.vm;
		});
	}
	EqmModalCtrl.$inject = ["$scope", "EQ.01eqMasterSvc", "$modalInstance", "EQ.01eqMasterVO", "resolveParam"];

	angular
		.module("edtApp.common.modal")
		.controller("modal.searchEqmCtrl", EqmModalCtrl);


}());