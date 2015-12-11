'use strict';

angular.module('sif')
.controller('UsersCtrl', ['$scope', '$state', ($scope, $state) => {
  console.log('user ctrl online');
  
  $scope.name = $state.current.name.split('.')[1];
  
  $scope.submit = (user) => {
    console.log(user);
  };
}]);
