(function (window) {
    "use strict";

    if (!window.edt) {throw new Error("You must need the edentns library.");}

    var toString = {}.toString;

    var regEmpCD 		= /^[\w+]{3,10}$/,
        regName 		= /^[가-힣a-zA-Z]+[가-힣a-zA-Z\s]+$/,
        regProjectName 	= /^[\[\]가-힣\w()]+[가-힣\w\s\-,\/()]+$/,
        regComment		= /[가-힣\w\s\-,.\[\]<>\/()]+$/,
        regCorpName 	= /^[가-힣a-zA-Z()][가-힣\w\/()-.\s]+$/,
        regDate 		= /^([\d]{4})-([\d]{2})-([\d]{2})$/,
        regZip 			= /^(\d{3})-(\d{3})$/,
        regAddr1 		= /^[가-힣a-zA-Z\(\)\[\]]+[가-힣\w@()\-\s]+$/,
        regAddr2 		= /^[가-힣\w\(\)\[\]]+[가-힣\w@()\-\s]+$/,
        regPhone 		= /(^0\d{1,2})-([1-9]\d{2,3})-(\d{4})$/,
        regEmail 		= /^[\w]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
        regNum			= /^[-,\d]+$/,
        regCorpNum		= /^(\d{3})-(\d{2})-(\d{5})$/,
        regDept			= /^[가-힣a-zA-Z][가-힣\w\s-]+[가-힣\w]$/;

// util
    edt.extend({
        /**
         * key값이 하나로 통일되는 string param을 생성한다.
         * @example
         * edt.makeGetParam(['a', 'b', 'c'], 'test'); => expect: test=a&test=b&test=c
         */
        makeGetParam: function (arr, key) {
            var rtnParam = "";
            for ( var i=0, leng=arr.length; i<leng; i+=1 ) {
                if ( i === (leng-1) )	{
                    rtnParam += key +"="+ arr[i];
                } else {
                    rtnParam += key +"="+ arr[i] +"&";
                }
            }
            return rtnParam;
        },

        /**
         * [{}, {}, ..] 형태를 key=value&key=value&... String으로 변환한다.
         * @param {Array} arr parsing할 Array Data
         * @returns {string}
         */
        makeStringParam: function  ( arr ) {
            var type = toString.call( arr),
                rtnParam = "",
                i, leng, el, obj;

            if (type === "[object Array]") {
                for (i=0, leng=arr.length; i<leng; i+=1) {
                    obj = arr[i];
                    for (el in obj) {
                        if (obj.hasOwnProperty( el ) ) {
                            rtnParam += el +"="+ obj[el] + "&";
                        }
                    }
                }
            } else {
                rtnParam = '';
            }
            rtnParam = rtnParam.substring(0, rtnParam.length-1);

            return rtnParam;
        },

        /**
         * 연도 data를 생성한다.
         * @returns {Array}
         */
        makeYearList: function () {
            var rtnYearList = [],
                i;
            for ( i=2014; i<=2030; i+=1 ) {
                rtnYearList.push( ''+ i );
            }
            return rtnYearList;
        },

        /**
         * Month data를 생성한다.
         * @returns {Array}
         */
        makeMonthList : function () {
            var rtnMonthList = [],
                i;
            for(i=0; i<12; i+=1) {
                rtnMonthList[i] = this.fillSpace(i+1);
            }

            return rtnMonthList;
        },

        /**
         * menu의 file Name을 가져온다.
         * @param {string} kind 종류(list, insert, update, detail)
         */
        getMenuFileName : function (kind) {
            if (kind === "list") { return "List"; }
            else if (kind==="insert" || kind==="detail") {
                return "Info";
            }
        },

        /**
         * 날짜 객체를 String올 변환한다.
         * @param date {Object} 날짜
         * @param char {string|null} 날짜 포멧팅 문자(default '-')
         * @returns {string}
         */
        transDateString : function ( date, char ) {
            char = char || "-";
            return date.y + char + date.m + char + date.d;
        }
    }, edt);

    var valid = edt.extend({
        /**
         * # alert msg를 출력하고, id를 가진 객체를 찾아 focus 이동 시킨다.
         */
        invalidFocus: function (selector, msg) {
            alert(msg);
            edt.id(selector).focus();
            return false;
        },
        /**
         * # 사원번호 유효성을 체크한다. */
        validEmpCD: function (cd) {
            cd = ''+ cd;
            return regEmpCD.test(cd);
        },
        /**
         * # 이름 유효성을 체크한다. */
        validName: function (name) {
            name = ''+ name;
            return regName.test(name);
        },
        /**
         * # 날짜 유효성을 체크한다. */
        validDate: function (date) {
            date = ''+ date;
            return regDate.test(date);
        },
        /**
         * # 우편번호 유효성을 체크한다. */
        validZipcode: function (zip) {
            zip = ''+ zip;
            return regZip.test(zip);
        },
        /**
         * # 기본주소 유효성을 체크한다. */
        validAddr1: function (addr) {
            addr = ''+ addr;
            return regAddr1.test(addr);
        },
        /**
         * # 상세주소 유효성을 체크한다. */
        validAddr2: function (addr) {
            addr = ''+ addr;
            return regAddr2.test(addr);
        },
        /**
         * # 휴대폰 유효성을 체크한다. */
        validPhone: function (phone) {
            phone = ''+ phone;
            return regPhone.test(phone);
        },
        /**
         * # 이메일 유효성을 체크한다. */
        validEmail: function (email) {
            email = ''+ email;
            return regEmail.test(email);
        },
        /**
         * # 숫자만 입력했는지 체크한다. */
        validNumber: function ( number ) {
            //number = Number( number );
            return regNum.test( number );
        },
        /**
         * # 고객사이름 유효성을 체크한다. */
        validCorpName: function ( name ) {
            name = ''+ name;
            return regCorpName.test( name );
        },
        /**
         * # 사업자등록번호 유효성을 체크한다. */
        validCorpRegNum: function ( num ) {
            num = ''+ num;
            return regCorpNum.test( num );
        },
        /**
         * # 부서, 직급 유효성을 체크한다. */
        validDept: function ( dept ) {
            dept = ''+ dept;
            return regDept.test( dept );
        },

        /**
         * # 프로젝트명 유효성을 체크한다. */
        validProjectName: function ( projectName ) {
            projectName = ''+ projectName;
            return regProjectName.test( projectName );
        },

        /**
         * @사업등록, 수정시 comment validation을 체크한다.
         * @param {string} pComment 등록된 comment 내용
         */
        validComment : function ( pComment ) {
            pComment = ""+ pComment;
            return regComment.test( pComment );
        },

        /**
         * 시작날짜와 종료날짜가 유효한지 체크한다.
         * @param {string} startDate 시작날짜
         * @param {string} endDate 종료날짜
         * @returns {boolean} 유효여부
         */
        validPeriodDate: function ( startDate, endDate, char ) {
            var
                startSplit, endSplit, sDate, eDate,
                rtnBoolean = false;

            if ( char ) {
                startSplit 	= startDate.split( char );
                endSplit = endDate.split( char );
                sDate = new Date( startSplit[0], startSplit[1]-1, startSplit[2] );
                eDate = new Date( endSplit[0], endSplit[1]-1, endSplit[2] );
            } else {
                sDate = new Date( startDate.substring(0,4), startDate.substring(4,6)-1, startDate.substring(6,8) );
                eDate = new Date( endDate.substring(0,4), endDate.substring(4,6)-1, endDate.substring(6,8) );
            }

            if ( (eDate-sDate) >= 0 ) {
                rtnBoolean = true;
            } else {
                rtnBoolean = false;
            }

            return rtnBoolean;
        },

        /**
         * 사업유형 파일 등록시 파일타입 유효성을 체크한다.
         * @param {object} item 등록할려는 파일 정보
         * @returns {boolean}
         */
        isUploadFileType: function (item) {
            var rtnBoolean      = true,
                validTypeList   = ["exe"],
                type            = item.name.substring(item.name.lastIndexOf(".")+1);

            angular.forEach(validTypeList, function (validType) {
                if (validType === type) {
                    rtnBoolean = false;
                }
            });
            return rtnBoolean;
        },
    }, edt);


    // 메인 관련 함수
    var mainApp = edt.mainApp = {};
    /**
     * @name main navigation
     * @description
     * # function of mainNavigation
     */
    mainApp = {
        mainNavFnc: function () {
            $('#main-menu').metisMenu();
        },
        toggleSidebar: function () {
            $('div#main').toggleClass('sidebar-hide');
        },
        //  Function maked all .box selector is draggable, to disable for concrete element add class .no-drop
        winMove: function () {
            $('div.box').not('.no-drop')
                .draggable({
                    revert: true,
                    zIndex: 2000,
                    cursor: 'crosshair',
                    handle: '.box-name',
                    opacity: 0.8
                })
                .droppable({
                    tolerance: 'pointer',
                    drop: function( event, ui ) {
                        var draggable = ui.draggable;
                        var droppable = $(this);
                        var dragPos = draggable.position();
                        var dropPos = droppable.position();
                        draggable.swap(droppable);
                        setTimeout(function() {
                            var dropmap = droppable.find('[id^=map-]');
                            var dragmap = draggable.find('[id^=map-]');
                            if (dragmap.length > 0 || dropmap.length > 0){
                                dragmap.resize();
                                dropmap.resize();
                            }
                            else {
                                draggable.resize();
                                droppable.resize();
                            }
                        }, 50);
                        setTimeout(function() {
                            draggable.find('[id^=map-]').resize();
                            droppable.find('[id^=map-]').resize();
                        }, 250);
                    }
                });
        }
    };

    $(document).ready(function () {
        mainApp.mainNavFnc();
    });
}(window));