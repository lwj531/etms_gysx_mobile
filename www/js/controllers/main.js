angular.module('main.ctrl', [])
  .controller('MainCtrl', function ($scope,$ionicSideMenuDelegate) {
    //模拟菜单数据
    $scope.menus = [{
      name:" 首页",
      state:"main.home"
    },{
      name:" 日程管理",
      state:"main.dailymgt"
    },{
      name:"拜访向导",
      state:"main.callguide"
    }];
  });
