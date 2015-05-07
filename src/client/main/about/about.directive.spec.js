/* jshint -W117, -W030 */
(function() {
    'use strict';
    describe('basic directive:', function() {
        var scope;

        beforeEach(function() {
            module('main', 'main.about', 'main/about/about.directive.html');
        });

        it('is a directive that exists where compile works', function() {
            inject(function($rootScope, $compile)
            {
                var newScope = $rootScope.$new();
                var element = '<fs-about></fs-about>';
                element = $compile(element)(newScope);
                newScope.$digest();
            });

        });

    });

}());
