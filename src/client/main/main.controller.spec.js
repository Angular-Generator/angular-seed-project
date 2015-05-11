/* jshint -W117, -W030 */
'use strict';

describe('main controller', function()
{
  var controller, scope, state;

  beforeEach(function()
  {
    module('main');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_, _$state_)
      {
        scope = _$rootScope_.$new();
        state = _$state_;
        controller = _$controller_('fsMainController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });
  });

  it('should be created successfully', function()
  {
      expect(controller).to.be.defined;
  });

  it('basicEnabled should be false', function()
  {
      expect(controller.basicEnabled).to.be.false;
  });

  it('aboutEnabled should be false', function()
  {
      expect(controller.aboutEnabled).to.be.false;
  });

  it('basicTab should be empty', function()
  {
      expect(controller.basicTab).to.equal('');
  });

  it('aboutTab should be empty', function()
  {
      expect(controller.aboutTab).to.equal('');
  });

  it('state injection worked', function()
  {
      expect(state).to.be.defined;
  });

  it('basicEnabled is true when you toggle state to basic', function()
  {
      controller.toggleState('basic');
      expect(controller.basicEnabled).to.be.true;
      expect(controller.aboutEnabled).to.be.false;
  });

  it('aboutEnabled is true when you toggle state to about', function()
  {
      controller.toggleState('about');
      expect(controller.basicEnabled).to.be.false;
      expect(controller.aboutEnabled).to.be.true;
  });

  // TODO: test route resolving with state change success
  // it('macrosEnabled is true when you toggle state to workout via state change event', function()
  // {
  //     state.go('macros');
  //     expect(controller.macrosEnabled).to.be.true;
  //     expect(controller.workoutEnabled).to.be.false;
  // });

      // expect(controller.workouts).to.not.be.empty;
      // expect(controller.workouts).to.have.length.above(0);

});