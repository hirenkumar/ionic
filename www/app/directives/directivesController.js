directivesModule.controller('directiveCtrl', function($scope, $log, $location, config, Parse,$ionicSideMenuDelegate) {
    var moduleName = 'directiveCtrl'; 

 $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };



});