/* jshint -W117, -W030 */
'use strict';

describe('macroTargets controller', function()
{
  var controller, scope, macrosModelTesting, $httpBackend;

  beforeEach(function()
  {
    module('main.basic');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_, _$httpBackend_)
      {
        scope = _$rootScope_.$new();
        

        controller = _$controller_('fsBasicController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });
  });

  it('should be defined', function()
  {
    expect(controller).to.be.exist;
  });


});

