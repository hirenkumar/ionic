signupModule.controller('SignupCtrl', function($scope, $cordovaOauth,$log, $location, config, Parse ,$http,$state,$timeout,$facebook,GoogleSignin,$ionicScrollDelegate,$cordovaFacebook,$sessionStorage) {
    var moduleName = 'SignupCtrl';  

// $http({
//   method: 'GET',
//   url: config.API +'GetSessionUserId'
// }).then(function successCallback(response) {
//   console.log(response);
//     // this callback will be called asynchronously
//     // when the response is available
//   }, function errorCallback(response) {
//     // called asynchronously if an error occurs
//     // or server returns response with an error status.
//   });






    $scope.step=1;
 $scope.step1submitted=false;

$scope.sgnfrm = {
        Username: '',
        EmailId:'',
        Password:'',
        Role:'User',
        Image:'',
        IncomeCategories:'',
        ExpenseCategories:'',
        FacebookId:'',
        GooglePlusId:''
    };
// var container = angular.element(document);
// container.on('scroll', function() {
//     if (container.scrollTop() > 1000) {
//         $('#scroll-top-button').addClass('show');
//     } else {
//         $('#scroll-top-button').removeClass('show');
//     }
// });




 $('#text2').hide();
 $('#text3').hide();

    $scope.changestep=function(step){
     
     $scope.$apply(function()
     {
      $scope.step=step;
     })

    };


//     $scope.fbLogin=function(){

//  //   $cordovaOauth.facebook("1197062883710760", ["email"]).then(function(result) {
//  // alert("Auth Success..!!"+result);
//  // }, function(error) {
//  // alert("Auth Failed..!!"+error);
//  // });

//   var fbLoginSuccess = function (userData) {
//   console.log("UserInfo: ", userData);
// }
 
// facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,
//   function loginError (error) {
//     console.error(error)
//   }
// );



// };




      $scope.fbLogin = function () {
			console.log("facebooklogin");
          $facebook.login().then(function (response) {
                     
                        $facebook.api('/me?fields=first_name,last_name,link,picture.width(200).height(200),verified,email,about,birthday,education,location,website,work,cover,languages').then(function (data) {
                            $scope.facebook = $facebook.getAuthResponse();
                             $scope.facebook.data = data;
                           //  console.log($scope.facebook);

                             $scope.sgnfrm.Username=$scope.facebook.data.first_name;
                            $scope.sgnfrm.EmailId=$scope.facebook.data.email;
 $scope.sgnfrm.Image=$scope.facebook.data.picture.data.url;
 $scope.sgnfrm.Password=null;
 $scope.sgnfrm.FacebookId=$scope.facebook.data.id;
                             var request = $http({
                              method: 'POST',
     url: config.API+'registration',
    data: $scope.sgnfrm,
     }).then(function(result) {
            if(result.data.error == 0)
            {
           $scope.step=3;
             $('#step3logo').addClass('activelogo');
             $('#text2').hide();
             $('#text3').show();
            }
           else if(result.data.error == 1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $state.go('login');
              $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

            }
        }, function(error) {
       
          $scope.changestep(1);
         
        });
                         });
                     }, function (err) {
                         console.log(err);
                    });


        };

$scope.googleLogin=function(){
console.log("google login");
  GoogleSignin.signIn().then(function (response) {

                         gapi.client.load('plus', 'v1', function () {

                        gapi.client.plus.people.get({userId: 'me'}).execute(function (data) {
                                   
                           
  $scope.sgnfrm.Username=data.displayName;
                           $scope.sgnfrm.EmailId=data.emails[0].value;
$scope.sgnfrm.Image=data.image.url;
//$scope.sgnfrm.Password=null;
$scope.sgnfrm.GooglePlusId=data.id;
                            

                        var request = $http({
                              method: 'POST',
    url: config.API+'registration',
    data: $scope.sgnfrm,
    }).then(function(result) {
           if(result.data.error == 0)
           {
          $scope.step=3;
            $('#step3logo').addClass('activelogo');
              $('#text2').hide();
            $('#text3').show();
           }
           else if(result.data.error == 1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

           }
       }, function(error) {
       
          $scope.changestep(1);
         
       });
                        //         // data.platform = 'google';
                        //         // $scope.platform = 'Google';
                               
                        //         // $scope.google = angular.extend(GoogleSignin.getUser().getAuthResponse(), GoogleSignin.getBasicProfile());
                        //         // $scope.google.data = data;
                        //         // var request = AuthService.socialLogin($scope.google);
                        //         // $scope.loginProcess(request);
                            });
                         });
                    }, function (err) {
                        console.log(err);
                   });
};


 $scope.steponefinish=function(signupForm)
    {
       $scope.step1submitted=true;
       if(signupForm.Username.$valid && signupForm.EmailId.$valid && signupForm.Password.$valid )
       {

          $scope.step=2;
           $ionicScrollDelegate.scrollTop();
     //  angular.element('html,body').animate({scrollTop: 1000}, 1000);
        //  $('#step1logo').removeClass('activelogo');
           $('#step2logo').addClass('activelogo');
            $('#text1').hide();
            $('#text2').show();
       }
       // else
       // {
       //   $("#register-errors").html('<div style="font-size: 17px;">You must provide a User Image.</div>');
       //    // $timeout(function () {
      
       //    //      $("#register-errors").html('');
       //    //   }, 3000);  

//&&  $('input[type="file"]')[0].files.length > 0 

       // }


    }	

$scope.myFunction=function()
{
  $scope.step1submitted=true;
}


$http({
  method: 'GET',
  url: config.API +'getExistingCategories'
}).then(function successCallback(response) {

  $scope.expenses=response.data.expensesCat;
  $scope.Incomes=response.data.incomeCat;
  // console.log(response.data.expensesCat);
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });


 //$scope.Incomes = [ { name: "Wage" }, { name: "Salary" }, { name: "Pocket Money" },{ name: "Gifts" } ];
    $scope.selectionincomes = [];
      $scope.selectionincomesnames = [];
$scope.toggleselection=function(income){

	$scope.selectionincomes.push(income);
  $scope.selectionincomesnames.push(income.CategoryName);
  console.log(JSON.stringify($scope.selectionincomes));
   console.log($scope.selectionincomesnames);
};
 
  
//$scope.expenses = [ { name: "Travel" }, { name: "Shopping" }, { name: "Entertainment" },{ name: "Education" } ];
    $scope.selectionexpenses = [];
 $scope.selectionexpensesnames = [];
$scope.toggleselectionexpense=function(expense){

	$scope.selectionexpenses.push(expense);
   $scope.selectionexpensesnames.push(expense.CategoryName);
};



 var fd = new FormData();
 $scope.LoadFileData = function (files) {
  
//console.log(files)
var reader = new FileReader();

            reader.onload = function (e) {
           
                $('.rndfilediv')
                    .css({'background-image': 'url("'+e.target.result+'")'});

                  //  fd.append("file",e.target.result);

            };

            reader.readAsDataURL(files[0]);
     fd.append("file", files[0]);   
    //  $scope.filesize=files[0].size;

   $scope.sgnfrm.Image=files[0].name;

    };




$scope.IncomeCategories='';
$scope.ExpenseCategories='';


 usercategory = new Array();     


$scope.register=function(sgnfrm)
{


angular.forEach($scope.selectionincomesnames, function(value, key) {
 // alert(value);
  $scope.IncomeCategories = $scope.IncomeCategories + "," + value;
});

while($scope.IncomeCategories.charAt(0) === ',')
    $scope.IncomeCategories = $scope.IncomeCategories.substr(1);



angular.forEach($scope.selectionexpensesnames, function(value, key) {
  $scope.ExpenseCategories = $scope.ExpenseCategories + "," + value;
});

while($scope.ExpenseCategories.charAt(0) === ',')
    $scope.ExpenseCategories = $scope.ExpenseCategories.substr(1);


$scope.sgnfrm.Username=sgnfrm.Username;
$scope.sgnfrm.EmailId=sgnfrm.EmailId;
$scope.sgnfrm.Password=sgnfrm.Password;
$scope.sgnfrm.Role=sgnfrm.Role;
$scope.sgnfrm.IncomeCategories=$scope.IncomeCategories;
$scope.sgnfrm.ExpenseCategories=$scope.ExpenseCategories;

//console.log(sgnfrm);
 

if(sgnfrm.Image == "" || sgnfrm.Image == null)
{
  
   $scope.loadregister=true;
   var request = $http({
    method: 'POST',
    url: config.API+'registration',
    data: $scope.sgnfrm,
    }).then(function(result) {
           if(result.data.error == 0)
           {
           
              angular.forEach($scope.selectionincomes, function(value, key) {
                  usercategory.push({
                     "CategoryName":value.CategoryName ,
                      "CategoryImage": value.CategoryImage,
                       "CategoryType":value.CategoryType,
                     "UserId": result.data.users[0].UserId
                  });
                });

                 angular.forEach($scope.selectionexpenses, function(value, key) {
 
                  usercategory.push({
                     "CategoryName":value.CategoryName ,
                      "CategoryImage": value.CategoryImage,
                       "CategoryType":value.CategoryType,
                     "UserId": result.data.users[0].UserId
                  });
                }); 

              
              

                angular.forEach(usercategory,function(value,key){
                       var request = $http({
                                            method: 'POST',
                                            url: config.API+'addUserCategory',
                                            data: value,
                                              }).then(function(result) {
                                                    console.log(result)
                                              }, function(error) {
                                                         console.log(error)
                                              });
                });  
                var request = $http({
    method: 'POST',
    url: config.API+'login',
    data: $scope.sgnfrm,
    }).then(function(result) {
          if(result.data.error == 0)
           {
               

                 $sessionStorage.UserId=result.data.users[0].UserId;

             $ionicScrollDelegate.scrollTop();
          
          $scope.loadregister=false;
          $scope.step=3;
           $ionicScrollDelegate.scrollTop();
            $('#step3logo').addClass('activelogo');
              $('#text2').hide();
            $('#text3').show();
           }
           else if(result.data.error == 1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

           }
            else if(result.data.error == -1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

           }

 }, function(error) {
       alert("login error",error)
          $state.go('login');
         
       });


                //login end            
           }
           else if(result.data.error == 1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

           }
       }, function(error) {
       
          $scope.changestep(1);
         
       });
}
else
{
  $scope.loadregister=true;


$.ajax({
    url : config.API+'upload',
    type: "POST",
    data : fd,
    processData: false,
    contentType: false,
    success:function(res){ 
      $scope.sgnfrm.Image=res;
  
     var request = $http({
    method: 'POST',
    url: config.API+'registration',
    data: $scope.sgnfrm,
    }).then(function(result) {
           if(result.data.error == 0)
           {

               angular.forEach($scope.selectionincomes, function(value, key) {
                  usercategory.push({
                     "CategoryName":value.CategoryName ,
                      "CategoryImage": value.CategoryImage,
                       "CategoryType":value.CategoryType,
                     "UserId": result.data.users[0].UserId
                  });
                });

                 angular.forEach($scope.selectionexpenses, function(value, key) {
 
                  usercategory.push({
                     "CategoryName":value.CategoryName ,
                      "CategoryImage": value.CategoryImage,
                       "CategoryType":value.CategoryType,
                     "UserId": result.data.users[0].UserId
                  });
                }); 

              
              

                angular.forEach(usercategory,function(value,key){
                       var request = $http({
                                            method: 'POST',
                                            url: config.API+'addUserCategory',
                                            data: value,
                                              }).then(function(result) {
                                                    console.log(result)
                                              }, function(error) {
                                                         console.log(error)
                                              });
                });  
            var request = $http({
         method: 'POST',
    url: config.API+'login',
    data: $scope.sgnfrm,
    }).then(function(result) {
          if(result.data.error == 0)
           {
                  $sessionStorage.UserId=result.data.users[0].UserId;
             $ionicScrollDelegate.scrollTop();
          
          $scope.loadregister=false;
          $scope.step=3;
           $ionicScrollDelegate.scrollTop();
            $('#step3logo').addClass('activelogo');
              $('#text2').hide();
            $('#text3').show();
           }
           else if(result.data.error == 1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

           }
            else if(result.data.error == -1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

           }

 }, function(error) {
       
          $state.go('login');
         
       });
           }
           else if(result.data.error == 1)
           {
            $("#register-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#register-errors").html('');
            }, 2000);   

           }
       }, function(error) {
       
          $scope.changestep(1);
         
       });
    }
  });

}









// var request = $http({
//     method: 'POST',
//     url: config.API+'registration',
//     data: $scope.sgnfrm,
//     }).then(function(result) {
     
//            if(result.data.error == 0)
//            {
    
//              $state.go('login');
//            }
//            else if(result.data.error == 1)
//            {
//             $("#login-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
//             $state.go('login');
//              $timeout(function () {
      
//                $("#login-errors").html('');
//             }, 2000);   

//            }
//        }, function(error) {
       
//           $scope.changestep(1);
         
//        });




// $.ajax({
//     url : config.API+'register',
//     type: "POST",
//     data : fd,
//     processData: false,
//     contentType: false,
//     success:function(res){ 
//       alert(res);

//     }
//   });














//   fd.append("Username",sgnfrm.Username);

//   fd.append("EmailId",sgnfrm.EmailId);

//  fd.append("Password",sgnfrm.Password);

//  fd.append("Role",sgnfrm.Role);
   
//  fd.append("IncomeCategories",$scope.selectionincomes);
   
//     fd.append("ExpenseCategories",$scope.selectionexpenses);

// $.ajax({
//     url : config.API+'register',
//     type: "POST",
//     data : fd,
//     processData: false,
//     contentType: false,
//     success:function(res){ 
   
//        if(res.error == 0)
//        {
      
//       $scope.changestep(3);

//        }
//        else if(res.error == 1)
//        {
//          $("#register-errors").html('<div style="font-size: 14px;">'+result.message+'</div>');
//           $timeout(function () {      
//                $("#register-errors").html('');
//             }, 2000);  
//            $scope.changestep(1);
//        }
//     },
//     error: function(error){
//         //if fails   
//        console.log(error);
//         $("#register-errors").html('<div style="font-size: 14px;">Error In Registeration</div>');
//        $scope.changestep(2);
//         $timeout(function () {      
//                $("#register-errors").html('');
//             }, 5000); 
//     }
// });



/* $http.post('http://192.168.2.105:3000/getcashy/register', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': 'multipart/form-data' },
        }).success(function (data) {
             
                if (data.error == 0) {
                	alert(data.message);
                   $scope.step=3;
                }
                else if (data.error == 1) {
                   alert(data.message);
                }
                else if (data.error == 2) {
                   alert(data.message);
                }
                else {
                   alert("Else");
                }

            });    */  
};



});