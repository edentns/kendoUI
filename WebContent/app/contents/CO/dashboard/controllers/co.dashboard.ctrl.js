(function() {
    'use strict';

    angular
        .module('CO.dashboard.controller')
        .controller('CoDashboardCtrl', CoDashboardCtrl);


    CoDashboardCtrl.$inject = ['$scope', '$state', 'APP_AUTH', 'Page', 'SY.departSvc', 'CoDashboardBiz', 'resData', '$timeout', 'ModalSvc', 'UtilSvc'];

    function CoDashboardCtrl($scope, $state, APP_AUTH, Page, SyDepartSvc, CoDashboardBiz, resData, $timeout, ModalSvc, UtilSvc) {
        var vm      = this;
        var page    = $scope.page = new Page({ auth: resData.access }),
            LOCAL_LIST_KEY = 'DASHBOARD-LIST',

            defaultComponents = [
                {
                    visible     : true,
                    order       : 1,
                    name        : 'busiPrsc',
                    displayName : '사업현황',
                    templateURL : 'app/contents/CO/dashboard/templates/co.busiPrsc.tpl.html'
                },
                {
                    visible     : true,
                    order       : 2,
                    name        : 'salesPrsc',
                    displayName : '매출현황',
                    templateURL : 'app/contents/CO/dashboard/templates/co.salesPrsc.tpl.html'
                },
                {
                    visible     : true,
                    order       : 3,
                    name        : 'managedSalesPrsc',
                    displayName : 'Managed매출현황',
                    templateURL : 'app/contents/CO/dashboard/templates/co.managedSalesPrsc.tpl.html'
                },
                {
                    visible     : true,
                    order       : 4,
                    name        : 'detailSalesPrsc',
                    displayName : '월/분기사업현황',
                    templateURL : 'app/contents/CO/dashboard/templates/co.detailSalesPrsc.tpl.html'
                },
                {
                    visible     : true,
                    order       : 5,
                    name        : 'changeAnalysis',
                    displayName : '변경분석',
                    templateURL : 'app/contents/CO/dashboard/templates/co.changeAnalysis.tpl.html'
                },
                {
                    visible     : true,
                    order       : 6,
                    name        : 'bigdeal',
                    displayName : 'Bigdeal',
                    templateURL : 'app/contents/CO/dashboard/templates/co.bigdeal.tpl.html'
                }
            ];

        page.setPreProcessor("listStorage", function(next) {
            var componentsList = UtilSvc.localStorage.getItem(LOCAL_LIST_KEY);
            if (componentsList) {
                vm.components = componentsList;
            }
            next();
        });

        page.setPreProcessor("code", function(next) {
            var param =  CoDashboardBiz.getFindDeptCodeParam({
                accessCode  : page.auth.accessCode,
                id          : page.user.id,
                deptCode    : page.user.deptCode,
                auth        : page.getUserAuth(page.auth.accessCode)
            });

            SyDepartSvc.getDepart(param).then(function (result) {
                if (page.isAccessAll() || page.isAccessManager()) {
                    result.data.unshift({ CD: 1, NAME: '전체' });
                }

                vm.code.deptCodeList = result.data;

                next();
            });
        });

        vm.broadcast = function() {
            $timeout(function() {
                //$scope.$broadcast('dashboard:query', vm.tab.activeTabNm, { code: vm.code, user: vm.search });
                $scope.$broadcast('dashboard:query', {
                    tabName : vm.tab.activeTabNm,
                    code    : vm.code,
                    user    : {
                        id          : vm.search.id,
                        name        : vm.search.name,
                        deptCode    : vm.search.deptCode,
                        deptName    : vm.search.deptName,
                        accessCode  : vm.search.accessCode
                    },
                    auth    : vm.search.auth
                });
            }, 0);
        };

        vm.setLoginUser = function() {
            vm.search.id            = page.user.id;
            vm.search.name          = page.user.name;
            vm.search.deptCode      = page.user.deptCode;
            vm.search.deptName      = page.user.deptName;
            vm.search.accessCode    = page.auth.accessCode;
            vm.search.auth          = page.getUserAuth(page.auth.accessCode);
        };

        vm.removeDashboardSetting = function() {
            var message = '설정된 정보를 초기화 하시겠습니까?';
            if (confirm(message)) {
                UtilSvc.localStorage.removeItem(LOCAL_LIST_KEY);
                vm.components = angular.copy(defaultComponents);
                vm.broadcast();
            }
        };

        vm.openDashboardSetting = function() {
            var modalInstance = ModalSvc.openConfirmPopup({
                templateUrl : 'app/contents/CO/dashboard/templates/co.dashboardSetting.modal.tpl.html',
                controller  : 'CoDashboardSettingModalCtrl',
                resolve: {
                    payload: function() {
                        return {
                            data: vm.components
                        };
                    }
                }
            });

            modalInstance.result.then(function(result) {
                vm.components = result;
                vm.broadcast();
                UtilSvc.localStorage.setItem(LOCAL_LIST_KEY, vm.components);
            });

        };

        /**
         * 페이지 공통 코드
         */
        vm.code = {
            deptCodeList : []
        };

        /**
         * 페이저 공통 검색
         */
        vm.search       = {
            id          : page.user.id,
            name        : page.user.name,
            deptCode    : page.user.deptCode,
            deptName    : page.user.deptName,
            accessCode  : page.auth.accessCode,
            auth        : page.getUserAuth(page.auth.accessCode),

            selectText  : function ($event) {
                $event.currentTarget.select();
            },

            /**
             * Dashboard 정보를 검색한다.
             * @param {String} type 검색유형 'MY'이면, 자신의 정보를 검색한다.
             */
            findUser : function (type) {
                var search = this;

                if (type === "MY") {
                    vm.setLoginUser();
                }

                CoDashboardBiz.findUser(search).then(function (result) {
                    search.id           = result.empNo;
                    search.name         = result.name;
                    search.deptCode     = result.departCd;
                    search.deptName     = result.depart;
                    search.accessCode   = result.roleCd;
                    search.auth         = page.getUserAuth(result.roleCd);
                }).then(function () {
                    CoDashboardBiz.findDeptCode(search).then(function (result) {
                        if (page.isAccessAll() || page.isAccessManager()) {
                            vm.code.deptCodeList = [{CD: 1, NAME: "전체"}].concat(result.data);
                        }
                    }).then(vm.broadcast);
                });
            }
        };

        // 2016-08-02
        // -1-
        // 마지막으로 선택된 탭 값 불러오기.
        var activeTabName = UtilSvc.localStorage.getItem('activeTabName') || 'CHART';
        var tabs = [
                ((!!activeTabName) && activeTabName === 'CHART'),
                ((!!activeTabName) && activeTabName === 'TABLE')
            ];

        vm.tab  = {
            activeTabNm: activeTabName,
            tabs: [
                { active: tabs[0], name: "CHART" },
                { active: tabs[1], name: "TABLE" }
            ],
            changeTab: function ($e, tab) {
                $e.preventDefault();

                var me = this,
                    lastSelectedTab = '';

                if (me.activeTabNm === tab.name) { return; }

                me.tabs.forEach(function (o) {
                    o.active = false;
                });
                me.activeTabNm = tab.name;
                tab.active = true;
                
                // 2016-08-02
                // -1-
                // 대쉬보드에서 마지막으로 선택한 탭 이름 저장.
                UtilSvc.localStorage.setItem('activeTabName', tab.name);

                vm.broadcast();

                // 날짜 초기화
                //me.initSearchPeriod();
                //bigDeal.findBigDeal();  // 글로벌 탭 클릭 시 BIG DEAL은 조회를 해주어야한다.
            },
            equalsTabName: function (tabNm) {
                return tabNm === this.activeTabNm;
            }
        };

        vm.components   = angular.copy(defaultComponents);

        vm.changeComponent = function() {
            vm.components[0].order = 2;
            vm.components[1].order = 1;
        };
        vm.removeComponent = function() {
            vm.components[0].visible = false;
        };
        vm.addComponent = function() {
            vm.components[0].order = 1;
            vm.components[1].order = 2;
            vm.components[0].visible = true;
            vm.broadcast();
        };


        page.bootstrap(function() {
            vm.broadcast();
        });
    }

}());
