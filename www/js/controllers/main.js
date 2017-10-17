angular.module('main.ctrl', [])
  .controller('MainCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
    //模拟菜单数据
    $scope.menus = [{
      name: " 首页",
      iconName: "home",
      state: "main.home"
    },
      {
        name: "辅导下属",
        iconName: "coaching",
        state: "main.xx"
      },
      {
        name: "拜访向导",
        iconName: "callguide",
        state: "main.callguide"
      },
      {
        name: "路线设定",
        iconName: "routesetting",
        state: "main.routesetting"
      },
      {
        name: " 日程管理",
        iconName: "dailymgt",
        state: "main.dailymgt"
      },
      {
        name: " 客户管理",
        iconName: "clientmgt",
        state: "main.clientmgt"
      },
      {
        name: " 附近药店",
        iconName: "dailymgt",
        state: "main.xx"
      },
      {
        name: "辅导记录",
        iconName: "guidance",
        state: "main.xx"
      },
      {
        name: " 学习资料库",
        iconName: "db",
        state: "main.xx"
      }];
    $scope.currentstate = $state;
  });
