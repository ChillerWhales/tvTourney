describe('InviteController', function () {
  var $scope, $rootScope, $location, $httpBackend, createController, invite, $controller, $state;

  beforeEach(module('app'));
  beforeEach(inject(function ($injector){
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    invite = $injector.get('invite');
    $scope = $rootScope.$new();
    $state = $injector.get('$state');
    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('inviteFriendsCtrl', {
        $scope: $scope,
        $location: $location,
        invite: invite
      });
    };
    createController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a inviteUser method', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    expect($scope.inviteUser).to.be.a('function');
    $httpBackend.flush();
  });

  it('should have a inviteUser method in a invite factory', function() {
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    expect(invite.inviteUser).to.be.a('function');
    $httpBackend.flush();
  });

  it('should POST request to /league/:leagueId/invite when invite factory is called through inviteUser scope function', function() {
    $scope.league = {
      name: "leagueName",
      show: "tvShow",
      roster_limit: 1,
      id: 5
    };
    $httpBackend.expect('POST', '/league/' + $scope.league.id + '/invite').respond({username: 'testUser'});
    $httpBackend.expect('GET', 'app/user/login.html').respond(200);
    invite.inviteUser($scope.league.id, 'testUser', function(response){
      expect(response.username).to.be('testUser');
    });

    $httpBackend.flush();
  });

});