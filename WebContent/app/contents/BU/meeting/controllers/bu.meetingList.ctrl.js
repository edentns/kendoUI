(function () {
    "use strict";

    /**
     * @name BU.meeting.controller : BU.meetingListCtrl
     * 월별회의록
     */
    angular.module("BU.meeting.controller")
        .controller("BU.meetingListCtrl", ["$scope", "BU.meetingListSvc", "$location", "ngTableParams", "$filter", "$window", "$state", "APP_CONFIG", "MenuSvc", "resData", "Page",
            function ($scope, BuMeetingListSvc, $location, ngTableParams, $filter, $window, $state, APP_CONFIG, MenuSvc, resData, Page) {
	            var page    = $scope.page = new Page({ auth: resData.access }),
		            menuId  = MenuSvc.getMenuId($state.current.name),
		            today   = edt.getToday(),
		            view, searchVO, meetingVO;

                
                view = $scope.view = {};

                /**
                 * @description Page 초기로드시 실행된다.
                 */
                view.initLoad = function () {
                    var meetingSearchInfo = $window.sessionStorage.getItem(page.user.id+""+ menuId),
                        meetingSearchPage = $window.sessionStorage.getItem(page.user.id+""+ menuId +"page");

                    if (meetingSearchInfo) {
                        meetingSearchInfo   = JSON.parse(meetingSearchInfo);
                        searchVO.date.start = meetingSearchInfo.start;
                        searchVO.date.end   = meetingSearchInfo.end;
                    }

                    if (meetingSearchPage) {
                        meetingVO.pageNum = Number(meetingSearchPage);
                    }

                    searchVO.doInquiry(meetingVO.pageNum);
                };



                /**
                 * [ searchVO ]
                 * -----------------------------------------------------------------------------------------------------------------
                 * @type {Object} date 등록기간 검색일자( date:{start: string, end: string} )
                 * @type {Function} doInquiry 회의록 정보를 조회한다.
                 * @type {Function} doInit 검색조건을 초기화한다.
                 * -----------------------------------------------------------------------------------------------------------------
                 */
                searchVO = $scope.searchVO = {
                    date : {
                        start : today.y +"-01-01",
                        end   : today.y +"-12-31"
                    }
                };

                /**
                 * @description 회의록 정보를 조회한다.
                 */
                searchVO.doInquiry = function (pageNum) {
                    var self  = this,
                        param = BuMeetingListSvc.makeSearchParam(this);

                    BuMeetingListSvc.getMeetingList(param).then(function (result) {
                        $scope.$emit("search:meetingList", {name: $state.current.name, data: self.date});

                        meetingVO.total   = result.data.length;
                        meetingVO.data    = result.data;
                        meetingVO.doReload( meetingVO.data, pageNum );
                    });
                };

                /**
                 * @description 검색조건을 초기화한다.
                 */
                searchVO.doInit = function () {
                    this.date = {
                        start : today.y +"-01-01",
                        end   : today.y +"-12-31"
                    };
                    meetingVO.doReload( meetingVO.data, 1 );
                    this.doInquiry();
                };



                /**
                 * [ meetingVO ]
                 * --------------------------------------------------------------------------------------------------------------------------------------------
                 * @type {Object} setting datetable을 생성하기위한 setting {element: object, title: array, data: array, columnDefs: array, dblclick: function}
                 * --------------------------------------------------------------------------------------------------------------------------------------------
                 */
                meetingVO = $scope.meetingVO = {
                    total   : 0,
                    data    : [],
                    pageNum : 1
                };

                meetingVO.tbl = {
                    columns: [
                        {title: "글번호", field: "UNIQ_CD", visible: true },
                        {title: "제목", field: "TITLE", visible: true },
                        {title: "작성자", field: "CREATOR_NAME", visible: true },
                        {title: "수정자", field: "UPDATER_NAME", visible: true },
                        {title: "등록일", field: "CREATE_DT", visible: true },
                        {title: "수정일", field: "UPDATE_DT", visible: true }
                    ],
                    tableParams: new ngTableParams({
                        page              : 1,
                        count             : 10,
                        isShowSelectLength: false,
                        sorting           : {
                            "UNIQ_CD" : "desc"
                        }
                    }, {
                        total   : meetingVO.data.length,
                        getData : function($defer, params) {
                            var orderedData = params.sorting() ? $filter("orderBy")(meetingVO.data, params.orderBy()) : meetingVO.data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    })
                };

                /**
                 * @description 테이블 데이터를 갱신하다.
                 * @param {Array} data 조회된 회의록 리스트
                 */
                meetingVO.doReload = function ( data, pageNum ) {
                    this.tbl.tableParams.settings({data: data});
                    this.tbl.tableParams.page( pageNum );
                    this.tbl.tableParams.reload();
                };

                /**
                 * @description 회의록 등록 page로 이동한다.
                 */
                meetingVO.moveInsertPage = function () {
                    $state.go('app.buMeeting', { kind: 'insert', menu: null, ids: null });
                };

                /**
                 * @description 회의록 상세페이지로 이동한다.
                 * @param {Object} meetingInfo 회의록 상세정보
                 */
                meetingVO.moveDetailPage = function ( meetingInfo ) {
                    $scope.$emit("setParam:meetingListPage", {name: $state.current.name, data: meetingVO.tbl.tableParams.$params.page});
                    $state.go('app.buMeeting', { kind: 'detail', menu: null, ids: meetingInfo.UNIQ_CD });
                };




                /** Page Init Load */
                view.initLoad();
            }]);

}());