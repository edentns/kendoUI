(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name SY.otherkendo.controller : SY.otherkendoCtrl
     * 부서관리
     */
    angular.module("SY.spendingresolutionkendo.controller", [ 'kendo.directives' ])
        .controller("SY.spendingresolutionkendoCtrl", ['APP_CONFIG', 'UtilSvc', "$scope", "$q", "SY.codeSvc", "SY.spendingresolutionkendoSvc", "APP_CODE", "resData", "Page", "$state", 'MenuSvc', '$location',
            function (APP_CONFIG, UtilSvc, $scope, $q, SyCodeSvc, SyspendingresolutionkendoSvc, APP_CODE, resData, Page, $state, MenuSvc, $location) {

	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                var menuId = MenuSvc.getMenuId($state.current.name);

                var now = new Date();
                var firstDay = kendo.date.firstDayOfMonth(now);
                var beforeLastDay = kendo.date.addDays(firstDay,-1);
                var day1 = new Date(beforeLastDay.getFullYear(), beforeLastDay.getMonth(), 15);
                var day2 = new Date(now.getFullYear(), now.getMonth(), 10);
                var day3 = new Date(now.getFullYear(), now.getMonth(), 15);
                /**
                 * searchVO
                 * # 검색과 관련된 정보.
                 * # 고객사 정보를 검색한다.
                 */
                var dateVO = $scope.dateVO = {
                    boxTitle : "검색",
                    procedureParam        : "BX.GW_SPENDING_RESOLUTIONS_S&sFromDt@s|sToDt@s|sReqDt@s|sDocSts@s",
                    procedureParam_update : "BX.GW_SPENDING_RESOLUTIONS_02U&sFromDt@s|sToDt@s",
                    dateObject1 : day1,
                    dateObject2 : day2,
                    dateObject3 : day3,
                    dateString1 : day1.dateFormat("Y/m/d"),
                    dateString2 : day2.dateFormat("Y/m/d"),
                    dateString3 : day3.dateFormat("Y/m/d"),
                    docstsString : "30"
                };

                kendo.culture("ko-KR");
                
                dateVO.doInquiry = function () {// 검색조건에 해당하는 유저 정보를 가져온다.
                    var param = {
                    	procedureParam:dateVO.procedureParam,
                    	data:[{
	                    	sFromDt:dateVO.dateObject1.dateFormat("Ymd"),
	                    	sToDt:dateVO.dateObject2.dateFormat("Ymd"),
	                    	sReqDt:dateVO.dateObject3.dateFormat("Ymd"),
	                    	sDocSts:dateVO.docstsString
                    	}]
                    };
                    
					UtilSvc.getGWExec(param).then(function (res) {
					});
                };
                

                dateVO.doUpdate = function () {// 전자문서명 수정
                    var param = {
                    	procedureParam:dateVO.procedureParam_update,
                    	data:[{
	                    	sFromDt:dateVO.dateObject1.dateFormat("Ymd"),
	                    	sToDt:dateVO.dateObject2.dateFormat("Ymd")
                    	}]
                    };
                    
					UtilSvc.getGWExec(param).then(function (res) {
					});
                };
                
//                var startDate = new kendo.ui.DatePicker($("#startDate"), {});
//                var today = new Date();
//                startDate.value(today);
                
                $scope.dateOptions = {
					format: "yyyy/MM/dd"
                };
                
                var gridErpUserVO = $scope.gridErpUserVO = {
                    messages: {
                        noRows: "ERP 사용자정보가 존재하지 않습니다.",
                        loading: "ERP 사용자정보를 가져오는 중...",
                        requestFailed: "요청 ERP 사용자정보를 가져오는 중 오류가 발생하였습니다.",
                        retry: "갱신",
                        commands: {
                            create: '추가',
                            destroy: '삭제',
                            save: '저장',
                            cancel: '취소'
                        }
                    },
                	boxTitle : "ERP 사용자",
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = {
                                	procedureParam:"BX.GW_SPENDING_RESOLUTIONS_01S&sFromDt@s",
                                	sFromDt:"20161215"
                                };
            					UtilSvc.getGWList(param).then(function (res) {
            						e.success(res.data.results[0]);
            					});
                			},
	                		create: function(e) {
	                			var defer = $q.defer();
	                			var param = {
                                	procedureParam:"BX.GW_SPENDING_RESOLUTIONS_01I&USE_EMP_NM@s|CTD_CD@s|CTD_NM@s|PRI_CUST_CD@s|PUB_CUST_CD@s|PUB_CUST_NM@s",
                                	data: e.data.models
                                };
            					UtilSvc.getGWExec(param).then(function (res) {
            						defer.resolve();
            						$scope.gridErpUserVO.dataSource.read();
            					});
	                			return defer.promise;
	            			},
                			update: function(e) {
                				var defer = $q.defer();
	                			var param = {
                                	procedureParam:"BX.GW_SPENDING_RESOLUTIONS_01U&USE_EMP_NM@s|CTD_CD@s|CTD_NM@s|PRI_CUST_CD@s|PUB_CUST_CD@s|PUB_CUST_NM@s",
                                	data: e.data.models
                                };
            					UtilSvc.getGWExec(param).then(function (res) {
            						defer.resolve();
            						$scope.gridErpUserVO.dataSource.read();
            					});
	                			return defer.promise;
                			},
                			destroy: function(e) {
                				var defer = $q.defer();
	                			var param = {
                                	procedureParam:"BX.GW_SPENDING_RESOLUTIONS_01D&USE_EMP_NM@s",
                                	data: e.data.models
                                };
            					UtilSvc.getGWExec(param).then(function (res) {
            						defer.resolve();
            						$scope.gridErpUserVO.dataSource.read();
            					});
	                			return defer.promise;
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		batch: true,
                		schema: {
                			model: {
                    			id: "USE_EMP_NM",
                				fields: {
                					ROW_NUM: {editable: false},
                					USE_EMP_NM: {validation: {required: true}},
                					CTD_CD: {},
                					CTD_NM: {},
                					PRI_CUST_CD: {},
                					PUB_CUST_CD: {},
                					PUB_CUST_NM: {},
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	toolbar: 
                		["create", "save", "cancel"],
                	columns: [
           		           {field: "ROW_NUM", title: "순서", width: 100},
        		           {field: "USE_EMP_NM", title: "직원명", width: 200},
        		           {field: "CTD_CD", title: "회계부서코드", width: 150},
        		           {field: "CTD_NM", title: "회계부서명", width: 200},
        		           {field: "PRI_CUST_CD", title: "일반거래처코드", width: 150},
        		           {field: "PUB_CUST_CD", title: "금융거래처코드", width: 150},
        		           {field: "PUB_CUST_NM", title: "금융거래처명", width: 200},
        		           {command: [ "destroy" ]}
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                	editable: true,
                	height: 300
                };
        }
    ]);
}());