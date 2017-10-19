angular.module('toast.dt', [])
  .directive("toast", function ($rootScope) {
    return {
      restrict: "E",
      replace: true,
      template: "<div class='msdtoast' ng-show='showtoast'>" +
      "<div class='toast-inner animated fadeIn'><span ng-bind='message'></span></div>" +
      "</div>"
    };
  })
