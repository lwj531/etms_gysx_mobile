angular.module('editroute.ctrl', [])
  .controller('EditRouteCtrl', function ($scope) {

    $scope.data = {
      showDelete: true,
      showReorder:true
    };
//模拟列表数据
    $scope.editList=[];
    for(var i=0;i<5;i++){
      $scope.editList.push({
        title:'xx大药房xx大药房xx大药房xx大xxx房大药房xx大药房',
        address:'xxxxxxxxx',
        id:Math.floor(Math.random()*(10000+1))
      })
    }

    //列表排序
    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.editList.splice(fromIndex, 1);
      $scope.editList.splice(toIndex, 0, item);
    };
    //删除项目
    $scope.onItemDelete = function(item) {
      $scope.editList.splice($scope.editList.indexOf(item), 1);
    };
  });
