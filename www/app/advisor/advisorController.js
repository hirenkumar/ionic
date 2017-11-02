dashboardModule.controller('AdvisorCtrl', function($scope, $log, $location, config, Parse,$http,$sessionStorage,$state) {
    var moduleName = 'AdvisorCtrl';  


 var searchObject = $location.search();
 //console.log(searchObject.UserId);

 $("#success").hide();


   $http({
  method: 'GET',
  url: config.API +'getUserDetail/'+searchObject.UserId
}).then(function successCallback(response) {
	$scope.user=response.data.users[0];
  

  }, function errorCallback(response) {
   console.log(response);
  });

	$scope.verifyuser=function(id){

		console.log(id);
$scope.sgnfrm={
	UserId:id
};
			  var request = $http({
                              method: 'POST',
    url: config.API+'ApproveAdvisor',
    data: $scope.sgnfrm,
    }).then(function(result) {

    	if(result.data.error == 0)
    	{
    		$("#success").show();
    		$("#userdetails").hide();
    	}
    	

    }, function(error) {
       
        
         
       });




	};


});