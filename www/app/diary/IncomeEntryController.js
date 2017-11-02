diaryModule.controller('IncomeEntryCtrl', function($state,$ionicScrollDelegate, $stateParams,$filter,moment,$http, $timeout, calendarConfig,$scope, $sessionStorage,$log, $location, config, Parse,$ionicModal) {
    var moduleName = 'IncomeEntryCtrl';   


var sessionid=$sessionStorage.UserId;
if(sessionid == null)
{
  $state.go('login');
}

$http({
  method: 'GET',
   async:false,  
  url: config.API +'getUserDetail/'+sessionid 
}).then(function successCallback(response) {
 //alert(JSON.stringify(response))
 $scope.loggedInUser=response.data.users[0];
   },
 function errorCallback(response) {
   console.log(response);
 });




       $scope.showMobileNavMenu = function() {
 

        $('#mobile-page-overlay').show();
        $('#mobile-nav-menu').animate({left: 0});
        $scope.mobileMenuActive = true;
     $ionicScrollDelegate.getScrollView().options.scrollingY = false;
     $ionicScrollDelegate.freezeAllScrolls(true);
    }

    $scope.hideMobileNavMenu = function() {
        $('#mobile-page-overlay').hide();
        $('#mobile-nav-menu').animate({left: "-300px"});
        $scope.mobileMenuActive = false;
         $ionicScrollDelegate.getScrollView().options.scrollingY = true;
         $ionicScrollDelegate.freezeAllScrolls(false);
    }


 $scope.incmid = angular.isDefined($stateParams.id) ? $stateParams.id : 'null';


 $("[name='my-checkbox']").bootstrapSwitch();

 $http({
  method: 'GET',
   async:false,  
  url: config.API +'getIncomeDetailsById/'+$scope.incmid 
}).then(function successCallback(response) {
 
  $scope.Income=response.data.Income[0];
  console.log($scope.Income)
  if($scope.Income.Notes == null || $scope.Income.Notes == "null")
  {
    $scope.Income.Notes =0;
  }
   if($scope.Income.Tags == null || $scope.Income.Tags == "null" || $scope.Income.Tags == "None" || $scope.Income.Tags == "none" || $scope.Income.Tags == "Tags[Optional]")
  {
    $scope.Income.Tags =0;
  }
   },
 function errorCallback(response) {
   console.log(response);
 });


$scope.deleteIncome=function(id){
console.log(id);

  $http({
  method: 'GET',
   async:false,  
  url: config.API +'DeleteIncome/'+id
}).then(function successCallback(response) {
    if(response.data.error == 0)
    {
      $state.go('diary');
    }
   },
 function errorCallback(response) {
   console.log(response);
 });


};

});