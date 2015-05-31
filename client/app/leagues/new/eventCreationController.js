angular.module('new.event.create', [])
  .controller('eventCreateCtrl', function ($scope, eventHandler) {
    //array in the scope for holding events
    $scope.events = [];

    //controller for making events
    $scope.makeEvent() = function() {
      var event = {
        description : $scope.eventName,
        score: $scope.eventScore
      }
      eventHandler.postEvent(event).success(function(data) {
        $scope.events.push(event);
        return data;
      }).error(function(err) {
        //does something about the error --> can be added later
        return err;
      });
    }
    //controller for getting events that the league has
    $scope.grabEvents() = function() {
      eventHandler.getEvents().success(function(data) {
        data.each(function(event) {
          $scope.events.push(event);
        })
      }).error(function(err) {
        return err;
      });
    }
  })
  .factory('eventHandler', function($http) {
    //makes an ajax call to the server for the list of events
    var getEvents = function() {
      return $http({
        method: 'GET',
        url: '/leagues/:id/events'
      }).success(function(resp) {
        return resp.data;
      }).error(function(err) {
        return err;
      });
    }
    //makes an ajax call to the server to post the event owner inputed
    var postEvent = function(data) {
      return $http({
        method: 'POST',
        url: '/leagues/:id/events',
        data: data
      }).success(function(resp) {
        return resp;
      }).error(function(err) {
        return err;
      });
    }

    return {
      getEvents : getEvents,
      postEvent : postEvent
    }
  });
