(function ( window ) {
    "use strict";

    if ( !window.SvApp ) {
        /**
         * @namespace
         * @name SvApp
         */
        var SvApp = {};
    }

    // [SV]
    angular.module("edtApp.SV", ["SV.common", "SV.01svServRec","SV.02svServPln","SV.03svServPfm","SV.04svRecResProc","SV.05svEmgObsProc","SV.06svWeekBsnSch","SV.07svBsnPrsc"]);

    // [SV] 서비스관리 > 서비스접수
    angular.module("01svServRec", ["01svServRec.controller", "01svServRec.service"]);
    angular.module("01svServRec.controller", []);
    angular.module("01svServRec.service", []);
    
    // [SV] 서비스관리 > 서비스접수
    angular.module("02svServPln", ["02svServPln.controller", "02svServPln.service"]);
    angular.module("02svServPln.controller", []);
    angular.module("02svServPln.service", []);
    
    // [SV] 서비스관리 > 서비스접수
    angular.module("03svServPfm", ["03svServPfm.controller", "03svServPfm.service"]);
    angular.module("03svServPfm.controller", []);
    angular.module("03svServPfm.service", []);
    
    // [SV] 서비스관리 > 서비스접수
    angular.module("04svRecResProc", ["04svRecResProc.controller", "04svRecResProc.service"]);
    angular.module("04svRecResProc.controller", []);
    angular.module("04svRecResProc.service", []);
    
    // [SV] 서비스관리 > 서비스접수
    angular.module("05svEmgObsProc", ["05svEmgObsProc.controller", "05svEmgObsProc.service"]);
    angular.module("05svEmgObsProc.controller", []);
    angular.module("05svEmgObsProc.service", []);
    
    // [SV] 서비스관리 > 서비스접수
    angular.module("06svWeekBsnSch", ["06svWeekBsnSch.controller", "06svWeekBsnSch.service"]);
    angular.module("06svWeekBsnSch.controller", []);
    angular.module("06svWeekBsnSch.service", []);
    
    // [SV] 서비스관리 > 서비스접수
    angular.module("07svBsnPrsc", ["07svBsnPrsc.controller", "07svBsnPrsc.service"]);
    angular.module("07svBsnPrsc.controller", []);
    angular.module("07svBsnPrsc.service", []);
}( window ));