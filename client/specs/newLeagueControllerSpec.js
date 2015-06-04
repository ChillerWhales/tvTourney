describe('NewLeagueController', function () {
  var $scope, $rootScope, $location, $httpBackend, createController, $controller, $state;

  beforeEach(module('app'));
  beforeEach(inject(function ($injector){
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();
    $state = $injector.get('$state');
    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('newLeagueController', {
        $scope: $scope,
        $location: $location
      });
    };

    createController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a nextStep method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(201);
    expect($scope.nextStep).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a setLeague method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(201);
    expect($scope.setLeague).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a setCharacter method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(201);
    expect($scope.setCharacter).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a appendCharacter smethod', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(201);
    expect($scope.appendCharacters).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a removeCharacter method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(201);
    expect($scope.removeCharacter).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a getCharacterByIndex method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(201);
    expect($scope.getCharacterByIndex).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a checkIfCharacters method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(201);
    expect($scope.checkIfCharacters).to.be.a('function');
    $httpBackend.flush();
  });

});