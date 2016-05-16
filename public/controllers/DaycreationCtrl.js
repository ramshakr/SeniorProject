
angular.module('DaycreationCtrl', []).controller('daycreationController',
    

      ['$scope', '$location', 'AuthService', '$http', '$routeParams',
      function ($scope, $location, AuthService, $http, $routeParams) {
        ///////////////////////////////////////////////////////////////////////////////////////

      $scope.dayhotelhere = false;
      $scope.moveToBox = function(id) {
        console.log(id);
        console.log("yeh thiii");
        for (ii = 0; ii < $scope.googlehotels1.length; ii++) {     
          console.log($scope.googlehotels1[ii].name + "itsss name");              
          if ($scope.googlehotels1[ii].name == id) {
              console.log(id,"iddd--00");
              $scope.dayhotel = $scope.googlehotels1[ii].name;
              $scope.googlehotels1.splice(ii, 1);
          }
        }
        for (ii = 0; ii < $scope.googlehotels1att.length; ii++) {     
          console.log($scope.googlehotels1att[ii].name + "itsss name");              
          if ($scope.googlehotels1att[ii].name == id) {
              $scope.dayhotel = $scope.googlehotels1att[ii].name;
              $scope.googlehotels1att.splice(ii, 1);
          }
        }
          $scope.$apply();
      };
      
      $scope.toggle = function() {
          $scope.myVar = true;
          $scope.dayhotelhere = false;
           $scope.dragdrop = null;
      };

      $scope.showItmesLeft = function () {
          alert($scope.items.length + " items left.");
      };
       
      $scope.showItmesDropped = function () {
          alert($scope.dropped.length + " items in drop-box.");
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      $http.get('/user/getUser').success(function (data, status) {
        console.log("user");
        console.log(data._id);
        $scope.getUserr = data._id;
        console.log("userrrr");
      });
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
      $scope.isDisabled = true;
      $scope.isDisabledall = true;
      var data1 = '';
      var trip_id = $routeParams.id;
      $scope.daynum = $routeParams.daynum;
      var daydate1 = $routeParams.daydate;
      if (daydate1 != null) {
        $scope.day1 = false;
        $scope.daydate=new Date(daydate1);
        $scope.daydate.setDate($scope.daydate.getDate() + 1);
      } else {
        $scope.day1 = true;
      }
      console.log("scope.day1"+$scope.day1);
      $scope.back_id = trip_id;

      
      $scope.user = {'from': '', 'fromLat': '', 'fromLng' : ''};
      var options = {
          types: ['(cities)'],
        // componentRestrictions: {country: "us"}
      };

      var inputFrom = document.getElementById('from');
      var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
      google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
          var place = autocompleteFrom.getPlace();
          $scope.user.fromLat = place.geometry.location.lat();
          $scope.user.fromLng = place.geometry.location.lng();
          $scope.user.from = place.formatted_address;
          $scope.$apply();
      });
      $scope.rows = [];
      var rows1 = [];
      $scope.timeselect = ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
      $scope.init_time = '00:00';
      $scope.last_time = '23:00';
      $scope.rowscheck = false;
      var dayid = '';

      $scope.addSummary1 = function(){
        $scope.heredata = true;
        $scope.dayactivityadded = $scope.dayactivity;
        $scope.isDisabled = false;
        if (!$scope.createddayid) {
          var data1 = {
            upc : trip_id,
            Day : $scope.daydate,
            Act : $scope.dayactivity
          };
          $http.post("/user/newtripdata", data1).success(function (data){
            console.log(data.msg._id);
            dayid = data.msg._id;
            $scope.createddayid = dayid;
            data1 = null;
          });
        } else {
          var data1 = {
            createddayid : $scope.createddayid,
            Act : $scope.dayactivity
          };
          $http.post("/user/edittripdata", data1).success(function (data){
            console.log(data.msg._id);
            
          });
        }
      };
      $scope.$watch('num', function (value) {
          if (value) {
              console.log(value);
          }
      });
      var googlelistarr = [];
      var googlelistarratt = [];
      var finddeeplink = function(i) {
        $http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+$scope.googlehotels[i].place_id+"&key=AIzaSyCSeom4lWrYUxUzxdNuuA16dUaIGYpHlNw").success(function(data) {
          if (data.result.url) {
            var maplink = data.result.url;
          }
          if (data.result.website) {
            var deeplink = data.result.website;
          }
          $scope.googlehotels1[i].deeplink = deeplink;
          $scope.googlehotels1[i].maplink = maplink;
        })
      }
      var finddeeplinkatt = function(i) {
        $http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+$scope.googlehotels1att[i].place_id+"&key=AIzaSyCSeom4lWrYUxUzxdNuuA16dUaIGYpHlNw").success(function(data) {
          if (data.result.url) {
            var maplink = data.result.url;
          }
          if (data.result.website) {
            var deeplink = data.result.website;
          }
          $scope.googlehotels1att[i].deeplink = deeplink;
          $scope.googlehotels1att[i].maplink = maplink;
        })
      }
      
      $scope.handleChangeEvent = function() {

        $scope.samecityarr = [];
        $http.get('/user/findsamecity/'+$scope.user.from).success(function (data, status) {
          $scope.samecity = data;
          for (i=0; i<3; i++){
            $scope.samecityarr.push({name: $scope.samecity[i].Name, idc: $scope.samecity[i]._id});
          }
        });

        $http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+"+$scope.user.from+"&key=AIzaSyCSeom4lWrYUxUzxdNuuA16dUaIGYpHlNw").success(function(data) {
          $scope.googlehotels = data.results;
          $scope.googlehotels.sort(function(a, b) {
            return parseFloat(a.rating) - parseFloat(b.rating);
          });

          $scope.googlehotels.reverse();
          for (i=0; i<$scope.googlehotels.length; i++) {
            console.log($scope.googlehotels[i].rating + "rating is this");
            if ($scope.googlehotels[i].rating != undefined) {
              googlelistarr.push($scope.googlehotels[i]);
            }
          }

          $scope.googlehotels1 = googlelistarr.slice(0,2);
          googlelistarr = [];
          for (i=0; i< $scope.googlehotels1.length; i++) {
            // console.log("this is hotel name: "+$scope.googlehotels1[i].name);
            finddeeplink(i);
            
            if ($scope.googlehotels[i].photos != undefined) {
              if ($scope.googlehotels1[i].photos.length > 0) {
                $scope.googlehotels1[i].hotelimg = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference="+$scope.googlehotels1[i].photos[0].photo_reference+"&key=AIzaSyCSeom4lWrYUxUzxdNuuA16dUaIGYpHlNw";
              }
            }
          }
        });
        $scope.$applyAsync();

        $http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions+in+"+$scope.user.from+"&key=AIzaSyCSeom4lWrYUxUzxdNuuA16dUaIGYpHlNw").success(function(data) {
          $scope.googlehotelsatt = data.results;
          $scope.googlehotels1att = [];
          for (i=0; i< 2; i++) {
            $scope.googlehotels1att.push($scope.googlehotelsatt[i]);
            finddeeplinkatt(i);
            
            if ($scope.googlehotels1att[i].photos != undefined) {
              if ($scope.googlehotels1att[i].photos.length > 0) {
                $scope.googlehotels1att[i].hotelimg = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference="+$scope.googlehotels1att[i].photos[0].photo_reference+"&key=AIzaSyCSeom4lWrYUxUzxdNuuA16dUaIGYpHlNw";
              }
            }
          }
        });
        $scope.$applyAsync();
      }
    

      $scope.addActivity = function(){
        console.log($scope.user.from + "-$scope.user.from");
        
        var activity = {
          initHr: $scope.init_time,
            Hr: $scope.daypost,
            Act: $scope.dayact,
            Place: $scope.user.from,
            Hotel: $scope.dayhotel,
        };
        var activity1 = {
          upc : trip_id,
          tripid : dayid,
            Hr: $scope.init_time + " - " + $scope.daypost,
            Act: $scope.dayact,
            Place: $scope.user.from,
            Hotel: $scope.dayhotel,
        };
          $scope.dayact = '';
        $scope.user.from = '';
        $scope.dayhotel = '';
        if ($scope.daypost == '23:00') {
          $scope.rowscheck = true;
          $scope.isDisabledall = false;
        }
        $scope.init_time = $scope.daypost;
        $scope.timeselect = $scope.timeselect.slice($scope.timeselect.indexOf($scope.daypost) + 1);
        $scope.rows.push(activity);
        rows1.push(activity1);
      };

      $scope.saveAll = function(){
          console.log(rows1);
          $http.post("/user/newdata", rows1).success(function (data, status, headers){
            alert("done");
          });
          $location.path( '/tripview/'+$scope.back_id );
      };
      $scope.create = function() {
        var data = {Hr : $scope.daypost, Act : $scope.dayact, Place : $scope.user.from, Hotel: $scope.dayhotel};
        $http.post("/user/newdata", data).success(function (data, status, headers){
          alert("task added");
        });
      };
  }]);
