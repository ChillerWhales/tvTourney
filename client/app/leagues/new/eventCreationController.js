angular.module('new.event.create', [])
  .controller('eventCtrl', function ($scope, eventHandler, $stateParams) {
    
    // array in the scope for holding events
    $scope.events = eventHandler.postedEvents;

    // controller for making events
    $scope.makeEvent = function() {
      var event = {
        league_id: $scope.league.id,
        league_name: $scope.league.name,
        description : $scope.event.name,
        score: $scope.event.score,
        url: "/league/" + $scope.league.id + "/events"
      };
      $scope.event.name = '';
      $scope.event.score = '';

      eventHandler.postEvent(event).success(function(data) {
        console.log('SUCCESS!!', data);
      }).error(function(err) {
        console.log('ERROR!!', err);
      });
    };

    // controller for getting events that the league has
    $scope.grabEvents = function() {
      eventHandler.getEvents($scope.league.id).success(function(data) {
        $scope.events = [];
        data.forEach(function(event) {
          $scope.events.push(event);
        })
      }).error(function(err) {
        return err;
      });
    };

    $scope.nextPage = function(step) {
      if ($scope.events.length) {
        $scope.nextStep(step);
      }
    };

    $scope.deleteEvent = function(numEvent) {
      eventHandler.deleteEvent($scope.league.id, $scope.events[numEvent].id, numEvent)
        .success(function(resp) {
          console.log('Event deleted');
        })
        .error(function(err) {
          console.log(err);
        });
    };

  })
  .factory('eventHandler', function($http) {
    var postedEvents = [];
    
    // makes an ajax call to the server for the list of events
    var getEvents = function(league_id) {
      return $http({
        method: 'GET',
        url: '/league/' + league_id + '/events'
      }).success(function(resp) {
        return resp;
      }).error(function(err) {
        return err;
      });
    };
    
    // makes an ajax call to the server to post the event owner inputed
    var postEvent = function(data) {
      return $http({
        method: 'POST',
        url: data.url,
        data: data
      }).success(function(resp) {
        postedEvents.push(resp);
        return resp;
      }).error(function(err) {
        return err;
      });
    };

    var deleteEvent = function(league_id, event_id, event_index) {
      return $http({
        method: 'DELETE',
        url: '/league/' + league_id + '/events/' + event_id
      }).success(function(resp) {
        postedEvents.splice(event_index, 1);
        return resp;
      }).error(function(err) {
        return err;
      });
    };

    return {
      getEvents : getEvents,
      postEvent : postEvent,
      postedEvents : postedEvents,
      deleteEvent : deleteEvent
    }
  });
