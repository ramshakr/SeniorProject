	// create the module and name it scotchApp

	var scotchApp = angular.module('scotchApp', ['ngRoute']);
	scotchApp.value('index', 0);
	scotchApp.config(function ($routeProvider) {
		if (window.location.hash === '#_=_') {
  			window.location.hash = '';
		}
		$routeProvider

			.when('/', {
				templateUrl : 'views/upc.html',
				controller  : 'upcController',
				// resolve: {
    //     			loggedin: checkLoggedin
    //   			}
			})

			.when('/about', {
				templateUrl : 'views/about.html',
				controller  : 'aboutController'
			})

			.when('/login', {
	      templateUrl: 'views/login.html',
	      controller: 'loginController'
	      //access: {restricted: false}
	    })

			.when('/logout', {
				//templateUrl: 'pages/login.html',
				// template: '<h1>This is page one!</h1>',
	    	controller: 'logoutController',
	    	access: {restricted: true}
	    })
	    .when('/register', {
	      templateUrl: 'views/register.html',
	      controller: 'registerController'
	      //access: {restricted: false}
	    })

			.when('/upc', {
				templateUrl : 'views/upc.html',
				controller  : 'upcController',
				// resolve: {
			 //        loggedin: checkLoggedin
			 //      }
			})

			.when('/tripview/:id', {
				templateUrl : 'views/tripview.html',
				controller  : 'tripviewController',
				// resolve: {
			 //        loggedin: checkLoggedin
			 //      }
			})

			.when('/dayview/:id', {
				templateUrl : 'views/dayview.html',
				controller  : 'dayviewController',
				// resolve: {
			 //        loggedin: checkLoggedin
			 //      }
			})

			.when('/contact', {
				templateUrl : 'views/contact.html',
				controller  : 'contactController'
			})

			.when('/daycreation/:id/:daynum/:daydate', {
				templateUrl : 'views/daycreation.html',
				controller  : 'daycreationController',
				resolve: {
				    loggedin: checkLoggedin
			    }
			})

			.when('/tripcreation', {
				templateUrl : 'views/tripcreation.html',
				controller  : 'tripcreationController',
				resolve: {
        			loggedin: checkLoggedin
        		}		
			})
			.otherwise({redirectTo: '/login'});
	});
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();
    $http.get('/loggedin').success(function(user)
    {
       // $rootScope.errorMessage = null;
        // User is Authenticated
        console.log(user);
        if (user !== '0')
        {
            //$rootScope.currentUser = user;
            deferred.resolve();
        }
        // User is Not Authenticated
        else
        {
            //$rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });
    return deferred.promise;
};

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
angular.module('scotchApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    // create user variable
    var user = null;
    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      fblogin: fblogin,
    });

    function isLoggedIn() {
        if(user) {
          return true;
        } else {
          return false;
        }
    }

    function getUserStatus() {
      return user;
    }
    // function getUser() {
    //   return user;
    // }

    function login(username, password) {
      // create a new instance of deferred
      var deferred = $q.defer();
      console.log("hellloooo");
      // send a post request to the server
      $http.post('/user/login', {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            console.log(":((((")
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }
    
    function logout() {
      // create a new instance of deferred
      console.log("loggingout");
      var deferred = $q.defer();
      console.log("hhh");
      // send a get request to the server
      $http.get('/user/logout',
      	console.log("whynott"))
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }


    function register(username, password) {
      // create a new instance of deferred
      var deferred = $q.defer();
      console.log("ramsha");
      // send a post request to the server
      $http.post('/user/register', 
      	{username: username, password: password},
        console.log("here"))
        // handle success
        .success(function (data, status) {
          console.log("here111")
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }
    function fblogin() {
      console.log("hellloooo");
      // create a new instance of deferred
      var deferred = $q.defer();
      //console.log("hellloooo");
      // send a post request to the server
      $http.get('/user/facebook')
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            console.log(":((((")
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }
}]);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

angular.module('scotchApp').controller('loginController',
  ['$scope', '$location', 'AuthService', 'index',
  function ($scope, $location, AuthService) {
    $scope.loginform = false;
    $scope.registerform = false;
    $scope.seelogin = function() {
      $scope.loginform = true;
      $scope.registerform = false;
    };
    $scope.seeregister = function() {
      $scope.registerform = true;
      $scope.loginform = false;
    };


    console.log(AuthService.getUserStatus());
    index = 0;
    $scope.login = function () {
      console.log("sjjsj");
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          console.log("homeee");
          $location.path('/upc');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };
}]);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

angular.module('scotchApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.logout = function () {
      console.log(AuthService.getUserStatus());
      console.log("kahlkhf");
      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('#login');
        });
    };
}]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

angular.module('scotchApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    console.log(AuthService.getUserStatus());
    console.log("what");
    $scope.register = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
    };
}]);
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	scotchApp.controller('mainController', function($scope) {
		$scope.message = 'This website provides the users with a simple way of deciding and creating trip plans by letting them design precise and accurate schedules and by giving them access to the trip itineraries shared by other people';
	});


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	scotchApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('scotchApp').controller('upcController',
  		['$scope', '$location', 'AuthService', '$http', '$routeParams',
  		function ($scope, $location, AuthService, $http, $routeParams) {
        $scope.loginuser = null;
  		var getUserr = null;
      var stars1=null;
		$http.get('/user/upc_data').success(function (data, status) {
      // $http.get('/user/getrating').success(function (stars, status) {

      // });
        console.log(data);
        $scope.upc = data;
        var starz =[];
        var allrating = [];
        var count = 0;
        var done = null;
	    	for (i = 0; i < $scope.upc.length; i++) {
	    		console.log($scope.upc[i]._id);
          // $http.get('/user/getrating/' + $scope.upc[i]._id).success(function (stars, status) {
          //   stars1=stars;
          //   if (stars.length>0) {
          //     for (j=0; j< stars.length; j++) {
          //       allrating.push(stars[j].rating);
          //     }
          //    var total = allrating.reduce(function(a, b) {
          //     count++;
          //     console.log(count);
          //     return a + b;
          //   });
          //    if(count == (allrating.length -1)) {
          //     console.log(total);
          //     starz.push(total);
          //    }
          //  }
          // });
          // done++;
          // console.log(done);
	    	}
	    	$scope.idd = "3";
	    	$scope.num = [1,2,3];
		});
    var addedtripids = [];
//////////////////////////////////////////////////////////////////////////////////////////////////////
 // if (done == stars1.length) {
		$http.get('/user/getUser').success(function (data, status) {
      getUserr = data._id;
          $scope.loginuser = getUserr;
         $scope.upc1 = null;
          //$scope.group = null;
          console.log("getUserr");
  			if(getUserr) {
	  			console.log("getUserr");
	  			$http.get('/user/upc_data1').success(function (data, status) {
            $scope.upc1 = data;
            console.log($scope.upc1);
  		    	for (i = 0; i < $scope.upc1.length; i++) {
  		    		console.log($scope.upc1[i]._id);
  		    	}
  		    	$scope.idd = "3";
  		    	$scope.num = [1,2,3];
  				});
          //$scope.group = [];
          $http.get('/user/groupdata1').success(function (data_group, status) {
          // for(i = 0; i<data.length; i++) {
          //   //console.log(data[i]);
          //   data[i].Src = "http://www.southernstartourandtravel.com/files/CAR_01.jpg";
          // }
            // for (i = 0; i < data_group.length; i++) {
              // $http.get('/user/upc_dataadded').success(function (data, status) {
              //   $scope.upc = data;
              //   for (i = 0; i < $scope.upc.length; i++) {
              //     console.log($scope.upc[i]._id);
              //   }
              //   $scope.idd = "3";
              //   $scope.num = [1,2,3];
              // });
              // addedtripid.push(data_group.from);
            // }
            // console.log()
            console.log(data_group);

            $scope.group = data_group;
            console.log($scope.group.length);
            console.log($scope.group.length+"$scope.group.length");
          });
  			}
  		});
  		console.log(getUserr);
	//}
    }]);


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('scotchApp').controller('tripcreationController',
  		['$scope', '$location', 'AuthService', '$http', '$routeParams',
  		function ($scope, $location, AuthService, $http, $routeParams) {
		
		$scope.rows = [];
		var rows1 = [];
		var getUserr = null;
  		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  		$http.get('/user/getUser').success(function (data, status) {
  			console.log("user");
  			console.log(data._id);
  			getUserr = data._id;
  			console.log("userrrr");
  			$scope.addSummary = function(){
		    var data = {
		    	Name : $scope.upcname,
		    	Src : $scope.upcimg,
		    	dataid : getUserr
		    };
		    $http.post("/user/newupcdata", data).success(function (data, status, headers){
				console.log(data._id);
				dayid = data._id;
			});
		};
  		});
  		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
scotchApp.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                    <img ng-src='{{((hoverValue + _rating) <= $index) && \"http://www.codeproject.com/script/ratings/images/star-empty-lg.png\" || \"http://www.codeproject.com/script/ratings/images/star-fill-lg.png\"}}' \
                    ng-Click='isolatedClick($index + 1)' \
                    ng-mouseenter='isolatedMouseHover($index + 1)' \
                    ng-mouseleave='isolatedMouseLeave($index + 1)'></img> \
            </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;
      
      $scope.isolatedClick = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope.rating = $scope._rating = param;
        $scope.hoverValue = 0;
        $scope.click({
          param: param
        });
      };

      $scope.isolatedMouseHover = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope._rating = 0;
        $scope.hoverValue = param;
        $scope.mouseHover({
          param: param
        });
      };

      $scope.isolatedMouseLeave = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope._rating = $scope.rating;
        $scope.hoverValue = 0;
        $scope.mouseLeave({
          param: param
        });
      };
        }
    };
});
  /////////////////////////////////////////////////////////////////////////////
  // angular.module('scotchApp')
  //   .controller('reviewController', ['$scope', function($scope) {

  //     //$scope.text = 'hello';
  //     // $scope.submit = function() {
  //     //   if ($scope.text) {
  //     //     $scope.list.push(this.text);
  //     //     $scope.text = '';
  //     //   }
  //     // };
  //     $scope.addreview = function(){
    
  //  // $scope.gottenreviews.push(reviews);
  //     console.log($scope.reviews1);
  //    var reviewdata = {
  //     review : reviews,
  //     forr: trip_id
  //   };
  //   console.log(reviewdata);
  //   $http.post("/user/reviews", reviewdata).success(function (data){
  //     console.log(data.msg._id);
  //   });
  //             //$scope.inactivebutton = true;
  //   // console.log(personid);
  //  };
  //   }]);
//////////////////////////////////////////////////////////////////////////////////
	angular.module('scotchApp').controller('tripviewController',
  		['$scope', '$location', 'AuthService', '$http', '$routeParams', 'index',
  		function ($scope, $location, AuthService, $http, $routeParams) {
////////////////////////////////////////////////////////////////////////////
//$rootScope.gottenreviews = [];
    // $scope.count = 0;
    // $scope.myFunc = function() {
    //   $scope.count++;
    // };

    $scope.starRating1 = 0;
    // $scope.starRating2 = 5;
    // $scope.starRating3 = 2;
    $scope.hoverRating1 = 0;
    $scope.newrating = null,

    // $scope.click1 = function (param) {
    //     console.log('Click(' + param + ')');
    //     $scope.newrating = param;
    // };

    $scope.mouseHover1 = function (param) {
        console.log('mouseHover(' + param + ')');
        $scope.hoverRating1 = param;
    };

    $scope.mouseLeave1 = function (param) {
        console.log('mouseLeave(' + param + ')');
        $scope.hoverRating1 = param + '*';
    };

   

    
////////////////////////////////////////////////////////////////////////////
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
        console.log($scope.markers[0].title + " --markers");
        $scope.abc = "checkthis";
    }

    var search1 = function(txtAddress) {
        var geocoder = new google.maps.Geocoder();
        var address = txtAddress;
        console.log("add: "+address);
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
                  console.log("lenn- "+cities.length);
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
		console.log("in tripview controller");
		$http.get('/user/trip_data').success(function(data) {
			$http.get('/user/upc_data_all').success(function (data1, status) {
	  			$http.get('/user/getUser').success(function (data2, status) {
            console.log("lllllllllllll");
            console.log(data2);
            console.log(data1);
            console.log("kkkkkkkkkkkkkkkk");
            //console.log("gggg"+data+"kk");
            // if(data2 && $scope.newrating) {
            //   var averagerating = 
            //   $http.post("/user/newrating1", $scope.newrating).success(function (rating1){

            //     console.log(data.msg._id);
            //   });
            // }
            $scope.triprating = [];
            $http.get('/user/getUsers').success(function (data3, status) {
              allusers = data3;
              console.log("jxxxx");
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
                  $scope.triprating = data1[i].rating;
                  // console.log(data1[i].rating[0]);
                  $scope.oldid = data1[i]._id;
                } 
              }
            
              $scope.inactivebutton = false;
            $scope.addItem = function(person){
              $scope.inactivebutton = true;
              console.log("jhgf")
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
              console.log(personid);
             };
              console.log("data1");
		  			console.log(data1);
            console.log("data1");
		  			console.log(data2);
            
			    	$scope.tripviewall = data;
            // console.log($scope.tripviewall);
			    	var tripviewarray = [];
			    	var index1 = 0;
            //var uf = data1.
			    	for (i = 0; i < data1.length; i++) {
              if(data1[i]._id == trip_id) {
                index1 = i;
                tripviewplaces.push(data1[i].Places);
              }
            }

		    		console.log(data1[index1].dataid);
		    		console.log(data2._id);
		    		if (data1[index1].dataid == data2._id) {
             $scope.usertrip = 1;
		    			 console.log("same");
		    		}
            else if(data2._id == null) {
              $scope.usertrip = 2;
            }
			    	console.log("usertrip");
			    	console.log($scope.usertrip);
			    	console.log("usertrip");
			    	for (i = 0; i < $scope.tripviewall.length; i++) {
			    		if ($scope.tripviewall[i].upc == trip_id) {
			    			tripviewarray.push($scope.tripviewall[i]);

			    		}
			    	}
            // $http.get('/user/getreviews/'+trip_id).success(function (getreviews, status) {
            //   console.log(getreviews);
            //   $scope.gottenreviews = getreviews;
            // });
            // $scope.reviews1 = '';
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

            console.log(tripviewarray.length);
            console.log($scope.tripview.length);
            $scope.daynum = $scope.tripview.length+1;
            $scope.daydate = tripviewarray[tripviewarray.length-1].Day;
			    	var tripplacearr = [];
					for (i = 0; i < $scope.tripview.length; i++) {
						if (tripplacearr.indexOf($scope.tripview[i].Place) < 0) {
							tripplacearr.push($scope.tripview[i].Place);
						}
			    }
					console.log(tripplacearr);


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
          console.log(tripviewplaces[0] + "  dddd");
          var size = tripviewplaces[0].length;
          console.log(size);
          for(i=1;i<size-1; i++) {
            var address = tripviewplaces[0][i];
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
            console.log("asd",tripviewarray);
            console.log($scope.tripview);
            if (tripviewarray == $scope.tripview) {
              console.log("same");
            } else {
              console.log("not same");
            }
            // console.log(xx.Act);
          }
          $scope.distancethings1 = [];
          console.log(tripviewplaces[0][0] + "- oooo -"+ tripviewplaces[0][1] + " tripviewplaces " + tripviewplaces[0].length);
          if (tripviewplaces[0].length == 2) {
            console.log("insideee");
            $http.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+tripviewplaces[0][0]+"&destinations="+tripviewplaces[0][1]+"&mode=air&key=AIzaSyCXB9yqyxxgysf1jF1v7Azh4yynfnjemMw").success(function(data) {
              console.log(data);
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

scotchApp.directive('draggable1', function() {
   return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
            element.attr("draggable", true);
            console.log(element);
 
            element.bind("dragstart", function(eventObject) {
                eventObject.dataTransfer.setData("text", attributes.itemid);
            });
        }
    };
});

scotchApp.directive('droppable1', function() {
  return {
        restrict: "A",
        link: function (scope, element, attributes, ctlr) {
 
            element.bind("dragover", function(eventObject){
                eventObject.preventDefault();
                // console.log(element);
            });
 
            element.bind("drop", function(eventObject) {
                scope.moveToBox(eventObject.dataTransfer.getData("text"));
                eventObject.preventDefault();
            });
        }
    };
});

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 angular.module('scotchApp').controller('daycreationController',
      ['$scope', '$location', 'AuthService', '$http', '$routeParams',
      function ($scope, $location, AuthService, $http, $routeParams) {
        ///////////////////////////////////////////////////////////////////////////////////////

      $scope.dayhotelhere = false;
      $scope.moveToBox = function(id) {
        for (ii = 0; ii < $scope.googlehotels1.length; ii++) {     
          console.log($scope.googlehotels1[ii].name + "itsss name");              
          if ($scope.googlehotels1[ii].name == id) {
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
      console.log("tripiddddddddddddddddd----"+trip_id);
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
      };
      $scope.create = function() {
        var data = {Hr : $scope.daypost, Act : $scope.dayact, Place : $scope.user.from, Hotel: $scope.dayhotel};
        $http.post("/user/newdata", data).success(function (data, status, headers){
          alert("task added");
        });
      };
  }]);



















	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	scotchApp.controller('dayviewController', function($scope, $http, $log, $routeParams, $sce) {
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
        	 // console.log(" "); console.log(" "); console.log(" ");  console.log(" "); console.log(" "); console.log(" ");
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

    // var eventcontrollinggoogle2 = function (i, j, dayplacearr, dayhotelarr) {
    //   // console.log(dayhotelarr[i]+ "   ----   "+$scope.googlelist[j].name);
    //   if (($scope.googlelist[j].name.indexOf(dayhotelarr[i]) > -1) || (dayhotelarr[i].indexOf($scope.googlelist[j].name) > -1)) {
    //     console.log(dayhotelarr[i]+ "   ----   "+$scope.googlelist[j].name);
    //     $scope.found = true;
    //     var hotel_rating = $scope.googlelist[j].rating;
    //     $scope.dayview[i]['rating'] = hotel_rating;
    //     var hotel_address = $scope.googlelist[j].formatted_address;
    //     $scope.dayview[i]['address'] = hotel_address;
    //     var photo_id = $scope.googlelist[j].photos[0].photo_reference;
    //     $scope.dayview[i]['hotelinfo'] = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=170&photoreference="+photo_id+"&key=AIzaSyDYX0xuOfEZmiBnWdKSgiMI2D2yIKgVYmY";
    //     retrieved_hotelid = $scope.googlelist[i].place_id;
    //     $http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+retrieved_hotelid+"&key=AIzaSyDYX0xuOfEZmiBnWdKSgiMI2D2yIKgVYmY").success(function(data) {
    //       var deeplink = data.result.website;
    //       if (data.result.website == undefined) {
    //         var deeplink = data.result.url;
    //       }
    //       $scope.dayview[i]['deeplink'] = deeplink; 
    //     })
    //   }
    // }

    // var eventgooglenextpage = function (i, dayplacearr, dayhotelarr, pagetoken) {
    //   console.log("in next page function ------------ "+dayplacearr[i]);
    //   $http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+"+dayplacearr[i]+"&key=AIzaSyDYX0xuOfEZmiBnWdKSgiMI2D2yIKgVYmY&pagetoken="+pagetoken).success(function(data) {
    //       $scope.googlelist = data.results;
    //       $scope.found = false;
    //       for (var j = 0; j < $scope.googlelist.length; j++) {
    //           eventcontrollinggoogle2(i, j, dayplacearr, dayhotelarr);
    //       }
    //       if ($scope.found == false && data.next_page_token != undefined) {
    //         setTimeout(function(){eventgooglenextpage(i, dayplacearr, dayhotelarr, data.next_page_token)},2000);
    //       }
    //   })
    // }

    // var eventcontrollinggoogle = function (i, dayplacearr, dayhotelarr) {
    //   $http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+"+dayplacearr[i]+"&key=AIzaSyDYX0xuOfEZmiBnWdKSgiMI2D2yIKgVYmY").success(function(data) {
    //       $scope.googlelist = data.results;
    //       $scope.found = false;
    //       for (var j = 0; j < $scope.googlelist.length; j++) {
    //           eventcontrollinggoogle2(i, j, dayplacearr, dayhotelarr);
    //       }
    //       if ($scope.found == false && data.next_page_token != undefined) {
    //         console.log("havnt found for -- "+dayhotelarr[i]+" --, going into next");
    //         setTimeout(function(){eventgooglenextpage(i, dayplacearr, dayhotelarr, data.next_page_token)},2000);
    //       }
    //   })
    // }
        

    //   var eventcontrollinggoogle2 = function (i, j, dayplacearr, dayhotelarr) {
    //   // console.log(dayhotelarr[i]+ "   ----   "+$scope.googlelist[j].name);
    //   if (($scope.googlelist[j].name.indexOf(dayhotelarr[i]) > -1) || (dayhotelarr[i].indexOf($scope.googlelist[j].name) > -1)) {
    //     console.log(dayhotelarr[i]+ "   ----   "+$scope.googlelist[j].name);
    //     $scope.found = true;
    //     var hotel_rating = $scope.googlelist[j].rating;
    //     $scope.dayview[i]['rating'] = hotel_rating;
    //     var hotel_address = $scope.googlelist[j].formatted_address;
    //     $scope.dayview[i]['address'] = hotel_address;
    //     var photo_id = $scope.googlelist[j].photos[0].photo_reference;
    //     $scope.dayview[i]['hotelinfo'] = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=170&photoreference="+photo_id+"&key=AIzaSyDYX0xuOfEZmiBnWdKSgiMI2D2yIKgVYmY";
    //     retrieved_hotelid = $scope.googlelist[i].place_id;
    //     $http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+retrieved_hotelid+"&key=AIzaSyDYX0xuOfEZmiBnWdKSgiMI2D2yIKgVYmY").success(function(data) {
    //       var deeplink = data.result.website;
    //       if (data.result.website == undefined) {
    //         var deeplink = data.result.url;
    //       }
    //       $scope.dayview[i]['deeplink'] = deeplink; 
    //     })
    //   }
    // }

    // var eventgooglenextpage = function (i, dayplacearr, dayhotelarr, pagetoken) {
    //   console.log("in next page function ------------ "+dayplacearr[i]);
    //   $http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+"+dayplacearr[i]+"&key=AIzaSyDYX0xuOfEZmiBnWdKSgiMI2D2yIKgVYmY&pagetoken="+pagetoken).success(function(data) {
    //       $scope.googlelist = data.results;
    //       $scope.found = false;
    //       for (var j = 0; j < $scope.googlelist.length; j++) {
    //           eventcontrollinggoogle2(i, j, dayplacearr, dayhotelarr);
    //       }
    //       if ($scope.found == false && data.next_page_token != undefined) {
    //         setTimeout(function(){eventgooglenextpage(i, dayplacearr, dayhotelarr, data.next_page_token)},2000);
    //       }
    //   })
    // }

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
    	$scope.dayview = dayviewarray;
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
      // !!!!!!~~~~~~~ EXPEDIA API CALL ~~~~~~~!!!!!!
			// for (i = 0; i < dayallplacearr.length; i++) {
			// 	eventcontrolling(i, dayallplacearr, dayallhotelarr);
			// }

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

















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	scotchApp.controller('contactController', function($scope) {
		$scope.contact = 'Contact us! JK. This is just a demo.';
	});