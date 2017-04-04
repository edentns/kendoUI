(function() {
    'use strict';

    angular
        .module('CO.dashboard.controller')
        .controller('CoBigdealCtrl', CoBigdealCtrl);


    CoBigdealCtrl.$inject = ['$scope', 'CO.dashboardSvc', 'CoDashboardBiz', '$timeout', '$state'];
    
    function CoBigdealCtrl($scope, CoDashboardSvc, CoDashboardBiz, $timeout, $state) {
        $scope.$on('dashboard:query', function(event, payload) {
            CoDashboardBiz.setPayload(bigdeal, payload);

            bigdeal.table.search.deptCode = bigdeal.chart.search.deptCode = bigdeal.auth.manager ? 1 : bigdeal.user.deptCode;
            
            $timeout(function() {
                bigdeal.find();
            });
        });

        var bigdeal = $scope.bigdeal = {
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
                    target  = isChart ? bigdeal.chart : bigdeal.table;


                return CoDashboardSvc
                    .getImportantBusiness(me.getFindParam(target.search))
                    .then(function (result) {
                        target.data = result.data;
                        
                        if (isChart) {
                            target.config.data = result.data;
                        }
                    });
            },

            getFindParam: function(search) {
                var me      = this;
                return {
                    type	: search.tab.activeTabNm,
                    USER_CD : me.user.id,
                    ROLE_CD : me.user.accessCode,
                    dept    : search.deptCode
                };
            }
        };

        bigdeal.table = {
            search  : {
                tab : {
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

                        bigdeal.find();
                    },
                    equalsTabName: function (tabNm) {
                        return tabNm === this.activeTabNm;
                    }
                },
                deptCode: 0
            },
            data    : {},
            
            moveDetailPage:  function (bigDeal) {
            	$state.go('app.buBusiness', { kind: 'detail', menu: null, ids: bigDeal.ORDER_CD });
            }
        };

        bigdeal.chart = {
            search  : {
                tab : {
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

                        bigdeal.find();
                    },
                    equalsTabName: function (tabNm) {
                        return tabNm === this.activeTabNm;
                    }
                },
                deptCode: 0
            },
            data    : {}
        };
        bigdeal.chart.config = {
            data: []
        };
        bigdeal.chart.config.setting = {
            padding : { left : 200 },
            axis    : {
                x : {
                    type : "range",
                    domain  : function (data) {
                        var	unitNum = 100000000,
                            max     = Math.max(data.FUNNEL, data.FORCAST) + unitNum;

                        return max;
                    },
                    step    : 5,
                    line    : true,
                    format  : function(value) { return value/100000000 +"억"; }
                },
                y : { type : "block", domain : "PROJECT_NAME", line : true },
                data : bigdeal.chart.config.data
            },
            brush : [
                { type : "bar", target : "FUNNEL", colors : [ 0 ], outerPadding : 5 },
                { type : "bar", target : "FORCAST", colors : [ 2 ], outerPadding : 10 }
            ],
            tpl : {
                tooltip :
                '<div id="bar_chart_tooltip" class="popover popover-top">' +
                '<div class="head"><!= data.projectName !></div>' +
                '<div class="body">' +
                '<div class="message"><b>고객사</b>: <!= data.customerName !></div>' +
                '<div class="message"><b>Funnel</b>: <!= data.funnel !></div>' +
                '<div><b>Forecast</b>: <!= data.forecast !></div>' +
                '</div>' +
                '</div>'
            },
            event : {
                mouseover : function(obj, e) {
                    var tooltipData = {
                            projectName 	: obj.data.PROJECT_NAME,
                            customerName 	: obj.data.CUSTOMER_NAME,
                            funnel 			: edt.formatPrice(obj.data.FUNNEL),
                            forecast 		: edt.formatPrice(obj.data.FORCAST)
                        },
                        $tooltip = $(this.tpl.tooltip({ data: tooltipData }));

                    $("body").append($tooltip);
                    $tooltip.css({ display: "block", "z-index": 10000, left: e.pageX - $tooltip.width() / 2, top: e.pageY - $tooltip.height() });
                },
                mouseout : function() {
                    $("#bar_chart_tooltip").remove();
                }
            }
        };
    }

}());