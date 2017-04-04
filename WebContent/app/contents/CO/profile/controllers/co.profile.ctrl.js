(function () {
    "use strict";

    /**
     * 프로파일 - 비밀번호변경
     * @name CO.profile.controller : CO.profileCtrl
     */
    angular.module("CO.profile.controller")
        .controller("CO.profileCtrl", ["$rootScope", "$scope", "CO.profileSvc", "SY.LoginSvc",
            function ($rootScope, $scope, CoProfileSvc, SyLoginSvc) {

                var profileVO;

                /**
                 *===============================================================
                 * @description 개인정보를 관리한다.
                 *===============================================================
                 */
                profileVO = $scope.profileVO = {
                    param: {
                        currentPw: "",				// 현재비밀번호
                        newPw: "",				// 새비밀번호
                        newPwChk: "",				// 새비밀번호확인
                        isEquals: false,		// 새비밀번호와 새비밀번호확인 일치여부
                        message: "비밀번호를 입력해주세요."
                    }
                };

                /**
                 * @description 비밀번호 입력을 받을 때마다 메세지를 변경한다.
                 */
                profileVO.changeMessage = function () {
                    CoProfileSvc.changeMessage(profileVO);
                };

                /**
                 * @description 패스워드를 변경한다.
                 */
                profileVO.doUpdatePw = function () {
                    var
                        param = CoProfileSvc.makePwParam(profileVO),
                        msg = "비밀번호를 변경하시겠습니까?";

                    if (!profileVO.param.isEquals) {
                        alert("비밀번호를 확인해주세요.");
                        return;
                    }

                    if (confirm(msg)) {
                        CoProfileSvc.updatePassword(param).then(function () {
                            alert("패스워드가 변경되었습니다. 다시 로그인해주세요.");
                            SyLoginSvc.logout().then(function () {
                                $scope.$emit("event:logout");
                            });
                        });
                    }

                };

                /**
                 * @description 패스워드 변경을 취소하고 이전 페이지로 이동한다.
                 */
                profileVO.doCancle = function () {
                    var message = "비밀번호 변경을 취소하시겠습니까?";
                    if (confirm(message)) {
                        history.back(-1);
                    }
                };

                /**
                 * 유저정보를 가져온다.
                 */
                profileVO.getUserInfo = function () {

                };

            }]);
}());