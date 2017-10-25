angular.module('editroute.ctrl', [])
  .controller('EditRouteCtrl', function ($scope) {

    $scope.data = {
      showDelete: true,
      showReorder:false
    };
//模拟列表数据
    $scope.editList=[];
    for(var i=0;i<100;i++){
      $scope.editList.push({
        title:'xx大药房'
      })
    }

    //列表排序
    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.items.splice(fromIndex, 1);
      $scope.items.splice(toIndex, 0, item);
    };
    //删除项目
    $scope.onItemDelete = function(item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    };
  });
