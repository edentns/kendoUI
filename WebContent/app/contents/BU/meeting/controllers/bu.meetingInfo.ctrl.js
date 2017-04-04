(function () {
    "use strict";

    /**
     * @name BU.meeting.controller : BU.meetingInfoCtrl
     * 월별회의록
     */
    angular.module("BU.meeting.controller")
        .controller("BU.meetingInfoCtrl", ["$scope", "BU.meetingInfoSvc", "$state", "$stateParams", "FileUploader", "APP_CONFIG", "MenuSvc", "resData", "Page",
            function ($scope, BuMeetingInfoSvc, $state, $stateParams, FileUploader, APP_CONFIG, MenuSvc, resData, Page) {
	            var page    = $scope.page = new Page({ auth: resData.access }),
		            meetingInfo = resData.meeting,
		            menuId = MenuSvc.getMenuId($state.current.name),
		            today   = edt.getToday(),
		            view, meetingVO, fileVO;

                /**
                 * -------------------------------------------------------------------------------------------------
                 * @description Page를 관리한다.
                 * @type {String} kind page의 종류(insert, update, detail)
                 * @type {String} ids 회의록의 uniq id
                 * @type {String} title page의 종류의 한글명
                 * @type {Object} editorSetting editor 설정
                 * -------------------------------------------------------------------------------------------------
                 */
                view = $scope.view = {
                    kind 	   : "",
                    ids		   : "",
                    title	   : ""
                };

                view.editorSetting = {
                    selector    : "#meetingContents",
                    theme       : "modern",
                    skin        : "lightgray",
                    language    : "ko_KR",
                    forced_root_block : "",
                    plugins     : [
                        "lists print preview hr anchor pagebreak spellchecker",
                        "code",
                        "table directionality emoticons paste textcolor"
                    ],
                    toolbar     : "styleselect fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | print preview | forecolor backcolor emoticons"
                };

                /**
                 * @description Page 초기로드시 실행된다.
                 */
                view.initLoad = function () {
                    this.kind = $stateParams.kind;
                    this.ids = $stateParams.ids || "";
                    this.title = ($stateParams.kind === "insert") ? "등록" : "수정";
                    tinymce.editors = [];
                    tinymce.baseURL = "assets/lib/tinymce";

                    fileVO.initLoad();

                    if (this.kind!=="insert" && meetingInfo) {
                        view.editorSetting["init_instance_callback"] = function (editor) {
                            editor.setContent(meetingInfo.CONTENT);
                        };

                        tinymce.init(view.editorSetting);
                        this.setViewInfo(meetingInfo);

                    } else {
                        tinymce.init(view.editorSetting );
                    }
                };

                /**
                 * @description 수정 또는 상세일 경우 page에 가져온 정보를 보여준다.
                 */
                view.setViewInfo = function ( meetingInfo ) {
                    meetingVO.meetingDate  = meetingInfo.MEETING_DT;
                    meetingVO.meetingTitle = meetingInfo.TITLE;
                    fileVO.currentFileList = meetingInfo.meetingFileList;
                };



                /**
                 * [ meetingVO ]
                 * ---------------------------------------------------------------------------------------------------------------------------------------------
                 * @description 회의정보를 관리한다.
                 * @type {String} meetingDate 회의일시
                 * @type {String} meetingTitle 회의주제
                 * @type {String} meetingContents 회의내용
                 * ---------------------------------------------------------------------------------------------------------------------------------------------
                 */
                meetingVO = $scope.meetingVO = {
                    meetingDate       : "",
                    meetingTitle      : "",
                    meetingContentsId : "meetingContents"
                };

                /**
                 * @description 회의정보를 등록한다.
                 */
                meetingVO.doInsert = function () {

                    var insertMessage = "회의록을 등록하시겠습니까?",
                        param         = BuMeetingInfoSvc.makeGetParam( this );

                    if (confirm(insertMessage)){
                        if (!BuMeetingInfoSvc.isValid(param)) {
                            return;
                        }

                        BuMeetingInfoSvc.insert( param).then(function ( result ) {
                            if (result.status !== 200) {
                                alert( result.data );
                                return;
                            }

                            if (fileVO.uploader.queue.length>0) {
                                fileVO.doUpload(result.data);
                            } else {
                                alert( "회의록 등록이 완료되었습니다." );
                                $state.go('app.buMeeting', { kind: 'list', menu: true, ids: null });
                            }
                        });
                    }
                };

                /**
                 * @description 회의정보를 수정한다.
                 */
                meetingVO.doUpdate = function () {
                    var updateMessage = "회의록을 수정하시겠습니까?",
                        param         = BuMeetingInfoSvc.makeGetParam( this );

                    param.UNIQ_CD = view.ids;

                    if (confirm(updateMessage)){
                        if (!BuMeetingInfoSvc.isValid(param)) {
                            return;
                        }

                        BuMeetingInfoSvc.update(param).then(function () {
                            if (fileVO.uploader.queue.length>0 || fileVO.deleteFileList.length>0) {
                                fileVO.doUpload();
                            } else {
                                alert("회의록이 수정되었습니다.");
                                $state.go('app.buMeeting', { kind: 'list', menu: true, ids: null });
                            }
                        });
                    }
                };

                /**
                 * @description 회의정보를 등록 또는 수정을 취소하고 리스트 페이지로 이동한다.
                 */
                meetingVO.doCancel = function () {
                    $state.go('app.buMeeting', { kind: 'list', menu: true, ids: null });
                };



                /**
                 * [ fileVO ]
                 * ---------------------------------------------------------------------------------------------------------------------------------------------
                 * @description 회의록 파일정보를 관리한다.
                 * @type {String} url 파일 upload할 url
                 * @type {Boolean} status
                 * @type {Object} uploader
                 * @type {Array} currentFileList 현재 upload되어있는 fileList
                 * @type {Array} deleteFileList 삭제된 fileList
                 * ---------------------------------------------------------------------------------------------------------------------------------------------
                 */
                fileVO = $scope.fileVO = {
                    url          : APP_CONFIG.domain +"/analyze/meeting/file",
                    status       : true,
                    uploader     : new FileUploader({
                        headers  : {
                            menuId : menuId
                        },
                        url: APP_CONFIG.domain +"/analyze/meeting/file"
                    }),
                    currentFileList : [],
                    deleteFileList  : []
                };

                /**
                 * @description 초기로드시 실행된다.
                 */
                fileVO.initLoad = function () {
                    this.uploader.filters.push({
                        name: "customFilter",
                        fn: function(item) {
                            var
                                rtnBoolean  = false,
                                totalLeng   = this.queue.length + fileVO.currentFileList.length - fileVO.deleteFileList.length;

                            if (edt.isUploadFileType(item) && totalLeng < 5) {
                                rtnBoolean = true;
                            }
                            return rtnBoolean;
                        }
                    });
                };

                /**
                 * @description 등록된 파일을 remove할경우 deleteFileList에 삭제할 정보를 push한다.
                 * @param {Object} idx
                 */
                fileVO.addDeleteFileList = function ( idx ) {
                    var fileInfo = this.currentFileList[idx];
                    this.currentFileList.splice( idx, 1 );
                    this.deleteFileList.push( fileInfo );
                };

                /**
                 * @description 파일을 업로드하기 위한 필요정보 세팅한다.
                 * @param {Array} queue uploader에 저장된 queue
                 */
                fileVO.setUploadInfo = function ( queue ) {
                    angular.forEach( queue, function ( file ) {
                        file.formData.push({
                            order: view.ids
                        });
                    });
                };

                /**
                 * @description 파일을 upload한다.
                 * @param {String} meetingCD 회의록CD
                 */
                fileVO.doUpload = function ( meetingCD ) {
                    meetingCD = meetingCD || view.ids;

                    if ( fileVO.deleteFileList.length > 0 ){
                        // 파일삭제
                        var deleteParamList = [
                            { "meeting_cd": meetingCD }
                        ];
                        angular.forEach( fileVO.deleteFileList, function ( delInfo ) {
                            deleteParamList.push( { "file_cd" : delInfo.UNIQ_CD } );
                        });

                        BuMeetingInfoSvc.deleteFile( deleteParamList ).then(function ( result ) {
                            if ( fileVO.uploader.queue.length > 0 ) {
                                angular.forEach( fileVO.uploader.queue, function ( file ) {
                                    file.formData.push({
                                        "meeting_cd" : meetingCD
                                    });
                                });
                                fileVO.uploader.uploadAll();

                            } else {
                                alert( "회의록이 수정되었습니다." );
                                $state.go('app.buMeeting', { kind: 'list', menu: true, ids: null });
                            }
                        }, function ( result ) {
                            alert( result.data );
                            $state.go('app.buMeeting', { kind: 'detail', menu: null, ids: meetingCD });
                        });

                    } else {
                        // 파일 등록
                        angular.forEach( fileVO.uploader.queue, function ( file ) {
                            file.formData.push({
                                "meeting_cd" : meetingCD
                            });
                        });
                        fileVO.uploader.uploadAll();
                    }
                };

                /**
                 * @descriptioin fileupload 실패시 발생한다.
                 */
                fileVO.uploader.onWhenAddingFileFailed = function () {
                    var message = "";
                    message += "\"xls, xlsx, doc, docx, pdf, ppt, pptx, hwp, png, jpeg, jpg, jpe, gif\" 파일만 업로드 가능하며, ";
                    message += "등록된 Files + 추가된 Files <= 5 까지 업로드 가능합니다.";
                    alert( message );
                };

                /**
                 * @description loading bar를 on한다.
                 */
                fileVO.uploader.onBeforeUploadItem = function () {
                    $scope.$emit( "event:loading", true );
                };

                /**
                 * @description loading bar를 off한다.
                 */
                fileVO.uploader.onCompleteAll = function() {
                    $scope.$emit( "event:loading", false );
                    if ( fileVO.status ) {
                        if ( view.kind === "insert" ) {
                            alert( "회의록이 등록되었습니다." );
                        } else {
                            alert( "회의록이 수정되었습니다." );
                        }
                        $state.go('app.buMeeting', { kind: 'list', menu: true, ids: null });

                    } else {
                        alert( "파일 등록에 실패하였습니다. 다시 시도해주세요." );
                        if ( view.kind === "insert" ) {
                            $state.go('app.buMeeting', { kind: 'detail', menu: null, ids: view.ids });
                        } else {
                            $state.reload();
                        }
                    }
                };

                fileVO.uploader.onErrorItem = function () {
                    fileVO.status = false;
                };


                /** Page Init Load */
                view.initLoad();
            }]);

}());