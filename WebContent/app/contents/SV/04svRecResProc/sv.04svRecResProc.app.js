(function () {
    'use strict';

    // [SV] 사업관리
    var buApp = angular.module('SV.04svRecResProc', ['SV.04svRecResProc.controller', 'SV.04svRecResProc.service', 'SV.04svRecResProc.model']);
    angular.module('SV.04svRecResProc.controller', []);
    angular.module('SV.04svRecResProc.service', []);
    angular.module('SV.04svRecResProc.model', []);

    buApp.config(['$stateProvider', function ($stateProvider) {
        // 사업관리
        $stateProvider.state('app.svRecResProc', {
            url		: '/04svRecResProc/:kind?menu&ids',
            views	: {
                contentView: {                    
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = 'list';
                        }
                        return 'app/contents/SV/04svRecResProc/templates/sv.04svRecResProc'+ edt.getMenuFileName($stateParams.kind) +'.tpl.html';
                    },
                    controllerProvider: ['$stateParams', function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = 'list';
                        }
                        return 'SV.04svRecResProc'+ edt.getMenuFileName($stateParams.kind) +'Ctrl';
                    }],
                    resolve: {
                        resData: ['$q', 'AuthSvc', '$stateParams', 'SV.04svRecResProcSvc',
                            function ($q, AuthSvc, $stateParams, SvRecResProcSvc) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    var isDetail = $stateParams.kind==='detail',
                                        ids  = $stateParams.ids;
                                    if (isDetail && ids) {
                                        SvRecResProcSvc.getSvServRecProc({ NO_SERV_REC: ids }).then(function (res) {
                                            var data = res.data.result;
                                            resData.svServRec = data.svServRec;
                                            resData.svServPln = data.svServPln;
                                            resData.svServPfm = data.svServPfm;
                                            resData.svServRecResProc = data.svServRecResult;
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