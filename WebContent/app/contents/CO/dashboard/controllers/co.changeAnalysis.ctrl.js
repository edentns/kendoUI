(function() {
    'use strict';

    angular
        .module('CO.dashboard.controller')
        .controller('CoChangeAnalysisCtrl', CoChangeAnalysisCtrl);


    CoChangeAnalysisCtrl.$inject = ['$scope', 'CO.dashboardSvc', 'CoDashboardBiz', '$timeout'];

    function CoChangeAnalysisCtrl($scope, CoDashboardSvc, CoDashboardBiz, $timeout) {
        $scope.$on('dashboard:query', function(event, payload) {
            CoDashboardBiz.setPayload(changeAnalysis, payload);
            changeAnalysis.isVisible = (changeAnalysis.auth.individual || changeAnalysis.auth.team) && !changeAnalysis.auth.all && !changeAnalysis.auth.manager;

            if (changeAnalysis.isVisible) {
                $timeout(function() {
                    changeAnalysis.find();
                });
            }
        });

        var today   = edt.getToday();

        var changeAnalysis = $scope.changeAnalysis = {
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
            isVisible   : false,

            find: function() {
                var me      = this,
                    isChart = me.tabName === 'CHART',
                    target  = isChart ? changeAnalysis.chart : changeAnalysis.table;

                return CoDashboardSvc
                    .getChangeAnalysis(me.getFindParam(target.search))
                    .then(function (result) {
                        if (isChart) {
                            target.data     = result.data;
                            target.config.data = [];

                            result.data.forEach(function (o) {
                                var d1  = o.alterationList[0],
                                    d2  = o.alterationList[1],
                                    dif = o.alterationList[2];

                                target.config.target.y1[0].name = d1.TITLE;
                                target.config.target.y2[0].name = d2.TITLE;

                                target.config.data[0] = { name: 'funnel',   accuracy: o.FUNNEL_ACCURACY,   date1: d1.TITLE, value1: d1.FUNNEL,     date2: d2.TITLE, value2: d2.FUNNEL,     difference: dif.FUNNEL };
                                target.config.data[1] = { name: 'forecast', accuracy: o.FORECAST_ACCURACY, date1: d1.TITLE, value1: d1.FORCAST,    date2: d2.TITLE, value2: d2.FORCAST,    difference: dif.FORCAST };
                                target.config.data[2] = { name: 'commit',   accuracy: o.COMMIT_ACCURACY,   date1: d1.TITLE, value1: d1.COMMIT,     date2: d2.TITLE, value2: d2.COMMIT,     difference: dif.COMMIT };
                                target.config.data[3] = { name: 'cost',     accuracy: o.COST_ACCURACY,     date1: d1.TITLE, value1: d1.COST,       date2: d2.TITLE, value2: d2.COST,       difference: dif.COST };
                                target.config.data[4] = { name: 'margin',   accuracy: o.MARGIN_ACCURACY,   date1: d1.TITLE, value1: d1.MARGIN,     date2: d2.TITLE, value2: d2.MARGIN,     difference: dif.MARGIN };
                            });
                        }
                        else {
                            target.data = [];

                            result.data.forEach(function (o) {
                                target.data.push({
                                    TITLE   : '정확도',
                                    FUNNEL  : o.FUNNEL_ACCURACY,
                                    FORECAST: o.FORECAST_ACCURACY,
                                    COMMIT  : o.COMMIT_ACCURACY,
                                    COST    : o.COST_ACCURACY,
                                    MARGIN  : o.MARGIN_ACCURACY
                                });

                                o.alterationList.forEach(function (alteration) {
                                    target.data.push({
                                        TITLE   : alteration.TITLE,
                                        FUNNEL  : alteration.FUNNEL,
                                        FORECAST: alteration.FORCAST,
                                        COMMIT  : alteration.COMMIT,
                                        COST    : alteration.COST,
                                        MARGIN  : alteration.MARGIN
                                    });
                                });
                            });
                        }
                    });
            },

            getFindParam: function(search) {
                var me      = this;
                return {
                    flag	    : search.tab.activeTabNm,
                    startPeriod : search.date.year +'-'+ search.date.month +'-01',
                    USER_CD     : me.user.id,
                    ROLE_CD     : me.user.accessCode
                };
            }
        };

        changeAnalysis.table = {
            search  : {
                tab: {
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

                        changeAnalysis.find();
                    },
                    equalsTabName: function (tabNm) {
                        return tabNm === this.activeTabNm;
                    }
                },
                date: { type  : "current", year  : today.y, month : today.m }
            },
            data    : {}
        };

        changeAnalysis.chart = {
            search  : {
                tab: {
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

                        changeAnalysis.find();
                    },
                    equalsTabName: function (tabNm) {
                        return tabNm === this.activeTabNm;
                    }
                },
                date: { type  : "current", year  : today.y, month : today.m }
            },
            data    : {}
        };
        changeAnalysis.chart.config = {
            data: [],
            target: {
                y1: [ { visible: true, field: "value1", name: "" } ],
                y2: [ { visible: true, field: "value2", name: "" } ]
            }
        };
        changeAnalysis.chart.config.setting = {
            padding : { left : 50 },
            axis : {
                data : changeAnalysis.chart.config.data,
                x : { type : "block", domain : "name", line : true },
                y : {
                    type : "range",
                    domain: function (data) {
                        var unitNum = 100000000,
                            min = Math.min(data.value1, data.value2),
                            max = Math.max(data.value1, data.value2) + unitNum;

                        return [min < 0 ? min - unitNum : 0, max];

                    },
                    step : 10,
                    line : true,
                    format  : function(value) { return (value/100000000).toFixed(2) +"억"; }
                }
            },
            brush : [
                { type : "column", target : changeAnalysis.chart.config.target.y1, colors : [ 0 ], outerPadding : 30 },
                { type : "column", target : changeAnalysis.chart.config.target.y2, colors : [ 2 ], outerPadding : 50 }
            ],
            tpl : {
                tooltip :
                '<div id="column_chart_tooltip" class="popover popover-top">' +
                '<div class="head"><!= data.name !></div>' +
                '<div class="body">' +
                '<div class="message"><b><!= data.date1 !></b>: <!= data.value1 !></div>' +
                '<div class="message"><b><!= data.date2 !></b>: <!= data.value2 !></div>' +
                '<div class="message"><b>차액</b>: <!= data.difference !></div>' +
                '<div class="message"><b>정확도</b>: <!= data.accuracy !></div>' +
                '</div>' +
                '</div>'
            },
            event : {
                mouseover : function(obj, e) {
                    var tooltipData = {
                            name 	: obj.data.name.toUpperCase(),
                            date1 	: obj.data.date1,
                            value1  : edt.formatPrice(obj.data.value1),
                            date2 	: obj.data.date2,
                            value2  : edt.formatPrice(obj.data.value2),
                            difference : edt.formatPrice(obj.data.difference),
                            accuracy: obj.data.accuracy
                        },
                        $tooltip = $(this.tpl.tooltip({ data: tooltipData }));

                    $("body").append($tooltip);
                    $tooltip.css({ display: "block", "z-index": 10000, left: e.pageX - $tooltip.width() / 2, top: e.pageY - $tooltip.height() });
                },
                mouseout : function() {
                    $("#column_chart_tooltip").remove();
                }
            },
            widget: [ { type: "legend", brush: [0, 1], filter: true } ]
        };
    }
}());
