angular.module('teste', ['ngAnimate', 'ngRoute', 'minhasDiretivas', 'ui.bootstrap']).config(function($logProvider){
    $logProvider.debugEnabled(true)}).run(function ($rootScope) {
   $rootScope.nome = "Bins";
});
