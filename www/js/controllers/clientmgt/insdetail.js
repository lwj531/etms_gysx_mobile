angular.module('insdetail.ctrl', [])
  .controller('InsDetailCtrl', function ($scope,$ionicBackdrop) {
$scope.terminalList=[];
$scope.memberList=[];
for(var i=0;i<20;i++){
  $scope.terminalList.push({name:'xxxxxxxxxxxxxx大药房',icon:'A',address:'xx路xx街12号'},{name:'xxxxxxx大药房',icon:'B',address:'xxxxx路xxx街12号'},{name:'xxxxxxxxxxxxx大药房',icon:'C',address:'xx路xx街12号'});
  $scope.memberList.push({name:'王思聪',gender:'m',job:'职务',tel:'13234940596',lock:true},{name:'王思聪',gender:'m',job:'职务',tel:'13234940596',lock:false},{name:'王思聪',gender:'f',job:'职务',tel:'13234940596',lock:false},{name:'王思聪',gender:'f',job:'职务',tel:'13234940596',lock:true});
}
    $scope.action = function() {
      $ionicBackdrop.retain();
      // $timeout(function() {
      //   $ionicBackdrop.release();
      // }, 1000);
    };

    // Execute action on backdrop disappearing
    $scope.$on('backdrop.hidden', function() {
      // Execute action
    });

    // Execute action on backdrop appearing
    $scope.$on('backdrop.shown', function() {
      // Execute action
    });
});
