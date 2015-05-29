describe('Routing', function () {
  var $state;
  var $stateParams;
  beforeEach(module('app'));

  beforeEach(inject(function($injector){
    $state = $injector.get('$state');
    $stateParams = $injector.get('$stateParams');
  }));

  it('Should have /signup route', function () {
    var state = $state.get('signup');
    expect(state.url).to.eql('/signup');
    expect(state.name).to.eql('signup');
  });


  it('Should have /login route', function () {
    var state = $state.get('login');
    expect(state.url).to.eql('/login');
    expect(state.name).to.eql('login');
  });

  it('Should have / route', function () {
    var state = $state.get('home');
    expect(state.url).to.eql('/');
    expect(state.name).to.eql('home');
  });

  it('Should have /leagues/:id route', function () {
    var state = $state.get('home.leagues.show');
    expect(state.url).to.eql('leagues/:id');
    expect(state.name).to.eql('home.leagues.show');
    expect($state.href('home.leagues.show', { id: 1 })).to.eql('#/leagues/1');
  });

  it('Should have /leagues/new route', function () {
    var state = $state.get('home.leagues.new');
    expect(state.url).to.eql('leagues/new');
    expect(state.name).to.eql('home.leagues.new');
  });

  it('Should have /leagues/:id/draft route', function () {
    var state = $state.get('home.leagues.draft');
    expect(state.url).to.eql('leagues/:id/draft');
    expect(state.name).to.eql('home.leagues.draft');
    expect($state.href('home.leagues.draft', {id: 66})).to.eql('#/leagues/66/draft');
  });

});