(function () {
  "use strict";

  angular.module("edtApp.common.directive")
      .directive("inlinePeriodSearch", [function () {
	      return {
		      require	  : "ngModel",
		      priority: 0,
		      templateUrl : "app/shared/components/inlinePeriodSearch/inlinePeriodSearch.tpl.html",
		      restrict: "AE",
		      scope: {
			      change: "&",
			      ngModel: "=",
				  isExecute: "="
		      },
		      controller: ["$scope", '$timeout', function ($scope, $timeout) {
			      $scope.yearList = edt.makeYearList();

			      /**
			       *  inline period search option
			       *  @type {$scope.ngModel|*}
			       *  @param {String} type current | previous | next | 1st | 2nd | 3rd | 4th | year | scope
			       *  @param {Boolean} seperate 버튼과 날짜가 너무 길경우 true이면 버튼과 날짜를 위,아래로 분리하여 보여준다.
			       *
			       */
			      var isExecute   = $scope.isExecute,
                      dateObj     = $scope.ngModel,
				      type        = dateObj.type,
				      pYear       = dateObj.startYear,
				      pMonth      = dateObj.startMonth,
				      isSeperate  = dateObj.isSeperate || false,
				      range       = dateObj.range || "all",
				      currentType = "",	// 현재 선택된 버튼 타입

				      /**
				       *  기간종류 버튼을 클릭했을 경우 select객체에 기간을 세팅한다.
				       *  @param kind 선택된 기간종류
				       */
				      selectPeriodBtn = function ( kind, currentModel ) {
					      function setView( disabledBoolean, periodBoolean ) {
						      $scope.search.disabled  = disabledBoolean;
						      $scope.search.period    = periodBoolean;
					      }

					      var search = $scope.search,
						      dateKindList = $scope.dateKindList,
						      aimDate;

					      search.type     = kind;

					      switch ( kind ) {
						      case "scope":
							      setView(false, true );
							      if (search.range === "modifyAll" ) {
								      search.endYear = search.startYear;
							      }

							      if ( currentModel ) {
								      search.startYear = currentModel.startYear;
								      search.startMonth = currentModel.startMonth;
								      search.endYear = currentModel.endYear;
								      search.endMonth = currentModel.endMonth;
							      }

							      break;
						      case "current":
							      setView(true, false );
							      search.startYear = search.endYear  = pYear;
							      search.startMonth = search.endMonth = pMonth;
							      break;
						      case "previous":
							      setView(true, false);
							      aimDate = new Date(pYear, pMonth - 2, 1);
							      search.startYear = search.endYear  = ''+ aimDate.getFullYear();
							      search.startMonth = search.endMonth = edt.fillSpace(aimDate.getMonth() + 1);
							      break;
						      case "next":
							      setView(true, false);
							      aimDate = new Date(pYear, pMonth, 1);
							      search.startYear = search.endYear  = ''+ aimDate.getFullYear();
							      search.startMonth = search.endMonth = edt.fillSpace(aimDate.getMonth() + 1);
							      break;
						      case "1st":
							      setView(true, true);
							      search.startYear = search.endYear = pYear;
							      search.startMonth = "01";
							      search.endMonth = "03";
							      break;
						      case "2nd":
							      setView(true, true);
							      search.startYear = search.endYear = pYear;
							      search.startMonth = "04";
							      search.endMonth = "06";
							      break;
						      case "3rd":
							      setView(true, true);
							      search.startYear = search.endYear = pYear;
							      search.startMonth = "07";
							      search.endMonth = "09";
							      break;
						      case "4th":
							      setView(true, true);
							      search.startYear = search.endYear = pYear;
							      search.startMonth = "10";
							      search.endMonth = "12";
							      break;
						      case "year":
							      setView(true, true);
							      search.startYear = search.endYear = pYear;
							      search.startMonth = "01";
							      search.endMonth = "12";
							      break;
						      default:
							      break;
					      }

					      angular.forEach(dateKindList, function ( data ) {
						      if (data.name === kind ) {
							      data.active = true;
						      } else {
							      data.active = false;
						      }
					      });

					      $scope.ngModel.type       = search.type;
					      $scope.ngModel.startYear  = search.startYear;
					      $scope.ngModel.startMonth = search.startMonth;
					      $scope.ngModel.endYear    = search.endYear;
					      $scope.ngModel.endMonth   = search.endMonth;
				      };

			      /**
			       *  날짜 검색 종류
			       *  @type {{title: string, active: boolean, name: string}[]}
			       */
			      $scope.dateKindList = [
				      {title: "이전달",   active: false,   name: "previous"},
				      {title: "현재",     active: false,   name: "current"},
				      {title: "다음달",   active: false,   name: "next"},
				      {title: "1분기",    active: false,   name: "1st"	},
				      {title: "2분기",    active: false,   name: "2nd"	},
				      {title: "3분기",    active: false,   name: "3rd"	},
				      {title: "4분기",    active: false,   name: "4th"	},
				      {title: "연도",     active: false,   name: "year"},
				      {title: "범위선택", active: false,   name: "scope"}
			      ];

			      /**
			       *  날짜 기간 객체
			       *  @type {{type: *, period: boolean, disabled: boolean, startYear: ($scope.businessVO.period.startYear|*), startMonth: ($scope.businessVO.period.startMonth|*), endYear: *, endMonth: *}}
			       */
			      $scope.search = {
				      type: type, /* 직접선택시 화면에 보여줄 타입 single, double*/
				      period: false, /* 버튼 선택시 기간인지 아닌지 여부*/
				      disabled: true, /* 버튼 선택시 select disabled 여부*/
				      startYear: pYear, /* 시작년*/
				      startMonth: pMonth, /* 시작월*/
				      endYear: pYear, /* 종료년*/
				      endMonth: pMonth, /* 종료월*/
				      isSeperate: isSeperate, /* inline여부*/
				      range: range       /* 선택할 수 있는 범위*/

			      };


			      $scope.$watch("ngModel", function (currentModel) {
				      currentType = currentModel.type;
				      selectPeriodBtn( currentModel.type, currentModel );
				      if ($scope.change && isExecute) {
					      $scope.change();
				      }

              isExecute = true;
			      });

			      /**
			       *  날짜 또는 검색 버튼을 눌렀을 경우 데이터를 조회한다.
			       */
			      $scope.doInquiry = function ( kind ) {
				      if (kind) {
					      currentType = kind;
				      } else {
					      kind = currentType;
				      }

				      selectPeriodBtn( kind );
				      if ($scope.change ) {
					      $scope.change();
				      }
			      };
		      }],
		      link	: function (scope, elem) {
			      scope.$on("$destroy", function () {

			      });
		      }
	      };
      }]);

}());
