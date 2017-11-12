angular.module('todolist.ctrl', [])
  .controller('TodolistCtrl', function ($scope, $stateParams, guidesrv, clientsrv, $state) {

    console.log($stateParams.insId);

    $scope.dateToday = new Date();
    $scope.addNewNote = {
      ActivityID: '',
      ActivityDate: moment().format('YYYY-MM-DD'),
      // StaffID: $scope.staff.StaffId,
      InstitutionID: $stateParams.insId,
      Notes: '',
      DeadlineDisplay: $scope.dateToday,
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
    $scope.getToDOList = function () {
      guidesrv.gettodo($stateParams.insId).then(function (data) {
        $scope.todoList = data;
        console.log($scope.todoList);
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getToDOList();
      $scope.getToDoInit();
    };
    $scope.init();


    //加文本信息
    $scope.addNote = function () {
      if ($scope.addNewNote.Notes !== '') {
        console.log($scope.addNewNote);
        guidesrv.savetodo($scope.addNewNote).then(function () {
          $scope.popup("操作成功");
        });

        $scope.getToDOList();
        // $scope.addNewNote.Notes = '';
      }
      else {
        var myPopup = $ionicPopup.show({
          template: '<input type="password" ng-model="data.wifi">',
          title: 'Enter Wi-Fi Password',
          subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.wifi) {
                  //不允许用户关闭，除非他键入wifi密码
                  e.preventDefault();
                } else {
                  return $scope.data.wifi;
                }
              }
            },
          ]
        });

      }
    };
    //加声音
    $scope.addSound = function () {

    };

    $scope.deleteToDo = function () {
      guidesrv.detetetodo($scope.todoList).then(function () {
        $scope.getToDOList();
        $scope.popup("操作成功");
      });
    };

    $scope.nextStep = function () {
      $state.go("main.calloverview", {insId: $stateParams.insId});
    }
  });
