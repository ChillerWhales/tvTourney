 describe('Create League Ctrl', function() {
    var $scope, $rootScope, $location, $httpBackend, createController, $controller, $state, Character;

    beforeEach(module('app'));
    beforeEach(inject(function ($injector){
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');
      $httpBackend = $injector.get('$httpBackend');
      Character = $injector.get('Character')
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      var $controller = $injector.get('$controller');

      createController = function () {
        return $controller('setCharactersCtrl', {
          $scope: $scope,
          $location: $location,
          Character: Character
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
      expect($scope.addCharacter).to.be.a('function');
      $httpBackend.flush();
    });

    it('should have a deleteCharacter method', function() {
      $httpBackend.expect('GET', 'app/user/login.html').respond(201);
      expect($scope.deleteCharacter).to.be.a('function');
      $httpBackend.flush();
    });

    it('should have a factory Character with saveCharacter method', function() {
      $httpBackend.expect('GET', 'app/user/login.html').respond(201);
      expect(Character.saveCharacter).to.be.a('function');
      $httpBackend.flush();
    });

    it('should have a factory Character with deleteCharacter method', function() {
      $httpBackend.expect('GET', 'app/user/login.html').respond(201);
      expect(Character.deleteCharacter).to.be.a('function');
      $httpBackend.flush();
    });

    it('should POST request to /league the saveLeagueInfo', function() {
      $scope.league = {
        name: "leagueName",
        show: "tvShow",
        roster_limit: 1,
        id: 5
      };
      $scope.character = {
        name: 'prueba'
      };
      $httpBackend.expect('POST', '/league/' + $scope.league.id + '/characters').respond(201, $scope.character);
      $httpBackend.expect('GET', 'app/user/login.html').respond(201);
      Character.saveCharacter($scope.league.id, $scope.character.name, function(err, response){
        expect(err).to.be(false);
        expect(response.name).to.be($scope.character.name);
      });
      $httpBackend.flush();
    });


  });