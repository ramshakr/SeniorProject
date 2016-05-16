angular.module('TripcreationCtrl', []).controller('tripcreationController',
  		['$scope', '$location', 'AuthService', '$http', '$routeParams',
  		function ($scope, $location, AuthService, $http, $routeParams) {
		
		$scope.rows = [];
		var rows1 = [];
		var getUserr = null;

		
		$scope.user1 = {'from1': '', 'fromLat1': '', 'fromLng1' : ''};
		  var options1 = {
		      types: ['(cities)'],
		  };

		  var inputFrom1 = document.getElementById('from1');
		  var autocompleteFrom1 = new google.maps.places.Autocomplete(inputFrom1, options1);
		  google.maps.event.addListener(autocompleteFrom1, 'place_changed', function() {
		      var place1 = autocompleteFrom1.getPlace();
		      $scope.user1.fromLat1 = place1.geometry.location.lat();
		      $scope.user1.fromLng1 = place1.geometry.location.lng();
		      $scope.user1.from1 = place1.formatted_address;
		      $scope.$apply();
		  });


		  $scope.user2 = {'from2': '', 'fromLat2': '', 'fromLng2' : ''};
		  var options2 = {
		      types: ['(cities)'],
		  };

		  var inputFrom2 = document.getElementById('from2');
		  var autocompleteFrom2 = new google.maps.places.Autocomplete(inputFrom2, options2);
		  google.maps.event.addListener(autocompleteFrom2, 'place_changed', function() {
		      var place2 = autocompleteFrom2.getPlace();
		      $scope.user2.fromLat2 = place2.geometry.location.lat();
		      $scope.user2.fromLng2 = place2.geometry.location.lng();
		      $scope.user2.from2 = place2.formatted_address;
		      $scope.$apply();
		  });



		  $scope.user3 = {'from3': '', 'fromLat3': '', 'fromLng3' : ''};
		  var options3 = {
		      types: ['(cities)'],
		  };

		  var inputFrom3 = document.getElementById('from3');
		  var autocompleteFrom3 = new google.maps.places.Autocomplete(inputFrom3, options3);
		  google.maps.event.addListener(autocompleteFrom3, 'place_changed', function() {
		      var place3 = autocompleteFrom3.getPlace();
		      $scope.user3.fromLat3 = place3.geometry.location.lat();
		      $scope.user3.fromLng3 = place3.geometry.location.lng();
		      $scope.user3.from3 = place3.formatted_address;
		      $scope.$apply();
		  });


		  var cityarr = [];
  		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  		$http.get('/user/getUser').success(function (data, status) {
  			console.log("user");
  			console.log(data._id);
  			getUserr = data._id;
  			console.log("userrrr");

  			$scope.addSummary = function(){
  				console.log($scope.privacy);
  				if ($scope.user1.from1) {
  					cityarr.push($scope.user1.from1);
  				}
  				if ($scope.user2.from2) {
  					cityarr.push($scope.user2.from2);
  				}
  				if ($scope.user3.from3) {
  					cityarr.push($scope.user3.from3);
  				}
			    var data = {
			    	Name : $scope.upcname,
			    	Src : $scope.upcimg,
			    	privacy : $scope.privacy,
			    	Places : cityarr,
			    	dataid : getUserr
			    };
			    $http.post("/user/newupcdata", data).success(function (data, status, headers){
					console.log(data._id);
					dayid = data._id;
				});
				$location.path( '/upc');
			};

  		});
  		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);