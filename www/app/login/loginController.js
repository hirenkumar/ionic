loginModule.controller('LoginCtrl', function($scope,$http, $log, $location, config, Parse,$state,$timeout,$sessionStorage) {
    var moduleName = 'LoginCtrl';   
   // console.log(config.API);
    $scope.login=function(lgn){

 var request = $http({
    method: 'POST',
    url: config.API+'login',
    data: lgn,
    }).then(function(result) {
           if(result.data.error == 0)
           {
           // console.log(result.data.users[0].UserId)
		        //    $sessionStorage.put('UserId', result.data.users.UserId);
              $sessionStorage.UserId=result.data.users[0].UserId;
            // console.log("session login",$sessionStorage.UserId);
			      $state.go('dashboard');




           }
           else if(result.data.error == 1)
           {
            $("#login-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#login-errors").html('');
            }, 2000);   

           }
            else if(result.data.error == -1)
           {
            $("#login-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#login-errors").html('');
            }, 200000);   

           }
       }, function(error) {
       
          $state.go('login');
         
       });

    };


});