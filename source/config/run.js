'use strict';

angular.module('sif')
.run(['FBService', (FBService) => {
  FBService.init();
  console.log('Sif Online');
}]);
