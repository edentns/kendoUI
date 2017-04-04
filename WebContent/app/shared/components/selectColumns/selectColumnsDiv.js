(function () {
    "use strict";

  angular.module("edtApp.common.directive")
      .directive("selectColumns", [function () {
          return {
              require	  : "ngModel",
              priority    : 0,
              templateUrl : "app/shared/components/selectColumns/selectColumns.tpl.html",
              restrict    : "AE",
              scope       : {
                  showColumns : "=",
                  hideColumns : "="
              },
              controller: ["$scope", function ( $scope ) {
                  var columnVO = $scope.columnVO = {
                      data : {
                          showColumns : $scope.showColumns,
                          hideColumns : $scope.hideColumns
                      },
                      selected    : []
                  };

                  columnVO.moveUp = function () {
                      if (this.selected.length === 0) { return; }

                      var selectedList = this.selected,
                          selectedIdxList = [],
                          showList = this.data.showColumns,
	                      cache = null;

                      angular.forEach(selectedList, function (selectedColumn) {
                          angular.forEach(showList, function (displayColumn, displayIdx) {
                              if (selectedColumn === ""+displayColumn.field) {
                                  selectedIdxList.push(displayIdx);
                              }
                          });
                      });

                      angular.forEach(selectedIdxList, function (selectedIdx) {
                          angular.forEach(showList, function (displayColumn, displayIdx) {
                              var moveIdx = selectedIdx-1;
                              if (moveIdx >= 0) {
                                  if (moveIdx === displayIdx) {
	                                  cache = showList[ selectedIdx ];
	                                  showList[ selectedIdx ] = showList[ moveIdx ];
	                                  showList[ moveIdx ] = cache;
                                  }
                              }
                          });
                      });

                  };

                  columnVO.moveDown = function () {
                      if (this.selected.length === 0) { return; }

                      var selectedList = this.selected,
                          selectedIdxList = [],
                          showList = this.data.showColumns,
	                      showListLng = showList.length,
	                      cache = null;

                      angular.forEach( selectedList, function ( selectedColumn ) {
                          angular.forEach( showList, function ( displayColumn, displayIdx ) {
                              if ( selectedColumn === ""+displayColumn.field ) {
                                  selectedIdxList.push( displayIdx );
                              }
                          });
                      });

                      selectedIdxList = selectedIdxList.reverse();
                      angular.forEach( selectedIdxList, function ( selectedIdx ) {
                          angular.forEach( showList, function ( displayColumn, displayIdx ) {
                              var moveIdx = selectedIdx+1;
	                          if ( moveIdx < showListLng ) {
		                          if ( selectedIdx === displayIdx ) {
			                          cache = showList[ selectedIdx ];
			                          showList[ selectedIdx ] = showList[ moveIdx ];
			                          showList[ moveIdx ] = cache;
		                          }
	                          }
                          });
                      });
                  };

                  columnVO.moveShowBox = function () {
                      var showList = this.data.showColumns,
                          hideList = this.data.hideColumns,
                          selectedList = this.selected;

                      angular.forEach( selectedList, function ( selectedColumn ) {
                          angular.forEach( hideList, function ( displayColumn, displayIdx ) {
                              if ( selectedColumn === ""+displayColumn.field ) {
                                  showList.push( hideList.splice( displayIdx, 1 )[0] );
                              }
                          });
                      });

                      this.selected = [];
                      this.data.showColumns = showList;
                      this.data.hideColumns = hideList;
                  };

                  columnVO.moveHideBox = function () {
                      var showList = this.data.showColumns,
                          hideList = this.data.hideColumns,
                          selectedList = this.selected;

                      angular.forEach(selectedList, function (selectedColumn) {
                          angular.forEach( showList, function (displayColumn, displayIdx ) {
                              if ( selectedColumn === ""+displayColumn.field ) {
                                  hideList.push( showList.splice( displayIdx, 1 )[0] );
                              }
                          });
                      });

                      this.selected = [];
                      this.data.showColumns = showList;
                      this.data.hideColumns = hideList;
                  };

              }]
          };
      }]);

}());