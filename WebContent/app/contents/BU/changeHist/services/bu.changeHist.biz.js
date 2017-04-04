(function () {
	"use strict";

	function BuChangeHistBiz ($q, SyDepartSvc, SyUserListSvc, UtilSvc, BuChangeHistSvc, ModalSvc, $timeout) {

		var dtStandardCache = null;	// 기준날짜 캐시

		return {
			/**
			 * @name BuChangeHistBiz.setStorageSearchParam
			 * @kind function
			 * @description
			 * 세션스토리에 있는 검색조건을 SearchVO에 할당한다.
			 *
			 * @param {searchVO} search - 검색 객체
			 */
			setStorageSearchParam: function(search) {
				var me = this,
					param = UtilSvc.grid.getInquiryParam();

				if (param) {
					angular.extend(search, param);
					me.setDtStandardCache(UtilSvc.findWhere(search.dtStandard.buttonList, { code: search.dtStandard.selected })[0]);
				} else {
					search.clickDtStandard(search.dtStandard.buttonList[0]);
				}
			},
			/**
			 * @name BuChangeHistBiz.setStorageColumnsConfig
			 * @kind function
			 * @description
			 * 세션스토리에 있는 검색조건을 SearchVO에 할당한다.
			 *
			 * @param {object} items - 변경이력 객체(vm.hist.items)
			 */
			setStorageColumnsConfig: function(items) {
				var column = UtilSvc.grid.getColumns();
				if (column) {
					items.column.showColumns    = column.showColumns;
					items.column.hideColumns    = column.hideColumns;
					items.grid.columnDefs       = UtilSvc.grid.getColumnDefs(items.column);
				} else {
					UtilSvc.grid.initColumnSetting(items);
				}
			},
			/**
			 * @name BuChangeHistBiz.getCodeData
			 * @kind function
			 * @description
			 * 변경이력에 사용되는 코드를 가져온다.
			 *
			 * @param {vm.search} search - search 객체
			 * @returns {Promise}
			 */
			getCodeData: function(search) {
				var me = this,
					param = me.createDeptAndRespCodeParam(search);

				return $q.all([
					SyDepartSvc.getMngDepart(),
					SyDepartSvc.getDepart(param.dept),
					SyUserListSvc.getUserSearchCode(param.resp)
				]);
			},
			/**
			 * @name BuChangeHistBiz.createDeptAndRespCodeParam
			 * @kind function
			 * @description
			 * 소속부서와 영업대표를 가져오기 위한 parameter를 생성한다.
			 *
			 * @param {vm.search} search - search 객체
			 * @returns {{mngDept: {wk_grp: number}, dept: (*|{mgr_cd}|{mgr_cd: string}), resp: (*|string)}}
			 */
			createDeptAndRespCodeParam: function(search) {
				var me = this;
				return {
					mngDept : { wk_grp: 2 },
					dept    : me.createDeptCodeParam(search),
					resp    : me.createRespCodeParam(search)
				};
			},
			/**
			 * @name BuChangeHistBiz.createDeptCodeParam
			 * @kind function
			 * @description
			 * 소속부서를 가져오기 위한 Parameter를 생성한다.
			 *
			 * @param {vm.search} search - search 객체
			 * @returns {{mgr_cd: string}}
			 */
			createDeptCodeParam: function(search) {
				var mgrCode = search.kind ? ''+ search.kind : '1';
				return { mgr_cd: mgrCode };
			},
			/**
			 * @name BuChangeHistBiz.createRespCodeParam
			 * @kind function
			 * @description
			 * 영업대표를 가져오기위한 Parameter를 생성한다.
			 *
			 * @param {vm.search} search - search 객체
			 * @returns {string}
			 */
			createRespCodeParam: function(search) {
				var param;

				if (search.departList.length > 0) {
					param = edt.makeGetParam(search.departList, 'sel_dept');
				} else {
					param = search.kind ? 'sel_dept='+ search.kind : 'sel_dept=1';
				}

				return param;
			},
			/**
			 * @name BuChangeHistBiz.clickDtStandard
			 * @kind function
			 * @description
			 * 기준날짜 선택 버튼이 변경 되었을 때 예상기준날짜와 실제결과날짜, 그리고 옵션값을 세팅한다.
			 *
			 * @param {object} dtStandard - 변경구간객체(vm.search.dtStandard)
			 */
			clickDtStandard: function (dtStandard) {
				var me = this,
					selectedBtn = UtilSvc.findWhere(dtStandard.buttonList, { code: dtStandard.selected })[0],
					changeDt,
					splitList;

				if (selectedBtn !== dtStandardCache) {
					selectedBtn.active = true;

					if (dtStandardCache) {
						me.setDtStandardCache(selectedBtn);
					}
					else {
						dtStandardCache = selectedBtn;
					}

					switch (dtStandard.selected) {
						case "prevWeek1":
							changeDt = edt.getPrevDate(dtStandard.today,  7);
							dtStandard.reality.value = dtStandard.today;
							break;
						case "prevWeek2":
							changeDt = edt.getPrevDate(dtStandard.today, 14);
							dtStandard.reality.value = dtStandard.today;
							break;
						case "prevWeek3":
							changeDt = edt.getPrevDate(dtStandard.today, 21);
							dtStandard.reality.value = dtStandard.today;
							break;
						case "prevWeek4":
							changeDt = edt.getPrevDate(dtStandard.today, 28);
							dtStandard.reality.value = dtStandard.today;
							break;
						default:
							splitList = dtStandard.expect.value.split("-");
							changeDt = { y: splitList[0], m: splitList[1], d: splitList[2] };
							break;
					}
					dtStandard.expect.value = [changeDt.y, changeDt.m, changeDt.d].join("-");
				}
			},
			/**
			 * @name BuChangeHistBiz.setDtStandardCache
			 * @kind function
			 * @description
			 * 캐시된 기준날짜 버튼을 해제하고, 선택된 버튼을 캐시한다.
			 *
			 * @param {object} selectedBtn
			 */
			setDtStandardCache: function (selectedBtn) {
				if (dtStandardCache) { dtStandardCache.active = false; }
				dtStandardCache = selectedBtn;
			},
			/**
			 * @name BuChangeHistBiz.getInquiryParam
			 * @kind function
			 * @description
			 * 검색조건 파라미터를 가져온다.
			 *
			 * @param {vm.search} search search - search 정보
			 * @returns {{valid:boolean, message:string, data:object}}
			 */
			getInquiryParam: function (search) {
				var me = this,
					period = search.dtPeriod.period,
					param = {
						KIND	    : search.kind,
						DEPT	    : search.departList && search.departList.length>0 ? search.departList : null,
						NO_EMP	    : search.saleRepsList && search.saleRepsList.length>0 ? search.saleRepsList : null,
						FD_STRT_PER : search.dtStandard.expect.value,	// 기준날짜(예상기준날짜)
						AD_END_PER	: search.dtStandard.reality.value,	// 기준날짜(실제결과날짜
						REV_STRT_PER: [period.start.y, period.start.m, period.start.d].join('-'),	// 기간(시작일자)
						REV_END_PER	: [period.end.y, period.end.m, period.end.d].join('-')
					},
					result = me.validParam(param);

				result.data = param;

				return result;
			},
			/**
			 * @name BuChangeHistBiz.validParam
			 * @description
			 * 검색 조건 유효성을 체크한다.
			 *
			 * @param {object} param - 검색 parameter
			 * @returns {{valid:boolean, message:string}}}
			 */
			validParam: function (param) {
				// 기준날짜(예상기준날짜)
				if (!moment(param.FD_STRT_PER, "YYYY-MM-DD", true).isValid()) {
					return {
						valid: false,
						message: "예상기준날짜(FSD) 포멧('2015-10-19')이 유효하지 않습니다."
					};
				}
				// 기준날짜(실제결과날짜)
				if (!moment(param.AD_END_PER, "YYYY-MM-DD", true).isValid()) {
					return {
						valid: false,
						message: "실제결과날짜(RRD) 포멧('2015-10-19')이 유효하지 않습니다."
					};
				}
				// 기준날짜 기간 유효성
				if ((new Date(param.AD_END_PER) - new Date(param.FD_STRT_PER)) < 0) {
					return {
						valid: false,
						message: "기준날짜 기간이 유효하지 않습니다."
					};
				}
				// 기간(시작일자)
				if (!moment(param.REV_STRT_PER, "YYYY-MM-DD", true).isValid()) {
					return {
						valid: false,
						message: "기간-시작일자 포멧('2015-10-19')이 유효하지 않습니다."
					};
				}
				// 기간(종료일자)
				if (!moment(param.REV_END_PER, "YYYY-MM-DD", true).isValid()) {
					return {
						valid: false,
						message: "기간-종료일자 포멧('2015-10-19')이 유효하지 않습니다."
					};
				}
				// 기준날짜 기간 유효성
				if ((new Date(param.REV_END_PER) - new Date(param.REV_STRT_PER)) < 0) {
					return {
						valid: false,
						message: "조회 기간이 유효하지 않습니다."
					};
				}

				return {
					valid: true,
					message: "검색조건이 유효합니다."
				};
			},
			/**
			 * @name BuChangeHistBiz.setChangeHistData
			 * @description
			 * 검색 조건과 데이터를 셋한다.
			 *
			 * @param {object} search - 검색 객체
			 * @param {object} hist  - 변경이력 객체(vm.hist)
			 * @param {object} data - 변경이력 조회결과
			 */
			setChangeHistData: function (search, hist, data) {
				UtilSvc.grid.setInquiryParam({
					kind        : search.kind,
					departList  : search.departList,
					saleRepsList: search.saleRepsList,
					dtStandard  : search.dtStandard,
					dtPeriod    : search.dtPeriod
				});

				hist.summary		        = data.summary;
				hist.items.total		    = data.compareChange.length;
				hist.items.grid.originData  = data.compareChange;
				hist.items.grid.data        = data.compareChange;
			},
			/**
			 * @name BuChangeHistBiz.modalSetColumn
			 * @description
			 * 모달팝업을 띄어 그리그 컬럼을 설정한다.
			 *
			 * @param {object} histItems - 그리드 모델(vm.hist.items)
			 */
			modalSetColumn: function (histItems) {
				var column  = histItems.column,
					grid    = histItems.grid,
					modalInstance = ModalSvc.openSetColumn({
						resolve : { revColumns : function () { return column; } }
					});

				modalInstance.result.then(function (res) {
					column.showColumns  = res.showColumns;
					column.hideColumns  = res.hideColumns;
					grid.columnDefs     = UtilSvc.grid.getColumnDefs(column);

					UtilSvc.grid.setColumns(res);
				});
			},
			/**
			 * @name BuChangeHistBiz.modalSetColumn
			 * @description
			 * 조회된 정보를 Excel 파일로 다운로드한다.
			 */
			downloadExcel: function () {
				var me = this,
					param = me.getInquiryParam(UtilSvc.grid.getInquiryParam());

				BuChangeHistSvc.downloadExcel(param.data).then(function (res) {
					UtilSvc.download.excel(res.data.result);
				});
			},
			/**
			 * @name BuChangeHistBiz.toggleChangeField
			 * @kind function
			 * @description
			 * 선택된 변경필드가 변경되었을 시 필드와 일치하는 데이터를 가져온다.
			 *
			 * @param {object} items - 변경이력 정보(vm.hist.items)
			 * @param {object} selectedField - 선택된 필드
			 */
			toggleChangeField: function (items, selectedField) {
				var self = this,
					fieldCode = selectedField.code,
					allField  = items.filter.fields[0],
					restField = items.filter.fields.slice(1),
					cdSelectedField     = [],
					cntSelectedField    = 0;

				switch (fieldCode) {
					case "ALL":
						angular.forEach(restField, function (field) {
							field.checked = selectedField.checked;
						});

						break;
					default:
						angular.forEach(restField, function (field) {
							if (field.checked) { cntSelectedField += 1; }
						});
						allField.checked = (restField.length === cntSelectedField);
						break;
				}

				angular.forEach(restField, function (field) {
					if (field.checked) { cdSelectedField.push(field.code); }
				});

				items.grid.data = self.filterStatus(items.grid.originData, cdSelectedField);
				items.total     = items.grid.data.length;
			},
			/**
			 * @name BuChangeHistBiz.filterStatus
			 * @kind function
			 * @description
			 * 변경 STATUS_FALG 코드에 따라 필터링한다.
			 *
			 * @param {Array} data grid data
			 * @param {Array.<string>} selectedField 조건
			 * @returns {Array}
			 */
			filterStatus: function (data, selectedField) {
				var filterData = [];

				data.forEach(function (field) {
					var i, j, lng1, lng2, dataCodeList;
					if (field.STATUS_FLAG.indexOf("/") > 0) {
						dataCodeList = field.STATUS_FLAG.split("/");
						Loop: for (i=0, lng1=dataCodeList.length; i<lng1; i+=1) {
							for (j=0, lng2=selectedField.length; j<lng2; j+=1) {
								if (dataCodeList[i] === selectedField[j]) {
									filterData.push(field);
									break Loop;
								}
							}
						}

					} else {
						for (j=0, lng2=selectedField.length; j<lng2; j+=1) {
							if (field.STATUS_FLAG === selectedField[j]) {
								filterData.push(field);
								break;
							}
						}
					}

				});

				return filterData;
			}
		};
	}

	BuChangeHistBiz.$inject = ["$q", "SY.departSvc", "SY.userListSvc", "UtilSvc", "BU.changeHistSvc", "ModalSvc", "$timeout"];


	angular.module("BU.changeHist.service")
		.factory("BU.changeHistBiz", BuChangeHistBiz);
}());