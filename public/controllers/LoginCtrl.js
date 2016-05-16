angular.module('LoginCtrl', []).controller('loginController',
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
    
    // console.log(AuthService.getUserStatus());
    index = 0;
    $scope.login = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
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