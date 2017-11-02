diaryModule.controller('DiaryCtrl', function($state, $ionicScrollDelegate,$filter,moment,$http, $timeout, calendarConfig,$scope, $sessionStorage,$log, $location, config, Parse,$ionicModal,calendarEventTitle) {
    var moduleName = 'DiaryCtrl';   


    var sessionid=$sessionStorage.UserId;
if(sessionid == null)
{
	$state.go('login');
}
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

$scope.loadevents=false;
$scope.monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//var d = new Date();
 var originalEventTitle = angular.copy(calendarEventTitle);

    calendarEventTitle.monthViewTooltip = calendarEventTitle.weekViewTooltip = calendarEventTitle.dayViewTooltip = function() {
      return '';
    };

    // required so other demos work as before
    $scope.$on('$destroy', function() {
      angular.extend(calendarEventTitle, originalEventTitle);
    });


$scope.calendarTitle=$scope.monthNames[new Date().getMonth()];


  var vm = this;

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
  
    $scope.viewDate = new Date();
    

    $scope.actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
       // alert.show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
       // alert.show('Deleted', args.calendarEvent);
      }
    }];

  

$scope.AllEvent = [];

     $http({
  method: 'GET',
   async:false,  
  url: config.API +'getIncomeEvents/'+sessionid 
}).then(function successCallback(response) {
 //console.log(response.data.Events);
    $scope.IncomeEvents=response.data.Events;

    angular.forEach($scope.IncomeEvents, function(value, key) {
             //   Incomes = new Array();
                  $scope.AllEvent.push({
                     "title":"Income:$"+value.Income ,
                     "Type":"Income",
                      "color": calendarConfig.colorTypes.success,
                      "startsAt":value.IncomeDate,
                     // "startsAt":moment(value.IncomeDate).format('ll'),                      
                        "resizable": true,
                          "incrementsBadgeTotal": false,
                        "actions":   $scope.actions
                  });
            //  console.log($scope.AllEvent);
                 // AllEvent.push(Incomes);
                });
   },
 function errorCallback(response) {
   console.log(response);
 });

  $( "*[data-cal-date]").unbind( "click" );

 $http({
  method: 'GET',
   async:false,  
  url: config.API +'getExpenseEvents/'+sessionid 
}).then(function successCallback(response) {
 //console.log(response.data.Events);
    $scope.ExpenseEvents=response.data.Events;

    angular.forEach($scope.ExpenseEvents, function(value, key) {
             //   Incomes = new Array();
                  $scope.AllEvent.push({
                     "title":"Expense:$"+value.Expense ,
                     "Type":"Expense",
                      "color": calendarConfig.colorTypes.important,
                      "startsAt":value.ExpenseDate,
                    //  "startsAt":moment(value.ExpenseDate).format('ll'),                    
                        "resizable": true,
                        "incrementsBadgeTotal": false,
                        "actions":   $scope.actions
                  });
                //console.log( AllEvent);
                 // AllEvent.push(Incomes);
                });
   },
 function errorCallback(response) {
   console.log(response);
 });




//$scope.loadevents=false;
    // $scope.nwevents = [
    //   {
    //     "title": 'An event',
    //     "color": calendarConfig.colorTypes.warning,
    //     "startsAt": moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
    //     "endsAt": moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
    //     "draggable": true,
    //     "resizable": true,
    //     "actions":   $scope.actions
    //   }, {
    //     "title": '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
    //     "color": calendarConfig.colorTypes.info,
    //     "startsAt": moment().subtract(1, 'day').toDate(),
    //     "endsAt": moment().add(5, 'days').toDate(),
    //     "draggable": true,
    //     "resizable": true,
    //     "actions":   $scope.actions
    //   }, {
    //     "title": 'This is a really long event title that occurs on every year',
    //     "color": calendarConfig.colorTypes.important,
    //     "startsAt": moment().startOf('day').add(7, 'hours').toDate(),
    //     "endsAt": moment().startOf('day').add(19, 'hours').toDate(),
    //     "recursOn": 'year',
    //     "draggable": true,
    //     "resizable": true,
    //     "actions":   $scope.actions
    //   }
    // ];

    $scope.cellIsOpen = false;

    $scope.addEvent = function() {
      vm.events.push({
        title: 'New event',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color: calendarConfig.colorTypes.important,
        draggable: true,
        resizable: true
      });
    };

    $scope.eventClicked = function(event) {

     $scope.getevent = event;
     var dt =$filter('date')(event.startsAt, "yyyy-MM-dd");
    
      if(event.Type == "Income"){
       
                $http({
          method: 'GET',
           async:false,  
          url: config.API +'getCalendarIncomeSummary/'+dt+'/'+ sessionid
        }).then(function successCallback(response) {
        
           
          $scope.ModalDetails = response.data.Incomes;
          $scope.ModelHeaderDate = moment($scope.ModalDetails[0].Date).format('Do MMMM YYYY');
           console.log( $scope.ModalDetails)
           console.log($scope.getevent);
          $scope.openModal();
         },
         function errorCallback(response) {
           console.log(response);
         });
      }
      else if(event.Type == "Expense")
      {

                $http({
          method: 'GET',
           async:false,  
          url: config.API +'getCalendarExpenseSummary/'+dt+'/'+ sessionid
        }).then(function successCallback(response) {
           $scope.ModalDetails = response.data.Expenses;
            $scope.ModelHeaderDate =moment($scope.ModalDetails[0].Date).format('Do MMMM YYYY');

           
          $scope.openModal();
         },
         function errorCallback(response) {
           console.log(response);
         });
      }

    };

    $scope.BreakdownClick=function(gid,flag){
      console.log(gid,"+++++++++",flag);

      if(flag  == "Income")
      {
        $state.go('diaryIncome', {id: gid});
      }
      else if(flag == "Expense")
      {
        $state.go('diaryExpense', {id: gid});
      }            
    }




    $scope.eventEdited = function(event) {
      //alert.show('Edited', event);
    };

     $scope.eventDeleted = function(event) {
     // alert.show('Deleted', event);
    };

     $scope.eventTimesChanged = function(event) {
     // alert.show('Dropped or resized', event);
    };

     $scope.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    $scope.timespanClicked = function(date, cell) {

      if ( $scope.calendarView === 'month') {
        if (( $scope.cellIsOpen && moment(date).startOf('day').isSame(moment( $scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
           $scope.cellIsOpen = false;
        } else {
           $scope.cellIsOpen = true;
           $scope.viewDate = date;
        }
      } else if ( $scope.calendarView === 'year') {
        if (( $scope.cellIsOpen && moment(date).startOf('month').isSame(moment( $scope.viewDate).startOf('month'))) || cell.events.length === 0) {
           $scope.cellIsOpen = false;
        } else {
           $scope.cellIsOpen = true;
           $scope.viewDate = date;
        }
      }

    };


    $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();

  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });





    // $("#dtBox").DateTimePicker({            
    //     dateFormat: "MM-dd-yyyy",
    //     timeFormat: "HH:mm",
    //     dateTimeFormat: "MM-dd-yyyy HH:mm:ss AA"                
    // });            
});