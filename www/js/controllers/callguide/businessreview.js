angular.module('businessreview.ctrl', ['guide.srv', 'client.srv'])

  .controller('BusinessreviewCtrl', function ($scope, guidesrv, clientsrv, $stateParams) {
    $scope.insID = $stateParams.insId;
    $scope.staffID = $stateParams.staffId;
    console.log($scope.insID);
    console.log($scope.staffID);


    clientsrv.getclients($scope.insID).then(function (clients) {
      guidesrv.getkareviews(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (reviews) {
        for(var i=0;i<clients.length;i++){
          clients[i].selected=false;

          for(var j=0;j<reviews.length;j++){
            for(var k =0;k<reviews[j].ReviewTarget.length;k++){
              if(reviews[j].ReviewTarget[k]==clients[i].ClientID){
                clients[i].selected=true;
              }
            }
          }

          if(i==clients.length-1)
          {
            $scope.clientOptions = clients;
            console.log(clients);
          }
        }
      });

    });


    //初始没选PPT
    $scope.hasPPT = false;
    $scope.changeCheckPPT = function () {
      $scope.hasPPT = !$scope.hasPPT;

    };

    $scope.isFocus = false;
    $scope.dateToday = moment();
    //获取当日填写过的生意回顾
    $scope.getKAReviews = function () {
      guidesrv.getkareviews($scope.dateToday.format('YYYY-MM-DD'), $scope.insID).then(function (data) {
        $scope.reviews = data;
        $scope.reviewTargetList = $scope.reviews.ReviewTarget;
        console.log($scope.reviews)
      });

      //获取客户



    };

    $scope.switchChecked = function () {

    };

    //保存生意回顾
    $scope.saveReview=function () {
      var model ={
        "ActivityDate": "sample string 1",
        "StaffID": $scope.staffID,
        "InstitutionID": "sample string 3",
        "ReviewTarget": [
          "sample string 1",
          "sample string 2"
        ],
        "ReviewTargetCount": 4,
        "HasPPT": true,
        "Others": [
          "sample string 1",
          "sample string 2"
        ]
      };
      guidesrv.savekareview(model).then(function () {
        $scope.popup("操作成功");
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getKAReviews();
    };
    $scope.init();
    //生意回顾页面数据
    $scope.businessReview={
      otherMember:''
    };

    $scope.otherMember = '';
    $scope.clearInput = function () {
      $scope.otherMember = '';
    };
    $scope.otherList = [];
    // 手动添加
    $scope.addOtherMember = function (itemName) {
      if($scope.businessReview.otherMember!=''){
        console.log($scope.businessReview.otherMember);
      }
    };
  });
