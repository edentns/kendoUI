(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name BU.aimSaleskendoMng.controller : BU.aimSaleskendoMngCtrl
     * 부서관리
     */
    angular.module("BU.aimSaleskendoMng.controller", [ 'kendo.directives' ])
        .controller("BU.aimSaleskendoMngCtrl", ['APP_CONFIG', 'UtilSvc', '$scope', '$q', 'SY.codeSvc', 'SY.departSvc', 'SY.userListSvc', 
                                                'APP_CODE', 'resData', 'Page', '$state', 'MenuSvc', '$location', 'APP_AUTH', 'BU.aimSaleskendoMngBiz', 
            function (APP_CONFIG, UtilSvc, $scope, $q, SyCodeSvc, SyDepartSvc, SyUserListSvc, 
            		  APP_CODE, resData, Page, $state, MenuSvc, $location, APP_AUTH, BuAimSaleskendoMngBiz) {

            var page  = $scope.page = new Page({ auth: resData.access }),
                today = edt.getToday(),
                menuId = MenuSvc.getMenuId($state.current.name),
                vm = {
        			isAccessTotal   : page.isAccessable(APP_AUTH.ALL),
        			isAccessDepart  : page.isAccessable(APP_AUTH.ALL, APP_AUTH.MANAGER, APP_AUTH.TEAM),
        			save    : function(aim) {
        				aim.save().then(function() {
        					alert('저장되었습니다.');
        					!aim.userId ? (search.inquiry({ total : 'TOTAL', depart: 'DEPT' })) : search.inquiry({ person: 'EMPL' });
        				});
        			}
        		}, 
        		search;

        	page.setPreProcessor('code', function(next) {
        		var me = this,
        			param =  BuAimSaleskendoMngBiz.createDeptAndRespCodeParam(search.data);

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
        			var allCode = { CD: 1, NAME: '전체' };
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
             * @name vm.search
             * @kind object
             * @description
             * 목표매출 검색
             *
             * @type {{boxTitle: string, data: {year, kind: number, depart: number, salesRep: number}}}
             */
            search = vm.search = {
                boxTitle: '검색',
                data: {
                    year        : today.y,
                    kind        : (page.isAccessAll())? 1 : page.user.deptCode,
                    depart      : 1,
                    salesRep    : 1
                }
            };
            /**
             * @name vm.search.inquiry
             * @kind function
             * @description
             * 목표매출정보를 조회한다.
             */
            search.inquiry = function(list) {
                list = list || { total : 'TOTAL', depart: 'DEPT', person: 'EMPL' };

                var me = this,
                    param =  BuAimSaleskendoMngBiz.getFindParam(me.data);
                //BuAimSalesMngBiz.getFindParam(me.data);

//                    angular.forEach(list, function(type, key) {
//                        BuAimSalesMngSvc.find(type, param).then(function(response) {
//                            BuAimSalesMngBiz.setData(vm.aim[key], response.data.result, page.isWriteable());
//                        });
//                    });

            };
            /**
             * @name vm.search.init
             * @kind function
             * @description
             * 목표매출 검색조건을 초기화한다.
             */
            search.init = function() {
                var me = this;

                me.data.year    = today.y;
                me.data.kind    = (page.isAccessAll())  ? 1 : page.user.deptCode;
                me.data.depart  = 1;
                me.data.salesRep= 1;

                $timeout(function() {
                    me.inquiry({ total : 'TOTAL', depart: 'DEPT', person: 'EMPL' });
                }, 0);
            };
            /**
             * @name vm.search.getDeptAndResp
             * @kind function
             * @description
             * 상위부서 선택시 하위부서/팀 과 영업대표를 가져온다.
             */
            search.getDeptAndResp = function () {
                var me = this,
                    param;

                me.data.depart      = 1;
                me.data.salesRep    = 1;
                param = BuAimSaleskendoMngBiz.createDeptAndRespCodeParam(me.data);

                $q.all([
                    SyDepartSvc.getDepart(param.dept),              // 소속코드리스트
                    SyUserListSvc.getUserSearchCode(param.resp)     // 영업사원코드리스트
                ]).then(function ( result ) {
                    page.code.departCodeList    = page.code.departCodeList.slice(0, 1).concat(result[0].data);
                    page.code.salesRepList      = page.code.salesRepList.slice(0, 1).concat(result[1].data);
                });
            };
            /**
             * @name vm.search.getSalesUser
             * @kind function
             * @description
             * 영업대표 리스트를 가져온다.
             */
            search.getSalesUser = function () {
                var me = this,
                    param;

                me.data.salesRep = 1;
                param = BuAimSalesMngBiz.createRespCodeParam(me.data);

                SyUserListSvc.getUserSearchCode(param).then(function (result) {
                    page.code.salesRepList = page.code.salesRepList.slice(0, 1).concat(result.data);
                });
            };
            
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
            
            dateVO.doInquiry = function () {// 검새조건에 해당하는 유저 정보를 가져온다.
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
                                procedureParam:"HAHM_Test"
                            };
                            UtilSvc.getHList(param).then(function (res) {
                                e.success(res.data.results[0]);
                            });
                        },
                        create: function(e) {
                            var defer = $q.defer();
                            var param = {
                                procedureParam:"HAHM_Test_U&AM_SALES_1@s|NO_EMP@s",
                                data: e.data.models
                            };
                            UtilSvc.getHGWExec(param).then(function (res) {
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
                            //id: "USE_EMP_NM",
                            fields: {
                            	NO_EMP: {},
                            	AM_SALES_1: {},
                            }
                        }
                    }
                }),
                //navigatable: true,
                toolbar: ["create", "save", "cancel"],
                columns: [
                          {field: "NO_EMP", title: "NO_EMP", width: 100},
                          {field: "AM_SALES_1", title: "AM_SALES_1", width: 100}
                ],
                collapse: function(e) {
                    // console.log(e.sender);
                    this.cancelRow();
                },
                editable: true,
                height: 300
            };
            
        	$scope.vm = vm;
        }
    ]);
}());