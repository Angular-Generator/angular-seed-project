(function() {
    'use strict';

    angular
        .module('fireStarter')
        .config(configureRoutes);

    /* @ngInject */
    function configureRoutes($stateProvider)
    {
        $stateProvider
            .state('loading', {
                url: '/loading',
                template: '<h2>Loading...</h2>'
            })
            .state('main', {
                url: '/',
                template: '<fs-main></fs-main>'
            })
            .state('basic', {
                url: '/basic',
                template: '<fs-basic></fs-basic>'
            })
            .state('about', {
                url: '/about',
                template: '<fs-about></fs-about>'
            });
    }
})();