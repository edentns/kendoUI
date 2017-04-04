(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("simpleMonthSearch", [function () {
            return {
                priority    : 0,
                templateUrl : "app/shared/components/simpleMonthSearch/simpleMonthSearch.tpl.html",
                restrict    : "AE",
                scope       : {
                    info     : "=info",
                    change   : "&change",
                    isExecute: "="
                },
                controller: ["$scope", function ( $scope ) {
                    var isExecute   = $scope.isExecute,
                        info = $scope.info,
                        pYear = info.year,
                        pMonth = info.month,
                        searchVO,
                        currentType = "";	// 현재 선택된 버튼 타입

                    searchVO = $scope.searchVO = {
                        yearList: edt.makeYearList(),

                        /**
                         * @description 날짜 검색 종류
                         */
                        dateKindList: [
                            {title: "이전달", active: false, name: "previous"},
                            {title: "현재", active: false, name: "current"},
                            {title: "다음달", active: false, name: "next"},
                            {title: "직접선택", active: false, name: "free"}
                        ],

                        /**
                         * @description 자유선택 여부
                         */
                        free  : false,

                        kind  : info.kind,
                        year  : ""+ info.year,
                        month : ""+ info.month
                    };

                    /**
                     * @description 기간종류 버튼을 클릭했을 경우 select객체에 기간을 세팅한다.
                     * @param kind 선택된 기간종류
                     */
                    searchVO.selectPeriodBtn = function ( kind ) {
                        var
                            setView = function ( freeBoolean ) {
                                searchVO.free = freeBoolean;
                            },

                            aimDate;

                        switch ( kind ) {
                            case "free":
                                setView( true );
                                break;

                            case "current":
                                setView( false );
                                this.year = pYear;
                                this.month = pMonth;
                                break;

                            case "previous":
                                setView( false );
                                aimDate = new Date( pYear, pMonth- 2, 1 );
                                this.year = ""+ aimDate.getFullYear();
                                this.month = edt.fillSpace( aimDate.getMonth() + 1 );
                                break;

                            case "next":
                                setView( false );
                                aimDate = new Date( pYear, pMonth, 1 );
                                this.year = ""+ aimDate.getFullYear();
                                this.month = edt.fillSpace( aimDate.getMonth() + 1 );
                                break;

                            default:
                                break;
                        }

                        angular.forEach( this.dateKindList, function ( data ) {
                            if ( data.name === kind ) {
                                data.active = true;
                            } else {
                                data.active = false;
                            }
                        });

                        $scope.info.kind = this.kind;
                        $scope.info.year = this.year;
                        $scope.info.month = this.month;
                    };

                    /**
                     * @description 선택 타입에 따라 직접입력, 자동입력으로 변경된다.
                     */
                    searchVO.doInquiry = function (kind) {
                        if (kind) {
                            currentType = kind;
                        } else {
                            kind = currentType;
                        }
                        this.selectPeriodBtn(kind);

                        if ($scope.change && isExecute) {
                            $scope.change();
                        }
                        isExecute = true;
                    };

                    // 초기화를 위한 $watch
                    $scope.$watch("info", function (currentInfo) {
        					      searchVO.doInquiry(currentInfo.type);
                    });
                }]
            };
        }]);

}());
