resultModule.controller('ResultCtrl', function($scope, $ionicScrollDelegate, $timeout,$log,$state, $http,$location, config, Parse,$sessionStorage) {
  var moduleName = 'ResultCtrl'; 


  //session management    
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


    
//global variables
$scope.loadchart=false;
$scope.TotalIncome=0;
$scope.TotalExpense=0;
$scope.NetIncome=0;
$scope.Saving=0;
$scope.Invest=0;
$scope.Monthview=false;
$scope.duration="Year";
$scope.Card1Header="Year";
$("#yearselector").hide();
$scope.ByDefaultMonthYear=new Date().getFullYear();
//api calling to get year list of the user



//function call when year into month view getting change
$scope.monthyearchange=function(selcetedyser){

  $scope.ByDefaultMonthYear=selcetedyser.Year;

//  console.log( $scope.ByDefaultMonthYear);
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

   var data = new google.visualization.DataTable();
   data.addColumn('string', 'Date');
   data.addColumn('number', 'Income');
   data.addColumn('number', 'Expenses');
   data.addColumn('number', 'Net Income');

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+ $scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
    while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Blue','red', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

        function selectHandler() {

          var selectedItem = chart.getSelection()[0];

          if (selectedItem) {
            var value = data.getValue(selectedItem.row, 0);
  
   $scope.Card1Header=value+" "+$scope.ByDefaultMonthYear;
   $http({
    method: 'GET',
     async:false,  
    url: config.API +'getResultCardDetailsMonthWise/'+sessionid +'/' + $scope.GetMonthNum(value) +'/'+ $scope.ByDefaultMonthYear
  }).then(function successCallback(response) {

  
    if(response.data.error == 0){
     $scope.TotalIncome = response.data.results.TotalIncome.toLocaleString();

     $scope.TotalExpense = response.data.results.TotalExpense.toLocaleString();

     $scope.NetIncome = response.data.results.NetIncome.toLocaleString();

     $scope.Saving = response.data.results.Savings.toLocaleString();

     $scope.Invest = response.data.results.Investements.toLocaleString();
   }
   else
   {
    $scope.TotalIncome=0;
    $scope.TotalExpense=0;
    $scope.NetIncome=0;
    $scope.Saving=0;
    $scope.Invest=0;
  }

       //  $scope.loadchart=false;
     }, function errorCallback(response) {
       console.log(response);
     });


        $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForMonth/'+sessionid +'/'+$scope.ByDefaultMonthYear+'/'+$scope.GetMonthNum(value)
    }).then(function successCallback(response) {    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     });




       var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'Category');
  data1.addColumn('number', 'Income');

  $.ajax({
    url : config.API +'getIncomePieChartMonthWise/'+sessionid +'/'+$scope.GetMonthNum(value)+'/'+$scope.ByDefaultMonthYear,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.incomes.length; i++) {

      data1.addRow([res.incomes[i].CategoryName,res.incomes[i].TotalIncome]);

    }
  }
});



  var options1 = {};


  var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
  chart1.draw(data1, options1);

  var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Month');
  data2.addColumn('number', 'Expenses');

  $.ajax({
    url : config.API +'getExpensePieChartMonthWise/'+sessionid +'/'+$scope.GetMonthNum(value)+'/'+$scope.ByDefaultMonthYear,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.expenses.length; i++) {

      data2.addRow([res.expenses[i].CategoryName,res.expenses[i].TotalExpense]);

    }
  }
});

  var options2 = {};


  var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));
  chart2.draw(data2, options2);
}
}

  // Listen for the 'select' event, and call my function selectHandler() when
  // the user selects something on the chart.
  google.visualization.events.addListener(chart, 'select', selectHandler);         
  chart.draw(data, options);
}

};






//page load time chart drawn
    google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);
      
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
 
      function drawChart() {

       var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

        
          for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);
            
          }
        }
      });
        // Set chart options
        var options = {'colors': ['Blue','red', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}

              };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

        function selectHandler() {
          var selectedItem = chart.getSelection()[0];

          if (selectedItem) {
            var value = data.getValue(selectedItem.row, 0);
    
     $scope.Card1Header=value;

     $http({
      method: 'GET',
       async:false,  
      url: config.API +'getResultCardDetailsYearWise/'+sessionid +'/'+ value
    }).then(function successCallback(response) {

  
    if(response.data.error == 0){
     $scope.TotalIncome = response.data.results.TotalIncome.toLocaleString();

     $scope.TotalExpense = response.data.results.TotalExpense.toLocaleString();

     $scope.NetIncome = response.data.results.NetIncome.toLocaleString();

     $scope.Saving = response.data.results.Savings.toLocaleString();

     $scope.Invest = response.data.results.Investements.toLocaleString();
   }
   else
   {
    $scope.TotalIncome=0;
    $scope.TotalExpense=0;
    $scope.NetIncome=0;
    $scope.Saving=0;
    $scope.Invest=0;
  }

       //  $scope.loadchart=false;
     }, function errorCallback(response) {
       console.log(response);
     });

        $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForYear/'+sessionid +'/'+value
    }).then(function successCallback(response) {    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     }); 






         var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'Category');
  data1.addColumn('number', 'Income');

  $.ajax({
    url : config.API +'getIncomePieChartYearWise/'+sessionid +'/'+value,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.incomes.length; i++) {

      data1.addRow([res.incomes[i].CategoryName,res.incomes[i].TotalIncome]);

    }
  }
});



  var options1 = {};


  var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
  chart1.draw(data1, options1);


          var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Month');
  data2.addColumn('number', 'Expenses');

  $.ajax({
    url : config.API +'getExpensePieChartYearWise/'+sessionid +'/'+value,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.expenses.length; i++) {

      data2.addRow([res.expenses[i].CategoryName,res.expenses[i].TotalExpense]);

    }
  }
});

  var options2 = {};


  var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));
  chart2.draw(data2, options2);

  }
}

  // Listen for the 'select' event, and call my function selectHandler() when
  // the user selects something on the chart.
  google.visualization.events.addListener(chart, 'select', selectHandler);
  chart.draw(data, options);
   


  var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'Category');
  data1.addColumn('number', 'Income');

  $.ajax({
    url : config.API +'getIncomePieChartYearWise/'+sessionid +'/'+new Date().getFullYear(),
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.incomes.length; i++) {

      data1.addRow([res.incomes[i].CategoryName,res.incomes[i].TotalIncome]);

    }
  }
});



  var options1 = {};


  var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
  chart1.draw(data1, options1);

  var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Month');
  data2.addColumn('number', 'Expenses');

  $.ajax({
    url : config.API +'getExpensePieChartYearWise/'+sessionid +'/'+new Date().getFullYear(),
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.expenses.length; i++) {

      data2.addRow([res.expenses[i].CategoryName,res.expenses[i].TotalExpense]);

    }
  }
});

  var options2 = {};


  var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));
  chart2.draw(data2, options2);

  //$scope.loadchart=false; 

}






//function to get month name from month num
$scope.GetMonthName=function(num){
//console.log(num)
  var month = new Array();
  month[1] = "Jan";
  month[2] = "Feb";
  month[3] = "Mar";
  month[4] = "Apr";
  month[5] = "May";
  month[6] = "Jun";
  month[7] = "Jul";
  month[8] = "Aug";
  month[9] = "Sep";
  month[10] = "Oct";
  month[11] = "Nov";
  month[12] = "Dec";
  var n = month[num];
  return n;
};


//function for get month num from name
$scope.GetMonthNum=function(mnth){
 switch (mnth) {
  case 'Jan':
  return '01';
  break;
  case 'Feb':
  return '02';
  break;
  case 'Mar':
  return '03';
  break;
  case 'Apr':
  return '04';
  break;
  case 'May':
  return '05';
  break;
  case 'Jun':
  return '06';
  break;
  case 'Jul':
  return '07';
  break;
  case 'Aug':
  return '08';
  break;
  case 'Sep':
  return '09';
  break;
  case 'Oct':
  return '10';
  break;
  case 'Nov':
  return '12';
  break;
  case 'Dec':
  return '12';
  break;
  default:

}
}




//function call when month/year dropdown change
$scope.getDurationChange=function(value){
  $scope.duration=value;
 // console.log($scope.duration);
  $scope.Card1Details(value);
  $scope.card2Details(value);
  $scope.Card1Header= value;
  if(value == "Month")
  {
    $("#yearselector").show();
      $scope.loadchart=true;
      $http({
  method: 'GET',
   async:false,  
  url: config.API +'getAllYearsByUserId/'+sessionid 
}).then(function successCallback(response) {
   // console.log(response.data.years);
   $scope.getyear=response.data.years;

   $scope.ByDefaultMonthYear =response.data.years[0].Year;
  // console.log($scope.ByDefaultMonthYear);
     $scope.ChartsRedrawnBaseOnSelectionChange(value);
    $scope.loadchart=false;
 },
 function errorCallback(response) {
   console.log(response);
 });


  }
  else if(value == "Year"){
   $("#yearselector").hide();
     $scope.ChartsRedrawnBaseOnSelectionChange(value);
 }
};







//load time card1 details year vise
if($scope.duration == 'Year')
{
    // $scope.loadchart=true;
    $http({
      method: 'GET',
       async:false,  
      url: config.API +'getResultCardDetailsYearWise/'+sessionid +'/'+new Date().getFullYear()
    }).then(function successCallback(response) {

      $scope.TotalIncome = response.data.results.TotalIncome.toLocaleString();

      $scope.TotalExpense = response.data.results.TotalExpense.toLocaleString();

      $scope.NetIncome = response.data.results.NetIncome.toLocaleString();

      $scope.Saving = response.data.results.Savings.toLocaleString();

      $scope.Invest = response.data.results.Investements.toLocaleString();
       //  $scope.loadchart=false;
     }, function errorCallback(response) {
       console.log(response);
     });


       $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForYear/'+sessionid +'/'+new Date().getFullYear()
    }).then(function successCallback(response) {

    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     });





  }




//card1 value change base on dropdown(month/yaer) value change
$scope.Card1Details=function(duration){

  if(duration == 'Year')
  {
        // $scope.loadchart=true;
        $http({
          method: 'GET',
           async:false,  
          url: config.API +'getResultCardDetailsYearWise/'+sessionid +'/'+new Date().getFullYear()
        }).then(function successCallback(response) {

         $scope.TotalIncome = response.data.results.TotalIncome;
         $scope.TotalExpense = response.data.results.TotalExpense;

         $scope.NetIncome = response.data.results.NetIncome;

         $scope.Saving = response.data.results.Savings;

         $scope.Invest = response.data.results.Investements;
      //  $scope.loadchart=false;
    }, function errorCallback(response) {
     console.log(response);
   });


      }
      else if(duration == 'Month')
      {
    // $scope.loadchart=true;
    $http({
      method: 'GET',
       async:false,  
      url: config.API +'getResultCardDetailsMonthWise/'+sessionid +'/'+("0" + (new Date().getMonth() + 1)).slice(-2)+'/'+new Date().getFullYear()
    }).then(function successCallback(response) {
     $scope.TotalIncome = response.data.results.TotalIncome;
     $scope.TotalExpense = response.data.results.TotalExpense;

     $scope.NetIncome = response.data.results.NetIncome;

     $scope.Saving = response.data.results.Savings;

     $scope.Invest = response.data.results.Investements;
      //  $scope.loadchart=false;
    }, function errorCallback(response) {
     console.log(response);
   });
  }
};


$scope.card2Details=function(duration){
if(duration == 'Month'){
   $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForMonth/'+sessionid +'/'+new Date().getFullYear()+'/'+("0" + (new Date().getMonth() + 1)).slice(-2)
    }).then(function successCallback(response) {    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     });
}
else if(duration == 'Year')
{
    $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForYear/'+sessionid +'/'+new Date().getFullYear()
    }).then(function successCallback(response) {    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     });

}
};




//function call when dropdown change(month/year) selection 
$scope.ChartsRedrawnBaseOnSelectionChange=function(value){

    if(value == 'Month') //Month start
    {

   //  console.log( $scope.ByDefaultMonthYear);
     google.charts.load('current', {'packages':['corechart']});
     google.charts.setOnLoadCallback(drawChart);
     $scope.loadchart=true;
     function drawChart() {

       var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
   // console.log(res.results[i][0].month);
    while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Blue','red', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

        function selectHandler() {

          var selectedItem = chart.getSelection()[0];

          if (selectedItem) {
            var value = data.getValue(selectedItem.row, 0);

   $scope.Card1Header=value+" "+$scope.ByDefaultMonthYear;

   $http({
    method: 'GET',
     async:false,  
    url: config.API +'getResultCardDetailsMonthWise/'+sessionid +'/' + $scope.GetMonthNum(value) +'/'+ $scope.ByDefaultMonthYear
  }).then(function successCallback(response) {

   // console.log(response);
    if(response.data.error == 0){
     $scope.TotalIncome = response.data.results.TotalIncome.toLocaleString();

     $scope.TotalExpense = response.data.results.TotalExpense.toLocaleString();

     $scope.NetIncome = response.data.results.NetIncome.toLocaleString();

     $scope.Saving = response.data.results.Savings.toLocaleString();

     $scope.Invest = response.data.results.Investements.toLocaleString();
   }
   else
   {
    $scope.TotalIncome=0;
    $scope.TotalExpense=0;
    $scope.NetIncome=0;
    $scope.Saving=0;
    $scope.Invest=0;
  }

       //  $scope.loadchart=false;
     }, function errorCallback(response) {
       console.log(response);
     });

       $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForMonth/'+sessionid +'/'+$scope.ByDefaultMonthYear+'/'+$scope.GetMonthNum(value)
    }).then(function successCallback(response) {    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     });






      var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'Category');
  data1.addColumn('number', 'Income');

  $.ajax({
    url : config.API +'getIncomePieChartMonthWise/'+sessionid +'/'+$scope.GetMonthNum(value)+'/'+$scope.ByDefaultMonthYear,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.incomes.length; i++) {

      data1.addRow([res.incomes[i].CategoryName,res.incomes[i].TotalIncome]);

    }
  }
});



  var options1 = {};


  var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
  chart1.draw(data1, options1);

  var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Month');
  data2.addColumn('number', 'Expenses');

  $.ajax({
    url : config.API +'getExpensePieChartMonthWise/'+sessionid +'/'+$scope.GetMonthNum(value)+'/'+$scope.ByDefaultMonthYear,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.expenses.length; i++) {

      data2.addRow([res.expenses[i].CategoryName,res.expenses[i].TotalExpense]);

    }
  }
});

  var options2 = {};


  var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));
  chart2.draw(data2, options2);
}
}

  // Listen for the 'select' event, and call my function selectHandler() when
  // the user selects something on the chart.
  google.visualization.events.addListener(chart, 'select', selectHandler);
  chart.draw(data, options);

}
$scope.loadchart=false;

             //Month end

}
    else if(value == 'Year') //Year Start
    {

      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.

      google.charts.setOnLoadCallback(drawChart);
      
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.

      function drawChart() {

       var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

         // console.log(res.years[0].startYear);

         for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);
            
          }
        }
      });
        // Set chart options
        var options = {'colors': ['Blue','red', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}

              };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

        function selectHandler() {

          var selectedItem = chart.getSelection()[0];

          if (selectedItem) {
            var value = data.getValue(selectedItem.row, 0);
     // alert('The user selected ' + value);
     $scope.Card1Header=value;
     $http({
      method: 'GET',
       async:false,  
      url: config.API +'getResultCardDetailsYearWise/'+sessionid +'/'+ value
    }).then(function successCallback(response) {

    //  console.log(response);
      if(response.data.error == 0){
       $scope.TotalIncome = response.data.results.TotalIncome.toLocaleString();

       $scope.TotalExpense = response.data.results.TotalExpense.toLocaleString();

       $scope.NetIncome = response.data.results.NetIncome.toLocaleString();

       $scope.Saving = response.data.results.Savings.toLocaleString();

       $scope.Invest = response.data.results.Investements.toLocaleString();
     }
     else
     {
      $scope.TotalIncome=0;
      $scope.TotalExpense=0;
      $scope.NetIncome=0;
      $scope.Saving=0;
      $scope.Invest=0;
    }

       //  $scope.loadchart=false;
     }, function errorCallback(response) {
       console.log(response);
     });

      $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForYear/'+sessionid +'/'+value
    }).then(function successCallback(response) {    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     }); 





        var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'Category');
  data1.addColumn('number', 'Income');

  $.ajax({
    url : config.API +'getIncomePieChartYearWise/'+sessionid +'/'+value,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.incomes.length; i++) {

      data1.addRow([res.incomes[i].CategoryName,res.incomes[i].TotalIncome]);

    }
  }
});



  var options1 = {};


  var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
  chart1.draw(data1, options1);


          var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Month');
  data2.addColumn('number', 'Expenses');

  $.ajax({
    url : config.API +'getExpensePieChartYearWise/'+sessionid +'/'+value,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.expenses.length; i++) {

      data2.addRow([res.expenses[i].CategoryName,res.expenses[i].TotalExpense]);

    }
  }
});

  var options2 = {};


  var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));
  chart2.draw(data2, options2);

  }
}

  // Listen for the 'select' event, and call my function selectHandler() when
  // the user selects something on the chart.
  google.visualization.events.addListener(chart, 'select', selectHandler);

  chart.draw(data, options);
 
   // $scope.loadchart=false;
  }

    } //Year end

  };


  $scope.employees=[{name:'Income'},
  {name:'Expense'},
  {name:'Net Income'}];
  $scope.selection=[];

 $scope.toggleSelection = function(employeeName) {
   var idx = $scope.selection.indexOf(employeeName);
    if (idx > -1) {
          $scope.selection.splice(idx, 1);
      }

        // is newly selected
        else {
          $scope.selection.push(employeeName);
      }
   // console.log($scope.selection);
   // console.log($scope.selection.length);

   if($scope.selection.length > 0)
   {
      if($scope.selection.length == 1)
      {
            if($scope.selection[0] == 'Income' && $scope.duration == 'Year')
            {
              var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

        for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].income]);
            
          }
        }
      });    

              var options = {'colors': ['Blue'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);
            }
            else if($scope.selection[0] == 'Expense' && $scope.duration == 'Year')
            {
                var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
     
       data.addColumn('number', 'Expenses');
     

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

         for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year, res.results[i][0].expense]);
            
          }
        }
      });    

              var options = {'colors': ['red'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);
            }
            else if($scope.selection[0] == 'Net Income' && $scope.duration == 'Year')
            {
                var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Net Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

         for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,Math.abs(res.results[i][0].netincome)]);
            
          }
        }
      });    

              var options = {'colors': ['orange'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);
            }
            else if($scope.selection[0] == 'Income' && $scope.duration == 'Month')
            {
               var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
       data.addColumn('number', 'Income');
    

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
           
             while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),res.results[i][0].income]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Blue'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);
            }
            else if($scope.selection[0] == 'Expense' && $scope.duration == 'Month')
            {
                var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
     
       data.addColumn('number', 'Expenses');
       

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
     while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month), res.results[i][0].expense]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['red'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);
            }
            else if($scope.selection[0] == 'Net Income' && $scope.duration == 'Month')
            {
               var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
      
       data.addColumn('number', 'Net Income');

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
     while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),Math.abs(res.results[i][0].netincome)]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);
            }
      }
      else if($scope.selection.length == 2)
      {
              if(($scope.selection[0] == 'Income' && $scope.selection[1] == 'Expense' && $scope.duration == 'Year') ||($scope.selection[1] == 'Income' && $scope.selection[0] == 'Expense' && $scope.duration == 'Year') )
              {
                   var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
      

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

         for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].income, res.results[i][0].expense]);
            
          }
        }
      });    

              var options = {'colors': ['Blue','red'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);
              }
              else if(($scope.selection[0] == 'Income' && $scope.selection[1] == 'Expense' && $scope.duration == 'Month') ||($scope.selection[1] == 'Income' && $scope.selection[0] == 'Expense' && $scope.duration == 'Month') )
              {
                   var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
      

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
     while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),res.results[i][0].income, res.results[i][0].expense]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Blue','red'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);

              }
              else if(($scope.selection[0] == 'Expense' && $scope.selection[1] == 'Net Income' && $scope.duration == 'Year') ||($scope.selection[1] == 'Expense' && $scope.selection[0] == 'Net Income' && $scope.duration == 'Year') )
              {
                    var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
     
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

         for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);
            
          }
        }
      });    

              var options = {'colors': ['red','orange'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);
              }
              else if(($scope.selection[0] == 'Expense' && $scope.selection[1] == 'Net Income'  && $scope.duration == 'Month') ||($scope.selection[1] == 'Expense' && $scope.selection[0] == 'Net Income'  && $scope.duration == 'Month'))
              {
                     var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
     
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
     while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month), res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['red', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);

              }
              else if(($scope.selection[0] == 'Income' && $scope.selection[1] == 'Net Income' && $scope.duration == 'Year') ||($scope.selection[1] == 'Income' && $scope.selection[0] == 'Net Income' && $scope.duration == 'Year') )
              {
                      var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Income');
      
       data.addColumn('number', 'Net Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

         for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].income,Math.abs(res.results[i][0].netincome)]);
            
          }
        }
      });    

              var options = {'colors': ['Blue','orange'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);
              }
              else if(($scope.selection[0] == 'Income' && $scope.selection[1] == 'Net Income' && $scope.duration == 'Month') ||($scope.selection[1] == 'Income' && $scope.selection[0] == 'Net Income') && $scope.duration == 'Month' )
              {
                       var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
       data.addColumn('number', 'Income');
      
       data.addColumn('number', 'Net Income');

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
     while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),res.results[i][0].income,Math.abs(res.results[i][0].netincome)]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Blue', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);

              }
      }
      else
      {
          if($scope.duration == 'Month')
      {
           var data = new google.visualization.DataTable();
       data.addColumn('string', 'Month');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
       while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Blue','red', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);



      }
      else if($scope.duration == 'Year')
      {
           
             var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

        for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);
            
          }
        }
      });    

              var options = {'colors': ['Blue','red','orange'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);


      }
      }     
   }
   else
   {
     // console.log("length.... <= 0");
      if($scope.duration == 'Month')
      {
           var data = new google.visualization.DataTable();
       data.addColumn('string', 'Date');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

$.ajax({
  url : config.API +'getResultGraphAllMonthsForParticularYear/'+sessionid +'/'+$scope.ByDefaultMonthYear,
  type: "GET",
  async:false,      
  success:function(res){ 

   for (var i = 0; i < res.results.length; i++) {
     while(res.results[i][0].month.charAt(0) === '0')
    res.results[i][0].month = res.results[i][0].month.substr(1);
           data.addRow([$scope.GetMonthName(res.results[i][0].month),res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);

         }
       }
     });
        // Set chart options
        var options = {'colors': ['Blue','red', 'Orange'], 'animation': {
          duration: 2000,
                  //easing: 'out',
                  startup: true,
                },
                hAxis: { slantedText: true },
                legend: { position: 'top'}
              };

                  $scope.createColumnChartBaseOnSelection(data,options);



      }
      else if($scope.duration == 'Year')
      {
           
             var data = new google.visualization.DataTable();
       data.addColumn('string', 'Year');
       data.addColumn('number', 'Income');
       data.addColumn('number', 'Expenses');
       data.addColumn('number', 'Net Income');

       $.ajax({
        url : config.API +'getResultGraphForAllYears/'+sessionid,
        type: "GET",
        async:false,      
        success:function(res){ 

         for (var i = 0; i < res.results.length; i++) {
           
            data.addRow([res.results[i][0].year,res.results[i][0].income, res.results[i][0].expense,Math.abs(res.results[i][0].netincome)]);
            
          }
        }
      });    

              var options = {'colors': ['Blue','red','orange'], 'animation': {
                  duration: 2000,
                  //easing: 'out',
                  startup: true
              },
               hAxis: { slantedText: true },
               legend: { position: 'top'}
          };


              $scope.createColumnChartBaseOnSelection(data,options);


      }
   }

 };





//function call when checkboxes selection change
$scope.createColumnChartBaseOnSelection=function(data,options){
 google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

          function selectHandler() {
          var selectedItem = chart.getSelection()[0];

          if (selectedItem) {
            var value = data.getValue(selectedItem.row, 0);
    
     $scope.Card1Header=value;

     $http({
      method: 'GET',
       async:false,  
      url: config.API +'getResultCardDetailsYearWise/'+sessionid +'/'+ value
    }).then(function successCallback(response) {

  
    if(response.data.error == 0){
     $scope.TotalIncome = response.data.results.TotalIncome.toLocaleString();

     $scope.TotalExpense = response.data.results.TotalExpense.toLocaleString();

     $scope.NetIncome = response.data.results.NetIncome.toLocaleString();

     $scope.Saving = response.data.results.Savings.toLocaleString();

     $scope.Invest = response.data.results.Investements.toLocaleString();
   }
   else
   {
    $scope.TotalIncome=0;
    $scope.TotalExpense=0;
    $scope.NetIncome=0;
    $scope.Saving=0;
    $scope.Invest=0;
  }

       //  $scope.loadchart=false;
     }, function errorCallback(response) {
       console.log(response);
     });

    $http({
      method: 'GET',
       async:false,  
      url: config.API +'getCardTagsForYear/'+sessionid +'/'+value
    }).then(function successCallback(response) {    
     $scope.Tags=response.data.tags;
     }, function errorCallback(response) {
       console.log(response);
     }); 


         var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'Category');
  data1.addColumn('number', 'Income');

  $.ajax({
    url : config.API +'getIncomePieChartYearWise/'+sessionid +'/'+value,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.incomes.length; i++) {

      data1.addRow([res.incomes[i].CategoryName,res.incomes[i].TotalIncome]);

    }
  }
});



  var options1 = {};


  var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
  chart1.draw(data1, options1);


          var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Month');
  data2.addColumn('number', 'Expenses');

  $.ajax({
    url : config.API +'getExpensePieChartYearWise/'+sessionid +'/'+value,
    type: "GET",
    async:false,      
    success:function(res){ 

     for (var i = 0; i < res.expenses.length; i++) {

      data2.addRow([res.expenses[i].CategoryName,res.expenses[i].TotalExpense]);

    }
  }
});

  var options2 = {};


  var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));
  chart2.draw(data2, options2);

  }
}

  // Listen for the 'select' event, and call my function selectHandler() when
  // the user selects something on the chart.
  google.visualization.events.addListener(chart, 'select', selectHandler);



        chart.draw(data, options);


      }

    };






});