(function() {
    'use strict';

    angular
        .module('CO.dashboard.controller')
        .controller('CoManagedSalesPrscCtrl', CoManagedSalesPrscCtrl);


    CoManagedSalesPrscCtrl.$inject = ['$scope', 'CO.dashboardSvc', 'CoDashboardBiz', '$timeout'];

    function CoManagedSalesPrscCtrl($scope, CoDashboardSvc, CoDashboardBiz, $timeout) {

        $scope.$on('dashboard:query', function(event, payload) {
            CoDashboardBiz.setPayload(managed, payload);

            $timeout(function() {
                managed.find();
            });
        });

        var today   = edt.getToday(),
            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m };

        var managed = $scope.managed= {
            tabName     : '',
            code        : {},
            user        : {},
            table       : {},
            chart       : {},
            auth        : {
                all         : false,
                manager     : false,
                team        : false,
                individual  : false
            },

            find: function() {
                var me      = this,
                    isChart = me.tabName === 'CHART',
                    target  = isChart ? managed.chart : managed.table;

                return CoDashboardSvc
                    .getSharedSales(me.getFindParam(target.search))
                    .then(function (result) {
                        var total = {
                            targetRevenue   : 0,
                            funnel          : 0,
                            forecast        : 0,
                            commit          : 0,
                            targetMargin    : 0,
                            margin          : 0,
                            marginRate      : 0,
                            smrBill         : 0,
                            forecastAchieve : 0.00,
                            commitAchieve   : 0.00,
                            marginAchieve   : 0.00
                        };

                        if (result.data) {
                            result.data.forEach(function(data) {
                                total.targetRevenue += data.TARGET_REVENUE;
                                total.funnel        += data.FUNNEL;
                                total.forecast      += data.FORECAST;
                                total.commit        += data.COMMIT;
                                total.targetMargin  += data.TARGET_MARGIN;
                                total.margin        += data.MARGIN;
                                total.smrBill       += data.BIL_SALES;
                            });
                        }

                        target.total    = total;
                        target.data     = result.data;

                        if (isChart) {
                            target.first.config.data = target.second.config.data = result.data;
                        }
                        else {
                            target.total.marginRate      = (total.commit !== 0) ? (total.margin/total.commit)*100 : 0;
                            target.total.forecastAchieve = (total.targetRevenue !==0 ) ? edt.mathFloor(Number(total.forecast/total.targetRevenue * 100), 2) : 0.00;
                            target.total.commitAchieve   = (total.targetRevenue !==0 ) ? edt.mathFloor(Number(total.commit/total.targetRevenue * 100 ), 2)  : 0.00;
                            target.total.marginAchieve   = (total.targetMargin  !==0 ) ? edt.mathFloor(Number(total.margin/total.targetMargin * 100 ), 2 )  : 0.00;
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

        managed.table = {
            search  : {
                period      : angular.extend({ type: 'year' }, period)
            },
            total   : { targetRevenue: 0, funnel: 0, forecast: 0, commit: 0, targetMargin: 0, margin: 0, smrBill: 0 },
            data    : {}
        };

        managed.chart = {
            search  : {
                period      : angular.extend({ type: 'year' }, period)
            },
            total   : { targetRevenue: 0, funnel: 0, forecast: 0, commit: 0, targetMargin: 0, margin: 0, smrBill: 0 },
            data    : {}
        };

        managed.chart.search = {
            period  : { type: "year", startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m }
        };
        managed.chart.first   = {
            config: {
                data    : [],
                target  : {
                    y1: [
                        { visible: true,    field: "TARGET_REVENUE",    name: "목표매출" },
                        { visible: false,   field: "FUNNEL",            name: "FUNNEL" },
                        { visible: false,   field: "FORECAST",          name: "FORECAST" },
                        { visible: true,    field: "COMMIT",            name: "COMMIT" }
                    ],
                    y2: [
                        { visible: false,   field: "FORECAST_ACHIEVE",  name: "FORECAST달성률" },
                        { visible: true,    field: "COMMIT_ACHIEVE",    name: "COMMIT달성률" }
                    ]
                }
            }
        };
        managed.chart.second  = {
            config: {
                data    : [],
                target  : {
                    y1: [
                        { visible: true,    field: "TARGET_MARGIN",     name: "목표마진" },
                        { visible: true,    field: "MARGIN",            name: "마진" }
                    ],
                    y2: [
                        { visible: true,    field: "MARGIN_RATE",       name: "마진률" },
                        { visible: true,    field: "MARGIN_ACHIEVE",    name: "마진달성율" }
                    ]
                }
            }
        };

        managed.chart.first.config.setting = {
            padding: {left: 60},
            axis: [
                {
                    data: managed.chart.first.config.data,
                    x: { type: "block", domain: "DEPT_NAME" },
                    y: {
                        type    : "range",
                        domain  : function (data) {
                            var unitNum = 100000000,
                                o = CoDashboardBiz.getMaxMin(data, this.get("brush")[0].target);

                            return [o.min<0 ? o.min - unitNum : 0, o.max + unitNum];
                        },
                        format  : function (value) { return Math.floor(value / 100000000) + " 억"; },
                        step    : 10,
                        line    : true
                    }
                },
                {
                    x: {hide: true},
                    y: {
                        domain  : function (data) {
                            var unitNum = 10,
                                o = CoDashboardBiz.getMaxMin(data, this.get("brush")[1].target);

                            return [o.min<0 ? o.min - unitNum : 0, o.max + unitNum];
                        },
                        format  : function (value) { return edt.formatPrice(value) +" %"; },
                        line    : false,
                        orient  : "right"
                    },
                    extend: 0
                }
            ],
            brush: [
                { type: "column", target: managed.chart.first.config.target.y1, outerPadding: 10, innerPadding: 3, axis: 0, colors: [0, 1, 2, 3], animate: true },
                { type: "line", target: managed.chart.first.config.target.y2, axis: 1, colors: [4, 5], animate: true, display: "all" },
                { type: "scatter", target: managed.chart.first.config.target.y2, size : 10, axis : 1, colors: [4, 5] }
            ],
            widget: [
                { type : "tooltip", brush: [0, 2], format: function (data, key) {
                    return { key: key.field, name: key.name, value: edt.formatPrice(data[key.field]) };
                }},
                { type: "legend", brush: [0, 1], filter: true }
            ]
        };
        managed.chart.second.config.setting = {
            padding : { left : 60 },
            axis 	: [
                {
                    data    : managed.chart.second.config.data,
                    x 		: { type : "block", domain : "DEPT_NAME" },
                    y 		: {
                        type 	: "range",
                        domain  : function (data) {
                            var unitNum = 100000000,
                                o = CoDashboardBiz.getMaxMin(data, this.get("brush")[0].target);

                            return [o.min<0 ? o.min - unitNum : 0, o.max + unitNum];
                        },
                        format  : function(value) { return Math.floor(value/100000000) +" 억"; },
                        step 	: 10,
                        line 	: true
                    }
                },
                {
                    x 		: { hide : true },
                    y 		: {
                        domain  : function (data) {
                            var unitNum = 10,
                                o = CoDashboardBiz.getMaxMin(data, this.get("brush")[1].target);

                            return [o.min<0 ? o.min - unitNum : 0, o.max + unitNum];
                        },
                        format  : function (value) { return value +" %"; },
                        line    : false,
                        orient  : "right"
                    },
                    extend 	: 0
                }
            ],
            brush : [
                { type: "column", target: managed.chart.second.config.target.y1, outerPadding: 10, innerPadding: 3, axis: 0, colors: [0, 1], animate: true },
                { type: "line", target: managed.chart.second.config.target.y2, axis: 1, colors: [2, 3], animate: true, display: "all" },
                { type: "scatter", target: managed.chart.second.config.target.y2, size: 10, axis: 1, colors: [2, 3] }
            ],
            widget: [
                { type : "tooltip", brush: [0, 2], format: function (data, key) {
                    return { key: key.field, name: key.name, value: edt.formatPrice(data[key.field]) };
                }},
                { type: "legend", brush: [0, 1], filter: true }
            ]
        };
    }

}());
