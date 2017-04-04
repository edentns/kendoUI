(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name SY.depart.controller : SY.departCtrl
     * 부서관리
     */
    angular.module("SY.depart.controller")
        .controller("SY.departCtrl", ["$scope", "$q", "SY.codeSvc", "SY.departSvc", "APP_CODE", "resData", "Page",
            function ($scope, $q, SyCodeSvc, SyDepartSvc, APP_CODE, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();


                /**
                 * 부서관리
                 * @type {{}}
                 */
                var departMngVO = $scope.departMngVO = {
                    boxTitle     : "조직도",
                    deptCodeList : resData.deptCodeList,
                    workCodeList : resData.workCodeList,
                    data         : resData.deptList
                };

                /**
                 * 초기화한다.
                 */
                departMngVO.init = function () {
                    departMngVO.inquiry();
                };

                /**
                 * 부서를 조회한다.
                 */
                departMngVO.inquiry = function () {
                    var self = this;

                    $q.all([
                        SyDepartSvc.getDepart({ search: "all" }),
                        SyDepartSvc.getDepart({ search: "all" })
                    ]).then(function (result) {
                        self.deptCodeList = result[0].data;
                        self.data         = result[1].data;
                    });
                };

                /**
                 * 추가, 수정, 삭제를 위한 parameter를 생성한다.
                 * @param oParam
                 * @returns {{STATE: *, CD: (*|$scope.employeeVO.param.CD|param.CD|resInfo.deptCodeList.CD|.deptCodeList.CD|null), NAME: (*|$scope.employeeVO.param.NAME|param.NAME|resInfo.deptCodeList.NAME|.deptCodeList.NAME|$scope.orderVO.ownerInfo.NAME), MGR_CD: (*|$scope.employeeVO.param.MGR_CD|param.MGR_CD), WORK_GROUP: (*|$scope.employeeVO.param.WORK_GROUP|param.WORK_GROUP), YN_TOPDEPT: (*|string|createdItem.YN_TOPDEPT)}}
                 */
                departMngVO.makeParam = function (deptInfo) {
                    var rtnParam = {
                        STATE      : deptInfo._state,
                        NAME       : deptInfo.NAME,
                        MGR_CD     : Number(deptInfo.MGR_CD),
                        WORK_GROUP : Number(deptInfo.WORK_GROUP),
                        YN_TOPDEPT : deptInfo.YN_TOPDEPT
                    };

                    if (!angular.isUndefined(deptInfo.CD)) {
                        rtnParam.CD = deptInfo.CD;
                    }

                    return [rtnParam];
                };

                /**
                 * 유효성을 체크한다.
                 * @param {array.<{STATE:string, NAME:string, MGR_CD:number, WORK_GROUP:string, YN_TOPDEPT:string}>} deptInfo
                 * @returns {{state: boolean, msg: string}}
                 */
                departMngVO.isValid = function (deptInfo) {
                    var i, lng, o,
	                    deptNmReg = /^[가-힣\w\s_(),&@'#\-:;/*{}[\]<>]{1,32}$/,
	                    numCdReg = /^[\d]+$/,
	                    topDeptEnum = ["YES", "NO"];

                    for (i=0, lng=deptInfo.length; i<lng; i+=1) {
                        o = deptInfo[i];

                        if (!o.NAME) {
	                        return { state: false, msg: "[필수] 부서명은 필수 입력값입니다." };
                        } else {
	                        if (!deptNmReg.test(o.NAME)) {
		                        return { state: false, msg: "[형식] 부서명은 유효하지 않은 형식입니다." };
	                        }
                        }

                        if (o.STATE !== "D") {
                            if (!o.MGR_CD) {
	                            return { state: false, msg: "[필수] 상위부서는 필수 입력값입니다." };
                            } else {
	                            if (!numCdReg.test(o.MGR_CD)) { return { state: false, msg: "[형식] 상위부서는 유효하지 않은 형식입니다." }; }
                            }
                        }

	                    if (!o.WORK_GROUP) {
		                    return { state: false, msg: "[필수] 직군은 필수 입력값입니다." };
	                    } else {
		                    if (!numCdReg.test(o.WORK_GROUP)) { return { state: false, msg: "[형식] 직군은 유효하지 않은 형식입니다." }; }
	                    }

	                    if (topDeptEnum.indexOf(o.YN_TOPDEPT) === -1) {
		                    if (!numCdReg.test(o.WORK_GROUP)) { return { state: false, msg: "[형식] 상위부서는 여부는  [YES, NO]만 가능합니다." }; }
	                    }
                    }

                    return { state: true, msg: "체크완료" };
                };

                /**
                 * 데이터를 추가, 수정, 삭제를 처리한다.
                 * @param deptInfo
                 */
                departMngVO.saveProcess = function (deptInfo) {
                    var self = this,
                        param = self.makeParam(deptInfo),
                        resValid = departMngVO.isValid(param),
                        defer = $q.defer();

                    if (!resValid.state) {
                        alert(resValid.msg);
                        defer.reject();
                    } else {
                        SyDepartSvc.save(param).then(function () {
                            alert("데이터가 저장되었습니다.");
                            defer.resolve();
                            self.inquiry();
                        });
                    }

                    return defer.promise;
                };

                /**
                 * 부서를 추가한다.
                 */
                departMngVO.add = function () {
                    var self    = this,
                        editing = false;

                    angular.forEach(self.data, function (deptInfo) {
                        if (deptInfo._edit) {
                            editing = true;
                        }
                    });

                    if ( editing ) {
                        alert("현재 작성중입니다.");
                        return;
                    }

                    self.data.unshift({
                        _edit       : true,
                        _state      : "I",
                        NAME        : "",
                        MGR_CD      : 0,
                        WORK_GROUP  : "1",
                        YN_TOPDEPT  : "NO"
                    });
                };

                /**
                 * 선택된 데이터를 삭제헌다.
                 */
                departMngVO.delete = function (deptInfo, idx) {
                    if (!deptInfo.CD || deptInfo.CD==="") {
                        departMngVO.data.splice(idx, 1);

                    } else {
                        if (confirm("삭제시 하위부서가 모두 삭제되며 복구가 불가능합니다.")) {
                            if (confirm("삭제하시겠습니까?")) {
                                deptInfo._state = "D";
                                departMngVO.saveProcess(deptInfo);
                            }
                        }
                    }

                };

                /**
                 * 데이터를 수정할 수 있는 상태로 전환한다.
                 */
                departMngVO.update = function (deptInfo) {
                    var self = this,
                        editing = false;

                    angular.forEach(self.data, function (deptInfo) {
                        if (deptInfo._edit) {
                            editing = true;
                        }
                    });

                    if ( editing ) {
                        alert("현재 작성중입니다.");
                        return;
                    }

                    if ( deptInfo._preEntity ) {
                        delete deptInfo._preEntity;
                    }

                    if (deptInfo._state !== "I") {
                        deptInfo._state = "U";
                    }

                    deptInfo._preEntity = angular.copy(deptInfo, {});
                    deptInfo._edit = true;
                };

                /**
                 * 데이터를 저장한다.
                 */
                departMngVO.save = function (deptInfo) {
                    departMngVO.saveProcess(deptInfo).then(function () {
                        delete deptInfo._preEntity;
                        deptInfo._edit = false;
                    });
                };

                /**
                 * 변경된 정보를 취소한다.
                 */
                departMngVO.cancel = function (deptInfo, idx) {
	                if (deptInfo.CD) {
		                deptInfo = angular.copy(deptInfo._preEntity, deptInfo);
		                deptInfo._edit = false;
	                } else {
		                departMngVO.delete(deptInfo, idx);
	                }
                };

            }
        ]);
}());