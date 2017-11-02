var loginModule = angular.module('login', []);
var signupModule = angular.module('signup', []);
// signupModule.config(function($cordovaFacebookProvider) {
//   var appID = 1197062883710760;
//   var version = "v2.0"; // or leave blank and default is v2.0
//   $cordovaFacebookProvider.browserInit(appID, version);
// });
var dashboardModule = angular.module('dashboard', []);
var diaryModule = angular.module('diary', []);
var expenseModule = angular.module('expense', []);
var connectModule = angular.module('connect', []);
var glanceModule = angular.module('glance', []);
var goalModule = angular.module('goal', []);
var homeModule = angular.module('home', []);
var incomeModule = angular.module('income', []);
var resultModule = angular.module('result', []);
var settingsModule = angular.module('settings', []);
var wishlistModule = angular.module('wishlist', []);
var advisorApproveModule = angular.module('advisor', []);
var directivesModule = angular.module('directives', []);
var aboutModule = angular.module('about', []);
var privacyModule = angular.module('privacy', []);
var termsModule = angular.module('terms', []);
var forgotpassword = angular.module('forgotpassword',[]);
var resetpasswordModule = angular.module('resetpassword',[]);


var app = angular.module('cashy',['mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module','ionic', 'angular-underscore', 'ngStorage', 'ngCordova', 'ngParse',
    'login', 'signup','about','privacy','terms','forgotpassword','resetpassword', 'dashboard', 'diary', 'expense', 'connect', 'glance', 'goal', 'home', 'income', 'directives','result', 'settings', 'wishlist','advisor','ngFacebook' ,'google-signin','googlechart','ionic-datepicker','nya.bootstrap.select'])
    .controller('AppCtrl', function($scope,$http, $location, $ionicHistory, config,$ionicScrollDelegate,$rootScope,$state,$sessionStorage) {   

      //ngFB.init({appId: '1197062883710760'});
        
    // var viewstate=  $ionicHistory.currentStateName();
    //   console.log(viewstate)

       var sessionid=$sessionStorage.UserId;
    if(sessionid == null)
    {
      $state.go('login');
    }
   

    


    });

app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++) {
            input.push(i);      
        }
      
        return input;
    };
});

app.run(function($ionicPlatform,$rootScope, $state) {               


  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) return;
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
             cordova.plugins.Keyboard.disableScroll(true);
        }


        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

    });

   

   // $rootScope.$on('$stateChangeSuccess', 
   //      function(event, toState, toParams, fromState, fromParams){
   //          alert();
   //          toState.reload();       
   //              //alert(JSON.stringify(toState));
   //      });

$rootScope.$on('$stateChangeSuccess', 
     function(event, toState, toParams, fromState, fromParams){
     Tawk_API = Tawk_API || {};
    
         if(toState.name == 'connect')
     {
       Tawk_API.showWidget();
     }
     else
     {
       Tawk_API.hideWidget();
     }
     });

});




app.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);

app.directive('validateUsername', function () {
    var regex = /^[a-z][\w\.]{4,24}$/i;
    return {
        require: "ngModel",
        link: function(scope, elm, attrs, ngModelController){
            ngModelController.$parsers.unshift(function(viewValue) {
                if (regex.test(viewValue)) {
                    ngModelController.$setValidity('username', true);
                    return viewValue;
                }
                ngModelController.$setValidity('username', false);
                return undefined;
            });
        }
    };
});

