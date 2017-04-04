(function () {
    "use strict";

    /**
     * @name BU.meeting.service : BU.meetingInfoSvc
     */
    angular.module("BU.meeting.service")
        .factory("BU.meetingInfoSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {

            // [CRUD]

                /**
                 * @description 회의록 상세정보를 가져온다.
                 * @param {String} param 회의록 uniq cd
                 */
                getMeetingInfo : function (param) {
                    return $http({
                        method: "GET",
                        url   : APP_CONFIG.domain +"/analyze/meeting/"+ param
                    });
                },

                /**
                 * @description 회의록을 등록한다.
                 * @param {Object} param 등록할 데이터 { CONTENT: string, TITLE: string, MEETING_DT: string }
                 */
                insert: function ( param ) {
                    return $http({
                        method: "POST",
                        url   : APP_CONFIG.domain +"/analyze/meeting",
                        data  : param
                    });
                },

                /**
                 * @description 회의록을 등록한다.
                 * @param {Object} param 등록할 데이터 { CONTENT: string, TITLE: string, MEETING_DT: string }
                 */
                update: function ( param ) {
                    return $http({
                        method: "PUT",
                        url   : APP_CONFIG.domain +"/analyze/meeting",
                        data  : param
                    });
                },

                /**
                 * @description 등록된 회의록 파일을 삭제한다.
                 * @param {Array} deleteFileList 삭제할 파일 리스트
                 */
                deleteFile: function ( deleteFileList ) {
                    return $http({
                        url    : APP_CONFIG.domain +"/analyze/meeting/file?"+ edt.makeStringParam(deleteFileList),
                        method : "DELETE"
                    });
                },


            // [LOGIC]

                /**
                 * @description 등록 또는 수정 parameter를 생성한다.
                 * @param {Object} meetingVO 회의록VO
                 */
                makeGetParam : function (meetingVO) {
                    var editor = tinyMCE.EditorManager.get(meetingVO.meetingContentsId);
                    var meetingContent = editor.getContent();
                    return {
                        MEETING_DT  : meetingVO.meetingDate,
                        TITLE       : meetingVO.meetingTitle,
                        CONTENT     : meetingContent
                    };
                },

                isValid : function (param) {
                    if (param.MEETING_DT === "") {
                        return edt.invalidFocus("meetingDate", "회의일시를 입력해주세요.");
                    }

                    if (param.TITLE === "") {
                        return edt.invalidFocus("meetingTitle", "회의주제를 입력해주세요.");
                    }

                    if(param.CONTENT.trim() === "") {
                        return edt.invalidFocus("meetingContents", "회의내용을 입력해주세요.");
                    }

                    return true;
                }
            };
        }]);

}());