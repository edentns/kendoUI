(function () {
    "use strict";

    // [BU] 월별회의록
    var meetingApp = angular.module("BU.meeting", ["BU.meeting.controller", "BU.meeting.service"]);
    angular.module("BU.meeting.controller", []);
    angular.module("BU.meeting.service", []);

    meetingApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.buMeeting", {
            url   : "/meeting/:kind?menu&ids",
            views : {
                contentView: {
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/BU/meeting/templates/bu.meeting"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "BU.meeting"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve     : {
                        resData: ["AuthSvc", "BU.meetingInfoSvc", "$stateParams", "$q", function (AuthSvc, BuMeetingInfoSvc, $stateParams, $q) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];

                                var ids  = $stateParams.ids;
                                if (edt.isValid(ids)) {
                                    BuMeetingInfoSvc.getMeetingInfo(ids).then(function (result) {
                                        resData.meeting = result.data[0];
                                        defer.resolve(resData);
                                    });
                                } else {
                                    defer.resolve(resData);
                                }
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());