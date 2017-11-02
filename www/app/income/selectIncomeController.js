incomeModule.controller('SelectIncomeCtrl', function($scope, $log, $location, config, Parse,$sessionStorage,$state) {
    var moduleName = 'SelectIncomeCtrl';    

var sessionid=$sessionStorage.UserId;
if(sessionid == null)
{
	$state.go('login');
}

        
});