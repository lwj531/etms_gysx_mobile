//js文件分离
angular.module('route', [
  //控制器
  'account.ctrl',
  "main.ctrl",
  "home.ctrl",
  'car.ctrl',
  'routesetting.ctrl',
  'callguide.ctrl',
  //service
  'account.srv',
  'car.srv',
  'routesetting.srv'
]);

