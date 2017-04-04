(function () {
	'use strict';

	angular.module('edtApp.common.directive')
		.directive('menuNavigation', [function () {
			return {
				templateUrl: 'menuNavigation/template',
				restrict: 'AE',
				scope: {
					menuConfig: '='
				},
				link: function (scope) {

					scope.menuList = scope.menuConfig.data;

					$('.main-menu').on('click', 'a', function (e) {
						var obj = $(this),
							parents 		= obj.parents('li'),
							li 				= obj.closest('li.dropdown'),
							anotherItems 	= $('.main-menu li').not(parents),
							current, pre;

						anotherItems.find('a').removeClass('active');
						anotherItems.find('a').removeClass('active-parent');
						if (obj.hasClass('dropdown-toggle') || obj.closest('li').find('ul').length === 0) {
							obj.addClass('active-parent');
							current = obj.next();
							if (current.is(':visible')) {
								li.find('ul.dropdown-menu').slideUp('fast');
								li.find('ul.dropdown-menu a').removeClass('active');
							} else {
								anotherItems.find('ul.dropdown-menu').slideUp('fast');
								current.slideDown('fast');
							}
						} else {
							if (li.find('a.dropdown-toggle').hasClass('active-parent')) {
								pre = obj.closest('ul.dropdown-menu');
								pre.find('li.dropdown').not(obj.closest('li')).find('ul.dropdown-menu').slideUp('fast');
							}
						}
						if (obj.hasClass('active') === false) {
							obj.parents('ul.dropdown-menu').find('a').removeClass('active');
							obj.addClass('active');
						}

						if (obj.attr('href') === '#') {
							e.preventDefault();
						}
					});
				}
			};
		}])

		.directive('menuNode', ['$compile', '$templateCache', function ($compile, $templateCache) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					menuNode: '='
				},
				compile: function () {
					return {
						pre: function (scope, element, attr) {
							var compTemp = $compile($templateCache.get('menuNode/template'))(scope);
							element.append(compTemp);
						}
					};
				}
			};
		}])

		.run(['$templateCache', function ($templateCache) {
			$templateCache.put('menuNavigation/template', '' +
				'<ul class="nav main-menu">' +
					'<li ng-repeat="menu in menuList" ng-class="{\'dropdown\': menu._children.length > 0, opened: menu.active}">' +
						'<a ng-if="menu._children.length == 0" ui-sref="{{menu.path}}" title="{{menu.name}}" ng-class="{\'active-parent active\': menu.active}" ng-style="{\'padding-left\': menu.depth * 15 +\'px\'}">' +
							'<i class="fa {{menu.className}}"></i>&nbsp;<span>{{menu.name}}</span>' +
						'</a>' +
						'<a ng-if="menu._children.length > 0" class="dropdown-toggle" href="#" title="{{menu.name}}" ng-class="{\'active-parent active\': menu.active}" ng-style="{\'padding-left\': menu.depth * 15 +\'px\'}">' +
							'<i class="fa {{menu.className}}"></i>&nbsp;<span>{{menu.name}}</span>' +
						'</a>' +
						'<ul ng-if="menu._children.length > 0" menu-node="menu._children" class="dropdown-menu"></ul>' +
					'</li>' +
				'</ul>'
			);

			$templateCache.put('menuNode/template',
				'<li ng-repeat="menu in menuNode" ng-class="{\'dropdown\': menu._children.length > 0, opened: menu.active}">' +
					'<a ng-if="menu._children.length == 0" ui-sref="{{menu.path}}" title="{{menu.name}}" ng-class="{\'active-parent active\': menu.active}" ng-style="{\'padding-left\': menu.depth * 15 +\'px\'}">{{menu.name}}</a>' +
					'<a ng-if="menu._children.length > 0" class="dropdown-toggle" href="#" title="{{menu.name}}" ng-class="{\'active-parent\': menu.active}" ng-style="{\'padding-left\': menu.depth * 15 +\'px\'}">{{menu.name}}</a>' +
					'<ul ng-if="menu._children.length > 0" menu-node="menu._children" class="dropdown-menu"></ul>' +
				'</li>'
			);

		}]);
}());