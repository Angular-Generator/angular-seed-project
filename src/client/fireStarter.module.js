(function() {
    'use strict';

    console.log("I'm a fireStartah... twisted fireStartah...");

    angular
        .module('fireStarter', [
            'ui.router',
            'main'
            ])
        .run(init);

       /* @ngInject */
    function init($state)
    {
        if($state.current.name === '')
        {
            $state.go('basic');
        }
    }

})();
