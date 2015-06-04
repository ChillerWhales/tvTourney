xdescribe('LeagueController', function () {
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

    createController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a getLeagues method', function() {
    expect($scope.getLeagues).to.be.a('function');
  });

  it('should have a leagues object', function() {
    expect($scope.leagues).to.be.a('object');
  });

  it('should GET request to /user/leagues when ListLeague factory is called through getLeagues scope function', function() {
    var leagues = [{}, {}];
    $httpBackend.expect('GET', '/user/leagues').respond(leagues);

    ListLeague.getLeagues(function (response) {
      expect(response).toBeArray();
    });

    $httpBackend.flush();
  });

});