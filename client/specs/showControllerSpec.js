xdescribe('LeagueController', function () {
  var $scope, $rootScope, $location, $httpBackend, createController, ShowLeague, $controller, $state;

  beforeEach(module('app'));
  beforeEach(inject(function ($injector){
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    ShowLeague = $injector.get('ShowLeague');
    $scope = $rootScope.$new();
    $state = $injector.get('$state');
    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('showLeagueController', {
        $scope: $scope,
        $location: $location,
        ShowLeague: ShowLeague
      });
    };

    createController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a league object', function() {
    expect($scope.league).to.be.a('object');
  });

  it('should have a get league method', function() {
    expect($scope.getLeague).to.be.a('function');
  });

  it('should have GET request when getLeague in a ShowLeague factory is called', function() {
    var league = {};
    $httpBackend.expect('GET', '/league/1').respond({});

    ShowLeague.getLeague(1, function(err, response){
      expect(response).to.be.a('object');
    });

    $httpBackend.flush();
  });

});