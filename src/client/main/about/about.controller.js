(function () {

	angular.module("main.about")
		.controller("fsAboutController", fsAboutController);

	/* @ngInject */
    function fsAboutController($scope, $http, localStorageService)
    {
        var vm = this;
        vm.title = "Loading...";
        vm.content = "";
        $http.get('http://'+window.location.hostname+':2146/api/abouttext')
				.success(function(response)
				{
					localStorageService.set('abouttext', response.data);
					vm.title = "About";
					vm.content = response.data;
				})
				.error(function(error)
				{
					console.error(error);
					vm.title = "About";
					vm.content = "Couldn't get data from server to show you what this is about.";
				});
    }
})();
