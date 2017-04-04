(function() {
    'use strict';

    angular
        .module('CO.dashboard.controller')
        .controller('CoBusiPrscCtrl', CoBusiPrscCtrl);


    CoBusiPrscCtrl.$inject = ['$scope', 'CO.dashboardSvc', 'CoDashboardBiz', '$timeout'];

    function CoBusiPrscCtrl($scope, CoDashboardSvc, CoDashboardBiz, $timeout) {
        $scope.$on('dashboard:query', function(event, payload) {
            CoDashboardBiz.setPayload(busiPrsc, payload);
            $timeout(function() {
                busiPrsc.find();
            });
        });

        var today   = edt.getToday(),
            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m };

        var busiPrsc = $scope.busiPrsc = {
            tabName     : '',
            code        : {},
            user        : {},
            auth        : {
                all         : false,
                manager     : false,
                team        : false,
                individual  : false
            },
            table       : {},
            chart       : {},

            find: function() {
                var me      = this,
                    isChart = me.tabName === 'CHART',
                    target  = isChart ? busiPrsc.chart : busiPrsc.table;

                CoDashboardSvc
                    .getBusinessCondition(me.getFindParam(target.search))
                    .then(function(result) {
                        var total = {
                            signupCnt       : 0,
                            progressCnt     : 0,
                            completionCnt   : 0,
                            failCnt         : 0,
                            cancelCnt       : 0,
                            delayCnt        : 0,
                            totalCnt        : 0
                        };

                        target.search.deptList = [];

                        if (busiPrsc.auth.manager) {
                            target.search.deptList.push({ name: '전체', value: 0 });
                        }

                        if (result.data) {
                            result.data.forEach(function(data, idx) {
                                total.signupCnt     += data.signupCnt;
                                total.progressCnt   += data.progressCnt;
                                total.completionCnt += data.completionCnt;
                                total.failCnt       += data.failCnt;
                                total.cancelCnt     += data.cancelCnt;
                                total.delayCnt      += data.delayCnt;
                                total.totalCnt      += data.totalCnt;

                                target.search.deptList.push({
                                    name    : data.DEPT_NAME,
                                    value   : busiPrsc.auth.manager ? idx+1 : idx
                                });
                            });

                            target.total    = total;
                        }

                        target.data     = result.data;

                        if (isChart) {
                            if (busiPrsc.auth.manager) {
                                target.data = [{
                                    signupCnt    : total.signupCnt,
                                    progressCnt  : total.progressCnt,
                                    completionCnt: total.completionCnt,
                                    failCnt      : total.failCnt,
                                    cancelCnt    : total.cancelCnt,
                                    delayCnt     : total.delayCnt
                                }];

                                target.data         = target.data.concat(result.data);
                            }
                            target.config.data  = target.data[target.search.selected];
                        }
                    });
            },
            getFindParam: function(search) {
                var me      = this,
                    period  = search.period,
                    param   = {
                        start 	: period.startYear +"-"+ period.startMonth +"-01",
                        USER_CD : me.user.id,
                        ROLE_CD : me.user.accessCode || '1'
                    };


                if (period.type!=="current" && period.type!=="previous" && period.type!=="next") {
                    param.end = period.endYear +"-"+ period.endMonth +"-01";
                }

                return param;
            }
        };

        // TABLE
        busiPrsc.table = {
            search  : {
                deptList    : [],
                period      : angular.extend({ type: 'current' }, angular.copy(period))
            },
            total   : {
                signupCnt       : 0,
                progressCnt     : 0,
                completionCnt   : 0,
                failCnt         : 0,
                cancelCnt       : 0,
                delayCnt        : 0,
                totalCnt        : 0
            },
            data    : {}
        };

        // CHART
        busiPrsc.chart = {
            search: {
                deptList    : [],
                selected    : 0,
                period      : angular.extend({ type: 'current' }, angular.copy(period)),
                changeSelectedData: function () {
                    busiPrsc.chart.config.data = busiPrsc.chart.data[busiPrsc.chart.search.selected];
                }
            },
            config  : {
                data: { signupCnt: 1, progressCnt: 0, completionCnt: 0, failCnt: 0, cancelCnt: 0, delayCnt: 0 },
                name: { signupCnt: "수주등록", progressCnt: "수주진행", completionCnt: "수주완료", failCnt: "수주실패", cancelCnt: "수주취소", delayCnt: "수주지연" }
            },
            total   : {
                signupCnt       : 0,
                progressCnt     : 0,
                completionCnt   : 0,
                failCnt         : 0,
                cancelCnt       : 0,
                delayCnt        : 0,
                totalCnt        : 0
            },
            data    : {}
        };
        busiPrsc.chart.config.setting = {
            padding : 70,
            axis    : { data : [ busiPrsc.chart.config.data ] },
            brush   : {
                type    : "pie",
                showText: true,
                format  : function(key, value) { return value; }
            },
            widget : [
                {
                    type : "tooltip",
                    orient : "left",
                    format : function(data, key) {
                        var name = busiPrsc.chart.config.name;
                        return { key: name[key], value: data[key] };
                    }
                },
                {
                    type : "legend",
                    format : function(key) {
                        var name = busiPrsc.chart.config.name;
                        return name[key];
                    }
                }
            ]
        };

    }

}());
