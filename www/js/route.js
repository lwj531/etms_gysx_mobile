//js文件分离
angular.module('route', [
  //控制器
  'account.ctrl',
  "main.ctrl",
  "home.ctrl",
  "msgcenter.ctrl",
  'car.ctrl',
  'routesetting.ctrl',
  'callguide.ctrl',
  'dailymgt.ctrl',
  'clientmgt.ctrl',
  'insdetail.ctrl',
  'skusort.ctrl',
  'schedulemgt.ctrl',
  'editroute.ctrl',
  'planreport.ctrl',
  'storemodify.ctrl',
  'learningindex.ctrl',
  'materialexpand.ctrl',
  'pointsrank.ctrl',
  'exercisehistory.ctrl',
  'diseaseknowledge.ctrl',
  'vitalityeducation.ctrl',
  'tutorialindex.ctrl',
  'callprocedure.ctrl',
  //service
  'account.srv',
  'car.srv',
  'http.srv',
  'routesetting.srv',
  'client.srv',
  'daily.srv',
  //directive 指令
  'amap.dt',
  'toast.dt'
]);

