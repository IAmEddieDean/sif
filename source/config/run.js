'use strict';

angular.module('sif')
.run(function(FBService){
  FBService.init();
  console.log('Sif Online');
});
