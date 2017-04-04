(function ( angular ) {
	"use strict";

	function AimSalesVO ($q, BuAimSalesMngSvc) {
		/**
		 * @name AimSales
		 * @description
		 * 목표매출 Depart
		 *
		 * @param {object} data
		 * @param {object=} option
		 * @constructor
		 */
		function AimSales(data, option) {
			var me = this;

			me.entity = data;
			me.option = option || {};
			me.enableWrite  = false;
			me.state = {
				write   : false,
				inserted: data.SALES_FLAG === 'Y'
			};
			me.cache = null;
			me.keys = {
				sales   : ["SALES_1", "SALES_2", "SALES_3", "SALES_4", "SALES_5", "SALES_6", "SALES_7", "SALES_8", "SALES_9", "SALES_10", "SALES_11", "SALES_12"],
				margin  : ["MARGIN_1", "MARGIN_2", "MARGIN_3", "MARGIN_4", "MARGIN_5", "MARGIN_6", "MARGIN_7", "MARGIN_8", "MARGIN_9", "MARGIN_10", "MARGIN_11", "MARGIN_12"]
			};
			me.year         = data.SALES_YYYY;
			me.userName     = data.NM_EMP;
			me.userId       = data.NO_EMP;
			me.departCode   = data.CD_DEPT;
			me.departName   = data.NM_DEPT;
			me.workGroupCode= data.cd_WK_GRP;

			me.margin   = {};
			me.sales    = {};
			me.total    = {};

			me.preprocess();
		}

		AimSales.prototype = {
			/**
			 * @name AimSales.preprocess
			 * @kind function
			 * @description
			 * 생성자 호출시 데이터와 설정값을 세팅한다.
			 */
			preprocess: function() {
				var me = this,
					option  = me.option,
					data    = me.createCompositeData(me.entity);

				me.setOptions(option);

				me.sales    = data.sales;
				me.margin   = data.margin;
				me.total    = data.total;
			},
			/**
			 * @name AimSales.setOptions
			 * @kind function
			 * @description
			 * 옵션을 세팅한다.
			 *
			 * @param {object} option
			 */
			setOptions: function(option) {
				var me = this;
				me.enableWrite = option.enableWrite === undefined ? false : option.enableWrite;
			},
			/**
			 * @name AimSales.createCompositeData
			 * @kind function
			 * @description
			 * data를 가공한다.
			 *
			 * @param {object} entity - data
			 */
			createCompositeData: function(entity) {
				var me = this,
					sales = {
						month   : [],
						quarter : []
					},
					margin = {
						month   : [],
						quarter : []
					},
					total = {
						sales   : 0,
						margin  : 0
					},
					quarter = 0;

				me.keys.sales.forEach(function(key, idx) {
					var value = entity[key];
					sales.month.push({
						displayName : '매출 '+ edt.fillSpace(idx+1) +'월',
						key         : key,
						value       : value
					});

					total.sales     += value;
					quarter         += value;

					if ((idx+1)%3 === 0) {
						sales.quarter.push({
							key   : ''+ (idx+1)/3 + 1,
							value : quarter
						});
						quarter = 0;
					}
				});

				me.keys.margin.forEach(function(key, idx) {
					var value = entity[key];
					margin.month.push({
						displayName : '마진 '+ edt.fillSpace(idx+1) +'월',
						key         : key,
						value       : value
					});

					total.margin    += value;
					quarter         += value;

					if ((idx+1)%3 === 0) {
						margin.quarter.push({
							key   : ''+ (idx+1)/3 + 1,
							value : quarter
						});
						quarter = 0;
					}
				});

				return {
					sales   : sales,
					margin  : margin,
					total   : total
				};
			},
			/**
			 * @name AimSales.isEnableWrite
			 * @kind function
			 * @description
			 * Write권한이 있는지 판단한다.
			 *
			 * @returns {boolean}
			 */
			isEnableWrite: function() {
				return this.enableWrite;
			},
			/**
			 * @name AimSales.isStateWrite
			 * @kind function
			 * @description
			 * 수정상태인지 판단한다.
			 *
			 * @returns {boolean}
			 */
			isStateWrite: function() {
				return this.state.write;
			},
			/**
			 * @name AimSales.isInserted
			 * @kind function
			 * @description
			 * 등록된 적이 있는지 판단한다.
			 *
			 * @returns {boolean}
			 */
			isInserted: function() {
				return this.state.inserted;
			},
			/**
			 * @name AimSales.write
			 * @kind function
			 * @description
			 * 등록 또는 수정 버튼 동작
			 * 롤백을 위하여 클릭시 이전 데이터를 캐시한다.
			 *
			 * @returns {boolean}
			 */
			write: function() {
				var me = this;
				me.cache = {
					sales : angular.copy(me.sales.month, []),
					margin: angular.copy(me.margin.month, [])
				};

				me.state.write = true;
			},
			/**
			 * @name AimSales.cancel
			 * @kind function
			 * @description
			 * 취소버튼 동작
			 * 데이터를 롤백시킨다.
			 *
			 * @returns {boolean}
			 */
			cancel: function() {
				var me = this;
				me.sales.month  = me.cache.sales;
				me.margin.month = me.cache.margin;
				me.cache = null;

				me.state.write = false;
			},
			/**
			 * @name AimSales.save
			 * @kind function
			 * @description
			 * 저장버튼 동작
			 * 데이터를 저장한다.
			 *
			 * @returns {boolean}
			 */
			save: function() {
				var me = this,
					deferred= $q.defer(),
					method  = me.isInserted() ? "PUT" : "POST",
					type    = me.userId ? "EMPL" : "DEPT",
					valid   = me.isValid();

				if (!valid.valid) {
					alert(valid.message);
					deferred.reject();
				}
				else {
					BuAimSalesMngSvc.save(type, method, me.getSaveParam()).success(function (data, status, headers, config) {
						me.state.write      = false;
						me.state.inserted   = true;
						deferred.resolve();
					});
				}



				//if (me.user.id) {
				//	return BuAimSalesMngSvc.save(type, method, me._getSaveParam()).success(function (data, status, headers, config) {
				//		me.state.write = false;
				//		me.state.inserted = true;
				//		me.calculateTotal();
				//		alert("저장되었습니다.");
				//	});
				//} else {
				//	return BuAimSalesMngSvc.save(type, method, me._getSaveParam()).success(function (data, status, headers, config) {
				//		me.state.write = false;
				//		me.state.inserted = true;
				//		me.calculateTotal();
				//	});
				//}

				return deferred.promise;
			},

			getSaveParam: function() {
				var me = this,
					removeReg = /,/g,
					param = {
						SALES_YYYY: me.year
					};

				me.sales.month.forEach(function (month, idx) {
					param[me.keys.sales[idx]] = (''+ month.value).replace(removeReg, '') * 1;
				});

				me.margin.month.forEach(function (month, idx) {
					param[me.keys.margin[idx]] =(''+ month.value).replace(removeReg, '') * 1;
				});

				if (me.userId) {
					param.NO_EMP = me.userId;
				}
				else {
					param.CD_DEPT = me.departCode;
				}

				return param;
			},

			isValid: function() {
				var me = this,
					removeReg = /,/g,
					aimDataList = me.margin.month.concat(me.sales.month),
					result = {
						valid   : true,
						message : '[PASS] 유효한 데이터입니다.'
					},
					i, lng, o, value;

				for (i=0, lng=aimDataList.length; i<lng; i++) {
					o = aimDataList[i];
					value = ''+ o.value;

					if (value.length > 14) {
						return {
							valid   : false,
							message : '[길이] '+ o.displayName +' 유효하지 않은 길이입니다. 11자리 이하, \',\' 포함 14자리 이하로 입력해주세요.'
						};
					}

					if (typeof (value.replace(removeReg) * 1) !== 'number') {
						return {
							valid   : false,
							message : '[형식] '+ o.displayName +'유효하지 않은 형식입니다. 숫자만 입력해주세요.'
						};
					}
				}

				return result;
			},

			calculateTotal: function() {
				var me  = this,
					sales   = me.sales,
					margin  = me.margin,
					quarter = 0,
					total = {
						sales: 0,
						margin: 0
					};





				sales.month.forEach(function (month, idx) {
					total.sales += month.value;
					quarter +=  month.value;

					if ((idx+1)%3 === 0) {
						sales.quarter[(idx+1)/3 -1].value = quarter;
						quarter = 0;
					}
				});

				margin.month.forEach(function (month, idx) {
					total.margin += month.value;
					quarter +=  month.value;

					if ((idx+1)%3 === 0) {
						margin.quarter[(idx+1)/3 -1].value = quarter;
						quarter = 0;
					}
				});

				sales.total = total.sales;
				margin.total = total.margin;
			}
		};

		return AimSales;
	}

	AimSalesVO.$inject = ['$q', 'BU.aimSalesMngSvc'];


	angular
		.module('BU.aimSalesMng.model')
		.factory('AimSales', AimSalesVO);


}( angular ));
