(function() {
    'use strict';

    angular
        .module('main.basic')
        .directive('fsBasic', fsBasic);

    function fsBasic()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/basic/basic.directive.html',
            controller: 'fsBasicController',
            controllerAs: 'vm'
        };
    }

})();
