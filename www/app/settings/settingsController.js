settingsModule.controller('SettingsCtrl', function($scope, $ionicScrollDelegate, $log,$state,$filter, $timeout,$http,$ionicModal,$location, config, Parse,$sessionStorage,ionicDatePicker,$ionicScrollDelegate) {
    var moduleName = 'SettingsCtrl';       

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


    




   $scope.formUpdateprofile=true;
    $scope.sgnfrm = {

        Image:'',
        Username: '',
        EmailId:'',
        Password:'',
        Gender:'Male',       
        DateOfBirth:'Date of Birth'
    };
    $scope.tgfrm = {
        TagName: '',
       
        UserId:sessionid
    };
      $scope.updatetgfrm = {
        TagName: '',

    };

    $scope.icnfrm={
      UserId:sessionid,
      CategoryName:'',
      CategoryImage:'',
      CategoryType:'',
      Flag:1,
    }
    $scope.updateicnfrm={
    
      CategoryName:'',
      CategoryImage:'',
      CategoryType:'',
     
    }
    var ipObj1 = {
      callback: function (val) {  //Mandatory
       // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.sgnfrm.DateOfBirth=new Date(val);
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
       $scope.dobinvalid = false;
           $scope.formUpdateprofile=true;
    };

    $http({
  method: 'GET',
   async:false,  
  url: config.API +'getUserDetail/'+sessionid 
}).then(function successCallback(response) {
  if(response.data.error == 0)
  {
  $scope.Currentuser=response.data.users[0];
 
  if($scope.Currentuser.Image == "" || $scope.Currentuser.Image == null || $scope.Currentuser.Image == "null"){
     
        $('.rndfilediv')
                    .css({'background-image': 'url(../../img/user.jpg")'});
  }
  else
  {
       $('.rndfilediv')
                    .css({'background-image': 'url("'+$scope.Currentuser.Image+'")'});
  }
  

     $scope.sgnfrm.Username=$scope.Currentuser.Username;
      $scope.sgnfrm.EmailId=$scope.Currentuser.EmailId;

      if($scope.Currentuser.Image == null || $scope.Currentuser.Image == "null"){
      


          $scope.sgnfrm.Image="null";
            $scope.Imageflag=false;
      }
      else
      {
           var img= $scope.Currentuser.Image.split('/');
         $scope.sgnfrm.Image=img[4];
         $scope.Imageflag=false;
         
      }

        
         if($scope.Currentuser.DateOfBirth == "" || $scope.Currentuser.DateOfBirth == null || $scope.Currentuser.DateOfBirth == "null"){
			$scope.sgnfrm.DateOfBirth="Date of Birth";
		}
		else
		{
         $scope.sgnfrm.DateOfBirth=$scope.Currentuser.DateOfBirth;
		 }
          $scope.sgnfrm.Gender=$scope.Currentuser.Gender;
}
 },
 function errorCallback(response) {
   console.log(response);
 });




   $http({
  method: 'GET',
   async:false,  
  url: config.API +'getTagDetailByUserId/'+sessionid 
}).then(function successCallback(response) {
 
  $scope.UserTags =response.data.tags;
 },
 function errorCallback(response) {
   console.log(response);
 });


$scope.LoadTags=function(){
   $http({
  method: 'GET',
   async:false,  
  url: config.API +'getTagDetailByUserId/'+sessionid 
}).then(function successCallback(response) {
 
  $scope.UserTags =response.data.tags;
 },
 function errorCallback(response) {
   console.log(response);
 });

};



 $http({
  method: 'GET',
   async:false,  
  url: config.API +'getCustomUserCategoriesByUserId/'+sessionid 
}).then(function successCallback(response) {
 
  $scope.UserCategories =response.data.userCategories;
 },
 function errorCallback(response) {
   console.log(response);
 });


$scope.LoadIcons=function(){
   $http({
  method: 'GET',
   async:false,  
  url: config.API +'getCustomUserCategoriesByUserId/'+sessionid 
}).then(function successCallback(response) {
 
 $scope.UserCategories =response.data.userCategories;
 },
 function errorCallback(response) {
   console.log(response);
 });
}



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
     $scope.Imageflag=true;
    };

    $scope.updateProfile=function(sgnfrm){
    
         if (!angular.isDefined($scope.sgnfrm.DateOfBirth) || $scope.sgnfrm.DateOfBirth == null || $scope.sgnfrm.DateOfBirth == undefined || $scope.sgnfrm.DateOfBirth == ''|| $scope.sgnfrm.DateOfBirth == 'Date of Birth') {
            $scope.dobinvalid = true;
           $scope.formUpdateprofile=false;
           // return false;
        }
        else
        {
             $scope.dobinvalid = false;
           $scope.formUpdateprofile=true;
        }

        if($scope.formUpdateprofile)
        {
          if( $scope.Imageflag == true)
          {
            
              console.log(sgnfrm)
$.ajax({
    url : config.API+'UpdatedRegImage/'+sessionid,
    type: "POST",
    data : fd,
    processData: false,
    contentType: false,
    success:function(res){ 
     $scope.sgnfrm.Image=res; 
      
        $scope.sgnfrm.DateOfBirth= $filter('date')($scope.sgnfrm.DateOfBirth, "yyyy-MM-dd");
            
            
               var request = $http({
    method: 'POST',
    url: config.API+'UpdateProfile/'+sessionid,
    data: $scope.sgnfrm,
    }).then(function(result) {
if(result.data.error == 0)
    {
      $scope.Currentuser=response.data.users[0];

       $scope.sgnfrm.Username=$scope.Currentuser.Username;
      $scope.sgnfrm.EmailId=$scope.Currentuser.EmailId;
         var img= $scope.Currentuser.Image.split('/');
         $scope.sgnfrm.Image=img[4];
         $scope.Imageflag=false;
         $scope.sgnfrm.DateOfBirth=$scope.Currentuser.DateOfBirth;
          $scope.sgnfrm.Gender=$scope.Currentuser.Gender;

           $("#updatesuccess").html('<div style="font-size: 14px;color:green;">'+result.data.message+'</div>');
            $state.go('login');
             $timeout(function () {
      
               $("#updatesuccess").html('');
            }, 2000); 

     }
       }, function(error) {
      console.log(error)
         
       });





    },
    error: function(error){
      
    }
});


          }
          else
          {
           

           

          $scope.sgnfrm.DateOfBirth= $filter('date')($scope.sgnfrm.DateOfBirth, "yyyy-MM-dd");
            
            
               var request = $http({
    method: 'POST',
    url: config.API+'UpdateProfile/'+sessionid,
    data: $scope.sgnfrm,
    }).then(function(result) {
    if(result.data.error == 0)
    {
       $scope.Currentuser=result.data.users[0];

       $scope.sgnfrm.Username=$scope.Currentuser.Username;
      $scope.sgnfrm.EmailId=$scope.Currentuser.EmailId;
         var img= $scope.Currentuser.Image.split('/');
         $scope.sgnfrm.Image=img[4];
         $scope.Imageflag=false;
         $scope.sgnfrm.DateOfBirth=$scope.Currentuser.DateOfBirth;
          $scope.sgnfrm.Gender=$scope.Currentuser.Gender;

           $("#updatesuccess").html('<div style="font-size: 14px;color:green;">'+result.data.message+'</div>');
          
             $timeout(function () {
      
               $("#updatesuccess").html('');
            }, 2000); 

}
       }, function(error) {
      console.log(error)
         
       });
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



$scope.getIconTypes=[{name:'Income',id:1},{name:'Expense',id:2}];

 $scope.icons = ["fa-adjust", "fa-adn", "fa-align-center", "fa-align-justify", "fa-align-left", "fa-align-right", "fa-ambulance", "fa-anchor", "fa-android", "fa-angellist", "fa-angle-double-down", "fa-angle-double-left", "fa-angle-double-right", "fa-angle-double-up", "fa-angle-down", "fa-angle-left", "fa-angle-right", "fa-angle-up", "fa-apple", "fa-archive", "fa-area-chart", "fa-arrow-circle-down", "fa-arrow-circle-left", "fa-arrow-circle-o-down", "fa-arrow-circle-o-left", "fa-arrow-circle-o-right", "fa-arrow-circle-o-up", "fa-arrow-circle-right", "fa-arrow-circle-up", "fa-arrow-down", "fa-arrow-left", "fa-arrow-right", "fa-arrow-up", "fa-arrows", "fa-arrows-alt", "fa-arrows-h", "fa-arrows-v", "fa-asterisk", "fa-at", "fa-backward", "fa-ban", "fa-bar-chart", "fa-barcode", "fa-bars", "fa-bed", "fa-beer", "fa-behance", "fa-behance-square", "fa-bell", "fa-bell-o", "fa-bell-slash", "fa-bell-slash-o", "fa-bicycle", "fa-binoculars", "fa-birthday-cake", "fa-bitbucket", "fa-bitbucket-square", "fa-bold", "fa-bolt", "fa-bomb", "fa-book", "fa-bookmark", "fa-bookmark-o", "fa-briefcase", "fa-btc", "fa-bug", "fa-building", "fa-building-o", "fa-bullhorn", "fa-bullseye", "fa-bus", "fa-buysellads", "fa-calculator", "fa-calendar", "fa-calendar-o", "fa-camera", "fa-camera-retro", "fa-car", "fa-caret-down", "fa-caret-left", "fa-caret-right", "fa-caret-square-o-down", "fa-caret-square-o-left", "fa-caret-square-o-right", "fa-caret-square-o-up", "fa-caret-up", "fa-cart-arrow-down", "fa-cart-plus", "fa-cc", "fa-cc-amex", "fa-cc-discover", "fa-cc-mastercard", "fa-cc-paypal", "fa-cc-stripe", "fa-cc-visa", "fa-certificate", "fa-chain-broken", "fa-check", "fa-check-circle", "fa-check-circle-o", "fa-check-square", "fa-check-square-o", "fa-chevron-circle-down", "fa-chevron-circle-left", "fa-chevron-circle-right", "fa-chevron-circle-up", "fa-chevron-down", "fa-chevron-left", "fa-chevron-right", "fa-chevron-up", "fa-child", "fa-circle", "fa-circle-o", "fa-circle-o-notch", "fa-circle-thin", "fa-clipboard", "fa-clock-o", "fa-cloud", "fa-cloud-download", "fa-cloud-upload", "fa-code", "fa-code-fork", "fa-codepen", "fa-coffee", "fa-cog", "fa-cogs", "fa-columns", "fa-comment", "fa-comment-o", "fa-comments", "fa-comments-o", "fa-compass", "fa-compress", "fa-connectdevelop", "fa-copyright", "fa-credit-card", "fa-crop", "fa-crosshairs", "fa-css3", "fa-cube", "fa-cubes", "fa-cutlery", "fa-dashcube", "fa-database", "fa-delicious", "fa-desktop", "fa-deviantart", "fa-diamond", "fa-digg", "fa-dot-circle-o", "fa-download", "fa-dribbble", "fa-dropbox", "fa-drupal", "fa-eject", "fa-ellipsis-h", "fa-ellipsis-v", "fa-empire", "fa-envelope", "fa-envelope-o", "fa-envelope-square", "fa-eraser", "fa-eur", "fa-exchange", "fa-exclamation", "fa-exclamation-circle", "fa-exclamation-triangle", "fa-expand", "fa-external-link", "fa-external-link-square", "fa-eye", "fa-eye-slash", "fa-eyedropper", "fa-facebook", "fa-facebook-official", "fa-facebook-square", "fa-fast-backward", "fa-fast-forward", "fa-fax", "fa-female", "fa-fighter-jet", "fa-file", "fa-file-archive-o", "fa-file-audio-o", "fa-file-code-o", "fa-file-excel-o", "fa-file-image-o", "fa-file-o", "fa-file-pdf-o", "fa-file-powerpoint-o", "fa-file-text", "fa-file-text-o", "fa-file-video-o", "fa-file-word-o", "fa-files-o", "fa-film", "fa-filter", "fa-fire", "fa-fire-extinguisher", "fa-flag", "fa-flag-checkered", "fa-flag-o", "fa-flask", "fa-flickr", "fa-floppy-o", "fa-folder", "fa-folder-o", "fa-folder-open", "fa-folder-open-o", "fa-font", "fa-forumbee", "fa-forward", "fa-foursquare", "fa-frown-o", "fa-futbol-o", "fa-gamepad", "fa-gavel", "fa-gbp", "fa-gift", "fa-git", "fa-git-square", "fa-github", "fa-github-alt", "fa-github-square", "fa-glass", "fa-globe", "fa-google", "fa-google-plus", "fa-google-plus-square", "fa-google-wallet", "fa-graduation-cap", "fa-gratipay", "fa-h-square", "fa-hacker-news", "fa-hand-o-down", "fa-hand-o-left", "fa-hand-o-right", "fa-hand-o-up", "fa-hdd-o", "fa-header", "fa-headphones", "fa-heart", "fa-heart-o", "fa-heartbeat", "fa-history", "fa-home", "fa-hospital-o", "fa-html5", "fa-ils", "fa-inbox", "fa-indent", "fa-info", "fa-info-circle", "fa-inr", "fa-instagram", "fa-ioxhost", "fa-italic", "fa-joomla", "fa-jpy", "fa-jsfiddle", "fa-key", "fa-keyboard-o", "fa-krw", "fa-language", "fa-laptop", "fa-lastfm", "fa-lastfm-square", "fa-leaf", "fa-leanpub", "fa-lemon-o", "fa-level-down", "fa-level-up", "fa-life-ring", "fa-lightbulb-o", "fa-line-chart", "fa-link", "fa-linkedin", "fa-linkedin-square", "fa-linux", "fa-list", "fa-list-alt", "fa-list-ol", "fa-list-ul", "fa-location-arrow", "fa-lock", "fa-long-arrow-down", "fa-long-arrow-left", "fa-long-arrow-right", "fa-long-arrow-up", "fa-magic", "fa-magnet", "fa-male", "fa-map-marker", "fa-mars", "fa-mars-double", "fa-mars-stroke", "fa-mars-stroke-h", "fa-mars-stroke-v", "fa-maxcdn", "fa-meanpath", "fa-medium", "fa-medkit", "fa-meh-o", "fa-mercury", "fa-microphone", "fa-microphone-slash", "fa-minus", "fa-minus-circle", "fa-minus-square", "fa-minus-square-o", "fa-mobile", "fa-money", "fa-moon-o", "fa-motorcycle", "fa-music", "fa-neuter", "fa-newspaper-o", "fa-openid", "fa-outdent", "fa-pagelines", "fa-paint-brush", "fa-paper-plane", "fa-paper-plane-o", "fa-paperclip", "fa-paragraph", "fa-pause", "fa-paw", "fa-paypal", "fa-pencil", "fa-pencil-square", "fa-pencil-square-o", "fa-phone", "fa-phone-square", "fa-picture-o", "fa-pie-chart", "fa-pied-piper", "fa-pied-piper-alt", "fa-pinterest", "fa-pinterest-p", "fa-pinterest-square", "fa-plane", "fa-play", "fa-play-circle", "fa-play-circle-o", "fa-plug", "fa-plus", "fa-plus-circle", "fa-plus-square", "fa-plus-square-o", "fa-power-off", "fa-print", "fa-puzzle-piece", "fa-qq", "fa-qrcode", "fa-question", "fa-question-circle", "fa-quote-left", "fa-quote-right", "fa-random", "fa-rebel", "fa-recycle", "fa-reddit", "fa-reddit-square", "fa-refresh", "fa-renren", "fa-repeat", "fa-reply", "fa-reply-all", "fa-retweet", "fa-road", "fa-rocket", "fa-rss", "fa-rss-square", "fa-rub", "fa-scissors", "fa-search", "fa-search-minus", "fa-search-plus", "fa-sellsy", "fa-server", "fa-share", "fa-share-alt", "fa-share-alt-square", "fa-share-square", "fa-share-square-o", "fa-shield", "fa-ship", "fa-shirtsinbulk", "fa-shopping-cart", "fa-sign-in", "fa-sign-out", "fa-signal", "fa-simplybuilt", "fa-sitemap", "fa-skyatlas", "fa-skype", "fa-slack", "fa-sliders", "fa-slideshare", "fa-smile-o", "fa-sort", "fa-sort-alpha-asc", "fa-sort-alpha-desc", "fa-sort-amount-asc", "fa-sort-amount-desc", "fa-sort-asc", "fa-sort-desc", "fa-sort-numeric-asc", "fa-sort-numeric-desc", "fa-soundcloud", "fa-space-shuttle", "fa-spinner", "fa-spoon", "fa-spotify", "fa-square", "fa-square-o", "fa-stack-exchange", "fa-stack-overflow", "fa-star", "fa-star-half", "fa-star-half-o", "fa-star-o", "fa-steam", "fa-steam-square", "fa-step-backward", "fa-step-forward", "fa-stethoscope", "fa-stop", "fa-street-view", "fa-strikethrough", "fa-stumbleupon", "fa-stumbleupon-circle", "fa-subscript", "fa-subway", "fa-suitcase", "fa-sun-o", "fa-superscript", "fa-table", "fa-tablet", "fa-tachometer", "fa-tag", "fa-tags", "fa-tasks", "fa-taxi", "fa-tencent-weibo", "fa-terminal", "fa-text-height", "fa-text-width", "fa-th", "fa-th-large", "fa-th-list", "fa-thumb-tack", "fa-thumbs-down", "fa-thumbs-o-down", "fa-thumbs-o-up", "fa-thumbs-up", "fa-ticket", "fa-times", "fa-times-circle", "fa-times-circle-o", "fa-tint", "fa-toggle-off", "fa-toggle-on", "fa-train", "fa-transgender", "fa-transgender-alt", "fa-trash", "fa-trash-o", "fa-tree", "fa-trello", "fa-trophy", "fa-truck", "fa-try", "fa-tty", "fa-tumblr", "fa-tumblr-square", "fa-twitch", "fa-twitter", "fa-twitter-square", "fa-umbrella", "fa-underline", "fa-undo", "fa-university", "fa-unlock", "fa-unlock-alt", "fa-upload", "fa-usd", "fa-user", "fa-user-md", "fa-user-plus", "fa-user-secret", "fa-user-times", "fa-users", "fa-venus", "fa-venus-double", "fa-venus-mars", "fa-viacoin", "fa-video-camera", "fa-vimeo-square", "fa-vine", "fa-vk", "fa-volume-down", "fa-volume-off", "fa-volume-up", "fa-weibo", "fa-weixin", "fa-whatsapp", "fa-wheelchair", "fa-wifi", "fa-windows", "fa-wordpress", "fa-wrench", "fa-xing", "fa-xing-square", "fa-yahoo", "fa-yelp", "fa-youtube", "fa-youtube-play", "fa-youtube-square"];

   $scope.selectIcon = function(icon) {
   
        $scope.icon = icon;
         $scope.closeModal();
          $scope.iconinvalid = false;
           $scope.formIcon=true;
        //$('#modalIcons').modal('hide');
    }

// $scope.openpopup=function(){
//   alert();
//    $('#modalIcons').modal('show');
// }
$scope.formtag=true;
    $scope.addTag=function(tgfrm)
    {

          if (!angular.isDefined($scope.tgfrm.TagName) || $scope.tgfrm.TagName == null || $scope.tgfrm.TagName == undefined || $scope.tgfrm.TagName == '') {
            $scope.tagnameinvalid = true;
           $scope.formtag=false;
           // return false;
        }
        else
        {
             $scope.tagnameinvalid = false;
           $scope.formtag=true;
        }

        //  if (!angular.isDefined($scope.tgfrm.TagAssociatedTo) || $scope.tgfrm.TagAssociatedTo == null || $scope.tgfrm.TagAssociatedTo == undefined || $scope.tgfrm.TagAssociatedTo == '') {
        //     $scope.tagassoinvalid = true;
        //    $scope.formtag=false;
        //    // return false;
        // }
        // else
        // {
        //      $scope.tagassoinvalid = false;
        //    $scope.formtag=true;
        // }


    	console.log(tgfrm);
      if( $scope.formtag)
      {
    	  var request = $http({
                              method: 'POST',
    url: config.API+'addTag',
    data: $scope.tgfrm,
    }).then(function(result) {
    	//console.log(result);

    		if(result.data.error == 0)
    		{
          $scope.LoadTags();
         $scope.tgfrm=""
    			 $("#tags-success").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#tags-success").html('');
            }, 2000); 
             
    		}
    		else if(result.data.error == -1)
    		{
    			 $("#tags-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#tags-errors").html('');
            }, 2000); 
    		}
    		else if(result.data.error == 1)
    		{
    			 $("#tags-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
             $timeout(function () {
      
               $("#tags-errors").html('');
            }, 2000); 
    		}

    	 }, function(error) {
       
         console.log(error);
         
       });
    }
    };


     $scope.formIcon=true;
    $scope.iconnameinvalid=false;
    $scope.icontypeinvalid=false;
    $scope.iconinvalid=false;
    $scope.addIcon=function(icnfrm){
  
       if (!angular.isDefined($scope.icnfrm.CategoryName) || $scope.icnfrm.CategoryName == null || $scope.icnfrm.CategoryName == undefined || $scope.icnfrm.CategoryName == '') {
            $scope.iconnameinvalid = true;
           $scope.formIcon=false;
           // return false;
        }
        else
        {
             $scope.iconnameinvalid = false;
           $scope.formIcon=true;
        }
           if (!angular.isDefined($scope.icnfrm.CategoryType) || $scope.icnfrm.CategoryType == null || $scope.icnfrm.CategoryType == undefined || $scope.icnfrm.CategoryType == '') {
            $scope.icontypeinvalid = true;
           $scope.formIcon=false;
           // return false;
        }
        else
        {
             $scope.icontypeinvalid = false;
           $scope.formIcon=true;
        }
          if (!angular.isDefined($scope.icon) || $scope.icon == null || $scope.icon == undefined || $scope.icon == '') {
            $scope.iconinvalid = true;
           $scope.formIcon=false;
           // return false;
        }
        else
        {
             $scope.iconinvalid = false;
           $scope.formIcon=true;
        }

        if($scope.formIcon)
        {
      $scope.icnfrm.CategoryType=icnfrm.CategoryType.name;
       $scope.icnfrm.CategoryImage=$scope.icon;

        console.log(icnfrm);

          var request = $http({
                                            method: 'POST',
                                            url: config.API+'addUserCategory',
                                            data: $scope.icnfrm,
                                              }).then(function(result) {
                                                   if(result.data.error  == 0)
                                                   {
                                                    $scope.LoadIcons();
                                                    $scope.icnfrm="";
                                                    $scope.icon="";
                                                       $("#icon-success").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
                                                  $timeout(function () {
      
                                                     $("#icon-success").html('');
                                                  }, 2000); 
                    
                                                   }
                                                   else if(result.data.error  == 1)
                                                   {
                                                       $("#icon-errors").html('<div style="font-size: 14px;">'+result.data.message+'</div>');
                                                  $timeout(function () {
      
                                                     $("#icon-errors").html('');
                                                  }, 2000);
                                                   }
                                              }, function(error) {
                                                         console.log(error)
                                              });



        }




    };

    $scope.typechange=function(type){
      if(type.name == 'Expense' || type.name == 'Income')
      {
         $scope.icontypeinvalid = false;
           $scope.formvalid=true;
      }
      
    };

    $scope.updatename=function(){
       $scope.iconnameinvalid = false;
           $scope.formvalid=true;
    };

    $scope.updatetag=function(){
       $scope.tagnameinvalid = false;
           $scope.formtag=true;
    };

     $scope.updatetagassoc=function(){
       $scope.tagassoinvalid = false;
           $scope.formtag=true;
    };



    $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
    }).datepicker('update', new Date()); 

$("#updatetag").hide();
    $scope.editTag=function(id){
      $("#addtag").hide();
      $("#updatetag").show();

     $scope.TagId=id;
             $http({
        method: 'GET',
         async:false,  
        url: config.API +'getTagDetailByTagId/'+id 
      }).then(function successCallback(response) {
       
         $scope.tgfrm = {
        TagName: response.data.tags[0].TagName,
       
        UserId:sessionid
    };
       },
       function errorCallback(response) {
         console.log(response);
       });


    };


    $scope.UpdateTag=function(tgfrm){
     
       $scope.updatetgfrm.TagName=tgfrm.TagName;
    
         console.log($scope.updatetgfrm);

         var request = $http({
          method: 'POST',
          url: config.API+'EditTag/'+ $scope.TagId,
          data:  $scope.updatetgfrm,
        }).then(function(result) {
          console.log(result);

          if(result.data.error == 0)
          {
            $scope.LoadTags();
            $scope.tgfrm="";
             $("#addtag").show();
      $("#updatetag").hide();
      }

        }, function(error) {
         console.log(error)
       });

      };

      $scope.deleteTag=function(id){
        console.log(id)

             $http({
      method: 'GET',
       async:false,  
      url: config.API +'DeleteTag/'+id 
    }).then(function successCallback(response) {
     if(response.data.error == 0)
      { 
      $scope.LoadTags();
      }
     },
     function errorCallback(response) {
       console.log(response);
     });
      };

$scope.editiconflag=false;
    $("#updateIconButton").hide();
    $scope.editCategory=function(c){
     
     $("#updateIconButton").show();
      $("#addIconButton").hide();

        $scope.icnfrm={
      UserId:sessionid,
      CategoryName:c.CategoryName,
      CategoryImage:c.CategoryImage,
   //   CategoryType:c.CategoryType,
      Flag:1,
    }
    //$scope.icnfrm.CategoryType=c.CategoryType;
      //console.log( $scope.icnfrm);
    $scope.icon=c.CategoryImage;
    $scope.UserCategoryId=c.UserCategoryId;



    };

    $scope.UpdateIcon=function(icnfrm){
   
       if (!angular.isDefined($scope.icnfrm.CategoryType) || $scope.icnfrm.CategoryType == null || $scope.icnfrm.CategoryType == undefined || $scope.icnfrm.CategoryType == '') {
            $scope.icontypeinvalid = true;
           $scope.formIcon=false;
           // return false;
        }
        else
        {
             $scope.icontypeinvalid = false;
           $scope.formIcon=true;
        }

        if($scope.formIcon){
          $scope.updateicnfrm.CategoryName=icnfrm.CategoryName;
           $scope.updateicnfrm.CategoryImage=$scope.icon;
            $scope.updateicnfrm.CategoryType=icnfrm.CategoryType.name;
            var request = $http({
          method: 'POST',
          url: config.API+'EditCustomUserCategories/'+ $scope.UserCategoryId,
          data: $scope.updateicnfrm,
        }).then(function(result) {
          console.log(result);

          if(result.data.error == 0)
          {
            $scope.LoadIcons();
           $scope.icnfrm="";
            $scope.icon="";
             $("#addIconButton").show();
          $("#updateIconButton").hide();
      }

        }, function(error) {
         console.log(error)
       });
        }
    };


    $scope.deleteCategory=function(UserCategoryId){
       $http({
      method: 'GET',
       async:false,  
      url: config.API +'DeleteUserCategory/'+UserCategoryId 
    }).then(function successCallback(response) {
     if(response.data.error == 0)
      { 
      $scope.LoadIcons();
      }
     },
     function errorCallback(response) {
       console.log(response);
     });
    };



});