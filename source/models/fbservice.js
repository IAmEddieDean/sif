'use strict';

angular.module('sif')
.service('FBService', ['$window', '$firebaseAuth', 'urls', ($window, $firebaseAuth, urls) => {
  this.init = () => {
    this.fbRef = new $window.Firebase(urls.firebaseUrl);
    this.afAuth = $firebaseAuth(this.fbRef);
  };
  return this;
}]);
