angular.module('main.ctrl', [])
  .controller('MainCtrl', function ($scope,$state,$ionicSideMenuDelegate) {
    //模拟菜单数据
    $scope.menus = [{
      name:" 首页",
      iconName:"home",
      state:"main.home"
    },
      {
      name:" 日程管理",
      iconName:"dailymgt",
      state:"main.dailymgt"
    },
      {
      name:"拜访向导",
      iconName:"callguide",
      state:"main.callguide"
    },
      {
      name:"路线设定",
      iconName:"routesetting",
      state:"main.routesetting"
    }];
    $scope.currentstate = $state;
  });
