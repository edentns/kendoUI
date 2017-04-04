(function () {
    "use strict";

    /**
     * @name analysis.result.controller : analysis.resultCtrl
     * 사업분석 > 실적분석
     */
    angular.module("analysis.result.controller")
        .controller("analysis.resultCtrl", [ "$scope", "uiGridConstants", "SY.codeSvc", "SY.departSvc", "SY.userListSvc", "analysis.resultSvc", "APP_CODE", "$q", "resData", "$timeout", "Page", "APP_AUTH",
            function ($scope, uiGridConstants, SyCodeSvc, SyDepartSvc, SyUserListSvc, AnalysisResultSvc, APP_CODE, $q, resData, $timeout, Page, APP_AUTH) {

                var page  = $scope.page = new Page({ auth: resData.access }),
                    today = edt.getToday(),
                    searchVO, seniorDepartVO, subDepartVO, individualVO;

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
                 * 실적분석 검색조건을 관리한다.
                 *
                 * @kind {number} kind - 상위부서 코드
                 * @kind {number} depart - 하위부서코드
                 * @kind {number} salesRep - 영업대표 ID
                 * @kind {object} date - 기간정보(기간검색 Object { type: "검색유형", startyear: "시작년", startMonth: "시작월", endYear: "종료년", endMonth: "종료월", range: "범위선택유형" }
                 */
                searchVO = $scope.searchVO = {
                    kind : (page.isAccessAll())  ? 1 : page.user.deptCode,
                    depart 	  : 1,
                    salesRep  : 1,
                    date : {
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
                searchVO.createDeptAndRespCodeParam = function(search) {
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
                searchVO.createDeptCodeParam = function(search) {
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
                searchVO.createRespCodeParam = function(search) {
                    search = search || this;
                    return (search.depart !== 1) ? 'sel_dept='+ search.depart : (search.kind !== 1) ? 'sel_dept='+ search.kind : 'sel_dept=1';
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
                 * @name searchVO.getDeptAndResp
                 * @kind function
                 * @description
                 * 상위부서 선택시 하위부서/팀 과 영업대표를 가져온다.
                 */
                searchVO.getDeptAndResp = function () {
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
                 * 실적을 검색한다.
                 */
                searchVO.doInquiry = function () {
                    if (seniorDepartVO.visible) {
                        seniorDepartVO.getResult();
                    }

                    if (subDepartVO.visible) {
                        subDepartVO.getResult();
                    }

                    individualVO.getResult();

                    $scope.$emit("event:autoLoader", true);
                };
      
      
      
                function ResultVO() {
                    this.model = "ResultVO";
                }
                ResultVO.prototype = {
                    subColumn: [
                        {
                            displayName: "년/월",
                            field: "resultDate",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "목표매출",
                            field: "TARGET_REVENUE",
                            cellClass: "ta-r pr-5",
                            cellFilter: "number"
                        },
                        {
                            displayName: "매출달성",
                            field: "COMMIT",
                            cellClass: "ta-r pr-5",
                            cellFilter: "number"
                        },
                        {
                            displayName: "매출달성률",
                            field: "COMMIT_ACHIEVE",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "매출현황",
                            field: "COMMIT_PRESENT",
                            cellClass: "ta-r pr-5",
                            cellFilter: "number"
                        },
                        {
                            displayName: "목표마진",
                            field: "TARGET_MARGIN",
                            cellClass: "ta-r pr-5",
                            cellFilter: "number"
                        },
                        {
                            displayName: "마진달성",
                            field: "MARGIN",
                            cellClass: "ta-r pr-5",
                            cellFilter: "number"
                        },
                        {
                            displayName: "마진달성률",
                            field: "MARGIN_ACHIEVE",
                            cellClass: "ta-c"
                        },
                        {
                            displayName: "마진현황",
                            field: "MARGIN_PRESENT",
                            cellClass: "ta-r pr-25",
                            cellFilter: "number"
                        }
                    ],

                    setSubGridOptions: function ( dataList, subColumns ) {
                        angular.forEach( dataList, function ( data ) {
                            data.subGridOptions = {
                                columnDefs: subColumns,
                                data: data.monthResult
                            };
                        });
                    }
                };
      

                /**
                 * @name seniorDepartVO
                 * @description
                 * 상위부서 실적을 보여준다.
                 *
                 * @type {ResultVO}
                 */
                seniorDepartVO = $scope.seniorDepartVO = edt.create(
                    ResultVO.prototype,
                    {
                        visible      : page.isAccessable(APP_AUTH.ALL, APP_AUTH.MANAGER),
                        avgMarginRate: 0,
                        avgCommitRate: 0
                    }
                );
                seniorDepartVO.column = [
                    {
                        displayName: "목표매출",
                        field: "TARGET_REVENUE",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue() | number}}</div></div>"
                    },
                    {
                        displayName: "매출달성",
                        field: "COMMIT",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue() | number}}</div></div>"
                    },
                    {
                        displayName: "매출달성률",
                        field: "COMMIT_ACHIEVE",
                        cellClass: "ta-c",
                        aggregationType: uiGridConstants.aggregationTypes.avg,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{grid.appScope.seniorDepartVO.avgCommitRate | mathFloor:'%'}}</div></div>"
                    },
                    {
                        displayName: "매출현황",
                        field: "COMMIT_PRESENT",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue() | number}}</div></div>"
                    },
                    {
                        displayName: "목표마진",
                        field: "TARGET_MARGIN",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue() | number}}</div></div>"
                    },
                    {
                        displayName: "마진달성",
                        field: "MARGIN",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue() | number}}</div></div>"
                    },
                    {
                        displayName: "마진달성률",
                        field: "MARGIN_ACHIEVE",
                        cellClass: "ta-c",
                        aggregationType: uiGridConstants.aggregationTypes.avg,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{grid.appScope.seniorDepartVO.avgMarginRate | mathFloor}}%</div></div>"
                    },
                    {
                        displayName: "마진현황",
                        field: "MARGIN_PRESENT",
                        cellClass: "ta-r pr-25",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue() | number}}</div></div>"
                    }
                ];
                /**
                 * @description 상위부서 gridOption을 세팅한다.
                 */
                seniorDepartVO.gridOptions = {
                    data                  : [],
                    columnDefs            : (function () {
                        var column = [
                            {
                              displayName: "부서",
                              field: "DEPT_NAME",
                              cellClass: "ta-c"
                            }
                        ];
                        return column.concat( seniorDepartVO.column );
                    }()),
                    showColumnFooter      : true,
                    enableSorting         : false,
                    expandableRowTemplate : "expandableRow.tpl.html",
                    expandableRowHeight   : 150
                };
                /**
                 * 상위부서 실적정보를 가져온다.
                 */
                seniorDepartVO.getResult = function () {
                    seniorDepartVO.gridOptions.data = [];
                    var self  = this,
                        param = AnalysisResultSvc.makeSearchParam( searchVO );

                    AnalysisResultSvc.getSeniorResult(param).then(function (result) {
                        var sumaryInfo = AnalysisResultSvc.getCommonSumaryTotal( result.data );
                        self.avgCommitRate = sumaryInfo.avgCommitRate;
                        self.avgMarginRate = sumaryInfo.avgMarginRate;

                        self.setSubGridOptions(result.data, seniorDepartVO.subColumn);
                        self.gridOptions.data = result.data;
                    });
                };
      
      
                /**
                 * @name subDepartVO
                 * @description
                 * 하위부서 실적을 보여준다.
                 *
                 * @type {ResultVO}
                 */
                subDepartVO = $scope.subDepartVO = edt.create(
                    ResultVO.prototype,
                    {
                        visible         : page.isAccessable(APP_AUTH.ALL, APP_AUTH.MANAGER, APP_AUTH.TEAM),
                        tTargetRevenue  : 0,
                        tCommit         : 0,
                        avgMarginRate   : 0,
                        tSalesState     : 0,
                        tTargetMargin   : 0,
                        tMargin         : 0,
                        avgCommitRate   : 0,
                        tMarginState    : 0
                    }
                );
                subDepartVO.column = [
                    {
                        displayName: "목표매출",
                        field: "TARGET_REVENUE",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{grid.appScope.subDepartVO.tTargetRevenue | number}}</div></div>"
                    },
                    {
                        displayName: "매출달성",
                        field: "COMMIT",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{grid.appScope.subDepartVO.tCommit | number}}</div></div>"
                    },
                    {
                        displayName: "매출달성률",
                        field: "COMMIT_ACHIEVE",
                        cellClass: "ta-c",
                        aggregationType: uiGridConstants.aggregationTypes.avg,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{grid.appScope.subDepartVO.avgCommitRate | mathFloor}}%</div></div>"
                    },
                    {
                        displayName: "매출현황",
                        field: "COMMIT_PRESENT",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{grid.appScope.subDepartVO.tSalesState | number}}</div></div>"
                    },
                    {
                        displayName: "목표마진",
                        field: "TARGET_MARGIN",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{grid.appScope.subDepartVO.tTargetMargin | number}}</div></div>"
                    },
                    {
                        displayName: "마진달성",
                        field: "MARGIN",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{grid.appScope.subDepartVO.tMargin | number}}</div></div>"
                    },
                    {
                        displayName: "마진달성률",
                        field: "MARGIN_ACHIEVE",
                        cellClass: "ta-c",
                        aggregationType: uiGridConstants.aggregationTypes.avg,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{grid.appScope.subDepartVO.avgMarginRate | mathFloor}}%</div></div>"
                    },
                    {
                        displayName: "마진현황",
                        field: "MARGIN_PRESENT",
                        cellClass: "ta-r pr-25",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{grid.appScope.subDepartVO.tMarginState | number}}</div></div>"
                    }
                ];
                /**
                 * @description 상위부서 gridOption을 세팅한다.
                 */
                subDepartVO.gridOptions = {
                    data                  : [],
                    columnDefs            : (function () {
                        var column = [
                            {
                                displayName: "부서",
                                field: "DEPT_NAME",
                                cellClass: "ta-c"
                            }
                        ];
                        return column.concat( subDepartVO.column );
                    }()),
                    showColumnFooter      : true,
                    enableSorting         : false,
                    expandableRowTemplate : "expandableRow.tpl.html",
                    expandableRowHeight   : 150,
                    expandableRowScope    : {
                        subGridVariable : "subGridScopeVariable"
                    }
                };
                /**
                 * 하위부서 실적정보를 가져온다.
                 */
                subDepartVO.getResult = function () {
                    subDepartVO.gridOptions.data = [];
                    var self  = this,
                        param = AnalysisResultSvc.makeSearchParam( searchVO );

                    AnalysisResultSvc.getSubResult(param).then(function (result) {
                        var sumaryInfo = AnalysisResultSvc.getSubSumaryTotal(result.data);

                        self.tTargetRevenue = sumaryInfo.tTargetRevenue;
                        self.tCommit        = sumaryInfo.tCommit;
                        self.tSalesState    = sumaryInfo.tSalesState;
                        self.avgCommitRate  = sumaryInfo.avgCommitRate;
                        self.tTargetMargin  = sumaryInfo.tTargetMargin;
                        self.tMargin        = sumaryInfo.tMargin;
                        self.avgMarginRate  = sumaryInfo.avgMarginRate;
                        self.tMarginState   = sumaryInfo.tMarginState;

                        subDepartVO.setSubGridOptions(result.data, subDepartVO.subColumn);
                        subDepartVO.gridOptions.data = result.data;
                    });
                };
      
      
                /**
                 * @name individualVO
                 * @description
                 * 하위부서 실적을 보여준다.
                 *
                 * @type {ResultVO}
                 */
                individualVO = $scope.individualVO = edt.create(
                    ResultVO.prototype, {
                        visible         : true,
                        avgMarginRate   : 0,
                        avgCommitRate   : 0
                    }
                );
                individualVO.column = [
                    {
                        displayName: "목표매출",
                        field: "TARGET_REVENUE",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue()|number}}</div></div>"
                    },
                    {
                        displayName: "매출달성",
                        field: "COMMIT",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue()|number}}</div></div>"
                    },
                    {
                        displayName: "매출달성률",
                        field: "COMMIT_ACHIEVE",
                        cellClass: "ta-c",
                        aggregationType: uiGridConstants.aggregationTypes.avg,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{grid.appScope.individualVO.avgCommitRate | mathFloor}}%</div></div>"
                    },
                    {
                        displayName: "매출현황",
                        field: "COMMIT_PRESENT",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue()|number}}</div></div>"
                    },
                    {
                        displayName: "목표마진",
                        field: "TARGET_MARGIN",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue()|number}}</div></div>"
                    },
                    {
                        displayName: "마진달성",
                        field: "MARGIN",
                        cellClass: "ta-r pr-5",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue()|number}}</div></div>"
                    },
                    {
                        displayName: "마진달성률",
                        field: "MARGIN_ACHIEVE",
                        cellClass: "ta-c",
                        aggregationType: uiGridConstants.aggregationTypes.avg,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{grid.appScope.individualVO.avgMarginRate | mathFloor}}%</div></div>"
                    },
                    {
                        displayName: "마진현황",
                        field: "MARGIN_PRESENT",
                        cellClass: "ta-r pr-25",
                        cellFilter: "number",
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        aggregationHideLabel: true,
                        footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-5\">{{col.getAggregationValue()|number}}</div></div>"
                    }
                ];
                /**
                 * @description 상위부서 gridOption을 세팅한다.
                 */
                individualVO.gridOptions = {
                    data                  : [],
                    columnDefs            : (function () {
                        var column = [
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
                    showColumnFooter      : true,
                    enableSorting         : false,
                    expandableRowTemplate : "expandableRow.tpl.html",
                    expandableRowHeight   : 150,
                    expandableRowScope    : {
                        subGridVariable : "subGridScopeVariable"
                    }
                };
                /**
                 * 개인 실적정보를 가져온다.
                 */
                individualVO.getResult = function () {
                    individualVO.gridOptions.data = [];
                    var self  = this,
                        param = AnalysisResultSvc.makeSearchParam( searchVO );

                    AnalysisResultSvc.getIndividualResult(param).then(function (result) {
                        var sumaryInfo = AnalysisResultSvc.getCommonSumaryTotal(result.data);
                        self.avgCommitRate = sumaryInfo.avgCommitRate;
                        self.avgMarginRate = sumaryInfo.avgMarginRate;

                        self.setSubGridOptions(result.data, individualVO.subColumn);
                        self.gridOptions.data = result.data;
                    });
                };

                page.bootstrap(function() {
                    $timeout(function () {
                        searchVO.doInquiry();
                    }, 0);
                });
            }]);

}());