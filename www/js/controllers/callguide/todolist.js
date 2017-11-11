angular.module('todolist.ctrl', [])
  .controller('TodolistCtrl', function ($scope, $stateParams, guidesrv, clientsrv,$state) {

    console.log($stateParams.insId);

    clientsrv.getcurrentstaff().then(function (staff) {
      //当前人员的信息
      $scope.staff = staff;
      console.log($scope.staff);
    });

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
      guidesrv.gettodo().then(function (data) {
        $scope.todoList = data;
        console.log($scope.todoList);
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getToDOList();
    };
    $scope.init();
    // $scope.todayToDo=[];

    $scope.dateToday=new Date();
    $scope.addNewNote = {
      ActivityID: '',
      ActivityDate: moment().format('YYYY-MM-DD'),
      StaffID: $scope.staff.staffId,
      InstitutionID: $stateParams.insId,
      Notes: '',
      DeadlineDisplay: $scope.dateToday,
      Deadline: moment($scope.dateToday).format('YYYY-MM-DD'),
      FinishStatus: "ACTIVE"
    };

    //加文本信息
    $scope.addNote = function () {
      console.log($scope.addNewNote);
      guidesrv.savetodo($scope.addNewNote).then(function () {
        $scope.isPost = true;
        $scope.popup("操作成功");
      });
      $scope.getToDOList();
      $scope.isPost = false;
      // $scope.addNewNote.Notes = '';
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

    $scope.saveToDo = function (id) {
      guidesrv.savetodo(id).then(function () {
        $scope.popup("操作成功");
        $scope.getToDOList();

      });
    };

    $scope.nextStep=function () {
      $state.go("main.calloverview",{insId:$stateParams.insId});
    }
  });
