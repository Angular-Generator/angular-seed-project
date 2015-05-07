(function () {

	angular.module("main")
		.controller("fsMainController", fsMainController);

	/* @ngInject */
    function fsMainController($state, $rootScope, $location)
    {
        var vm = this;
        vm.basicEnabled = false;
        vm.aboutEnabled = false;
        vm.basicTab = '';
        vm.aboutTab = '';

        vm.toggleState = function(toState)
        {
        	if(toState === 'basic')
        	{
        		vm.basicEnabled = true;
        		vm.aboutEnabled = false;
        		vm.basicTab = 'tab';
        		vm.aboutTab = '';
        	}
        	else if(toState === 'about')
        	{
        		vm.basicEnabled = false;
        		vm.aboutEnabled = true;
        		vm.basicTab = '';
        		vm.aboutTab = 'tab';
        	}
            else
            {
                vm.basicEnabled = false;
                vm.aboutEnabled = false;
                vm.basicTab = '';
                vm.aboutTab = '';
            }
        };
        

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams)
        {
        	vm.toggleState(toState.name);
        });
        vm.toggleState($state.current.name);

    }
})();
