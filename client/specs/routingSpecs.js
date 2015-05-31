describe('Routing', function () {
  var $state;
  var $stateParams;
  beforeEach(module('app'));

  beforeEach(inject(function($injector){
    $state = $injector.get('$state');
    $stateParams = $injector.get('$stateParams');
  }));

  it('Should have /signup route, view and controller', function () {
    var state = $state.get('signup');
    expect(state.url).to.be('/signup');
    expect(state.name).to.be('signup');
    expect(state.templateUrl).to.be('app/user/signup.html');
    expect(state.controller).to.be('userController');
  });


  it('Should have /login route, view and controller', function () {
    var state = $state.get('login');
    expect(state.url).to.be('/login');
    expect(state.name).to.be('login');
    expect(state.templateUrl).to.be('app/user/login.html');
    expect(state.controller).to.be('userController');
  });

  it('Should have / route, view and controller', function () {
    var state = $state.get('leagues');
    expect(state.url).to.be('/');
    expect(state.name).to.be('leagues');
    expect(state.templateUrl).to.be('app/leagues/leagues.html');
    expect(state.controller).to.be('leagueController');
  });

  it('Should have /leagues/new route, view and controller', function () {
    var state = $state.get('leagues.new');
    expect(state.url).to.be('leagues/new');
    expect(state.name).to.be('leagues.new');
    expect(state.templateUrl).to.be('app/leagues/new/new.html');
    expect(state.controller).to.be('newLeagueController');
  });

  it('Should have /leagues/:id route, view and controller', function () {
    var state = $state.get('leagues.show');
    expect(state.url).to.be('leagues/:id/show');
    expect(state.name).to.be('leagues.show');
    expect($state.href('leagues.show', { id: 1 })).to.be('#/leagues/1/show');
    expect(state.templateUrl).to.be('app/leagues/show/show.html');
    expect(state.controller).to.be('showLeagueController');
  });

  it('Should have /leagues/:id/draft route, view and controller', function () {
    var state = $state.get('leagues.draft');
    expect(state.url).to.be('leagues/:id/draft');
    expect(state.name).to.be('leagues.draft');
    expect($state.href('leagues.draft', {id: 66})).to.be('#/leagues/66/draft');
    expect(state.templateUrl).to.be('app/leagues/draft/draft.html');
    expect(state.controller).to.be('draftLeagueController');
  });

});