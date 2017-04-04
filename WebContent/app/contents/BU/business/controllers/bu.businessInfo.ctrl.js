(function () {
    "use strict";

    /**
     * @name BU.business.controller : business.BusinessInfoCtrl
     * 사업관리 - 등록, 수정, 상세
     */
    angular.module("BU.business.controller")
        .factory("businessInfo.model", ["$modal", function ($modal) {
            var
                /**
                 * -------------------------------------------------------------------------------------------------------------------------
                 * [ Product ]
                 * @description Product 모든 Part를 관리한다.
                 * @constructor
                 * @type {Array} productList part list
                 * @type {Function} init 초기화
                 * @type {Function} createPart 하나의 part를 생성한다.
                 * @type {Function} removePart 선택된 part를 제거한다.SUB_EMP_DEPT_NAME : "";
                 * ------------------------------------------------------------------------------------------------------------------------*/
                Product = function () {
                    this.productList = [];
                    this.deleteList = [];
                };

            Product.fn = Product.prototype;

            /**
             * @description 하나의 part를 생성한다.
             * @param {Object} info parameter 정보를 가진 part를 생성한다. 해당 정보가 없을 경우 default 값으로 생성한다.
             */
            Product.fn.createPart = function ( info ) {
                info = info || { flag: "I" };
                var part = new Part(info);
                this.productList.push( part );
            };

            /**
             * @description 선택된 part를 제거한다.
             */
            Product.fn.removePart = function () {
                var
                    self = this,
                    restList = [];

                angular.forEach( self.productList, function ( data ) {
                    if ( data.checked ) {
                        self.deleteList.push( data );
                    } else {
                        restList.push( data );
                    }
                });

                self.productList = restList;
            };


            var
                /**
                 * -------------------------------------------------------------------------------------------------------------------------
                 * [ Part ]
                 * @description Part 각 part를 관리한다.
                 * @constructor
                 * @type {Number} ORDER_CD 사업의 unique key
                 * @type {Object} memory 변경전 part정보
                 * @type {Boolean} checked checkbox 체크 여부
                 * @type {Boolean} disabled 제품유형을 선택했으면 false, 하지 않았으면 true
                 * @type {String} flag 생성, 수정, 삭제 Flag(I: insert, U: update, D: delete)
                 * @type {Number} UNIQ_CD part의 unique key
                 * @type {Number} PRODUCT_TYPE_CD 제품유형코드
                 * @type {String} PRODUCT_TYPE_NAME 제품유형이름
                 * @type {String} SALES 매출금액
                 * @type {String} BUY 매입금액
                 * @type {Number} CUST_CD 매입처코드
                 * @type {String} CUST_NAME 매입처이름
                 * ------------------------------------------------------------------------------------------------------------------------*/
                Part = function(partInfo) {
                    var self = this;
                    self.ORDER_CD	= "";
                    self.flag 		= "I";
                    self.memory 	= {};
                    self.checked	= false;
                    self.disabled	= true;
                    self.UNIQ_CD	= "";
                    self.PRODUCT_TYPE_CD   = 0;
                    self.PRODUCT_TYPE_NAME = "";
                    self.SALES     = "";
                    self.BUY       = "";
                    self.CUST_CD   = "";
                    self.CUST_NAME = "";
                    self.CD_VED_C  = 0;
                    self.NM_VED_C  = "";

                    angular.extend(self, partInfo);
                };

            Part.fn = Part.prototype;

            // 제품상태를 이전으로 되돌린다.
            Part.fn.backPreviousState = function () {
                var self = this;
                angular.forEach( self.memory, function ( data, dataKey ) {
                    self[dataKey] = data;
                });
            };

            // 이전제품상태를 저장한다.
            Part.fn.setPreviousState = function () {
                var self = this;
                angular.forEach(self, function (data, dataKey) {
                    if (self.hasOwnProperty(dataKey) ) {
                        self.memory[dataKey] = data;
                    }
                });
            };

            /**
             * @description 매입처를 검색한다.
             */
            Part.fn.searchPurchaseCompany = function () {
                var
                    self = this,
                    modalInstance = $modal.open({
                        templateUrl : "app/shared/modal/searchCompany/modal.searchCompany.tpl.html",
                        controller  : "modal.searchCompanyCtrl",
                        size        : "lg"
                    });

                modalInstance.result.then(function ( result ) {
                    self.CUST_CD 		= result.code;
                    self.CUST_NAME 	= result.name;
                });
            };


            var
                /**
                 * -------------------------------------------------------------------------------------------------------------------------
                 * [ Sales ]
                 * @description 매출일정을 관리한다.
                 * @constructor
                 * ------------------------------------------------------------------------------------------------------------------------*/
                Sales = function () {
                    this.scheduleList = [];
                    this.deleteList   = [];
                };

            Sales.fn = Sales.prototype;

            /**
             * @description 매출일정 Row를 추가한다.
             * @param {Object} info parameter 정보를 가진 schedule를 생성한다. 해당 정보가 없을 경우 default 값으로 생성한다.
             */
            Sales.fn.createSchedule = function ( info ) {
                info = info || { flag: "I" };
                var schedule = new SalesSchedule( info );
                this.scheduleList.push( schedule );
            };

            /**
             * @description 매출일정 Row를 삭제한다.
             */
            Sales.fn.removeSchedule = function () {
                var
                    self = this,
                    restList = [];

                angular.forEach( self.scheduleList, function ( data ) {
                    if ( data.checked ) {
                        self.deleteList.push( data );
                    } else {
                        restList.push( data );
                    }
                });

                self.scheduleList = restList;
            };

            /**
             * @description 매출일정 Row를 전체삭제한다.
             */
            Sales.fn.removeAllSchedule = function () {
                var self = this;

                angular.forEach( self.scheduleList, function ( data ) {
                    self.deleteList.push( data );
                });

                self.scheduleList = [];
            };


            var SalesSchedule = function( partInfo ) {
                var self = this;

                self.ORDER_CD			 = "";      // 사업의 unique key
                self.memory 			 = {};      // 변경전 part정보
                self.checked			 = false;   // checkbox 체크 여부
                self.disabled			 = true;    // 제품유형을 선택했으면 false, 하지 않았으면 true
                self.flag 				 = "I";     // 생성, 수정, 삭제 Flag(I: insert, U: update, D: delete)
                self.UNIQ_CD			 = "";      // part의 unique key
                self.salesYear 			 = "";      // 매출년
                self.salesMonth 		 = "";      // 매출월
                self.SALES 				 = "";      // 매출금액
                self.BUY 				 = "";      // 매입금액
                self.CUST_CD 			 = "";      // 매입처코드
                self.CUST_NAME			 = "";      // 매입처이름
                self.collectYear		 = "";      // 수금년
                self.collectMonth		 = "";      // 수금월
                self.COLLECT_STATUS		 = 1;       // 수금상태
                self.COLLECT_STATUS_NAME = "";      // 수금상태이름
                self.CD_SMR_BIL          = 'NO';    // 계산서 발행여부
                self.collectModified	 = true;    // 수금상태수정 가능여부

                var list = ["ORDER_CD"    , "flag"          , "UNIQ_CD"            , "salesYear" , "salesMonth" , 
                            "SALES"       , "BUY"           , "CUST_CD"            , "CUST_NAME" , "collectYear", 
                            "collectMonth", "COLLECT_STATUS", "COLLECT_STATUS_NAME", "CD_SMR_BIL", "collectModified" ];

                angular.forEach( list, function ( key ) {
                    angular.forEach( partInfo, function ( data, dataKey ) {
                        if ( dataKey === key ) {
                            self[key] = data;
                        }
                    });
                });
            };

            SalesSchedule.fn = SalesSchedule.prototype;

            /**
             * @description 매입처를 검색한다.
             */
            SalesSchedule.fn.searchPurchaseCompany = function () {
                var
                    self = this,
                    modalInstance = $modal.open({
                        templateUrl : "app/shared/modal/searchCompany/modal.searchCompany.tpl.html",
                        controller  : "modal.searchCompanyCtrl",
                        size        : "lg"
                    });

                modalInstance.result.then(function ( result ) {
                    self.CUST_CD 		= result.code;
                    self.CUST_NAME 	= result.name;
                });
            };

            return {
                Product: Product,
                Part   : Part,
                Sales  : Sales,
                SalesSchedule: SalesSchedule
            };
        }])

        .controller("BU.businessInfoCtrl", ["$stateParams", "$scope", "$modal", "APP_MSG", "APP_CODE", "SY.codeSvc", "BU.businessInfoSvc", "$q", "resData", "FileUploader", "APP_CONFIG", "$state", "businessInfo.model", "MenuSvc", "FieldVO", "Page",
            function ($stateParams, $scope, $modal, APP_MSG, APP_CODE, SyCodeSvc, BuBusinessInfoSvc, $q, resData, FileUploader, APP_CONFIG, $state, model, MenuSvc, FieldVO, Page) {
	            var page        = $scope.page = new Page({ auth: resData.access }),
		            menuId      = MenuSvc.getMenuId($state.current.name),
		            buInfo      = resData.buInfo,
		            buStatus    = resData.buStatus,
		            today       = edt.getToday();

                var view, orderVO, salesVO, fileVO, orderCommentVO, historyVO;

                /**
                 * [view]
                 */
                view = $scope.view = {
                    kind  : "",
                    ids	  : "",
                    title : "",
                    disabled : {
                        order : buStatus===3 || buStatus===4 || buStatus===8,
                        sales : buStatus===4 || buStatus === 8,
                        file  : buStatus===4 || buStatus === 8,
                        subOk : false
                    },

                    bUseSmrBill : page.isWriteableAll(),   // 계산서발행 수정 가능여부

                    /**
                     * @description 공통으로 사용되는 코드정보
                     * @type {Array} businessCodeList 사업유형코드 리스트
                     * @type {Array} productCodeList 제품코드 리스트
                     * @type {Array} stateCodeList 진행상태코드 리스트
                     * @type {Array} collectCodeList 수금상태코드 리스트
                     * @type {Function} getSubcodeList 공통으로 사용되는 코드정보를 가져온다.
                     */
                    code: {
                        businessCodeList: [],
                        productCodeList	: [],
                        stateCodeList	: [],
                        collectCodeList	: [],
                        vendorCodeList  : [],
                        distibutionCodeList : [], // 매출/마진 분배
                        totdistCodeList     : []  // 분배종류
                    }
                };

                /**
                 * @description 공통으로 사용되는 코드정보를 가져온다.
                 */
                view.code.getSubcodeList = function () {
                    var self = this,
                        defer = $q.defer();

                    $q.all([
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.business.cd}),		// 사업코드
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.product.cd}),		// 제품코드
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.orderStatus.cd}), 	// 진행상태코드
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.collect.cd}),		// 수금상태코드
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.vendor.cd}),			// 벤더사코드
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.distibution.cd}),	// 매출/마진분배
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.totdist.cd})			// 분배종류
                    ]).then(function ( result ) {
                        self.businessCodeList = result[0].data;
                        self.productCodeList  = result[1].data;
                        self.stateCodeList    = result[2].data;
                        self.collectCodeList  = result[3].data;
                        self.vendorCodeList   = result[4].data;

                        self.productCodeList.unshift({ CD: 0, NAME: "제품선택" });
                        self.vendorCodeList.unshift({CD: 0, NAME: "벤더사 선택"});
                        self.collectCodeList.unshift({CD: 0, NAME: "수금상태 선택"});

                        self.distibutionCodeList = result[5].data;
                        self.totdistCodeList     = result[6].data;

                        defer.resolve();
                    });

                    return defer.promise;
                };

                /**
                 * @description 사업등록화면 초기로드시 실행된다.
                 */
                view.initLoad = function () {
                    var self = this;

                    self.kind 	= $stateParams.kind;
                    self.ids 	= $stateParams.ids || "";

                    fileVO.initLoad();

                    self.code.getSubcodeList().then(function () {
                        if (self.kind === "insert") {
                            orderVO.ownerInfo.DEPT_NAME = page.user.deptName;
                            orderVO.ownerInfo.POS_NAME 	= page.user.posName;
                            orderVO.ownerInfo.EMP_CD 	= page.user.id;
                            orderVO.ownerInfo.NAME 		= page.user.name;

                            if (self.ids) {
                                self.setViewInfo();
                            }
                        } else {
                            self.setViewInfo();
                        }
                    });
                };

                /**
                 * @description 사업등록, 수정을 위한 parameter를 생성한다.
                 */
                view.makePostParam = function () {
                    var self = this,
                        rtnPostParam,

                    // 수주기본정보 parameter를 생성한다.
                        makeBasicParam = function () {
                            var rtnParam = {
                                TYPE_CD		    : Number( orderVO.TYPE_CD ),
                                PROJECT_NAME	: orderVO.PROJECT_NAME.trim(),
                                CUSTOMER_CD		: orderVO.CUSTOMER_CD,
                                SALES_CD	    : orderVO.SALES_CD,
                                WINRATE		    : Number( orderVO.WINRATE ),
                                COMMIT_STATUS	: orderVO.COMMIT_STATUS,
                                ORDER_D			: orderVO.orderYear +"-"+ orderVO.orderMonth +"-01",
                                PROJECT_SCALE 	: orderVO.PROJECT_SCALE,
                                STATUS			: Number( orderVO.STATUS ),
                                PT_OWN_DIST_SALES : orderVO.PT_OWN_DIST_SALES,
                                PT_SUB_DIST_SALES : orderVO.PT_SUB_DIST_SALES,
                                PT_OWN_DIST_PURC  : orderVO.PT_OWN_DIST_PURC,
                                PT_SUB_DIST_PURC  : orderVO.PT_SUB_DIST_PURC
                            };

                            if ( orderVO.contractDateChecked ) {
                                rtnParam.CONTRACT_SD = orderVO.contractStartYear +"-"+ orderVO.contractStartMonth +"-01";
                                rtnParam.CONTRACT_ED = orderVO.contractEndYear +"-"+ orderVO.contractEndMonth +"-01";
                            }

                            // 부영업대표
                            if ( orderVO.SUB_EMP_CD !== "" ) {
                                rtnParam.SUB_EMP_CD = orderVO.SUB_EMP_CD;
                            }

	                        // 매출공유 (2015/07/06 추가)
	                        if ( orderVO.NO_CST_EMP ) {
		                        rtnParam.NO_CST_EMP = orderVO.NO_CST_EMP;
	                        }

                            // 주요제품
                            if ( orderVO.MAJOR !== "" ) {
                                rtnParam.MAJOR = orderVO.MAJOR;
                            }

                            if ( self.kind !== "insert" ) {
                                rtnParam.UNIQ_CD = self.ids;
                            }

                            return rtnParam;
                        },

                    // 제품 parameter를 생성한다.
                        makeProductParam = function () {
                            var
                                reg = /,/g,
                                productList = orderVO.product.productList,
                                productDeleteList = orderVO.product.deleteList,
                                rtnList = [];

                            // 현재 가지고 있는 제품
                            angular.forEach( productList, function (data) {
                                var productObj = {
                                    flag : data.flag,
                                    PRODUCT_TYPE_CD : Number( data.PRODUCT_TYPE_CD ),
                                    SALES  :  Number( (""+ data.SALES).replace( reg, "" ) ),
                                    BUY     : Number( (""+ data.BUY).replace( reg, "" ) ),
                                    CD_VED_C : Number(data.CD_VED_C)
                                };

                                // 사업수정, 사업상세인경우 ORDER_CD || Product UNIQ_CD
                                if ( self.kind==="update" || self.kind==="detail" ) {
                                    productObj.ORDER_CD = data.ORDER_CD;
                                    if ( data.flag === "U" ) {
                                        productObj.UNIQ_CD = data.UNIQ_CD;
                                    }
                                }

                                // 매입처코드
                                if ( data.CUST_CD !== "" ) {
                                    productObj.CUST_CD = data.CUST_CD;
                                }

                                rtnList.push( productObj );
                            });

                            // 삭제할 제품
                            angular.forEach(productDeleteList, function ( data ) {
                                if ( data.flag === "U" ) {
                                    var productObj = {
                                        flag		: "D",
                                        ORDER_CD: data.ORDER_CD,
                                        UNIQ_CD	: data.UNIQ_CD,
                                        PRODUCT_TYPE_CD: Number( data.PRODUCT_TYPE_CD )
                                    };
                                    rtnList.push( productObj );
                                }
                            });

                            return rtnList;
                        },

                        // 매출일정 parameter를 생성한다.
                        makeSalesScheduleParam = function () {
                            var reg = /,/g,
                                scheduleList = salesVO.sales.scheduleList,
                                scheduleDeleteList = salesVO.sales.deleteList,
                                rtnList = [];

                            // 현재 가지고 있는 제품
                            angular.forEach( scheduleList, function (data) {
                                var productObj = {
                                    flag: data.flag,
                                    SALES: Number( (""+ data.SALES).replace( reg, "" ) ),
                                    BUY: Number( (""+ data.BUY).replace( reg, "" ) ),
                                    CD_SMR_BIL: data.CD_SMR_BIL
                                };

                                // 사업수정, 사업상세인경우 ORDER_CD || Product UNIQ_CD
                                if ( self.kind==="update" || self.kind==="detail" ) {
                                    productObj.ORDER_CD = data.ORDER_CD;
                                    if ( data.flag === "U" ) {
                                        productObj.UNIQ_CD = data.UNIQ_CD;
                                    }
                                }

                                // 매출일자
                                if ( data.salesYear!=="" && data.salesMonth ) {
                                    productObj.SALES_D = data.salesYear +"-"+ data.salesMonth +"-01";
                                }

                                // 수금일자
                                if ( data.collectYear!=="" && data.collectMonth ) {
                                    productObj.COLLECT_D = data.collectYear +"-"+ data.collectMonth +"-01";
                                }

                                // 수금상태
                                productObj.COLLECT_STATUS = Number( data.COLLECT_STATUS );

                                // 매입처코드
                                if ( data.CUST_CD !== "" ) {
                                    productObj.CUST_CD = data.CUST_CD;
                                }

                                rtnList.push( productObj );
                            });

                            // 삭제할 제품
                            angular.forEach( scheduleDeleteList, function ( data ) {
                                if ( data.flag === "U" ) {
                                    var productObj = {
                                        flag		: "D",
                                        ORDER_CD: data.ORDER_CD,
                                        UNIQ_CD	: data.UNIQ_CD
                                    };
                                    rtnList.push( productObj );
                                }
                            });

                            return rtnList;
                        },

                    // Comment parameter를 생성한다.
                        makeCommentParam = function () {
                            var rtnParam;
                            if ( orderCommentVO.orderComment !== "" ) {
                                rtnParam = [ { ACTIVE_DT: orderCommentVO.activeDate, COMMENT: orderCommentVO.orderComment }] ;
                            } else {
                                rtnParam = [];
                            }
                            return rtnParam;
                        };


                    rtnPostParam = makeBasicParam();
                    rtnPostParam.orderProduct = makeProductParam();
                    rtnPostParam.orderRevenue = makeSalesScheduleParam();
                    rtnPostParam.orderFile 	  = [];
                    rtnPostParam.orderComment = makeCommentParam();

                    return rtnPostParam;
                };

                /**
                 * @description 사업정보를 복사하여 등록한다.
                 */
                view.doCopy = function () {
                    var confirmMsg = "수주정보만 복사하여 새로운 사업이 등록됩니다. 진행하시겠습니까?";
                    if (confirm(confirmMsg)) {
                        $state.go('app.buBusiness', { kind: 'insert', menu: null, ids: this.ids });
                    }
                };

                /**
                 * @description 등록된 사업정보를 화면에 보여주기 위해 가공한다.
                 */
                view.setViewInfo = function () {
                    var self = this,
                        splitOrderDate;

                    // 수주정보
                    splitOrderDate = buInfo.ORDER_D.split("-");

                    orderVO.TYPE_CD 	  = buInfo.TYPE_CD;
                    orderVO.TYPE_NAME 	  = buInfo.TYPE_NAME;
                    orderVO.PROJECT_NAME  = buInfo.PROJECT_NAME;
                    orderVO.CUSTOMER_CD   = buInfo.CUSTOMER_CD;
                    orderVO.CUSTOMER_NAME = buInfo.CUSTOMER_NAME;
                    orderVO.SALES_CD 	  = buInfo.SALES_CD;
                    orderVO.SALES_NAME 	  = buInfo.SALES_NAME;
                    orderVO.SUB_EMP_CD 	  = buInfo.SUB_EMP_CD ? buInfo.SUB_EMP_CD : "";
                    orderVO.SUB_EMP_NAME  = buInfo.SUB_EMP_DEPT_NAME ? buInfo.SUB_EMP_NAME : "";
                    orderVO.WINRATE 	  = buInfo.WINRATE;
                    orderVO.COMMIT_STATUS = buInfo.COMMIT_STATUS;
                    orderVO.STATUS 		  = buInfo.STATUS;
                    orderVO.STATUS_NAME   = buInfo.STATUS_NAME;
                    orderVO.ORDER_D 	  = buInfo.ORDER_D +"-01";
                    orderVO.orderYear 	  = splitOrderDate[0];
                    orderVO.orderMonth 	  = splitOrderDate[1];
                    orderVO.PROJECT_SCALE = buInfo.PROJECT_SCALE;
                    orderVO.MAJOR 		  = buInfo.MAJOR;
                    orderVO.PT_OWN_DIST_SALES = buInfo.PT_OWN_DIST_SALES;
                    orderVO.PT_SUB_DIST_SALES = buInfo.PT_SUB_DIST_SALES;
                    orderVO.PT_OWN_DIST_PURC  = buInfo.PT_OWN_DIST_PURC;
                    orderVO.PT_SUB_DIST_PURC  = buInfo.PT_SUB_DIST_PURC;
                    
                    if (view.code.totdistCodeList[0].DC_RMK1 === "0") {
                    	view.disabled.subOk = false;
                    }
                    else {
                    	if(orderVO.SUB_EMP_CD) view.disabled.subOk = true;
                    	else                   view.disabled.subOk = false;
                    }
                    
                    salesVO.REVENUE_FLAG  = buInfo.REVENUE_FLAG;

	                // 2015/07/06 추가
	                orderVO.NO_CST_EMP = buInfo.NO_CST_EMP;
	                orderVO.NM_CST_EMP = buInfo.NM_CST_EMP || '';

                    // 계약기간
                    if (buInfo.CONTRACT_SD) {
                        orderVO.contractDateChecked = true;
                        orderVO.CONTRACT_SD = buInfo.CONTRACT_SD +"-01";
                        orderVO.CONTRACT_ED = buInfo.CONTRACT_ED +"-01";

                        var	splitContractSD = buInfo.CONTRACT_SD.split( "-" ),
                            splitContractED = buInfo.CONTRACT_ED.split( "-" );

                        orderVO.contractStartYear = splitContractSD[0];
                        orderVO.contractStartMonth = splitContractSD[1];
                        orderVO.contractEndYear = splitContractED[0];
                        orderVO.contractEndMonth = splitContractED[1];
                    }

                    // 제품
                    angular.forEach( buInfo.orderProduct, function ( data ) {
                        data.flag = (self.kind === "insert") ? "I" : "U";
                        data.disabled = false;
                        orderVO.product.productList.push( new model.Part( data ));
                    });

                    // 주사업자 정보
                    if (this.kind !== "insert") {
                        orderVO.ownerInfo.DEPT_NAME = buInfo.OWN_EMP_DEPT_NAME;
                        orderVO.ownerInfo.POS_NAME = buInfo.OWN_EMP_POS_NAME;
                        orderVO.ownerInfo.EMP_CD = buInfo.OWN_EMP_CD;
                        orderVO.ownerInfo.NAME = buInfo.OWN_EMP_NAME;

                        // 매출정보
                        angular.forEach( buInfo.orderRevenue, function ( data ) {
                            var splitSalesDate = data.SALES_D.split( "-" ),
                                splitCollectDate;

                            data.flag = "U";
                            data.salesYear = splitSalesDate[0];
                            data.salesMonth = splitSalesDate[1];

                            if ( data.COLLECT_D ) {
                                splitCollectDate = data.COLLECT_D.split( "-" );
                                data.collectYear = splitCollectDate[0];
                                data.collectMonth = splitCollectDate[1];
                            }

                            // 수금완료
                            data.collectModified = (data.COLLECT_STATUS!==2 || buStatus<4);

                            salesVO.sales.scheduleList.push(new model.SalesSchedule(data));
                        });

                        // 파일정보
                        fileVO.currentFileList = buInfo.orderFile || [];

                        // COMMENT
                        orderCommentVO.commentList = buInfo.orderComment || [];

                        // HISTORY
                        historyVO.historyList = buInfo.orderHistory || [];
                    }

                    orderVO.getTotalSumary();
                };

                view.isValid = function (param) {
	                if (!_isValidOrder(orderVO)                     ) { return false; }
	                if (!_isValidSales(orderVO, salesVO)            ) { return false; }
	                if (!_isValidEqualsPrice(orderVO, salesVO)      ) { return false; }
	                if (!_isValidComments(orderVO, orderCommentVO)  ) { return false; }

	                _processOrderControlTransfer(param);

	                return true;


	                /**
	                 * 수주 유효성을 체크한다.
	                 * @param {Obejct} order 수주 모델
	                 * @returns {boolean}
	                 * @private
	                 */
	                function _isValidOrder(order) {
		                // 사업유형
		                if (!_isValidBuType()) {
			                return false;
		                }
		                // 프로젝트명
		                if (!_isValidProductName()) {
			                return false;
		                }
		                // 고객사명
		                if (!_isValidCustomerName()) {
			                return false;
		                }
		                // 매출처명
		                if (!_isValidSalesName()) {
			                return false;
		                }

		                // 매출매입비율
		                if (!_isValidDist()) {
			                return false;
		                }

		                // 계약기간
		                if (!_isValidContract()) {
			                return false;
		                }
		                // 주요제품
		                if (!_isValidMajorProduct()) {
			                return false;
		                }
		                // 제품
		                if (!_isValidProducts()) {
			                return false;
		                }

		                return true;

		                /**
		                 * 사업유형 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidBuType() {
			                if (!order.TYPE_CD) {
				                return edt.invalidFocus("businessType", "사업유형을 선택해주세요.");
			                }

			                return true;
		                }

		                /**
		                 * 프로젝트명 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidProductName() {
			                var oResult = new FieldVO(
				                {
					                type: "string",
					                name: "PROJECT_NAME",
					                value: orderVO.PROJECT_NAME,
					                displayName: "사업명"
				                },
				                [
					                {category: "require"},
					                {
						                category: "pattern",
						                value: /^[가-힣a-zA-Z0-9_(,)&@"'-:{​*}[;\]<#>][가-힣a-zA-Z0-9_ (,)&@"'-:{*​}[;\]<#>]{1,254}$/,
						                message: "[형식] 한글, 영어, 숫자, 공백, 특수문자(, ; _ & @ : # ' + \" * / () [] <>) 조합만 가능합니다."
					                },
				                ]
			                ).validate();
			                if (!oResult.valid) {
				                return edt.invalidFocus("projectName", oResult.message);
			                }

			                return true;
		                }

		                /**
		                 * 고객사명 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidCustomerName() {
			                var oResult = new FieldVO(
				                {
					                type: "integer",
					                name: "CUSTOMER_CD",
					                value: order.CUSTOMER_CD,
					                displayName: "고객사명"
				                },
				                [
					                {category: "require"}
				                ]
			                ).validate();
			                if (!oResult.valid) {
				                return edt.invalidFocus("searchCustomerCompanyBtn", oResult.message);
			                }

			                return true;
		                }

		                /**
		                 * 매출처명 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidSalesName() {
			                var oResult = new FieldVO(
				                {
					                type: "integer",
					                name: "SALES_CD",
					                value: order.SALES_CD,
					                displayName: "매출처명"
				                },
				                [
					                {category: "require"}
				                ]
			                ).validate();
			                if (!oResult.valid) {
				                return edt.invalidFocus("searchSalesCompanyBtn", oResult.message);
			                }

			                return true;
		                }

		                /**
		                 * 매출처명 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidDist() {
			                var oResult = new FieldVO(
				                {
					                type: "integer",
					                name: "PT_OWN_DIST_SALES",
					                value: order.PT_OWN_DIST_SALES,
					                displayName: "매출(주)비율"
				                },
				                [
					                { category: "require", include: [0] },
					                { category: "range", min: 0, max: 100 }
				                ]
			                ).validate();
			                if (!oResult.valid) {
				                return edt.invalidFocus("ptOwnDistSales", oResult.message);
			                }

			                var oResult1 = new FieldVO(
				                {
					                type: "integer",
					                name: "PT_SUB_DIST_SALES",
					                value: order.PT_SUB_DIST_SALES,
					                displayName: "매출(부)비율"
				                },
				                [
					                { category: "require", include: [0] },
					                { category: "range", min: 0, max: 100 }
				                ]
			                ).validate();
			                if (!oResult1.valid) {
				                return edt.invalidFocus("ptSubDistSales", oResult1.message);
			                }
			                
			                var oResult2 = new FieldVO(
				                {
					                type: "integer",
					                name: "PT_OWN_DIST_PURC",
					                value: order.PT_OWN_DIST_PURC,
					                displayName: "매입(주)비율"
				                },
				                [
					                { category: "require", include: [0] },
					                { category: "range", min: 0, max: 100 }
				                ]
			                ).validate();
			                if (!oResult2.valid) {
				                return edt.invalidFocus("ptOwnDistPurc", oResult2.message);
			                }
			                
			                var oResult3 = new FieldVO(
				                {
					                type: "integer",
					                name: "PT_SUB_DIST_PURC",
					                value: order.PT_SUB_DIST_PURC,
					                displayName: "매입(부)비율"
				                },
				                [
					                { category: "require", include: [0] },
					                { category: "range", min: 0, max: 100 }
				                ]
			                ).validate();
			                if (!oResult3.valid) {
				                return edt.invalidFocus("ptSubDistPurc", oResult3.message);
			                }
			                
			                return true;
		                }

		                /**
		                 * 계약기간 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidContract() {
			                if (!order.contractDateChecked) {
				                return true;
			                }

			                var sOrderDate = [order.orderYear, order.orderMonth, "01"].join("-"),
				                sContractSd = [order.contractStartYear, order.contractStartMonth, "01"].join("-"),
				                sContractEd = [orderVO.contractEndYear, order.contractEndMonth, "01"].join("-"),
				                oResult1, oResult2;

			                oResult1 = new FieldVO(
				                {
					                type: "string",
					                name: "CONTRACT_SD",
					                value: sContractSd,
					                displayName: "계약기간"
				                },
				                [
					                {
						                category: "period",
						                value: "end",
						                format: "YYYY-MM-DD",
						                reference: sOrderDate,
						                message: "[기간] 계약기간을 확인해주세요. 계약기간 시작일자가 수주년월보다 빠를 수 없습니다."
					                }
				                ]
			                ).validate();
			                if (!oResult1.valid) {
				                return edt.invalidFocus("contractStartYear", oResult1.message);
			                }

			                oResult2 = new FieldVO(
				                {
					                type: "string",
					                name: "CONTRACT_ED",
					                value: sContractEd,
					                displayName: "계약기간"
				                },
				                [
					                {
						                category: "period",
						                value: "end",
						                format: "YYYY-MM-DD",
						                reference: sContractSd,
						                message: "[기간] 계약기간을 확인해주세요. 계약기간 종료일자가 계약기간 시작일자보다 빠를 수 없습니다."
					                }
				                ]
			                ).validate();
			                if (!oResult2.valid) {
				                return edt.invalidFocus("contractEndYear", oResult2.message);
			                }

			                return true;
		                }

		                /**
		                 * 주요제품 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidMajorProduct() {
			                var oResult = new FieldVO(
				                {
					                type: "string",
					                name: "MAJOR",
					                value: order.MAJOR,
					                displayName: "주요제품"
				                },
				                [
					                {category: "require"},
					                {
						                category: "pattern",
						                value: /^[가-힣a-zA-Z0-9_(,)&@'"-:{*}[;\]<#>+%$!][가-힣a-zA-Z0-9_ (,)&@'"-:{*}[;\]<#>+%$!]{1,254}$/,
						                message: "[형식] 한글, 영어, 숫자, 공백, 특수문자(, ; _ & @ : # ' + \" * ! % / () [] <>) 조합만 가능합니다."
					                },
				                ]
			                ).validate();
			                if (!oResult.valid) {
				                return edt.invalidFocus("majorProduct", oResult.message);
			                }

			                return true;
		                }

		                /**
		                 * 제품 유효성 체크
		                 * @returns {Boolean}
		                 * @private
		                 */
		                function _isValidProducts() {
			                var lProducts = order.product.productList,
				                lDeleteProducts = order.product.deleteList.filter(function (deleteProduct) {
					                return deleteProduct.UNIQ_CD;
				                }),
				                lAllProducts = lProducts.concat(lDeleteProducts),
				                rRemove = /,/g,
				                nI, nLng, oProduct,
				                oResult1, oResult2, oResult3, oResult4;

			                if (lProducts.length === 0) {
				                return edt.invalidFocus("addProudctBtn", "제품을 등록해주세요.");
			                } else {
				                for (nI = 0, nLng = lAllProducts.length; nI < nLng; nI++) {
					                oProduct = lAllProducts[nI];

					                oResult1 = new FieldVO(
						                {
							                type: "integer",
							                name: "PRODUCT_TYPE_CD",
							                value: Number(oProduct.PRODUCT_TYPE_CD),
							                displayName: "제품유형"
						                },
						                [
							                {
								                category: "require",
								                message: "[필수] 제품유형을 선택해주세요."
							                }
						                ]
					                ).validate();
					                if (!oResult1.valid) {
						                return edt.invalidFocus("addProudctBtn", oResult1.message);
					                }

					                oResult2 = new FieldVO(
						                {
							                type: "integer",
							                name: "SALES",
							                value: Number(oProduct.SALES.replace(rRemove, "")),
							                displayName: "매출금액"
						                },
						                [
							                { category: "require", include: [0] },
							                { category: "range", min: -99999999999, max: 99999999999 }
						                ]
					                ).validate();
					                if (!oResult2.valid) {
						                return edt.invalidFocus("addProudctBtn", oResult2.message);
					                }

					                oResult3 = new FieldVO(
						                {
							                type: "integer",
							                name: "BUY",
							                value: Number(oProduct.BUY.replace(rRemove, "")),
							                displayName: "매입금액"
						                },
						                [
							                { category: "require", include: [0] },
							                { category: "range", min: -99999999999, max: 99999999999 }
						                ]
					                ).validate();
					                if (!oResult3.valid) {
						                return edt.invalidFocus("addProudctBtn", oResult3.message);
					                }

					                oResult4 = new FieldVO(
						                {
							                type: "integer",
							                name: "CD_VED_C",
							                value: Number(oProduct.CD_VED_C),
							                displayName: "벤더사"
						                },
						                [
							                {category: "require"}
						                ]
					                ).validate();
					                if (!oResult4.valid) {
						                return edt.invalidFocus("addProudctBtn", oResult4.message);
					                }
				                }
			                }

			                return true;
		                }
	                }

	                function _isValidSales(order, sales) {
	                    var lOrderProducts = order.product.productList,
		                    lSalesRevenues  = sales.sales.scheduleList,
		                    lSalesDeleteRevenues = sales.sales.deleteList.filter(function(revenue) {
								return revenue.UNIQ_CD;
		                    }),
		                    lAllRevenues = lSalesRevenues.concat(lSalesDeleteRevenues),
		                    sOrderDate = [order.orderYear, order.orderMonth, "01"].join("-"),
		                    rRemove = /,/g,
		                    nI, nLng, oRevenue, sSalesDate, sCollectDate,
		                    oResult1, oResult2, oResult3, oResult4, oResult5, oResult6;

	                    // WHEN 유지보수 사업
	                    if (order.TYPE_CD === 3) {
		                    // COMMIT이 되었을 경우에는 매출정보등록은 필수이다.
		                    if (order.COMMIT_STATUS === "YES") {
			                    if (lOrderProducts.length === 0) {
				                    return edt.invalidFocus("addScheduleBtn", "매출정보를 등록해주세요.");
			                    }
		                    }

	                    // WHEN 유지보수를 제외한 사업
	                    } else {
		                    if (lOrderProducts.length === 0) {
			                    return edt.invalidFocus("addScheduleBtn", "매출정보를 등록해주세요.");
		                    }
	                    }

	                    for (nI=0, nLng=lAllRevenues.length; nI<nLng; nI++) {
		                    oRevenue    = lAllRevenues[nI];
		                    sSalesDate  = [oRevenue.salesYear,  oRevenue.salesMonth, "01"].join("-");
		                    sCollectDate= [oRevenue.collectYear,  oRevenue.collectMonth, "01"].join("-");

		                    oResult1 = new FieldVO(
			                    { type: "string", name: "salesYear", value: oRevenue.salesYear, displayName: "매출년" },
			                    [
				                    { category: "require", message: "[필수] 매출년을 선택해주세요." }
			                    ]
		                    ).validate();
		                    if (!oResult1.valid) {
			                    return edt.invalidFocus("addScheduleBtn", oResult1.message);
		                    }

		                    oResult2 = new FieldVO(
			                    { type: "string", name: "salesMonth", value: oRevenue.salesMonth, displayName: "매출월" },
			                    [
				                    { category: "require", message: "[필수] 매출월을 선택해주세요." }
			                    ]
		                    ).validate();
		                    if (!oResult2.valid) {
			                    return edt.invalidFocus("addScheduleBtn", oResult2.message);
		                    }

		                    oResult3 = new FieldVO(
			                    { type: "string", name: "salesDate", value: sSalesDate, displayName: "매출일자" },
			                    [
				                    { category: "period", value: "end", format: "YYYY-MM-DD", reference: sOrderDate, message: "[기간] 매출일자를 확인해주세요. 매출일자가 수주일자보다 전일 수 없습니다." }
			                    ]
		                    ).validate();
		                    if (!oResult3.valid) {
			                    return edt.invalidFocus("addScheduleBtn", oResult3.message);
		                    }

		                    oResult4 = new FieldVO(
			                    { type: "integer", name: "SALES", value: oRevenue.SALES.__proto__.constructor.name=="Number"?oRevenue.SALES:Number(oRevenue.SALES.replace(rRemove, "")), displayName: "매출금액" },
			                    [
				                    { category: "require", include: [0] },
				                    { category: "range", min: -99999999999, max: 99999999999 }
			                    ]
		                    ).validate();
		                    if (!oResult4.valid) {
			                    return edt.invalidFocus("addScheduleBtn", oResult4.message);
		                    }

		                    oResult5 = new FieldVO(
			                    { type: "integer", name: "BUY", value: oRevenue.BUY.__proto__.constructor.name=="Number"?oRevenue.SALES:Number(oRevenue.BUY.replace(rRemove, "")), displayName: "매입금액" },
			                    [
				                    { category: "require", include: [0] },
				                    { category: "range", min: -99999999999, max: 99999999999 }
			                    ]
		                    ).validate();
		                    if (!oResult5.valid) {
			                    return edt.invalidFocus("addScheduleBtn", oResult5.message);
		                    }

		                    if (oRevenue.collectYear || oRevenue.collectMonth) {
			                    oResult6 = new FieldVO(
				                    { type: "string", name: "collectDate", value: sCollectDate, displayName: "수금일자" },
				                    [
					                    { category: "period", value: "end", format: "YYYY-MM-DD", reference: sSalesDate, message: "[기간] 수금일자를 확인해주세요. 수금일자가 매출일자보다 전일 수 없습니다." }
				                    ]
			                    ).validate();
			                    if (!oResult6.valid) {
				                    return edt.invalidFocus("addScheduleBtn", oResult6.message);
			                    }
		                    }
	                    }
	                    return true;
                    }

	                /**
	                 * 제품금액과 매출정보금액 일치비교
	                 * @returns {*}
	                 * @private
	                 */
	                function _isValidEqualsPrice(order, sales) {
		                if (order.TYPE_CD !== 3 || (order.TYPE_CD===3 && order.COMMIT_STATUS==="YES")) {

			                if (!sales.equalSalse) {
				                return edt.invalidFocus("addScheduleBtn", "제품매출금액 합계와 매출정보의 매출금액 합계가 일치하지 않습니다.");
			                }
			                if (!sales.equalCost) {
				                return edt.invalidFocus("addScheduleBtn", "제품Cost금액 합계와 매출정보의 매입금액 합계가 일치하지 않습니다.");
			                }
		                }

		                return true;
	                }

	                /**
	                 * COMMENTS 유효성 검사
	                 * @private
	                 */
	                function _isValidComments(order, comment) {
		                var rComment = /^[가-힣a-zA-Z0-9~`\|\\!@#$%^&*()\[\]\-=+_|{};':\"<>?,.\/][가-힣a-zA-Z0-9~ `\|\\!@#$%^&*()\[\]\-=+_|{};':\"<>?,.\/]{1,254}$/,
			                oResult1, oResult2;


		                if (order.STATUS >= 4) {
			                oResult1 = new FieldVO(
				                { type: "string", name: "orderActiveDate", value: comment.activeDate, displayName: "영업활동 일자" },
				                [
					                { category: "require" },
					                { category: "date", format: "YYYY-MM-DD" }
				                ]
			                ).validate();
			                if (!oResult1.valid) {
				                return edt.invalidFocus("orderActiveDate", oResult1.message);
			                }

			                oResult2 = new FieldVO(
				                { type: "string", name: "orderComment", value: comment.orderComment, displayName: "영업활동 COMMENT" },
				                [
					                { category: "require", message: "Comment를 입력해주세요.(수주실패, 수주지연, 수주취소, 수주이관 시 필수입력값입니다.)" },
					                { category: "pattern", value: rComment }
				                ]
			                ).validate();
			                if (!oResult2.valid) {
				                return edt.invalidFocus("orderComment", oResult2.message);
			                }

		                } else {
			                if (comment.orderComment) {
				                oResult1 = new FieldVO(
					                { type: "string", name: "orderActiveDate", value: comment.activeDate, displayName: "영업활동 일자" },
					                [
						                { category: "date", format: "YYYY-MM-DD" }
					                ]
				                ).validate();
				                if (!oResult1.valid) {
					                return edt.invalidFocus("orderActiveDate", oResult1.message);
				                }

				                oResult2 = new FieldVO(
					                { type: "string", name: "orderComment", value: comment.orderComment, displayName: "영업활동 COMMENT" },
					                [
						                { category: "pattern", value: rComment }
					                ]
				                ).validate();
				                if (!oResult2.valid) {
					                return edt.invalidFocus("orderComment", oResult2.message);
				                }
			                }
		                }
		                return true;
	                }

	                /**
	                 * 파일 유효성 검사
	                 * @private
	                 */
		            function _isValidFiles() {

	                }

	                /**
	                 * 진행상태가 7(수주이관)일 경우
	                 * FUNNEL, COMMIT_STATUS, orderProduct, orderRevenue의 금액을 0으로 변경한다.
	                 * WINRATE를 0퍼센트로 변경한다.
	                 * @private
	                 */
	                function _processOrderControlTransfer(param) {
		                if (BuBusinessInfoSvc.isOrderControlTransfer(param)) {
			                param.COMMIT_STATUS = "NO";
			                param.PROJECT_SCALE = 0;
			                param.WINRATE = 0;

			                if (Array.isArray(param.orderProduct) && param.orderProduct.length>0) {
				                param.orderProduct.map(function(oProduct) {
					                oProduct.BUY = 0;
					                oProduct.SALES = 0;
				                });
			                }

			                if (Array.isArray(param.orderRevenue) && param.orderProduct.length>0) {
				                param.orderRevenue.map(function(oRevenue) {
					                oRevenue.BUY = 0;
					                oRevenue.SALES = 0;
				                });
			                }
		                }
	                }
                };

                /**
                 * @description 사업을 등록한다.
                 */
                view.doInsert = function () {
	                var self = this,
		                param = self.makePostParam(),
		                msg = APP_MSG.insert.confirm;

	                if (BuBusinessInfoSvc.isOrderControlTransfer(param)) {
		                msg = "수주이관 등록/수정시 모든 매출/매입금액은 0으로 변경됩니다.\n" + msg;
	                }


                    if (confirm(APP_MSG.insert.confirm)) {
                        if ( this.isValid( param ) ) {

                            BuBusinessInfoSvc.checkDuplicateOrder( param )
                                .then(function ( result ) {
                                    var resData = result.data,
                                        defer = $q.defer();

                                    if ( !resData.dubCheck ) {
                                        alert(resData.msg);
                                        defer.reject();
                                    } else { defer.resolve(); }

                                    return defer.promise;
                                })
                                .then(function ( result ) {
                                    return BuBusinessInfoSvc.insert( param );
                                })
                                .then(function ( result ) {
                                    view.ids = result.data;
                                    if ( fileVO.uploader.queue.length > 0 ) {
                                        fileVO.doUpload();
                                    } else {
                                        alert( APP_MSG.insert.success );
                                        $state.go('app.buBusiness', { kind: 'list', menu: true, ids: null });
                                    }
                                });
                        }
                    }
                };

                /**
                 * @description 사업을 수정한다.
                 */
                view.doUpdate = function () {
                    var param = this.makePostParam(),
	                    msg = APP_MSG.update.confirm;

	                if (BuBusinessInfoSvc.isOrderControlTransfer(param)) {
		                msg = "수주이관 등록/수정시 모든 매출/매입금액은 0으로 변경됩니다.\n" + msg;
	                }

                    if (confirm(msg)) {
                        if ( this.isValid( param ) ) {
                            BuBusinessInfoSvc.update( param ).then(function ( result ) {
                                view.ids = result.data;
                                if ( fileVO.uploader.queue.length>0 || fileVO.deleteFileList.length>0 ) {
                                    fileVO.doUpload();
                                } else {
                                    alert( APP_MSG.update.success );
                                    $state.go('app.buBusiness', { kind: 'list', menu: true, ids: null });
                                }
                            });
                        }
                    }
                };

                /**
                 * @description 사업등록 및 수정을 취소하고 리스트화면으로 이동한다.
                 */
                view.doCancel = function () {
                    if ( confirm( APP_MSG.cancel ) ) {
                        $state.go('app.buBusiness', { kind: 'list', menu: true, ids: null });
                    }
                };

                /**
                 * @description 확인버튼을 누르면 메세지 없이 리스트 페이지로 이동한다.
                 */
                view.doConfirm = function () {
                    $state.go('app.buBusiness', { kind: 'list', menu: true, ids: null });
                };




                /**
                 * ------------------------------------------------------------------------------------------------------------------------------------------
                 * [ orderVO ]
                 * @description 수주정보 화면을 관리한다.
                 * @type {Object} ownerInfo 주사업자 정보
                 * @type {Number} TYPE_CD 사업유형
                 * @type {String} TYPE_NAME 사업유형이름
                 * @type {String} PROJECT_NAME 사업명
                 * @type {Number} CUSTOMER_CD 고객사코드
                 * @type {String} CUSTOMER_NAME 고객사이름
                 * @type {Number} SALES_CD 매출처코드
                 * @type {String} SALES_NAME 매출처이름
                 * @type {String} SUB_EMP_CD 부영업대표 사원번호
                 * @type {String} SUB_EMP_NAME 부영업대표 이름
                 * @type {String} ORDER_D 수주일자 = orderYear +"-"+ orderMonth +"-01"
                 * @type {String} orderYear 수주년
                 * @type {String} orderMonth 수주월
                 * @type {String} contractDateChecked 계약기간 선택여부
                 * @type {String} CONTRACT_SD 계약시작일자
                 * @type {String} CONTRACT_ED 계약종료일자
                 * @type {String} contractStartYear 계약년
                 * @type {String} contractStartMonth 계약월
                 * @type {String} contractEndYear 계약년
                 * @type {String} contractEndMonth 계약월
                 * @type {Number} WINRATE winrate
                 * @type {String} COMMIT_STATUS 수주commit상태(YES, NO)
                 * @type {Number} STATUS 진행상태
                 * @type {Number} PROJECT_SCALE 사업규모
                 * @type {Object} sumaryInfo 수주정보 요약
                 * -----------------------------------------------------------------------------------------------------------------------------------------*/
                orderVO = $scope.orderVO = {
                    ownerInfo				: {
                        DEPT_NAME		: "",
                        POS_NAME		: "",
                        NAME			: ""
                    },
                    TYPE_CD				: "",
                    TYPE_NAME			: "",
                    PROJECT_NAME		: "",
                    CUSTOMER_CD			: "",
                    CUSTOMER_NAME		: "",
                    SALES_CD			: "",
                    SALES_NAME			: "",
                    SUB_EMP_CD			: "",
                    SUB_EMP_NAME		: "",
                    ORDER_D				: "",
                    orderYear			: today.y,
                    orderMonth			: today.m,
                    contractDateChecked: false,
                    CONTRACT_SD			: "",
                    CONTRACT_ED			: "",
                    contractStartYear	: today.y,
                    contractStartMonth	: today.m,
                    contractEndYear		: today.y,
                    contractEndMonth	: today.m,
                    WINRATE				: 0,
                    COMMIT_STATUS		: "NO",
                    STATUS				: 1,
                    STATUS_NAME			: "",
                    MAJOR				: "",
                    PROJECT_SCALE		: 0,
                    product				: new model.Product(),
                    sumaryInfo			: {
                        funnel			: 0,
                        forecast		: 0,
                        cost			: 0,
                        margin			: 0,
                        marginRate		: 0
                    },

	                // 매출공유(컨설턴트) - 2015/07/06 추가
	                NO_CST_EMP : '',
	                NM_CST_EMP : '',
	                
	                // 배분(매출)비율 - 2016/12/12 추가
	                PT_OWN_DIST_SALES : 100,
	                PT_SUB_DIST_SALES : 0,
	                PT_OWN_DIST_PURC  : 100,
	                PT_SUB_DIST_PURC  : 0
                };

                /**
                 * @description 고객사를 검색한다.
                 */
                orderVO.modalSearchCustomerCompany = function () {
                    var
                        self = this,
                        modalInstance = $modal.open({
                            templateUrl : "app/shared/modal/searchCompany/modal.searchCompany.tpl.html",
                            controller  : "modal.searchCompanyCtrl",
                            size        : "lg"
                        });

                    modalInstance.result.then(function ( result ) {
                        self.CUSTOMER_CD    = result.code;
                        self.CUSTOMER_NAME  = result.name;
                    });
                };

                /**
                 * @description 매출처를 검색한다.
                 */
                orderVO.modalSearchSalesCompany = function () {
                    var
                        self = this,
                        modalInstance = $modal.open({
                            templateUrl : "app/shared/modal/searchCompany/modal.searchCompany.tpl.html",
                            controller  : "modal.searchCompanyCtrl",
                            size        : "lg"
                        });

                    modalInstance.result.then(function ( result ) {
                        self.SALES_CD 	= result.code;
                        self.SALES_NAME = result.name;
                    });
                };

                /**
                 * @description 부영업대표를 검색한다.
                 */
                orderVO.modalSearchSubSalseRep = function () {
                    var self = this,
                        modalInstance = $modal.open({
                            templateUrl : "app/shared/modal/searchUser/modal.searchUser.tpl.html",
                            controller  : "ModalSearchUserCtrl",
                            size    : "lg",
                            resolve : {
                                dpParam: function () {
                                    return {
                                        wk_grp: '2' // 영업
                                    };
                                }
                            }
                        });

                    modalInstance.result.then(function ( result ) {
                        self.SUB_EMP_CD   = result.empNo;
                        self.SUB_EMP_NAME = result.name;
                        if(view.code.totdistCodeList[0].DC_RMK1 !== "0") {
                        	view.disabled.subOk = true;

                            self.PT_OWN_DIST_SALES = view.code.distibutionCodeList[0].DC_RMK1;
                            self.PT_SUB_DIST_SALES = view.code.distibutionCodeList[0].DC_RMK2;
                            self.PT_OWN_DIST_PURC  = view.code.distibutionCodeList[1].DC_RMK1;
                            self.PT_SUB_DIST_PURC  = view.code.distibutionCodeList[1].DC_RMK2;
                        }
                    });
                };

                /**
                 * @description 부영업대표 데이터를 초기화한다.
                 */
                orderVO.initSubSalesRep = function () {
                    this.SUB_EMP_CD 	= "";
                    this.SUB_EMP_NAME = "";
                    if(view.code.totdistCodeList[0].DC_RMK1 !== "0") {
                    	view.disabled.subOk = false;

                        this.PT_OWN_DIST_SALES = 100;
                        this.PT_SUB_DIST_SALES = 0;
                        this.PT_OWN_DIST_PURC  = 100;
                        this.PT_SUB_DIST_PURC  = 0;
                    }
                };

	            /**
	             * 매출공유(컨설턴트를) 검색한다.
	             */
	            orderVO.modalSearchConsultant = function () {
		            var self = this,
			            modalInstance = $modal.open({
				            templateUrl : "app/shared/modal/searchUser/modal.searchUser.tpl.html",
				            controller  : "ModalSearchUserCtrl",
				            size    : "lg",
				            resolve : {
					            dpParam: function () {
						            return {
                                        wk_grp: '6' // 컨설턴트
                                    };
					            }
				            }
			            });

		            modalInstance.result.then(function ( result ) {
			            self.NO_CST_EMP = result.empNo;
			            self.NM_CST_EMP = result.name;
		            });
	            };

	            /**
	             * 매출공유(컨설턴트)를 초기화한다.
	             */
	            orderVO.initConsultant = function () {
					this.NO_CST_EMP = '';
		            this.NM_CST_EMP = '';
	            };

                /**
                 * @description "if winrate==0, 진행상태==수주등록", "if winrate>=25 and winrate<100, 진행상태==수주진행", "if winrate==100, 진행상태==수주완료"
                 * 		"if winrate<50, 수주commit해제, disabled=true", "if winrate>=50 and winrate<=75, 수주commit자유, disabled=false", "if winrate==100, 수주commit선택, disabled=true"
                 */
                orderVO.changeWinRate = function () {
                    var winrate = Number( this.WINRATE );
                    if ( winrate === 0 ) {
                        this.STATUS = 1;
                        this.COMMIT_STATUS = "NO";
                    } else if ( winrate>=25 && winrate<=75 ) {
                        this.STATUS = 2;
                        if ( winrate === 25 ) {
                            this.COMMIT_STATUS = "NO";
                        }
                    } else if ( winrate === 100 ) {
                        this.STATUS = 3;
                        this.COMMIT_STATUS = "YES";
                    }
                    this.getTotalSumary();
                };

                /**
                 * @description "When 수주등록, winrate=0", "When 수주진행, 25<= winrate <=75", "When 수주완료, winrate=100", "When 수주취소, 수주지연, 수주실패, winrate=현재상태유지"
                 */
                orderVO.changeIngState = function () {
                    var ingState = Number( this.STATUS ),
                        winrate = Number( this.WINRATE );

                    if ( ingState === 1 ) {// 수주등록
                        this.WINRATE = 0;
                        this.COMMIT_STATUS = "NO";
                    } else if ( ingState === 2 ) {// 수주진행
                        if ( winrate === 0 ) {
                            this.WINRATE = 25;
                        } else if ( winrate === 100 ) {
                            this.WINRATE = 75;
                        }
                    } else if ( ingState === 3 ) {// 수주완료
                        this.WINRATE = 100;
                        this.COMMIT_STATUS = "YES";
                    } else if ( ingState===4 || ingState===6 ) {
                        this.WINRATE = 0;
                        this.COMMIT_STATUS = "NO";
                    }
                };

                /**
                 * @description 제품 Row를 추가한다.
                 */
                orderVO.addProductRow = function () {
                    if ( this.TYPE_CD === "" ) {
                        return edt.invalidFocus( "businessType", "사업유형을 선택해주세요." );
                    }

                    var makeInfo = { flag: "I", CD_VED_C: view.code.vendorCodeList[1].CD };
                    if ( view.kind !== "insert" ) {
                        makeInfo.ORDER_CD = view.ids;
                    }
                    this.product.createPart( makeInfo );
                };

                /**
                 * @description 제품 Row를 삭제한다.
                 */
                orderVO.deleteProductRow = function () {
                    this.product.removePart();
                    this.getTotalSumary();
                };

                /**
                 * @description 제품유형이 기본값이 아닐경우 disabled를 fale로 변경시킨다.
                 */
                orderVO.changePrdouctType = function ( idx ) {
                    var part = this.product.productList[idx];
                    if ( part.PRODUCT_TYPE_CD && part.PRODUCT_TYPE_CD !== "" ) {
                        part.disabled = false;
                    } else {
                        part.disabled = true;
                    }
                };

                /**
                 * @description funnel, forecast, commit, cost, margin, margin rate를 구한다.
                 */
                orderVO.setSubDistSales = function () {
                	var reg = /,/g;
                	
                	orderVO.PT_SUB_DIST_SALES = 100 - Number( (""+ orderVO.PT_OWN_DIST_SALES).replace( reg, "" ) );
                };

                /**
                 * @description funnel, forecast, commit, cost, margin, margin rate를 구한다.
                 */
                orderVO.setOwnDistSales = function () {
                	var reg = /,/g;
                	
                	orderVO.PT_OWN_DIST_SALES = 100 - Number( (""+ orderVO.PT_SUB_DIST_SALES).replace( reg, "" ) );
                };

                /**
                 * @description funnel, forecast, commit, cost, margin, margin rate를 구한다.
                 */
                orderVO.setSubDistPurc = function () {
                	var reg = /,/g;
                	
                	orderVO.PT_SUB_DIST_PURC = 100 - Number( (""+ orderVO.PT_OWN_DIST_PURC).replace( reg, "" ) );
                };

                /**
                 * @description funnel, forecast, commit, cost, margin, margin rate를 구한다.
                 */
                orderVO.setOwnDistPurc = function () {
                	var reg = /,/g;
                	
                	orderVO.PT_OWN_DIST_PURC = 100 - Number( (""+ orderVO.PT_SUB_DIST_PURC).replace( reg, "" ) );
                };

                /**
                 * @description funnel, forecast, commit, cost, margin, margin rate를 구한다.
                 */
                orderVO.getTotalSumary = function () {
                    var
                        self = this,
                        product = self.product,
                        sumaryInfo = self.sumaryInfo,
                        winrate = Number( self.WINRATE ),
                        commitStatus = self.COMMIT_STATUS,
                        funnel = 0,
                        cost = 0;

                    angular.forEach( product.productList, function ( data ) {
                        var reg = /,/g;

                        funnel 	+= Number( (""+ data.SALES).replace( reg, "" ) );
                        cost 	+= Number( (""+ data.BUY).replace( reg, "" ) );
                    });

                    self.PROJECT_SCALE		= funnel;
                    sumaryInfo.funnel			= funnel;
                    sumaryInfo.cost 			= cost;
                    sumaryInfo.margin			= funnel - cost;
                    sumaryInfo.marginRate	= (function () {
                        if ( sumaryInfo.funnel === 0 || sumaryInfo.margin === 0 ) {
                            return 0;
                        } else {
                            return ((sumaryInfo.margin/funnel) *100).toFixed(2);
                        }
                    }());

                    if ( commitStatus === "YES" ) {
                        sumaryInfo.commit = funnel;
                        sumaryInfo.forecast = funnel;
                    } else {
                        sumaryInfo.commit = 0;
                        sumaryInfo.forecast = winrate/100 * funnel;
                    }

                    // get Rest금액
                    salesVO.getAllRest();
                };



                /**
                 * ------------------------------------------------------------------------------------------------------------------------------------------
                 * [ salesVO ]
                 * @description 매출정보 화면을 관리한다.
                 * @type {Object} sales
                 * @type {Number} restSales Funnel과 매출정보 매출금액 합계의 차이
                 * @type {Number} restCost 제품 Cost합계와 매출정보 매입금액 합계의 차이
                 * @type {Boolean} equalSalse Funnel과 매출정보 매출금액 합계의 일치여부
                 * @type {Boolean} equalCost 제품 Cost합계와 매출정보 매입금액 합계의 일치여부
                 * @type {Boolean} REVENUE_FLAG 모든 수금이 완료되었을 경우 true, 수금이 완료되지 않았을 경우 false
                 * @type {Function} addScheduleRow 매출정보 Row를 추가한다.
                 * @type {Function} deleteScheduleRow 매출정보 Row를 삭제한다.
                 * @type {Function} getRestSales Funnel과 매출정보 매출금액 합계의 차이를 구한다.
                 * @type {Function} getRestCost 제품 Cost합계와 매출정보 매입금액 합계의 차이를 구한다.
                 * @type {Function} getRestCost Funnel과 매출정보 매출금액 합계의 차이, 제품 Cost합계와 매출정보 매입금액 합계의 차이를 구한다.
                 * -----------------------------------------------------------------------------------------------------------------------------------------*/
                salesVO = $scope.salesVO = {
                    sales    : new model.Sales(),
                    restSales: orderVO.sumaryInfo.funnel,
                    restCost : orderVO.sumaryInfo.cost,
                    equalSalse  : false,
                    equalCost   : false,
                    REVENUE_FLAG: false
                };

                /**
                 * @description 매출일정 Row를 추가한다.
                 */
                salesVO.addScheduleRow = function () {
                    var	scheduleLeng = this.sales.scheduleList.length,
                        makeInfo = { flag: "I" },
                        contractPeriod = 0,
                        scheduleObj, addMonth;

                    if ( orderVO.TYPE_CD === "" ) {
                        return edt.invalidFocus( "businessType", "사업유형을 선택해주세요." );
                    }

                    if ( orderVO.product.productList.length === 0 ) {
                        return edt.invalidFocus( "addProudctBtn", "제품을 먼저 등록해주세요." );
                    }

                    // 계약기간 체크시
                    if ( orderVO.contractDateChecked ) {
                        var	orderDate = orderVO.orderYear +"-"+ orderVO.orderMonth +"-01",
                            contractStartDate = orderVO.contractStartYear +"-"+ orderVO.contractStartMonth +"-01",
                            contractEndDate = orderVO.contractEndYear +"-"+ orderVO.contractEndMonth +"-01";

                        if ( !edt.validPeriodDate(orderDate, contractStartDate, "-" )) {
                            return edt.invalidFocus( "contractStartYear", "계약기간을 확인해주세요. 계약기간 시작일자가 수주년월보다 빠를 수 없습니다." );
                        }

                        if ( !edt.validPeriodDate(contractStartDate, contractEndDate, "-" )) {
                            return edt.invalidFocus("contractEndYear", "계약기간을 확인해주세요. 계약기간 종료일자가 계약기간 시작일자보다 빠를 수 없습니다." );
                        }

                        contractPeriod = edt.getDitcMonth(contractStartDate, contractEndDate);
                        contractPeriod = contractPeriod===0 ? 1 : contractPeriod+1;
                    }

                    if ( view.kind !== "insert" ) {
                        makeInfo.ORDER_CD = view.ids;
                    }

                    if ( scheduleLeng===0 && orderVO.contractDateChecked ) {
                        makeInfo.salesYear = orderVO.contractStartYear;
                        makeInfo.salesMonth = orderVO.contractStartMonth;
                        for ( var i=0; i<contractPeriod; i+=1 ) {
                            this.sales.createSchedule( makeInfo );
                            addMonth = Number( makeInfo.salesMonth );

                            if ( addMonth === 12 ) {
                                makeInfo.salesMonth = "01";
                                makeInfo.salesYear = Number( makeInfo.salesYear ) +1;
                            } else {
                                makeInfo.salesMonth = edt.fillSpace( addMonth+1	);
                            }

                            makeInfo.salesYear = ""+ makeInfo.salesYear;
                            makeInfo.salesMonth = ""+ makeInfo.salesMonth;
                        }

                    } else if ( scheduleLeng===0 ) {
                        makeInfo.salesYear = orderVO.orderYear;
                        makeInfo.salesMonth = orderVO.orderMonth;
                        this.sales.createSchedule( makeInfo );

                    } else {
                        scheduleObj = this.sales.scheduleList[scheduleLeng-1];
                        makeInfo.salesYear = scheduleObj.salesYear;
                        makeInfo.salesMonth = scheduleObj.salesMonth;
                        this.sales.createSchedule( makeInfo );
                    }
                };

                /**
                 * @description 매출일정 Row를 삭제한다.
                 */
                salesVO.deleteScheduleRow = function () {
                    this.sales.removeSchedule();
                    orderVO.getTotalSumary();
                };

                /**
                 * @description 매출일정 Row를 전체삭제한다.
                 */
                salesVO.deleteAllScheduleRow = function () {
                    this.sales.removeAllSchedule();
                    orderVO.getTotalSumary();
                };

                /**
                 * @description Funnel과 매출정보 매출금액 합계의 차이를 구한다.
                 */
                salesVO.getRestSales = function () {
                    var scheduleList = this.sales.scheduleList,
                        totalSales = 0,
                        reg = /,/g;

                    angular.forEach(scheduleList, function (data) {
                        var nPrice = Number(data.SALES.toString().replace(reg, ""));
                        totalSales += nPrice ? nPrice : 0;
                    });

                    this.restSales = orderVO.sumaryInfo.funnel - totalSales;
                    if ( this.restSales === 0 ) {
                        this.equalSalse = true;
                    } else {
                        this.equalSalse = false;
                    }
                };

                /**
                 * @description Funnel과 매출정보 매출금액 합계의 차이, 제품 Cost합계와 매출정보 매입금액 합계의 차이를 구한다.
                 */
                salesVO.getRestCost = function () {
                    var
                        scheduleList = this.sales.scheduleList,
                        totalCost = 0,
                        reg = /,/g;

                    angular.forEach( scheduleList, function ( data ) {
                        totalCost += Number( (""+ data.BUY).replace( reg, "") );
                    });

                    this.restCost = orderVO.sumaryInfo.cost - totalCost;
                    if ( this.restCost === 0 ) {
                        this.equalCost = true;
                    } else {
                        this.equalCost = false;
                    }
                };

                /**
                 * @description 제품 Cost합계와 매출정보 매입금액 합계의 차이를 구한다.
                 */
                salesVO.getAllRest = function () {
                    var
                        scheduleList = this.sales.scheduleList,
                        totalSales = 0,
                        totalCost = 0,
                        reg = /,/g;

                    angular.forEach( scheduleList, function ( data ) {
                        totalSales += Number( (""+ data.SALES).replace( reg, "") );
                        totalCost += Number( (""+ data.BUY).replace( reg, "") );
                    });

                    this.restSales = orderVO.sumaryInfo.funnel - totalSales;
                    this.restCost = orderVO.sumaryInfo.cost - totalCost;

                    if ( this.restSales === 0 ) {
                        this.equalSalse = true;
                    } else {
                        this.equalSalse = false;
                    }

                    if ( this.restCost === 0 ) {
                        this.equalCost = true;
                    } else {
                        this.equalCost = false;
                    }
                };

                /**
                 * @description 계산서발행시 매출,매입에 ,를 없앤다, 이유는 숫자를 문자로 변경해야지 template에 포멧이 정상작동한다.
                 */
                salesVO.setCalChange = function (saleSchedule) {
                    var reg = /,/g;
                    saleSchedule.BUY = saleSchedule.BUY.replace( reg, "" );
                    saleSchedule.SALES = saleSchedule.SALES.replace( reg, "" );
                };

                /**
                 * ------------------------------------------------------------------------------------------------------------------------------------------
                 * [ fileVO ]
                 * @description file 화면을 관리한다.
                 * -----------------------------------------------------------------------------------------------------------------------------------------*/
                fileVO = $scope.fileVO = {
                    url          : APP_CONFIG.domain +"/order/file",
                    status       : true,
                    uploader     : new FileUploader({
                        headers  : {
                            menuId : menuId
                        },
                        url      : APP_CONFIG.domain +"/order/file"
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

                            if ( edt.isUploadFileType( item ) && totalLeng < 5 ) {
                                rtnBoolean = true;
                            }
                            return rtnBoolean;
                        }
                    });
                };

                /**
                 * @description 등록된 파일을 remove할경우 deleteFileList에 삭제할 정보를 push한다.
                 * @param {Object} file
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
                 * @param {String} orderIds orderCd
                 */
                fileVO.doUpload = function ( orderIds ) {
                    orderIds = orderIds || view.ids;

                    if ( fileVO.deleteFileList.length > 0 ){
                        var deleteParamList = [
                            { order: orderIds }
                        ];
                        angular.forEach( fileVO.deleteFileList, function ( delInfo ) {
                            deleteParamList.push({ uniq_cd: delInfo.UNIQ_CD });
                        });

                        BuBusinessInfoSvc.deleteFile( deleteParamList ).then(function () {
                            if ( fileVO.uploader.queue.length > 0 ) {
                                angular.forEach( fileVO.uploader.queue, function ( file ) {
                                    file.formData.push({
                                        order: orderIds
                                    });
                                });
                                fileVO.uploader.uploadAll();
                            } else {
                                alert(APP_MSG.update.success);
                                $state.go('app.buBusiness', { kind: 'list', menu: true, ids: null });
                            }
                        }, function ( result ) {
                            alert( result.data );
                            $state.go('app.buBusiness', { kind: 'detail', menu: null, ids: orderIds });
                        });
                    } else {
                        angular.forEach( fileVO.uploader.queue, function ( file ) {
                            file.formData.push({
                                order: orderIds
                            });
                        });
                        fileVO.uploader.uploadAll();
                    }
                };

                /**
                 * @descriptioin fileupload 실패시 발생한다.
                 */
                fileVO.uploader.onWhenAddingFileFailed = function() {
                    var message = "";
                    message += "\"xls, xlsx, doc, docx, pdf, ppt, hwp, png, jpeg, jpg, jpe, gif\" 파일만 업로드 가능하며, ";
                    message += "등록된 Files + 추가된 Files <= 5 까지 업로드 가능합니다.";
                    alert( message );
                };

                /**
                 * @description loading bar를 on한다.
                 * @param item
                 */
                fileVO.uploader.onBeforeUploadItem = function() {
                    $scope.$emit( "event:loading", true );
                };

                /**
                 * @description loading bar를 off한다.
                 */
                fileVO.uploader.onCompleteAll = function() {
                    $scope.$emit( "event:loading", false );
                    if ( fileVO.status ) {
                        if ( view.kind === "insert" ) {
                            alert(APP_MSG.insert.success);
                        } else {
                            alert(APP_MSG.update.success);
                        }
                        $state.go('app.buBusiness', { kind: 'list', menu: true, ids: null });
                    } else {
                        alert( "파일 등록에 실패하였습니다. 다시 시도해주세요." );
                        if ( view.kind === "insert" ) {
                            $state.go('app.buBusiness', { kind: 'detail', menu: null, ids: view.ids });
                        } else {
                            $state.reload();
                        }
                    }
                };

                fileVO.uploader.onErrorItem = function() {
                    fileVO.status = false;
                };


                /**
                 * ------------------------------------------------------------------------------------------------------------------------------------------
                 * [ orderCommentVO ]
                 * @description 사업 영업활동 Comment를 관리한다.
                 * -----------------------------------------------------------------------------------------------------------------------------------------*/
                orderCommentVO = $scope.orderCommentVO = {
                    activeDate	: today.y +"-"+ today.m +"-"+ today.d,
                    orderComment: "",
                    commentList	: []
                };


                /**
                 * ------------------------------------------------------------------------------------------------------------------------------------------
                 * [ historyVO ]
                 * @description 수정된 이력을 관리한다.
                 * -----------------------------------------------------------------------------------------------------------------------------------------*/
                historyVO = $scope.historyVO = {
                    historyList : []
                };

                // Init Load
                view.initLoad();
            }]);
}());
