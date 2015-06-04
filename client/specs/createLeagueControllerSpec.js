 describe('Create League Ctrl', function() {
    var $scope, $rootScope, $location, $httpBackend, createController, $controller, $state, League;

    beforeEach(module('app'));
    beforeEach(inject(function ($injector){
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');
      $httpBackend = $injector.get('$httpBackend');
      League = $injector.get('League')
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      var $controller = $injector.get('$controller');

      createController = function () {
        return $controller('createLeagueCtrl', {
          $scope: $scope,
          $location: $location,
          League: League
        });
      };

      createController();
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have a saveLeagueInfo method', function() {
      $httpBackend.expect('GET', 'app/user/login.html').respond(201);
      expect($scope.saveLeagueInfo).to.be.a('function');
      $httpBackend.flush();
    });

    it('should have a factory League with postLeague method', function() {
      $httpBackend.expect('GET', 'app/user/login.html').respond(201);
      expect(League.postLeague).to.be.a('function');
      $httpBackend.flush();
    });

    it('should POST request to /league the saveLeagueInfo', function() {
      $scope.league = {
        name: "leagueName",
        show: "tvShow",
        roster_limit: 1
      };
      $httpBackend.expect('POST', '/league', $scope.league).respond(false, $scope.league);
      $httpBackend.expect('GET', 'app/user/login.html').respond(201);
      $scope.saveLeagueInfo();
      $httpBackend.flush();
    });


  });