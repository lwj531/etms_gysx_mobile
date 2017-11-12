angular.module('todolist.ctrl', [])
  .controller('TodolistCtrl', function ($scope, $stateParams, guidesrv, clientsrv, $state, $ionicPopup) {

    console.log($stateParams.insId);
    //初始化deadline
    $scope.dateToday = new Date();
    $scope.addNewNote = {
      ActivityID: '',
      ActivityDate: moment().format('YYYY-MM-DD'),
      InstitutionID: $stateParams.insId,
      Notes: '',
      // DeadlineDisplay: $scope.dateToday,
      Deadline: moment($scope.dateToday).format('YYYY-MM-DD'),
      FinishStatus: "ACTIVE",
      Recording: "sample string 8",
      RecordingUrl: "sample string 9"
    };
    $scope.getToDoInit = function () {
      clientsrv.getcurrentstaff().then(function (staff) {
        //当前人员的信息
        $scope.staff = staff;
        console.log($scope.staff);
        $scope.addNewNote.StaffID = $scope.staff.StaffId;
      });
    };
    //获取顶部机构信息
    clientsrv.getins($stateParams.insId).then(function (data) {
      $scope.currentIns = data;
      console.log($scope.currentIns.InstitutionName + $scope.currentIns.InstitutionPriority + $scope.currentIns.Address);
      //机构左侧图标
      switch ($scope.currentIns.InstitutionPriority) {
        case "A":
          $scope.inslevelflag = "uicon-markerA";
          break;
        case "B":
          $scope.inslevelflag = "uicon-markerB";
          break;
        case "C":
          $scope.inslevelflag = "uicon-markerC";
          break;
        default:
          $scope.inslevelflag = "uicon-markerA";
      }

    });
    //获取todo列表
    $scope.getToDOList = function () {
      guidesrv.gettodo($stateParams.insId).then(function (data) {
        $scope.todoList = data;
        for (var i = 0; i < data.length; i++) {
          $scope.todoList[i].deadlineDisplay = new Date(data[i].Deadline);
        }
        console.log($scope.todoList);
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getToDOList();
      $scope.getToDoInit();
    };
    $scope.init();
    //没输入内容就点保存
    $scope.showAlert = function () {
      var voidPopup = $ionicPopup.show({
        cssClass: 'user-alert',
        title: '提示',
        template: '请填写内容后再保存',
        scope: $scope,
        buttons: [
          {
            text: '好的',
            type: 'button-alert button-clear button-positive',
            onTap: function () {
              voidPopup.close();
            }
          }
        ]
      });
    };

    //监视deadline
    var count=1;
    var unbindWatch=$scope.$watch('todoList',function(){
      console.log('todoList changed');
      count++;
      //相当于在todoList变化了4次之后，就调用unbingWatch()取消这个watch
      //在第5次todoList改变的时候,就不会输出todoList change了。
      if(count>4){
        unbindWatch();
      }
    },true);

    //确认是否删除的弹框
    $scope.showDelAlert = function (activityId) {
      var deletePopup = $ionicPopup.show({
        cssClass: 'user-alert',
        title: '提示',
        template: '是否确定删除该条',
        scope: $scope,
        buttons: [
          {
            text: '取消',
            type: 'button-alert button-clear button-stable',
            onTap: function () {
              deletePopup.close();
            }
          },
          {
            text: '确定',
            type: 'button-alert button-clear button-positive',
            onTap: function () {
              guidesrv.detetetodo(activityId).then(function () {
                deletePopup.close();
                $scope.popup("操作成功");
                $scope.getToDOList();
              });
            }
          }
        ]
      });
    };
    //加文本信息
    $scope.addNote = function () {
      if ($scope.addNewNote.Notes !== '') {
        console.log($scope.addNewNote);
        guidesrv.savetodo($scope.addNewNote).then(function () {
          $scope.popup("操作成功");
          $scope.getToDOList();
          $scope.addNewNote.Notes = '';
        });

      }
      else {
        $scope.showAlert();
      }
    };
    //加声音
    $scope.addSound = function () {

    };
    //删除一条记录
    $scope.deleteToDo = function (activityId) {
      $scope.showDelAlert(activityId);
    };
    //下一步
    $scope.nextStep = function () {
      $state.go("main.calloverview", {insId: $stateParams.insId});
    }
  });
