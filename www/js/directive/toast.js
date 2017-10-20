angular.module('toast.dt', [])
  .directive("toast", function ($rootScope) {
    return {
      restrict: "E",
      replace: true,
      template: "<div class='msdtoast animated' ng-class='{fadeIn:showtoast}' ng-show='showtoast'>" +
      "<div class='toast-inner'><span ng-bind='message'></span></div>" +
      "</div>"
    };
  })
