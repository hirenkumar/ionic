diaryModule.controller('ExpenseEntryCtrl', function($state,$ionicScrollDelegate,$stateParams,$filter,moment,$http, $timeout, calendarConfig,$scope, $sessionStorage,$log, $location, config, Parse,$ionicModal) {
    var moduleName = 'ExpenseEntryCtrl';   


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


$scope.expid = angular.isDefined($stateParams.id) ? $stateParams.id : 'null';
 //console.log($scope.expid);

 $("[name='my-checkbox']").bootstrapSwitch();

 $http({
  method: 'GET',
   async:false,  
  url: config.API +'getExpenseDetailsById/'+$scope.expid
}).then(function successCallback(response) {
 
  $scope.Expense=response.data.Expense[0];
  console.log($scope.Expense)
  
   if($scope.Expense.Notes == null || $scope.Expense.Notes == "null")
  {
    $scope.Expense.Notes =0;
  }
   if($scope.Expense.Tags == null || $scope.Expense.Tags == "null" || $scope.Expense.Tags == "None" || $scope.Expense.Tags == "none" || $scope.Expense.Tags == "Tags[Optional]")
  {
    $scope.Expense.Tags =0;
  }
   if($scope.Expense.Location == null || $scope.Expense.Location == "null")
  {
    $scope.Expense.Location =0;
  }

   },
 function errorCallback(response) {
   console.log(response);
 });


$scope.deleteExpense=function(id){
console.log(id);

  $http({
  method: 'GET',
   async:false,  
  url: config.API +'DeleteExpense/'+id
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