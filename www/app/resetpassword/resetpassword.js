resetpasswordModule.controller('ResetpasswordCtrl', function($scope,$http, $log, $location, config, Parse,$state,$timeout,$sessionStorage) {
    var moduleName = 'ResetpasswordCtrl';   
   // console.log(config.API);
 //    $scope.login=function(lgn){

$scope.lgn = {
        EmailId: '',
        GeneratedToken:'',
        NewPassword:'',
    };

 var searchObject = $location.search();

$scope.lgn.GeneratedToken=searchObject.token;
$scope.lgn.EmailId=searchObject.email;

$scope.request=function(lgn){

console.log(lgn)

  var request = $http({
     method: 'POST',
    url: config.API+'resetpassword',
    data: lgn,
    }).then(function(result) {
    	console.log(result)
    	if(result.data.error == 0)
    	{
    	 $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);  
            $state.go('login'); 
         }
         else if(result.data.error == 1)
         {
         	$("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);  
         }
    	 }, function(error) {
       
         console.log(error);
         
       });


};


});