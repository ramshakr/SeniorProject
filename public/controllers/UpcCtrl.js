	angular.module('UpcCtrl', []).controller('upcController',
  		['$scope', '$location', 'AuthService', '$http', '$routeParams',
  		function ($scope, $location, AuthService, $http, $routeParams) {
        $scope.loginuser = null;
      var getUserr = null;
    $http.get('/user/upc_data').success(function (data, status) {
        $scope.upc = data;
        $scope.idd = "3";
        $scope.num = [1,2,3];
    });
    var addedtripids = [];

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

      $scope.saveAll = function(){
        $http.get('/user/findbycity/'+$scope.user.from).success(function (data, status) {
          $scope.findbycity = data;
          $scope.upc = $scope.findbycity;
        });
      }

      $scope.DeleteTrip = function(tripid1) {
        console.log("innn the function", tripid1);
        $http.delete('/user/delete_trip/'+tripid1).success(function (data){
            });

      }


//////////////////////////////////////////////////////////////////////////////////////////////////////
		$http.get('/user/getUser').success(function (data, status) {
      getUserr = data._id;
          $scope.loginuser = getUserr;
         $scope.upc1 = null;
          $scope.group = null;
        if(getUserr) {
          $http.get('/user/upc_data1').success(function (data, status) {
            $scope.upc1 = data;
            
            $scope.idd = "3";
            $scope.num = [1,2,3];
          });
          $http.get('/user/groupdata1').success(function (data_group, status) {
            $scope.group = data_group;
          });
        }
      });
	}]);