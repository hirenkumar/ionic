forgotpassword.controller('ForgotpasswordCtrl', function($scope,$http, $log, $location, config, Parse,$state,$timeout,$sessionStorage) {
    var moduleName = 'ForgotpasswordCtrl';   
   // console.log(config.API);
 //    $scope.login=function(lgn){

$scope.lgn = {
        EmailId: ''
    };

$scope.request=function(lgn){


  var request = $http({
     method: 'POST',
    url: config.API+'forgotpassword',
    data: lgn,
    }).then(function(result) {

    	if(result.data.error == -1)
    	{
    	 $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   
         }
         else if(result.data.error == 1)
         {
         	$("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);  
         }
          else if(result.data.error == 2)
         {
         	$("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);  
         }
         else if(result.data.error == 0){
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