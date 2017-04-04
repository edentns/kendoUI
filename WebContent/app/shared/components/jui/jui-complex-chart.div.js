/* global $ */
(function () {
	"use strict";

	angular.module("edtApp.common.directive")
		.directive("juiChart", ["$timeout", function ( $timeout ) {
			return {
				restrict: "AE",
				scope    : {
					type	: "@juiChart",
					config	: "=juiConfig"
				},
				template: "<div class='chart-container' jui-chart-container><div>"
			};
		}])

		.directive("juiChartContainer", ["$timeout", function ( $timeout ) {
			return {
				restrict: "AE",
				scope   : false,
				replace : true,
				link	: function (scope, elem) {
					var chartBuilder 	= jui.include("chart.builder"),
						type    = scope.type,
						data    = scope.config.data,
						name 	= scope.config.name,
						setting = scope.config.setting,
						chart;

					scope.$watch("config", function () {
						chart = chartBuilder(elem[0], setting);

						var elemIcon = document.createElement("i"),
							body = $("body");

						elemIcon.setAttribute("class", "fa fa-arrows-alt fa-2x");
						elemIcon.onclick = function () {
							var $closetChart = elem.closest(".chart");
							var timeout = 0;

							$closetChart.toggleClass("expanded");
							body.toggleClass("body-expanded");

							if (body.hasClass("body-expanded")) { timeout = 100; }

							$timeout(function () { $closetChart.toggleClass("expanded-padding"); }, timeout);
							$timeout(function () { $closetChart.resize(); }, timeout + 50);
							$timeout(function () { chart.render(true); }, timeout + 350); };

						elem[0].appendChild(elemIcon);
					});

					scope.$watch("config.data", function (newValue, prevValue) {
						if (newValue !== prevValue) {
							switch (type) {
								case "pie":
									var newData = {};
									angular.forEach(name, function (v, k) {
                                        newData[k] = newValue ? newValue[k] : 0;
									});

									chart.axis(0).update([ newData ]);
									break;

								case "complex":
									chart.axis(0).update(newValue);
									chart.axis(1).update(newValue);
									chart.on("legend.filter", function (target, idx) {
										if (idx === 1) {
											chart.updateBrush(2, {
												target : target
											});
											chart.render();
										}
									});
									break;

								case "diffColumn":
									chart.axis(0).update(newValue);
									chart.updateBrush(0, { target: scope.config.target.y1 });
									chart.updateBrush(1, { target: scope.config.target.y2 });

									break;

								default:
									chart.axis(0).update(newValue);
									break;
							}

							chart.render(true);
						}
					});

					scope.$on("$destroy", function () {
						chart = null;
					});
				}
			};
		}]);
}());