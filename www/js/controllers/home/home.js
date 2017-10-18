angular.module('home.ctrl', ['car.srv'])
  .controller('HomeCtrl', function ($scope, $state, carsrv, $ionicModal,$ionicPopup,$ionicHistory) {
    //清除登陆页面的历史纪录
    $ionicHistory.clearHistory();

    $scope.carinfo = function () {
      carsrv.carinfo().then(function (data) {
        $scope.cars = data;
      });
    };
    $scope.loginout=function(){
      localStorage.clear();
    };

    $ionicModal.fromTemplateUrl('/templates/home/sendMsgModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalSendMsg = modal;
    });
    $scope.openModal = function() {
      $scope.modalSendMsg.show();
    };
    $scope.closeModal = function() {
      $scope.modalSendMsg.hide();
    };
    // //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
      $scope.modalSendMsg.remove();
    });
    // // 当隐藏的模型时执行动作
    // $scope.$on('modal.hide', function() {
    //   // 执行动作
    // });
    // // 当移动模型时执行动作
    // $scope.$on('modal.removed', function() {
    //   // 执行动作
    // });

    $scope.reciever=[];
    for(var i=0;i<100;i++){
      $scope.reciever.push({name:''});
    }
    $scope.homeMsgList=[];
    for (var i = 0; i < 3; i++) {
      $scope.homeMsgList.push(
        {title: '消息title消息title消息title消息title', sendTime: '2017-12-12  09:20:20'}
      );
    }
    $scope.onFocus=false;

    $scope.msgPopup = function() {
      $scope.msgDetail='撒谎机顶盒电视和大家好的系啊是的\nshudh是打开的哈的规划大纲';
      var msgPopup = $ionicPopup.show({
        cssClass:'msg-alert',
        template: '<div class="list-item multi-line no-line msg-title">\n' +
        '  <div class="item-content align-top"">\n' +
        '    <div class="item-media"><span class="list-dot"></span></div>\n' +
        '    <div class="item-inner">\n' +
        '      <div class="item-title-row">\n' +
        '        <div class="item-title">消息title</div>\n' +
        '      </div>\n' +
        '      <div class="item-text">2017-02-02  09:02:03</div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n' +
        '<div class="padding">'+ $scope.msgDetail +'</div>',
        title: '消息详情',
        scope: $scope,
        buttons: [
          {
            text: '<b>关闭</b>',
            type: 'button-alert button-clear button-positive',
            onTap: function (e) {
              //不允许用户关闭
              //e.preventDefault();
            }
          },
        ]
      });
      msgPopup.then(function (res) {
        console.log('Tapped!', res);
      });
      // $timeout(function() {
      //   myPopup.close(); //close the popup after 3 seconds for some reason
      // }, 3000);
    };


  });
