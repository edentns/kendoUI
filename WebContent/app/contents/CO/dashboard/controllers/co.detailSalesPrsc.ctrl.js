(function() {
    'use strict';

    angular
        .module('CO.dashboard.controller')
        .controller('CoDetailSalesPrscCtrl', CoDetailSalesPrscCtrl);


    CoDetailSalesPrscCtrl.$inject = ['$scope', 'CO.dashboardSvc', 'CoDashboardBiz', '$timeout'];

    function CoDetailSalesPrscCtrl($scope, CoDashboardSvc, CoDashboardBiz, $timeout) {

        $scope.$on('dashboard:query', function(event, payload) {
            CoDashboardBiz.setPayload(detailSalesPrsc, payload);

            detailSalesPrsc.table.search.deptCode = detailSalesPrsc.chart.search.deptCode = detailSalesPrsc.auth.manager ? 1 : detailSalesPrsc.user.deptCode;

            $timeout(function() {
                detailSalesPrsc.find();
            });
        });

        var today   = edt.getToday(),
            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m };

        var detailSalesPrsc = $scope.detailSalesPrsc= {
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
                    target  = isChart ? detailSalesPrsc.chart : detailSalesPrsc.table;


                return CoDashboardSvc
                    .getQuarterBusiness(me.getFindParam(target.search))
                    .then(function (result) {
                        var total   = {
                            funnel     : 0,
                            forecast   : 0,
                            commit     : 0,
                            cost       : 0,
                            margin     : 0,
                            marginRate : 0.00
                        };

                        target.total    = total;
                        target.data     = result.data;

                        if (result.data) {
                            result.data.forEach(function(data) {
                                total.funnel    += data.FUNNEL;
                                total.forecast  += data.FORECAST;
                                total.commit    += data.COMMIT;
                                total.cost      += data.COST;
                                total.margin    += data.MARGIN;

                                data.ACCUMULATE_FUNNEL  = total.funnel;
                                data.ACCUMULATE_FORECAST= total.forecast;
                                data.ACCUMULATE_COMMIT  = total.commit;
                                data.ACCUMULATE_COST    = total.cost;
                                data.ACCUMULATE_MARGIN  = total.margin;
                            });
                        }

                        if (isChart) {
                            target.first.config.data = target.second.config.data = result.data;
                        } else {
                            target.total.marginRate = (total.commit !== 0) ? (total.margin/total.commit)*100 : 0.00;
                        }
                    });
            },

            getFindParam: function(search) {
                var me      = this,
                    period  = search.period,
                    param   = {
                        type	: search.tab.activeTabNm,
                        dept    : search.deptCode,
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

        detailSalesPrsc.table = {
            search  : {
                tab     : {
                    activeTabNm: "SALES",
                    tabs: [
                        { name: "수주관리", code: "ORDER", active: false },
                        { name: "매출관리", code: "SALES", active: true }
                    ],
                    changeTab: function ($e, tab) {
                        $e.preventDefault();

                        var me = this;
                        me.tabs.forEach(function (o) {
                            o.active = false;
                        });
                        me.activeTabNm = tab.code;
                        tab.active = true;

                        detailSalesPrsc.find();
                    },
                    equalsTabName: function (tabNm) {
                        return tabNm === this.activeTabNm;
                    }
                },
                deptCode: 0,
                period  : angular.extend({ type: 'year' }, period)
            },
            total   : { targetRevenue: 0, funnel: 0, forecast: 0, commit: 0, targetMargin: 0, margin: 0, smrBill: 0 },
            data    : {}
        };

        detailSalesPrsc.chart = {
            search  : {
                tab     : {
                    activeTabNm: "SALES",
                    tabs: [
                        { name: "수주관리", code: "ORDER", active: false },
                        { name: "매출관리", code: "SALES", active: true }
                    ],
                    changeTab: function ($e, tab) {
                        $e.preventDefault();

                        var me = this;
                        me.tabs.forEach(function (o) {
                            o.active = false;
                        });
                        me.activeTabNm = tab.code;
                        tab.active = true;

                        detailSalesPrsc.find();
                    },
                    equalsTabName: function (tabNm) {
                        return tabNm === this.activeTabNm;
                    }
                },
                deptCode: 0,
                period  : angular.extend({ type: 'year' }, period)
            },
            total   : { targetRevenue: 0, funnel: 0, forecast: 0, commit: 0, targetMargin: 0, margin: 0, smrBill: 0 },
            data    : {}
        };
        detailSalesPrsc.chart.first   = {
            config: {
                data    : [],
                target  : {
                    y1: [
                        { visible: false,   field: "FUNNEL",    name: "FUNNEL" },
                        { visible: true,    field: "FORECAST",  name: "FORECAST" },
                        { visible: true,    field: "COMMIT",    name: "COMMIT" },
                        { visible: false,   field: "COST",      name: "COST" },
                        { visible: true,    field: "MARGIN",    name: "마진" }
                    ],
                    y2: [
                        { visible: false,   field: "ACCUMULATE_FUNNEL",     name: "FUNNEL누적" },
                        { visible: true,    field: "ACCUMULATE_FORECAST",   name: "FORECAST누적" },
                        { visible: true,    field: "ACCUMULATE_COMMIT",     name: "COMMIT누적" },
                        { visible: false,   field: "ACCUMULATE_COST",       name: "COST누적" },
                        { visible: true,    field: "ACCUMULATE_MARGIN",     name: "마진누적" }
                    ]
                }
            }
        };
        detailSalesPrsc.chart.second  = {
            config: {
                data    : [],
                target  : { y1: [ { visible: true, field: "MARGIN_RATE", name: "마진률" } ] }
            }
        };
        detailSalesPrsc.chart.first.config.setting = {
            padding : { left : 60 },
            axis : [
                {
                    data: detailSalesPrsc.chart.first.config.data,
                    x   : { type : "block", domain : "ORDER_D" },
                    y   : {
                        type  : "range",
                        domain: function (data) {
                            var unitNum = 100000000,
                                o = CoDashboardBiz.getMaxMin(data, this.get("brush")[0].target);

                            return [o.min<0 ? o.min - unitNum : 0, o.max + unitNum];
                        },
                        format: function(value) { return Math.floor(value/100000000) +" 억"; },
                        step : 10, line : true
                    }
                },
                {
                    x   : { hide : true },
                    y   : {
                        domain: function (data) {
                            var unitNum = 100000000,
                                o = CoDashboardBiz.getMaxMin(data, this.get("brush")[1].target);

                            return [o.min<0 ? o.min - unitNum : 0, o.max + unitNum];
                        },
                        format: function(value) { return Math.floor(value/100000000) +" 억"; },
                        orient : "right", line: false
                    },
                    extend : 0
                }
            ],
            brush : [
                { type : "column",  target: detailSalesPrsc.chart.first.config.target.y1, axis : 0, colors : [0, 1, 2, 3, 4], animate : true },
                { type : "line",    target: detailSalesPrsc.chart.first.config.target.y2, axis : 1, colors : [5, 6, 7, 8, 9], animate : true },
                { type : "scatter", target: detailSalesPrsc.chart.first.config.target.y2, size : 10, axis : 1, colors : [5, 6, 7, 8, 9] }
            ],
            widget : [
                { type : "tooltip", brush: [0, 2], format: function (data, key) {
                    return { key: key.field, name: key.name, value: edt.formatPrice(data[key.field]) };
                }},
                { type: "legend", brush: [0, 1], filter: true }
            ]
        };
        detailSalesPrsc.chart.second.config.setting = {
            padding : { left : 60 },
            axis : [
                {
                    data: detailSalesPrsc.chart.second.config.data,
                    x   : { type : "block", domain : "ORDER_D" },
                    y   : {
                        type : "range",
                        domain  : function (data) {
                            var unitNum = 10,
                                min     = Math.min(data.MARGIN_RATE),
                                max     = Math.max(data.MARGIN_RATE) + unitNum;

                            return [min<0 ? min - unitNum : 0, max];
                        },
                        format  : function (value) { return value +" %"; },
                        step : 10,
                        line : true
                    }
                }
            ],
            brush : [
                { type : "column", target: detailSalesPrsc.chart.second.config.target.y1, axis : 0, colors : [0], animate : true, display: "all" }
            ],
            widget : [
                { type : "tooltip", brush: [0], format: function (data, key) {
                    return { key: key.field, name: key.name, value: edt.formatPrice(data[key.field]) };
                }},
                { type: "legend", brush: [0], filter: true }
            ]
        };

    }

}());
