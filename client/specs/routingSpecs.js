describe('Routing', function () {
  var $state;
  beforeEach(module('app'));

  beforeEach(inject(function($injector){
    $state = $injector.get('$state');
  }));

  it('Should have /signup route', function () {
    expect($state.go('signup')).to.be.ok();
  });

});