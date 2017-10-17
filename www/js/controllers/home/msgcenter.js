angular.module('msgcenter.ctrl', [])
  .controller('MsgcenterCtrl', function ($scope) {
    $scope.msgList = [];
    for (var i = 0; i < 17; i++) {
      $scope.msgList.push({title: '消息标题息标题消息标题消息标题息标题消息标题消息标题息标题消息标题', from: '发布人', sendTime: '2017-12-12'});
    }

  });
