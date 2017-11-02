app.config(function($stateProvider,$locationProvider, $httpProvider, $urlRouterProvider, $provide, $ionicConfigProvider, ParseProvider,$cordovaFacebookProvider,$facebookProvider,GoogleSigninProvider,ionicDatePickerProvider) {
    ParseProvider.initialize('7W0O3greTpwzsUVfVmtVeGeUL6K90gzXT6HMPvT8', 'UXhaC9ciqFtZ9l6BBYgpqa3qzeYRHkbXL9ruuNKs'); // application key, javascript key
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    // $ionicConfigProvider.views.maxCache(0);
    
  //    var appID = 1197062883710760;
  // var version = "v2.0"; // or leave blank and default is v2.0
  // $cordovaFacebookProvider.browserInit(appID, version);

// var appID = '1197062883710760';
//   var version = "v2.0"; // or leave blank and default is v2.0
//   $cordovaFacebookProvider.browserInit(appID, version);

$facebookProvider.setAppId('1197062883710760');
$facebookProvider.setPermissions("email,user_likes");

   GoogleSigninProvider.init({
        client_id: '184330649977-50u8l5u40r87sanspro62l5835dh53l1.apps.googleusercontent.com',
     });


 var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      // weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      // monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      // from: new Date(2012, 8, 1),
      // to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

    
    $provide.decorator('$log', ['$delegate', function ($delegate) {
        var origLog = $delegate.log;
        var origInfo = $delegate.info;
        var origError = $delegate.error;
        var origWarn = $delegate.warn;
        var origDebug = $delegate.debug;
                
        $delegate.log = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origLog.apply(null, log)
        };

        $delegate.info = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origInfo.apply(null, log)
        };

        $delegate.error = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origError.apply(null, log)
        };

        $delegate.warn = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origWarn.apply(null, log)
        };

        $delegate.debug = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origDebug.apply(null, log)
        };

        return $delegate;
    }]);

    // We need to setup some parameters for http requests
    // These three lines are all you need for CORS support
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    // to fix an issue that $http.post does not pass parameters to $_REQUEST
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.interceptors.push(['$q', function($q) {
        return {
            request: function(config) {
                if (config.data && typeof config.data === 'object') {
                    config.data = $.param(config.data);
                }
                return config || $q.when(config);
            }
        };
    }]);            

    $stateProvider    

  //   .state('app', {
  //   url: '/app',
  //   abstract: true,
  //   templateUrl: 'templates/menu.html',
  //   controller: 'AppCtrl'
  // })

  // .state('app.home', {
  //   url: '/',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/search.html'
  //     }
  //   }
  // })




    .state('home', {
        url: '/', 
        cache: false,       
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'        
    })

     .state('advisorlink', {
        url: '/advisorlink',
        cache: false,        
        templateUrl: 'app/advisor/advisor.html',
        controller: 'AdvisorCtrl'        
    })

    .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'        
    })    

    .state('signup', {
        url: '/signup', 
       cache: false,       
        templateUrl: 'app/signup/signup.html',
        controller: 'SignupCtrl'        
    })    

    .state('dashboard', {
        url: '/dashboard', 
        cache: false,       
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl'        
    })    

    .state('diary', {
        url: '/diary', 
        cache: false,       
        templateUrl: 'app/diary/diary.html',
        controller: 'DiaryCtrl'        
    })    

    .state('createExpense', {
        url: '/expense/create', 
        cache: false,       
        templateUrl: 'app/expense/createExpense.html',
        controller: 'CreateExpenseCtrl'        
    })    

    .state('expenses', {
        url: '/expense/all',  
        cache: false,      
        templateUrl: 'app/expense/expenseList.html',
        controller: 'ExpenseListCtrl'        
    })    

    .state('diaryIncome',{
        url:'/diary/IncomeEntry/:id',
        cache:false,
         templateUrl: 'app/diary/IncomeEntry.html',
        controller: 'IncomeEntryCtrl' 
    })

     .state('diaryExpense',{
        url:'/diary/ExpenseEntry/:id',
        cache:false,
         templateUrl: 'app/diary/ExpenseEntry.html',
        controller: 'ExpenseEntryCtrl' 
    })

    .state('connect', {
        url: '/connect', 
        cache: false,       
        templateUrl: 'app/connect/connect.html',
        controller: 'ConnectCtrl'        
    })    

     .state('forgotpassword', {
        url: '/forgotpassword', 
        cache: false,       
        templateUrl: 'app/forgotpassword/forgotpassword.html',
        controller: 'ForgotpasswordCtrl'        
    })    
    
   .state('resetpassword', {
        url: '/resetpassword', 
        cache: false,       
        templateUrl: 'app/resetpassword/resetpassword.html',
        controller: 'ResetpasswordCtrl'        
    })    

   
    .state('incomeselect', {            
        url: '/income/select',
        cache: false,
        templateUrl: 'app/income/selectIncome.html',
        controller: 'SelectIncomeCtrl'        
    })    
    .state('createIncome', {
        url: '/income/create',
        cache: false,        
        templateUrl: 'app/income/createIncome.html',
        controller: 'CreateIncomeCtrl'        
    })    

    .state('incomes', {
        url: '/income/all', 
        cache: false,       
        templateUrl: 'app/income/incomeList.html',
        controller: 'IncomeListCtrl'        
    })    

    .state('result', {
        url: '/result',  
       cache: false,      
        templateUrl: 'app/result/result.html',
        controller: 'ResultCtrl'        
    })    

    .state('settings', {
        url: '/settings', 
        cache: false,       
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl'        
    })    

   
    .state('about', {
        url: '/about', 
        cache: false,       
        templateUrl: 'app/about/about.html',
        controller: 'AboutCtrl'        
    })   

    .state('privacy', {
        url: '/privacy', 
        cache: false,       
        templateUrl: 'app/privacy/privacy.html',
        controller: 'PrivacyCtrl'        
    })   

    .state('terms', {
        url: '/terms', 
        cache: false,       
        templateUrl: 'app/terms/terms.html',
        controller: 'TermsCtrl'        
    })   
   
    .state('logout',{
        url:'/logout',
        cache:false,
         controller: function($state,$sessionStorage) {
           $sessionStorage.UserId="";
           console.log("session", $sessionStorage.UserId);
            $state.go('home');
        }
    })

     $locationProvider.html5Mode(true);
                $locationProvider.hashPrefix('!');
 
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});