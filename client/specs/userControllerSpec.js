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

  it('should have return 201 when new user is created', function() {
    var newUser = {
      username: 'testing123',
      email: 'testing123@gmail.com',
      password: '123456'
    };

    $httpBackend.expectPOST('/signup', newUser).respond(201);
    $scope.signup();
    $httpBackend.flush();
  });

  // it('should have return 400 when new user is already exist', function() {
  //   var newUser = {
  //     username: 'testing123',
  //     email: 'testing123@gmail.com',
  //     password: '123456'
  //   };

  //   $httpBackend.expectPOST('/signup', newUser).respond(400);
  // });

  // it('should have return 500 when new user is error to storage in db', function() {
  //   var newUser = {
  //     username: null,
  //     email: null,
  //     password: '123456'
  //   };

  //   $httpBackend.expectPOST('/signup', newUser).respond(500);
  // });
});

