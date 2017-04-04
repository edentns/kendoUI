(function () {
    "use strict";

    /**
     * @name analysis.change.controller : analysis.changeCtrl
     * 사업분석 > 변경분석
     */
    angular.module("analysis.change.controller")
        .controller("analysis.changeCtrl", ["$scope", "uiGridConstants", "$http", "SY.codeSvc", "SY.departSvc","SY.userListSvc", "analysis.changeSvc", "APP_CODE", "$q", "resData", "$timeout", "Page", "APP_AUTH",
            function ($scope, uiGridConstants, $http, SyCodeSvc, SyDepartSvc, SyUserListSvc, AnalysisChangeSvc, APP_CODE, $q, resData, $timeout, Page, APP_AUTH) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            searchVO, tabVO, ChangeVO, totalVO, seniorDepartVO, subDepartVO, individualVO;

	            page.setPreProcessor("code", function(next) {
		            var me = this,
			            param =  searchVO.createDeptAndRespCodeParam();

		            me.code = {
			            seniorCodeList  : [],
			            departCodeList  : [],
			            salesRepList    : []
		            };

		            $q.all([
			            SyDepartSvc.getMngDepart({ wk_grp: 2 }),
			            SyDepartSvc.getDepart(param.dept),
			            SyUserListSvc.getUserSearchCode(param.resp)
		            ]).then(function ( result ) {
			            var allCode = { CD: 1, NAME: "전체" };
			            result[0].data.unshift(allCode);
			            result[1].data.unshift(allCode);
			            result[2].data.unshift(allCode);

			            me.code.seniorCodeList  = result[0].data;
			            me.code.departCodeList  = result[1].data;
			            me.code.salesRepList    = result[2].data;

			            next();
		            });
	            });

	            /**
	             * @name searchVO
	             * @description
	             * 변경분석 검색조건을 관리한다.
	             *
	             * @kind {number} kind - 상위부서 코드
	             * @kind {number} depart - 하위부서코드
	             * @kind {number} salesRep - 영업대표 ID
	             * @kind {object} date - 기간정보(기간검색 Object { type: "검색유형", startyear: "시작년", startMonth: "시작월", endYear: "종료년", endMonth: "종료월", range: "범위선택유형" }
	             */
                searchVO = $scope.searchVO = {
	                tabType : "SALES",
                    kind    : (page.isAccessAll())  ? 1 : page.user.deptCode,
	                depart 	: 1,
	                salesRep: 1,
                    date    : {
                        dateType   : "month",
                        buttonList : ["prevMonth", "current", "nextMonth", "1st", "2nd", "3rd", "4th", "1half", "2half", "year", "range"],
                        selected   : "current",
                        period : {
                            start : angular.copy(today),
                            end   : angular.copy(today)
                        }
                    }
                };
	            /**
	             * @name searchVO.createDeptAndRespCodeParam
	             * @kind function
	             * @description
	             * 소속부서와 영업대표를 가져오기 위한 parameter를 생성한다.
	             *
	             * @param {searchVO} search=searchVO - searchVO
	             * @returns {{dept: ({mgr_cd}|{mgr_cd: string}), reps: string}}
	             */
	            searchVO.createDeptAndRespCodeParam = function(search){
		            search = search || this;
		            var me = this;
		            return {
			            dept: me.createDeptCodeParam(search),
			            resp: me.createRespCodeParam(search)
		            };
	            };
	            /**
	             * @name searchVO.createDeptCodeParam
	             * @kind function
	             * @description
	             * 소속부서를 가져오기 위한 Parameter를 생성한다.
	             *
	             * @param {searchVO} search=searchVO - searchVO
	             * @returns {{mgr_cd: string}}
	             */
	            searchVO.createDeptCodeParam = function(search){
		            search = search || this;
		            var mgrCode = search.kind ? ''+ search.kind : '1';
		            return { mgr_cd: mgrCode };
	            };
	            /**
	             * @name searchVO.createRespCodeParam
	             * @kind function
	             * @description
	             * 영업대표를 가져오기 위한 Parameter를 생성한다.
	             *
	             * @param {searchVO} search=searchVO - searchVO
	             * @returns {string}
	             */
	            searchVO.createRespCodeParam = function(search){
		            search = search || this;
		            return (search.depart !== 1) ? 'sel_dept='+ search.depart : (search.kind !== 1) ? 'sel_dept='+ search.kind : 'sel_dept=1';
	            };
	            /**
	             * @name searchVO.getDeptAndResp
	             * @kind function
	             * @description
	             * 상위부서 선택시 하위부서/팀 과 영업대표를 가져온다.
	             */
	            searchVO.getDeptAndResp = function (){
		            var me = this,
			            param;

		            me.depart   = 1;
		            me.salesRep = 1;
		            param = me.createDeptAndRespCodeParam();

		            $q.all([
			            SyDepartSvc.getDepart(param.dept),			    // 소속코드리스트
			            SyUserListSvc.getUserSearchCode(param.resp) 	// 영업사원코드리스트
		            ]).then(function ( result ) {
			            page.code.departCodeList    = page.code.departCodeList.slice(0, 1).concat(result[0].data);
			            page.code.salesRepList      = page.code.salesRepList.slice(0, 1).concat(result[1].data);
		            });
	            };
	            /**
	             * @name searchVO.getSalesUser
	             * @kind function
	             * @description
	             * 영업대표 리스트를 가져온다.
	             */
	            searchVO.getSalesUser = function () {
		            var me = this,
			            param;

		            me.salesRep = 1;
		            param = me.createRespCodeParam();

		            SyUserListSvc.getUserSearchCode(param).then(function (result) {
			            page.code.salesRepList = page.code.salesRepList.slice(0, 1).concat(result.data);
		            });
	            };
	            /**
	             * @name searchVO.doInquiry
	             * @kind function
	             * @description
	             * 변경분석 정보를 검색한다.
	             */
	            searchVO.doInquiry = function () {
		            var me = this,
			            period  = me.date.period,
			            days    = [today.y, today.m, today.d],
			            start   = [period.start.y, period.start.m, period.start.d],
			            end     = [period.end.y, period.end.m, period.end.d],
			            diffDay = edt.getDitcDay(start.join('-'), end.join('-')),
			            diffToday = edt.getDitcDay(start.join('-'), days.join('-'));

		            if (diffDay<0 || diffToday<0) {
			            alert('유효한 기간이 아닙니다. 기간을 확인해주세요.');
			            return;
		            }

		            if (seniorDepartVO.visible) {
			            totalVO.getChangeInfo();
			            seniorDepartVO.getChangeInfo();
		            }

		            if (subDepartVO.visible) {
			            subDepartVO.getChangeInfo();
		            }

		            individualVO.getChangeInfo();

		            $scope.$emit("event:autoLoader", true);
	            };
	            /**
	             * @name searchVO.init
	             * @kind function
	             * @description
	             * 검색조건을 초기화한다.
	             */
	            searchVO.init = function () {
		            var me  = this;
		            me.kind = (page.isAccessAll())  ? 1 : page.user.deptCode;
		            me.date.selected = "current";
		            me.depart   = 1;
		            me.salesRep = 1;

		            $timeout(function () {
			            me.doInquiry();
		            }, 0);
	            };


	            /**
	             * @name tabVO
	             * @description
	             * 수주관리탭, 매출관리탭
	             *
	             * @kind {string} current - 현재 탭 name(ORDER, SALES)
	             * @kind {Array} tabList - 탭 리스트
	             */
                tabVO = $scope.tabVO = {
                    current: "SALES",
                    tabList: [
                        { id: "orderContent", name: "ORDER", title: "수주관리", active: false },
                        { id: "salesContent", name: "SALES", title: "매출관리", active: true }
                    ]
                };

	            /**
	             * @name tabVO.click
	             * @description
	             * 탭 버튼을 클릭했을 경우
	             *
	             * @param {angular.$event} $event
	             * @param {string} name
	             */
                tabVO.click = function ($event, name) {
                    if ($event) { $event.preventDefault(); }

                    searchVO.tabType    = name;
                    tabVO.current       = name;
                    searchVO.periodKind = name;

                    angular.forEach(this.tabList, function (data) {
                        if (data.name === name) {
                            data.active = true;
                        } else {
                            data.active = false;
                        }
                    });
                    searchVO.doInquiry();
                };


	            /**
	             * @name ChangeVO
	             * @class
	             * @constructor
	             *
	             * @description
	             * 변경분석 공통 VO
	             */
                ChangeVO = function () {
                    this.model = "ChangeVO";
                };
                ChangeVO.prototype = {
                    column: [
                        {
                            displayName: "Funnel정확도(%)",
                            field: "FUNNEL_ACCURACY",
                            cellClass: "ta-c"
                        },
                        { displayName: "Forecast정확도(%)",
                            field: "FORECAST_ACCURACY",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "Commit정확도(%)",
                            field: "COMMIT_ACCURACY",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "Cost정확도(%)",
                            field: "COST_ACCURACY",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "Margin정확도(%)",
                            field: "MARGIN_ACCURACY",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "목표매출",
                            field: "RESULT_TARGET_REVENUE",
                            cellClass: "ta-r",
                            cellFilter	: "number"
                        },
                        {
                            displayName: "목표달성",
                            field: "RESULT_COMMIT",
                            cellClass: "ta-r",
                            cellFilter	: "number"
                        },
                        {
                            displayName: "목표달성률",
                            field: "RESULT_COMMIT_ACHIEVE",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "목표마진",
                            field: "RESULT_TARGET_MARGIN",
                            cellClass: "ta-r",
                            cellFilter	: "number"
                        },
                        {
                            displayName: "마진달성",
                            field: "RESULT_MARGIN",
                            cellClass: "ta-r",
                            cellFilter	: "number"
                        },
                        {
                            displayName: "마진달성률",
                            field: "RESULT_MARGIN_ACHIEVE",
                            cellClass: "ta-c"
                        }
                    ],

                    subColumns: [
                        {
                            displayName: "TITLE",
                            field: "TITLE",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "Funnel",
                            field: "FUNNEL",
                            cellClass: "ta-r pr-x1",
                            cellFilter: "number"
                        },
                        {
                            displayName: "Forecast",
                            field: "FORCAST",
                            cellClass: "ta-r pr-x1",
                            cellFilter: "number"
                        },
                        {
                            displayName: "Commit",
                            field: "COMMIT",
                            cellClass: "ta-r pr-x1",
                            cellFilter: "number"
                        },
                        {
                            displayName: "Cost",
                            field: "COST",
                            cellClass: "ta-r pr-x1",
                            cellFilter: "number"
                        },
                        {
                            displayName: "Margin",
                            field: "MARGIN",
                            cellClass: "ta-r pr-x3",
                            cellFilter: "number"
                        }
                    ],

                    setSubGridOptions: function (dataList, subColumns) {
                        angular.forEach( dataList, function ( data ) {
                            var sortAlterationList = data.alterationList;

                            data.subGridOptions = {
                                columnDefs: subColumns,
                                data: sortAlterationList
                            };
                        });
                    }
                };


	            /**
	             * @name totalVO
	             * @extends ChangeVO
	             * @description
	             * 전사 실적을 보여준다.
	             *
	             * @type {ChangeVO}
	             */
                totalVO = $scope.totalVO = edt.create(ChangeVO.prototype, {
                    "FUNNEL_ACCURACY"	: 0,
                    "FORECAST_ACCURACY"	: 0,
                    "COMMIT_ACCURACY"	: 0,
                    "COST_ACCURACY"		: 0,
                    "MARGIN_ACCURACY"	: 0
                });
	            /**
	             * @name totalVO.gridOptions
	             * @kind object
	             *
	             * @description
	             * 전사 gridOption을 세팅한다.
	             */
                totalVO.gridOptions = {
                    data                  : [],
                    columnDefs            : totalVO.column,
                    showFooter            : false,
                    enableSorting         : false,
                    expandableRowTemplate : "expandableRow.tpl.html"
                };
	            /**
	             * @name totalVO.getChangeInfo
	             * @kind function
	             * @description
	             * 전사 변경정보를 가져온다.
	             */
	            totalVO.getChangeInfo = function () {
                    var self = this,
                        param = AnalysisChangeSvc.makeSearchParam( tabVO.current, "total", searchVO );

                    AnalysisChangeSvc.getChangeInfo( param ).then( function ( result ) {
                        if ( result.data.length > 0 ) {
                            self.FUNNEL_ACCURACY 	= result.data[0].FUNNEL_ACCURACY;
                            self.FORECAST_ACCURACY 	= result.data[0].FORECAST_ACCURACY;
                            self.COMMIT_ACCURACY 	= result.data[0].COMMIT_ACCURACY;
                            self.COST_ACCURACY 		= result.data[0].COST_ACCURACY;
                            self.MARGIN_ACCURACY 	= result.data[0].MARGIN_ACCURACY;
                        } else {
                            self.FUNNEL_ACCURACY 	= 0;
                            self.FORECAST_ACCURACY 	= 0;
                            self.COMMIT_ACCURACY 	= 0;
                            self.COST_ACCURACY 		= 0;
                            self.MARGIN_ACCURACY 	= 0;
                        }
                    });
                };


	            /**
	             * @name seniorDepartVO
	             * @extends ChangeVO
	             * @description
	             * 상위부서 실적을 보여준다.
	             *
	             * @type {ChangeVO}
	             */
                seniorDepartVO = $scope.seniorDepartVO = edt.create( ChangeVO.prototype );

	            // 상위부서 SHOW/HIDE 여부
	            seniorDepartVO.visible = page.isAccessable(APP_AUTH.ALL, APP_AUTH.MANAGER);

	            /**
	             * @name seniorDepartVO.gridOptions
	             * @kind object
	             *
	             * @description
	             * 상위부서 gridOption을 세팅한다.
	             */
                seniorDepartVO.gridOptions = {
                    data                  : [],
                    columnDefs            : (function () {
                        var column = [
                            {
                                displayName: "날짜",
                                field: "ORDER_D",
                                cellClass: "ta-c"
                            },
                            {
                                displayName: "부서",
                                field: "DEPT_NAME",
                                cellClass: "ta-c"
                            }
                        ];
                        return column.concat( seniorDepartVO.column );
                    }()),
                    showFooter            : false,
                    enableSorting         : false,
                    expandableRowTemplate : "expandableRow.tpl.html",
                    expandableRowHeight   : 150
                };
	            /**
	             * @name seniorDepartVO.getChangeInfo
	             * @kind function
	             * @description
	             * 상위부서 변경정보를 가져온다.
	             */
                seniorDepartVO.getChangeInfo = function () {
                    var self = this,
                        param = AnalysisChangeSvc.makeSearchParam( tabVO.current, "all", searchVO );

                    AnalysisChangeSvc.getChangeInfo(param).then(function (result) {
                        self.setSubGridOptions(result.data, self.subColumns);
                        self.gridOptions.data = result.data;
                    });
                };


	            /**
	             * @name subDepartVO
	             * @extends ChangeVO
	             * @description
	             * 하위부서 실적을 보여준다.
	             *
	             * @type {ChangeVO}
	             */
                subDepartVO = $scope.subDepartVO = edt.create(ChangeVO.prototype);

	            // 하위부서/팀 SHOW/HIDE 여부
	            subDepartVO.visible = page.isAccessable(APP_AUTH.ALL, APP_AUTH.MANAGER, APP_AUTH.TEAM);

	            /**
	             * @name subDepartVO.gridOptions
	             * @kind object
	             *
	             * @description
	             * 하위부서 gridOption을 세팅한다.
	             */
                subDepartVO.gridOptions = {
                    data                  : [],
                    columnDefs            : (function () {
                        var column = [
                            {
                                displayName: "날짜",
                                field: "ORDER_D",
                                cellClass: "ta-c"
                            },
                            {
                                displayName: "부서",
                                field: "DEPT_NAME",
                                cellClass: "ta-c"
                            }
                        ];
                        return column.concat( seniorDepartVO.column );
                    }()),
                    showFooter            : false,
                    enableSorting         : false,
                    expandableRowTemplate : "expandableRow.tpl.html",
                    expandableRowHeight   : 150,
                    expandableRowScope    : {
                        subGridVariable : "subGridScopeVariable"
                    }
                };
	            /**
	             * @name subDepartVO.getChangeInfo
	             * @kind function
	             * @description
	             * 하위부서 실적정보를 가져온다.
	             */
                subDepartVO.getChangeInfo = function () {
                    var self = this,
                        param = AnalysisChangeSvc.makeSearchParam(tabVO.current, "dept", searchVO);

                    AnalysisChangeSvc.getChangeInfo(param).then( function (result) {
                        self.setSubGridOptions( result.data, self.subColumns );
                        self.gridOptions.data = result.data;
                    });
                };


	            /**
	             * @name individualVO
	             * @extends ChangeVO
	             * @description
	             * 개인 실적을 보여준다.
	             *
	             * @type {ChangeVO}
	             */
                individualVO = $scope.individualVO = edt.create( ChangeVO.prototype );

	            // 개인 SHOW/HIDE 여부
	            individualVO.visible = true;

	            /**
	             * @name individualVO.gridOptions
	             * @kind object
	             *
	             * @description
	             * 영업대표 gridOption을 세팅한다.
	             */
                individualVO.gridOptions = {
                    data                  : [],
                    columnDefs            : (function () {
                        var column = [
                            {
                                displayName: "날짜",
                                field: "ORDER_D",
                                cellClass: "ta-c"
                            },
                            {
                                displayName: "부서",
                                field: "DEPT_NAME",
                                cellClass: "ta-c"
                            },
                            {
                                displayName: "이름",
                                field: "USER_NAME",
                                cellClass: "ta-c"
                            }
                        ];
                        return column.concat( individualVO.column );
                    }()),
                    showFooter            : false,
                    enableSorting         : false,
                    expandableRowTemplate : "expandableRow.tpl.html",
                    expandableRowHeight   : 150,
                    expandableRowScope    : {
                        subGridVariable : "subGridScopeVariable"
                    }
                };
	            /**
	             * @name individualVO.getChangeInfo
	             * @kind function
	             * @description
	             * 개인 실적정보를 가져온다.
	             */
                individualVO.getChangeInfo = function () {
                    var self = this,
                        param = AnalysisChangeSvc.makeSearchParam( tabVO.current, "sale", searchVO );

                    AnalysisChangeSvc.getChangeInfo(param).then( function (result) {
                        self.setSubGridOptions(result.data, self.subColumns);
                        self.gridOptions.data = result.data;
                    });
                };

	            page.bootstrap(function() {
		            $timeout(function () {
			            searchVO.doInquiry();
		            }, 0);
	            });

            }
        ]);

}());