(function () {
    "use strict";

	/**
	 * @namespace analysis.vendor.controller
	 * @memberOf analysis.vendor
	 * @description
	 * 사업분석 > Vendor - 리스트
	 */
    var vendorApp = angular.module("analysis.vendor.controller");

	vendorApp.controller("analysis.vendorListCtrl", ["$scope", "APP_CODE", "SY.codeSvc", "SY.departSvc", "SY.userListSvc", "analysis.vendorListSvc", "$state", "$q", "$modal", "APP_CONFIG", "resData", "UtilSvc", "$timeout", "Page",
        function ($scope, APP_CODE, SyCodeSvc, SyDepartSvc, SyUserListSvc, AnalysisVendorListSvc, $state, $q, $modal, APP_CONFIG, resData, UtilSvc, $timeout, Page) {
	        var page  = $scope.page = new Page({ auth: resData.access }),
		        today = edt.getToday(),
		        searchVO, vendorVO;

	        page.setPreProcessor("searchStorage", function(next) {
		        AnalysisVendorListSvc.setStorageSearchParam(searchVO, UtilSvc.grid.getInquiryParam());
		        next();
	        });

	        page.setPreProcessor("columnStorage", function(next) {
		        AnalysisVendorListSvc.setStorageColumnsConfig(vendorVO, UtilSvc.grid.getColumns());
		        next();
	        });

	        page.setPreProcessor("code", function(next) {
		        var me = this,
			        param =  searchVO.createDeptAndRespCodeParam();

		        param.mngDept = { wk_grp: 2 };
		        me.code = {};

		        AnalysisVendorListSvc.getCodeData(param).then(function(result) {
			        if (page.isAccessAll()) {
				        result[0].data.unshift({CD: 1, NAME: "전사"});
			        }

			        // 상위부서코드(0), 하위부서코드(1), 영업대표코드(2), 사업유형코드(3),  제품유형코드(4), 진행상태코드(5), 수금상태코드(6), 제조사코드(7),
			        var codeKeys = ['seniorCodeList', 'departCodeList', 'salesRepList', 'businessCodeList', 'productCodeList', 'stateCodeList', 'collectCodeList', 'vendorList'];
			        angular.forEach(codeKeys, function (key, idx) {
				        me.code[key] = result[idx].data;
			        });

			        next();
		        });
	        });


            /**
             * @name searchVO
             * @description
             * 제조사 검색
             *
             * @type {Object}
             * @property {string} boxTitle
             * @property {Array.<string>} departList 선택된 하위부서
             * @property {Array.<string>} saleRepsList 선택된 영업대표
             * @property {Array.<string>} vendorCd 선택된 제조사
             * @property {string} customerCompany 고객사명
             * @property {string} salesCompany 매출처명
             * @property {string} businessName 사업명
             * @property {boolean} duplicationYn 중복사업여부
             * @property {boolean} commitYn commit 여부
             * @property {Array.<string>} businessTypeList 선택된 사업유형
             * @property {Array.<string>} productTypeList 선택된 제품유형
             * @property {Array.<string>} winrateList 선택된 winrate
             * @property {Array.<string>} ingStateList 선택된 수주진행상태
             * @property {string} funnelKind Funnel 검색기준(BELOW-이하, ABOVE-이상, EXCESS-초과, EQUAL-동등, UNDER-미만, SCOPE-범위)
             * @property {number|string} funnelStartScale Funnel 시작금액
             * @property {number|string} funnelEndScale Funnel 마지막금액
             * @property {string} costKind Cost 검색기준(BELOW-이하, ABOVE-이상, EXCESS-초과, EQUAL-동등, UNDER-미만, SCOPE-범위)
             * @property {number|string} costStartScale Cost 시작금액
             * @property {number|string} costEndScale Cost 마지막금액
             * @property {string} marginKind Margin 검색기준(BELOW-이하, ABOVE-이상, EXCESS-초과, EQUAL-동등, UNDER-미만, SCOPE-범위)
             * @property {number|string} marginStartScale Margin 시작금액
             * @property {number|string} marginEndScale Margin 마지막금액
             */
            searchVO = $scope.searchVO = {
                boxTitle : "검색",
	            kind            : (page.isAccessAll())  ? 1 : page.user.deptCode,
		        departList		: [],
		        saleRepsList	: [],
	            vendorCd        : [],
	            customerCompany	: "",
	            salesCompany	: "",
	            businessName	: "",
	            duplicationYn	: false,
	            commitYn		: false,
	            businessTypeList: [],
	            productTypeList	: [],
	            winrateList		: [],
	            ingStateList	: [],
	            funnelKind		: "",
                funnelStartScale: "",
                funnelEndScale	: "",
                costKind		: "",
                costStartScale	: "",
                costEndScale	: "",
                marginKind		: "",
                marginStartScale: "",
                marginEndScale	: "",
                date   : {
                    dateType   : "month",
                    buttonList : ["prevMonth", "current", "nextMonth", "1st", "2nd", "3rd", "4th", "year", "range"],
                    selected   : "current",
                    period : {
                        start : angular.copy(today),
                        end   : angular.copy(today)
                    }
                }
            };
	        /**
	         * @name searchVO.init
	         * @type function
	         * @description
	         *
	         * 검색조건을 초기화 하고 다시 검색한다.
	         */
	        searchVO.init = function () {
                var self = this;
	            self.kind               = (page.isAccessAll())  ? 1 : page.user.deptCode;
	            self.departList         = [];
	            self.saleRepsList       = [];
	            self.vendorCd           = [];
	            self.customerCompany    = "";
	            self.salesCompany       = "";
	            self.businessName       = "";
	            self.duplicationYn      = false;
	            self.commitYn           = false;
	            self.businessTypeList   = [];
	            self.productTypeList    = [];
	            self.winrateList        = [];
	            self.ingStateList       = [];
	            self.ingStateList       = [];
	            self.funnelKind         = "";
	            self.funnelStartScale   = "";
	            self.funnelEndScale	    = "";
	            self.costKind           = "";
	            self.costStartScale     = "";
	            self.costEndScale       = "";
	            self.marginKind         = "";
	            self.marginStartScale   = "";
	            self.marginEndScale     = "";
	            self.date.selected      = "current";

                $timeout(function () {
                    self.inquiry();
                }, 0);
            };
	        /**
	         * @name searchVO.initDept
	         * @type function
	         * @description
	         *
	         * 하위부서 선택을 초기화한다.
	         */
	        searchVO.initDept = function () {
		        this.departList = [];
		        this.getSalesUser();
	        };
	        /**
	         * @name searchVO.initUserList
	         * @type function
	         * @description
	         *
	         * 영업대표 선택을 초기화한다.
	         */
	        searchVO.initUserList = function () {
		        this.saleRepsList = [];
	        };
	        /**
	         * @name searchVO.initVendorList
	         * @type function
	         * @description
	         *
	         * 벤더사 선택을 초기화 시킨다.
	         */
            searchVO.initVendorList = function () {
                this.vendorCd = [];
            };
	        /**
	         * @name searchVO.initProjectType
	         * @type function
	         * @description
	         *
	         * 사업유형 선택을 초기화한다.
	         */
	        searchVO.initProjectType = function () {
		        this.businessTypeList = [];
	        };
	        /**
	         * @name searchVO.initProductType
	         * @type function
	         * @description
	         *
	         * 제품유형 선택을 초기화한다.
	         */
	        searchVO.initProductType = function () {
		        this.productTypeList = [];
	        };
	        /**
	         * @name searchVO.initWinRate
	         * @type function
	         * @description
	         *
	         * winrate 선택을 초기화한다.
	         */
	        searchVO.initWinRate = function () {
		        this.winrateList = [];
	        };
	        /**
	         * @name searchVO.initIngStatus
	         * @type function
	         * @description
	         *
	         * 진행상태 선택을 초기화한다.
	         */
	        searchVO.initIngStatus = function () {
		        this.ingStateList = [];
	        };
	        /**
	         * @name searchVO.initFunnel
	         * @type function
	         * @description
	         * Funnel 금액 검색을 초기화한다.
	         *
	         * @param {string} kind - 종류(동등, 이상, 이하, 초과, 미만, 범위)
	         */
	        searchVO.initFunnel= function (kind) {
		        this.funnelKind	= kind || "";
		        this.funnelStartScale = "";
		        this.funnelEndScale	  = "";
	        };
	        /**
	         * @name searchVO.initCost
	         * @type function
	         * @description
	         * Cost 금액 검색을 초기화한다.
	         *
	         * @param {string} kind - 종류(동등, 이상, 이하, 초과, 미만, 범위)
	         */
	        searchVO.initCost = function (kind) {
		        this.costKind = kind || "";
		        this.costStartScale = "";
		        this.costEndScale	= "";
	        };
	        /**
	         * @name searchVO.initMargin
	         * @type function
	         * @description
	         * Margin 금액 검색을 초기화한다.
	         *
	         * @param {string} kind - 종류(동등, 이상, 이하, 초과, 미만, 범위)
	         */
	        searchVO.initMargin = function (kind) {
		        this.marginKind = kind || "";
		        this.marginStartScale = "";
		        this.marginEndScale	  = "";
	        };
	        /**
	         * @name searchVO.initMargin
	         * @type function
	         * @description
	         * 벤더사를 검색한다.
	         */
	        searchVO.inquiry = function () {
	            var self = this;
	            AnalysisVendorListSvc.doInquiry(self).then(function (result) {
		            vendorVO.total = AnalysisVendorListSvc.getSumaryTotal(result.data);
		            vendorVO.options.data = result.data;
	            });
            };
	        /**
	         * 소속부서와 영업대표를 가져오기 위한 parameter를 생성한다.
	         * @returns {{mngDept: {wk_grp: number}, dept: ({mgr_cd}|{mgr_cd: string}), resp: string}}
	         */
	        searchVO.createDeptAndRespCodeParam = function() {
		        var me = this;
		        return {
			        mngDept : { wk_grp: 2 },
			        dept    : me.createDeptCodeParam(),
			        resp    : me.createRespCodeParam()
		        };
	        };
	        /**
	         * @name searchVO.createDeptCodeParam
	         * @kind function
	         * @description
	         * 소속부서를 가져오기 위한 Parameter를 생성한다.
	         *
	         * @returns {{mgr_cd: string}}
	         */
	        searchVO.createDeptCodeParam = function() {
		        var me = this,
			        mgrCode = me.kind ? ''+ me.kind : '1';

		        return { mgr_cd: mgrCode };
	        };
	        /**
	         * @name searchVO.createRespCodeParam
	         * @kind function
	         * @description
	         * 영업대표를 가져오기위한 Parameter를 생성한다.
	         *
	         * @returns {string}
	         */
	        searchVO.createRespCodeParam = function() {
		        var me = this,
			        param;

		        if (me.departList.length > 0) {
			        param = edt.makeGetParam(me.departList, 'sel_dept');
		        } else {
			        param = me.kind ? 'sel_dept='+ me.kind : 'sel_dept=1';
		        }

		        return param;
	        };
	        /**
	         * @name searchVO.getDeptAndResp
	         * @kind function
	         * @description
	         * 상위부서를 선택시 하위부서/팀 정보를 가져온다.
	         */
	        searchVO.getDeptAndResp = function () {
		          var me = this,
  						    param;

	           me.departList 	= [];
             me.saleRepsList = [];

             param = me.createDeptAndRespCodeParam();


		        $q.all([
			        SyDepartSvc.getDepart(param.dept),			    // 소속코드리스트
			        SyUserListSvc.getUserSearchCode(param.resp) 	// 영업사원코드리스트
		        ]).then(function ( result ) {
			        page.code.departCodeList   = result[0].data;
			        page.code.salesRepList     = result[1].data;
		        });
	        };
	        /**
	         * @name searchVO.getSalesUser
	         * @kind function
	         * @description
	         * 영업대표정보를 가져온다.
	         */
	        searchVO.getSalesUser = function () {
		        var me = this,
			        param = me.createRespCodeParam();

		        me.saleRepsList = [];

		        SyUserListSvc.getUserSearchCode(param).then(function (result) {
			        page.code.salesRepList = result.data;
		        });
	        };


            /**
             * 벤더사 리스트
             * @type {{}}
             */
            vendorVO = $scope.vendorVO = {
                boxTitle : "제조사(수주현황)",
                downloadUrl : "",
                total    : {
                    totFunnel   : 0,
                    totForecast : 0,
                    totCommit   : 0,
                    totCost     : 0,
                    totMargin   : 0,
                    avgMarginRate : 0
                },
                gridInfo		: {
                    columnDefs  : [
                        { displayName: "제조사", field: "NM_VED_C" },
	                    { displayName: "사업유형", field: "NM_ORDER_TYPE" },
                        { displayName: "사업명", field: "NM_PJT" },
                        { displayName: "고객사", field: "NM_CUST", cellClass: "ta-c" },
                        { displayName: "제품유형", field: "NM_PDT_TYPE", cellClass: "ta-c" },
                        { displayName: "제품매입처", field: "PRODUCT_NM_CUST", cellClass: "ta-c" },
                        { displayName: "수주년월", field: "DT_ORDER", cellClass: "ta-c" },
                        { displayName: "CommitY/N", field: "CD_COMMIT_ST", cellClass: "ta-c" },
                        { displayName: "Funnel", field: "FUNNEL", cellClass: "ta-r pr-15", cellFilter: "number" },
                        { displayName: "Winrate", field: "PT_WINRATE", cellClass: "ta-c", cellFilter: "mathFloor:'%'" },
                        { displayName: "Forecast", field: "FORECAST", cellClass: "ta-r pr-15", cellFilter: "number" },
                        { displayName: "Commit", field: "COMMIT", cellClass: "ta-r pr-15", cellFilter: "number" },
                        { displayName: "Cost", field: "COST", cellClass: "ta-r pr-15", cellFilter: "number" },
                        { displayName: "Margin", field: "MARGIN", cellClass: "ta-r pr-15", cellFilter: "number" },
                        { displayName: "MarginRate", field: "MARGIN_RATE", cellClass: "ta-c", cellFilter: "mathFloor:'%'" },
	                    { displayName: "진행상태", field: "NM_ORDER_ST", cellClass: "ta-c" },
                        { displayName: "영업사원", field: "NM_EMP", cellClass: "ta-c" }
                    ],
                    showColumns : [
                        { title: "제조사", field: "NM_VED_C" },
	                    { title: "사업유형", field: "NM_ORDER_TYPE" },
                        { title: "사업명", field: "NM_PJT" },
                        { title: "고객사", field: "NM_CUST" },
                        { title: "제품유형", field: "NM_PDT_TYPE" },
                        { title: "제품매입처", field: "PRODUCT_NM_CUST" },
                        { title: "수주년월", field: "DT_ORDER" },
                        { title: "CommitY/N", field: "CD_COMMIT_ST" },
                        { title: "Funnel", field: "FUNNEL" },
                        { title: "Winrate", field: "PT_WINRATE" },
                        { title: "Forecast", field: "FORECAST" },
                        { title: "Commit", field: "COMMIT" },
                        { title: "Cost", field: "COST" },
                        { title: "Margin", field: "MARGIN" },
                        { title: "MarginRate", field: "MARGIN_RATE" },
	                    { title: "진행상태", field: "NM_ORDER_ST" },
                        { title: "영업사원", field: "NM_EMP" }
                    ],
                    hideColumns		: []
                }
            };

            /**
             * 그리드 option을 설정한다.
             * @type {{rowTemplate: string, enableColumnResizing: boolean, exportFileNm: string, gridApi: string, total: null, data: Array, columnDefs: *[]}}
             */
            vendorVO.options = {
                rowTemplate	: "<div ng-dblclick=\"grid.appScope.vendorVO.moveDetailPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>",
                enableColumnResizing : true,
                exportFileNm : today.y +""+ today.m +""+ today.d +"_SALES",			// CSV 파일이름
                gridApi		 : "",
                total		 : null,
                data         : [],
                columnDefs   : [
                    { displayName: "제조사", field: "NM_VED_C" },
                    { displayName: "사업유형", field: "NM_ORDER_TYPE" },
                    { displayName: "사업명", field: "NM_PJT" },
                    { displayName: "고객사", field: "NM_CUST", cellClass: "ta-c" },
                    { displayName: "제품유형", field: "NM_PDT_TYPE", cellClass: "ta-c" },
                    { displayName: "제품매입처", field: "PRODUCT_NM_CUST", cellClass: "ta-c" },
                    { displayName: "수주년월", field: "DT_ORDER", cellClass: "ta-c" },
                    { displayName: "CommitY/N", field: "CD_COMMIT_ST", cellClass: "ta-c" },
                    { displayName: "Funnel", field: "FUNNEL", cellClass: "ta-r pr-15", cellFilter: "number" },
                    { displayName: "Winrate", field: "PT_WINRATE", cellClass: "ta-c", cellFilter: "mathFloor:'%'" },
                    { displayName: "Forecast", field: "FORECAST", cellClass: "ta-r pr-15", cellFilter: "number" },
                    { displayName: "Commit", field: "COMMIT", cellClass: "ta-r pr-15", cellFilter: "number" },
                    { displayName: "Cost", field: "COST", cellClass: "ta-r pr-15", cellFilter: "number" },
                    { displayName: "Margin", field: "MARGIN", cellClass: "ta-r pr-15", cellFilter: "number" },
                    { displayName: "MarginRate", field: "MARGIN_RATE", cellClass: "ta-c", cellFilter: "mathFloor:'%'" },
	                { displayName: "진행상태", field: "NM_ORDER_ST", cellClass: "ta-c" },
                    { displayName: "영업사원", field: "NM_EMP", cellClass: "ta-c" }
                ]
            };

            /**
             * 상세 페이지로 이동한다.
             * @param vendorInfo
             */
            vendorVO.moveDetailPage = function (vendorInfo) {
                $state.go('app.buBusiness', { kind: 'detail', menu: null, ids: vendorInfo.NO_ORDER_H });
            };

            /**
             * column 설정 layer popup을 연다.
             */
            vendorVO.modalSetField = function () {
                var self = this,
                    modalInstance = $modal.open({
                        templateUrl : "app/shared/modal/selectColumns/modal.selectColumns.tpl.html",
                        controller  : "modal.selectColumnsCtrl",
                        resolve		: {
                            revColumns : function () {
                                return self.gridInfo;
                            }
                        }
                    });

                modalInstance.result.then(function (result) {
                    self.gridInfo.showColumns = result.showColumns;
                    self.gridInfo.hideColumns = result.hideColumns;
                    self.options.columnDefs = UtilSvc.grid.getColumnDefs(self.gridInfo);

                    UtilSvc.grid.setColumns(result);
                });
            };

            vendorVO.download = function ( $e ) {
                $e.preventDefault();

	            AnalysisVendorListSvc.download( searchVO ).then(function ( result ) {
		            var fileName = result.data.fileName,
			            elem = edt.id("excelDownload"),
		                hiddenA;

		            if (elem) { hiddenA = document.createElement( "a" ); }
		            else { hiddenA = document.createElement( "a" ); }
		            hiddenA.setAttribute( "id", "excelDownload" );
		            hiddenA.setAttribute( "class", "throw" );
		            hiddenA.setAttribute( "href", APP_CONFIG.domain +"/analyze/vendor/exceldown?fileName="+ fileName );
		            document.body.appendChild( hiddenA );

		            hiddenA.click();
		            angular.element( hiddenA ).remove();
	            });
            };


            page.bootstrap(function() {
	            $timeout(function(){
		            searchVO.inquiry();
	            }, 0);
            });
        }
    ]);
}());
