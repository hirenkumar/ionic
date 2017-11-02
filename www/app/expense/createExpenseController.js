expenseModule.controller('CreateExpenseCtrl', function($scope,$ionicScrollDelegate, $log, $location, $timeout,config, Parse,$filter,$state,$http,$sessionStorage,ionicDatePicker) {
    var moduleName = 'CreateExpenseCtrl';   
         
var sessionid=$sessionStorage.UserId;
console.log(sessionid);
if(sessionid == null)
{
    $state.go('login');
}
 

$scope.step=1;

  // $("#moredetails").hide();
$scope.formvalid=true;
$scope.formExpense = {
    UserId:sessionid,
        Amount: '',
        UserCategoryId:'',
        IsRecurring:false,
        Frequency:'',
        ExpenseDate:new Date(),
        Notes:'',
        Tags:'Tags[Optional]',
        Location:'',
        Latitude:'',
        Longitude:''
    };

//$scope.date = new Date();
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


    

     
 



 $http({
  method: 'GET',
   async:false,  
  url: config.API +'getTagDetailByUserId/'+sessionid 
}).then(function successCallback(response) {
  response.data.tags.splice(0, 0, {TagId:0,TagName:"Tags[Optional]"});
  $scope.getTags=response.data.tags;
 },
 function errorCallback(response) {
   console.log(response);
 });







 var ipObj1 = {
      callback: function (val) {  //Mandatory
       // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.formExpense.ExpenseDate=new Date(val);
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



$http({
  method: 'GET',
  url: config.API +'getUserExpenseCategoriesByUserId/'+sessionid
}).then(function successCallback(response) {
$scope.ExpenseCategory = response.data.expensesCat;
   // console.log($scope.ExpenseCategory);

  }, function errorCallback(response) {
   console.log(response);
  });

$scope.Selectedicn = "";

$scope.IconClick=function(name,id){

$scope.Selectedicn=name;
//console.log(name +","+ id);
$scope.formExpense.UserCategoryId=id;
 $scope.categoryInvalid = false;
};



 //$scope.IsRecurring = false;
  


   
 
$scope.showMoreDetails=function(){

$scope.step=2;
    $("#morelink").hide();
};



$('#datepicker').on('changeDate', function(ev){
     $scope.formExpense.ExpenseDate = $('#datepicker').val();
   
    $(this).datepicker('hide');
});



$("[name='my-checkbox']").bootstrapSwitch();


$('[data-toggle="switch"]').bootstrapSwitch().on('switchChange.bootstrapSwitch', function(e){
		
		  $scope.formExpense.IsRecurring = e.target.checked;
            $scope.$apply();
        // $timeout(function(){

          
        // });
    });



$scope.recurrences=[{name:'Weekly',id:1},{name:'Monthly',id:2},{name:'Quarterly',id:3},{name:'Yearly',id:4}];
 //$scope.recurrence = $scope.recurrences[0]; 
 


    $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
    }).datepicker('update', new Date());



$scope.updateAmount=function(){
  $scope.AmountInvalid = false;
   $scope.formvalid=true;
}



     $scope.updateLocations = function() {

            $scope.formExpense.Location = $('#location').val();
           // console.log( $scope.formExpense.Location);

      var geocoder = new google.maps.Geocoder();
            var address =  $scope.formExpense.Location;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.formExpense.Latitude = results[0].geometry.location.lat();
                     $scope.formExpense.Longitude = results[0].geometry.location.lng();
                   // console.log("Latitude: " + lat + "\nLongitude: " + lng);
                } else {
                    console.log("Request failed.")
                }
            });

            // $scope.locationInvalid = false; 
            //  $scope.formvalid=true;
    };

$scope.save=function(formExpense){




if(formExpense.ExpenseDate == '')
{
   $scope.formExpense.ExpenseDate =  $filter('date')(new Date(), "yyyy-MM-dd");
  
}
else
{

    $scope.formExpense.ExpenseDate =  $filter('date')(formExpense.ExpenseDate, "yyyy-MM-dd");
}




if(formExpense.IsRecurring == false)
{
     $scope.formExpense.IsRecurring = 0;

}
else
{
    $scope.formExpense.IsRecurring = 1;
}

    if (!angular.isDefined($scope.formExpense.UserCategoryId) || $scope.formExpense.UserCategoryId == null || $scope.formExpense.UserCategoryId == undefined || $scope.formExpense.UserCategoryId == '') {
            $scope.categoryInvalid = true;
           $scope.formvalid=false;
           // return false;
        }
        else
        {
             $scope.categoryInvalid = false;
             $scope.formvalid=true;
        }
     if( $scope.formExpense.IsRecurring == 1)
     {
       if($scope.formExpense.Frequency == undefined || $scope.formExpense.Frequency == '' || $scope.formExpense.Frequency == 'Frequency')
        {
                $scope.recurrencyInvalid = true;
                 $scope.formvalid=false;
        }
        else
        {
           $scope.recurrencyInvalid = false;
            $scope.formvalid=true;
        }        
     }
if (!angular.isDefined($scope.formExpense.Amount) || $scope.formExpense.Amount == null || $scope.formExpense.Amount == undefined || $scope.formExpense.Amount == '') {
            $scope.AmountInvalid = true;
           $scope.formvalid=false;
           // return false;
        }
        else
        {
             $scope.AmountInvalid = false;
             $scope.formvalid=true;
        }

// if($("#moredetails").is(':visible') == true)
// {
//    if (!angular.isDefined($scope.formExpense.Tags) || $scope.formExpense.Tags == null || $scope.formExpense.Tags == undefined || $scope.formExpense.Tags == '') {
//             $scope.tagsInvalid = true;
//            $scope.formvalid=false;
//            // return false;
//         }
//         else
//         {
//             $scope.tagsInvalid = false;
//              $scope.formvalid=true;
//         }

//  if (!angular.isDefined($scope.formExpense.Location) || $scope.formExpense.Location == null || $scope.formExpense.Location == undefined || $scope.formExpense.Location == '') {
//             $scope.locationInvalid = true;
//            $scope.formvalid=false;
//            // return false;
//         }
//         else
//         {
//             $scope.locationInvalid = false;
//              $scope.formvalid=true;
//         }


// }

$scope.formExpense.Tags= formExpense.Tags.TagName;   

console.log(formExpense);

if( $scope.formvalid){
 var request = $http({
    method: 'POST',
    url: config.API+'addExpense',
    data: formExpense,
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
             $("#expenseerrors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('createExpense');
             $timeout(function () {
      
               $("#rexpenseerrors").html('');
            }, 2000);   
          }

         }, function(error) {
       
         console.log(error);
         
       });


}

};


});

app.directive('googleplace', function () {

              
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {
                }
            };

            

            var EventLocation = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(EventLocation, 'place_changed', function () {
                scope.Longitude = '0';
                scope.Latitude = '0';
                scope.EventLocation = EventLocation.getPlace();
                var length = scope.EventLocation.address_components.length;
                for (var i = 0; i < length; i++) {
                    if (scope.EventLocation.address_components[i].types[0] == 'country') {
                        scope.ShortCountryName = scope.EventLocation.address_components[i].short_name;
                    }
                }

                scope.Longitude = scope.EventLocation.geometry.location.lng();
                scope.Latitude = scope.EventLocation.geometry.location.lat();
                 
                scope.$apply(function () {
                //  alert("apply in directive")
                 // $('#location').val(element.val());
                    model.$setViewValue(element.val());
                });
            });
        }
    };

});
