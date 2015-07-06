'use strict';

angular.module('sif')
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
    
  $stateProvider
  .state('home', {url: '/', templateUrl: '/views/home/home.html'})
  .state('user', {url: '', templateUrl: '/views/users/user.html', abstract: true})
  .state('user.register', {url: '/register', templateUrl: '/views/users/users.html', controller: 'UsersCtrl'})
  .state('user.login', {url: '/login', templateUrl: '/views/users/users.html', controller: 'UsersCtrl'});
});
