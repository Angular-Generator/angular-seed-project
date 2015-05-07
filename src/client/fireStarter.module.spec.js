/* jshint -W117, -W030 */
'use strict';

describe('Main app module:', function() {
    describe('fireStarter', function() {
        var scope;
        beforeEach(function() {

        });
        it('should have a basic unit test', function()
        {
          expect(true).to.be.true;
        });
        

        it('should exist', function() {
           module('fireStarter');
           inject(function($rootScope) {
               scope = $rootScope.$new();
           });
           expect(scope).to.be.ok;
        });
    });
});