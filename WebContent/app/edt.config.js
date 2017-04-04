(function () {
    "use strict";

    var edtApp = angular.module("edtApp");

    edtApp.config(["$controllerProvider", "$compileProvider", "$filterProvider", "$provide",
        function($controllerProvider, $compileProvider, $filterProvider, $provide) {
            edtApp.lazy = {
                controller 	: $controllerProvider.register,
                directive  	: $compileProvider.directive,
                filter		: $filterProvider.register,
                factory		: $provide.factory,
                service		: $provide.service
            };

            $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
                taOptions.toolbar[3].splice(1);
                return taOptions;
            }]);
        }
	]);

    edtApp.config(["$httpProvider", function ($httpProvider) {
		$httpProvider.defaults.headers.common["Content-Type"] = "application/json; text/plain; */*; charset=utf-8";
	    $httpProvider.interceptors.push("InterceptorSvc");
    }]);
}());