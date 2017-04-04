(function () {
    "use strict";

    // [SV] 사업관리
    var buApp = angular.module("SV.06svWeekBsnSch", ["SV.06svWeekBsnSch.controller", "SV.06svWeekBsnSch.service"]);
    angular.module("SV.06svWeekBsnSch.controller", []);
    angular.module("SV.06svWeekBsnSch.service", []);

    buApp.config(["$stateProvider", function ($stateProvider) {
        // 사업관리
        $stateProvider.state( "app.svWeekBsnSch", {
            url		: "/06svWeekBsnSch/:kind?menu&ids",
            views	: {
                contentView: {                    
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/SV/06svWeekBsnSch/templates/sv.06svWeekBsnSch"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "SV.06svWeekBsnSch"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve: {
                        resData: ["$q", "AuthSvc", "$stateParams", 'UtilSvc', "$window", 
                            function ($q, AuthSvc, $stateParams, UtilSvc, $window) {
	                        	var defer   = $q.defer(),
	                            resData = {};
	
		                        AuthSvc.isAccess().then(function (result) {
		                            resData.access = result[0];
		                            
		                            var menu = $stateParams.menu;

	                                if (!menu) {
	                    				var svWeekBsnRow_rtnParam = JSON.parse($window.sessionStorage.getItem('svWeekBsnRow_rtnParam'));
	                    				var svWeekBsnRow_rowInfo = JSON.parse($window.sessionStorage.getItem('svWeekBsnRow_rowInfo'));
	                                	
                    					var entity = svWeekBsnRow_rtnParam;
                    					var period  = entity.DATE.period,
                    						start = [period.start.y, period.start.m, period.start.d],
                    						end   = [period.end.y, period.end.m, period.end.d],
                    						rtnParam = {
                    							KIND: entity.KIND.value,
                    							TP_PER: entity.TP_PER.value,
                    							STRT_PER: start.join('-'),
                    							END_PER : end.join('-')
                    						};

                    					if (entity.DEPART.value.length>0    ) { rtnParam.DEPART = entity.DEPART.value; }
                    					if (entity.NO_USER.value.length>0   ) {
                    						rtnParam.TP_EMP = entity.CD_USER_TP.value;
                    						rtnParam.NO_RECR = entity.NO_USER.value; 
                    					}

                    					if (entity.type.code === 'DS') {
                    						if (entity.NO_SERV_REC.value            ) { rtnParam.NO_SERV_REC = entity.NO_SERV_REC.value; }
                    						if (entity.NO_SERV_PLN.value            ) { rtnParam.NO_SERV_PLN = entity.NO_SERV_PLN.value; }
                    						if (entity.NO_SERV_PFM.value            ) { rtnParam.NO_SERV_PFM = entity.NO_SERV_PFM.value; }
                    						if (entity.NO_MNG_CUST.value            ) { rtnParam.NO_MNG_CUST = entity.NO_MNG_CUST.value; }
                    						if (entity.NO_SERV_CUST.value           ) { rtnParam.NO_SERV_CUST = entity.NO_SERV_CUST.value; }
                    						if (entity.NM_REQR.value                ) { rtnParam.NM_REQR = entity.NM_REQR.value; }
                    						if (entity.CD_REC_WAY.value.length>0    ) { rtnParam.CD_REC_WAY = entity.CD_REC_WAY.value; }
                    						if (entity.CD_SERV_TP.value.length>0    ) { rtnParam.CD_SERV_TP = entity.CD_SERV_TP.value; }
                    						if (entity.CD_STAT_PROC.value.length>0  ) { rtnParam.CD_STAT_PROC = entity.CD_STAT_PROC.value; }
                    						if (entity.CD_OBS_SRON.value.length>0   ) { rtnParam.CD_OBS_SRON = entity.CD_OBS_SRON.value; }
                    						if (entity.CD_OBS_SEP.value.length>0    ) { rtnParam.CD_OBS_SEP = entity.CD_OBS_SEP.value; }
                    						if (entity.CD_EQM_ITD_FRM.value.length>0) { rtnParam.CD_EQM_ITD_FRM = entity.CD_EQM_ITD_FRM.value; }
                    						if (entity.NM_EQM.value                 ) { rtnParam.NM_EQM = entity.NM_EQM.value; }
                    						if (entity.NM_PJT.value                 ) { rtnParam.NM_PJT = entity.NM_PJT.value; }
                    					}
                    					
                    					rtnParam.STRT_PER = svWeekBsnRow_rowInfo.ST_DT_CAL_SEARCH;
                    					rtnParam.END_PER = svWeekBsnRow_rowInfo.ED_DT_CAL_SEARCH;
                    					
                    					rtnParam.procedureParam = "USP_SV_WEEKBSN_INFO_GET&" +
																  "KIND@i|DEPART@l|TP_EMP@s|NO_RECR@l|NO_SERV_REC@s|NO_SERV_PLN@s|" +
												                  "NO_SERV_PFM@s|NO_MNG_CUST@i|NO_SERV_CUST@i|NM_REQR@s|CD_REC_WAY@l|" +
												                  "CD_SERV_TP@l|CD_STAT_PROC@l|CD_OBS_SRON@l|CD_OBS_SEP@l|CD_EQM_ITD_FRM@l|" +
												                  "NM_EQM@s|NM_PJT@s|TP_PER@s|STRT_PER@s|END_PER@s";
                    					
	                                	UtilSvc.getList( rtnParam ).then(function ( result ) {
	                                		resData.svWeekBsnSch = {
	                                			data : [],
	                                			searchVO : {}
	                                		};
	                                		
	                						resData.svWeekBsnSch.data = result.data.results;
	                						resData.svWeekBsnSch.searchVO = rtnParam;
	                                        defer.resolve(resData);
	                					});
	                                } else {
                                        defer.resolve(resData);
                                    }
		                        });
		                        
		                        return defer.promise;
                            }
                        ]
                    }
                }
            }
        });
    }]);
}());