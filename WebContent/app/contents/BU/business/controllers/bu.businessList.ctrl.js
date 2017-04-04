(function () {
	"use strict";

	/**
	 * @name BU.business.controller : BU.businessListCtrl
	 * 사업관리 - 리스트
	 */
	angular.module("BU.business.controller")
		.controller("BU.businessListCtrl", ["$state", "$rootScope", "$scope", "uiGridConstants", "$http", "$q", "BU.businessListSvc", "SY.codeSvc", "SY.userListSvc", "SY.departSvc", "APP_CODE", "APP_CONFIG", "$window", "$timeout", "$modal", "resData", "UtilSvc", "APP_AUTH", "Page",
			function ($state, $rootScope, $scope, uiGridConstants, $http, $q, BuBusinessListSvc, SyCodeSvc, SyUserListSvc, SyDepartSvc, APP_CODE, APP_CONFIG, $window, $timeout, $modal, resData, UtilSvc, APP_AUTH, Page) {
				var page  = $scope.page = new Page({ auth: resData.access }),
					today = edt.getToday();

				var view, searchVO, tabVO, BSListVO, orderVO, salesVO;

				/**
				 * ------------------------------------------------------------------------------------------------------------------------------------------
				 * [ view ]
				 * @type {String} searchType 검색종류(기본검색-BS, 상세검색-DS)
				 * @type {String} tabType 탭종류(수주-ORDER, 매출-SALES)
				 * @type {String} message 검색결과 메세지
				 * @type {Object} code 공통으로 사용되는 코드
				 * @type {Object} user 공통으로 사용되는 유저정보
				 * @type {Function} initLoad 사업리스트 초기로드시 실행한다.
				 * -----------------------------------------------------------------------------------------------------------------------------------------*/
				view = $scope.view = {
					boxTitle	: "사업정보",
					searchType	: "BS",
					tabType		: "SALES",
					message		: "",

					/**
					 * @description 공통코드를 관리한다.
					 * @type {Array} seniorCodeList 상위부서리스트
					 * @type {Array} departCodeList 사업부리스트
					 * @type {Array} salesRepList 영업대표리스트
					 * @type {Array} businessCodeList 사업유형리스트
					 * @type {Array} productCodeList 제품유형리스트
					 * @type {Array} stateCodeList 진행상태리스트
					 * @type {Array} collectCodeList 수금상태리스트
					 */
					code: {
						seniorCodeList		: [],
						departCodeList		: [],
						salesRepList		: [],
						businessCodeList	: [],
						productCodeList		: [],
						stateCodeList		: [],
						collectCodeList		: [],

						/**
						 * @description 사업코드, 제품코드, 진행상태코드, 수금상태코드를 가져온다.
						 */
						getSearchCodeList: function ( callback, history ) {
							var self 	= this;

							$scope.$emit("event:autoLoader", false);

							$q.all([
								SyDepartSvc.getMngDepart(),
								SyCodeSvc.getSubcodeList( { cd: APP_CODE.business.cd, search: "all" } ),		// 사업코드
								SyCodeSvc.getSubcodeList( { cd: APP_CODE.product.cd, search: "all" } ),			// 제품코드
								SyCodeSvc.getSubcodeList( { cd: APP_CODE.orderStatus.cd, search: "all" } ),		// 진행상태코드
								SyCodeSvc.getSubcodeList( { cd: APP_CODE.collect.cd, search: "all" } )			// 수금상태코드
							]).then(function ( result ) {
								if (page.isAccessAll()) {
									result[0].data.unshift({ CD: 1, NAME: "전사" });
								}

								self.seniorCodeList 	= result[0].data;
								self.businessCodeList   = result[1].data;
								self.productCodeList 	= result[2].data;
								self.stateCodeList 		= result[3].data;
								self.collectCodeList 	= result[4].data;

								if ( angular.isFunction( callback ) )  {
									callback.call( searchVO, history );
								}
							});
						}
					}
				};

				/**
				 * @description 사업리스트화면 초기로드시 실행된다.
				 */
				view.initLoad = function () {
					var orderColumnInfo = UtilSvc.grid.getColumns(orderVO.gridInfo.type),
						salesColumnInfo = UtilSvc.grid.getColumns(salesVO.gridInfo.type),
						history = UtilSvc.grid.getInquiryParam();

					if (orderColumnInfo) {
						orderVO.gridInfo.showColumns = orderColumnInfo.showColumns;
						orderVO.gridInfo.hideColumns = orderColumnInfo.hideColumns;
						orderVO.gridOptions.columnDefs = UtilSvc.grid.getColumnDefs(orderVO.gridInfo);
					} else {
						orderVO.gridOptions.columnDefs = orderVO.gridInfo.columnDefs;
					}

					if ( salesColumnInfo ) {
						salesVO.gridInfo.showColumns = salesColumnInfo.showColumns;
						salesVO.gridInfo.hideColumns = salesColumnInfo.hideColumns;
						salesVO.gridOptions.columnDefs = UtilSvc.grid.getColumnDefs(salesVO.gridInfo);
					} else {
						salesVO.gridOptions.columnDefs = salesVO.gridInfo.columnDefs;
					}

					if (history) {
						this.code.getSearchCodeList(searchVO.doHistoryInquiry, history);
					} else {
						searchVO.getDeptAndResp();
						this.code.getSearchCodeList(searchVO.doInquiry);
					}
				};



				/**
				 * ------------------------------------------------------------------------------------------------------------------------------------------
				 * [ searchVO ]
				 * @description 검새조건을 관리한다.
				 * -----------------------------------------------------------------------------------------------------------------------------------------*/
				searchVO = $scope.searchVO = {
					boxTitle : "검색",
					flag			: "BS",     // 기본검색(BS), 상세검색(DS)
					isDetail        : false,    // 기본검색이면 fasle, 상세검색이면 true
					kind			: (page.isAccessAll()) ? 1 : page.user.deptCode,
					departList		: [],				// 사업부
					saleRepsList	: [],				// 영업대표
					customerCompany	: "",				// 고객사
					salesCompany	: "",				// 매출처
					businessName	: "",				// 사업명
					winrateList		: [],				// WINRATE
					ingStateList	: [],				// 진행상태
					duplicationYn	: "",				// 중복사업여부
					commitYn		: "",				// COMMIT여부
					sharedSalesYn	: false,			// 매출공유여부 (2015/07/06 추가)
					funnelKind		: "",				// FUNNEL 종류(이하 BELOW, 이상 ABOVE, 범위 SCOPE)
					funnelStartScale: "",				// 시작금액
					funnelEndScale	: "",				// 종료금액
					costKind		: "",				// COST 종류(이하 BELOW, 이상 ABOVE, 범위 SCOPE)
					costStartScale	: "",				// 시작금액
					costEndScale	: "",				// 종료금액
					marginKind		: "",				// MARGIN 종류(이하 BELOW, 이상 ABOVE, 범위 SCOPE)
					marginStartScale: "",				// 시작금액
					marginEndScale	: "",				// 종료금액
					businessTypeList: [],				// 사업유형
					productTypeList	: [],				// 제품유형
					periodKind		: "SALES",
					period: {
						type      : "current",
						startYear : today.y,
						startMonth: today.m,
						endYear   : today.y,
						endMonth  : today.m
					}
				};

				/**
				 * @description 검색조건을 초기화한다.
				 */
				searchVO.init = function () {
					this.kind				= (page.isAccessAll())  ? 1 : page.user.deptCode;
					this.departList			= [];				// 사업부
					this.saleRepsList		= [];				// 영업대표
					this.customerCompany	= "";				// 고객사
					this.salesCompany		= "";				// 매출처
					this.businessName		= "";				// 사업명
					this.winrateList		= [];				// WINRATE
					this.ingStateList		= [];				// 진행상태
					this.duplicationYn		= "";				// 중복사업여부
					this.commitYn			= "";				// COMMIT여부
					this.smtBilYn			= "";				// 계산서발행여부
					this.sharedSalesYn		= false;			// 매출공유여부 (2015/07/06 추가)
					this.funnelKind			= "";				// FUNNEL 종류(이하 BELOW; 이상 ABOVE; 범위 SCOPE)
					this.funnelStartScale	= "";				// 시작금액
					this.funnelEndScale		= "";				// 종료금액
					this.costKind			= "";				// COST 종류(이하 BELOW; 이상 ABOVE; 범위 SCOPE)
					this.costStartScale		= "";				// 시작금액
					this.costEndScale		= "";				// 종료금액
					this.marginKind			= "";				// MARGIN 종류(이하 BELOW; 이상 ABOVE; 범위 SCOPE)
					this.marginStartScale	= "";				// 시작금액
					this.marginEndScale		= "";				// 종료금액
					this.businessTypeList	= [];				// 사업유형
					this.productTypeList	= [];				// 제품유형
					this.periodKind			= "SALES";
					this.period             = {
						type      : "current",
						startYear : today.y,
						startMonth: today.m,
						endYear   : today.y,
						endMonth  : today.m
					};

					this.doInquiry();
				};

				/**
				 * @description 부서선택을 초기화한다.
				 */
				searchVO.initDept = function () {
					this.departList = [];
					this.getSalesUser();
				};

				/**
				 * @description 영업대표 선택을 초기화한다.
				 */
				searchVO.initSalesRep = function () {
					this.saleRepsList = [];
				};

				/**
				 * @description winrate 선택을 초기화한다.
				 */
				searchVO.initWinRate = function () {
					this.winrateList = [];
				};

				/**
				 * @description 진행상태 선택을 초기화한다.
				 */
				searchVO.initIngStatus = function () {
					this.ingStateList = [];
				};

				/**
				 * @description Funnel 검색조건을 초기화한다.
				 */
				searchVO.initFunnel = function ( kind ) {
					this.funnelKind	= kind || "";
					this.funnelStartScale = "";
					this.funnelEndScale	  = "";
				};

				/**
				 * @description Cost 검색조건을 초기화한다.
				 */
				searchVO.initCost = function ( kind ) {
					this.costKind = kind || "";
					this.costStartScale = "";
					this.costEndScale	= "";
				};

				/**
				 * @description Margin 검색조건을 초기화한다.
				 */
				searchVO.initMargin = function ( kind ) {
					this.marginKind = kind || "";
					this.marginStartScale = "";
					this.marginEndScale	  = "";
				};

				/**
				 * @description 사업유형 선택을 초기화한다.
				 */
				searchVO.initProjectType = function () {
					this.businessTypeList = [];
				};

				/**
				 * @description 제품유형 선택을 초기화한다.
				 */
				searchVO.initProductType = function () {
					this.productTypeList = [];
				};

				/**
				 * @description 기본검색, 상세검색 UI를 활성화 시킨다.
				 * @param {String} kind 활성화된 버튼(BS-basicSearch 또는 DS-detailSearch)
				 */
				searchVO.activeSearchBtn = function ( kind ) {
					view.searchType = kind;

					var btnList = $("#searchBtn button");
					btnList.each(function (idx, data) {
						$(data).removeClass();
					});
					if (kind === "BS") {
						$(btnList[0]).addClass("btn btn-info");
						$(btnList[1]).addClass("btn btn-default");
						this.isDetail = false;
					} else if (kind === "DS") {
						$(btnList[0]).addClass("btn btn-default");
						$(btnList[1]).addClass("btn btn-info");
						this.isDetail = true;
					}
					searchVO.flag = kind;
				};

				/**
				 * 소속부서와 영업대표를 가져오기 위한 parameter를 생성한다.
				 * @returns {{dept: ({mgr_cd}|{mgr_cd: string}), reps: string}}
				 */
				searchVO.createDeptAndRespCodeParam = function() {
					var me = this;
					return {
						dept: me.createDeptCodeParam(),
						resp: me.createRespCodeParam()
					};
				};

				/**
				 * 소속부서를 가져오기 위한 Parameter를 생성한다.
				 * @returns {{mgr_cd: string}}
				 */
				searchVO.createDeptCodeParam = function() {
					var me = this,
						mgrCode = me.kind ? ''+ me.kind : '1';

					return { mgr_cd: mgrCode };
				};

				/**
				 * 영업대표를 가져오기위한 Parameter를 생성한다.
				 * @returns {string}
				 */
				searchVO.createRespCodeParam = function() {
					var me = this,
						param;

					if (me.departList.length > 0) {
						param = edt.makeGetParam(me.departList, 'sel_dept');
					} else {
						param = me.kind ? 'sel_dept='+ me.kind : 'sel_dept=1';
					}

					return param;
				};

				/**
				 * 상위부서를 선택시 하위부서/팀 정보를 가져온다.
				 */
				searchVO.getDeptAndResp = function () {
					var me = this,
						param;

					me.departList 	= [];
					me.saleRepsList = [];

					param = me.createDeptAndRespCodeParam();

					$q.all([
						SyDepartSvc.getDepart(param.dept),			// 소속코드리스트
						SyUserListSvc.getUserSearchCode(param.resp) 	// 영업사원코드리스트
					]).then(function ( result ) {
						view.code.departCodeList   = result[0].data;
						view.code.salesRepList     = result[1].data;
					});
				};

				/**
				 * 영업대표정보를 가져온다.
				 */
				searchVO.getSalesUser = function () {
					var me = this,
						param = me.createRespCodeParam();

					me.saleRepsList = [];

					SyUserListSvc.getUserSearchCode(param).then(function (result) {
						view.code.salesRepList = result.data;
					});
				};

				/**
				 * @description 검색조건 parameter를 생성한다.
				 */
				searchVO.makeSearchParam = function () {
					var period = this.period,
						rtnParam = {
							flag    : this.flag,
							kind    : Number( this.kind),
							periodKind		: this.periodKind,
							periodType		: period.type,
							periodStartDate	: period.startYear 	+"-"+ period.startMonth +"-01",
							customerCompany	: (this.customerCompany === "") ? "all" : this.customerCompany,
							salesCompany	: (this.salesCompany === "") ? "all" : this.salesCompany,
							businessName	: (this.businessName === "") ? "all" : this.businessName,
							duplicationYn	: (!this.duplicationYn) ? null : "YES",
							commitYn		: (!this.commitYn) ? null : this.commitYn,
							bilYn			: (!this.smtBilYn) ? null : "YES"
						};

					// 매출공유여부 (2015/07/06 추가)
					if (this.sharedSalesYn) {
						rtnParam.sharedSalesYn = 'YES';
					}


					// 현재, 이전달, 다음달이면 종료일자를 보내지 않는다.
					if ( period.type!=="current" && period.type!=="previous" && period.type!=="next") {
						rtnParam.periodEndDate = period.endYear 		+"-"+ period.endMonth 	+"-01";
					}

					// 권한에 따른 상위부서
					//if (view.user.isAll) {
					//	rtnParam.kind = Number( this.kind );
					//} else {
					//	rtnParam.kind = 0;
					//}

					// 권한에 따른 소속
					rtnParam.departList = (this.departList.length === 0) ? null : this.departList.map(function (dept) { return ""+ dept; });

					//if ( view.user.isSubDept ) {
					//	rtnParam.departList = (this.departList.length === 0) ? null : this.departList.map(function (dept) { return ""+ dept; });
					//} else {
					//	rtnParam.departList = [ ""+ view.user.deptCode ];
					//}

					// 권한에 따른 영업대표
					rtnParam.saleRepsList = (this.saleRepsList.length === 0) ? null : this.saleRepsList;
					//if ( view.user.isSalesRep ) {
					//	rtnParam.saleRepsList = (this.saleRepsList.length === 0) ? null : this.saleRepsList;
					//} else {
					//	rtnParam.saleRepsList = [ view.user.id ];
					//}

					if ( this.flag === "DS" ) {
						rtnParam.winrateList		= (this.winrateList.length === 0) ? null : this.winrateList;
						rtnParam.ingStateList		= (this.ingStateList.length === 0) ? null : this.ingStateList;
						rtnParam.businessTypeList   = (this.businessTypeList.length === 0) ? null : this.businessTypeList;
						rtnParam.productTypeList	= (this.productTypeList.length === 0)	? null 	: this.productTypeList;

						var funnelKind 	= this.funnelKind,
							costKind		= this.costKind,
							marginKind	= this.marginKind;

						if ( funnelKind !== "" ) {
							rtnParam.funnelKind				= funnelKind;
							rtnParam.funnelStartScale = Number( this.funnelStartScale );
							rtnParam.funnelEndScale		= (funnelKind === "SCOPE") ? Number( this.funnelEndScale ) : 0;
						}

						if ( costKind !== "" ) {
							rtnParam.costKind 			= costKind;
							rtnParam.costStartScale = Number( this.costStartScale );
							rtnParam.costEndScale		= (costKind === "SCOPE") ? Number( this.costEndScale ) : 0;
						}

						if ( marginKind !== "" ) {
							rtnParam.marginKind 			= marginKind;
							rtnParam.marginStartScale = Number( searchVO.marginStartScale );
							rtnParam.marginEndScale		= (marginKind === "SCOPE") ? Number( this.marginEndScale ) : 0;
						}
					}

					return rtnParam;
				};


				/**
				 * 사업정보를 검색한다.
				 */
				searchVO.doInquiry = function () {
					var param 		= this.makeSearchParam(),
						currentTab 	= tabVO.current,
						type		= currentTab.toLowerCase();

					if ( currentTab === "ORDER" ) {
						BuBusinessListSvc.getList( type, param ).then(function ( result ) {
							$scope.$emit("event:autoLoader", true);

							var totalInfo = BuBusinessListSvc.getSumaryTotal( result.data),
								totalLength = result.data.length;

							orderVO.total = {
								tFunnel: totalInfo.tFunnel,
								tForecast: totalInfo.tForecast,
								tCommit: totalInfo.tCommit,
								tCost: totalInfo.tCost,
								tMargin: totalInfo.tMargin,
								tMarginRate: totalInfo.tMarginRate
							};

							param.currentTab = currentTab;
							param.userKind = searchVO.kind;
							UtilSvc.grid.setInquiryParam(param);

							angular.forEach(result.data, function ( data ) {
								data.subGridOptions = {
									columnDefs: [
										{name: "제품유형", field: "PRODUCT_TYPE_NAME", cellClass: "ta-c", width: "8%" },
										{name: "매출금액", field: "SALES", cellClass: "ta-r pr-15", cellFilter: "number", width: "10%" },
										{name: "매입금액", field: "BUY", cellClass: "ta-r pr-15", cellFilter: "number", width: "10%" },
										{name: "매입처", 	field: "CUST_NAME", cellClass: "ta-c", width: "10%" }
									],
									data: data.orderProduct
								};
							});

							orderVO.gridOptions.data = result.data;

							if ( totalLength > 0 ) {
								view.message = "총 "+ totalLength +"건이 검색되었습니다.";
							} else {
								view.message = "검색된 정보가 없습니다.";
							}
						});

					} else if ( currentTab === "SALES" ) {
						BuBusinessListSvc.getList( type, param ).then(function ( result ) {
							$scope.$emit("event:autoLoader", true);

							var totalInfo = BuBusinessListSvc.getSumaryTotal( result.data),
								totalLength = result.data.length;

							salesVO.total = {
								tFunnel: totalInfo.tFunnel,
								tForecast: totalInfo.tForecast,
								tCommit: totalInfo.tCommit,
								tBill: totalInfo.tBill,
								tCost: totalInfo.tCost,
								tMargin: totalInfo.tMargin,
								tMarginRate: totalInfo.tMarginRate
							};

							param.currentTab = currentTab;
							param.userKind = searchVO.kind;

							UtilSvc.grid.setInquiryParam(param);

							salesVO.gridOptions.data = result.data;

							if ( totalLength > 0 ) {
								view.message = "총 "+ totalLength +"건이 검색되었습니다.";
							} else {
								view.message = "검색된 정보가 없습니다.";
							}
						});
					}
				};

				/**
				 * @description 검색된 조건으로 다시 검색한다.
				 * @param {Object} history 검색된 조건
				 */
				searchVO.doHistoryInquiry = function (history) {
					var	splitStartDate, splitEndDate,
						deptParam = { mgr_cd: history.userKind ? (''+ history.userKind) : ('1') },
						respParam = '';

					if (history.departList && history.departList.length>0) {
						respParam = edt.makeGetParam(history.departList, 'sel_dept');
					} else {
						respParam = history.userKind ? 'sel_dept='+ history.userKind: 'sel_dept=1';
					}

					searchVO.activeSearchBtn(history.flag);
					searchVO.kind = history.userKind;

					$q.all([
						SyDepartSvc.getDepart(deptParam),
						SyUserListSvc.getUserSearchCode(respParam)
					]).then(function ( result ) {

						view.code.departCodeList = result[0].data;
						view.code.salesRepList = result[1].data;

						// 기간
						splitStartDate = history.periodStartDate.split( "-" );
						splitEndDate = ( history.periodEndDate ) ? history.periodEndDate.split( "-" ) : splitStartDate;

						searchVO.periodKind = history.periodKind;
						searchVO.period = {
							type: history.periodType,
							startYear : splitStartDate[0],
							startMonth: splitStartDate[1],
							endYear   : splitEndDate[0],
							endMonth  : splitEndDate[1]
						};

						// 고객사 & 매출처 & 사업명
						searchVO.customerCompany = ( history.customerCompany === "all" ) ? "" : history.customerCompany;
						searchVO.salesCompany = ( history.salesCompany === "all" ) ? "" : history.salesCompany;
						searchVO.businessName = ( history.businessName === "all" ) ? "" : history.businessName;

						// winrate & 중복사업 & commitYn & 매출공유
						searchVO.winrateList = ( history.winrateList ) ? history.winrateList : [];
						searchVO.duplicationYn = ( history.duplicationYn ) ? true : "";
						searchVO.commitYn = ( history.commitYn ) ? history.commitYn : "";
						searchVO.sharedSalesYn = ( history.sharedSalesYn ) ? true : "";

						// Funnel & Cost & Margin
						if ( history.funnelKind ) {
							searchVO.funnelKind = history.funnelKind;
							searchVO.funnelStartScale = history.funnelStartScale;
							searchVO.funnelEndScale = history.funnelEndScale;
						}
						if ( history.costKind ) {
							searchVO.costKind = history.costKind;
							searchVO.costStartScale = history.costStartScale;
							searchVO.costEndScale = history.costEndScale;
						}
						if ( history.marginKind ) {
							searchVO.marginKind = history.marginKind;
							searchVO.marginStartScale = history.marginStartScale;
							searchVO.marginEndScale = history.marginEndScale;
						}

						// 진행상태 & 사업유형 && 제품
						$timeout(function () {
							searchVO.departList = ( history.departList ) ? history.departList.map(function (dept) { return Number(dept); }) : [];
							searchVO.saleRepsList = ( history.saleRepsList ) ? history.saleRepsList : [];
							searchVO.ingStateList = ( history.ingStateList ) ? history.ingStateList : [];
							searchVO.businessTypeList = ( history.businessTypeList ) ? history.businessTypeList : [];
							searchVO.productTypeList = ( history.productTypeList ) ? history.productTypeList : [];

							tabVO.click( null, history.currentTab );
						});
					});
				};


				/**
				 * -------------------------------------------------------------------------------------------------------------------------
				 * [ tabVO ]
				 * @description 수주관리탭, 매출관리탭
				 * @constructor
				 * ------------------------------------------------------------------------------------------------------------------------*/
				tabVO = $scope.tabVO = {
					current: "SALES",
					tabList: [
						{id: "orderContent", name: "ORDER", title: "수주관리", active: false},
						{id: "salesContent", name: "SALES", title: "매출관리", active: true}
					]
				};

				// 탭버튼을 클릭했을 경우
				tabVO.click = function ( $event, name ) {
					var self = this;

					if ($event) { $event.preventDefault(); }

					view.tabType = name;
					tabVO.current = name;
					searchVO.periodKind = name;

					angular.forEach(self.tabList, function ( data ) {
						var elem = angular.element( edt.id( data.id ) );
						if ( data.name === name ) {
							data.active 	= true;
							elem.show();
						} else {
							data.active = false;
							elem.hide();
						}
					});

					searchVO.doInquiry();
				};


				/**
				 * -------------------------------------------------------------------------------------------------------------------------
				 * [ BSListVO ]
				 * @description 사업관리 리스트 공통모델
				 * @constructor
				 * ------------------------------------------------------------------------------------------------------------------------*/
				BSListVO = function () {};
				BSListVO.fn = BSListVO.prototype;

				/**
				 * @description 사업등록 페이지로 이동한다.
				 */
				BSListVO.fn.moveInsertPage = function () {
					$state.go('app.buBusiness', { kind: 'insert', menu: null, ids: null });
				};

				/**
				 * @description 사업상세 페이지로 이동한다.
				 */
				BSListVO.fn.moveDetailPage = function (rowInfo) {
					$state.go('app.buBusiness', { kind: 'detail', menu: null, ids: rowInfo.UNIQ_CD });
				};

				/**
				 * @description 검색된 사업리스트를 엑셀로 다운로드 받는다.
				 */
				BSListVO.fn.downloadExcel = function () {

					var	type  = tabVO.current.toLowerCase(),
						param = searchVO.makeSearchParam();

					BuBusinessListSvc.getDownloadFileName(type, param).then(function ( result ) {
						var hiddenA,
							elem = edt.id("excelDownload");

						if (elem) {
							hiddenA = document.createElement( "a" );
						} else {
							hiddenA = document.createElement( "a" );
						}

						hiddenA.setAttribute("id", "excelDownload" );
						hiddenA.setAttribute("class", "throw" );
						hiddenA.setAttribute("href", APP_CONFIG.domain +"/order/exceldown?filename="+ result.data );

						var agt = navigator.userAgent.toLowerCase();

						if(agt.indexOf("msie")!== -1 || agt.indexOf("mozilla") !== -1 ){
							var div = angular.element(document.getElementsByClassName("grid-export"));
							angular.element(div);
							div.append(hiddenA);
							document.getElementById("excelDownload").click();
							angular.element(document.getElementsByClassName("throw")).remove();
						}else{
							hiddenA.click();
						}
					});
				};

				/**
				 * @description Field를 설정하기 위한 모달창을 연다.
				 */
				BSListVO.fn.modalSetField = function () {
					var self = this,
						modalInstance = $modal.open({
							templateUrl : "app/shared/modal/selectColumns/modal.selectColumns.tpl.html",
							controller  : "modal.selectColumnsCtrl",
							resolve		: {
								revColumns : function () {

									return self.gridInfo;
								}
							}
						});

					modalInstance.result.then(function (result) {
						self.gridInfo.showColumns = result.showColumns;
						self.gridInfo.hideColumns = result.hideColumns;
						self.gridOptions.columnDefs = UtilSvc.grid.getColumnDefs(self.gridInfo);

						UtilSvc.grid.setColumns(result, self.gridInfo.type);
					});
				};



				/**
				 * -------------------------------------------------------------------------------------------------------------------------
				 * [ orderVO ]
				 * @description 수주정보
				 * @constructor
				 * ------------------------------------------------------------------------------------------------------------------------*/
				orderVO = $scope.orderVO = edt.create( BSListVO.prototype, {
					exportFileNm 	: today.y +""+ today.m +""+ today.d +"_ORDER",			// CSV 파일이름
					gridApi	: "",
					total			: null,
					gridInfo		: {
						type: "Order",
						columnDefs: [
							{displayName: "FILE_YN", field: "FILE_YN", cellClass: "ta-c"},
							{displayName: "사업명",	field: "PROJECT_NAME",  aggregationType: uiGridConstants.aggregationTypes.count },
							{displayName: "고객사", 	field: "CUSTOMER_NAME", cellClass: "ta-c"},
							{displayName: "사업유형", field: "TYPE_NAME", cellCalss: "ta-c" },
							{
								displayName : "Funnel",
								field		: "t_SALES",
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Winrate",
								field		: "WINRATE",
								cellClass	: "ta-c",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.avg,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{col.getAggregationValue() | percent}}</div></div>"
							},
							{
								displayName	: "Forecast",
								field		: "t_FORCAST",
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Commit",
								field		: "t_COMMIT",
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Cost",
								field		: "t_BUY",
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Margin",
								field		: "t_MARGIN",
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"},
							{
								displayName	: "Margin Rate",
								field		: "t_MARGINRATE",
								cellClass	: "ta-c",
								aggregationType		: uiGridConstants.aggregationTypes.avg,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\"></div></div>"
							},
							{displayName: "수주년월", field: "ORDER_D", cellClass: "ta-c"},
							{displayName: "진행상태", field: "STATUS_NAME", cellClass: "ta-c"},
							{displayName: "CommitYn", field: "COMMIT_STATUS", cellClass: "ta-c"},
							{displayName: "영업대표", field: "OWN_EMP_NAME", cellClass: "ta-c"},
							{displayName: "부서", field: "OWN_EMP_DEPT_NAME", cellClass: "ta-c"},
							{displayName: "매출처", field: "SALES_NAME", cellClass: "ta-c pr-15"}
						],
						showColumns 	: [
							{ title: "FILE_YN", field: "FILE_YN" },
							{ title: "사업명", field: "PROJECT_NAME" },
							{ title: "고객사", field: "CUSTOMER_NAME" },
							{ title: "사업유형", field: "TYPE_NAME" },
							{ title: "Funnel", field: "t_SALES" },
							{ title: "WinRate", field: "WINRATE" },
							{ title: "Forecast", field: "t_FORCAST" },
							{ title: "Commit", field: "t_COMMIT" },
							{ title: "Cost", field: "t_BUY" },
							{ title: "Margin", field: "t_MARGIN" },
							{ title: "MarginRate", field: "t_MARGINRATE" },
							{ title: "수주년월", field: "ORDER_D" },
							{ title: "진행상태", field: "STATUS_NAME" },
							{ title: "CommitYn", field: "COMMIT_STATUS" },
							{ title: "영업대표", field: "OWN_EMP_NAME" },
							{ title: "부서", field: "OWN_EMP_DEPT_NAME" },
							{ title: "매출처", field: "SALES_NAME" }
						],
						hideColumns		: []
					}
				});

				orderVO.originalGridInfo = edt.extend( orderVO.gridInfo, {} );

				// 그리드 옵션 설정
				orderVO.gridOptions = {
					expandableRowTemplate: "expandableRow.tpl.html",
					expandableRowHeight: 150,
					expandableRowScope: {
						subGridVariable: "subGridScopeVariable"
					},

					// Angulr Grid
					data: [],
					showColumnFooter: true,
					enableColumnResizing : true,
					rowTemplate	: "<div ng-dblclick=\"grid.appScope.orderVO.moveDetailPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>",
					columnDefs	: []
				};


				/**
				 * -------------------------------------------------------------------------------------------------------------------------
				 * [ salesVO ]
				 * @description 매출정보
				 * @constructor
				 * ------------------------------------------------------------------------------------------------------------------------*/
				salesVO = $scope.salesVO = edt.create( BSListVO.prototype, {
					exportFileNm:	today.y +""+ today.m +""+ today.d +"_SALES",			// CSV 파일이름
					gridApi		: "",
					total		: null,
					gridInfo	: {
						type: "Sales",
						columnDefs: [
							{displayName: "FILE_YN", field: "FILE_YN", width: 80, cellClass: "ta-c"},
							{displayName: "사업명", field: "PROJECT_NAME", width: 200 },
							{displayName: "고객사", field: "CUSTOMER_NAME", width: 150 },
							{displayName: "사업유형", field: "TYPE_NAME", width: 80, cellClass: "ta-c" },
							{
								displayName	: "매출금액",
								field		: "t_SALES",
								width: 150,
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Winrate",
								field		: "WINRATE",
								width: 80,
								cellClass	: "ta-c",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.avg,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\">{{col.getAggregationValue() | percent}}</div></div>"
							},
							{
								displayName	: "매출Forecast",
								field		: "t_FORCAST",
								width: 150,
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Commit",
								field		: "t_COMMIT",
								width: 150,
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{displayName: "계산서발행", field: "CD_SMR_BIL", width: 80, cellClass: "ta-c"},
							{
								displayName	: "매입금액",
								field		: "t_BUY",
								width: 150,
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Margin",
								field		: "t_MARGIN",
								width: 150,
								cellClass	: "ta-r pr-15",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.sum,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-r pr-15\">{{col.getAggregationValue() | number}}</div></div>"
							},
							{
								displayName	: "Margin Rate",
								field		: "t_MARGINRATE",
								width: 80,
								cellClass	: "ta-c",
								cellFilter	: "number",
								aggregationType		: uiGridConstants.aggregationTypes.avg,
								aggregationHideLabel: true,
								footerCellTemplate	: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div class=\"ta-c\"></div></div>"
							},
							{displayName: "수주년월", field: "ORDER_D", width: 100, cellClass: "ta-c"},
							{displayName: "매출년월", field: "r_SALES_D", width: 100, cellClass: "ta-c"},
							{displayName: "수금년월", field: "r_COLLECT_D", width: 100, cellClass: "ta-c"},
							{displayName: "수금상태", field: "r_COLLECT_STATUS_NAME", width: 80, cellClass: "ta-c"},
							{displayName: "진행상태", field: "STATUS_NAME", width: 80, cellClass: "ta-c"},
							{displayName: "영업대표", field: "OWN_EMP_NAME", width: 80, cellClass: "ta-c"},
							{displayName: "부서", field: "OWN_EMP_DEPT_NAME", width: 120, cellClass: "ta-c"},
							{displayName: "매출처", field: "SALES_NAME", width: 150, cellClass: "ta-c pr-15"}
						],
						showColumns 	: [
							{ title: "FILE_YN", field: "FILE_YN" },
							{ title: "사업명", field: "PROJECT_NAME" },
							{ title: "고객사", field: "CUSTOMER_NAME" },
							{ title: "사업유형", field: "TYPE_NAME" },
							{ title: "매출금액", field: "t_SALES" },
							{ title: "WinRate", field: "WINRATE" },
							{ title: "매출Forecast", field: "t_FORCAST" },
							{ title: "Commit", field: "t_COMMIT" },
							{ title: "계산서발행", field: "CD_SMR_BIL" },
							{ title: "매입금액", field: "t_BUY" },
							{ title: "Margin", field: "t_MARGIN" },
							{ title: "MarginRate", field: "t_MARGINRATE" },
							{ title: "수주년월", field: "ORDER_D" },
							{ title: "매출년월", field: "r_SALES_D" },
							{ title: "수금년월", field: "r_COLLECT_D" },
							{ title: "수금상태", field: "r_COLLECT_STATUS_NAME" },
							{ title: "진행상태", field: "STATUS_NAME" },
							{ title: "영업대표", field: "OWN_EMP_NAME" },
							{ title: "부서", field: "OWN_EMP_DEPT_NAME" },
							{ title: "매출처", field: "SALES_NAME" }
						],
						hideColumns		: []
					}
				});

				salesVO.originalGridInfo = edt.extend( salesVO.gridInfo, {} );

				// 그리드 옵션
				salesVO.gridOptions = {
					data : [],
					showColumnFooter: true,
					enableColumnResizing : true,
					rowTemplate	: "<div ng-dblclick=\"grid.appScope.salesVO.moveDetailPage(row.entity)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>",
					columnDefs	: []
				};

				// Init Load
				view.initLoad();
			}]);

}());
