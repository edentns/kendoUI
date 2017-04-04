(function ( window ) {

    'use strict';

    var svServRecApp = angular.module('SV.01svServRec', [ 'SV.01svServRec.controller', 'SV.01svServRec.service', 'SV.01svServRec.model' ]);
    angular.module('SV.01svServRec.controller', []);
    angular.module('SV.01svServRec.service', []);
    angular.module('SV.01svServRec.model', []);

    svServRecApp.config(['$stateProvider', function ($stateProvider) {
        // 사업관리
        $stateProvider.state('app.svServRec', {
            url		: '/01svServRec/:kind?menu&ids',
            views	: {
                contentView: {                    
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = 'list';
                        }
                        return 'app/contents/SV/01svServRec/templates/sv.01svServRec'+ edt.getMenuFileName($stateParams.kind) +'.tpl.html';
                    },
                    controllerProvider: ['$stateParams', function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = 'list';
                        }

                        return 'SV.01svServRec'+ edt.getMenuFileName($stateParams.kind) +'Ctrl';
                    }],
                    resolve: {
                        resData: ['$q', 'AuthSvc', '$stateParams', 'SV.01svServRecSvc',
                            function ($q, AuthSvc, $stateParams, SvServRecSvc) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    var isDetail = $stateParams.kind==='detail',
                                        ids  = $stateParams.ids;
                                    if (isDetail && ids) {
                                        SvServRecSvc.getSvServRec({ NO_SERV_REC: ids }).then(function (res) {
                                            resData.svServRec = res.data.result.svServRec;
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
}( window ));