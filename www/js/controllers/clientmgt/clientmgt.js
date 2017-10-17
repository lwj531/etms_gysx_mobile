angular.module('clientmgt.ctrl', [])
  .controller('ClientMgtCtrl', function ($scope) {
   $scope.clientList=[];
   for(var i=0;i<30;i++){
     $scope.clientList.push(
       {name:'北京xxxxxxxxxxxxxx大药房(A)',address:'北京xxxxxxxxxxxxxx街1号',icon:'A'},
       {name:'北京xxxxx大药房(B)',address:'北京xxxxxxxxxx街1号',icon:'B'},
       {name:'北京xxxxxxxx大药房(C)',address:'北京xxxxx街1号',icon:'C'}
     )
   }

  });
