(function() {
    'use strict';

    angular
        .module('main.about')
        .directive('fsAbout', fsAbout);

    function fsAbout()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/about/about.directive.html',
            controller: 'fsAboutController',
            controllerAs: 'vm'
        };
    }

})();
