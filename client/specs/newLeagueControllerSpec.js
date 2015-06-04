xdescribe('LeagueController', function () {
  var $scope, $rootScope, $location, $httpBackend, createController, NewLeague, $controller, $state;

  beforeEach(module('app'));
  beforeEach(inject(function ($injector){
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    NewLeague = $injector.get('NewLeague');
    $scope = $rootScope.$new();
    $state = $injector.get('$state');
    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('leagueController', {
        $scope: $scope,
        $location: $location,
        NewLeague: NewLeague
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

  it('should have a createLeague method', function() {
    expect($scope.createLeague).to.be.a('function');
  });

  it('should have a characters object', function() {
    expect($scope.characters).to.be.an('array');
  });

  it('should have a newCharacter object', function() {
    expect($scope.newCharacter).to.be.a('object');
  });

  it('should have an addCharacter method', function() {
    expect($scope.addCharacter).to.be.a('function');
  });

  it('should have a events object', function(){
    expect($scope.events).to.be.an('array');
  });


  it('should POST request to /league when LeagueNew factory is called throught createLeague scope function', function() {
    $httpBacked.expect('POST', '/league').respond(201);

    NewLeague.createLeague({}, function (err, response){
      expect(response).to.be(201);
    });

    $httpBackend.flus();
  });

  if('should POST request to /league/:id/characters when LeagueNew factory is called through addCharacter scope function', function () {
    
    $httpBacked.expect('POST', '/league/1/characters').respond(201);

    NewLeague.addCharacter(1, function (err, response) {
      expect(response).to.be(201);
    });

    $httpBackend.flus();
  });


});