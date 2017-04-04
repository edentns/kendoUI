(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name edmsApp.common.directive : contentSearchLayer
     * @description LAYOUT
     * @example
     * 	<div class="row" data-content-search-layer>
     * 		<div>
     *          <label for="groupCd">분류코드</label>
     *          <input data-ae-input-text id="groupCd" title="분류코드 입력" data-ng-model="view.groupCd"></span>
     *          <label for="groupNm">분류명칭</label>
     *          <input data-ae-input-text id="groupNm" title="분류명칭 입력" data-ng-model="view.groupNm"></span>
     *          <button type="button" class="btn btn-default" title="코드조회">조회</button>
     *      </div>
     *  </div>
     */
    angular.module("edtApp.common.directive")
        .directive("contentSearchLayer", [function () {
            return {
                priority    : 1,
                restrict    : "A",
                transclude  : true,
                scope       : true,
                link        : function ( scope ) {
                    scope.show   = true;
                    scope.toggle = function () {
                        scope.show = !scope.show;
                    };
                },
                template    :
                "<div class=\"search-tot-box\">\n" +
                "\t <div class=\"search\" data-ng-show=\"show\">\n" +
                "\t \t <div data-ng-transclude></div>\n" +
                "\t </div>\n" +
                "\t <button type=\"button\" class=\"toggle-btn\" title=\"검색 Show/Hide\" data-ng-click=\"toggle()\">\n" +
                "\t \t <i class=\"fa fa-lg\" data-ng-class=\"{'fa-caret-up': show, 'fa-caret-down': !show}\"></i>\n" +
                "\t </button>\n" +
                "</div>"
            };
        }]);
}());