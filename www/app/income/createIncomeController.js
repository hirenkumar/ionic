incomeModule.controller('CreateIncomeCtrl', function($scope,$ionicScrollDelegate, $log,$stateParams,$filter, $location, config, Parse,$sessionStorage,$state,$http,ionicDatePicker,$timeout) {
    var moduleName = 'CreateIncomeCtrl';   
var sessionid=$sessionStorage.UserId;
if(sessionid == null)
{
    $state.go('login');
}
$scope.step=1;
//$("#moredetails").hide();
$scope.formvalid=true;
$scope.formIncome = {
    UserId:sessionid,
        Amount: '',
        UserCategoryId:'',
        IsRecurring:false,
        Frequency:'',
        IncomeDate:new Date(),
        Notes:'',
        Tags:'Tags[Optional]'
    };
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


     //  $scope.$on('$includeContentLoaded', function(event){
     
         
          

            // $('#mobile-page-overlay').on('click', function(){
               
            //     $scope.hideMobileNavMenu();
            // });
           
  //  });

     




   $http({
  method: 'GET',
   async:false,  
  url: config.API +'getTagDetailByUserId/'+sessionid 
}).then(function successCallback(response) {
  response.data.tags.splice(0, 0, {TagId:0,TagName:"Tags[Optional]"});
 // response.data.tags.push({TagId:0,TagName:"Tags[Optional]"});
  $scope.getTags=response.data.tags;
  console.log($scope.getTags)

 },
 function errorCallback(response) {
   console.log(response);
 });   




 $http({
  method: 'GET',
  url: config.API +'getUserIncomeCategoriesByUserId/'+sessionid
}).then(function successCallback(response) {
$scope.Incomecategory = response.data.incomeCat;
   // console.log($scope.ExpenseCategory);

  }, function errorCallback(response) {
   console.log(response);
  });


$scope.Selectedicn = "";
$scope.IconClick=function(name,id){

$scope.Selectedicn=name;
//console.log(name +","+ id);
$scope.formIncome.UserCategoryId=id;
 $scope.categoryInvalid = false;
};



$("[name='my-checkbox']").bootstrapSwitch();


$('[data-toggle="switch"]').bootstrapSwitch().on('switchChange.bootstrapSwitch', function(e){
		
	 $scope.formIncome.IsRecurring = e.target.checked;
            $scope.$apply();
        // $timeout(function(){

          
        // });
    });

$scope.showMoreDetails=function(){

$scope.step=2;
    $("#morelink").hide();
};

$scope.recurrences=[{name:'Weekly',id:1},{name:'Monthly',id:2},{name:'Quarterly',id:3},{name:'Yearly',id:4}];


var ipObj1 = {
      callback: function (val) {  //Mandatory
       // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.formIncome.IncomeDate=new Date(val);
      },
      // from: new Date(2012, 1, 1), //Optional
      // to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      // disableWeekdays: [0],       //Optional
      closeOnSelect: true,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };

$('#datepicker').on('changeDate', function(ev){
     $scope.formIncome.IncomeDate = $('#datepicker').val();
   
    $(this).datepicker('hide');
});


    $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
    }).datepicker('update', new Date());

$scope.updateAmount=function(){
  $scope.AmountInvalid = false;
   $scope.formvalid=true;
}


$scope.save=function(formIncome){


if(formIncome.IncomeDate == '')
{
   $scope.formIncome.IncomeDate =  $filter('date')(new Date(), "yyyy-MM-dd");
  
}
else
{

    $scope.formIncome.IncomeDate =  $filter('date')(formIncome.IncomeDate, "yyyy-MM-dd");
}

    if(formIncome.IsRecurring == false)
{
     $scope.formIncome.IsRecurring = 0;

}
else
{
    $scope.formIncome.IsRecurring = 1;
}

  if (!angular.isDefined($scope.formIncome.UserCategoryId) || $scope.formIncome.UserCategoryId == null || $scope.formIncome.UserCategoryId == undefined || $scope.formIncome.UserCategoryId == '') {
            $scope.categoryInvalid = true;
           $scope.formvalid=false;
           // return false;
        }
        else
        {
             $scope.categoryInvalid = false;
             $scope.formvalid=true;
        }

 if (!angular.isDefined($scope.formIncome.Amount) || $scope.formIncome.Amount == null || $scope.formIncome.Amount == undefined || $scope.formIncome.Amount == '') {
            $scope.AmountInvalid = true;
           $scope.formvalid=false;
           // return false;
        }
        else
        {
             $scope.AmountInvalid = false;
             $scope.formvalid=true;
        }

$scope.formIncome.Tags= formIncome.Tags.TagName;  
console.log(formIncome);
if( $scope.formvalid){
 var request = $http({
    method: 'POST',
    url: config.API+'addIncome',
    data: formIncome,
    }).then(function(result) {

        console.log(result);
          if(result.data.error == 0)
          {
           $ionicScrollDelegate.scrollTop();
            $("#SuccessMsg").html('<div style="font-size: 14px;color:green;"><i class="fa fa-check"></i> Success</div>');
            $state.go('result');
          
             $timeout(function () {
      
               $("#SuccessMsg").html('');
            }, 2000);   

          }
          else if(result.data.error == 1)
          {
               $ionicScrollDelegate.scrollTop();
             $("#incomeerrors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('createIncome');
             $timeout(function () {
      
               $("#incomeerrors").html('');
            }, 2000);   
          }

         }, function(error) {
       
         console.log(error);
         
       });


}

};



 
});