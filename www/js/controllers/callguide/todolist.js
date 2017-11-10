angular.module('todolist.ctrl', [])
  .controller('TodolistCtrl', function($scope, $stateParams,guidesrv,clientsrv,$state) {

    console.log($stateParams.insId);
    console.log($stateParams.staffId);

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

    guidesrv.gettodo().then(function (data) {
      $scope.todoList = data;
      console.log($scope.todoList);
    });

    $scope.todayToDo=[];

    $scope.addNewToDo={
      note:''
    };


    //加文本信息
    $scope.addNote=function () {
      $scope.todayToDo.push({
        ActivityID:'',
        ActivityDate: moment().format('YYYY/MM/DD'),
        StaffID: $stateParams.staffId,
        InstitutionID: $stateParams.insId,
        Notes: $scope.addNewToDo.note,
        Deadline: new Date(),
        FinishStatus: "ACTIVE",
        Recording: '',
        RecordingUrl:''
      });
      $scope.addNewToDo.note='';
    };
    //加声音 假的
    $scope.addSound=function () {
      $scope.todayToDo.push({
        ActivityID:'',
        ActivityDate: moment().format('YYYY/MM/DD'),
        StaffID: $stateParams.staffId,
        InstitutionID: $stateParams.insId,
        Deadline: new Date(),
        FinishStatus: "ACTIVE",
        Notes: '',
        Recording: 'string sound url',
        RecordingUrl:'string sound url'
      });
    };


    $scope.saveToDo=function () {
      guidesrv.savetodo(model).then(function () {
        $scope.popup("操作成功");
        console.log();

        // $state.go("main.calldetails",{insId:$stateParams.insId});
      });
    }

  });
