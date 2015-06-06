/* 
'setCharactersCtrl' - manages characters addition, display and deletion 
- currently used on leage creation step2
*/
angular.module('new.character', [])
.controller('setCharactersCtrl', function ($scope, Character) {
  //get league.id from scope 
  $scope.character = {};
  $scope.addCharacter = function(){
    Character.saveCharacter($scope.league.id, $scope.character.name, function(err, character){
      if(character) {
        $scope.setCharacter(character);
        console.log(character);
        $scope.appendCharacters(character);
        $scope.character = {};
      }
    });
  };

  $scope.deleteCharacter = function($index){
    console.log("in deleteCharacter $index is ", $index);
    // var currentCharacter = $scope.characters[$index]

    var currentCharacter = $scope.getCharacterByIndex($index);
    console.log('currentCharacter is : ', currentCharacter);

    Character.deleteCharacter(currentCharacter.league_id, currentCharacter.id, function(err, result){
      if (result) { // count GT 0 
        console.log("on success clinet - characters deleted " ,result);
        $scope.removeCharacter($index);
      }
    });
  };
})
.factory('Character', function($http) {
  var saveCharacter = function(leagueId, characterName, callback){
    $http({
      method: 'POST',
      url: '/league/'+leagueId+'/characters',
      data: {name: characterName}
    })
    .success(function(character){
      console.log('created a character' , character);
      callback(false, character);
    })
    .error(function(err){
      console.log(err);
      callback(true, err);
    });
  };
  
  var deleteCharacter = function(leagueId, characterId, callback){
    $http({
      method: 'DELETE',
      url: '/league/'+leagueId+'/characters/'+characterId
    })
    .success(function(){
      console.log('deleted a character');
      callback(false, 'success');
    })
    .error(function(err){
      console.log(err);
      callback(true, err);
    });
  };
  
  return {
    saveCharacter: saveCharacter,
    deleteCharacter: deleteCharacter
  };

}) // end factrory - Character