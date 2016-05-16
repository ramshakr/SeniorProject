angular.module('TripviewCtrl', []).controller('tripviewController',
  		['$scope', '$location', 'AuthService', '$http', '$routeParams', 'index',
      function ($scope, $location, AuthService, $http, $routeParams) {

        $scope.starRating1 = 0;
    $scope.hoverRating1 = 0;
    $scope.newrating = null,

    $scope.mouseHover1 = function (param) {
        console.log('mouseHover(' + param + ')');
        $scope.hoverRating1 = param;
    };

    $scope.mouseLeave1 = function (param) {
        console.log('mouseLeave(' + param + ')');
        $scope.hoverRating1 = param + '*';
    };




    var cities = [];
    var place;
    var searchAddressInput = document.getElementById('pac-input');
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(40.8833, 74.0167),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
    }

    var infoWindow = new google.maps.InfoWindow();
    var createMarker = function (info){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent(marker.title);
            infoWindow.open($scope.map, marker);
        });
        $scope.markers.push(marker);
        $scope.$apply();
        $scope.abc = "checkthis";
    }

    var search1 = function(txtAddress) {
        var geocoder = new google.maps.Geocoder();
        var address = txtAddress;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude1 = results[0].geometry.location.lat();
                var longitude1 = results[0].geometry.location.lng();
                  cities.push({
                    city : txtAddress,
                    desc : '',
                    lat : latitude1,
                    long : longitude1
                });
                createMarker(cities[cities.length-1]);
                }
        });
    };
    var trip_id = $routeParams.id;
    $scope.tripid = trip_id;
    var allusers =[];
    var allusersid =[];
    $scope.titles = [];
    $scope.gid;
    $scope.tripusers = null;
    var tripviewplaces = [];
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $http.get('/user/trip_data').success(function(data) {
      $http.get('/user/upc_data_all').success(function (data1, status) {
          $http.get('/user/getUser').success(function (data2, status) {
            $scope.triprating = [];
            $http.get('/user/getUsers').success(function (data3, status) {
              allusers = data3;
              for(i = 0; i< allusers.length; i++) {
                if(allusers[i].local != null && ($scope.titles.indexOf(allusers[i].local.username) <1) && data2._id != allusers[i]._id) {
                  $scope.titles.push(allusers[i].local.username);
                  allusersid.push(allusers[i]._id);
                 }
                 else if(allusers[i].facebook != null && ($scope.titles.indexOf(allusers[i].facebook.email) <1) && data2._id != allusers[i]._id) {
                  $scope.titles.push(allusers[i].facebook.email);
                  allusersid.push(allusers[i]._id);
                 }
              }
            });
            $scope.tripusers = data2._id;
            var fname;
            if(data2.local!= null) {
              fname = data2.local.username;
            }
            else if (data2.facebook!=null) {
              fname = data2.facebook.email;
            }
              for (i = 0; i < data1.length; i++) {
                if(data1[i]._id == trip_id) {
                  $scope.tripname = data1[i].Name;
                } 
              }

              for (i = 0; i < data1.length; i++) {
                if(data1[i]._id == trip_id) {
                  $scope.tripname = data1[i].Name;
                  $scope.triprating = data1[i].rating;
                  // console.log(data1[i].rating[0]);
                  $scope.oldid = data1[i]._id;
                } 
              }
            
            

            $scope.addItem = function(person){
               var gindex = $scope.titles.indexOf(person);
               var personid =  allusersid[gindex];
               var gdata = {
                fperson : fname,
                from : trip_id,
                pid : personid
              };
              $http.post("/user/newgroupdata", gdata).success(function (data){
                console.log(data.msg._id);
              });
             };

            $scope.tripviewall = data;
            var tripviewarray = [];
            var index1 = 0;
            for (i = 0; i < data1.length; i++) {
              if(data1[i]._id == trip_id) {
                index1 = i;
                tripviewplaces.push(data1[i].Places);
              }
            }

            if (data1[index1].dataid == data2._id) {
             $scope.usertrip = 1;
            }
            else if(data2._id == null) {
              $scope.usertrip = 2;
            }


            for (i = 0; i < $scope.tripviewall.length; i++) {
              if ($scope.tripviewall[i].upc == trip_id) {
                tripviewarray.push($scope.tripviewall[i]);

              }
            }


            var promise1 = $http.get('/user/getreviews/'+trip_id);

              promise1.then(
                function(review) {
                 $scope.gottenreviews = review.data;
                $scope.addreview = function(reviews){
                  if (reviews==undefined) {}
                  else {
                    console.log(reviews);
                    // console.log($scope.reviews1);
                      var reviewdata = {
                      review : reviews,
                      forr: trip_id
                    };
                    console.log(reviewdata);
                    $http.post("/user/reviews", reviewdata).success(function (data){
                      console.log(data.msg._id);
                      alert('Your review ('+ reviews+ ') has been recorded');
                      // $scope.gottenreviews.push(reviews);
                    });
                  };
                };
              });


              $scope.tripview = tripviewarray;
            console.log($scope.triprating);
            if(data2) {
                $scope.click1 = function (param) {
                  console.log('Click(' + param + ')');
                  $scope.newrating = parseInt(param);
                  console.log($scope.newrating);
                        // var flag = false;
                        var getratingg=null;
                        var promise = $http.get('/user/getrating/'+trip_id);

                      promise.then(
                          function(getratinggg) {
                          getratingg = getratinggg.data;
                          console.log(getratingg);
                        if(getratingg.length>0) {
                          console.log("hhhhhhhh");
                          var allfroms = [];
                          for(jj=0; jj<getratingg.length;jj++) {
                            allfroms.push(getratingg[jj].from);
                          }
                          if (allfroms.indexOf(data2._id) > -1) { //1
                            var ind = allfroms.indexOf(data2._id);
                            var updatedrating = {
                              rid: getratingg[ind]._id,  
                              oldid: $scope.oldid,
                              from: data2._id,
                              rating:$scope.newrating
                            };
                            console.log(updatedrating);
                            $http.post("/user/updaterating", updatedrating).success(function (ratingg){ //2
                              console.log(ratingg);
                              $http.get('/user/getrating/'+trip_id).success(function (getratinggg2, status) {
                                console.log(getratinggg2);
                                var count = 0;
                                var allrating = [];
                                for(mm=0; mm<getratinggg2.length; mm++) {
                                  allrating.push(getratinggg2[mm].rating);
                                }
                                console.log(allrating.length);
                                var total = allrating.reduce(function(a, b) {
                                  count++;
                                  console.log(count);
                                  return a + b;
                                });
                                if(count == (allrating.length -1)) {
                                  var starss = total/(allrating.length);
                                  console.log($scope.triprating);
                                  var ratingdata = {
                                    oldid: $scope.oldid,
                                    rating:$scope.triprating,
                                    stars:starss
                                  }
                                  $http.post("/user/newrating1", ratingdata).success(function (ratingg){
                                 });
                                }
                                console.log(getratingg);
                              });
                            }); //2
                     
                           }  //1               
                         
                          else {
                            var ratingdata2 = {
                              oldid: $scope.oldid,
                              from: data2._id,
                              rating:$scope.newrating
                            };
                            $http.post("/user/newrating2", ratingdata2).success(function (ratingg){
                           //console.log(ratingg);
                               $http.get('/user/getrating/'+trip_id).success(function (getratinggg2, status) {
                                console.log(getratinggg2);
                                var count = 0;
                                var allrating = [];
                                for(mm=0; mm<getratinggg2.length; mm++) {
                                  allrating.push(getratinggg2[mm].rating);
                                }
                                console.log(allrating.length);
                                var total = allrating.reduce(function(a, b) {
                                  count++;
                                  console.log(count);
                                  return a + b;
                                });
                                if(count == (allrating.length -1)) {
                                  var starss = total/(allrating.length);
                                  console.log($scope.triprating);
                                  var ratingdata = {
                                    oldid: $scope.oldid,
                                    rating:$scope.triprating,
                                    stars:starss
                                  }
                                  $http.post("/user/newrating1", ratingdata).success(function (ratingg){
                                 });
                                }
                                console.log(getratingg);
                              });
                            });
                          }
                        }
                        else {
                          var ratingdata2 = {
                            oldid: $scope.oldid,
                            from: data2._id,
                            rating:$scope.newrating
                          };
                          $http.post("/user/newrating2", ratingdata2).success(function (ratingg){
                         //console.log(ratingg);
                             $http.get('/user/getrating/'+trip_id).success(function (getratinggg2, status) {
                              console.log(getratinggg2);
                              var count = 0;
                              var allrating = [];
                              for(mm=0; mm<getratinggg2.length; mm++) {
                                allrating.push(getratinggg2[mm].rating);
                              }
                              console.log(allrating.length);
                              var total = allrating.reduce(function(a, b) {
                                count++;
                                console.log(count);
                                return a + b;
                              });
                              if(count == (allrating.length -1)) {
                                var starss = total/(allrating.length);
                                console.log($scope.triprating);
                                var ratingdata = {
                                  oldid: $scope.oldid,
                                  rating:$scope.triprating,
                                  stars:starss
                                }
                                $http.post("/user/newrating1", ratingdata).success(function (ratingg){
                               });
                              }
                              console.log(getratingg);
                            });
                          });
                        }
                      });
              };
            }



            // var triptwo = [];
            // for (i=0;i<tripviewarray.length;i++) {
            //   triptwo.push(tripviewarray[i]);
            // }
            $scope.tripview = angular.copy(tripviewarray);
            $scope.daynum = $scope.tripview.length+1;
            $scope.daydate = tripviewarray[tripviewarray.length-1].Day;
            var tripplacearr = [];
          for (i = 0; i < $scope.tripview.length; i++) {
            if (tripplacearr.indexOf($scope.tripview[i].Place) < 0) {
              tripplacearr.push($scope.tripview[i].Place);
            }
          }

          $scope.markers = [];
          for (i = 0; i<tripviewplaces[0].length; i++) {
            search1(tripviewplaces[0][i]);
          }
          $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
          }

          var directionsDisplay = new google.maps.DirectionsRenderer({
            map: $scope.map
          });
          var waypoints = [];
          var size = tripviewplaces[0].length;
          for(i=1;i<size-1; i++) {
            var address = tripviewplaces[0][i];
            if (address !== "") {
                waypoints.push({
                    location: address,
                    stopover: true
                });
            }
          }
      // Set destination, origin and travel mode.
            var request = {
              destination: tripviewplaces[0][size-1],
              origin: tripviewplaces[0][0],
              waypoints: waypoints, //an array of waypoints
              optimizeWaypoints: true,
              travelMode: google.maps.TravelMode.DRIVING
            };

            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                // Display the route on the map.
                directionsDisplay.setDirections(response);
              }
            });

          $scope.SaveChange = function(xx) {
            var edittriparr = [];

            for (i=0; i<$scope.tripview.length; i++) {
              if ($scope.tripview[i].Act != tripviewarray[i].Act) {
                $http.put('/user/edit_trip/'+$scope.tripview[i]._id, $scope.tripview[i]).success(function (data){
                });
              }
            }
          }

          $scope.DeleteDay = function(dayid1) {
            console.log("innn the function", dayid1);
            $http.delete('/user/delete_day/'+dayid1).success(function (data){
              alert("The day has been successfully deleted");
                });

          }

          $scope.distancethings1 = [];
          if (tripviewplaces[0].length == 2) {
            $http.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+tripviewplaces[0][0]+"&destinations="+tripviewplaces[0][1]+"&mode=air&key=AIzaSyCXB9yqyxxgysf1jF1v7Azh4yynfnjemMw").success(function(data) {
              $scope.distancethings1.push({origin : data.origin_addresses[0], dest : data.destination_addresses[0], distance: data.rows[0].elements[0].distance.text, duration: data.rows[0].elements[0].duration.text});
            });
          } else if (tripviewplaces[0].length > 2) {
            for (i = 0; i < tripviewplaces[0].length - 1; i++) {
              $http.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+tripviewplaces[0][i]+"&destinations="+tripviewplaces[0][i+1]+"&mode=air&key=AIzaSyCXB9yqyxxgysf1jF1v7Azh4yynfnjemMw").success(function(data) {
                $scope.distancethings1.push({origin : data.origin_addresses[0], dest : data.destination_addresses[0], distance: data.rows[0].elements[0].distance.text, duration: data.rows[0].elements[0].duration.text});
              });
            }
          }
        });   
      });
    });
  }]);