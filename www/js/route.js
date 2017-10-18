//js文件分离
angular.module('route', [
  //控制器
  'account.ctrl',
  "main.ctrl",
  "home.ctrl",
  "msgcenter.ctrl",
  'car.ctrl',
  'callguide.ctrl',
  'dailymgt.ctrl',
  'clientmgt.ctrl',
  'insdetail.ctrl',
  'clientedit.ctrl',
  //service
  'account.srv',
  'car.srv',
  'http.srv',

]);

