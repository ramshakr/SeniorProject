angular.module('DayviewCtrl', []).controller('dayviewController', function($scope, $http, $log, $routeParams, $sce) {
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

		var cities11 = [];
		var cities = [];
		var cities1 = [];
		var place;
    var searchAddressInput = document.getElementById('pac-input');
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(40.8833, 74.0167),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
    //     types: ['(cities)'],
    //     componentRestrictions: {country: 'pk'}
    }

		var infoWindow = new google.maps.InfoWindow();
    var createMarker = function (info, callname){
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
        if (callname == "cities") {
          $scope.markers.push(marker);
      } else if (callname == "all") {
          $scope.markers22.push(marker);
      }
    }

    var createMarker2 = function (info){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city,
            rating: info.rating
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h4>' + marker.title + '<br>'+ '<h4>' + 'Rating : ' +marker.rating);
            infoWindow.open($scope.map, marker);
        });
        $scope.markers11.push(marker);
    }
    var cities22 = [];
    var search1 = function(txtAddress, callname) {
        var geocoder = new google.maps.Geocoder();
        var address = txtAddress;
        console.log("add: "+address);
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude1 = results[0].geometry.location.lat();
                var longitude1 = results[0].geometry.location.lng();
                if (callname == "all") {
                	cities22.push({
                      city : txtAddress,
                      desc : '',
                      lat : latitude1,
                      long : longitude1
                  });
                  createMarker(cities22[cities22.length-1], callname);
                } else if (callname == "cities") {
                	cities.push({
                    city : txtAddress,
                    desc : '',
                    lat : latitude1,
                    long : longitude1
                });
                createMarker(cities[cities.length-1], callname);
                }
            } else {
                // alert("Request failed.")
            }
        });
    };

    var eventcontrolling2 = function (i, j, dayplacearr, dayhotelarr) {
    	console.log(dayhotelarr[i]+ "   ----   "+$scope.hotellist[j].name);
      if (($scope.hotellist[j].name.indexOf(dayhotelarr[i]) > -1) || (dayhotelarr[i].indexOf($scope.hotellist[j].name) > -1)) {
        	var hotel_rating = $scope.hotellist[j].hotelRating;
  				$scope.dayview[i]['rating'] = hotel_rating;
  				var deeplink = $scope.hotellist[j].deepLink;
  				$scope.dayview[i]['deeplink'] = deeplink;
        	console.log("ifoundyou");
        	retrieved_hotelid = $scope.hotellist[i].hotelId;
        	console.log(retrieved_hotelid);
        	$http.get("http://api.ean.com/ean-services/rs/hotel/v3/info??minorRev=30&cid=55505&apiKey=9kxdnz8ngbf7gmwkzm4qkgjw&customerUserAgent=Mozilla/5.0%20(Windows%207)&_type=json&hotelId="+retrieved_hotelid)
        .success(function(data) {		          		
        		$scope.hotelinfo1 = data.HotelInformationResponse.HotelImages.HotelImage[0].url;
        		console.log($scope.hotelinfo1);
        		$scope.dayview[i]['hotelinfo'] = $scope.hotelinfo1;
        })
      }
    }

    var eventcontrolling = function (i, dayplacearr, dayhotelarr) {
    	console.log("hhhhhhhhhhhhh"+dayplacearr[i]);
    	$http.get("http://api.ean.com/ean-services/rs/hotel/v3/list?cid=55505&minorRev=30&apiKey=9kxdnz8ngbf7gmwkzm4qkgjw&customerUserAgent=Mozilla/5.0%20(Windows%207)&_type=json&destinationString="+dayplacearr[i])
      .success(function(data) {
      		$scope.hotellist = data.HotelListResponse.HotelList.HotelSummary;
      		console.log("hotellist.length = "+$scope.hotellist.length);
      		for (var j = 0; j < $scope.hotellist.length; j++) {
              eventcontrolling2(i, j, dayplacearr, dayhotelarr);
          }
        })
    }

    var googlegetphoto = function (i, photoarr) {
      var photo_id = photoarr.photo_reference;
      $scope.dayview[i]['hotelinfo'] = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference="+photo_id+"&key=AIzaSyBnO_4H6kudy9mG3NP4fOtMqs9emF4We50";
    }

    var googlegetdeeplink = function (i, retrieved_hotelid) {
      $http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+retrieved_hotelid+"&key=AIzaSyBnO_4H6kudy9mG3NP4fOtMqs9emF4We50").success(function(data1) {
        if (data1.result.url) {
          var maplink = data1.result.url;
        }
        if (data1.result.website) {
          var deeplink = data1.result.website;
        }
        $scope.dayview[i]['deeplink'] = deeplink;
        $scope.dayview[i]['maplink'] = maplink;
      })
    }
    

    var eventcontrollinggoogle = function (i, dayplace, dayhotel) {
      $http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query="+dayhotel+" in "+dayplace+"&key=AIzaSyBnO_4H6kudy9mG3NP4fOtMqs9emF4We50").success(function(data) {
        if (data.results.length > 0) {
          $scope.googledirectlist = data.results;
          
          var hotel_rating = $scope.googledirectlist[0].rating;
          $scope.dayview[i]['rating'] = hotel_rating;

          var hotel_address = $scope.googledirectlist[0].formatted_address;
          $scope.dayview[i]['address'] = hotel_address;

          if ($scope.googledirectlist[0].photos === undefined) {
            console.log("no photos for "+ dayhotel+dayplace);
          } else if ($scope.googledirectlist[0].photos.length > 0) {
            var photoarr = $scope.googledirectlist[0].photos[0];
            googlegetphoto(i, photoarr);
          }

          retrieved_hotelid = $scope.googledirectlist[0].place_id;
          console.log(retrieved_hotelid + " --retrieved_hotelid");
          googlegetdeeplink(i, retrieved_hotelid);

        }
      })
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);


    var day_id = $routeParams.id;
    $http.get('/user/trip_data').success(function(datatrip) {
      for (i = 0; i < datatrip.length; i++) {
        //console.log($scope.dayviewall[i].tripid);
        if (datatrip[i]._id == day_id) {
          $scope.dayactname = datatrip[i].Act;
        }
      }
    });
		$http.get('/user/day_data').success(function(data) {

			console.log("just got day_data");
			$scope.dayviewall = data;
			var dayviewarray = [];
      var tripidd= null;
      //console.log(data);
    	for (i = 0; i < $scope.dayviewall.length; i++) {
        //console.log($scope.dayviewall[i].tripid);
    		if ($scope.dayviewall[i].tripid == day_id) {
    			dayviewarray.push($scope.dayviewall[i]);
    			tripidd = $scope.dayviewall[i].upc;
    		}
    	}
    	$scope.back_id = tripidd;
    	$scope.dayview = angular.copy(dayviewarray);
			var dayplacearr = [];
			var dayhotelarr = [];
			var dayallhotelarr = [];
			var dayallplacearr = [];
			for (i = 0; i < $scope.dayview.length; i++) {
				if (dayplacearr.indexOf($scope.dayview[i].Place) < 0) {
					dayplacearr.push($scope.dayview[i].Place);
					dayhotelarr.push($scope.dayview[i].Hotel);
				}
				dayallhotelarr.push($scope.dayview[i].Hotel);
				dayallplacearr.push($scope.dayview[i].Place);
      }
      
      $scope.citiesforweather = [];
      var cityweatherlink = "";
      function weatherFuction (cityweatherlink) {
        $http.get("http://www.weather-forecast.com/locations/"+cityweather+"/forecasts/latest/threedayfree").success(function(data, status) {
          console.log("status" + status + "    "+cityweather);
          $scope.citiesforweather.push($sce.trustAsResourceUrl(cityweatherlink));
        });
      }
      for (i=0; i<dayplacearr.length; i++) {
        var cityweather = dayplacearr[i].substring(0, dayplacearr[i].indexOf(','));
        cityweather = cityweather.replace(/\s/g, '');

        cityweatherlink = "http://www.weather-forecast.com/locations/"+cityweather+"/forecasts/latest/threedayfree";
        weatherFuction(cityweatherlink);
        
      }
      
      var directionsDisplay = new google.maps.DirectionsRenderer({
          map: $scope.map
        });
      var waypoints = [];
      console.log(dayplacearr + "  dddd");
      var size = dayplacearr.length;
      console.log(size);
      for(i=1;i<size-1; i++) {
        var address = dayplacearr[i];
        console.log(address+ "  dddd");
        if (address !== "") {
            waypoints.push({
                location: address,
                stopover: true
            });
        }
      }
  // Set destination, origin and travel mode.
        var request = {
          destination: dayplacearr[size-1],
          origin: dayplacearr[0],
          waypoints: waypoints, //an array of waypoints
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        };

        // Pass the directions request to the directions service.
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            // Display the route on the map.
            directionsDisplay.setDirections(response);
          }
        });
			var retrieved_hotelid = 0;

			$scope.hotelimg = function() {
				for (i = 0; i < dayallplacearr.length; i++) {
					eventcontrolling(i, dayallplacearr, dayallhotelarr);
				}
			}


      $scope.SaveChange = function(xx) {
        var editdayarr = [];

        for (i=0; i<$scope.dayview.length; i++) {
          if (($scope.dayview[i].Act != dayviewarray[i].Act) || ($scope.dayview[i].Place != dayviewarray[i].Place) || ($scope.dayview[i].Hotel != dayviewarray[i].Hotel) || ($scope.dayview[i].Hr != dayviewarray[i].Hr)) {
            
            $http.put('/user/edit_day/'+$scope.dayview[i]._id, $scope.dayview[i]).success(function (data){
            });
          }
        }
      }



      // !!!!!!~~~~~~~ GOOGLE API CALL ~~~~~~~!!!!!!
      for (i = 0; i < dayallplacearr.length; i++) {
        eventcontrollinggoogle(i, dayallplacearr[i], dayallhotelarr[i]);
      }
      $scope.distancethings = [];

      if (dayplacearr.length == 2) {
        $http.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+dayplacearr[0]+"&destinations="+dayplacearr[1]+"&mode=air&key=AIzaSyCXB9yqyxxgysf1jF1v7Azh4yynfnjemMw").success(function(data) {
          $scope.distancethings.push({origin : data.origin_addresses[0], dest : data.destination_addresses[0], distance: data.rows[0].elements[0].distance.text, duration: data.rows[0].elements[0].duration.text});
        });
      } else if (dayplacearr.length > 2) {
        for (i = 0; i < dayplacearr.length - 1; i++) {
          $http.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+dayplacearr[i]+"&destinations="+dayplacearr[i+1]+"&mode=air&key=AIzaSyCXB9yqyxxgysf1jF1v7Azh4yynfnjemMw").success(function(data) {
            $scope.distancethings.push({origin : data.origin_addresses[0], dest : data.destination_addresses[0], distance: data.rows[0].elements[0].distance.text, duration: data.rows[0].elements[0].duration.text});
          });
        }
      }

      $scope.markers = [];
      $scope.markers22 = [];
      for (i = 0; i<dayplacearr.length; i++) {
      	search1(dayplacearr[i], "cities");
      }
    	if ($scope.markers22.length == 0) {
        for (i = 0; i<dayallhotelarr.length; i++) {
        	search1(dayallhotelarr[i]+"+"+dayallplacearr[i], "all");
        }
	    }

      $scope.search3 = function(city) {
      	angular.forEach($scope.markers11, function(marker) {
			    marker.setMap(null);
				});
      	// console.log("marker title sent is: "+ city);
          cities11 = [];
          $scope.markers11 = [];
          $http.get("http://api.ean.com/ean-services/rs/hotel/v3/list?cid=55505&minorRev=30&apiKey=9kxdnz8ngbf7gmwkzm4qkgjw&customerUserAgent=Mozilla/5.0%20(Windows%207)&_type=json&destinationString="+city)
        .success(function(data) {
          $scope.names = data.HotelListResponse.HotelList.HotelSummary;
          for (var i = 0; i < $scope.names.length; i++) {
              var lat1 = $scope.names[i].latitude;
              var long1 = $scope.names[i].longitude;
              var name1 = $scope.names[i].name;
              var hotel_rating = $scope.names[i].hotelRating;
              cities11.push({
                  city : name1,
                  desc : '',
                  lat : lat1,
                  long : long1,
                  rating : hotel_rating
              });
              createMarker2(cities11[cities11.length-1]);
          }
          });
      }

      $scope.erasemarkers = function() {
      	angular.forEach($scope.markers11, function(marker) {
  		    marker.setMap(null);
  			});
      }
      $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
      }

  	});
  });