var mwcs = angular.module('mwcsApp', []);

mwcs.controller('demoCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.availables = [];
  $scope.wageObject = {};
  $http.get('/wages')
    .success(function(data, status, headers, config) {
      $scope.availables = data;
    })
    .error(function(data, status, headers, config) {

    });

  $scope.getWages = function(month) {
    var mo = month.split('/')[1];
    var y = month.split('/')[0];
    $http.get('/wages/'+y+'/'+mo)
      .success(function(data, status, headers, config) {
        console.log(data);
        $scope.wageObject = data;
      })
      .error(function(data, status, headers, config) {

      });
  }

}]);