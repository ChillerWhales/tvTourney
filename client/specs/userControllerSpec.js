describe('UserController', function () {
  var $scope, $rootScope, $location, $window, $httpBackend, createController, User, $controller, $state;

  beforeEach(module('app'));
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');    
    User = $injector.get('User');
    $scope = $rootScope.$new();
    $state = $injector.get('$state');
    var $controller = $injector.get('$controller');
    
    createController = function () {
      return $controller('userController', {
        $scope: $scope,
        $location: $location,
        User: User
      });
    };

    createController();
  }));


  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a singup method', function () {
    expect($scope.signup).to.be.a('function');
  });

  it('should have a singup method', function () {
    expect($scope.user).to.be.a('object');
  });

  it('should have call to POST /signup when user signs up and redirect to login angular route', function() {
    var newUser = {
      username: 'testing123',
      email: 'testing123@gmail.com',
      password: '123456'
    };

    $scope.user = newUser;
    
    $httpBackend.expect('POST', '/signup', $scope.user).respond(201);

    $httpBackend.expect('GET', 'app/user/login.html').respond(200);

    $scope.signup();

    $httpBackend.flush();

  });

  it('should have call to POST /login when user logs in and redirect to leagues angular route', function() {
    var user = {
      username: 'testing123',
      password: '123456'
    };

    $scope.user = user;

    $httpBackend.expect('POST', '/login', user).respond(200);

    $httpBackend.expect('GET', 'app/leagues/leagues.html').respond(200);

    $scope.login();

    $httpBackend.flush();
  });

});

