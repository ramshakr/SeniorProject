angular.module('AuthService', []).factory('AuthService',
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