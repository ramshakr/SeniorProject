// angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

// 	$routeProvider

// 		// home page
// 		.when('/', {
// 			templateUrl: 'views/home.html',
// 			controller: 'MainController'
// 		})

// 		.when('/nerds', {
// 			templateUrl: 'views/nerd.html',
// 			controller: 'NerdController'
// 		})

// 		.when('/geeks', {
// 			templateUrl: 'views/geek.html',
// 			controller: 'GeekController'	
// 		});

// 	$locationProvider.html5Mode(true);

// }]);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

var scotchApp = angular.module('appRoutes', ['ngRoute']);
	scotchApp.value('index', 0);
	scotchApp.config(function ($routeProvider) {
		if (window.location.hash === '#_=_') {
  			window.location.hash = '';
		}
		$routeProvider

			.when('/', {
				templateUrl : 'views/upc.html',
				controller  : 'upcController',
				resolve: {
        			loggedin: checkLoggedin
      			}
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