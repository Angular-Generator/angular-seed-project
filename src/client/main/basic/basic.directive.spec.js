/* jshint -W117, -W030 */
(function() {
    'use strict';
    describe('basic directive:', function() {
        var scope;

        beforeEach(function() {
            module('main', 'main.basic', 'main/basic/basic.directive.html');
        });

        it('is a directive that exists where compile works', function() {
            inject(function($rootScope, $compile)
            {
                var newScope = $rootScope.$new();
                var element = '<fs-basic></fs-basic>';
                element = $compile(element)(newScope);
                newScope.$digest();
            });

        });

    });

}());
