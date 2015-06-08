describe('UserController', function () {
  var $scope, $rootScope, $location, $httpBackend, createController, User, $controller, $state;

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
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    expect($scope.signup).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have call to POST /signup with signup factory method', function() {
    var newUser = {
      username: 'testing123',
      email: 'testing123@gmail.com',
      password: '123456'
    };

    $httpBackend.expect('POST', '/signup', newUser).respond(201, newUser);
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    User.signup(newUser, function(created){
      expect(created).to.be(true);
    })
    $httpBackend.flush();

  });

  it('should have call to POST /login and return true when user is correct', function() {
    var user = {
      username: 'testing123',
      password: '123456'
    };

    $httpBackend.expect('POST', '/login', user).respond(200, true);
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    User.login(user, function (success) {
      expect(success).to.be(true);
    });

    $httpBackend.flush();
  });

});

