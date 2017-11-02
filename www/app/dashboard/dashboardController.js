dashboardModule.controller('DashboardCtrl', function($scope,$ionicScrollDelegate, $log, $location, config, Parse,$http,$sessionStorage,$state,$ionicModal) {
    var moduleName = 'DashboardCtrl';  


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
 console.log($scope.loggedInUser);
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




	$ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();

  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
   
  $scope.incomebuttonclick=function(){
  
     $scope.closeModal();
     $state.go('createIncome');
  };
 
 $scope.expensebuttonclick=function(){
     $scope.closeModal();
     $state.go('createExpense');
  };
});