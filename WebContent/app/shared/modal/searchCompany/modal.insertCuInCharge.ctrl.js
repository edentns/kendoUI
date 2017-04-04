(function () {
    "use strict";

  /**
   * @ngdoc function
   * @name
   * modal - 고객사 심플 등록
   */
  angular.module("edtApp.common.modal")
      .controller("modal.insertCuInChargeCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "$sce", "$filter", "CU.chargeInfoSvc", "APP_MSG", "APP_CODE", "no_cust", "disabled_no_cust", "upInstance",
          function ($scope, $modal, $modalInstance, ngTableParams, $sce, $filter, CuChargeInfoSvc, APP_MSG, APP_CODE, no_cust, disabled_no_cust, upInstance) {

            var insertVO;

            /**
             * ===================================================
             * 모달 고객사 등록을 관리한다.
             * ===================================================
             */
            insertVO = $scope.insertVO = {
                NO_CUST      : {VALUE: no_cust.VALUE, NAME: no_cust.NAME}, // 고객사명
                NM_IN_CHARGE : {VALUE: ""          }, // 담당부서
                NO_MOBILE    : {VALUE: ""          }, // 연락처
                NO_EMAIL     : {VALUE: ""          }, // 이메일
				disabled: disabled_no_cust
            };

            /**
             * 담당자 등록 parameter를 생성한다.
             * @returns {{c_NAME: string, c_SALES_DEPT_CD: number}}
             */
            insertVO.makeGetParam = function () {
              return {
            	  d_CUST_CD    : insertVO.NO_CUST.VALUE,
                  d_NAME       : insertVO.NM_IN_CHARGE.VALUE,
                  d_DEPT       : null,
                  d_POS        : null,
                  d_MOBILE     : insertVO.NO_MOBILE.VALUE,
                  d_EMAIL      : (insertVO.NO_EMAIL.VALUE === "")? null: insertVO.NO_EMAIL.VALUE,
                  c_CORP_ADDR1 : null,
                  c_CORP_ADDR2 : null
              };
            };

            /**
	         * 담당자 등록, 수정을 위한 validation 체크를 수행한다.
	         */
            // 
            insertVO.isValid = function (param) {
            	// 고객사명
                if (!edt.isValid(param.d_CUST_CD)) {
                    return edt.invalidFocus("companyNameBtn", APP_MSG.valid.company.space);
                }

                // 이름
                if (!edt.isValid(param.d_NAME) ) {
                    return edt.invalidFocus("chargeName", APP_MSG.valid.name.space);
                } else {
                    if (!edt.validName(param.d_NAME)) {
                        return edt.invalidFocus("chargeName", APP_MSG.valid.name.pattern);
                    }
                }

                // 연락처
                if (!edt.isValid(param.d_MOBILE)) {
                    return edt.invalidFocus("chargePhone", APP_MSG.valid.phone.space);
                } else {
                    if (!edt.validPhone(param.d_MOBILE)) {
                        return edt.invalidFocus("chargePhone", APP_MSG.valid.phone.pattern);
                    }
                }

                // 이메일
                if (param.d_EMAIL !== null) {
                    if (!edt.validEmail(param.d_EMAIL)) {
                        return edt.invalidFocus("chargeEmail", APP_MSG.valid.email.pattern);
                    }
                }

                return true;
            };
            
	          /**
	           * 고객사를 등록한다.
	           */
	          insertVO.doInsert = function () {
	        	  var param = insertVO.makeGetParam();
	        	  if (insertVO.isValid(param)) {
	        		  if (confirm(APP_MSG.insert.confirm)) {
		        		  CuChargeInfoSvc.insert(param).then(function () {
		        			  alert( APP_MSG.insert.success );
		        			  upInstance.doInquiry();
		                      $modalInstance.dismiss( "cancel" );
	                      });
	        		  }
	        	  }
	          };

              /**
               * 모달창을 닫는다.
               */
              insertVO.doCancle = function () {
                $modalInstance.dismiss( "cancel" );
              };

              // 고객사명을 등록하기 위해 모달 팝업 창을 연후 결과값을 저장한다.
              insertVO.modalSearchCustomerCompany = function () {
                  var modalInstance = $modal.open({
                      templateUrl : "app/shared/modal/searchCompany/modal.searchCompany.tpl.html",
                      controller  : "modal.searchCompanyCtrl",
                      size        : "lg"
                  });

                  modalInstance.result.then(function ( result ) {
                	  insertVO.NO_CUST.VALUE = result.code;
                	  insertVO.NO_CUST.NAME  = result.name;
                  });
              };

              // 처음 로드되었을 때 실행된다.
              (function  () {
              }());
        }]);

}());