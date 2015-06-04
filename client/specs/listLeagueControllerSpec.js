describe('LeagueController', function () {
  var $scope, $rootScope, $location, $httpBackend, createController, ListLeague, $controller, $state;

  beforeEach(module('app'));
  beforeEach(inject(function ($injector){
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    ListLeague = $injector.get('ListLeague');
    $scope = $rootScope.$new();
    $state = $injector.get('$state');
    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('listLeagueController', {
        $scope: $scope,
        $location: $location,
        ListLeague: ListLeague
      });
    };
    var leagues = [{}, {}];
    $httpBackend.expect('GET', '/user/leagues').respond(leagues);
    createController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a getLeagues method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    expect($scope.getLeagues).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a leagues object', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    expect($scope.leagues).to.be.an('array');
    $httpBackend.flush();
  });

  it('should GET request to /user/leagues when ListLeague factory is called through getLeagues scope function', function() {
    var leagues = [{}, {}];
    $httpBackend.expect('GET', '/user/leagues').respond(leagues);
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    ListLeague.getLeagues(function (err, response) {
      expect(err).to.be(false);
      expect(response).to.be.an('array');
    });

    $httpBackend.flush();
  });

});